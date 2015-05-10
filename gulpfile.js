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
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var moment = require('moment');
var _ = require('lodash');
var runSequence = require('run-sequence');
var fs = require('fs');

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

var rawBanner = [
  '// footwork.js',
  '// ----------------------------------',
  '// v<%= pkg.version %>',
  '//',
  '// Copyright (c)2014 <%= pkg.author %>.',
  '// Distributed under <% pkg.licenses.forEach(function( license, idx ){ %><%= license.type %><% if(idx !== pkg.licenses.length-1) { %>, <% } %><% }); %> license',
  '//',
  '// <%= pkg.homepage %>',
  '', ''
];

function buildRelease(buildProfile) {
  var headerBanner = banner.slice(0).join('\n');
  var pkgData = pkg;

  if(buildProfile === 'raw') {
    headerBanner = headerBanner + rawBanner.join("\n");
  } else {
    pkgData = _.extend({}, pkg, { version: pkg.version + '-' + buildProfile });
  }

  return gulp
    .src(['source/build-profile/' + buildProfile + '.js'])
    .pipe(header(headerBanner, { pkg: pkgData }))
    .pipe(fileImports())
    .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
    .pipe(rename('footwork-' + buildProfile + '.js'))
    .pipe(size({ title: '[' + buildProfile + '] Unminified' }))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(headerBanner, { pkg: pkgData }))
    .pipe(rename('footwork-' + buildProfile + '.min.js'))
    .pipe(size({ title: '[' + buildProfile + '] Minified' }))
    .pipe(size({ title: '[' + buildProfile + '] Minified', gzip: true }))
    .pipe(gulp.dest('dist/'));
};

gulp.task('default', ['build-and-test']);

// Testing tasks
gulp.task('ci', ['test_bare']);

gulp.task('build-and-test', ['build-everything', 'test_all', 'test_minimal', 'test_bare']);

gulp.task('test_all', ['build_all'], function() {
  return gulp
    .src('spec/runner_all.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

gulp.task('test_minimal', ['build_minimal'], function() {
  return gulp
    .src('spec/runner_minimal.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

gulp.task('test_bare', ['build_bare_jquery'], function() {
  return gulp
    .src('spec/runner_bare.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

// Building tasks
gulp.task('build-everything', ['build_all', 'build_all_with_history', 'build_minimal', 'build_bare_jquery', 'build_bare_reqwest', 'build_raw']);

gulp.task('build_all_with_history', function() {
  return buildRelease('all-history');
});

gulp.task('build_all', function() {
  return buildRelease('all');
});

gulp.task('build_minimal', function() {
  return buildRelease('minimal');
});

gulp.task('build_bare_jquery', function() {
  return buildRelease('bare-jquery');
});

gulp.task('build_bare_reqwest', function() {
  return buildRelease('bare-reqwest');
});

gulp.task('build_raw', function() {
  return buildRelease('raw');
});

gulp.task('set_version', function() {
  var version = pkg.version;
  if(typeof args.ver !== 'undefined') {
    version = args.ver;
    pkg.version = version;
  }

  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({ version: version }))
    .pipe(gulp.dest('./'));
});

gulp.task('lodash_custom', function () {
  return gulp.src('./source/build-profile/lodash-custom.js')
    .pipe(browserified())
    .pipe(rename('lodash-custom.js'))
    .pipe(gulp.dest('./dist'));
});
