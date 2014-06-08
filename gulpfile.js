var gulp = require('gulp');
var header = require('gulp-header');
var footer = require('gulp-footer');
var fileImports = require('gulp-imports');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bump = require('gulp-bump');
var size = require('gulp-size');
var replace = require('gulp-replace');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var wrapDocco = require('gulp-wrap-docco');
var merge = require('merge-stream');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var _ = require('lodash');
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var reporter = 'list';
var statement = 'A solid footing for larger knockout applications.';
var args   = require('yargs').argv;

var sourceFiles = [
  'main',
  'model-namespace',
  'broadcast-receive',
  'bindingHandlers',
  'extenders'
];

var build = function(buildProfile) {
  return gulp
    .src(['source/build-profile/' + buildProfile + '.js'])
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(fileImports())
    .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
    .pipe(rename('footwork-' + buildProfile + '.js'))
    .pipe(size({ title: '[' + buildProfile + '] Unminified' }))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename('footwork-' + buildProfile + '.min.js'))
    .pipe(size({ title: '[' + buildProfile + '] Minified' }))
    .pipe(size({ title: '[' + buildProfile + '] Minified', gzip: true }))
    .pipe(gulp.dest('dist/'));
};

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * Author: <%= pkg.author %>',
  ' * Version: v<%= pkg.version %>',
  ' * Url: <%= pkg.homepage %>',
  ' * License(s): <% pkg.licenses.forEach(function( license, idx ){ %><%= license.type %><% if(idx !== pkg.licenses.length-1) { %>, <% } %><% }); %>',
  ' */',
  ''
].join('\n');

gulp.task('default', ['build-and-test']);

gulp.task('bump', function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

// Testing tasks
gulp.task('ci', ['build-and-test']);

gulp.task('build-and-test', ['test_all', 'test_minimal', 'test_bare'], function() {
  return gulp
    .src('spec/runner_all.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

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
gulp.task('build-everything', ['build_all', 'build_minimal', 'build_bare']);

gulp.task('build_prep', function() {
  // we have to force load of lodash instead of underscore
  return gulp
    .src('bower_components/riveter/lib/riveter.js')
    .pipe(replace(/underscore/g, 'lodash'))
    .pipe(gulp.dest('./bower_components/riveter/lib'));
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

// Documentation / release oriented tasks
gulp.task('readyRelease', function(callback) {
  runSequence('set_version', 'docs', callback);
});
gulp.task('docs', ['doc_js', 'doc_index']);

gulp.task('docs_clean', function() {
  return merge(
    gulp.src('./docs/*.html', { read: false }).pipe(rimraf()),
    gulp.src('./docs/pages/*.html', { read: false }).pipe(rimraf())
  );
});

gulp.task('doc_js', ['docs_clean'], function() {
  return merge.apply(null, _.map(sourceFiles, function(sourceFile) {
    return gulp.src('source/' + sourceFile + '.js')
      .pipe(wrapDocco())
      .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
      .pipe(rename(sourceFile + '.html'))
      .pipe(gulp.dest('./docs/pages'));
  }));
});

gulp.task('doc_index', ['docs_clean'], function() {
  return gulp.src('docs/templates/index.html')
    .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
    .pipe(replace(/FOOTWORK_SOURCEFILES/g, JSON.stringify(sourceFiles)))
    .pipe(replace(/FOOTWORK_STATEMENT/g, statement))
    .pipe(gulp.dest('./docs'));
});

gulp.task('set_version', ['docs_clean'], function() {
  var version = pkg.version;
  if(typeof args.ver !== 'undefined') {
    version = args.ver;
    pkg.version = version;
  }

  return merge(
    gulp.src('docs/package.json')
      .pipe(bump({ version: version }))
      .pipe(gulp.dest('./docs')),
    gulp.src('docs/bower.json')
      .pipe(bump({ version: version }))
      .pipe(gulp.dest('./docs')),
    gulp.src(['./package.json', './bower.json'])
      .pipe(bump({ version: version }))
      .pipe(gulp.dest('./'))
  );
});