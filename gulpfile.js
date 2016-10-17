var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var chalk = require('chalk');
var bump = require('gulp-bump');
var size = require('gulp-size');
var replace = require('gulp-replace');
var coveralls = require('gulp-coveralls');
var Server = require('karma').Server;
var _ = require('lodash');
var fs = require('fs');
var sass = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');
var derequire = require('gulp-derequire');
var plumber = require('gulp-plumber');

var pkg = require('./package.json');
var reporter = 'list';
var args = require('yargs').argv;

var autoprefixOptions = {
  browsers: ['last 3 versions', '> 5%', 'Firefox > 3', 'ie >= 9']
};

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
].join('\n');

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
    .pipe(plumber())
    .pipe(browserified({
      standalone: 'footwork',
      debug: args.hasOwnProperty("debug")
    }))
    .pipe(derequire())
    .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
    .pipe(replace('.footwork=', '.fw=')) // Replace the globals export reference with 'fw' but leave module (CommonJS/AMD) names as 'footwork'
    .pipe(header(banner, { pkg: pkg }))
    .pipe(fileSize)
    .pipe(gulp.dest('./build'));
});

gulp.task('minify', ['build'], function() {
  console.log(chalk.yellow('Please wait, minification can take a few minutes (See: ') + chalk.white('https://github.com/knockout/knockout/issues/1652') + chalk.yellow(')'));

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

gulp.task('dist', ['minify'], function() {
  return gulp.src(['./build/footwork.js', './build/footwork.min.js', './build/styles/*.scss', './build/styles/*.css'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('build_ci_css', function() {
  return gulp.src(['./tests/assets/test.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoprefixOptions))
    .pipe(gulp.dest('./tests/assets'));
});

gulp.task('build_footwork_css', function() {
  return gulp.src('./source/footwork.scss')
    .pipe(plumber())
    .pipe(gulp.dest('./build/styles'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoprefixOptions))
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('watch', function () {
  gulp.watch(['tests/**/*.*', 'source/**/*.*'], ['tests']);
});

gulp.task('set_version', function() {
  return gulp.src(['./package.json'])
    .pipe(bump({ version: args.ver || pkg.version }))
    .pipe(gulp.dest('./'));
});
