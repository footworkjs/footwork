define(['footwork', 'jquery', 'lodash', 'customMatchers', 'fetch-mock', 'reporter', 'container'],
  function(fw, $, _, customMatchers, fetchMock) {
    var $body = $(document.body);
    var $passedTestResults = $body.find('.passed.result .display');
    var $failedTestResults = $body.find('.failed.result .display');
    var $pendingTestResults = $body.find('.pending.result .display');
    var currentCallbackOrderIndex = 0;
    var jasmineDefaultTimeoutInterval;
    var namespaceCounter = 0;
    var generatedUrlCounter = 0;

    /**
     * Register the passed in entity as having been loaded.
     *
     * @param {function} initializeMethod The method you want to wrap which when called will register itself as loaded
     * @returns {object} entity the entity that was passed in
     */
    registerFootworkEntity = function (entity) {
      loadedModules[entity.$namespace.getName()] = true;
      return entity;
    }

    /**
     * Wrap the passed in callback (initializeMethod) with a function that registers the module when it is called.
     *
     * @param {string} name The name you want registered when this function is called
     * @param {function} initializeMethod The method you want to wrap which when called will register itself as loaded
     */
    registerEntity = function (name, initializeMethod) {
      return function() {
        loadedModules[name] = true;
        return (initializeMethod || _.noop).apply(this, arguments);
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
     * Generate a string of the length given (or a random length if none provided)
     *
     * @param {int} length (optional)
     * @returns {string} The generated string
     */
    function randomString(length) {
      var charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = '';

      for (var i = length || _.random(15, 30); i > 0; --i) {
        result += _.sample(charSet);
      }

      return result;
    }

    /**
     * Checks that a callback has occured in a specified order
     *
     * @param {array|int} orderValue The order expected for the callback
     * @param {any} callback The callback to check when called
     * @returns {function} The original function wrapped which will check when it is called during the test
     */
    function expectCallOrder(orderValue, callback) {
      callback = callback || _.noop;
      return function callbackOrderCheck() {
        if(Object.prototype.toString.call(orderValue) === '[object Array]') {
          expect(orderValue.shift()).toBe(currentCallbackOrderIndex, '[' + _.result(callback.and || {}, 'identity') + '] order of callbacks specified in array is incorrect');
        } else {
          expect(orderValue).toBe(currentCallbackOrderIndex, '[' + _.result(callback.and || {}, 'identity') + '] order of callback specified is incorrect');
        }
        currentCallbackOrderIndex++;
        return callback.apply(this, arguments);
      };
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
      _.each(failedTests, function(failedTest) {
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
      loadedModules = [];
      fetchMock.restore();
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
          return _.inRange(response.status, 200, 300) ? response.clone().json() : false;
        })
        .catch(function(parseError) {
          console.error(parseError);
          return false;
        });
    }

    return {
      getFixtureContainer: getFixtureContainer,
      generateNamespaceName: generateNamespaceName,
      generateUrl: generateUrl,
      randomString: randomString,
      expectCallOrder: expectCallOrder,
      prepareTestEnv: prepareTestEnv,
      cleanTestEnv: cleanTestEnv,
      handleJsonResponse: handleJsonResponse
    };
  }
);
