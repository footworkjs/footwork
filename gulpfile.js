var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var header = require('gulp-header');
var fileImports = require('gulp-imports');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var chalk = require('chalk');
var bump = require('gulp-bump');
var size = require('gulp-size');
var replace = require('gulp-replace');
var coveralls = require('gulp-coveralls');
var Server = require('karma').Server;
var _ = require('lodash');
var runSequence = require('run-sequence');
var fs = require('fs');
var sass = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');
var derequire = require('gulp-derequire');

var pkg = require('./package.json');
var reporter = 'list';
var args = require('yargs').argv;

var browserified = function(options) {
  options = options || {};
  return transform(function(filename) {
    return browserify(filename, options).bundle();
  });
};

var banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * Author: <%= pkg.author %>',
  ' * Version: v<%= pkg.version %>',
  ' * Url: <%= pkg.homepage %>',
  ' * License(s): <% pkg.licenses.forEach(function( license, idx ){ %><%= license.type %><% if(idx !== pkg.licenses.length-1) { %>, <% } %><% }); %>',
  ' */',
  '', ''
].slice(0).join('\n');

gulp.task('default', ['build']);

// Testing tasks
gulp.task('tests', ['build'], function(done) {
  return new Server(_.extend(require('./tests/karma.conf.js'), require('./tests/karma-coverage.conf.js')), done).start();
});

gulp.task('sauce', ['build'], function(done) {
  return new Server(_.extend(require('./tests/karma.conf.js'), require('./tests/sauce-config/karma.conf.js')), done).start();
});

gulp.task('unit', ['tests'], function () {
  return gulp.src('./build/coverage/report-lcov/lcov.info')
    .pipe(coveralls());
});

// Building tasks
gulp.task('build', ['build_footwork_css', 'build_ci_css'], function () {
  var fileSize = size({ title: 'footwork.js' });

  return gulp.src('./source/footwork.js')
    .pipe(browserified({
      standalone: 'footwork',
      debug: args.hasOwnProperty("debug")
    }))
    .pipe(derequire())
    .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
    .pipe(replace('.footwork=', '.fw=')) // Replace the globals reference with 'fw' but leave module references as 'footwork'
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename('footwork.js'))
    .pipe(fileSize)
    .pipe(gulp.dest('./build'));
});

gulp.task('build_min', ['build'], function() {
  console.log(chalk.yellow('Sit tight, minification can take a few minutes (See: ') + chalk.white('https://github.com/knockout/knockout/issues/1652') + chalk.yellow(')'));

  var fileSizeMin = size({ title: 'footwork.min.js' });
  var fileSizeGzip = size({ gzip: true, title: 'footwork.min.js' });

  return gulp.src('./build/footwork.js')
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename('footwork.min.js'))
    .pipe(fileSizeMin)
    .pipe(fileSizeGzip)
    .pipe(gulp.dest('build/'));
});

gulp.task('dist', ['build_min'], function() {
  return gulp.src(['./build/footwork.js', './build/footwork.min.js', './build/styles/*.scss', './build/styles/*.css'])
    .pipe(gulp.dest('./dist'));
});


gulp.task('build_ci_css', function() {
  return gulp.src(['./tests/assets/test.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 5%', 'Firefox > 3', 'ie >= 9']
    }))
    .pipe(gulp.dest('./tests/assets'));
});

gulp.task('build_footwork_css', function() {
  return gulp.src('./source/footwork.scss')
    .pipe(gulp.dest('./build/styles'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 5%', 'Firefox > 3', 'ie >= 9']
    }))
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('watch', function () {
  gulp.watch(['tests/**/*.*', 'source/**/*.*'], ['build']);
});

gulp.task('set_version', function() {
  var version = pkg.version;
  if(typeof args.ver !== 'undefined') {
    version = args.ver;
    pkg.version = version;
  }

  return gulp.src(['./package.json'])
    .pipe(bump({ version: version }))
    .pipe(gulp.dest('./'));
});
