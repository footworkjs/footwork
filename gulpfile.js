var gulp = require('gulp');
var header = require("gulp-header");
var footer = require("gulp-footer");
var fileImports = require("gulp-imports");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var size = require('gulp-size');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var debug = require('gulp-debug');
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

gulp.task('ci', ['tests']);
gulp.task('tests', ['build-all'], function() {
  return gulp
    .src('spec/runner.html')
    .pipe(mochaPhantomJS({ reporter: 'list' }));
});

gulp.task('build-all', ['build-nodeps']);
gulp.task("build-nodeps", function() {
  return gulp
    .src(["source/build-profile/nodeps.js"])
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(fileImports())
    .pipe(rename("footwork-nodeps.js"))
    .pipe(gulp.dest("dist/"))
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("footwork-nodeps.min.js"))
    .pipe(gulp.dest("dist/"));
});
