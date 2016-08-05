module.exports = function(config) {
  // Use ENV vars on Travis and sauce.json locally to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
      process.exit(1);
    } else {
      process.env.SAUCE_USERNAME = require('./sauce').username;
      process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
    }
  }

  // Browsers to run on Sauce Labs
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    'SL_InternetExplorer': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10'
    },
    'SL_FireFox': {
      base: 'SauceLabs',
      browserName: 'firefox',
    }
  };

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


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    sauceLabs: {
      testName: 'Footwork Framework Tests'
    },
    captureTimeout: 120000,
    customLaunchers: customLaunchers,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
