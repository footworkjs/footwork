var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

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

  paths: {
    /**
     * Note that if you add any new bower assets you will need to also add a reference
     * to them in the files section of karma.conf.js. This will allow the unit tests to
     * have access to them.
     */
    "text": "bower_components/requirejs-text/text",
    "footwork": "build/footwork-bare-jquery",
    "knockout": "bower_components/knockoutjs/dist/knockout.debug",
    "knockout-validation": "bower_components/knockout-validation/dist/knockout.validation",
    "reqwest": "bower_components/reqwest/reqwest",
    "postal": "bower_components/postal.js/lib/postal",
    "lodash": "bower_components/lodash/lodash",
    "placement": "bower_components/jquery.placement/dist/jquery.placement",
    "jquery": "bower_components/jquery/dist/jquery",
    "history": "bower_components/history.js/scripts/bundled/html5/native.history"
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
