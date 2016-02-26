// framework/utility.js
// ----------------

var trailingSlashRegex = /\/$/;
var startingSlashRegex = /^\//;
var startingHashRegex = /^#/;
var regExpMatch = /^\/|\/$/g;

var isObservable = fw.isObservable;

var isFullURLRegex = /(^[a-z]+:\/\/|^\/\/)/i;
var isFullURL = fw.utils.isFullURL = function(thing) {
  return isString(thing) && isFullURLRegex.test(thing);
};

function isPromise(thing) {
  return isObject(thing) && isFunction(thing.then);
}

function promiseIsResolvedOrRejected(promise) {
  return isPromise(promise) && isFunction(promise.state) && includes(['resolved', 'rejected'], promise.state());
}

function isInternalComponent(componentName) {
  return indexOf(internalComponents, componentName) !== -1;
}

function isPath(pathOrFile) {
  return isString(pathOrFile) && trailingSlashRegex.test(pathOrFile);
};

function hasPathStart(path) {
  return isString(path) && startingSlashRegex.test(path);
};

function hasHashStart(string) {
  return isString(string) && startingHashRegex.test(string);
}

function hasClassName(element) {
  return isObject(element) && isString(element.className);
}

function hasClass(element, className) {
  return element.className.match( new RegExp('(\\s|^)' + className + '(\\s|$)') );
}

function addClass(element, className) {
  if( hasClassName(element) && !hasClass(element, className) ) {
    element.className += (element.className.length && isNull(element.className.match(/ $/)) ? ' ' : '') + className;
  }
}

function removeClass(element, className) {
  if( hasClassName(element) && hasClass(element, className) ) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

function makeOrGetRequest(operationType, requestInfo) {
  var requestRunning = requestInfo.requestRunning;
  var requestLull = requestInfo.requestLull;
  var entity = requestInfo.entity;
  var createRequest = requestInfo.createRequest;
  var promiseName = operationType + 'Promise';
  var request = entity.__private(promiseName);
  var allowConcurrent = requestInfo.allowConcurrent;

  if((allowConcurrent || !isObservable(requestRunning) || !requestRunning()) || !request) {
    var newRequest = createRequest();

    if(!isPromise(newRequest) && isFunction(Deferred)) {
      var returnValue = newRequest;
      newRequest = Deferred(function(def) {
        def.resolve(returnValue);
      }).promise();
    }

    request = request || [];
    request.push(newRequest);
    entity.__private(promiseName, request);

    requestRunning(true);
    requestLull = (isFunction(requestLull) ? requestLull(operationType) : requestLull);

    var lullFinished = fw.observable(false);
    var requestFinished = fw.observable(false);

    var requestWatcher = fw.computed(function() {
      if(lullFinished() && requestFinished()) {
        requestRunning(false);
        requestWatcher.dispose();
      }
    });

    if(requestLull) {
      setTimeout(function() {
        lullFinished(true);
      }, requestLull);
    } else {
      lullFinished(true);
    }

    newRequest.always(function() {
      if(every(request, promiseIsResolvedOrRejected)) {
        requestFinished(true);
        entity.__private(promiseName, undefined);
      }
    });
  }

  return newRequest;
}

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * Note: object 'a' can provide a regex value for a property and have it searched matching on the regex value
 * @param  {object} a Object to compare (which can contain regex values for properties)
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function regExpIsEqual(a, b, isEq) {
  isEq = isEq || regExpIsEqual;

  if(isObject(a) && isObject(b)) {
    return every(reduce(a, function(comparison, paramValue, paramName) {
      var isCongruent = false;
      var bParamValue = !isUndefined(b[paramName]) && !isNull(b[paramName]) ? (isObject(b[paramName]) ? b[paramName] : b[paramName].toString()) : b[paramName];
      if(bParamValue) {
        if(isRegExp(paramValue)) {
          isCongruent = !isNull(bParamValue.match(paramValue));
        } else {
          isCongruent = isEq(paramValue, bParamValue);
        }
      }

      comparison.push(isCongruent);
      return comparison;
    }, []));
  } else {
    return a === b;
  }
}

/**
 * Performs an equality comparison between two objects ensuring only the common key values match (and that there is a non-0 number of them)
 * @param  {object} a Object to compare
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function commonKeysEqual(a, b, isEq) {
  isEq = isEq || isEqual;

  if(isObject(a) && isObject(b)) {
    var commonKeys = intersection(keys(a), keys(b));
    return commonKeys.length > 0 && isEq(pick(a, commonKeys), pick(b, commonKeys));
  } else {
    return a === b;
  }
}

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * In other words: A == B, but B does not necessarily == A
 * @param  {object} a Object to compare
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function sortOfEqual(a, b, isEq) {
  isEq = isEq || isEqual;

  if(isObject(a) && isObject(b)) {
    var AKeys = keys(a);
    var BKeys = keys(b);
    var commonKeys = intersection(AKeys, BKeys);
    var hasAllAKeys = every(AKeys, function(Akey) {
      return BKeys.indexOf(Akey) !== -1;
    })
    return commonKeys.length > 0 && hasAllAKeys && isEq(pick(a, commonKeys), pick(b, commonKeys));
  } else {
    return a === b;
  }
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

  if(isFunction(object[path])) {
    return object[path].apply(context, params);
  }
  return object[path];
}

function nearestEntity($context, predicate) {
  var foundEntity = null;

  predicate = predicate || isEntity;
  var predicates = [].concat(predicate);
  function isTheThing(thing) {
    return reduce(predicates, function(isThing, predicate) {
      return isThing || predicate(thing);
    }, false);
  }

  if(isObject($context)) {
    if(isTheThing($context.$data)) {
      // found $data that matches the predicate(s) in this context
      foundEntity = $context.$data;
    } else if(isObject($context.$parentContext) || (isObject($context.$data) && isObject($context.$data.$parentContext))) {
      // search through next parent up the chain
      foundEntity = nearestEntity($context.$parentContext || $context.$data.$parentContext, predicate);
    }
  }
  return foundEntity;
}

function forceViewModelComponentConvention(componentLocation) {
  if(isObject(componentLocation) && isUndefined(componentLocation.viewModel) && isUndefined(componentLocation.combined)) {
    return {
      viewModel: componentLocation.dataModel || componentLocation.router,
      template: componentLocation.template
    };
  }
  return componentLocation;
}

function getFilenameExtension(fileName) {
  var extension = '';
  if(fileName.indexOf('.') !== -1) {
    extension = last(fileName.split('.'));
  }
  return extension;
}

function alwaysPassPredicate() { return true; }
function emptyStringResult() { return ''; }

function propertyDispose(property) {
  if(isObject(property) && isFunction(property.dispose)) {
    property.dispose();
  }
}

// parseUri() originally sourced from: http://blog.stevenlevithan.com/archives/parseuri
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
    if($1) {
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

// Generate a random pseudo-GUID
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
var guid = fw.utils.guid = (function() {
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

// Private data management method
function privateData(privateStore, configParams, propName, propValue) {
  var isGetBaseObjOp = arguments.length === 2;
  var isReadOp = arguments.length === 3;
  var isWriteOp = arguments.length === 4;

  if(isGetBaseObjOp) {
    return privateStore;
  } else if(isReadOp) {
     return propName === 'configParams' ? configParams : privateStore[propName];
  } else if(isWriteOp) {
    privateStore[propName] = propValue;
    return privateStore[propName];
  }
}
