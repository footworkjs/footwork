/* istanbul ignore next */
var _ = require('./lodash');

function alwaysPassPredicate() {
  return true;
}

/**
 * Return the 'result' of a property on an object, either via calling it (using the supplied context and params) or the raw value if it is a non-function value.
 * Note: This is similar to underscore/lodash _.result() but allows you to provide the context and parameters to potential callbacks
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

  if (_.isFunction(object[path])) {
    return object[path].apply(context, params);
  }
  return object[path];
}

function isPromise(thing) {
  return _.isObject(thing) && _.isFunction(thing.then);
}

function promiseIsFulfilled(promise) {
  return !isPromise(promise) || promise.isFulfilled();
}

function hasClassName(element) {
  return _.isObject(element) && _.isString(element.className);
}

function hasClass(element, className) {
  return element.className.match( new RegExp('(\\s|^)' + className + '(\\s|$)') );
}

function addClass(element, className) {
  if (hasClassName(element) && !hasClass(element, className)) {
    element.className += (element.className.length && _.isNull(element.className.match(/ $/)) ? ' ' : '') + className;
  }
}

function removeClass(element, className) {
  if (hasClassName(element) && hasClass(element, className)) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

function nextFrame(callback) {
  setTimeout(callback, 1000 / 30);
};

var trailingSlashRegex = /\/$/;
function isPath(pathOrFile) {
  return _.isString(pathOrFile) && trailingSlashRegex.test(pathOrFile);
}

var startingSlashRegex = /^\//;
function hasPathStart(path) {
  return _.isString(path) && startingSlashRegex.test(path);
}

var startingHashRegex = /^#/;
function hasHashStart(string) {
  return _.isString(string) && startingHashRegex.test(string);
}

/**
 * Return the trailing file extension from a given string.
 *
 * @param {string} fileName
 * @returns {string} The extension at the end of the file (ie: txt)
 */
function getFilenameExtension(fileName) {
  var extension = '';
  if (fileName.indexOf('.') !== -1) {
    extension = _.last(fileName.split('.'));
  }
  return extension;
}

/**
 * Generate a random pseudo-GUID
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @returns {string} The GUID
 */
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

/**
 * parseUri() originally sourced from: http://blog.stevenlevithan.com/archives/parseuri
 *
 * @param {string} url
 * @returns {object} The parsed url data
 */
function parseUri(str) {
  var options = parseUri.options;
  var matchParts = options.parser[ options.strictMode ? "strict" : "loose" ].exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    uri[ options.key[i] ] = matchParts[i] || "";
  }

  uri[ options.q.name ] = {};
  uri[ options.key[12] ].replace(options.q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[options.q.name][$1] = $2;
    }
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
  q: {
    name:   "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

function propertyDispose(property) {
  if (_.isObject(property) && _.isFunction(property.dispose)) {
    property.dispose();
  }
}

function isDocumentFragment(obj) {
  if (window['DocumentFragment']) {
    return obj instanceof DocumentFragment;
  } else {
    return obj && obj.nodeType === 11;
  }
}

function isDomElement(obj) {
  if (window['HTMLElement']) {
    return obj instanceof HTMLElement;
  } else {
    return obj && obj.tagName && obj.nodeType === 1;
  }
}

module.exports = {
  alwaysPassPredicate: alwaysPassPredicate,
  resultBound: resultBound,
  isPromise: isPromise,
  promiseIsFulfilled: promiseIsFulfilled,
  addClass: addClass,
  hasClass: hasClass,
  removeClass: removeClass,
  nextFrame: nextFrame,
  isPath: isPath,
  hasPathStart: hasPathStart,
  hasHashStart: hasHashStart,
  getFilenameExtension: getFilenameExtension,
  guid: guid,
  parseUri: parseUri,
  propertyDispose: propertyDispose,
  isDocumentFragment: isDocumentFragment,
  isDomElement: isDomElement,
  startingHashRegex: startingHashRegex
};
