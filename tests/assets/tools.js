define(['jquery', 'lodash', 'customMatchers'],
  function($, _, customMatchers) {
    /**
     * Helper which makes a new DOM node that we can use to put our test fixture into. Once created it is inserted into the DOM and returned.
     * @param  {mixed} theFixture The fixture
     * @return {DOMNode}          The generated DOM node container
     */
    function makeTestContainer(theFixture, containerDOM) {
      var $container = $j(containerDOM || '<div/>');

      $container.append(theFixture);
      $j(document.body).append($container);

      return $container.get(0);
    }

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

    var jasmineDefaultTimeoutInterval;
    function prepareTestEnv() {
      resetCallbackOrder();
      jasmine.addMatchers(customMatchers);
      jasmineDefaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = window.__env.JASMINE_TIMEOUT; // time that jasmine will wait for async requests to complete
    }
    function cleanTestEnv() {
      fixture.cleanup();
      jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineDefaultTimeoutInterval;
    }

    return {
      makeTestContainer: makeTestContainer,
      generateNamespaceName: generateNamespaceName,
      generateUrl: generateUrl,
      randomString: randomString,
      expectCallOrder: expectCallOrder,
      prepareTestEnv: prepareTestEnv,
      cleanTestEnv: cleanTestEnv
    };
  }
);
