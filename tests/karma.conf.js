module.exports = {
  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',


  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['jasmine-jquery', 'requirejs', 'fixture', 'jasmine', 'env'],


  // list of files / patterns to load in the browser
  files: [
    'tests/bootstrap.js',
    'tests/assets/test.css',
    'tests/assets/fonts.css',
    'build/styles/footwork.css',
    { pattern: 'tests/assets/fonts/**/*.*', included: false },
    { pattern: 'tests/spec/**/*.js', included: false },
    { pattern: 'tests/assets/**/*.+(html|json|jsonp|js)', nocache: true, included: false },
    { pattern: 'bower_components/lodash/*.js', watched: false, included: false },
    { pattern: 'bower_components/requirejs-text/*.js', watched: false, included: false },
    { pattern: 'bower_components/knockoutjs/dist/*.js', watched: false, included: false },
    { pattern: 'bower_components/postal.js/lib/*.js', watched: false, included: false },
    { pattern: 'bower_components/jquery/dist/*.js', watched: false, included: false },
    { pattern: 'node_modules/html5-history-api/history.js', watched: false, included: true },
    { pattern: 'node_modules/whatwg-fetch/fetch.js', watched: false, included: true },
    { pattern: 'node_modules/babel-polyfill/dist/polyfill.js', watched: false, included: true },
    { pattern: 'node_modules/fetch-mock/es5/client-browserified.js', watched: false, included: false },

    { pattern: 'build/*.js', included: false },
    { pattern: 'dist/gh-footwork-logo.png', included: false }
  ],


  // list of files to exclude
  exclude: [
  ],


  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
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
  reporters: ['spec'],


  // web server port
  port: 9876,


  // enable / disable colors in the output (reporters and logs)
  colors: true,


  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  // logLevel: config.LOG_WARN,


  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,


  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: ['PhantomJS'],

  plugins: [
    'karma-html2js-preprocessor',
    'karma-jasmine',
    'karma-json-fixtures-preprocessor',
    'karma-fixture',
    'karma-jasmine-jquery',
    'karma-phantomjs-launcher',
    'karma-requirejs',
    'karma-spec-reporter',
    'karma-env',
    'karma-coverage'
  ],

  client: {
    env: {
      AJAX_WAIT: 100, // time in ms to tell ajax-based tests to wait for
      JASMINE_TIMEOUT: 20000 // time that jasmine will wait for async requests to complete
    }
  },

  phantomjsLauncher: {
    // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
    exitOnResourceError: true
  },

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: true,

  // Concurrency level
  // how many browser should be started simultaneous
  concurrency: Infinity
};
