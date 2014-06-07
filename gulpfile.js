var gulp = require('gulp');
var header = require("gulp-header");
var footer = require("gulp-footer");
var fileImports = require("gulp-imports");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var bump = require("gulp-bump");
var size = require('gulp-size');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var pkg = require("./package.json");
var reporter = 'list';

var banner = ["/**",
  " * <%= pkg.name %> - <%= pkg.description %>",
  " * Author: <%= pkg.author %>",
  " * Version: v<%= pkg.version %>",
  " * Url: <%= pkg.homepage %>",
  " * License(s): <% pkg.licenses.forEach(function( license, idx ){ %><%= license.type %><% if(idx !== pkg.licenses.length-1) { %>, <% } %><% }); %>",
  " */",
  ""
].join("\n");

gulp.task('default', ['build-and-test']);

gulp.task('bump', function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

// Testing tasks
gulp.task('ci', ['build-and-test']);

gulp.task('build-and-test', ['test_alldeps', 'test_minimal', 'test_bare'], function() {
  return gulp
    .src('spec/runner_alldeps.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

gulp.task('test_alldeps', ['build-all'], function() {
  return gulp
    .src('spec/runner_alldeps.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

gulp.task('test_minimal', ['build-all'], function() {
  return gulp
    .src('spec/runner_minimal.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

gulp.task('test_bare', ['build-all'], function() {
  return gulp
    .src('spec/runner_bare.html')
    .pipe(mochaPhantomJS({ reporter: reporter }));
});

// Building tasks
gulp.task('build-all', ['build_alldeps', 'build_minimal', 'build_bare']);

gulp.task("build_alldeps", function() {
  return gulp
    .src(["source/build-profile/alldeps.js"])
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(fileImports())
    .pipe(rename("footwork-alldeps.js"))
    .pipe(size({ title: '[alldeps] Unminified' }))
    .pipe(gulp.dest("dist/"))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("footwork-alldeps.min.js"))
    .pipe(size({ title: '[alldeps] Minified' }))
    .pipe(size({ title: '[alldeps] Minified', gzip: true }))
    .pipe(gulp.dest("dist/"));
});

gulp.task("build_minimal", function() {
  return gulp
    .src(["source/build-profile/minimal.js"])
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(fileImports())
    .pipe(rename("footwork-minimal.js"))
    .pipe(size({ title: '[minimal] Unminified' }))
    .pipe(gulp.dest("dist/"))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("footwork-minimal.min.js"))
    .pipe(size({ title: '[minimal] Minified' }))
    .pipe(size({ title: '[minimal] Minified', gzip: true }))
    .pipe(gulp.dest("dist/"));
});

gulp.task("build_bare", function() {
  return gulp
    .src(["source/build-profile/bare.js"])
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(fileImports())
    .pipe(rename("footwork-bare.js"))
    .pipe(size({ title: '[bare] Unminified' }))
    .pipe(gulp.dest("dist/"))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("footwork-bare.min.js"))
    .pipe(size({ title: '[bare] Minified' }))
    .pipe(size({ title: '[bare] Minified', gzip: true }))
    .pipe(gulp.dest("dist/"));
});