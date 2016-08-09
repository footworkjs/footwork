/**
 * footwork.js - A solid footing for web applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v1.3.0-bare-jquery
 * Url: http://footworkjs.com
 * License(s): MIT
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal', 'jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'), require('jquery'));
  } else {
    root.fw = factory(root._, root.ko, root.postal, root.jQuery);
  }
}(this, function (_, ko, postal, jQuery) {
  var windowObject = window;

  window.require = typeof require !== 'undefined' ? require : undefined;
  window.define = typeof define !== 'undefined' ? define : undefined;

  return (function() {
    // define our own root object to supply to the modules as an attachment point
var root = {};

// supply our root for modules that directly check for the window object
var window = root;

// hide requirejs from the modules (AMD environment)
var define = undefined;

// hide node.js or browserified from the modules (CommonJS environment)
var module = undefined,
    exports = undefined,
    global = undefined;


    _.extend(root, {
      _: _,
      ko: ko,
      postal: postal,
      jQuery: jQuery
    });

    /**
     * Riveter still embedded in 'bare' build as it is problematic when used as a module compared to the other dependencies. It depends on
     * underscore as opposed to lodash...meaning both lodash and underscore would be required if lodash was not substituted for underscore
     * in riveter.
     */
    (function() {
      /**
 * riveter - Mix-in, inheritance and constructor extend behavior for your JavaScript enjoyment.
 * © 2012 - Copyright appendTo, LLC 
 * Author(s): Jim Cowart, Nicholas Cloud, Doug Neiner
 * Version: v0.1.2
 * Url: https://github.com/a2labs/riveter
 * License(s): MIT, GPL
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = factory(require("lodash"));
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["lodash"], function (_) {
            return factory(_, root);
        });
    } else {
        // Browser globals
        root.riveter = factory(root._, root);
    }
}(this, function (_, global, undefined) {
    var slice = Array.prototype.slice;
    var riveter = function () {
        var args = slice.call(arguments, 0);
        while (args.length) {
            riveter.rivet(args.shift());
        }
    };
    riveter.rivet = function (fn) {
        if (!fn.hasOwnProperty("extend")) {
            fn.extend = function (props, ctorProps) {
                return riveter.extend(fn, props, ctorProps);
            };
        }
        if (!fn.hasOwnProperty("compose")) {
            fn.compose = function () {
                return riveter.compose.apply(this, [fn].concat(slice.call(arguments, 0)));
            };
        }
        if (!fn.hasOwnProperty("inherits")) {
            fn.inherits = function (parent, ctorProps) {
                riveter.inherits(fn, parent, ctorProps);
            };
        }
        if (!fn.hasOwnProperty("mixin")) {
            fn.mixin = function () {
                riveter.mixin.apply(this, ([fn].concat(slice.call(arguments, 0))));
            };
        }
    };
    riveter.inherits = function (child, parent, ctorProps) {
        var childProto;
        var TmpCtor = function () {};
        var Child = function () {
            parent.apply(this, arguments);
        };
        if (typeof child === "object") {
            if (child.hasOwnProperty("constructor")) {
                Child = child.constructor;
            }
            childProto = child;
        } else {
            Child = child;
            childProto = child.prototype;
        }
        riveter.rivet(Child);
        _.defaults(Child, parent, ctorProps);
        TmpCtor.prototype = parent.prototype;
        Child.prototype = new TmpCtor();
        _.extend(Child.prototype, childProto, {
            constructor: Child
        });
        Child.__super = parent;
        // Next line is all about Backbone compatibility
        Child.__super__ = parent.prototype;
        return Child;
    };
    riveter.extend = function (ctor, props, ctorProps) {
        return riveter.inherits(props, ctor, ctorProps);
    };
    riveter.compose = function () {
        var args = slice.call(arguments, 0);
        var ctor = args.shift();
        riveter.rivet(ctor);
        var mixin = _.reduce(args, function (memo, val) {
            if (val.hasOwnProperty("_preInit")) {
                memo.preInit.push(val._preInit);
            }
            if (val.hasOwnProperty("_postInit")) {
                memo.postInit.push(val._postInit);
            }
            val = val.mixin || val;
            memo.items.push(val);
            return memo;
        }, {
            items: [],
            preInit: [],
            postInit: []
        });
        var res = ctor.extend({
            constructor: function ( /* options */ ) {
                var args = slice.call(arguments, 0);
                var self = this;
                _.each(mixin.preInit, function (initializer) {
                    initializer.apply(self, args);
                });
                ctor.prototype.constructor.apply(this, args);
                _.each(mixin.postInit, function (initializer) {
                    initializer.apply(self, args);
                });
            }
        });
        riveter.rivet(res);
        _.defaults(res.prototype, _.extend.apply(null, [{}].concat(mixin.items)));
        return res;
    };
    riveter.mixin = function () {
        var args = slice.call(arguments, 0);
        var ctor = args.shift();
        riveter.rivet(ctor);
        _.defaults(ctor.prototype, _.extend.apply(null, [{}].concat(args)));
    };
    return riveter;
}));
    }).call(root);

    (function() {
      /**
 * conduitjs - Give any method a pre/post invocation pipeline....
 * Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 * Version: v0.3.3
 * Url: http://github.com/ifandelse/ConduitJS
 * License: MIT
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory(root));
    } else {
        // Browser globals
        root.Conduit = factory(root);
    }
}(this, function (global, undefined) {
    function Conduit(options) {
        if (typeof options.target !== "function") {
            throw new Error("You can only make functions into Conduits.");
        }
        var _steps = {
            pre: options.pre || [],
            post: options.post || [],
            all: []
        };
        var _defaultContext = options.context;
        var _target = options.target;
        var _targetStep = {
            isTarget: true,
            fn: options.sync ?
            function () {
                var args = Array.prototype.slice.call(arguments, 0);
                var result = _target.apply(_defaultContext, args);
                return result;
            } : function (next) {
                var args = Array.prototype.slice.call(arguments, 1);
                args.splice(1, 1, _target.apply(_defaultContext, args));
                next.apply(this, args);
            }
        };
        var _genPipeline = function () {
            _steps.all = _steps.pre.concat([_targetStep].concat(_steps.post));
        };
        _genPipeline();
        var conduit = function () {
            var idx = 0;
            var retval;
            var phase;
            var next = function next() {
                var args = Array.prototype.slice.call(arguments, 0);
                var thisIdx = idx;
                var step;
                var nextArgs;
                idx += 1;
                if (thisIdx < _steps.all.length) {
                    step = _steps.all[thisIdx];
                    phase = (phase === "target") ? "after" : (step.isTarget) ? "target" : "before";
                    if (options.sync) {
                        if (phase === "before") {
                            nextArgs = step.fn.apply(step.context || _defaultContext, args);
                            next.apply(this, nextArgs || args);
                        } else {
                            retval = step.fn.apply(step.context || _defaultContext, args) || retval;
                            next.apply(this, [retval].concat(args));
                        }
                    } else {
                        step.fn.apply(step.context || _defaultContext, [next].concat(args));
                    }
                }
            };
            next.apply(this, arguments);
            return retval;
        };
        conduit.steps = function () {
            return _steps.all;
        };
        conduit.context = function (ctx) {
            if (arguments.length === 0) {
                return _defaultContext;
            } else {
                _defaultContext = ctx;
            }
        };
        conduit.before = function (step, options) {
            step = typeof step === "function" ? {
                fn: step
            } : step;
            options = options || {};
            if (options.prepend) {
                _steps.pre.unshift(step);
            } else {
                _steps.pre.push(step);
            }
            _genPipeline();
        };
        conduit.after = function (step, options) {
            step = typeof step === "function" ? {
                fn: step
            } : step;
            options = options || {};
            if (options.prepend) {
                _steps.post.unshift(step);
            } else {
                _steps.post.push(step);
            }
            _genPipeline();
        };
        conduit.clear = function () {
            _steps = {
                pre: [],
                post: [],
                all: []
            };
            _genPipeline();
        };
        conduit.target = function (fn) {
            if (fn) {
                _target = fn;
            }
            return _target;
        };
        return conduit;
    };
    return {
        Sync: function (options) {
            options.sync = true;
            return Conduit.call(this, options)
        },
        Async: function (options) {
            return Conduit.call(this, options);
        }
    }
}));
    }).call(root);

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ 'riveter', 'Conduit' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter, jQuery, Conduit) {
      var ajax = jQuery.ajax;
      var Deferred = jQuery.Deferred;
      /**
 * footwork.js - A solid footing for web applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v1.3.0-core
 * Url: http://footworkjs.com
 * License(s): MIT
 */

var fw = ko;
var isFunction = _.isFunction;
var isObject = _.isObject;
var isString = _.isString;
var isBoolean = _.isBoolean;
var isNumber = _.isNumber;
var isUndefined = _.isUndefined;
var isArray = _.isArray;
var isNull = _.isNull;
var contains = _.contains;
var extend = _.extend;
var pick = _.pick;
var each = _.each;
var filter = _.filter;
var bind = _.bind;
var invokeMap = _.invokeMap;
var clone = _.clone;
var reduce = _.reduce;
var has = _.has;
var result = _.result;
var uniqueId = _.uniqueId;
var map = _.map;
var find = _.find;
var omitBy = _.omitBy;
var indexOf = _.indexOf;
var values = _.values;
var reject = _.reject;
var findWhere = _.findWhere;
var once = _.once;
var last = _.last;
var isEqual = _.isEqual;
var noop = _.noop;
var keys = _.keys;
var merge = _.merge;
var pluck = _.pluck;
var first = _.first;
var intersection = _.intersection;
var every = _.every;
var isRegExp = _.isRegExp;
var identity = _.identity;
var includes = _.includes;
var partial = _.partial;
var sortBy = _.sortBy;


// framework/init.js
// ------------------

// Record the footwork version as of this build.
fw.footworkVersion = '1.3.0';

// Expose any embedded dependencies
fw.embed = embedded;

// Directly expose the Deferred factory
fw.deferred = Deferred;

fw.viewModel = {};
fw.dataModel = {};
fw.router = {};
fw.outlet = {};
fw.settings = {};

var runPostInit = [];
var internalComponents = [];
var entityDescriptors = [];
var entityMixins = [];

var entityClass = 'fw-entity';
var entityAnimateClass = 'fw-entity-animate';
var oneFrame = (1000 / 30);
var isEntityCtor;
var isEntity;
var isDataModel;
var isDataModelCtor;
var isRouter;
var activeOutlets = fw.observableArray();
var DefaultViewModel;

runPostInit.unshift(function() {
  DefaultViewModel = fw.viewModel.create({
    namespace: '_DefaultNamespace',
    autoIncrement: true,
    initialize: function(params) {
      if(isObject(params) && isObject(params.$viewModel)) {
        extend(this, params.$viewModel);
      }
    },
    sequenceAnimations: function() {
      return result(fw.settings, 'sequenceAnimations', 0);
    }
  });
});

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

function isNode(thing) {
  var thingIsObject = isObject(thing);
  return (
    thingIsObject ? thing instanceof Node :
    thingIsObject && isNumber(thing.nodeType) === "number" && isString(thing.nodeName)
  );
}

function promiseIsResolvedOrRejected(promise) {
  return !isPromise(promise) || includes(['resolved', 'rejected'], promise.state());
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
  if(hasClassName(element) && !hasClass(element, className)) {
    element.className += (element.className.length && isNull(element.className.match(/ $/)) ? ' ' : '') + className;
  }
}

function removeClass(element, className) {
  if(hasClassName(element) && hasClass(element, className)) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

/**
 * Creates or returns a promise based on the request specified in requestInfo.
 * This function also manages a requestRunning observable on the entity which indicates when the request finishes.
 * Note that there is an optional requestLull which will make the requestRunning observable stay 'true' for
 * atleast the specified duration. If multiple requests are in progress, then it will wait for all to finish.
 *
 * @param  {string} operationType The type of operation being made, used as key to cache running requests
 * @param  {object} requestInfo   Description of the request to make including a createRequest callback to make a new request
 * @return {Promise}              Ajax Promise
 */
function makeOrGetRequest(operationType, requestInfo) {
  var requestRunning = requestInfo.requestRunning;
  var requestLull = requestInfo.requestLull;
  var entity = requestInfo.entity;
  var createRequest = requestInfo.createRequest;
  var promiseName = operationType + 'Promise';
  var allowConcurrent = requestInfo.allowConcurrent;
  var requests = entity.__private(promiseName) || [];
  var theRequest = last(requests);

  if((allowConcurrent || !isObservable(requestRunning) || !requestRunning()) || !requests.length) {
    theRequest = createRequest();

    if(!isPromise(theRequest) && isFunction(Deferred)) {
      // returned value from createRequest() is a value not a promise, lets return the value in a promise
      theRequest = Deferred().resolve(theRequest);

      // extract the promise from the generic (jQuery or D.js) deferred
      theRequest = isFunction(theRequest.promise) ? theRequest.promise() : theRequest.promise;
    }

    requests = requests || [];
    requests.push(theRequest);
    entity.__private(promiseName, requests);

    requestRunning(true);

    var lullFinished = fw.observable(false);
    var requestFinished = fw.observable(false);
    var requestWatcher = fw.computed(function() {
      if(lullFinished() && requestFinished()) {
        requestRunning(false);
        requestWatcher.dispose();
      }
    });

    requestLull = (isFunction(requestLull) ? requestLull(operationType) : requestLull);
    if(requestLull) {
      setTimeout(function() {
        lullFinished(true);
      }, requestLull);
    } else {
      lullFinished(true);
    }

    if(isPromise(theRequest)) {
      (theRequest.always || theRequest.ensure).call(theRequest, function() {
        if(every(requests, promiseIsResolvedOrRejected)) {
          requestFinished(true);
          entity.__private(promiseName, []);
        }
      });
    }
  }

  return theRequest;
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
      var bParamValue = b[paramName];
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

var nextFrame = function(callback) {
  setTimeout(callback, oneFrame);
};


// framework/namespace/init.js
// ----------------

// Prepare an empty namespace stack.
// This is where footwork registers its current working namespace name. Each new namespace is
// 'unshifted' and 'shifted' as they are entered and exited, keeping the most current at
// index 0.
var namespaceStack = [];

// This counter is used when model options { autoIncrement: true } and more than one model
// having the same namespace is instantiated. This is used in the event you do not want
// multiple copies of the same model to share the same namespace (if they do share a
// namespace, they receive all of the same events/messages/commands/etc).
var namespaceNameCounter = {};

// framework/namespace/utility.js
// ----------------

// Returns a normalized namespace name based off of 'name'. It will register the name counter
// if not present and increment it if it is, then return the name (with the counter appended
// if autoIncrement === true and the counter is > 0).
function indexedNamespaceName(name, autoIncrement) {
  if( isUndefined(namespaceNameCounter[name]) ) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + (autoIncrement === true ? namespaceNameCounter[name] : '');
}

// Duck type check for a namespace object
function isNamespace(thing) {
  return isObject(thing) && !!thing.__isNamespace;
}

// enterNamespaceName() adds a namespaceName onto the namespace stack at the current index,
// 'entering' into that namespace (it is now the current namespace).
// The namespace object returned from this method also has a pointer to its parent
function enterNamespaceName(namespaceName) {
  namespaceStack.unshift( namespaceName );
  return fw.namespace( fw.utils.currentNamespaceName() );
}

// enterNamespace() uses a current namespace definition as the one to enter into.
function enterNamespace(namespace) {
  namespaceStack.unshift( namespace.getName() );
  return namespace;
}

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack
function exitNamespace() {
  namespaceStack.shift();
  return fw.utils.currentNamespace();
}

// framework/namespace/proto.js
// ----------------

function createEnvelope(topic, data, expires) {
  var envelope = {
    topic: topic,
    data: data
  };

  if( !isUndefined(expires) ) {
    envelope.headers = { preserve: true };
    if(expires instanceof Date) {
      envelope.expires = expires;
    }
  }

  return envelope;
}

// Method used to trigger an event on a namespace
function triggerEventOnNamespace(eventKey, params, expires) {
  this.publish( createEnvelope('event.' + eventKey, params, expires) );
  return this;
}

// Method used to register an event handler on a namespace
function registerNamespaceEventHandler(eventKey, callback, context) {
  if( !isUndefined(context) ) {
    callback = callback.bind(context);
  }

  var handlerSubscription = this._subscribe('event.' + eventKey, callback);
  this.eventHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to unregister an event handler on a namespace
function unregisterNamespaceHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

// Method used to send a command to a namespace
function sendCommandToNamespace(commandKey, params, expires) {
  this.publish( createEnvelope('command.' + commandKey, params, expires) );
  return this;
}

// Method used to register a command handler on a namespace
function registerNamespaceCommandHandler(commandKey, callback, context) {
  if( !isUndefined(context) ) {
    callback = callback.bind(context);
  }

  var handlerSubscription = this._subscribe('command.' + commandKey, callback);
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to issue a request for data from a namespace, returning the response (or undefined if no response)
// This method will return an array of responses if more than one is received.
function requestResponseFromNamespace(requestKey, params, allowMultipleResponses) {
  var response = undefined;
  var responseSubscription;

  responseSubscription = this._subscribe('request.' + requestKey + '.response', function(reqResponse) {
    if( isUndefined(response) ) {
      response = allowMultipleResponses ? [reqResponse] : reqResponse;
    } else if(allowMultipleResponses) {
      response.push(reqResponse);
    }
  });

  this.publish( createEnvelope('request.' + requestKey, params) );
  responseSubscription.unsubscribe();

  return response;
}

// Method used to register a request handler on a namespace.
// Requests sent using the specified requestKey will be called and passed in any params specified, the return value is passed back to the issuer
function registerNamespaceRequestHandler(requestKey, callback, context) {
  if( !isUndefined(context) ) {
    callback = callback.bind(context);
  }

  var requestHandler = function(params) {
    var callbackResponse = callback(params);
    this.publish( createEnvelope('request.' + requestKey + '.response', callbackResponse) );
  }.bind(this);

  var handlerSubscription = this._subscribe('request.' + requestKey, requestHandler);
  this.requestHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// This effectively shuts down all requests, commands, events, and subscriptions by unsubscribing all handlers on a discreet namespace object
var handlerRepos = ['requestHandlers', 'commandHandlers', 'eventHandlers', 'subscriptions'];
function disconnectNamespaceHandlers() {
  var namespace = this;
  each(handlerRepos, function(handlerRepo) {
    invokeMap(namespace[handlerRepo], 'unsubscribe');
  });
  return this;
}

function getNamespaceName() {
  return this.channel;
}

// framework/namespace/entityMixins.js
// ----------------

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
entityMixins.push({
  runBeforeInit: true,
  _preInit: function( options ) {
    var $configParams = this.__private('configParams');
    var mainNamespace = $configParams.namespace || $configParams.name || uniqueId('namespace');
    this.$namespace = enterNamespaceName( indexedNamespaceName(mainNamespace, $configParams.autoIncrement) );
    this.$rootNamespace = fw.namespace(mainNamespace);
    this.$globalNamespace = fw.namespace();
  },
  mixin: {
    getNamespaceName: function() {
      return this.$namespace.getName();
    }
  },
  _postInit: function( options ) {
    exitNamespace();
  }
});


// Return the current namespace name.
fw.utils.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
fw.utils.currentNamespace = function() {
  return fw.namespace( fw.utils.currentNamespaceName() );
};

// Creates and returns a new namespace instance
fw.namespace = function(namespaceName, $parentNamespace) {
  if( !isUndefined($parentNamespace) ) {
    if( isString($parentNamespace) ) {
      namespaceName = $parentNamespace + '.' + namespaceName;
    } else if( !isUndefined($parentNamespace.channel) ) {
      namespaceName = $parentNamespace.channel + '.' + namespaceName;
    }
  }
  var namespace = postal.channel(namespaceName);

  var subscriptions = namespace.subscriptions = [];
  namespace._subscribe = namespace.subscribe;
  namespace.subscribe = function(topic, callback, context) {
    if(arguments.length > 2) {
      callback = callback.bind(context);
    }
    var subscription = namespace._subscribe.call(namespace, topic, callback);
    subscriptions.push(subscription);
    return subscription;
  };
  namespace.unsubscribe = unregisterNamespaceHandler;

  namespace._publish = namespace.publish;
  namespace.publish = function(envelope, callback, context) {
    if(arguments.length > 2) {
      callback = callback.bind(context);
    }
    namespace._publish.call(namespace, envelope, callback);
  };

  namespace.__isNamespace = true;
  namespace.dispose = disconnectNamespaceHandlers.bind(namespace);

  namespace.commandHandlers = [];
  namespace.command = sendCommandToNamespace.bind(namespace);
  namespace.command.handler = registerNamespaceCommandHandler.bind(namespace);
  namespace.command.unregister = unregisterNamespaceHandler;

  namespace.requestHandlers = [];
  namespace.request = requestResponseFromNamespace.bind(namespace);
  namespace.request.handler = registerNamespaceRequestHandler.bind(namespace);
  namespace.request.unregister = unregisterNamespaceHandler;

  namespace.eventHandlers = [];
  namespace.event = namespace.trigger = triggerEventOnNamespace.bind(namespace);
  namespace.event.handler = registerNamespaceEventHandler.bind(namespace);
  namespace.event.unregister = unregisterNamespaceHandler;

  namespace.getName = getNamespaceName.bind(namespace);
  namespace.enter = function() {
    return enterNamespace( this );
  };
  namespace.exit = function() {
    if(fw.utils.currentNamespaceName() === this.getName()) {
      return exitNamespace();
    }
  };

  return namespace;
};


// framework/broadcastable-receivable/broacastable.js
// ------------------

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcastAs = function(varName, option) {
  var broadcastable = this;
  var namespace;
  var subscriptions = [];
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;

  if( isObject(varName) ) {
    option = varName;
  } else {
    if( isBoolean(option) ) {
      option = {
        name: varName,
        writable: option
      };
    } else if( isObject(option) ) {
      option = extend({
        name: varName
      }, option);
    } else if( isString(option) ) {
      option = extend({
        name: varName,
        namespace: option
      }, option);
    } else {
      option = {
        name: varName
      };
    }
  }

  namespace = option.namespace || fw.utils.currentNamespace();
  if( isString(namespace) ) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if( !isNamespace(namespace) ) {
    throw new Error('Invalid namespace provided for broadcastAs() observable.');
  }

  if( option.writable ) {
    namespaceSubscriptions.push( namespace.subscribe( '__change.' + option.name, function( newValue ) {
      broadcastable( newValue );
    }) );
  }

  broadcastable.broadcast = function() {
    namespace.publish( option.name, broadcastable() );
    return this;
  };

  namespaceSubscriptions.push( namespace.subscribe( '__refresh.' + option.name, function() {
    namespace.publish( option.name, broadcastable() );
  }) );
  subscriptions.push( broadcastable.subscribe(function( newValue ) {
    namespace.publish( option.name, newValue );
  }) );

  broadcastable.dispose = function() {
    invokeMap(namespaceSubscriptions, 'unsubscribe');
    invokeMap(subscriptions, 'dispose');
    if( isLocalNamespace ) {
      namespace.dispose();
    }
  };

  broadcastable.__isBroadcastable = true;
  return broadcastable.broadcast();
};

// framework/broadcastable-receivable/receivable.js
// ------------------

// factory method which turns an observable into a receivable
fw.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var receivable = this;
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;
  var when = alwaysPassPredicate;

  if( isString(namespace) ) {
    namespace = fw.namespace( namespace );
    isLocalNamespace = true;
  }

  if( !isNamespace(namespace) ) {
    throw new Error('Invalid namespace provided for receiveFrom() observable.');
  }

  receivable = fw.computed({
    read: target,
    write: function( value ) {
      namespace.publish( '__change.' + variable, value );
    }
  });

  receivable.refresh = function() {
    namespace.publish( '__refresh.' + variable );
    return this;
  };

  namespaceSubscriptions.push( namespace.subscribe( variable, function( newValue ) {
    if(when(newValue)) {
      target(newValue);
    } else {
      target(undefined);
    }
  }) );

  var observableDispose = receivable.dispose;
  receivable.dispose = function() {
    invokeMap(namespaceSubscriptions, 'unsubscribe');
    if( isLocalNamespace ) {
      namespace.dispose();
    }
    observableDispose.call(receivable);
  };

  receivable.when = function(predicate) {
    if(isFunction(predicate)) {
      when = predicate;
    } else {
      when = function(updatedValue) {
        return isEqual(updatedValue, predicate);
      };
    }
    return this;
  };

  receivable.__isReceivable = true;
  return receivable.refresh();
};


fw.isBroadcastable = function(thing) {
  return isObject(thing) && !!thing.__isBroadcastable;
};

fw.isReceivable = function(thing) {
  return isObject(thing) && !!thing.__isReceivable;
};

// framework/entities/viewModel/ViewModel.js
// ------------------

var ViewModel = function(descriptor, configParams) {
  return {
    mixin: {
      disposeWithInstance: function(subscription) {
        if(isArray(subscription)) {
          var self = this;
          each(subscription, function(sub) {
            self.disposeWithInstance(sub);
          });
        } else {
          var subscriptions = this.__private('subscriptions');
          if(!isArray(subscriptions)) {
            subscriptions = [];
          }

          subscription && subscriptions.push(subscription);
          this.__private('subscriptions', subscriptions);
        }
      },
      dispose: function() {
        if( !this._isDisposed ) {
          this._isDisposed = true;
          if( configParams.onDispose !== noop ) {
            configParams.onDispose.call(this, this.__private('element'));
          }
          each(this, propertyDispose);
          each(this.__private('subscriptions') || [], propertyDispose);
        }
        return this;
      }
    },
    _postInit: function() {
      this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
        if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
          var myNamespaceName = this.$namespace.getName();
          if(isArray(options.namespaceName) && indexOf(options.namespaceName, myNamespaceName) !== -1) {
            return this;
          } else if(isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
            return this;
          }
        } else {
          return this;
        }
      }.bind(this));
    }
  };
};


// framework/entities/dataModel/utility.js
// ------------------

var dataModelContext = [];
function enterDataModelContext(dataModel) {
  dataModelContext.unshift(dataModel);
}
function exitDataModelContext() {
  dataModelContext.shift();
}

function currentDataModelContext() {
  return dataModelContext.length ? dataModelContext[0] : null;
}

function getPrimaryKey(dataModel) {
  return dataModel.__private('configParams').idAttribute;
}

function insertValueIntoObject(rootObject, fieldMap, fieldValue) {
  if(isString(fieldMap)) {
    return insertValueIntoObject(rootObject, fieldMap.split('.'), fieldValue);
  }

  var propName = fieldMap.shift();
  if(fieldMap.length) {
    if(isUndefined(rootObject[propName])) {
      // nested property, lets add the container object
      rootObject[propName] = {};
    }
    // recurse into the next layer
    insertValueIntoObject(rootObject[propName], fieldMap, fieldValue);
  } else {
    rootObject[propName] = fieldValue;
  }

  return rootObject;
}

function getNestedReference(rootObject, fieldMap) {
  var propName = fieldMap;

  if(!isUndefined(fieldMap)) {
    if(isString(fieldMap)) {
      // initial call with string based fieldMap, recurse into main loop
      return getNestedReference(rootObject, fieldMap.split('.'));
    }

    propName = fieldMap.shift();
    if(fieldMap.length) {
      // recurse into the next layer
      return getNestedReference((rootObject || {})[propName], fieldMap);
    }
  }

  return !isString(propName) ? rootObject : result(rootObject || {}, propName);
}

// framework/persistence/sync.js
// ------------------

// Map from CRUD to HTTP for our default `fw.sync` implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch':  'PATCH',
  'delete': 'DELETE',
  'read':   'GET'
};

var parseURLRegex = /^(http[s]*:\/\/[a-zA-Z0-9:\.]*)*([\/]{0,1}[\w\.:\/-]*)$/;
var parseParamsRegex = /(:[\w\.]+)/g;

function noURLError() {
  throw new Error('A "url" property or function must be specified');
};

fw.sync = function(action, concern, params) {
  params = params || {};
  action = action || 'noAction';

  if(!isDataModel(concern) && !isCollection(concern)) {
    throw new Error('Must supply a dataModel or collection to fw.sync()');
  }

  var configParams = concern.__private('configParams');
  var options = extend({
    type: methodMap[action],
    dataType: 'json',
    url: null,
    data: null,
    headers: {},
    emulateHTTP: fw.settings.emulateHTTP,
    emulateJSON: fw.settings.emulateJSON
  }, resultBound(configParams, 'ajaxOptions', concern, [params]) || {}, params);

  if(!isString(options.type)) {
    throw new Error('Invalid action (' + action + ') specified for sync operation');
  }

  var url = options.url;
  if(isNull(url)) {
    url = configParams.url;
    if(isFunction(url)) {
      url = url.call(concern, action);
    } else if(!isString(url)) {
      var thing = (isDataModel(concern) && 'dataModel') || (isCollection(concern) && 'collection') || 'UNKNOWN';
      throw new Error('Must provide a URL for/on a ' + thing + ' configuration in order to call .sync() on it');
    }

    if(isDataModel(concern)) {
      var pkIsSpecifiedByUser = !isNull(url.match(':' + configParams.idAttribute));
      var hasQueryString = !isNull(url.match(/\?/));
      if(includes(['read', 'update', 'patch', 'delete'], action) && configParams.useKeyInUrl && !pkIsSpecifiedByUser && !hasQueryString) {
        // need to append /:id to url
        url = url.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute;
      }
    }
  }

  var urlPieces = (url || noURLError()).match(parseURLRegex);
  if(!isNull(urlPieces)) {
    var baseURL = urlPieces[1] || '';
    options.url = baseURL + last(urlPieces);
  } else {
    options.url = url;
  }

  if(isDataModel(concern)) {
    // replace any interpolated parameters
    var urlParams = options.url.match(parseParamsRegex);
    if(urlParams) {
      each(urlParams, function(param) {
        options.url = options.url.replace(param, concern.get(param.substr(1)));
      });
    }
  }

  if(isNull(options.data) && concern && includes(['create', 'update', 'patch'], action)) {
    options.contentType = 'application/json';
    options.data = JSON.stringify(options.attrs || concern.get());
  }

  // For older servers, emulate JSON by encoding the request into an HTML-form.
  if(options.emulateJSON) {
    options.contentType = 'application/x-www-form-urlencoded';
    options.data = options.data ? { model: options.data } : {};
  }

  // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
  // And an `X-HTTP-Method-Override` header.
  if(options.emulateHTTP && includes(['PUT', 'DELETE', 'PATCH'], options.type)) {
    options.type = 'POST';

    if(options.emulateJSON) {
      options.data._method = options.type;
    }
    extend(options.headers, { 'X-HTTP-Method-Override': options.type });
  }

  // Don't process data on a non-GET request.
  if(options.type !== 'GET' && !options.emulateJSON) {
    options.processData = false;
  }

  // Pass along `textStatus` and `errorThrown` from jQuery.
  var error = options.error;
  options.error = function(xhr, textStatus, errorThrown) {
    options.textStatus = textStatus;
    options.errorThrown = errorThrown;
    if (error) error.call(options.context, xhr, textStatus, errorThrown);
  };

  var xhr = options.xhr = fw.ajax(options);
  concern.$namespace.publish('_.request', { dataModel: concern, xhr: xhr, options: options });
  return xhr;
};

// framework/entities/dataModel/mapTo.js
// ------------------

fw.subscribable.fn.mapTo = function(option) {
  var mappedObservable = this;
  var mapPath;
  var dataModel;

  if(isString(option)) {
    mapPath = option;
    dataModel = currentDataModelContext();
  } else if(isObject(option)) {
    mapPath = option.path;
    dataModel = option.dataModel;
  } else {
    throw new Error('Invalid options supplied to mapTo');
  }

  if(!isDataModel(dataModel)) {
    throw new Error('No dataModel context found/supplied for mapTo observable');
  }

  var mappings = dataModel.__private('mappings')();
  var primaryKey = getPrimaryKey(dataModel);

  if(!isUndefined(mappings[mapPath]) && isFunction(mappings[mapPath].dispose)) {
    // remapping a path, we need to dispose of the old one first
    mappings[mapPath].dispose();
  }

  // add/set the registry entry for the mapped observable
  mappings[mapPath] = mappedObservable;

  if(mapPath === primaryKey) {
    // mapping primary key, update/set the $id property on the dataModel
    dataModel.$id = mappings[mapPath];
    if(isObservable(dataModel.isNew) && isFunction(dataModel.isNew.dispose)) {
      dataModel.isNew.dispose();
    }
    dataModel.isNew = fw.pureComputed(dataModelIsNew, dataModel);
  }

  mappedObservable.isDirty = fw.observable(false);
  var changeSubscription = mappedObservable.subscribe(function(value) {
    dataModel.$namespace.publish('_.change', { param: mapPath, value: value });
    mappedObservable.isDirty(true);
  });

  var disposeObservable = mappedObservable.dispose || noop;
  if(isFunction(mappedObservable.dispose)) {
    mappedObservable.dispose = function() {
      changeSubscription.dispose();
      disposeObservable.call(mappedObservable);
    };
  }

  dataModel.__private('mappings').valueHasMutated();

  return mappedObservable;
};

// framework/entities/dataModel/DataModel.js
// ------------------

function dataModelIsNew() {
  var id = this.$id();
  return isUndefined(id) || isNull(id);
}

var DataModel = function(descriptor, configParams) {
  return {
    runBeforeInit: true,
    _preInit: function(params) {
      params = params || {};
      enterDataModelContext(this);
      var pkField = configParams.idAttribute;
      this.__private('mappings', fw.observable({}));

      this.isCreating = fw.observable(false);
      this.isSaving = fw.observable(false);
      this.isFetching = fw.observable(false);
      this.isDestroying = fw.observable(false);
      this.requestInProgress = fw.pureComputed(function() {
        return this.isCreating() || this.isSaving() || this.isFetching() || this.isDestroying();
      }, this);

      this.$cid = fw.utils.guid();
      this[pkField] = this.$id = fw.observable(params[pkField]).mapTo(pkField);

      this.isNew = fw.pureComputed(dataModelIsNew, this);
    },
    mixin: {
      // GET from server and set in model
      fetch: function(options) {
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isFetching,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            var id = dataModel[configParams.idAttribute]();
            if(id) {
              // retrieve data dataModel the from server using the id
              var xhr = dataModel.sync('read', dataModel, options);

              return (xhr.done || xhr.then).call(xhr, function(response) {
                var parsedResponse = configParams.parse ? configParams.parse(response) : response;
                if(!isUndefined(parsedResponse[configParams.idAttribute])) {
                  dataModel.set(parsedResponse);
                }
              });
            }

            return false;
          }
        };

        return makeOrGetRequest('fetch', requestInfo);
      },

      // PUT / POST / PATCH to server
      save: function(key, val, options) {
        var dataModel = this;
        var attrs = null;

        if(isObject(key) && !isNode(key)) {
          attrs = key;
          options = val;
        } else if(isString(key) && arguments.length > 1) {
          (attrs = {})[key] = val;
        }

        if(isObject(options) && isFunction(options.stopPropagation)) {
          // method called as a result of an event binding, ignore its 'options'
          options = {};
        }

        options = extend({
          parse: true,
          wait: false,
          patch: false
        }, options);

        if(method === 'patch' && !options.attrs) {
          options.attrs = attrs;
        }

        var method = isUndefined(dataModel.$id()) ? 'create' : (options.patch ? 'patch' : 'update');
        var requestInfo = {
          requestRunning: (method === 'create' ? dataModel.isCreating : dataModel.isSaving),
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            if(!options.wait && !isNull(attrs)) {
              dataModel.set(attrs);
            }

            var xhr = dataModel.sync(method, dataModel, options);
            return (xhr.done || xhr.then).call(xhr, function(response) {
              var resourceData = configParams.parse ? configParams.parse(response) : response;

              if(options.wait && !isNull(attrs)) {
                resourceData = extend({}, attrs, resourceData);
              }

              if(isObject(resourceData)) {
                dataModel.set(resourceData);
              }
            });
          }
        };

        return makeOrGetRequest('save', requestInfo);
      },

      // DELETE
      destroy: function(options) {
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isDestroying,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            if(dataModel.isNew()) {
              return false;
            }

            options = options ? clone(options) : {};
            var success = options.success;
            var wait = options.wait;

            var sendDestroyEvent = function() {
              dataModel.$namespace.publish('destroy', options);
            };

            if(!options.wait) {
              sendDestroyEvent();
            }

            var xhr = dataModel.sync('delete', dataModel, options);
            return (xhr.done || xhr.then).call(xhr, function() {
              dataModel.$id(undefined);
              if(options.wait) {
                sendDestroyEvent();
              }
            });
          }
        };

        return makeOrGetRequest('destroy', requestInfo);
      },

      // set attributes in model (clears isDirty on observables/fields it saves to by default)
      set: function(key, value, options) {
        var attributes = {};

        if(isString(key)) {
          attributes = insertValueIntoObject(attributes, key, value);
        } else if(isObject(key)) {
          attributes = key;
          options = value;
        }

        options = extend({
          clearDirty: true
        }, options);

        var mappingsChanged = false;
        var model = this;
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          var fieldValue = getNestedReference(attributes, fieldMap);
          if(!isUndefined(fieldValue)) {
            fw.isWriteableObservable(fieldObservable) && fieldObservable(fieldValue);
            mappingsChanged = true;
            options.clearDirty && fieldObservable.isDirty(false);
            model.$namespace.publish('_.change.' + fieldMap, fieldValue);
          }
        });

        if(mappingsChanged && options.clearDirty) {
          // we updated the dirty state of a/some field(s), lets tell the dataModel $dirty computed to (re)run its evaluator function
          this.__private('mappings').valueHasMutated();
        }
      },

      get: function(referenceField, includeRoot) {
        var dataModel = this;
        if(isArray(referenceField)) {
          return reduce(referenceField, function(jsObject, fieldMap) {
            return merge(jsObject, dataModel.get(fieldMap, true));
          }, {});
        } else if(!isUndefined(referenceField) && !isString(referenceField)) {
          throw new Error(dataModel.$namespace.getName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.get().');
        }

        var mappedObject = reduce(this.__private('mappings')(), function reduceModelToObject(jsObject, fieldObservable, fieldMap) {
          if(isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
            insertValueIntoObject(jsObject, fieldMap, fieldObservable());
          }
          return jsObject;
        }, {});

        return includeRoot ? mappedObject : getNestedReference(mappedObject, referenceField);
      },

      getData: function() {
        return this.get();
      },

      toJSON: function() {
        return JSON.stringify(this.getData());
      },

      clean: function(field) {
        if(!isUndefined(field)) {
          var fieldMatch = new RegExp('^' + field + '$|^' + field + '\..*');
        }
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          if(isUndefined(field) || fieldMap.match(fieldMatch)) {
            fieldObservable.isDirty(false);
          }
        });
      },

      sync: function() {
        return fw.sync.apply(this, arguments);
      },

      hasMappedField: function(referenceField) {
        return !!this.__private('mappings')()[referenceField];
      },

      dirtyMap: function() {
        var tree = {};
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          tree[fieldMap] = fieldObservable.isDirty();
        });
        return tree;
      }
    },
    _postInit: function() {
      if(configParams.autoIncrement) {
        this.$rootNamespace.request.handler('get', function() { return this.get(); }.bind(this));
      }
      this.$namespace.request.handler('get', function() { return this.get(); }.bind(this));

      this.isDirty = fw.computed(function() {
        return reduce(this.__private('mappings')(), function(isDirty, mappedField) {
          return isDirty || mappedField.isDirty();
        }, false);
      }, this);

      exitDataModelContext();
    }
  };
};


runPostInit.push(function(runTask) {
  fw.ajax = ajax;
  extend(fw.settings, {
    emulateHTTP: false,
    emulateJSON: false
  });
});

// framework/entities/router/init.js
// ------------------

// Regular expressions used to parse a uri
var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatchRegex = /(^\/#)/;

var noComponentSelected = '_noComponentSelected';
var nullComponent = '_nullComponent';
var invalidRoutePathIdentifier = '___invalid-route';

var routesAreCaseSensitive = true;

var nullRouterData = {
  context: noop,
  childRouters: extend( noop.bind(), { push: noop } ),
  isRelative: function() { return false; }
};

var $nullRouter = {
  path: emptyStringResult,
  __private: function(propName) {
    if(arguments.length) {
      return nullRouterData[propName];
    }
    return nullRouterData;
  },
  path: function() { return ''; },
  __isNullRouter: true
};

var baseRoute = {
  controller: noop,
  indexedParams: [],
  namedParams: {},
  __isRoute: true
};

var baseRouteDescription = {
  filter: alwaysPassPredicate,
  __isRouteDesc: true
};

// framework/entities/router/utility.js
// -----------

function transformRouteConfigToDesc(routeDesc) {
  return extend({ id: uniqueId('route') }, baseRouteDescription, routeDesc );
}

function sameRouteDescription(desc1, desc2) {
  return desc1.id === desc2.id && isEqual(desc1.indexedParams, desc2.indexedParams) && isEqual(desc1.namedParams, desc2.namedParams);
}

// Convert a route string to a regular expression which is then used to match a uri against it and determine
// whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp(routeString) {
  routeString = routeString
    .replace(escapeRegex, "\\$&")
    .replace(optionalParamRegex, "(?:$1)?")
    .replace(namedParamRegex, function(match, optional) {
      return optional ? match : "([^\/]+)";
    })
    .replace(splatParamRegex, "(.*?)");

  return new RegExp('^' + routeString + (routeString !== '/' ? '(\\/.*)*$' : '$'), routesAreCaseSensitive ? undefined : 'i');
}

function historyIsReady() {
  var typeOfHistory = typeof History;
  var isReady = ['function','object'].indexOf(typeOfHistory) !== -1 && has(History, 'Adapter');

  if(isReady && !History.Adapter.isSetup) {
    History.Adapter.isSetup = true;

    // why .unbind() is not already present in History.js is beyond me
    History.Adapter.unbind = function(callback) {
      each(History.Adapter.handlers, function(handler) {
        handler.statechange = filter(handler.statechange, function(stateChangeHandler) {
          return stateChangeHandler !== callback;
        });
      });
    };
  }

  return isReady;
}

function isNullRouter(thing) {
  return isObject(thing) && !!thing.__isNullRouter;
}

function isRoute(thing) {
  return isObject(thing) && !!thing.__isRoute;
}

function isOutletViewModel(thing) {
  return isObject(thing) && thing.__isOutlet;
}

// Locate the nearest $router from a given ko $context
// (travels up through $parentContext chain to find the router if not found on the
// immediate $context). Returns $nullRouter if none is found.
function nearestParentRouter($context) {
  return nearestEntity($context, isRouter) || $nullRouter;
}

// framework/entities/router/outlet.js
// ------------------

var noParentViewModelError = { $namespace: { getName: function() { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };
var defaultLoadingComponent = 'default-loading-display';

// This custom binding binds the outlet element to the $outlet on the router, changes on its 'route' (component definition observable) will be applied
// to the UI and load in various views
fw.virtualElements.allowedBindings.$outletBinder = true;
fw.bindingHandlers.$outletBinder = {
  init: function(element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var $parentViewModel = (isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var $parentRouter = nearestParentRouter(bindingContext);
    var outletName = outletViewModel.outletName;

    if(isRouter($parentRouter)) {
      // register the viewModel with the outlet for future use when its route is changed
      $parentRouter.__private('registerViewModelForOutlet')(outletName, outletViewModel);
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        // tell the router to clean up its reference to the outletViewModel
        $parentRouter.__private('unregisterViewModelForOutlet')(outletName);
        outletViewModel.dispose();
      });

      // register this outlet with its $parentRouter
      outletViewModel.route = $parentRouter.outlet(outletName);
    } else {
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + $parentViewModel.$namespace.getName() + '] but no router was defined.');
    }
  }
};

function registerViewModelForOutlet(outletName, outletViewModel) {
  var outletProperties = this.outlets[outletName] || {};
  outletProperties.outletViewModel = outletViewModel;
}

function unregisterViewModelForOutlet(outletName) {
  var outletProperties = this.outlets[outletName] || {};
  delete outletProperties.outletViewModel;
}

function routerOutlet(outletName, componentToDisplay, options) {
  options = options || {};
  if(isFunction(options)) {
    options = { onComplete: options, onFailure: noop };
  }

  var router = this;
  var viewModelParameters = options.params;
  var onComplete = options.onComplete || noop;
  var onFailure = options.onFailure || noop;
  var configParams = router.__private('configParams');
  var outlets = router.outlets;
  var outletProperties = outlets[outletName] || {};
  var outlet = outletProperties.routeObservable;
  var outletViewModel = outletProperties.outletViewModel;

  if(!isObservable(outlet)) {
    // router outlet observable not found, we must create a new one
    outlet = fw.observable({
      name: noComponentSelected,
      params: {},
      getOnCompleteCallback: function() { return noop; },
      onFailure: onFailure.bind(router)
    });

    // register the new outlet under its outletName
    outlets[outletName] = {
      outletViewModel: outletProperties.outletViewModel || null,
      routeObservable: outlet
    };
  }

  var currentOutletDef = outlet();
  var valueHasMutated = false;

  if(arguments.length > 1 && !componentToDisplay) {
    componentToDisplay = nullComponent;
  }

  if(!isUndefined(componentToDisplay)) {
    if(currentOutletDef.name !== componentToDisplay) {
      currentOutletDef.name = componentToDisplay;
      valueHasMutated = true;
    }

    if(isObject(viewModelParameters)) {
      currentOutletDef.params = viewModelParameters;
      valueHasMutated = true;
    }
  }

  if(outletViewModel) {
    // Show the loading component (if one is defined)
    var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay || currentOutletDef.name]);

    if(showDuringLoadComponent === true || (!showDuringLoadComponent &&  resultBound(fw.router, 'showDefaultLoader', router, [outletName, componentToDisplay || currentOutletDef.name]))) {
      showDuringLoadComponent = defaultLoadingComponent;
    }

    if(showDuringLoadComponent) {
      outletViewModel.loadingDisplay(showDuringLoadComponent);
    }
  }

  if(valueHasMutated) {
    clearSequenceQueue();

    currentOutletDef.minTransitionPeriod = resultBound(configParams, 'minTransitionPeriod', router, [outletName, componentToDisplay]);
    if(outletViewModel) {
      outletViewModel.inFlightChildren([]);
      outletViewModel.routeIsLoading(true);
    }

    currentOutletDef.getOnCompleteCallback = function(element) {
      var outletElement = element.parentNode;

      activeOutlets.remove(outlet);
      outletElement.setAttribute('rendered', (componentToDisplay === nullComponent ? '' : componentToDisplay));

      return function addBindingOnComplete() {
        var outletViewModel = router.outlets[outletName].outletViewModel;
        if(outletViewModel) {
          outletViewModel.routeIsLoading(false);
        }

        onComplete.call(router, outletElement);
      };
    };

    if(activeOutlets().indexOf(outlet) === -1) {
      activeOutlets.push(outlet);
    }

    outlet.valueHasMutated();
  }

  return outlet;
};

var outletLoadingDisplay = 'fw-loading-display';
var outletLoadedDisplay = 'fw-loaded-display';
var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };
var removeAnimation = {};
removeAnimation[entityAnimateClass] = false;
var addAnimation = {};
addAnimation[entityAnimateClass] = true;

function registerOutletComponent() {
  internalComponents.push('outlet');
  fw.components.register('outlet', {
    viewModel: function(params) {
      var outlet = this;

      this.outletName = fw.unwrap(params.name);
      this.__isOutlet = true;

      this.loadingDisplay = fw.observable(nullComponent);
      this.inFlightChildren = fw.observableArray();
      this.routeIsLoading = fw.observable(true);
      this.routeIsResolving = fw.observable(true);

      var resolvedCallbacks = [];
      this.addResolvedCallbackOrExecute = function(callback) {
        if(outlet.routeIsResolving()) {
          resolvedCallbacks.push(callback);
        } else {
          callback();
        }
      };

      this.routeIsLoadingSub = this.routeIsLoading.subscribe(function(routeIsLoading) {
        if(routeIsLoading) {
          outlet.routeIsResolving(true);
        } else {
          if(outlet.flightWatch && isFunction(outlet.flightWatch.dispose)) {
            outlet.flightWatch.dispose();
          }

          // must allow binding to begin on any subcomponents/etc
          nextFrame(function() {
            if(outlet.inFlightChildren().length) {
              outlet.flightWatch = outlet.inFlightChildren.subscribe(function(inFlightChildren) {
                if(!inFlightChildren.length) {
                  outlet.routeIsResolving(false);
                }
              });
            } else {
              outlet.routeIsResolving(false);
            }
          });
        }
      });

      this.loadingStyle = fw.observable();
      this.loadedStyle = fw.observable();
      this.loadingClass = fw.observable();
      this.loadedClass = fw.observable();

      function showLoader() {
        outlet.loadingClass(removeAnimation);
        outlet.loadedClass(removeAnimation);
        outlet.loadedStyle(hiddenCSS);
        outlet.loadingStyle(visibleCSS);

        nextFrame(function() {
          outlet.loadingClass(addAnimation);
        });
      }

      function showLoadedAfterMinimumTransition() {
        outlet.loadingClass(removeAnimation);
        outlet.loadedStyle(visibleCSS);
        outlet.loadingStyle(hiddenCSS);
        outlet.loadedClass(addAnimation);

        if(resolvedCallbacks.length) {
          each(resolvedCallbacks, function(callback) {
            callback();
          });
          resolvedCallbacks = [];
        }
      }

      var transitionTriggerTimeout;
      function showLoaded() {
        clearTimeout(transitionTriggerTimeout);
        var minTransitionPeriod = outlet.route.peek().minTransitionPeriod;
        if(minTransitionPeriod) {
          transitionTriggerTimeout = setTimeout(showLoadedAfterMinimumTransition, minTransitionPeriod);
        } else {
          showLoadedAfterMinimumTransition();
        }
      }

      this.transitionTrigger = fw.computed(function() {
        var routeIsResolving = this.routeIsResolving();
        if(routeIsResolving) {
          showLoader();
        } else {
          showLoaded();
        }
      }, this);

      this.dispose = function() {
        each(outlet, function(outletProperty) {
          if(outletProperty && isFunction(outletProperty.dispose)) {
            outletProperty.dispose();
          }
        });
      };
    },
    template: '<!-- ko $outletBinder -->' +
                '<div class="' + outletLoadingDisplay + ' ' + entityClass + '" data-bind="style: loadingStyle, css: loadingClass">' +
                  '<!-- ko component: loadingDisplay --><!-- /ko -->' +
                '</div>' +
                '<div class="' + outletLoadedDisplay + ' ' + entityClass + '" data-bind="style: loadedStyle, css: loadedClass">' +
                  '<!-- ko component: route --><!-- /ko -->' +
                '</div>' +
              '<!-- /ko -->'
  });

  internalComponents.push(noComponentSelected);
  fw.components.register(noComponentSelected, {
    template: '<div class="no-component-selected"></div>'
  });
  fw.components.register(nullComponent, {
    template: '<div class="null-component"></div>'
  });
};

function registerDefaultLoadingDisplayComponent() {
  fw.components.register(defaultLoadingComponent, {
    template: '<div class="sk-wave fade-in">\
                <div class="sk-rect sk-rect1"></div>\
                <div class="sk-rect sk-rect2"></div>\
                <div class="sk-rect sk-rect3"></div>\
                <div class="sk-rect sk-rect4"></div>\
                <div class="sk-rect sk-rect5"></div>\
              </div>'
  });
}

runPostInit.push(registerOutletComponent);
runPostInit.push(registerDefaultLoadingDisplayComponent);

// framework/entities/router/routeBinding.js
// -----------

function findParentNode(element, selector) {
  if(selector === true) {
    return element.parentNode;
  }

  if(element.parentNode && isFunction(element.parentNode.querySelectorAll)) {
    var parentNode = element.parentNode;
    var matches = parentNode.querySelectorAll(selector);
    if(matches.length && includes(matches, element)) {
      return element;
    }
    return findParentNode(parentNode, selector);
  }

  return undefined;
}

fw.bindingHandlers.$route = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var $myRouter = nearestParentRouter(bindingContext);
    var routeParams = valueAccessor();
    var elementIsSetup = false;
    var stateTracker = null;
    var hashOnly = null;

    var routeHandlerDescription = {
      on: 'click',
      url: function defaultURLForRoute() { return element.getAttribute('href'); },
      addActiveClass: true,
      activeClass: null,
      parentHasState: false,
      handler: function defaultHandlerForRouteBinding(event, url) {
        if(hashOnly) {
          return false;
        }

        if( !isFullURL(url) && event.which !== 2 ) {
          event.preventDefault();
          return true;
        }
        return false;
      }
    };

    if(isFunction(routeParams) || isString(routeParams)) {
      routeHandlerDescription.url = routeParams;
    } else if( isObject(routeParams) ) {
      extend(routeHandlerDescription, routeParams);
    }

    var routeHandlerDescriptionURL = routeHandlerDescription.url;
    if(!isFunction(routeHandlerDescriptionURL)) {
      routeHandlerDescription.url = function() { return routeHandlerDescriptionURL; };
    }

    function getRouteURL(includeParentPath) {
      var parentRoutePath = '';
      var routeURL = routeHandlerDescription.url();
      var myLinkPath = routeURL || '';

      if(!isNull(routeURL)) {
        if(isUndefined(routeURL)) {
          routeURL = myLinkPath;
        }

        if(!isFullURL(myLinkPath)) {
          if(!hasPathStart(myLinkPath)) {
            var currentRoute = $myRouter.currentRoute();
            if(hasHashStart(myLinkPath)) {
              if(!isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + myLinkPath;
              }
              hashOnly = true;
            } else {
              // relative url, prepend current segment
              if(!isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + '/' + myLinkPath;
              }
            }
          }

          if(includeParentPath && !isNullRouter($myRouter)) {
            myLinkPath = $myRouter.__private('parentRouter')().path() + myLinkPath;
          }

          if(fw.router.html5History() === false) {
            myLinkPath = '#' + (myLinkPath.indexOf('/') === 0 ? myLinkPath.substring(1) : myLinkPath);
          }
        }

        return myLinkPath;
      }

      return null;
    };
    var routeURLWithParentPath = getRouteURL.bind(null, true);
    var routeURLWithoutParentPath = getRouteURL.bind(null, false);

    function checkForMatchingSegment(mySegment, newRoute) {
      if(isString(mySegment)) {
        var currentRoute = $myRouter.currentRoute();
        var elementWithState = routeHandlerDescription.parentHasState ? findParentNode(element, routeHandlerDescription.parentHasState) : element;
        var activeRouteClassName = resultBound(routeHandlerDescription, 'activeClass', $myRouter) || fw.router.activeRouteClassName();
        mySegment = mySegment.replace(startingHashRegex, '/');

        if(isObject(currentRoute)) {
          if(resultBound(routeHandlerDescription, 'addActiveClass', $myRouter)) {
            if(mySegment === '/') {
              mySegment = '';
            }

            if(!isNull(newRoute) && newRoute.segment === mySegment && isString(activeRouteClassName) && activeRouteClassName.length) {
              // newRoute.segment is the same as this routers segment...add the activeRouteClassName to the element to indicate it is active
              addClass(elementWithState, activeRouteClassName);
            } else if( hasClass(elementWithState, activeRouteClassName) ) {
              removeClass(elementWithState, activeRouteClassName);
            }
          }
        }
      }

      if(isNull(newRoute)) {
        // No route currently selected, remove the activeRouteClassName from the elementWithState
        removeClass(elementWithState, activeRouteClassName);
      }
    };

    function setUpElement() {
      if (!isNullRouter($myRouter)) {
        var myCurrentSegment = routeURLWithoutParentPath();
        var routerConfig = $myRouter.__private('configParams');
        if (element.tagName.toLowerCase() === 'a') {
          element.href = (fw.router.html5History() ? '' : '/') + routerConfig.baseRoute + routeURLWithParentPath();
        }

        if (isObject(stateTracker) && isFunction(stateTracker.dispose)) {
          stateTracker.dispose();
        }
        stateTracker = $myRouter.currentRoute.subscribe(checkForMatchingSegment.bind(null, myCurrentSegment));

        if (elementIsSetup === false) {
          elementIsSetup = true;
          checkForMatchingSegment(myCurrentSegment, $myRouter.currentRoute());

          $myRouter.__private('parentRouter').subscribe(setUpElement);
          fw.utils.registerEventHandler(element, resultBound(routeHandlerDescription, 'on', $myRouter), function(event) {
            var currentRouteURL = routeURLWithoutParentPath();
            var handlerResult = routeHandlerDescription.handler.call(viewModel, event, currentRouteURL);
            if (handlerResult) {
              if (isString(handlerResult)) {
                currentRouteURL = handlerResult;
              }
              if (isString(currentRouteURL) && !isFullURL(currentRouteURL)) {
                $myRouter.setState( currentRouteURL );
              }
            }
            return true;
          });
        }
      }
    }

    if (isObservable(routeHandlerDescription.url)) {
      $myRouter.__private('subscriptions').push( routeHandlerDescription.url.subscribe(setUpElement) );
    }
    setUpElement();

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if (isObject(stateTracker)) {
        stateTracker.dispose();
      }
    });
  }
};

// framework/entities/router/Router.js
// ------------------

var Router = function(descriptor, configParams) {
  return {
    _preInit: function( params ) {
      var $router = this;
      var routerConfigParams = extend({ routes: [] }, configParams);

      var router = this.__private();
      this.__private = privateData.bind(this, router, routerConfigParams);
      this.__private('registerViewModelForOutlet', registerViewModelForOutlet.bind(this));
      this.__private('unregisterViewModelForOutlet', unregisterViewModelForOutlet.bind(this));

      routerConfigParams.baseRoute = fw.router.baseRoute() + (resultBound(routerConfigParams, 'baseRoute', router) || '');

      var subscriptions = router.subscriptions = fw.observableArray();
      router.urlParts = fw.observable();
      router.childRouters = fw.observableArray();
      router.parentRouter = fw.observable($nullRouter);
      router.context = fw.observable();
      router.historyIsEnabled = fw.observable(false);
      router.disableHistory = fw.observable().receiveFrom(this.$globalNamespace, 'disableHistory');
      router.currentState = fw.observable('').broadcastAs('currentState');

      function trimBaseRoute(url) {
        var routerConfig = $router.__private('configParams');
        if (!isNull(routerConfig.baseRoute) && url.indexOf(routerConfig.baseRoute) === 0) {
          url = url.substr(routerConfig.baseRoute.length);
          if (url.length > 1) {
            url = url.replace(hashMatchRegex, '/');
          }
        }
        return url;
      }

      function normalizeURL(url) {
        var urlParts = parseUri(url);
        router.urlParts(urlParts);

        if (!fw.router.html5History()) {
          if (url.indexOf('#') !== -1) {
            url = '/' + urlParts.anchor.replace(startingSlashRegex, '');
          } else if (router.currentState() !== url) {
            url = '/';
          }
        } else {
          url = urlParts.path;
        }

        return trimBaseRoute(url);
      }
      router.normalizeURL = normalizeURL;

      function getUnknownRoute() {
        var unknownRoute = find(($router.routeDescriptions || []).reverse(), { unknown: true }) || null;

        if (!isNull(unknownRoute)) {
          unknownRoute = extend({}, baseRoute, {
            id: unknownRoute.id,
            controller: unknownRoute.controller,
            title: unknownRoute.title,
            segment: ''
          });
        }

        return unknownRoute;
      }

      function getRouteForURL(url) {
        var route = null;
        var parentRoutePath = router.parentRouter().path() || '';
        var unknownRoute = getUnknownRoute();

        // If this is a relative router we need to remove the leading parentRoutePath section of the URL
        if (router.isRelative() && parentRoutePath.length > 0 && (routeIndex = url.indexOf(parentRoutePath + '/')) === 0) {
          url = url.substr(parentRoutePath.length);
        }

        // find all routes with a matching routeString
        var matchedRoutes = reduce($router.routeDescriptions, function (matches, routeDescription) {
          var routeDescRoute = [].concat(routeDescription.route);
          each(routeDescRoute, function (routeString) {
            var routeParams = [];

            if (isString(routeString) && isString(url)) {
              routeParams = url.match(routeStringToRegExp(routeString));
              if (!isNull(routeParams) && routeDescription.filter.call($router, routeParams, router.urlParts.peek())) {
                matches.push({
                  routeString: routeString,
                  specificity: routeString.replace(namedParamRegex, "*").length,
                  routeDescription: routeDescription,
                  routeParams: routeParams
                });
              }
            }
          });
          return matches;
        }, []);

        // If there are matchedRoutes, find the one with the highest 'specificity' (longest normalized matching routeString)
        // and convert it into the actual route
        if (matchedRoutes.length) {
          var matchedRoute = reduce(matchedRoutes, function(matchedRoute, foundRoute) {
            if (isNull(matchedRoute) || foundRoute.specificity > matchedRoute.specificity) {
              matchedRoute = foundRoute;
            }
            return matchedRoute;
          }, null);
          var routeDescription = matchedRoute.routeDescription;
          var routeString = matchedRoute.routeString;
          var routeParams = clone(matchedRoute.routeParams);
          var splatSegment = routeParams.pop() || '';
          var routeParamNames = map(routeString.match(namedParamRegex), function(param) {
            return param.replace(':', '');
          });
          var namedParams = reduce(routeParamNames, function(parameterNames, parameterName, index) {
            parameterNames[parameterName] = routeParams[index + 1];
            return parameterNames;
          }, {});

          route = extend({}, baseRoute, {
            id: routeDescription.id,
            controller: routeDescription.controller,
            title: routeDescription.title,
            name: routeDescription.name,
            url: url,
            segment: url.substr(0, url.length - splatSegment.length),
            indexedParams: routeParams,
            namedParams: namedParams
          });
        }

        return route || unknownRoute;
      }

      function RoutedAction(routeDescription) {
        if (!isUndefined(routeDescription.title)) {
          document.title = isFunction(routeDescription.title) ? routeDescription.title.apply($router, values(routeDescription.namedParams)) : routeDescription.title;
        }

        if (isUndefined(router.currentRouteDescription) || !sameRouteDescription(router.currentRouteDescription, routeDescription)) {
          (routeDescription.controller || noop).apply($router, values(routeDescription.namedParams) );
          router.currentRouteDescription = routeDescription;
        }
      }

      function getActionForRoute(routeDescription) {
        var Action = function DefaultAction() {
          delete router.currentRouteDescription;
          $router.outlet.reset();
        };

        if (isRoute(routeDescription)) {
          Action = RoutedAction.bind($router, routeDescription);
        }

        return Action;
      }

      router.isRelative = fw.computed(function() {
        return routerConfigParams.isRelative && !isNullRouter( this.parentRouter() );
      }, router);

      this.currentRoute = router.currentRoute = fw.computed(function() {
        return getRouteForURL(normalizeURL(this.currentState()));
      }, router);

      this.path = router.path = fw.computed(function() {
        var currentRoute = this.currentRoute();
        var routeSegment = '/';

        if (isRoute(currentRoute)) {
          routeSegment = (currentRoute.segment === '' ? '/' : currentRoute.segment);
        }

        return (this.isRelative() ? this.parentRouter().path() : '') + routeSegment;
      }, router);

      this.$namespace.command.handler('setState', function(state) {
        var route = state;
        var params = state.params;

        if(isObject(state)) {
          route = state.name;
          params = params || {};
        }

        $router.setState(route, params);
      });
      this.$namespace.request.handler('currentRoute', function() { return $router.__private('currentRoute')(); });
      this.$namespace.request.handler('urlParts', function() { return $router.__private('urlParts')(); });
      this.$namespace.command.handler('activate', function() { $router.activate(); });

      var parentPathSubscription;
      var $previousParent = $nullRouter;
      subscriptions.push(router.parentRouter.subscribe(function ($parentRouter) {
        if (!isNullRouter($previousParent) && $previousParent !== $parentRouter) {
          $previousParent.router.childRouters.remove(this);

          if (parentPathSubscription) {
            subscriptions.remove(parentPathSubscription);
            parentPathSubscription.dispose();
          }
          subscriptions.push(parentPathSubscription = $parentRouter.path.subscribe(function triggerRouteRecompute() {
            $router.router.currentState.notifySubscribers();
          }));
        }
        $parentRouter.__private('childRouters').push(this);
        $previousParent = $parentRouter;
      }, this));

      // Automatically trigger the new Action() whenever the currentRoute() updates
      subscriptions.push(router.currentRoute.subscribe(function getActionForRouteAndTrigger(newRoute) {
        if(router.currentState().length) {
          getActionForRoute(newRoute)( /* get and call the action for the newRoute */ );
        }
      }, this));

      this.outlets = {};
      this.outlet = routerOutlet.bind(this);
      this.outlet.reset = function() {
        each( this.outlets, function(outlet) {
          outlet({ name: noComponentSelected, params: {} });
        });
      }.bind(this);

      if (!isUndefined(routerConfigParams.unknownRoute)) {
        if (isFunction(routerConfigParams.unknownRoute)) {
          routerConfigParams.unknownRoute = { controller: routerConfigParams.unknownRoute };
        }
        routerConfigParams.routes.push(extend(routerConfigParams.unknownRoute, { unknown: true }));
      }
      this.setRoutes(routerConfigParams.routes);

      if (routerConfigParams.activate === true) {
        subscriptions.push(router.context.subscribe(function activateRouterAfterNewContext( $context ) {
          if (isObject($context)) {
            this.activate($context);
          }
        }, this));
      }

      this.matchesRoute = function(routeName, path) {
        var route = getRouteForURL(path);
        routeName = [].concat(routeName);
        if (!isNull(route)) {
          return routeName.indexOf(route.name) !== -1;
        }
        return false;
      };
    },
    mixin: {
      setRoutes: function(routeDesc) {
        this.routeDescriptions = [];
        this.addRoutes(routeDesc);
        return this;
      },
      addRoutes: function(routeConfig) {
        this.routeDescriptions = this.routeDescriptions.concat( map(isArray(routeConfig) ? routeConfig : [routeConfig], transformRouteConfigToDesc) );
        return this;
      },
      activate: function($context, $parentRouter) {
        $context = $context || this.__private('context')();
        $parentRouter = $parentRouter || nearestParentRouter($context);

        if(!isNullRouter($parentRouter)) {
          this.__private('parentRouter')($parentRouter);
        } else if (isObject($context)) {
          $parentRouter = nearestParentRouter($context);
          if ($parentRouter !== this) {
            this.__private('parentRouter')($parentRouter);
          }
        }

        if (!this.__private('historyIsEnabled')()) {
          if (historyIsReady() && !this.__private('disableHistory')()) {
            History.Adapter.bind(windowObject, 'popstate', this.__private('stateChangeHandler', function (event) {
              var url = '';
              if (!fw.router.html5History() && windowObject.location.hash.length > 1) {
                url = windowObject.location.hash;
              } else {
                url = windowObject.location.pathname + windowObject.location.hash;
              }

              this.__private('currentState')( this.__private('normalizeURL')(url) );
            }.bind(this) ));
            this.__private('historyIsEnabled')(true);
          } else {
            this.__private('historyIsEnabled')(false);
          }
        }

        if (this.__private('currentState')() === '') {
          this.setState();
        }

        this.$namespace.trigger('activated', { context: $context, parentRouter: $parentRouter });
        return this;
      },
      setState: function(url, routeParams) {
        var namedRoute = isObject(routeParams) ? url : null;
        var configParams = this.__private('configParams');
        var continueToRoute = true;
        var useHistory = this.__private('historyIsEnabled')() && !this.__private('disableHistory')() && isFunction(History.getState);

        if(!isNull(namedRoute)) {
          // must convert namedRoute into its URL form
          var routeDescription = find(this.routeDescriptions, function (route) {
            return route.name === namedRoute;
          });

          if (!isUndefined(routeDescription)) {
            url = first([].concat(routeDescription.route));
            each(routeParams, function (value, fieldName) {
              url = url.replace(':' + fieldName, routeParams[fieldName]);
            });
          } else {
            throw new Error('Could not locate named route: ' + namedRoute);
          }
        }

        var isExternalURL = isString(url);
        if (!isString(url) && useHistory) {
          url = History.getState().url;
        }

        if (!isExternalURL) {
          url = this.__private('normalizeURL')(url);
        }

        if (isFunction(configParams.beforeRoute)) {
          continueToRoute = configParams.beforeRoute.call(this, url || '/');
        }

        if (continueToRoute) {
          if (useHistory) {
            if (isExternalURL) {
              var historyAPIWorked = true;
              try {
                historyAPIWorked = History.pushState(null, '', configParams.baseRoute + this.__private('parentRouter')().path() + url.replace(startingHashRegex, '/'));
              } catch (historyException) {
                historyAPIWorked = false;
              } finally {
                if (historyAPIWorked) {
                  return;
                }
              }
            } else {
              this.__private('currentState')(this.__private('normalizeURL')(url));
            }
          } else if (isExternalURL) {
            this.__private('currentState')(this.__private('normalizeURL')(url));
          } else {
            this.__private('currentState')('/');
          }

          if (!historyIsReady()) {
            var routePath = this.path();
            each(this.__private('childRouters')(), function (childRouter) {
              childRouter.__private('currentState')(routePath);
            });
          }
        }

        return this;
      },
      dispose: function() {
        if(!this._isDisposed) {
          this._isDisposed = true;

          var $parentRouter = this.__private('parentRouter')();
          if (!isNullRouter($parentRouter)) {
            $parentRouter.__private('childRouters').remove(this);
          }

          if (this.__private('historyIsEnabled')() && historyIsReady()) {
            History.Adapter.unbind(this.__private('stateChangeHandler'));
          }

          this.$namespace.dispose();
          this.$globalNamespace.dispose();
          invokeMap(this.__private('subscriptions'), 'dispose');

          each(omitBy(this, function (property) {
            return isEntity(property);
          }), propertyDispose);

          each(omitBy(this.__private(), function (property) {
            return isEntity(property);
          }), propertyDispose);

          return this;
        }
      }
    }
  };
};


extend(fw.router, {
  // baseRoute / path which will always be stripped from the URL prior to processing the route
  baseRoute: fw.observable(''),
  activeRouteClassName: fw.observable('active'),
  disableHistory: fw.observable(false).broadcastAs({ name: 'disableHistory', namespace: fw.namespace() }),
  html5History: function() {
    return hasHTML5History;
  },
  getNearestParent: function($context) {
    var $parentRouter = nearestParentRouter($context);
    return (!isNullRouter($parentRouter) ? $parentRouter : null);
  }
});

extend(fw.outlet, {
  registerView: function(viewName, templateHTML) {
    fw.components.register(viewName, { template: templateHTML });
  },
  registerViewLocation: function(viewName, viewLocation) {
    fw.components.registerLocation(viewName, { template: viewLocation });
  }
});


// framework/entities/descriptorConfig.js
// ------------------

function resolveEntityImmediately(resolveNow) {
  resolveNow(true);
}

entityDescriptors = entityDescriptors.concat([
  {
    tagName: 'viewmodel',
    methodName: 'viewModel',
    defaultLocation: '/viewModel/',
    resource: fw.viewModel,
    behavior: [ ViewModel ],
    defaultConfig: {
      namespace: undefined,
      autoRegister: false,
      autoIncrement: false,
      extend: {},
      mixins: undefined,
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop
    }
  }, {
    tagName: 'datamodel',
    methodName: 'dataModel',
    defaultLocation: '/dataModel/',
    resource: fw.dataModel,
    behavior: [ ViewModel, DataModel ],
    defaultConfig: {
      idAttribute: 'id',
      url: null,
      useKeyInUrl: true,
      parse: false,
      ajaxOptions: {},
      namespace: undefined,
      autoRegister: false,
      autoIncrement: false,
      extend: {},
      mixins: undefined,
      requestLull: undefined,
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop
    }
  }, {
    tagName: 'router',
    methodName: 'router',
    defaultLocation: '/',
    resource: fw.router,
    behavior: [ ViewModel, Router ],
    defaultConfig: {
      namespace: '$router',
      autoRegister: false,
      autoIncrement: false,
      showDuringLoad: noComponentSelected,
      extend: {},
      mixins: undefined,
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop,
      baseRoute: null,
      isRelative: true,
      activate: true,
      beforeRoute: null,
      minTransitionPeriod: 0
    }
  }
]);

// framework/entities/bindingInit.js
// ------------------

function entityBinder(element, params, $parentContext, Entity, $flightTracker, $parentsInFlightChildren, $outletsInFlightChildren) {
  var entityObj;
  if (isFunction(Entity)) {
    entityObj = new Entity(params);
  } else {
    entityObj = Entity;
  }
  entityObj.$parentContext = $parentContext;

  if (isEntity(entityObj)) {
    var resolveFlightTracker =  noop;

    if ($flightTracker) {
      resolveFlightTracker = function(addAnimationClass) {
        var wasResolved = false;
        function resolveThisEntityNow(isResolved) {
          function finishResolution() {
            addAnimationClass();
            if(fw.isObservable($parentsInFlightChildren) && isFunction($parentsInFlightChildren.remove)) {
              $parentsInFlightChildren.remove($flightTracker);
            }
            if(fw.isObservable($outletsInFlightChildren) && isFunction($outletsInFlightChildren.remove)) {
              $outletsInFlightChildren.remove($flightTracker);
            }
          }

          if (!wasResolved) {
            wasResolved = true;
            if (isResolved === true) {
              finishResolution();
            } else if(isPromise(isResolved) || (isArray(isResolved) && every(isResolved, isPromise))) {
              var promises = [].concat(isResolved);
              var checkPromise = function(promise) {
                (promise.done || promise.then).call(promise, function() {
                  if(every(promises, promiseIsResolvedOrRejected)) {
                    finishResolution();
                  }
                });
              };

              each(promises, checkPromise);
            }
          }
        }

        function maybeResolve() {
          entityObj.__private('configParams').afterResolving.call(entityObj, resolveThisEntityNow);
        }

        var $inFlightChildren = entityObj.__private('inFlightChildren');
        // if no children then resolve now, otherwise subscribe and wait till its 0
        if ($inFlightChildren().length === 0) {
          maybeResolve();
        } else {
          entityObj.disposeWithInstance($inFlightChildren.subscribe(function(inFlightChildren) {
            inFlightChildren.length === 0 && maybeResolve();
          }));
        }
      };
    }

    entityObj.__private('resolveFlightTracker', resolveFlightTracker);
  }

  var childrenToInsert = [];
  each(element.childNodes, function(child) {
    if (!isUndefined(child)) {
      childrenToInsert.push(child);
    }
  });

  // Have to create a wrapper element for the contents of the element. Cannot bind to
  // existing element as it has already been bound against.
  var wrapperNode = document.createElement('binding-wrapper');
  element.insertBefore(wrapperNode, element.firstChild);

  each(childrenToInsert, function(child) {
    wrapperNode.appendChild(child);
  });

  fw.applyBindings(entityObj, wrapperNode);
};

// Monkey patch enables the entity to initialize a viewModel and bind to the html as intended (with lifecycle events)
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = fw.bindingHandlers.component.init;

function getResourceLocation(moduleName) {
  var resource = this;
  var resourceLocation = null;

  if( resource.isRegistered(moduleName) ) {
    // viewModel was manually registered, we preferentially use it
    resourceLocation = resource.getRegistered(moduleName);
  } else if( isFunction(require) && isFunction(require.specified) && require.specified(moduleName) ) {
    // we have found a matching resource that is already cached by require, lets use it
    resourceLocation = moduleName;
  } else {
    resourceLocation = resource.getLocation(moduleName);
  }

  return resourceLocation;
}

function initEntityTag(tagName, element, valueAccessor, allBindings, viewModel, bindingContext) {
  var theValueAccessor = valueAccessor;
  if (tagName === '__elementBased') {
    tagName = element.tagName;
  }

  var $flightTracker = { name: tagName, type: 'component' };

  if(element.nodeType !== 8 && (!isString(tagName) || tagName.toLowerCase() !== 'outlet')) {
    var $nearestEntity = nearestEntity(bindingContext);
    if ($nearestEntity) {
      var $inFlightChildren = $nearestEntity.__private('inFlightChildren');
      if (isObservable($inFlightChildren) && isFunction($inFlightChildren.push)) {
        $inFlightChildren.push($flightTracker);
      }
    }

    var $nearestOutlet = nearestEntity(bindingContext, isOutletViewModel);
    if ($nearestOutlet) {
      var $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
      if (isObservable($outletsInFlightChildren) && isFunction($outletsInFlightChildren.push)) {
        $outletsInFlightChildren.push($flightTracker);
      }
    }
  }

  if (isString(tagName)) {
    tagName = tagName.toLowerCase();
    if (entityDescriptors.tagNameIsPresent(tagName)) {
      var values = valueAccessor();
      var moduleName = (!isUndefined(values.params) ? fw.unwrap(values.params.name) : undefined) || element.getAttribute('module') || element.getAttribute('data-module');
      var bindModel = entityBinder.bind(null, element, values.params, bindingContext);
      var resource = entityDescriptors.resourceFor(tagName);
      var getResourceLocationFor = getResourceLocation.bind(resource);

      $flightTracker.name = moduleName;
      $flightTracker.type = tagName;

      if (isNull(moduleName) && isString(values)) {
        moduleName = values;
      }

      if (!isUndefined(moduleName) && !isNull(resource)) {
        var resourceLocation = getResourceLocationFor(moduleName);

        if (isString(resourceLocation)) {
          if (isFunction(require)) {
            if (!require.specified(resourceLocation)) {
              if (isPath(resourceLocation)) {
                resourceLocation = resourceLocation + resource.getFileName(moduleName);
              }
              resourceLocation = require.toUrl(resourceLocation);
            }

            require([resourceLocation], function(resource) {
              var args = Array.prototype.slice.call(arguments);
              bindModel(resource, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
            });
          } else {
            throw new Error('Uses require, but no AMD loader is present');
          }
        } else if (isFunction(resourceLocation)) {
          bindModel(resourceLocation, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
        } else if (isObject(resourceLocation)) {
          var createInstance = resourceLocation.createViewModel || resourceLocation.createDataModel;
          if(isObject(resourceLocation.instance)) {
            bindModel(resourceLocation.instance, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          } else if (isFunction(createInstance)) {
            bindModel(createInstance(values.params, { element: element }), $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          }
        }
      }

      return { 'controlsDescendantBindings': true };
    } else if (tagName === 'outlet') {
      // we patch in the 'name' of the outlet into the params valueAccessor on the component definition (if necessary and available)
      var outletName = element.getAttribute('name') || element.getAttribute('data-name');
      if(outletName) {
        theValueAccessor = function() {
          var valueAccessorResult = valueAccessor();
          if( !isUndefined(valueAccessorResult.params) && isUndefined(valueAccessorResult.params.name) ) {
            valueAccessorResult.params.name = outletName;
          }
          return valueAccessorResult;
        };
      }
    }
  }

  element.$flightTracker = $flightTracker;
  return originalComponentInit(element, theValueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = initEntityTag.bind(null, '__elementBased');

// NOTE: Do not use the $router binding yet, it is incomplete
fw.bindingHandlers.$router = {
  preprocess: function(moduleName) {
    return "'" + moduleName + "'";
  },
  init: initEntityTag.bind(null, 'router')
};

// NOTE: Do not use the $viewModel binding yet, it is incomplete
fw.bindingHandlers.$viewModel = {
  preprocess: function(moduleName) {
    return "'" + moduleName + "'";
  },
  init: initEntityTag.bind(null, 'viewModel')
};

// framework/entities/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given entity and element
function setupContextAndLifeCycle(entity, element) {
  if (isEntity(entity) && !entity.__private('afterRenderWasTriggered')) {
    entity.__private('afterRenderWasTriggered', true);
    element = element || document.body;

    var context;
    var entityContext;
    var $configParams = entity.__private('configParams');
    if (element.tagName.toLowerCase() === 'binding-wrapper') {
      element = element.parentElement || element.parentNode;
    }

    entity.__private('element', element);
    entity.$context = entityContext = fw.contextFor(element);

    var afterRender = noop;
    if (isFunction($configParams.afterRender)) {
      afterRender = $configParams.afterRender;
    }

    var resolveFlightTracker = entity.__private('resolveFlightTracker') || noop;
    $configParams.afterRender = function (containerElement) {
      afterRender.call(this, containerElement);
      addClass(containerElement, entityClass);
      resolveFlightTracker(function addAnimationClass() {
        addClass(containerElement, entityAnimateClass);
      });
    };
    $configParams.afterRender.call(entity, element);

    if (isRouter(entity)) {
      entity.__private('context')(entityContext);
    }

    if (!isUndefined(element)) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        entity.dispose();
      });
    }
  }
}

// framework/entities/applyBinding.js
// ------------------

var hasHTML5History = false;
var historyStateAssessed = false;

function assessHistoryState() {
  if(!historyStateAssessed) {
    historyStateAssessed = true;

    hasHTML5History = !!windowObject.history && !!windowObject.history.pushState;
    if(!isUndefined(windowObject.History) && isObject(windowObject.History.options) && windowObject.History.options.html4Mode) {
      // user is overriding to force html4mode hash-based history
      hasHTML5History = false;
    }
  }
}

// Override the original applyBindings method to assess history API state and provide viewModel/dataModel/router life-cycle
var originalApplyBindings = fw.applyBindings;
fw.applyBindings = function(viewModelOrBindingContext, rootNode) {
  // must initialize default require context (https://github.com/jrburke/requirejs/issues/1305#issuecomment-87924865)
  isFunction(require) && require([]);

  assessHistoryState();
  originalApplyBindings(viewModelOrBindingContext, rootNode);
  setupContextAndLifeCycle(viewModelOrBindingContext, rootNode);
};

// framework/entities/createFactories.js
// ------------------

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function entityMixinOrNothingFrom(thing) {
  return ((isArray(thing) && thing.length) || isObject(thing) ? thing : {});
}

function entityClassFactory(descriptor, configParams) {
  var entityCtor = null;
  var privateDataMixin = {
    _preInit: function() {
      this.__private = privateData.bind(this, {
        inFlightChildren: fw.observableArray()
      }, configParams);
    }
  };

  configParams = extend({}, descriptor.defaultConfig, configParams || {});

  var descriptorBehavior = [];
  map(descriptor.behavior, function(behavior, index) {
    descriptorBehavior.push(isFunction(behavior) ? behavior(descriptor, configParams) : behavior);
  });

  var ctor = configParams.initialize || noop;
  var userExtendProps = { mixin: configParams.extend || {} };
  if (!descriptor.isEntityCtor(ctor)) {
    var isEntityDuckTagMixin = {};
    isEntityDuckTagMixin[descriptor.isEntityDuckTag] = true;
    isEntityDuckTagMixin = { mixin: isEntityDuckTagMixin };

    var newInstanceCheckMixin = {
      _preInit: function() {
        if (this === windowObject) {
          throw new Error('Must use the new operator when instantiating a ' + descriptor.methodName + '.');
        }
      }
    };
    var afterInitMixins = reject(entityMixins, isBeforeInitMixin);
    var beforeInitMixins = map(filter(entityMixins, isBeforeInitMixin), function(mixin) {
      delete mixin.runBeforeInit;
      return mixin;
    });

    var composure = [ctor].concat(
      entityMixinOrNothingFrom(privateDataMixin),
      entityMixinOrNothingFrom(userExtendProps),
      entityMixinOrNothingFrom(newInstanceCheckMixin),
      entityMixinOrNothingFrom(isEntityDuckTagMixin),
      entityMixinOrNothingFrom(afterInitMixins),
      entityMixinOrNothingFrom(beforeInitMixins),
      entityMixinOrNothingFrom(configParams.mixins),
      entityMixinOrNothingFrom(descriptorBehavior)
    );

    entityCtor = riveter.compose.apply(undefined, composure);
    entityCtor[descriptor.isEntityCtorDuckTag] = true;
    entityCtor.__private = privateData.bind(this, {}, configParams);
  } else {
    // user has specified another entity constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    entityCtor = ctor;
  }

  if (!isNull(entityCtor) && isFunction(configParams.parent)) {
    entityCtor.inherits(configParams.parent);
  }

  if (configParams.autoRegister) {
    descriptor.resource.register(configParams.namespace, entityCtor);
  }

  return entityCtor;
}

function createEntityFactories() {
  // create the class factory method for each entity descriptor
  filter(entityDescriptors, function getOnlyDescriptorsWithMethodName(descriptor) {
    return isString(descriptor.methodName);
  }).forEach(function setupClassFactory(descriptor) {
    fw[descriptor.methodName].create = entityClassFactory.bind(null, descriptor);
  });
};

runPostInit.unshift(createEntityFactories);

// framework/entities/init.js
// ----------------

function makeBooleanChecks(descriptor) {
  return {
    isEntityCtor: function isEntityCtor(thing) {
      return isFunction(thing) && !!thing[ descriptor.isEntityCtorDuckTag ];
    },
    isEntity: function isEntity(thing) {
      return isObject(thing) && !!thing[ descriptor.isEntityDuckTag ];
    }
  };
}

entityDescriptors = map(entityDescriptors, function prepareDescriptor(descriptor) {
  var methodName = descriptor.methodName.charAt(0).toUpperCase() + descriptor.methodName.slice(1);
  descriptor = extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    isEntityCtorDuckTag: '__is' + methodName + 'Ctor',
    isEntityDuckTag: '__is' + methodName,
    referenceNamespace: (isString(descriptor.methodName) ? ('__' + descriptor.methodName + 'Reference') : undefined)
  }, descriptor);

  return extend(descriptor, makeBooleanChecks(descriptor));
});

extend(entityDescriptors, {
  tagNameIsPresent: function isEntityTagNameDescriptorPresent(tagName) {
    return filter(this, function matchingTagNames(descriptor) {
      return descriptor.tagName === tagName;
    }).length > 0;
  },
  resourceFor: function getResourceForEntityTagName(tagName) {
    return reduce(this, function(resource, descriptor) {
      if(descriptor.tagName === tagName) {
        resource = descriptor.resource;
      }
      return resource;
    }, null);
  },
  getDescriptor: function getDescriptor(methodName) {
    return reduce(this, function reduceDescriptor(foundDescriptor, descriptor) {
      return descriptor.methodName === methodName ? descriptor : foundDescriptor;
    }, null);
  }
});

function getEntityComparator(methodName, compFunctions, entityDescriptor) {
  if(isFunction(entityDescriptor[methodName])) {
    compFunctions.push(entityDescriptor[methodName]);
  }
  return compFunctions;
}

runPostInit.unshift(function() {
  var entityCtorComparators = map(entityDescriptors, 'isEntityCtor');
  var entityComparators = map(entityDescriptors, 'isEntity');

  isEntityCtor = function(thing) {
    return reduce(entityCtorComparators, function(isThing, comparator) {
      return isThing || comparator(thing);
    }, false);
  };

  isEntity = function(thing) {
    return reduce(entityComparators, function(isThing, comparator) {
      return isThing || comparator(thing);
    }, false);
  };

  isDataModel = entityDescriptors.getDescriptor('dataModel').isEntity;
  isDataModelCtor = entityDescriptors.getDescriptor('dataModel').isEntityCtor;
  isRouter = entityDescriptors.getDescriptor('router').isEntity;
});


// framework/resource/init.js
// ------------------

var baseComponentLocation = {
  combined: null,
  viewModel: null,
  template: null
};

var originalComponentRegisterFunc = fw.components.register;

var defaultComponentFileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

var defaultComponentLocation = extend({}, baseComponentLocation, {
  viewModel: '/viewModel/',
  template: '/component/'
});


// framework/resource/proto.js
// ------------------

function isRegistered(descriptor, resourceName) {
  return !isUndefined( descriptor.registered[resourceName] );
};

function getRegistered(descriptor, resourceName) {
  return descriptor.registered[resourceName];
};

function register(descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
};

function getModelExtension(dataModelExtensions, modelName) {
  var fileExtension = '';

  if( isFunction(dataModelExtensions) ) {
    fileExtension = dataModelExtensions(modelName);
  } else if( isString(dataModelExtensions) ) {
    fileExtension = dataModelExtensions;
  }

  return fileExtension.replace(/^\./, '') || '';
}

function getModelFileName(descriptor, modelName) {
  var modelResourceLocations = descriptor.resourceLocations;
  var fileName = modelName + '.' + getModelExtension(descriptor.fileExtensions(), modelName);

  if( !isUndefined( modelResourceLocations[modelName] ) ) {
    var registeredLocation = modelResourceLocations[modelName];
    if( isString(registeredLocation) && !isPath(registeredLocation) ) {
      // full filename was supplied, lets return that
      fileName = last( registeredLocation.split('/') );
    }
  }

  return fileName;
}

function setDefaultModelLocation(descriptor, path) {
  if( isString(path) ) {
    descriptor.defaultLocation = path;
  }

  return descriptor.defaultLocation;
}

function registerModelLocation(descriptor, modelName, location) {
  if( isArray(modelName) ) {
    each(modelName, function(name) {
      registerModelLocation(descriptor, name, location);
    });
  }
  descriptor.resourceLocations[ modelName ] = location;
}

function modelResourceLocation(descriptor, modelName) {
  return reduce(descriptor.resourceLocations, function(registeredLocation, location, registeredName) {
    if(!registeredLocation) {
      if(!isNull(registeredName.match(regExpMatch)) && !isNull(modelName.match(registeredName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if(modelName === registeredName) {
        registeredLocation = location;
      }
    }
    return registeredLocation;
  }, undefined);
}

function modelLocationIsRegistered(descriptor, modelName) {
  return !!modelResourceLocation(descriptor, modelName);
}

function getModelResourceLocation(descriptor, modelName) {
  if( isUndefined(modelName) ) {
    return descriptor.resourceLocations;
  }

  return modelResourceLocation(descriptor, modelName) || descriptor.defaultLocation;
}

var $globalNamespace = fw.namespace();
function getModelReferences(descriptor, namespaceName, options) {
  options = options || {};
  if( isString(namespaceName) || isArray(namespaceName) ) {
    options.namespaceName = namespaceName;
  }

  var references = reduce($globalNamespace.request(descriptor.referenceNamespace, extend({ includeOutlets: false }, options), true), function(models, model) {
    if(!isUndefined(model)) {
      var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if(!isNull(namespaceName)) {
        if( isUndefined(models[namespaceName]) ) {
          models[namespaceName] = [model];
        } else {
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});

  var referenceKeys = keys(references);
  if(isString(namespaceName)) {
    if(referenceKeys.length === 1) {
      return references[referenceKeys[0]] || [];
    }
    return [];
  }
  return references;
}

// framework/resource/component.js
// ------------------

fw.components.resourceLocations = {};

fw.components.fileExtensions = fw.observable( clone(defaultComponentFileExtensions) );

fw.components.register = function(componentName, options) {
  var viewModel = options.viewModel || options.dataModel || options.router;

  if( !isString(componentName) ) {
    throw new Error('Components must be provided a componentName.');
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || DefaultViewModel,
    template: options.template
  });
};

function getComponentExtension(componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions();
  var fileExtension = '';

  if( isFunction(componentExtensions) ) {
    fileExtension = componentExtensions(componentName)[fileType];
  } else if( isObject(componentExtensions) ) {
    if( isFunction(componentExtensions[fileType]) ) {
      fileExtension = componentExtensions[fileType](componentName);
    } else {
      fileExtension = componentExtensions[fileType] || '';
    }
  }

  return fileExtension.replace(/^\./, '') || '';
}

fw.components.getFileName = function(componentName, fileType) {
  var fileName = componentName;
  var fileExtension = getComponentExtension(componentName, fileType);

  if(fw.components.isRegistered(componentName)) {
    return null;
  }

  if(fw.components.locationIsRegistered(componentName)) {
    var registeredLocation = fw.components.getLocation(componentName);
    if(!isUndefined(registeredLocation[fileType]) && !isPath(registeredLocation[fileType])) {
      if(isString(registeredLocation[fileType])) {
        // full filename was supplied, lets return that
        fileName = last(registeredLocation[fileType].split('/'));
      } else {
        return null;
      }
    }
  }

  return fileName + (fileExtension !== getFilenameExtension(fileName) ? ('.' + fileExtension) : '');
};

fw.components.defaultLocation = function(location) {
  if( isString(location) ) {
    defaultComponentLocation = extend({}, baseComponentLocation, {
      viewModel: location,
      template: location
    });
  } else if(isObject(location)) {
    defaultComponentLocation = extend({}, baseComponentLocation, location);
  }

  return defaultComponentLocation;
};

fw.components.registerLocation = function(componentName, componentLocation, folderOffset) {
  if(isArray(componentName)) {
    each(componentName, function(name) {
      fw.components.registerLocation(name, componentLocation, folderOffset);
    });
  }

  if(isString(componentLocation)) {
    componentLocation = extend({}, baseComponentLocation, {
      viewModel: componentLocation,
      template: componentLocation,
      folderOffset: !!folderOffset
    });
  } else if(isObject(componentLocation)) {
    componentLocation.folderOffset = !!folderOffset;
  }

  fw.components.resourceLocations[componentName] = extend({}, baseComponentLocation, forceViewModelComponentConvention(componentLocation));
};

fw.components.getRegisteredLocation = function(componentName) {
  return reduce(fw.components.resourceLocations, function(registeredLocation, location, registeredComponentName) {
    if(!registeredLocation) {
      if(!isNull(registeredComponentName.match(regExpMatch)) && !isNull(componentName.match(registeredComponentName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if(componentName === registeredComponentName) {
        registeredLocation = location;
      }
    }
    return registeredLocation;
  }, undefined);
};

fw.components.locationIsRegistered = function(componentName) {
  return !!fw.components.getRegisteredLocation(componentName);
};

// Return the component resource definition for the supplied componentName
fw.components.getLocation = function(componentName) {
  if( isUndefined(componentName) ) {
    return fw.components.resourceLocations;
  }
  return omitBy(fw.components.getRegisteredLocation(componentName) || defaultComponentLocation, isNull);
};

// framework/resource/createResource.js
// ------------------

// Create/extend all resource methods onto each descriptor.resource found inside an array of descriptors
function createResources(descriptors) {
  each(descriptors, function(descriptor) {
    if(!isUndefined(descriptor.resource)) {
      extend(descriptor.resource, resourceHelperFactory(descriptor));
    }
  });
};

runPostInit.push(function() {
  createResources(entityDescriptors);
});

// framework/resource/resourceHelperFactory.js
// ------------------

// assemble all resource methods for a given descriptor object
function resourceHelperFactory(descriptor) {
  var resourceMethods = {
    getFileName: getModelFileName.bind(null, descriptor),
    register: register.bind(null, descriptor),
    isRegistered: isRegistered.bind(null, descriptor),
    getRegistered: getRegistered.bind(null, descriptor),
    registerLocation: registerModelLocation.bind(null, descriptor),
    locationIsRegistered: modelLocationIsRegistered.bind(null, descriptor),
    getLocation: getModelResourceLocation.bind(null, descriptor),
    defaultLocation: setDefaultModelLocation.bind(null, descriptor),
    fileExtensions: descriptor.fileExtensions,
    resourceLocations: descriptor.resourceLocations
  };

  if(!isUndefined(descriptor.referenceNamespace)) {
    // Returns a reference to the specified models.
    // If no name is supplied, a reference to an array containing all viewModel references is returned.
    resourceMethods.getAll = getModelReferences.bind(null, descriptor);
  }

  return resourceMethods;
}


// framework/component/lifecycle.js
// ------------------

function clearSequenceQueue() {
  each(sequenceQueue, function(sequence, queueNamespace) {
    each(sequence, function(sequenceIteration) {
      sequenceIteration.addAnimationClass();
    });
    delete sequenceQueue[queueNamespace];
  });
}

function runAnimationClassSequenceQueue(queue, isRunner) {
  if(!queue.running || isRunner) {
    var sequenceIteration = queue.shift();

    if(sequenceIteration) {
      sequenceIteration.addAnimationClass();

      if(sequenceIteration.nextIteration || queue.length) {
        queue.running = true;
        setTimeout(function() {
          runAnimationClassSequenceQueue(queue, true);
        }, sequenceIteration.nextIteration);
      } else {
        queue.running = false;
      }
    } else {
      queue.running = false;
    }
  }
}

var sequenceQueue = {};
function addToAndFetchQueue(element, viewModel) {
  var configParams = viewModel.__private('configParams');
  var sequenceTimeout = resultBound(configParams, 'sequenceAnimations', viewModel) || fw.settings.defaultAnimationSequence || 0;
  var animationSequenceQueue = sequenceQueue[configParams.namespace] = (sequenceQueue[configParams.namespace] || []);
  var newSequenceIteration = {
    addAnimationClass: function addBindingFromQueue() {
      nextFrame(function() {
        addClass(element, entityAnimateClass);
      });
    },
    nextIteration: sequenceTimeout
  };

  animationSequenceQueue.push(newSequenceIteration);

  return animationSequenceQueue;
}

function componentTriggerAfterRender(element, viewModel, $context) {
  if(isEntity(viewModel) && !viewModel.__private('afterRenderWasTriggered')) {
    viewModel.__private('afterRenderWasTriggered', true);

    function addAnimationClass() {
      var classList = element.className.split(" ");
      if(!includes(classList, outletLoadingDisplay) && !includes(classList, outletLoadedDisplay)) {
        var queue = addToAndFetchQueue(element, viewModel);
        var nearestOutlet = nearestEntity($context, isOutletViewModel);

        if(nearestOutlet) {
          // the parent outlet will run the callback that initiates the animation
          // sequence (once the rest of its dependencies finish loading as well)
          nearestOutlet.addResolvedCallbackOrExecute(function() {
            runAnimationClassSequenceQueue(queue);
          });
        } else {
          // no parent outlet found, lets go ahead and run the queue
          runAnimationClassSequenceQueue(queue);
        }
      }
    }

    // trigger the user-specified afterRender callback
    viewModel.__private('configParams').afterRender.call(viewModel, element);

    // resolve the flight tracker and trigger the addAnimationClass callback when appropriate
    (viewModel.__private('resolveFlightTracker') || noop)(addAnimationClass);
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    var classList = element.className.split(" ");
    if(!includes(classList, outletLoadingDisplay) && !includes(classList, outletLoadedDisplay)) {
      // the outlet viewModel and template binding handles its animation state
      addClass(element, entityClass);
    }

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if(isEntity(viewModel)) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    // if this element is not the 'loading' component of an outlet, then we need to
    // trigger the onComplete callback
    var $parent = bindingContext.$parent;
    if(isObject($parent) && isObservable($parent.route) && $parent.__isOutlet) {
      var parentRoute = $parent.route.peek();
      var classList = element.className.split(" ");
      if (!includes(classList, outletLoadingDisplay) && isFunction(parentRoute.getOnCompleteCallback)) {
        parentRoute.getOnCompleteCallback(element)();
      }
    }

    componentTriggerAfterRender(element, bindingContext.$data, bindingContext);
  }
};

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, config, callback) {
    if(!isInternalComponent(componentName)) {
      // TODO: Handle different types of configs
      if(isString(config)) {
        config = '<!-- ko $life -->' + config + '<!-- /ko -->';
      } else {
        throw new Error('Unhandled config type ' + typeof config + '.');
      }
      fw.components.defaultLoader.loadTemplate(componentName, config, callback);
    } else {
      callback(null);
    }
  },
  loadViewModel: function(componentName, config, callback) {
    var ViewModel = config.viewModel || config;
    if(!isInternalComponent(componentName)) {
      callback(function(params, componentInfo) {
        var componentElement = componentInfo.element;
        if(isFunction(ViewModel)) {
          return new ViewModel(params);
        }
        return ViewModel;
      });
    } else {
      callback(null);
    }
  }
});

// framework/component/loader.js
// ------------------

// This loader is a catch-all in the instance a registered component cannot be found.
// The loader will attempt to use requirejs via knockouts integrated support if it is available.
fw.components.loaders.push(fw.components.requireLoader = {
  getConfig: function(componentName, callback) {
    var combinedFile = fw.components.getFileName(componentName, 'combined');
    var viewModelFile = fw.components.getFileName(componentName, 'viewModel');
    var templateFile = fw.components.getFileName(componentName, 'template');
    var componentLocation = fw.components.getLocation(componentName);
    var folderOffset = componentLocation.folderOffset || '';
    var configOptions = null;
    var viewModelPath;
    var templatePath;
    var combinedPath;
    var viewModelConfig;

    if(folderOffset !== '') {
      folderOffset = componentName + '/';
    }

    if(isFunction(require)) {
      // load component using knockouts native support for requirejs
      if(require.specified(componentName)) {
        // component already cached, lets use it
        configOptions = {
          require: componentName
        };
      } else if(isString(componentLocation.combined)) {
        combinedPath = componentLocation.combined;

        if(isPath(combinedPath)) {
          combinedPath = combinedPath + folderOffset + combinedFile;
        }

        configOptions = {
          require: require.toUrl(combinedPath)
        };
      } else {
        // check to see if the requested component is template only and should not request a viewModel (we supply a dummy object in its place)
        if(!isString(componentLocation.viewModel)) {
          // template-only component, substitute with 'blank' viewModel
          viewModelConfig = DefaultViewModel;
        } else {
          viewModelPath = componentLocation.viewModel;

          if(isPath(viewModelPath)) {
            viewModelPath = viewModelPath + folderOffset + viewModelFile;
          }

          if(getFilenameExtension(viewModelPath) !== getComponentExtension(componentName, 'viewModel')) {
            viewModelPath += '.' + getComponentExtension(componentName, 'viewModel');
          }

          viewModelConfig = { require: require.toUrl(viewModelPath) };
        }

        templatePath = componentLocation.template;
        if(isPath(templatePath)) {
          templatePath = templatePath + folderOffset + templateFile;
        }

        if(getFilenameExtension(templatePath) !== getComponentExtension(componentName, 'template')) {
          templatePath += '.' + getComponentExtension(componentName, 'template');
        }

        templatePath = 'text!' + templatePath;

        configOptions = {
          viewModel: viewModelConfig,
          template: { require: templatePath }
        };
      }
    }

    callback(configOptions);
  }
});

fw.components.loaders.unshift(fw.components.requireResolver = {
  loadComponent: function(componentName, config, callback) {
    possiblyGetConfigFromAmd(config, function(loadedConfig) {
      // TODO: Provide upstream patch which clears out loadingSubscribablesCache when load fails so that
      // subsequent requests will re-run require

      var origCallback = callback;
      callback = new Conduit.Sync({ target: callback });
      callback.before(function(config) {
        config.createViewModel = new Conduit.Sync({ target: config.createViewModel });
        config.createViewModel.after(function(viewModel, params, componentInfo) {
          var $flightTracker = componentInfo.element.$flightTracker;
          var $context = fw.contextFor(componentInfo.element);
          var $nearestOutlet = nearestEntity($context, isOutletViewModel);
          var $nearestEntity = nearestEntity($context);
          var $parentsInFlightChildren;
          var $outletsInFlightChildren;

          if($nearestEntity) {
            $parentsInFlightChildren = $nearestEntity.__private('inFlightChildren');
          }
          if($nearestOutlet) {
            $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
          }

          if (isEntity(viewModel)) {
            var resolveFlightTracker =  noop;

            if ($flightTracker) {
              resolveFlightTracker = function(addAnimationClass) {
                var wasResolved = false;
                function resolveThisEntityNow(isResolved) {
                  function finishResolution() {
                    addAnimationClass();
                    if(fw.isObservable($parentsInFlightChildren) && isFunction($parentsInFlightChildren.remove)) {
                      $parentsInFlightChildren.remove($flightTracker);
                    }
                    if(fw.isObservable($outletsInFlightChildren) && isFunction($outletsInFlightChildren.remove)) {
                      $outletsInFlightChildren.remove($flightTracker);
                    }
                  }

                  if (!wasResolved) {
                    wasResolved = true;
                    if (isResolved === true) {
                      finishResolution();
                    } else if(isPromise(isResolved) || (isArray(isResolved) && every(isResolved, isPromise))) {
                      var promises = [].concat(isResolved);
                      var checkPromise = function(promise) {
                        (promise.done || promise.then).call(promise, function() {
                          if(every(promises, promiseIsResolvedOrRejected)) {
                            finishResolution();
                          }
                        });
                      };

                      each(promises, checkPromise);
                    }
                  }
                }

                function maybeResolve() {
                  viewModel.__private('configParams').afterResolving.call(viewModel, resolveThisEntityNow);
                }

                var $inFlightChildren = viewModel.__private('inFlightChildren');
                // if no children then resolve now, otherwise subscribe and wait till its 0
                if ($inFlightChildren().length === 0) {
                  maybeResolve();
                } else {
                  viewModel.disposeWithInstance($inFlightChildren.subscribe(function(inFlightChildren) {
                    inFlightChildren.length === 0 && maybeResolve();
                  }));
                }
              };
            }

            viewModel.__private('resolveFlightTracker', resolveFlightTracker);
          }
        });
      });

      resolveConfig(componentName, loadedConfig, callback);
    });
  }
});

function possiblyGetConfigFromAmd(config, callback) {
  if(isString(config['require'])) {
    if(isFunction(require)) {
      require([config['require']], callback, function() {
        each(activeOutlets(), function(outlet) {
          (outlet().onFailure || noop)();
        });
      });
    } else {
      throw new Error('Uses require, but no AMD loader is present');
    }
  } else {
    callback(config);
  }
}

// Note that this is a direct lift from the knockoutjs source
function resolveConfig(componentName, config, callback) {
  var result = {};
  var makeCallBackWhenZero = 2;
  var tryIssueCallback = function() {
    if (--makeCallBackWhenZero === 0) {
      callback(result);
    }
  };
  var templateConfig = config['template'];
  var viewModelConfig = config['viewModel'];

  if (templateConfig) {
    possiblyGetConfigFromAmd(templateConfig, function(loadedConfig) {
      getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
        result['template'] = resolvedTemplate;
        tryIssueCallback();
      });
    });
  } else {
    tryIssueCallback();
  }

  if (viewModelConfig) {
    possiblyGetConfigFromAmd(viewModelConfig, function(loadedConfig) {
      getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
        result['createViewModel'] = resolvedViewModel;
        tryIssueCallback();
      });
    });
  } else {
    tryIssueCallback();
  }
}

// Note that this is a direct lift from the knockoutjs source
function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
  // On the first call in the stack, start with the full set of loaders
  if(!candidateLoaders) {
    candidateLoaders = fw.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
  }

  // Try the next candidate
  var currentCandidateLoader = candidateLoaders.shift();
  if (currentCandidateLoader) {
    var methodInstance = currentCandidateLoader[methodName];
    if (methodInstance) {
      var wasAborted = false;
      var synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
        if (wasAborted) {
          callback(null);
        } else if (result !== null) {
          // This candidate returned a value. Use it.
          callback(result);
        } else {
          // Try the next candidate
          getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
        }
      }));

      // Currently, loaders may not return anything synchronously. This leaves open the possibility
      // that we'll extend the API to support synchronous return values in the future. It won't be
      // a breaking change, because currently no loader is allowed to return anything except undefined.
      if (synchronousReturnValue !== undefined) {
        wasAborted = true;

        // Method to suppress exceptions will remain undocumented. This is only to keep
        // KO's specs running tidily, since we can observe the loading got aborted without
        // having exceptions cluttering up the console too.
        if (!currentCandidateLoader['suppressLoaderExceptions']) {
          throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
        }
      }
    } else {
      // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
      getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
    }
  } else {
    // No candidates returned a value
    callback(null);
  }
}

// Note that this is a direct lift from the knockoutjs source
function resolveTemplate(templateConfig, callback) {
  if (typeof templateConfig === 'string') {
    // Markup - parse it
    callback(fw.utils.parseHtmlFragment(templateConfig));
  } else if (templateConfig instanceof Array) {
    // Assume already an array of DOM nodes - pass through unchanged
    callback(templateConfig);
  } else if (isDocumentFragment(templateConfig)) {
    // Document fragment - use its child nodes
    callback(fw.utils.makeArray(templateConfig.childNodes));
  } else if (templateConfig['element']) {
    var element = templateConfig['element'];
    if (isDomElement(element)) {
      // Element instance - copy its child nodes
      callback(cloneNodesFromTemplateSourceElement(element));
    } else if (typeof element === 'string') {
      // Element ID - find it, then copy its child nodes
      var elemInstance = document.getElementById(element);
      if (elemInstance) {
        callback(cloneNodesFromTemplateSourceElement(elemInstance));
      } else {
        throw new Error('Cannot find element with ID ' + element);
      }
    } else {
      throw new Error('Unknown element type: ' + element);
    }
  } else {
    throw new Error('Unknown template value: ' + templateConfig);
  }
}

// Note that this is a direct lift from the knockoutjs source
function cloneNodesFromTemplateSourceElement(elemInstance) {
  switch (fw.utils.tagNameLower(elemInstance)) {
    case 'script':
      return fw.utils.parseHtmlFragment(elemInstance.text);
    case 'textarea':
      return fw.utils.parseHtmlFragment(elemInstance.value);
    case 'template':
      // For browsers with proper <template> element support (i.e., where the .content property
      // gives a document fragment), use that document fragment.
      if (isDocumentFragment(elemInstance.content)) {
        return fw.utils.cloneNodes(elemInstance.content.childNodes);
      }
  }

  // Regular elements such as <div>, and <template> elements on old browsers that don't really
  // understand <template> and just treat it as a regular container
  return fw.utils.cloneNodes(elemInstance.childNodes);
}


// These are tags which are ignored by the custom component loader
// Sourced from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var nonComponentTags = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bgsound',
  'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
  'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element',
  'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'g', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label',
  'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'nobr',
  'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'polygon', 'path', 'pre',
  'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'spacer',
  'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea',
  'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'xmp', 'rect', 'image',
  'lineargradient', 'stop', 'line', 'binding-wrapper', 'font'
];

fw.components.getNormalTagList = function() {
  return clone(nonComponentTags);
};

fw.components.getComponentNameForNode = function(node) {
  var tagName = isString(node.tagName) && node.tagName.toLowerCase();

  if( fw.components.isRegistered(tagName) || fw.components.tagIsComponent(tagName) ) {
    return tagName;
  }
  return null;
};

fw.components.tagIsComponent = function(tagName, isComponent) {
  if( isUndefined(isComponent) ) {
    return indexOf(nonComponentTags, tagName) === -1;
  }

  if( isArray(tagName) ) {
    each(tagName, function(tag) {
      fw.components.tagIsComponent(tag, isComponent);
    });
  }

  if(isComponent !== true) {
    if( includes(nonComponentTags, tagName) === false ) {
      nonComponentTags.push(tagName);
    }
  } else {
    nonComponentTags = filter(nonComponentTags, function(nonComponentTagName) {
      return nonComponentTagName !== tagName;
    });
  }
};

fw.component = function(componentDefinition) {
  if(!isObject(componentDefinition)) {
    throw new Error('fw.component() must be supplied with a componentDefinition configuration object.');
  }

  componentDefinition.viewModel = componentDefinition.dataModel || componentDefinition.router || componentDefinition.viewModel;

  return componentDefinition;
};

// framework/collection/defaultConfig.js
// ------------------

var defaultCollectionConfig = {
  namespace: null,
  url: null,
  dataModel: null,
  idAttribute: null,
  disposeOnRemove: true,
  parse: identity,
  ajaxOptions: {}
};

// framework/collection/utility.js
// ------------------

function isCollection(thing) {
  return isObject(thing) && !!thing.__isCollection;
}

// framework/collection/collection.js
// ------------------

function removeDisposeAndNotify(originalFunction) {
  var removedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  this.__private('configParams').disposeOnRemove && invokeMap(removedItems, 'dispose');
  this.$namespace.publish('_.remove', removedItems);
  return removedItems;
}

function addAndNotify(originalFunction) {
  var addItems = map(Array.prototype.slice.call(arguments).splice(1), this.__private('castAs').dataModel);
  var originalResult = originalFunction.apply(this, addItems);
  this.$namespace.publish('_.add', addItems);
  return originalResult;
}

var PlainCollectionConstructor;

fw.collection = function(collectionData) {
  collectionData = collectionData || [];

  if(isUndefined(PlainCollectionConstructor)) {
    PlainCollectionConstructor = fw.collection.create();
  }
  return PlainCollectionConstructor(collectionData);
};

fw.collection.create = function(configParams) {
  configParams = configParams || {};

  return function CollectionConstructor(collectionData) {
    configParams = extend({}, defaultCollectionConfig, configParams);
    var DataModelCtor = configParams.dataModel;
    var collection = fw.observableArray();
    var privateStuff = {
      castAs: {
        modelData: function(modelData, attribute) {
          if(isDataModel(modelData)) {
            return modelData.getData(attribute);
          }
          if(isUndefined(attribute)) {
            return modelData;
          }
          return result(modelData, attribute);
        },
        dataModel: function(modelData) {
          return isDataModelCtor(DataModelCtor) && !isDataModel(modelData) ? (new DataModelCtor(modelData)) : modelData;
        }
      },
      getIdAttribute: function(options) {
        var idAttribute = configParams.idAttribute || (options || {}).idAttribute;
        if(isUndefined(idAttribute) || isNull(idAttribute)) {
          if(isDataModelCtor(DataModelCtor)) {
            return DataModelCtor.__private('configParams').idAttribute;
          }
        }
        return idAttribute || 'id';
      }
    };

    extend(collection, collectionMethods, {
      $namespace: fw.namespace(configParams.namespace || uniqueId('collection')),
      __originalData: collectionData,
      __isCollection: true,
      __private: privateData.bind(this, privateStuff, configParams),
      remove: removeDisposeAndNotify.bind(collection, collection.remove),
      pop: removeDisposeAndNotify.bind(collection, collection.pop),
      shift: removeDisposeAndNotify.bind(collection, collection.shift),
      splice: removeDisposeAndNotify.bind(collection, collection.splice),
      push: addAndNotify.bind(collection, collection.push),
      unshift: addAndNotify.bind(collection, collection.unshift),
      isFetching: fw.observable(false),
      isCreating: fw.observable(false),
      dispose: function() {
        if(!collection.isDisposed) {
          collection.isDisposed = true;
          collection.$namespace.dispose();
          invokeMap(collection(), 'dispose');
        }
      }
    });

    collection.requestInProgress = fw.pureComputed(function() {
      return this.isFetching() || this.isCreating();
    }, collection);

    if(collectionData) {
      collection.set(collectionData);
    }

    return collection;
  };
};

// framework/collection/collectionMethods.js
// ------------------

var collectionMethods = fw.collection.methods = {
  sync: function() {
    return fw.sync.apply(this, arguments);
  },
  get: function(id) {
    var collection = this;
    return find(collection(), function findModelWithId(model) {
      return result(model, collection.__private('getIdAttribute')()) === id || result(model, '$id') === id || result(model, '$cid') === id;
    });
  },
  getData: function() {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    return reduce(collection(), function(models, model) {
      models.push(castAsModelData(model));
      return models;
    }, []);
  },
  toJSON: function() {
    return JSON.stringify(this.getData());
  },
  pluck: function(attribute) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    return reduce(collection(), function(pluckedValues, model) {
      pluckedValues.push(castAsModelData(model, attribute));
      return pluckedValues;
    }, []);
  },
  set: function(newCollection, options) {
    if(!isArray(newCollection)) {
      throw new Error('collection.set() must be passed an array of data/dataModels');
    }

    var collection = this;
    var collectionStore = collection();
    var castAsDataModel = collection.__private('castAs').dataModel;
    var castAsModelData = collection.__private('castAs').modelData;
    var idAttribute = collection.__private('getIdAttribute')();
    var affectedModels = [];
    var absentModels = [];
    var addedModels = [];
    options = options || {};

    each(newCollection, function checkModelPresence(modelData) {
      var modelPresent = false;
      modelData = castAsModelData(modelData);

      if(!isUndefined(modelData)) {
        each(collectionStore, function lookForModel(model, indexOfModel) {
          var collectionModelData = castAsModelData(model);

          if(!isUndefined(modelData[idAttribute]) && !isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
            modelPresent = true;
            if(options.merge !== false && !sortOfEqual(collectionModelData, modelData)) {
              // found model, but needs an update
              if(isFunction(model.set)) {
                model.set.call(model, modelData);
              } else {
                collectionStore[indexOfModel] = modelData;
              }
              collection.$namespace.publish('_.change', model);
              affectedModels.push(model);
            }
          }
        });

        if(!modelPresent && options.add !== false) {
          // not found in collection, we have to add this model
          var newModel = castAsDataModel(modelData);
          collectionStore.push(newModel);
          affectedModels.push(newModel);
          addedModels.push(newModel);
          collection.$namespace.publish('_.add', newModel);
        }
      }
    });

    if(options.remove !== false) {
      each(collectionStore, function checkForRemovals(model, indexOfModel) {
        var collectionModelData = castAsModelData(model);
        var modelPresent = false;

        if(collectionModelData) {
          modelPresent = reduce(newCollection, function(isPresent, modelData) {
            return isPresent || result(modelData, idAttribute) === collectionModelData[idAttribute];
          }, false);
        }

        if(!modelPresent) {
          // model currently in collection not found in the supplied newCollection so we need to mark it for removal
          absentModels.push(model);
          affectedModels.push(model);
        }
      });

      if(absentModels.length) {
        each(absentModels, function(modelToRemove) {
          var indexOfModelToRemove = collectionStore.indexOf(modelToRemove);
          if(indexOfModelToRemove > -1) {
            collectionStore.splice(indexOfModelToRemove, 1);
          }
        });
        collection.$namespace.publish('_.remove', absentModels);
      }
    }

    // re-sort based on the newCollection
    var reSorted = [];
    var wasResorted = false;
    each(newCollection, function(newModelData, modelIndex) {
      newModelData = castAsModelData(newModelData);
      var foundAtIndex = null;
      var currentModel = find(collectionStore, function(model, theIndex) {
        if(sortOfEqual(castAsModelData(model), newModelData)) {
          foundAtIndex = theIndex;
          return true;
        }
      });
      reSorted.push(currentModel);
      wasResorted = wasResorted || foundAtIndex !== modelIndex;
    });

    wasResorted = (wasResorted && reSorted.length && every(reSorted));

    if(wasResorted) {
      Array.prototype.splice.apply(collectionStore, [0, reSorted.length].concat(reSorted));
    }

    if(wasResorted || addedModels.length || absentModels.length || affectedModels.length) {
      collection.notifySubscribers();
    }

    return affectedModels;
  },
  reset: function(newCollection) {
    var collection = this;
    var oldModels = collection.removeAll();
    var castAsDataModel = collection.__private('castAs').dataModel;

    collection(reduce(newCollection, function(newModels, modelData) {
      newModels.push(castAsDataModel(modelData));
      return newModels;
    }, []));

    collection.$namespace.publish('_.reset', { newModels: collection(), oldModels: oldModels });

    return collection();
  },
  fetch: function(options) {
    var collection = this;
    var configParams = collection.__private('configParams');
    options = options ? clone(options) : {};

    var requestInfo = {
      requestRunning: collection.isFetching,
      requestLull: configParams.requestLull,
      entity: collection,
      createRequest: function() {
        if(isUndefined(options.parse)) {
          options.parse = true;
        }

        var xhr = collection.sync('read', collection, options);

        return (xhr.done || xhr.then).call(xhr, function(resp) {
          var method = options.reset ? 'reset' : 'set';
          resp = configParams.parse(resp);
          var touchedModels = collection[method](resp, options);
          collection.$namespace.publish('_.change', { touched: touchedModels, serverResponse: resp, options: options });
        });
      }
    };

    return makeOrGetRequest('fetch', requestInfo);
  },
  where: function(modelData, options) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    options = options || {};
    modelData = castAsModelData(modelData);

    return reduce(collection(), function findModel(foundModels, model) {
      var thisModelData = castAsModelData(model);
      if(regExpIsEqual(modelData, thisModelData, options.isEqual)) {
        foundModels.push(options.getData ? thisModelData : model);
      }
      return foundModels;
    }, []);
  },
  findWhere: function(modelData, options) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    options = options || {};
    modelData = castAsModelData(modelData);

    return reduce(collection(), function findModel(foundModel, model) {
      var thisModelData = castAsModelData(model);
      if(isNull(foundModel) && regExpIsEqual(modelData, thisModelData, options.isEqual)) {
        return options.getData ? thisModelData : model;
      }
      return foundModel;
    }, null);
  },
  addModel: function(models, options) {
    var collection = this;
    var affectedModels = [];
    options = options || {};

    if(isObject(models)) {
      models = [models];
    }
    if(!isArray(models)) {
      models = !isUndefined(models) && !isNull(models) ? [models] : [];
    }

    if(models.length) {
      var collectionData = collection();
      var castAsDataModel = collection.__private('castAs').dataModel;
      var castAsModelData = collection.__private('castAs').modelData;
      var idAttribute = collection.__private('getIdAttribute')();

      if(isNumber(options.at)) {
        var newModels = map(models, castAsDataModel);

        collectionData.splice.apply(collectionData, [options.at, 0].concat(newModels));
        affectedModels.concat(newModels);
        collection.$namespace.publish('_.add', newModels);

        collection.valueHasMutated();
      } else {
        each(models, function checkModelPresence(modelData) {
          var modelPresent = false;
          var theModelData = castAsModelData(modelData);

          each(collectionData, function lookForModel(model) {
            var collectionModelData = castAsModelData(model);

            if(!isUndefined(theModelData[idAttribute]) && !isNull(theModelData[idAttribute]) && theModelData[idAttribute] === collectionModelData[idAttribute]) {
              modelPresent = true;
              if(options.merge && !sortOfEqual(theModelData, collectionModelData)) {
                // found model, but needs an update
                (model.set || noop).call(model, theModelData);
                collection.$namespace.publish('_.change', model);
                affectedModels.push(model);
              }
            }
          });

          if(!modelPresent) {
            // not found in collection, we have to add this model
            var newModel = castAsDataModel(modelData);
            collection.push(newModel);
            affectedModels.push(newModel);
          }
        });
      }
    }

    return affectedModels;
  },
  create: function(model, options) {
    var collection = this;
    var castAsDataModel = collection.__private('castAs').dataModel;
    var configParams = collection.__private('configParams');
    options = options ? clone(options) : {};

    var requestInfo = {
      requestRunning: collection.isCreating,
      requestLull: configParams.requestLull,
      entity: collection,
      allowConcurrent: true,
      createRequest: function() {
        var newModel = castAsDataModel(model);
        var xhr;

        if(isDataModel(newModel)) {
          xhr = newModel.save();

          if(options.wait) {
            (xhr.done || xhr.then).call(xhr, function() {
              collection.addModel(newModel);
            });
          } else {
            collection.addModel(newModel)
          }
        } else {
          return newModel;
        }

        return xhr;
      }
    };

    if(!isDataModelCtor(configParams.dataModel)) {
      throw new Error('No dataModel specified, cannot create() a new collection item');
    }

    return makeOrGetRequest('create', requestInfo);
  },
  removeModel: function(models) {
    var collection = this;
    var affectedModels = [];

    if(isObject(models)) {
      models = [models];
    }
    if(!isArray(models)) {
      models = !isUndefined(models) && !isNull(models) ? [models] : [];
    }

    return reduce(models, function(removedModels, model) {
      var removed = null;
      if(isDataModel(model)) {
        removed = collection.remove(model);
      } else {
        var modelsToRemove = collection.where(model);
        if(!isNull(modelsToRemove)) {
          removed = collection.removeAll(modelsToRemove);
        }
      }

      if(!isNull(removed)) {
        return removedModels.concat(removed);
      }
      return removedModels;
    }, []);
  }
};



// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  targetElement = targetElement || windowObject.document.body;
  fw.applyBindings({}, targetElement);
};

each(runPostInit, function(runTask) {
  runTask();
});


      return fw;
    })(root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter, root.jQuery, root.Conduit);
  })();
}));
