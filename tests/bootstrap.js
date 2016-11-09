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
    "text": "node_modules/requirejs-text/text",
    "footwork": "build/footwork",
    "lodash": "node_modules/lodash/lodash",
    "es6-promise": "node_modules/es6-promise/dist/es6-promise",
    "es6promise-polyboot": "tests/assets/es6promise-polyboot",
    "fetch": "node_modules/whatwg-fetch/fetch",
    "fetch-mock": "node_modules/fetch-mock/es5/client-browserified"
  },
  "shim": {
    "fetch-mock": ["es6-promise", "fetch"]
  },
  map: {
    "*": {
      "es6-promise": "es6promise-polyboot"
    },
    "es6promise-polyboot": {
      "es6-promise": "es6-promise"
    }
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
