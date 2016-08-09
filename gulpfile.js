var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var header = require('gulp-header');
var fileImports = require('gulp-imports');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
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

var pkg = require('./package.json');
var reporter = 'list';
var args = require('yargs').argv;

var browserified = function() {
  return transform(function(filename) {
    return browserify(filename).bundle();
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
];

gulp.task('default', ['test-and-build-all', 'copy_footwork_styles_to_build']);

// Testing tasks
gulp.task('tests', ['tests-with-coverage']);

gulp.task('test-and-build-all', ['tests-with-coverage', 'build-everything']);

gulp.task('tests-with-coverage', ['build_ci'], function(done) {
  return new Server(_.extend(require('./tests/karma.conf.js'), require('./tests/karma-coverage.conf.js')), done).start();
});

gulp.task('unit', ['tests-with-coverage'], function () {
  return gulp.src('./build/coverage/report-lcov/lcov.info')
    .pipe(coveralls());
});

gulp.task('sauce', ['build_ci'], function(done) {
  return new Server(_.extend(require('./tests/karma.conf.js'), require('./tests/sauce-config/karma.conf.js')), done).start();
});

gulp.task('watch', function () {
  gulp.watch(['tests/**/*.*', 'source/**/*.*'], ['tests']);
});

gulp.task('watch-everything', function () {
  gulp.watch(['tests/**/*.*', 'source/**/*.*'], ['test-and-build-all']);
});

// Building tasks
gulp.task('build-everything', ['build_ci', 'build_all', 'build_all_with_history', 'build_bare_jquery', 'build_bare_reqwest', 'copy_footwork_styles_to_build']);

gulp.task('build_all_with_history', ['build_core'], function() {
  return buildRelease('all-history');
});

gulp.task('build_all', ['build_core'], function() {
  return buildRelease('all');
});

gulp.task('build_bare_jquery', ['build_core'], function() {
  return buildRelease('bare-jquery');
});

gulp.task('build_ci', ['build_core'], function() {
  return buildRelease('ci');
});

gulp.task('build_bare_reqwest', ['build_core'], function() {
  return buildRelease('bare-reqwest');
});

gulp.task('build_core', ['lodash_custom'], function() {
  return buildRelease('core');
});

gulp.task('dist_footwork_styles', ['copy_footwork_styles_to_build'], function() {
  gulp.src(['./build/styles/*.scss', './build/styles/*.css'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist_build', function() {
  gulp.src(['./build/footwork-*.js', '!./build/footwork-core.js', '!./build/footwork-ci.js', '!./build/lodash-custom.js'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist', function(done) {
  runSequence('build-everything', ['dist_build', 'dist_footwork_styles'], done);
});

gulp.task('copy_footwork_styles_to_build', ['build_footwork_css'], function() {
  gulp.src(['./source/footwork.scss'])
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('build_footwork_css', function() {
  return gulp.src('./source/footwork.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 5%', 'Firefox > 3', 'ie >= 9']
    }))
    .pipe(gulp.dest('./build/styles'));
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

gulp.task('lodash_custom', function () {
  return gulp.src('./source/build-profile/tools/lodash-custom.js')
    .pipe(browserified())
    .pipe(rename('lodash-custom.js'))
    .pipe(gulp.dest('./build'));
});

function buildRelease(buildProfile) {
  var headerBanner = banner.slice(0).join('\n');
  var pkgData = pkg;

  var buildFileName = 'footwork-' + buildProfile + '.js';
  var minBuildFileName = 'footwork-' + buildProfile + '.min.js';

  var fileSize = size({ title: buildFileName });
  var fileSizeMin = size({ title: minBuildFileName });
  var fileSizeGzip = size({ gzip: true, title: minBuildFileName });

  pkgData = _.extend({}, pkg, { version: pkg.version + '-' + buildProfile });
  var stream = gulp
    .src(['source/build-profile/' + buildProfile + '.js'])
    .pipe(header(headerBanner, { pkg: pkgData }))
    .pipe(fileImports())
    .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
    .pipe(rename(buildFileName))
    .pipe(fileSize)
    .pipe(gulp.dest('build/'));

  if(['core', 'ci'].indexOf(buildProfile) === -1) {
    stream.pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(headerBanner, { pkg: pkgData }))
    .pipe(rename(minBuildFileName))
    .pipe(fileSizeMin)
    .pipe(fileSizeGzip)
    .pipe(gulp.dest('build/'));
  }

  return stream;
};
