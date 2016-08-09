/**
 * Helper which makes a new DOM node that we can use to put our test fixture into. Once created it is inserted into the DOM and returned.
 * @param  {mixed} theFixture The fixture
 * @return {DOMNode}          The generated DOM node container
 */
function makeTestContainer(theFixture, containerDOM) {
  var $container = $(containerDOM || '<div/>');

  $container.append(theFixture);
  $(document.body).append($container);

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
var originalTimeout;
function prepareTestEnv() {
  resetCallbackOrder();
  jasmine.addMatchers(customMatchers);
  fixture.setBase('tests/assets/fixtures');
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineTimeout;
}
function cleanTestEnv() {
  fixture.cleanup(testContainer);
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
}

var ajaxWait = window.__env.AJAX_WAIT; // delay in ms to wait for ajax requests
var jasmineTimeout = window.__env.JASMINE_TIMEOUT; // time that jasmine will wait for async requests to complete
var fw;
var $;
var _;
var containers = [];
var footworkAnimationClass = 'fw-entity-animate';

var _fixtureCleanup = fixture.cleanup;
fixture.cleanup = function(container) {
  if(!fw) {
    containers.push(container);
  } else {
    typeof container === 'object' && fw.removeNode(container);
  }
  _fixtureCleanup.call(fixture);
};

require(['footwork', 'lodash', 'jquery', 'jquery-mockjax'], function(footwork, lodash, jQuery) {
  fw = footwork;
  $ = jQuery;
  _ = lodash;

  _.extend($.mockjaxSettings, {
    logging: false,
    responseTime: 5
  });

  if(containers.length) {
    var container;
    while(containers.length) {
      fixture.cleanup(containers.pop());
    }
  }
});
