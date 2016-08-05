module.exports = function(config) {

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      browserName: 'chrome',
      platform: 'Windows 10'
    },
    'SL_InternetExplorer': {
      browserName: 'internet explorer',
      version: '10',
      platform: 'Windows 10'
    },
    'SL_FireFox': {
      browserName: 'firefox',
      platform: 'Windows 10'
    }
  };

  Object.keys(customLaunchers).forEach(function(launcherName) {
    customLaunchers[launcherName]['base'] = 'SauceLabs';
    customLaunchers[launcherName]['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
    customLaunchers[launcherName]['build'] = process.env.TRAVIS_JOB_NUMBER;
    customLaunchers[launcherName]['maxInstances'] = 1;
  });

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-jquery', 'requirejs', 'fixture', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'tests/main.js',
      {pattern: 'tests/runner-setup.js', nocache: true},
      {pattern: 'tests/assets/customMatchers.js', nocache: true},
      {pattern: 'tests/spec/**/*.js', included: false},
      {pattern: 'tests/assets/**/*.+(html|json|jsonp|js)', nocache: true, included: false},
      {pattern: 'bower_components/lodash/*.js', watched: false, included: false},
      {pattern: 'bower_components/requirejs-text/*.js', watched: false, included: false},
      {pattern: 'bower_components/knockoutjs/dist/*.js', watched: false, included: false},
      {pattern: 'bower_components/postal.js/lib/*.js', watched: false, included: false},
      {pattern: 'bower_components/jquery-mockjax/dist/*.js', watched: false, included: false},
      {pattern: 'bower_components/jquery/dist/*.js', watched: false, included: false},
      {pattern: 'bower_components/reqwest/reqwest.js', watched: false, included: false},
      {pattern: 'build/*.js', included: false}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'build/footwork-ci.js': 'coverage',
      'tests/assets/**/*.html': ['html2js'],
      'tests/assets/**/*.json': ['json_fixtures']
    },

    // used by the fixture framework
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage', 'saucelabs'],

    coverageReporter: {
      dir : 'build/coverage/',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
    },


    // web server port
    port: 9876,


    sauceLabs: {
      testName: 'Footwork Unit Tests'
    },
    captureTimeout: 120000,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(customLaunchers).concat('PhantomJS'),


    plugins: [
      'karma-sauce-launcher',
      'karma-coverage',
      'karma-html2js-preprocessor',
      'karma-jasmine',
      'karma-json-fixtures-preprocessor',
      'karma-phantomjs-launcher',
      'karma-fixture',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      'karma-jasmine-jquery',
      'karma-requirejs',
      'karma-safari-launcher',
      'karma-spec-reporter'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
