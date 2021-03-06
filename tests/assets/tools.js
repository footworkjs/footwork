var $body = $(document.body);
var $passedTestResults = $body.find('.passed.result .display');
var $failedTestResults = $body.find('.failed.result .display');
var $pendingTestResults = $body.find('.pending.result .display');
var currentCallbackOrderIndex = 0;
var jasmineDefaultTimeoutInterval;
var namespaceCounter = 0;
var generatedUrlCounter = 0;
var loadedModules = {};
var ajaxWait = window.__env.AJAX_WAIT; // delay in ms to wait for ajax requests

/**
 * Register the passed in entity as having been loaded.
 *
 * @param {function} initializeMethod The method you want to wrap which when called will register itself as loaded
 * @returns {object} entity the entity that was passed in
 */
var registerFootworkEntity = function (entity) {
  loadedModules[entity.$namespace.getName()] = true;
  return entity;
}

/**
 * Wrap the passed in callback (initializeMethod) with a function that registers the module when it is called.
 *
 * @param {string} name The name you want registered when this function is called
 * @param {function} initializeMethod The method you want to wrap which when called will register itself as loaded
 */
var registerEntity = function (name, initializeMethod) {
  return function() {
    loadedModules[name] = true;
    return (initializeMethod || function() {}).apply(this, arguments);
  };
}

/**
 * Create and return a container to perform test in
 *
 * @param {string} theFixture The fixture you want to generate and return a container for
 * @param {string} containerDOM The wrapper to insert the fixture into (optional)
 * @returns {element} The generated container to perform tests with
 */
function getFixtureContainer(theFixture, containerDOM) {
  var currentSpec = (environment.currentSpec || { fullName: 'Unknown' });
  var $wrapper = specWrappers[currentSpec.fullName];
  var $container = $(containerDOM || '<div/>');
  var $display = $wrapper.find('.display');

  $wrapper.addClass('running').removeClass('waiting');
  $container.append(theFixture);
  $display.append($container);

  return $container.get(0);
}

/**
 * Create a namespace name to use in tests
 *
 * @returns {string} The namespace name
 */
function generateNamespaceName() {
  return 'generated-ns' + namespaceCounter++;
}

/**
 * Create a url to use in tests
 *
 * @returns {string} The url
 */
function generateUrl() {
  return '/generated-url' + generatedUrlCounter++;
}

/**
 * Adds error output for a test to its wrapper
 *
 * @param {array} failedTests The failed tests
 */
function addErrorsToWrapper(failedTests) {
  var currentSpec = (environment.currentSpec || { fullName: currentTestDescription || 'Unknown' });
  var $wrapper = specWrappers[currentSpec.fullName];

  $wrapper && $wrapper.find('.wrapper-title > .icon').addClass('icon-bug');
  $errorContainer = $('<div class="failed-tests"></div>');
  failedTests.forEach(function(failedTest) {
    $errorContainer.append('<div class="test">\
      <div class="message"><span class="failure"><span class="icon-stop-circle"></span> FAILURE:</span> ' + failedTest.message + '</div>\
      <pre class="stack">' + failedTest.stack + '</pre>\
    </div>');
  });
  $wrapper && $wrapper.append($errorContainer);
}

/**
 * Prepare the test environment for a test
 */
function prepareTestEnv() {
  fixture.setBase('tests/assets/fixtures');
  loadedModules = [];
  currentCallbackOrderIndex = 0;
  jasmine.addMatchers(customMatchers);
  jasmineDefaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = window.__env.JASMINE_TIMEOUT; // time that jasmine will wait for async requests to complete
}

/**
 * Update the summary at the top with the current test pass/fail/pend values
 */
function renderTestSummary() {
  $passedTestResults.text(testResults.passed);
  $failedTestResults.text(testResults.failed);
  $pendingTestResults.text(testResults.pending);
}

/**
 * Clean the test environment
 */
function cleanTestEnv() {
  var failedTests = environment.currentSpec.failedExpectations;
  var passedTests = environment.currentSpec.passedExpectations;
  var specStatus = 'passed';
  var currentSpec = (environment.currentSpec || { fullName: currentTestDescription || 'Unknown' });
  var $wrapper = specWrappers[currentSpec.fullName];

  $wrapper.removeClass('running');

  if(failedTests.length) {
    testResults.failed += 1;
    specStatus = 'failed';

    addErrorsToWrapper(failedTests);
  } else {
    testResults.passed += 1;
    $wrapper && $wrapper.find('.wrapper-title > .icon').addClass('icon-thumbs-up');
  }

  $wrapper && $wrapper
    .removeClass('running')
    .addClass(specStatus);

  renderTestSummary();
  fixture.cleanup();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineDefaultTimeoutInterval;
}

/**
 * Take a fetch'd xmlhttprequest and handle the response. Takes into account valid 200-299 response codes.
 * Also handles parse errors in the response which is supposed to be valid JSON.
 *
 * @param {object} xhr
 * @returns {object} xhr with parsed JSON response result
 */
function handleJsonResponse(xhr) {
  return xhr.then(function(response) {
      var json;
      try {
        json = response.clone().json();
      } catch (e) {
        console.error(e);
        return false;
      }
      return json;
    });
}
