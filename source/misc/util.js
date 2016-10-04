var _ = require('./lodash');
var minFramesPerSecond = require('./config').minFramesPerSecond;

function alwaysPassPredicate() {
  return true;
}

/**
 * Return the 'result' of a property on an object, either via calling it (using the supplied context and params) or the raw value if it is a non-function value.
 * Note: This is similar to underscore/lodash result() but allows you to provide the context and parameters to potential callbacks
 *
 * @param  {object} object  Object to read property from
 * @param  {string} path    Property name
 * @param  {mixed}  context Context to call the (if existant) function with
 * @param  {array}  params  Parameters to call the callback (object properties) with
 * @return {mixed}          The result of the property on the object
 */
function resultBound(object, path, context, params) {
  params = params || [];
  context = context || object;

  if(_.isFunction(object[path])) {
    return object[path].apply(context, params);
  }
  return object[path];
}

function isPromise(thing) {
  return _.isObject(thing) && _.isFunction(thing.then);
}

function promiseIsResolvedOrRejected(promise) {
  return !isPromise(promise) || _.includes(['resolved', 'rejected'], promise.state());
}

function hasClassName(element) {
  return _.isObject(element) && _.isString(element.className);
}

function hasClass(element, className) {
  return element.className.match( new RegExp('(\\s|^)' + className + '(\\s|$)') );
}

function addClass(element, className) {
  if(hasClassName(element) && !hasClass(element, className)) {
    element.className += (element.className.length && _.isNull(element.className.match(/ $/)) ? ' ' : '') + className;
  }
}

function removeClass(element, className) {
  if(hasClassName(element) && hasClass(element, className)) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

var nextFrame = function(callback) {
  setTimeout(callback, 1000 / minFramesPerSecond);
};

module.exports = {
  alwaysPassPredicate: alwaysPassPredicate,
  resultBound: resultBound,
  isPromise: isPromise,
  promiseIsResolvedOrRejected: promiseIsResolvedOrRejected,
  addClass: addClass,
  removeClass: removeClass,
  nextFrame: nextFrame
};
