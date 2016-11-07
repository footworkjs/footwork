var gulp = require('gulp');
var browserify = require('browserify');
var istanbul = require('browserify-istanbul');
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
var sass = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var pkg = require('./package.json');
var reporter = 'list';
var args = require('yargs').argv;

var autoprefixOptions = {
  browsers: ['last 3 versions', '> 5%', 'Firefox > 3', 'ie >= 9']
};

var banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * Author: <%= pkg.author %>',
  ' * Version: v<%= pkg.version %>',
  ' * Url: <%= pkg.homepage %>',
  ' * License: <%= pkg.license %>',
  ' */',
  '', ''
].join('\n');

var bundleConfig = {
  src: './source/footwork.js',
  outputDir: './build/',
  outputFile: 'footwork.js',
  minOutputFile: 'footwork.min.js',
  moduleName: 'fw'
};

function bundle (bundler) {
  return bundler
    .bundle()
    .pipe(source(bundleConfig.src))
    .pipe(buffer())
    .pipe(rename(bundleConfig.outputFile))
    .pipe(gulp.dest(bundleConfig.outputDir));
}

gulp.task('default', ['build']);

// Testing tasks
gulp.task('tests', ['bundle-covered'], function(done) {
  return new Server(_.extend(require('./tests/karma.conf.js'), require('./tests/karma-coverage.conf.js')), done).start();
});

gulp.task('sauce', ['build'], function(done) {
  return new Server(_.extend(require('./tests/karma.conf.js'), require('./tests/sauce-config/karma.conf.js')), done).start();
});

gulp.task('unit', ['tests'], function () {
  return gulp.src('./build/coverage-reports/report-lcov/lcov.info')
    .pipe(coveralls());
});

gulp.task('watch-test', function () {
  gulp.watch(['tests/**/*.*', 'source/**/*.*'], ['tests']);
});

// Building tasks
gulp.task('bundle-covered', function () {
    return bundle(browserify(bundleConfig.src, {
      standalone: bundleConfig.moduleName,
      debug: args.hasOwnProperty("debug")
    }).transform(istanbul));
});

gulp.task('bundle', function () {
    return bundle(browserify(bundleConfig.src, {
      standalone: bundleConfig.moduleName,
      debug: args.hasOwnProperty("debug")
    }));
});

gulp.task('build', ['bundle', 'build_footwork_css', 'build_test_css'], function () {
  var fileSize = size({ title: bundleConfig.outputFile });

  return gulp.src('./build/' + bundleConfig.outputFile)
    .pipe(plumber())
    .pipe(replace(/FOOTWORK_VERSION/g, pkg.version))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(fileSize)
    .pipe(gulp.dest('./build'));
});

gulp.task('minify', ['build'], function() {
  console.log(chalk.yellow('Please wait: Minification can take a few minutes (See: ') + chalk.white('https://github.com/knockout/knockout/issues/1652') + chalk.yellow(')'));

  var fileSizeMin = size({ title: bundleConfig.minOutputFile });
  var fileSizeGzip = size({ gzip: true, title: bundleConfig.minOutputFile });

  return gulp.src('./build/' + bundleConfig.outputFile)
    .pipe(uglify({
      compress: { negate_iife: false }
    }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename(bundleConfig.minOutputFile))
    .pipe(fileSizeMin)
    .pipe(fileSizeGzip)
    .pipe(gulp.dest('build/'));
});

gulp.task('dist', ['minify'], function() {
  return gulp.src(['./build/*.js', './build/*.css'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('build_test_css', function() {
  return gulp.src(['./tests/assets/test.scss'])
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoprefixOptions))
    .pipe(gulp.dest('./tests/assets'));
});

gulp.task('build_footwork_css', function() {
  return gulp.src('./source/footwork.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoprefixOptions))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
  gulp.watch(['source/**/*.*'], ['build']);
});

gulp.task('set_version', function() {
  return gulp.src(['./package.json'])
    .pipe(bump({ version: args.ver || pkg.version }))
    .pipe(gulp.dest('./'));
});
