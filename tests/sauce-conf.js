var customLaunchers = require('./sauce-browsers.js');

Object.keys(customLaunchers).forEach(function(launcherName) {
  customLaunchers[launcherName]['base'] = 'SauceLabs';
  customLaunchers[launcherName]['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
  customLaunchers[launcherName]['build'] = process.env.TRAVIS_JOB_NUMBER;
});

module.exports = {
  reporters: ['dots', 'saucelabs'],
  sauceLabs: {
    testName: 'FootworkJS',
    tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
    build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
    startConnect: false,
    verbose: false,
    retryLimit: 3,
    recordVideo: false,
    recordScreenshots: false,
    verboseDebugging: false
  },
  captureTimeout: 800000,
  browserNoActivityTimeout: 800000,
  browsers: Object.keys(customLaunchers),
  customLaunchers: customLaunchers,
  client: {
    env: {
      AJAX_WAIT: 1500 // time in ms to tell ajax-based tests to wait for (saucelabs runners are very slow)
    }
  },
  plugins: [
    'karma-sauce-launcher',
    'karma-html2js-preprocessor',
    'karma-jasmine',
    'karma-json-fixtures-preprocessor',
    'karma-fixture',
    'karma-jasmine-jquery',
    'karma-requirejs',
    'karma-spec-reporter',
    'karma-env'
  ],
  singleRun: true
};
