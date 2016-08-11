function checkType(util, customEqualityTesters) {
  return {
    compare: function(actual, expected) {
      var result = {};
      switch(expected.toLowerCase()) {
        case 'promise':
          result.pass = util.equals(typeof actual, 'object', customEqualityTesters) && util.equals(typeof actual.done, 'function', customEqualityTesters);
          break;

        case 'array':
          result.pass = util.equals(Object.prototype.toString.call(actual), '[object Array]', customEqualityTesters);
          break;

        default:
          result.pass = util.equals(typeof actual, expected, customEqualityTesters);
          break;
      }

      if(!result.pass) {
        result.message = '\'' + (typeof actual) + '\' is not a ' + expected;
      }
      return result;
    }
  };
}

function checkLength(util, customEqualityTesters) {
  return {
    compare: function(actual, expected) {
      var result = {
        pass: util.equals(Object.prototype.toString.call(actual), '[object Array]', customEqualityTesters) && util.equals(actual.length, expected, customEqualityTesters)
      };

      if(!result.pass) {
        result.message = '\'' + (typeof actual) + '\' is not ' + expected + ' elements in length';
      }
      return result;
    }
  };
}

function checkLengthGreaterThan(util, customEqualityTesters) {
  return {
    compare: function(actual, expected) {
      var result = {
        pass: util.equals(Object.prototype.toString.call(actual), '[object Array]', customEqualityTesters) && actual.length > expected
      };

      if(!result.pass) {
        result.message = '\'' + (typeof actual) + '\' is not ' + expected + ' elements in length';
      }
      return result;
    }
  };
}

function checkForExternallyLoadedModule(util, customEqualityTesters) {
  return {
    compare: function(actual, expected) {
      var result = { pass: !!loadedModules[actual] };
      if(!result.pass) {
        result.message = 'Expected \'' + actual + '\' requirejs module to have been loaded.';
      }
      return result;
    }
  };
}

var customMatchers = {
  toBeA: checkType,
  toBeAn: checkType,
  lengthToBe: checkLength,
  lengthToBeGreaterThan: checkLengthGreaterThan,
  toBeLoaded: checkForExternallyLoadedModule
};

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

var loadedModules = {};
function registerFootworkEntity(initializeMethod) {
  return function() {
    loadedModules[this.$namespace.getName()] = true;
    return (initializeMethod || noop).apply(this, arguments);
  };
}
function registerEntity(name, initializeMethod) {
  return function() {
    loadedModules[name] = true;
    return (initializeMethod || noop).apply(this, arguments);
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
var noop = function() {};
function expectCallOrder(orderValue, callback) {
  callback = callback || noop;
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

var testContainer;
var jasmineDefaultTimeoutInterval;
function prepareTestEnv() {
  resetCallbackOrder();
  jasmine.addMatchers(customMatchers);
  jasmineDefaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = window.__env.JASMINE_TIMEOUT; // time that jasmine will wait for async requests to complete
}
function cleanTestEnv() {
  fixture.cleanup(testContainer);
  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineDefaultTimeoutInterval;
}
