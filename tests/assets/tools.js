define(['footwork', 'jquery', 'lodash', 'customMatchers', 'reporter', 'container'],
  function(fw, $, _, customMatchers) {
    var $body = $(document.body);
    var $passedTestResults = $body.find('.passed.result .display');
    var $failedTestResults = $body.find('.failed.result .display');
    var $pendingTestResults = $body.find('.pending.result .display');

    var getFixtureContainer = function(theFixture, containerDOM) {
      var currentSpec = (environment.currentSpec || { fullName: 'Unknown' });
      var $wrapper = specWrappers[currentSpec.fullName];
      var $container = $(containerDOM || '<div/>');
      var $display = $wrapper.find('.display');

      $wrapper.addClass('running').removeClass('waiting');
      $container.append(theFixture);
      $display.append($container);

      return $container.get(0);
    };

    registerFootworkEntity = function (initializeMethod) {
      return function() {
        loadedModules[this.$namespace.getName()] = true;
        return (initializeMethod || _.noop).apply(this, arguments);
      };
    }
    registerEntity = function (name, initializeMethod) {
      return function() {
        loadedModules[name] = true;
        return (initializeMethod || _.noop).apply(this, arguments);
      };
    }

    var namespaceCounter = 0;
    function generateNamespaceName() {
      return 'generated-ns' + namespaceCounter++;
    }

    var generatedUrlCounter = 0;
    function generateUrl() {
      return '/generated-url' + generatedUrlCounter++;
    }

    function randomString(length) {
      var charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = '';

      for (var i = length || _.random(15, 30); i > 0; --i) {
        result += _.sample(charSet);
      }

      return result;
    }

    var currentCallbackOrderIndex = 0;
    function expectCallOrder(orderValue, callback) {
      callback = callback || _.noop;
      return function() {
        if(Object.prototype.toString.call(orderValue) === '[object Array]') {
          expect(orderValue.shift()).toBe(currentCallbackOrderIndex, '[' + _.result(callback.and || {}, 'identity') + '] order of callbacks specified in array is incorrect');
        } else {
          expect(orderValue).toBe(currentCallbackOrderIndex, '[' + _.result(callback.and || {}, 'identity') + '] order of callback specified is incorrect');
        }
        currentCallbackOrderIndex++;
        return callback.apply(this, arguments);
      };
    }
    function resetCallbackOrder() {
      currentCallbackOrderIndex = 0;
    }

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

    var jasmineDefaultTimeoutInterval;
    function prepareTestEnv() {
      resetCallbackOrder();
      jasmine.addMatchers(customMatchers);
      jasmineDefaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = window.__env.JASMINE_TIMEOUT; // time that jasmine will wait for async requests to complete
    }

    function renderTestSummary() {
      $passedTestResults.text(testResults.passed);
      $failedTestResults.text(testResults.failed);
      $pendingTestResults.text(testResults.pending);
    }

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

    return {
      getFixtureContainer: getFixtureContainer,
      generateNamespaceName: generateNamespaceName,
      generateUrl: generateUrl,
      randomString: randomString,
      expectCallOrder: expectCallOrder,
      prepareTestEnv: prepareTestEnv,
      cleanTestEnv: cleanTestEnv
    };
  }
);
