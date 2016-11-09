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

var clientNavigator = navigator.userAgent.toLowerCase();
var isExploder = (clientNavigator.indexOf('msie') != -1);
var ieVersion = isExploder ? parseInt(clientNavigator.split('msie')[1]) : undefined;

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
    "text": "node_modules/requirejs-text/text",
    "footwork": "build/footwork",
    "lodash": "node_modules/lodash/lodash",
    "jquery": "node_modules/jquery/dist/jquery",
    "fetch-mock": "node_modules/fetch-mock/es5/client-browserified",
    "es5-shim": "bower_components/es5-shim/es5-shim"
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: function() {
    function runTests () {
      fixture.setBase('tests/assets/fixtures');
      window.__karma__.start();
    }

    require(['footwork'], function() {
      if(isExploder && ieVersion < 9) {
        // ie < 9 requires shimming
        // ie8 does not work at the moment, many attempts were made, all have failed, too small user base to care more (it was also EOL'd by MSFT)
        require(['es5-shim'], runTests);
      } else {
        runTests();
      }
    });
  }
});
