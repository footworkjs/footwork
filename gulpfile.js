var gulp = require('gulp');
var header = require("gulp-header");
var fileImports = require("gulp-imports");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var size = require('gulp-size');
var mocha = require('gulp-mocha');
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

gulp.task('default', ['test', 'build']);

gulp.task('test', function() {
    return gulp
      .src('spec/test.js')
      .pipe(mocha({ reporter: 'list' }));
});

gulp.task("build", function() {
  return gulp
    .src(["source/footwork.js"])
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(fileImports())
    .pipe(gulp.dest("dist/"))
    .pipe(uglify({
      compress: {
        negate_iife: false
      }
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename("footwork.min.js"))
    .pipe(gulp.dest("dist/"));
});

gulp.task('ci', ['test']);