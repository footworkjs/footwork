var gulp = require('gulp');
var header = require("gulp-header");
var footer = require("gulp-footer");
var fileImports = require("gulp-imports");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var bump = require("gulp-bump");
var git = require("gulp-git");
var size = require('gulp-size');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var pkg = require("./package.json");

var banner = ["/**",
  " * <%= pkg.name %> - <%= pkg.description %>",
  " * Author: <%= pkg.author %>",
  " * Version: v<%= pkg.version %>",
  " * Url: <%= pkg.homepage %>",
  " * License(s): <% pkg.licenses.forEach(function( license, idx ){ %><%= license.type %><% if(idx !== pkg.licenses.length-1) { %>, <% } %><% }); %>",
  " */",
  ""
].join("\n");

gulp.task('default', ['tests']);

gulp.task('bump', function () {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('ci', ['tests']);
gulp.task('tests', ['test_alldeps', 'test_minimal-amd'], function() {
  return gulp
    .src('spec/runner_alldeps.html')
    .pipe(mochaPhantomJS({ reporter: 'list' }));
});
gulp.task('test_alldeps', ['build-all'], function() {
  return gulp
    .src('spec/runner_alldeps.html')
    .pipe(mochaPhantomJS({ reporter: 'list' }));
});
gulp.task('test_minimal-amd', ['build-all'], function() {
  return gulp
    .src('spec/runner_minimal-amd.html')
    .pipe(mochaPhantomJS({ reporter: 'list' }));
});

gulp.task('build-all', ['build_alldeps', 'build_minimal-amd']);
gulp.task("build_alldeps", function() {
  return gulp
    .src(["source/build-profile/alldeps.js"])
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(fileImports())
    .pipe(rename("footwork-alldeps.js"))
    .pipe(gulp.dest("dist/"))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("footwork-alldeps.min.js"))
    .pipe(gulp.dest("dist/"));
});
gulp.task("build_minimal-amd", function() {
  return gulp
    .src(["source/build-profile/minimal-amd.js"])
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(fileImports())
    .pipe(rename("footwork-minimal-amd.js"))
    .pipe(gulp.dest("dist/"))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("footwork-minimal-amd.min.js"))
    .pipe(gulp.dest("dist/"));
});