var _ = require('lodash');

/**
 * Function which always returns true (a predicate function that always passes as 'true')
 *
 * @returns true
 */
function alwaysPassPredicate () {
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
 * @returns {mixed}          The result of the property on the object
 */
function resultBound (object, path, context, params) {
  object = object || {};
  params = params || [];
  context = context || object;

  if (_.isFunction(object[path])) {
    return object[path].apply(context, params);
  }
  return object[path];
}

/**
 * Determine whether or not the supplied thing is a promise or not
 *
 * @param {any} thing
 * @returns {boolean} true if it is a promise, false if not
 */
function isPromise (thing) {
  return _.isObject(thing) && _.isFunction(thing.then);
}

/**
 * Determines whether or not a promise has been fulfilled.
 *
 * @param {any} promise
 * @returns {boolean} true if fulfilled, false if not
 */
function promiseIsFulfilled (promise) {
  return !isPromise(promise) || promise.isFulfilled();
}
/**
 * Determines whether or not an element has a className property
 *
 * @param {any} element
 * @returns {boolean} true if it has the property, false if not
 */
function hasClassName (element) {
  return _.isObject(element) && _.isString(element.className);
}

/**
 * Determines whether or not the supplied element has the given className.
 *
 * @param {any} element
 * @param {any} className
 * @returns {boolean} true if it has the class, false if not
 */
function hasClass (element, className) {
  return element.className.match( new RegExp('(\\s|^)' + className + '(\\s|$)') );
}

/**
 * Add the specified className to the given element if it is not already there.
 *
 * @param {any} element
 * @param {any} className
 */
function addClass (element, className) {
  if (hasClassName(element) && !hasClass(element, className)) {
    element.className += (element.className.length && _.isNull(element.className.match(/ $/)) ? ' ' : '') + className;
  }
}

/**
 * Remove the specified className from the given element if it exists.
 *
 * @param {any} element
 * @param {any} className
 */
function removeClass (element, className) {
  if (hasClassName(element) && hasClass(element, className)) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

/**
 * Call the supplied callback after the minimum transition time (the next frame).
 *
 * @param {any} callback
 */
function nextFrame (callback) {
  setTimeout(callback, 1000 / 30);
};

var trailingSlashRegex = /\/$/;

/**
 * Determines whether or not the supplied pathOrFile is a path.
 *
 * @param {any} pathOrFile
 * @returns {boolean} true if the supplied pathOrFile is a path, false if not
 */
function isPath (pathOrFile) {
  return _.isString(pathOrFile) && trailingSlashRegex.test(pathOrFile);
}

var startingSlashRegex = /^\//;

/**
 * Determine whether or not the supplied path starts with a slash (/) (is the start of a path)
 *
 * @param {any} path
 * @returns {boolean} true if the supplied path starts with a slash (/), false if not
 */
function hasPathStart (path) {
  return _.isString(path) && startingSlashRegex.test(path);
}

var startingHashRegex = /^#/;
/**
 * Determine whether or not the supplied string starts with a hash mark (#)
 *
 * @param {any} string
 * @returns {boolean} true if the supplied value starts with a hash mark (#)
 */
function hasHashStart (string) {
  return _.isString(string) && startingHashRegex.test(string);
}

/**
 * Return the trailing file extension from a given string.
 *
 * @param {string} fileName
 * @returns {string} The extension at the end of the file (ie: txt)
 */
function getFilenameExtension (fileName) {
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
var guid = (function () {
 function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
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
function parseUri (str) {
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

/**
 * Calls dispose() on the supplied property if it exists.
 *
 * @param {any} property
 */
function propertyDispose (property) {
  if (!_.isUndefined(property) && (_.isFunction(property.dispose) || _.isFunction(property.unsubscribe))) {
    (property.dispose || property.unsubscribe).call(property);
  }
}

/**
 * Determine if the supplied object is a DocumentFragment instance.
 *
 * @param {any} obj
 * @returns {boolean} True if it is a DocumentFragment, false if not
 */
function isDocumentFragment (obj) {
  if (window['DocumentFragment']) {
    return obj instanceof DocumentFragment;
  } else {
    return obj && obj.nodeType === 11;
  }
}

/**
 * Determine if the supplied object is a HTMLElement instance.
 *
 * @param {any} obj
 * @returns {boolean} True if it is a HTMLElement, false if not
 */
function isDomElement (obj) {
  if (window['HTMLElement']) {
    return obj instanceof HTMLElement;
  } else {
    return obj && obj.tagName && obj.nodeType === 1;
  }
}

/**
 * Capitalize the first letter of the supplied string.
 *
 * @param {string} str
 * @returns {string} The original string with the first character upper-cased
 */
function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Return the private data of a viewModel if it exists
 *
 * @param {any} instance
 * @returns {object} The private data on the instance (if found)
 */
function getPrivateData (instance) {
  return instance[require('./config').privateDataSymbol];
}

/**
 * Return either the supplied string key (if Symbol() capability not present) or return a symbol based on that same key.
 *
 * @param {any} str
 * @returns {Symbol|string} The identifier
 */
function getSymbol (str) {
  return typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for(str) : /* istanbul ignore next */ ('__' + str);
}

/**
 * Convert the supplied arrayLikeObject into an array of its elements
 *
 * @param {any} arrayLikeObject
 * @returns {array} New array of original children
 */
function makeArray (arrayLikeObject) {
  for (var i = 0, j = arrayLikeObject.length, convertedArray = []; i < j; i++) {
    convertedArray.push(arrayLikeObject[i]);
  }
  return convertedArray;
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
  startingHashRegex: startingHashRegex,
  capitalizeFirstLetter: capitalizeFirstLetter,
  getPrivateData: getPrivateData,
  getSymbol: getSymbol,
  makeArray: makeArray
};
