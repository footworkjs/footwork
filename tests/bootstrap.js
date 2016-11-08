var ajaxWait = window.__env.AJAX_WAIT; // delay in ms to wait for ajax requests
var footworkAnimationClass = 'fw-entity-resolved';
var loadedModules = {};
var registerFootworkEntity;
var registerEntity;
var specWrappers = {};
var environment;

var testResults = {
  passed: 0,
  failed: 0,
  pending: 0
};

var allTestFiles = [];
var TEST_REGEXP = /(spec)\.js$/i;

/**
 * Determine whether the passed in file is listed in the tests array (or if tests is undefined or 'all' then return true always)
 *
 * @param {string} file the filename to check against
 * @param {array|string} tests [tests] to run, or if a 'string' is supplied it will always return true (ie: pass in 'all')
 * @returns {boolean} True if the test should be run, false if not
 */
function shouldRunTest(file, tests) {
  if(Object.prototype.toString.call(tests) === '[object Array]') {
    var shouldRun = false;
    tests.forEach(function(validTestModule) {
      if(file.match(validTestModule)) {
        shouldRun = true;
      }
    });
    return shouldRun;
  }
  return true;
}

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');

    // use the shouldRunTest callback below to limit the tests to an individual file or files
    /* shouldRunTest(normalizedTestModule, [
      'viewModel',
      'dataModel',
      'router',
      'namespace',
      'collection',
      'component',
      'broadcast-receive'
    ]) && */ allTestFiles.push(normalizedTestModule);
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
    "footwork": "build/footwork",
    "lodash": "bower_components/lodash/dist/lodash",
    "jquery": "bower_components/jquery/dist/jquery",
    "history": "bower_components/history.js/scripts/bundled/html5/native.history",
    "customMatchers": "tests/assets/customMatchers",
    "tools": "tests/assets/tools",
    "reporter": "tests/assets/reporter",
    "container": "tests/assets/container",
    "fetch-mock": "node_modules/fetch-mock/es5/client-browserified",
    "es5-shim": "bower_components/es5-shim/es5-shim"
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: function() {
    require(['es5-shim'], function() {
      require(['footwork', 'reporter', 'container'],
        function(fw) {
          window.fw = fw; // export footwork so the user has access to it in the console
          fixture.setBase('tests/assets/fixtures');
          setTimeout(window.__karma__.start, ajaxWait);
        }
      );
    });
  }
});
