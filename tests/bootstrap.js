var ajaxWait = window.__env.AJAX_WAIT; // delay in ms to wait for ajax requests
var footworkAnimationClass = 'fw-entity-animate';
var loadedModules = {};
var registerFootworkEntity;
var registerEntity;
var allTestFiles = [];
var TEST_REGEXP = /(spec)\.js$/i;
var makeTestContainer;
var getFixtureContainer;
var specWrappers = {};
var currentDescription;
var environment;

var testResults = {
  passed: 0,
  failed: 0,
  pending: 0
};

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  waitSeconds: 600,

  paths: {
    /**
     * Note that if you add any new bower assets you will need to also add a reference
     * to them in the files section of karma.conf.js. This will allow the unit tests to
     * have access to them.
     */
    "text": "bower_components/requirejs-text/text",
    "footwork": "build/footwork-ci",
    "knockout": "bower_components/knockoutjs/dist/knockout.debug",
    "reqwest": "bower_components/reqwest/reqwest",
    "postal": "bower_components/postal.js/lib/postal",
    "lodash": "bower_components/lodash/lodash",
    "jquery-mockjax": "bower_components/jquery-mockjax/dist/jquery.mockjax",
    "jquery": "bower_components/jquery/dist/jquery",
    "history": "bower_components/history.js/scripts/bundled/html5/native.history",
    "customMatchers": "tests/assets/customMatchers",
    "tools": "tests/assets/tools",
    "reporter": "tests/assets/reporter",
    "container": "tests/assets/container"
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: function() {
    require(['footwork', 'lodash', 'jquery', 'jquery-mockjax', 'reporter', 'container'],
      function(fw, _, $) {
        fixture.setBase('tests/assets/fixtures');

        // tell mockjax to do its work quietly and quickly before we begin our tests
        _.extend($.mockjaxSettings, {
          logging: false,
          responseTime: 5
        });

        // start the tests
        window.__karma__.start();
      }
    );
  }
});
