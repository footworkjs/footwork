var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var header = require('gulp-header');
var footer = require('gulp-footer');
var fileImports = require('gulp-imports');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bump = require('gulp-bump');
var size = require('gulp-size');
var replace = require('gulp-replace');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var merge = require('merge-stream');
var moment = require('moment');
var _ = require('lodash');
var runSequence = require('run-sequence');
var fs = require('fs');

var pkg = require('./package.json');
var reporter = 'list';
var statement = 'A solid footing for web applications.';
var args   = require('yargs').argv;

var browserified = function() {
  return transform(function(filename) {
    return browserify(filename).bundle();
  });
};

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * Author: <%= pkg.author %>',
  ' * Version: v<%= pkg.version %>',
  ' * Url: <%= pkg.homepage %>',
  ' * License(s): <% pkg.licenses.forEach(function( license, idx ){ %><%= license.type %><% if(idx !== pkg.licenses.length-1) { %>, <% } %><% }); %>',
  ' */'
];

var rawBanner = [
  '// footwork.js',
  '// ----------------------------------',
  '// v<%= pkg.version %>',
  '//',
  '// Copyright (c)2014 <%= pkg.author %>.',
  '// Distributed under <% pkg.licenses.forEach(function( license, idx ){ %><%= license.type %><% if(idx !== pkg.licenses.length-1) { %>, <% } %><% }); %> license',
  '//',
  '// <%= pkg.homepage %>'
];

var build = function(buildProfile) {
  var headerBanner = banner.slice(0);
  if(buildProfile !== 'raw') {
    headerBanner[3] += '-' + buildProfile;
  }
  headerBanner = headerBanner.join('\n');

  if(buildProfile === 'raw') {
    headerBanner = rawBanner.join("\n") + headerBanner;
  }

  return gulp
    .src(['source/build-profile/' + buildProfile + '.js'])
    .pipe(header(headerBanner, { pkg: pkg }))
    .pipe(fileImports())
    .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
    .pipe(rename('footwork-' + buildProfile + '.js'))
    .pipe(size({ title: '[' + buildProfile + '] Unminified' }))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename('footwork-' + buildProfile + '.min.js'))
    .pipe(size({ title: '[' + buildProfile + '] Minified' }))
    .pipe(size({ title: '[' + buildProfile + '] Minified', gzip: true }))
    .pipe(gulp.dest('dist/'));
};

gulp.task('default', ['build-and-test']);

gulp.task('bump', function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

// Testing tasks
gulp.task('ci', ['test_bare']);

gulp.task('build-and-test', ['build_all_with_history', 'test_all', 'test_minimal', 'test_bare']);

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

gulp.task('test_bare', ['build_bare'], function() {
  return gulp
    .src('spec/runner_bare.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

// Building tasks
gulp.task('build-everything', ['build_all', 'build_all_with_history', 'build_minimal', 'build_bare', 'build_raw']);

gulp.task('build_prep', function() {
  // we have to force load of lodash instead of underscore inside of riveter
  return gulp
    .src('bower_components/riveter/lib/riveter.js')
    .pipe(replace(/underscore/g, 'lodash'))
    .pipe(gulp.dest('./bower_components/riveter/lib'));
});

gulp.task('build_all_with_history', ['build_prep'], function() {
  return build('all-history');
});

gulp.task('build_all', ['build_prep'], function() {
  return build('all');
});

gulp.task('build_minimal', ['build_prep'], function() {
  return build('minimal');
});

gulp.task('build_bare', ['build_prep'], function() {
  return build('bare');
});

gulp.task('build_raw', ['build_prep'], function() {
  return build('raw');
});

gulp.task('set_version', function() {
  var version = pkg.version;
  if(typeof args.ver !== 'undefined') {
    version = args.ver;
    pkg.version = version;
  }

  return merge(
    gulp.src(['docs/package.json', 'docs/bower.json'])
      .pipe(bump({ version: version }))
      .pipe(gulp.dest('./docs')),
    gulp.src(['./package.json', './bower.json'])
      .pipe(bump({ version: version }))
      .pipe(gulp.dest('./'))
  );
});

gulp.task('lodash_custom', function () {
  return gulp.src('./source/build-profile/lodash-custom.js')
    .pipe(browserified())
    .pipe(rename('lodash-custom.js'))
    .pipe(gulp.dest('./dist'));
});
