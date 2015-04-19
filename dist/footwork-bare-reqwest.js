/**
 * footwork.js - A solid footing for web applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v1.0.0-bare-reqwest
 * Url: http://footworkjs.com
 * License(s): MIT
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal', 'reqwest'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'), require('reqwest'));
  } else {
    root.fw = factory(root._, root.ko, root.postal, root.reqwest);
  }
}(this, function (_, ko, postal, reqwest) {
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

    if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


    _.extend(root, {
      _: _,
      ko: ko,
      postal: postal,
      reqwest: reqwest
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
                _.each(mixin.preInit, function (initializer) {
                    initializer.apply(this, args);
                }, this);
                ctor.prototype.constructor.apply(this, args);
                _.each(mixin.postInit, function (initializer) {
                    initializer.apply(this, args);
                }, this);
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

    if(root._.isUndefined(root.postal.preserve)) {
      (function() {
        /**
 * postal.preserve - Add-on for postal.js that provides message durability features.
 * Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 * Version: v0.1.0
 * Url: http://github.com/postaljs/postal.preserve
 * License(s): MIT
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = function (postal) {
            factory(require("lodash"), postal, this);
        };
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["lodash", "postal"], function (_, postal) {
            return factory(_, postal, root);
        });
    } else {
        // Browser globals
        root.postal = factory(root._, root.postal, root);
    }
}(this, function (_, postal, global, undefined) {
    var plugin = postal.preserve = {
        store: {},
        expiring: []
    };
    var system = postal.channel(postal.configuration.SYSTEM_CHANNEL);
    var dtSort = function (a, b) {
        return b.expires - a.expires;
    };
    var tap = postal.addWireTap(function (d, e) {
        var channel = e.channel;
        var topic = e.topic;
        if (e.headers && e.headers.preserve) {
            plugin.store[channel] = plugin.store[channel] || {};
            plugin.store[channel][topic] = plugin.store[channel][topic] || [];
            plugin.store[channel][topic].push(e);
            // a bit harder to read, but trying to make
            // traversing expired messages faster than
            // iterating the store object's multiple arrays
            if (e.headers.expires) {
                plugin.expiring.push({
                    expires: e.headers.expires,
                    purge: function () {
                        plugin.store[channel][topic] = _.without(plugin.store[channel][topic], e);
                        plugin.expiring = _.without(plugin.expiring, this);
                    }
                });
                plugin.expiring.sort(dtSort);
            }
        }
    });
    function purgeExpired() {
        var dt = new Date();
        var expired = _.filter(plugin.expiring, function (x) {
            return x.expires < dt;
        });
        while (expired.length) {
            expired.pop().purge();
        }
    }
    postal.SubscriptionDefinition.prototype.enlistPreserved = function () {
        var channel = this.channel;
        var binding = this.topic;
        var self = this;
        purgeExpired(true);
        if (plugin.store[channel]) {
            _.each(plugin.store[channel], function (msgs, topic) {
                if (postal.configuration.resolver.compare(binding, topic)) {
                    _.each(msgs, function (env) {
                        self.callback.call(
                        self.context || (self.callback.context && self.callback.context()) || this, env.data, env);
                    });
                }
            });
        }
        return this;
    };
    return postal;
}));
      }).call(root);
    }

    (function(window) {
      // Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function(global) {
  'use strict';
  global.console = global.console || {};
  var con = global.console;
  var prop, method;
  var empty = {};
  var dummy = function() {};
  var properties = 'memory'.split(',');
  var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
     'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
  while (prop = properties.pop()) if (!con[prop]) con[prop] = empty;
  while (method = methods.pop()) if (!con[method]) con[method] = dummy;
})(typeof window === 'undefined' ? this : window);
// Using `this` for web workers while maintaining compatibility with browser
// targeted script loaders such as Browserify or Webpack where the only way to
// get to the global object is via `window`.

    }).call(root, windowObject);

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ 'riveter' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter, reqwest) {
      var ajax = reqwest.compat;
      // main.js
// -----------

var fw = ko;

// misc/lodashExtract.js
// ----------------

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
var invoke = _.invoke;
var clone = _.clone;
var reduce = _.reduce;
var has = _.has;
var where = _.where;
var result = _.result;
var uniqueId = _.uniqueId;
var map = _.map;
var find = _.find;
var omit = _.omit;
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

// extenders.js
// ----------------

fw.extenders.debounce = function(target, opt) {
  if( isNumber(opt) ) {
    opt = {
      timeout: opt,
      when: function() { return true; } // default always throttle
    };
  }

  target.throttleEvaluation = opt.timeout;

  var writeTimeoutInstance = null;
  var throttledTarget = fw.computed({
    'read': target,
    'write': function(value) {
      if( opt.when(value) ) {
        clearTimeout(writeTimeoutInstance);
        writeTimeoutInstance = setTimeout(function() {
          target(value);
        }, opt.timeout);
      } else {
        clearTimeout(writeTimeoutInstance);
        target(value);
      }
    }
  });

  throttledTarget.force = function( value ) {
    clearTimeout(writeTimeoutInstance);
    target(value);
  };

  var throttleDispose = throttledTarget.dispose;
  if( isFunction(target.dispose) ) {
    // has to pass-through the dispose method from the target so it can be released properly as well
    throttledTarget.dispose = function() {
      target.dispose();
      throttleDispose.call(throttledTarget);
    };
  }

  return throttledTarget;
};

fw.extenders.autoDisable = function( target, delay ) {
  return target.extend({
    delayTrigger: {
      delay: delay || 0,
      trigger: function( target ) { target( false ); }
    }
  });
};

fw.extenders.autoEnable = function( target, delay ) {
  return target.extend({
    delayTrigger: {
      delay: delay || 0,
      trigger: function( target ) { target( true ); }
    }
  });
};

fw.extenders.delayTrigger = function( target, options ) {
  var delay = 300;
  var triggerFunc = noop;
  var trigger;

  if( isObject(options) ) {
    delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
    triggerFunc = options.trigger || triggerFunc;
  } else {
    delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
  }

  var clearTrigger = function() {
    clearTimeout( trigger );
    trigger = undefined;
  };

  var delayedObservable = fw.computed({
    read: target,
    write: function( state ) {
      target( state );

      if( !isUndefined(trigger) ) {
        clearTrigger();
      }

      trigger = setTimeout(function() {
        triggerFunc( target, options );
      }.bind(target), delayedObservable.triggerDelay);
    }
  });
  delayedObservable.clearTrigger = clearTrigger;
  delayedObservable.triggerDelay = delay;

  var delayedObservableDispose = delayedObservable.dispose;
  if( isFunction(target.dispose) ) {
    // has to pass-through the dispose method from the target so it can be released properly as well
    delayedObservable.dispose = function() {
      target.dispose();
      delayedObservableDispose.call(delayedObservable);
    };
  }

  return delayedObservable;
};

fw.extenders.delayWrite = function( target, options ) {
  var filter;
  var delay = 300;

  if( isObject(options) ) {
    delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
    filter = options.filter || function() { return true; };
  } else {
    delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
  }

  var delayWriteComputed = fw.computed({
    read: target,
    write: function( writeValue ) {
      if( filter( writeValue ) ) {
        if(target._delayWriteTimer) {
          clearTimeout( this._delayWriteTimer );
        }
        target._delayWriteTimer = setTimeout(function() {
          target( writeValue );
        }, delay);
      } else {
        target( writeValue );
      }
    }
  });

  var delayWriteComputedDispose = delayWriteComputed.dispose;
  if( isFunction(target.dispose) ) {
    // has to pass-through the dispose method from the target so it can be released properly as well
    delayWriteComputed.dispose = function() {
      target.dispose();
      delayWriteComputedDispose.call(delayWriteComputed);
    };
  }

  return delayWriteComputed;
};


// framework/init.js
// ------------------

// Record the footwork version as of this build.
fw.footworkVersion = '1.0.0';

// Expose any embedded dependencies
fw.embed = embedded;

fw.viewModels = {};
fw.dataModels = {};
fw.routers = {};
fw.outlets = {};
fw.settings = {};

var hasHTML5History = false;
var assessHistoryState = noop;
var originalApplyBindings = noop;
var setupContextAndLifeCycle = noop;

var noComponentSelected = '_noComponentSelected';
var runPostInit = [];
var nativeComponents = [];
var entityDescriptors = [];
var modelMixins = [];
var $routerOutlet;

var $globalNamespace;
runPostInit.push(function() {
  $globalNamespace = fw.namespace();
});

var isModelCtor;
var isModel;
runPostInit.push(function() {
  var viewModelDescriptor = entityDescriptors.getDescriptor('viewModel');
  isModelCtor = viewModelDescriptor.isModelCtor;
  isModel = viewModelDescriptor.isModel;
});

var createResources;
runPostInit.push(function() {
  createResources(entityDescriptors);
});

var createFactories;
runPostInit.push(function() {
  createFactories(entityDescriptors);
});

var registerOutletComponents;
runPostInit.push(function() {
  registerOutletComponents();
});

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

// framework/utility.js
// ----------------

var trailingSlashRegex = /\/$/;
var startingSlashRegex = /^\//;
var startingHashRegex = /^#/;

var isObservable = fw.isObservable;

var isFullURLRegex = /(^[a-z]+:\/\/|^\/\/)/i;
var isFullURL = fw.utils.isFullURL = function(thing) {
  return isString(thing) && isFullURLRegex.test(thing);
};

function isNativeComponent(componentName) {
  return indexOf(nativeComponents, componentName) !== -1;
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

function getFilenameExtension(fileName) {
  var extension = '';
  if(fileName.indexOf('.') !== -1) {
    extension = last(fileName.split('.'));
  }
  return extension;
}

function alwaysPassPredicate() { return true; }
function emptyStringResult() { return ''; }

// dispose a known property type
function propertyDisposal( property, name ) {
  if( (isObservable(property) || isNamespace(property) || isRouter(property) || fw.isBroadcastable(property) || fw.isReceivable(property)) && isFunction(property.dispose) ) {
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
  var $parentNamespace = fw.utils.currentNamespace();
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

  var handlerSubscription = this.subscribeToTopic('event.' + eventKey, callback).enlistPreserved();
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

  var handlerSubscription = this.subscribeToTopic('command.' + commandKey, callback).enlistPreserved();
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to issue a request for data from a namespace, returning the response (or undefined if no response)
// This method will return an array of responses if more than one is received.
function requestResponseFromNamespace(requestKey, params, allowMultipleResponses) {
  var response = undefined;
  var responseSubscription;

  responseSubscription = this.subscribeToTopic('request.' + requestKey + '.response', function(reqResponse) {
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

  var handlerSubscription = this.subscribeToTopic('request.' + requestKey, requestHandler);
  this.requestHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// This effectively shuts down all requests, commands, events, and subscriptions by unsubscribing all handlers on a discreet namespace object
var handlerRepos = ['requestHandlers', 'commandHandlers', 'eventHandlers', 'subscriptions'];
function disconnectNamespaceHandlers() {
  var namespace = this;
  each(handlerRepos, function(handlerRepo) {
    invoke(namespace[handlerRepo], 'unsubscribe');
  });
  return this;
}

function getNamespaceName() {
  return this.channel;
}

// framework/namespace/exports.js
// ----------------

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
  var subscribeToTopic = namespace.subscribeToTopic = namespace.subscribe;
  namespace.subscribe = function(topic, callback) {
    var subscription = subscribeToTopic.call(namespace, topic, callback);
    subscriptions.push( subscription );
    return subscription;
  };
  namespace.unsubscribe = unregisterNamespaceHandler;

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
    if( fw.utils.currentNamespaceName() === this.getName() ) {
      return exitNamespace();
    }
  };

  return namespace;
};

// framework/namespace/modelMixins.js
// ----------------

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
modelMixins.push({
  runBeforeInit: true,
  _preInit: function( options ) {
    var $configParams = this.__getConfigParams();
    this.$namespace = enterNamespaceName( indexedNamespaceName($configParams.namespace || $configParams.name || _.uniqueId('namespace'), $configParams.autoIncrement) );
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

function modelLocationIsRegistered(descriptor, modelName) {
  return !isUndefined(descriptor.resourceLocations[modelName]);
}

function getModelResourceLocation(descriptor, modelName) {
  if( isUndefined(modelName) ) {
    return descriptor.resourceLocations;
  }
  return descriptor.resourceLocations[modelName] || descriptor.defaultLocation;
}

function getModelReferences(descriptor, namespaceName, options) {
  options = options || {};
  if( isString(namespaceName) || isArray(namespaceName) ) {
    options.namespaceName = namespaceName;
  }

  var references = reduce( $globalNamespace.request(descriptor.referenceNamespace, extend({ includeOutlets: false }, options), true), function(models, model) {
    if( !isUndefined(model) ) {
      var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if( !isNull(namespaceName) ) {
        if( isUndefined(models[namespaceName]) ) {
          models[namespaceName] = [ model ];
        } else {
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});

  var referenceKeys = keys(references);
  if(isString(namespaceName) && referenceKeys.length === 1) {
    return references[referenceKeys[0]];
  }
  return references;
}

// framework/resource/component.js
// ------------------

fw.components.resourceLocations = {};

fw.components.fileExtensions = fw.observable( clone(defaultComponentFileExtensions) );

fw.components.register = function(componentName, options) {
  var viewModel = options.initialize || options.viewModel;

  if( !isString(componentName) ) {
    throw new Error('Components must be provided a componentName.');
  }

  if( isFunction(viewModel) && !isModelCtor(viewModel) ) {
    options.namespace = componentName;
    viewModel = fw.viewModel(options);
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || noop,
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

  if( fw.components.isRegistered(componentName) ) {
    return null;
  }

  if( !isUndefined( fw.components.resourceLocations[componentName] ) ) {
    var registeredLocation = fw.components.resourceLocations[componentName];
    if( !isUndefined(registeredLocation[fileType]) && !isPath(registeredLocation[fileType]) ) {
      if( isString(registeredLocation[fileType]) ) {
        // full filename was supplied, lets return that
        fileName = last( registeredLocation[fileType].split('/') );
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
      combined: location
    });
  } else if(isObject(location)) {
    defaultComponentLocation = extend({}, baseComponentLocation, location);
  }

  return defaultComponentLocation;
};

fw.components.registerLocation = function(componentName, componentLocation) {
  if( isArray(componentName) ) {
    each(componentName, function(name) {
      fw.components.registerLocation(name, componentLocation);
    });
  }

  if( isString(componentLocation) ) {
    componentLocation = extend({}, baseComponentLocation, {
      combined: componentLocation
    });
  }

  fw.components.resourceLocations[ componentName ] = extend({}, baseComponentLocation, componentLocation);
};

fw.components.locationIsRegistered = function(componentName) {
  return !isUndefined(fw.components.resourceLocations[componentName]);
};

// Return the component resource definition for the supplied componentName
fw.components.getLocation = function(componentName) {
  if( isUndefined(componentName) ) {
    return fw.components.resourceLocations;
  }
  return _.omit(fw.components.resourceLocations[componentName] || defaultComponentLocation, _.isNull);
};

// framework/resource/createResource.js
// ------------------

// Create/extend all resource methods onto each descriptor.resource found inside an array of descriptors
createResources = function(descriptors) {
  each(descriptors, function(descriptor) {
    if(!isUndefined(descriptor.resource)) {
      extend(descriptor.resource, resourceHelperFactory(descriptor));
    }
  });
};

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
    invoke(namespaceSubscriptions, 'unsubscribe');
    invoke(subscriptions, 'dispose');
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
    invoke(namespaceSubscriptions, 'unsubscribe');
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
        return updatedValue === predicate;
      };
    }
    return this;
  };

  receivable.__isReceivable = true;
  return receivable.refresh();
};

// framework/broadcastable-receivable/broacastable.js
// ------------------

fw.isBroadcastable = function(thing) {
  return isObject(thing) && !!thing.__isBroadcastable;
};

fw.isReceivable = function(thing) {
  return isObject(thing) && !!thing.__isReceivable;
};


// framework/model/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given model and element
setupContextAndLifeCycle = function(viewModel, element) {
  if( isModel(viewModel) ) {
    var $configParams = viewModel.__getConfigParams();
    var context;
    element = element || document.body;
    viewModel.$element = element;
    viewModel.$context = elementContext = fw.contextFor(element.tagName.toLowerCase() === 'binding-wrapper' ? (element.parentElement || element.parentNode) : element);

    if( isFunction($configParams.afterBinding) ) {
      $configParams.afterBinding.call(viewModel, element);
    }

    if( isRouter(viewModel.$router) ) {
      viewModel.$router.context( elementContext );
    }

    if( !isUndefined(element) ) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        viewModel.dispose();
      });
    }
  }
}

// framework/model/applyBinding.js
// ------------------

// Override the original applyBindings method to provide 'viewModel' life-cycle hooks/events and to provide the $context to the $router if present.
originalApplyBindings = fw.applyBindings;
fw.applyBindings = function(viewModel, element) {
  originalApplyBindings(viewModel, element);
  setupContextAndLifeCycle(viewModel, element);
};

// framework/model/modelClassFactory.js
// ------------------

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function modelMixin(thing) {
  return ( (isArray(thing) && thing.length) || isObject(thing) ? thing : {} );
}

function modelClassFactory(descriptor, configParams) {
  var model = null;

  configParams = extend({}, descriptor.defaultConfig, configParams || {});

  var descriptorMixins = [];
  map(descriptor.mixins, function(mixin, index) {
    descriptorMixins.push( isFunction(mixin) ? mixin(descriptor, configParams || {}) : mixin );
  });

  var ctor = configParams.initialize || configParams.viewModel || noop;
  if( !descriptor.isModelCtor(ctor) ) {
    var isModelDuckTagMixin = {};
    isModelDuckTagMixin[descriptor.isModelDuckTag] = true;
    isModelDuckTagMixin = { mixin: isModelDuckTagMixin };

    var newInstanceCheckMixin = {
      _preInit: function() {
        if(this === windowObject) {
          throw new Error('Must use the new operator when instantiating a ' + descriptor.methodName + '.');
        }
      }
    };
    var afterInitCallbackMixin = { _postInit: configParams.afterInit || noop };
    var afterInitMixins = reject(modelMixins, isBeforeInitMixin);
    var beforeInitMixins = map(filter(modelMixins, isBeforeInitMixin), function(mixin) {
      delete mixin.runBeforeInit;
      return mixin;
    });

    var composure = [ ctor ].concat(
      modelMixin(newInstanceCheckMixin),
      modelMixin(isModelDuckTagMixin),
      modelMixin(afterInitCallbackMixin),
      modelMixin(afterInitMixins),
      modelMixin(beforeInitMixins),
      modelMixin(configParams.mixins),
      modelMixin(descriptorMixins)
    );

    model = riveter.compose.apply( undefined, composure );

    model[ descriptor.isModelCtorDuckTag ] = true;
    model.__configParams = configParams;
  } else {
    // user has specified another model constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    model = ctor;
  }

  if( !isNull(model) && isFunction(configParams.parent) ) {
    model.inherits(configParams.parent);
  }

  if( configParams.autoRegister ) {
    var namespace = configParams.namespace;
    if( descriptor.resource.isRegistered(namespace) ) {
      if( descriptor.resource.getRegistered(namespace) !== model ) {
        throw new Error('"' + namespace + '" has already been registered as a ' + descriptor.methodName + ', autoRegister failed.');
      }
    } else {
      descriptor.resource.register(namespace, model);
    }
  }

  return model;
}

// framework/model/routerClassFactory.js
// ------------------

function routerClassFactory(routerConfig) {
  var viewModel = fw.viewModel({
    router: routerConfig
  });

  if( routerConfig.autoRegister ) {
    var namespace = routerConfig.namespace;
    if( fw.routers.isRegistered(namespace) ) {
      if( fw.routers.getRegistered(namespace) !== this ) {
        throw new Error('"' + namespace + '" has already been registered as a router, autoRegister failed.');
      }
    } else {
      fw.routers.register(namespace, viewModel);
    }
  }

  return viewModel;
}

// framework/model/createFactories.js
// ------------------

createFactories = function(descriptors) {
  // create the class factory method for each entity descriptor
  filter(descriptors, function getOnlyDescriptorsWithMethodName(descriptor) {
    return isString(descriptor.methodName);
  }).forEach(function setupFactoryMethod(descriptor) {
    switch(descriptor.methodName) {
      case 'router':
        fw[descriptor.methodName] = routerClassFactory;
        break;

      default:
        fw[descriptor.methodName] = modelClassFactory.bind(null, descriptor);
    }
  });
};


// framework/router/init.js
// ------------------

var routerDefaultConfig = {
  namespace: '$router',
  baseRoute: null,
  isRelative: true,
  activate: true,
  routes: []
};

// Regular expressions used to parse a uri
var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatchRegex = /(^\/#)/;
var routesAreCaseSensitive = true;

var invalidRoutePathIdentifier = '___invalid-route';

var $baseRouter = {
  path: emptyStringResult,
  segment: emptyStringResult,
  childRouters: fw.observableArray(),
  context: noop,
  userInitialize: noop,
  __isRouter: true
};

var $nullRouter = extend({}, $baseRouter, {
  childRouters: extend( noop.bind(), { push: noop } ),
  path: function() { return ''; },
  isRelative: function() { return false; },
  __isNullRouter: true
});

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

// framework/router/utility.js
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

function isRouter(thing) {
  return isObject(thing) && !!thing.__isRouter;
}

function isRoute(thing) {
  return isObject(thing) && !!thing.__isRoute;
}

// Recursive function which will locate the nearest $router from a given ko $context
// (travels up through $parentContext chain to find the router if not found on the
// immediate $context). Returns $nullRouter if none is found.
function nearestParentRouter($context) {
  var $parentRouter = $nullRouter;
  if( isObject($context) ) {
    if( isObject($context.$data) && isRouter($context.$data.$router) ) {
      // found router in this context
      $parentRouter = $context.$data.$router;
    } else if( isObject($context.$parentContext) || (isObject($context.$data) && isObject($context.$data.$parentContext)) ) {
      // search through next parent up the chain
      $parentRouter = nearestParentRouter( $context.$parentContext || $context.$data.$parentContext );
    }
  }
  return $parentRouter;
}

(assessHistoryState = function() {
  hasHTML5History = !!windowObject.history && !!windowObject.history.pushState;
  if(!isUndefined(windowObject.History) && isObject(windowObject.History.options) && windowObject.History.options.html4Mode) {
    // user is overriding to force html4mode hash-based history
    hasHTML5History = false;
  }
})();

function trimBaseRoute($router, url) {
  if( !isNull($router.config.baseRoute) && url.indexOf($router.config.baseRoute) === 0 ) {
    url = url.substr($router.config.baseRoute.length);
    if(url.length > 1) {
      url = url.replace(hashMatchRegex, '/');
    }
  }
  return url;
}

// framework/router/outlet.js
// ------------------

var noParentViewModelError = { getNamespaceName: function() { return 'NO-VIEWMODEL-IN-CONTEXT'; } };

// This custom binding binds the outlet element to the $outlet on the router, changes on its 'route' (component definition observable) will be applied
// to the UI and load in various views
fw.virtualElements.allowedBindings.$bind = true;
fw.bindingHandlers.$bind = {
  init: function(element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var $parentViewModel = ( isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var $parentRouter = nearestParentRouter(bindingContext);
    var outletName = outletViewModel.outletName;

    if( isRouter($parentRouter) ) {
      // register this outlet with the router so that updates will propagate correctly
      // take the observable returned and define it on the outletViewModel so that outlet route changes are reflected in the view
      outletViewModel.$route = $parentRouter.$outlet( outletName );
    } else {
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + $parentViewModel.getNamespaceName() + '] but no router was defined.');
    }
  }
};

$routerOutlet = function(outletName, componentToDisplay, options ) {
  options = options || {};
  if( isFunction(options) ) {
    options = { onComplete: options };
  }

  var viewModelParameters = options.params;
  var onComplete = options.onComplete;
  var outlets = this.outlets;

  outletName = fw.unwrap( outletName );
  if( !isObservable(outlets[outletName]) ) {
    outlets[outletName] = fw.observable({
      name: noComponentSelected,
      params: {},
      __getOnCompleteCallback: function() { return noop; }
    }).broadcastAs({ name: outletName, namespace: this.$namespace });
  }

  var outlet = outlets[outletName];
  var currentOutletDef = outlet();
  var valueHasMutated = false;
  var isInitialLoad = outlet().name === noComponentSelected;

  if( !isUndefined(componentToDisplay) && currentOutletDef.name !== componentToDisplay ) {
    currentOutletDef.name = componentToDisplay;
    valueHasMutated = true;
  }

  if( !isUndefined(viewModelParameters) ) {
    currentOutletDef.params = viewModelParameters;
    valueHasMutated = true;
  }

  if( valueHasMutated ) {
    if( isFunction(onComplete) ) {
      // Return the onComplete callback once the DOM is injected in the page.
      // For some reason, on initial outlet binding only calls update once. Subsequent
      // changes get called twice (correct per docs, once upon initial binding, and once
      // upon injection into the DOM). Perhaps due to usage of virtual DOM for the component?
      var callCounter = (isInitialLoad ? 0 : 1);

      currentOutletDef.__getOnCompleteCallback = function() {
        var isComplete = callCounter === 0;
        callCounter--;
        if( isComplete ) {
          return onComplete;
        }
        return noop;
      };
    } else {
      currentOutletDef.__getOnCompleteCallback = function() {
        return noop;
      };
    }

    outlet.valueHasMutated();
  }

  return outlet;
};

registerOutletComponents = function() {
  nativeComponents.push('outlet');
  fw.components.register('outlet', {
    autoIncrement: true,
    viewModel: function(params) {
      this.outletName = fw.unwrap(params.name);
      this.__isOutlet = true;
    },
    template: '<!-- ko $bind, component: $route --><!-- /ko -->'
  });

  nativeComponents.push(noComponentSelected);
  fw.components.register(noComponentSelected, {
    viewModel: function(params) {
      this.__assertPresence = false;
    },
    template: '<div class="no-component-selected"></div>'
  });
};

// framework/router/classMethod.js
// -----------

var Router = function( routerConfig, $viewModel, $context ) {
  extend(this, $baseRouter);
  var subscriptions = this.subscriptions = fw.observableArray();
  var viewModelNamespaceName;

  if( isModel($viewModel) ) {
    viewModelNamespaceName = $viewModel.getNamespaceName();
  }

  var $globalNamespace = this.$globalNamespace = fw.namespace();
  this.id = uniqueId('router');
  this.$namespace = fw.namespace( routerConfig.namespace || (viewModelNamespaceName + 'Router') );
  this.$namespace.enter();
  this.$namespace.command.handler('setState', this.setState, this);
  this.$namespace.request.handler('currentRoute', function() { return this.currentRoute(); }, this);
  this.$namespace.request.handler('urlParts', function() { return this.urlParts(); }, this);

  this.$viewModel = $viewModel;
  this.urlParts = fw.observable();
  this.childRouters = fw.observableArray();
  this.parentRouter = fw.observable($nullRouter);
  this.context = fw.observable();
  this.historyIsEnabled = fw.observable(false);
  this.disableHistory = fw.observable().receiveFrom($globalNamespace, 'disableHistory');
  this.currentState = fw.observable('').broadcastAs('currentState');
  this.config = routerConfig = extend({}, routerDefaultConfig, routerConfig);
  this.config.baseRoute = fw.routers.baseRoute() + (result(routerConfig, 'baseRoute') || '');

  this.isRelative = fw.computed(function() {
    return routerConfig.isRelative && !isNullRouter( this.parentRouter() );
  }, this);

  this.currentRoute = fw.computed(function() {
    return this.getRouteForURL( this.normalizeURL(this.currentState()) );
  }, this);

  this.path = fw.computed(function() {
    var currentRoute = this.currentRoute();
    var routeSegment = '/';

    if( isRoute(currentRoute) ) {
      routeSegment = (currentRoute.segment === '' ? '/' : currentRoute.segment);
    }

    return (this.isRelative() ? this.parentRouter().path() : '') + routeSegment;
  }, this);

  var triggerRouteRecompute = function() {
    this.currentState.notifySubscribers();
  }.bind(this);
  var parentPathSubscription;
  var $previousParent = $nullRouter;
  subscriptions.push(this.parentRouter.subscribe(function( $parentRouter ) {
    if( !isNullRouter($previousParent) && $previousParent !== $parentRouter ) {
      $previousParent.childRouters.remove(this);

      if(parentPathSubscription) {
        subscriptions.remove(parentPathSubscription);
        parentPathSubscription.dispose();
      }
      subscriptions.push(parentPathSubscription = $parentRouter.path.subscribe(triggerRouteRecompute));
    }
    $parentRouter.childRouters.push(this);
    $previousParent = $parentRouter;
  }, this));

  // Automatically trigger the new Action() whenever the currentRoute() updates
  subscriptions.push( this.currentRoute.subscribe(function getActionForRouteAndTrigger( newRoute ) {
    if(this.currentState().length) {
      this.getActionForRoute( newRoute )( /* get and call the action for the newRoute */ );
    }
  }, this) );

  var $router = this;
  this.$globalNamespace.request.handler(entityDescriptors.getDescriptor('router').referenceNamespace, function(options) {
    if( isObject(options) ) {
      if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
        var myNamespaceName = $router.$namespace.getName();
        if(isArray(options.namespaceName) && indexOf(options.namespaceName, myNamespaceName) !== -1) {
          return $router;
        } else if(isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
          return $router;
        }
      } else {
        return $router;
      }
    } else {
      return $router;
    }
  });

  this.outlets = {};
  this.$outlet = $routerOutlet.bind(this);
  this.$outlet.reset = function() {
    each( this.outlets, function(outlet) {
      outlet({ name: noComponentSelected, params: {} });
    });
  }.bind(this);

  if( !isUndefined(routerConfig.unknownRoute) ) {
    if( isFunction(routerConfig.unknownRoute) ) {
      routerConfig.unknownRoute = { controller: routerConfig.unknownRoute };
    }
    routerConfig.routes.push( extend( routerConfig.unknownRoute, { unknown: true } ) );
  }
  this.setRoutes( routerConfig.routes );

  if( isFunction(routerConfig.initialize) ) {
    this.userInitialize = function() {
      this.$namespace.enter();
      routerConfig.initialize.call(this);
      this.$namespace.exit();
      return this;
    }.bind(this);
  }

  if( routerConfig.activate === true ) {
    subscriptions.push(this.context.subscribe(function activateRouterAfterNewContext( $context ) {
      if( isObject($context) ) {
        this.activate($context);
      }
    }, this));
  }
  this.context( $viewModel.$context || $context );

  this.$namespace.exit();
};

Router.prototype.setRoutes = function(routeDesc) {
  this.routeDescriptions = [];
  this.addRoutes(routeDesc);
  return this;
};

Router.prototype.addRoutes = function(routeConfig) {
  this.routeDescriptions = this.routeDescriptions.concat( map(isArray(routeConfig) ? routeConfig : [routeConfig], transformRouteConfigToDesc) );
  return this;
};

Router.prototype.activate = function($context, $parentRouter) {
  this.startup( $context, $parentRouter || nearestParentRouter($context) );
  this.userInitialize();
  if( this.currentState() === '' ) {
    this.setState();
  }
  return this;
};

Router.prototype.setState = function(url) {
  if( this.historyIsEnabled() && !this.disableHistory() ) {
    if(isString(url)) {
      var historyAPIWorked = true;
      try {
        historyAPIWorked = History.pushState(null, '', this.config.baseRoute + this.parentRouter().path() + url.replace(startingHashRegex, '/'));
      } catch(historyException) {
        console.error(historyException);
        historyAPIWorked = false;
      } finally {
        if(historyAPIWorked) {
          return;
        }
      }
    } else if(isFunction(History.getState)) {
      this.currentState( this.normalizeURL( History.getState().url ) );
    }
  } else if(isString(url)) {
    this.currentState( this.normalizeURL( url ) );
  } else {
    this.currentState('/');
  }

  if(!historyIsReady()) {
    var routePath = this.path();
    each(this.childRouters(), function(childRouter) {
      childRouter.currentState(routePath);
    });
  }

  return this;
};

Router.prototype.startup = function( $context, $parentRouter ) {
  $parentRouter = $parentRouter || $nullRouter;

  if( !isNullRouter($parentRouter) ) {
    this.parentRouter( $parentRouter );
  } else if( isObject($context) ) {
    $parentRouter = nearestParentRouter($context);
    if( $parentRouter.id !== this.id ) {
      this.parentRouter( $parentRouter );
    }
  }

  if( !this.historyIsEnabled() ) {
    if( historyIsReady() && !this.disableHistory() ) {
      History.Adapter.bind( windowObject, 'popstate', this.stateChangeHandler = function(event) {
        var url = '';
        if(!fw.routers.html5History() && windowObject.location.hash.length > 1) {
          url = windowObject.location.hash;
        } else {
          url = windowObject.location.pathname + windowObject.location.hash;
        }

        this.currentState( this.normalizeURL(url) );
      }.bind(this));
      this.historyIsEnabled(true);
    } else {
      this.historyIsEnabled(false);
    }
  }

  return this;
};

Router.prototype.dispose = function() {
  var $parentRouter = this.parentRouter();
  if( !isNullRouter($parentRouter) ) {
    $parentRouter.childRouters.remove(this);
  }

  if( this.historyIsEnabled() && historyIsReady() ) {
    History.Adapter.unbind( this.stateChangeHandler );
  }

  this.$namespace.dispose();
  this.$globalNamespace.dispose();

  invoke(this.subscriptions(), 'dispose');
  each(omit(this, function(property) {
    return isModel(property);
  }), propertyDisposal);
};

Router.prototype.normalizeURL = function(url) {
  var urlParts = parseUri(url);
  this.urlParts(urlParts);

  if(!fw.routers.html5History()) {
    if(url.indexOf('#') !== -1) {
      url = '/' + urlParts.anchor.replace(startingSlashRegex, '');
    } else if(this.currentState() !== url) {
      url = '/';
    }
  } else {
    url = urlParts.path;
  }

  return trimBaseRoute(this, url);
};

Router.prototype.getUnknownRoute = function() {
  var unknownRoute = findWhere((this.getRouteDescriptions() || []).reverse(), { unknown: true }) || null;

  if( !isNull(unknownRoute) ) {
    unknownRoute = extend({}, baseRoute, {
      id: unknownRoute.id,
      controller: unknownRoute.controller,
      title: unknownRoute.title,
      segment: ''
    });
  }

  return unknownRoute;
};

Router.prototype.getRouteForURL = function(url) {
  var route = null;
  var parentRoutePath = this.parentRouter().path() || '';
  var unknownRoute = this.getUnknownRoute();
  var $myRouter = this;

  // If this is a relative router we need to remove the leading parentRoutePath section of the URL
  if(this.isRelative() && parentRoutePath.length > 0 && (routeIndex = url.indexOf(parentRoutePath + '/')) === 0) {
    url = url.substr( parentRoutePath.length );
  }

  // find all routes with a matching routeString
  var matchedRoutes = reduce(this.getRouteDescriptions(), function(matches, routeDescription) {
    var routeString = routeDescription.route;
    var routeParams = [];

    if( isString(routeString) ) {
      routeParams = url.match(routeStringToRegExp(routeString));
      if( !isNull(routeParams) && routeDescription.filter.call($myRouter, routeParams, $myRouter.urlParts.peek()) ) {
        matches.push({
          routeString: routeString,
          specificity: routeString.replace(namedParamRegex, "*").length,
          routeDescription: routeDescription,
          routeParams: routeParams
        });
      }
    }
    return matches;
  }, []);

  // If there are matchedRoutes, find the one with the highest 'specificity' (longest normalized matching routeString)
  // and convert it into the actual route
  if(matchedRoutes.length) {
    var matchedRoute = reduce(matchedRoutes, function(matchedRoute, foundRoute) {
      if( isNull(matchedRoute) || foundRoute.specificity > matchedRoute.specificity ) {
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
      url: url,
      segment: url.substr(0, url.length - splatSegment.length),
      indexedParams: routeParams,
      namedParams: namedParams
    });
  }

  return route || unknownRoute;
};

function DefaultAction() {
  delete this.__currentRouteDescription;
  this.$outlet.reset();
}

function RoutedAction(routeDescription) {
  if( !isUndefined(routeDescription.title) ) {
    document.title = isFunction(routeDescription.title) ? routeDescription.title.call(this, routeDescription.namedParams, this.urlParts()) : routeDescription.title;
  }

  if( isUndefined(this.__currentRouteDescription) || !sameRouteDescription(this.__currentRouteDescription, routeDescription) ) {
    (routeDescription.controller || noop).apply( this, values(routeDescription.namedParams) );
    this.__currentRouteDescription = routeDescription;
  }
}

Router.prototype.getActionForRoute = function(routeDescription) {
  var Action;

  if( isRoute(routeDescription) ) {
    Action = RoutedAction.bind(this, routeDescription);
  }

  return Action || DefaultAction.bind(this);
};

Router.prototype.getRouteDescriptions = function() {
  return this.routeDescriptions;
};

// framework/router/routeBinding.js
// -----------

function hasClass(element, className) {
  return element.className.match( new RegExp('(\\s|^)' + className + '(\\s|$)') );
}

function addClass(element, className) {
  if( !hasClass(element, className) ) {
    element.className += (element.className.length ? ' ' : '') + className;
  }
}

function removeClass(element, className) {
  if( hasClass(element, className) ) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

fw.bindingHandlers.$route = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var $myRouter = nearestParentRouter(bindingContext);
    var urlValue = valueAccessor();
    var elementIsSetup = false;
    var stateTracker = null;
    var hashOnly = null;

    var routeHandlerDescription = {
      on: 'click',
      url: function defaultURLForRoute() { return null; },
      addActiveClass: true,
      activeClass: null,
      handler: function defaultHandlerForRoute(event, url) {
        if(hashOnly) {
          windowObject.location.hash = routeHandlerDescription.url;
          return false;
        }

        if( !isFullURL(url) && event.which !== 2 ) {
          event.preventDefault();
          return true;
        }
        return false;
      }
    };

    if( isObservable(urlValue) || isFunction(urlValue) || isString(urlValue) ) {
      routeHandlerDescription.url = urlValue;
    } else if( isObject(urlValue) ) {
      extend(routeHandlerDescription, urlValue);
    } else if( !urlValue ) {
      routeHandlerDescription.url = element.getAttribute('href');
    } else {
      throw new Error('Unknown type of url value provided to $route [' + typeof urlValue + ']');
    }

    var routeHandlerDescriptionURL = routeHandlerDescription.url;
    if( !isFunction(routeHandlerDescriptionURL) ) {
      routeHandlerDescription.url = function() { return routeHandlerDescriptionURL; };
    }

    function getRouteURL(includeParentPath) {
      var parentRoutePath = '';
      var routeURL = routeHandlerDescription.url();
      var myLinkPath = routeURL || element.getAttribute('href') || '';

      if(!isNull(routeURL)) {
        if( isUndefined(routeURL) ) {
          routeURL = myLinkPath;
        }

        if( !isFullURL(myLinkPath) ) {
          if( !hasPathStart(myLinkPath) ) {
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

          if( includeParentPath && !isNullRouter($myRouter) ) {
            myLinkPath = $myRouter.parentRouter().path() + myLinkPath;
          }

          if(fw.routers.html5History() === false) {
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
        mySegment = mySegment.replace(startingHashRegex, '/');

        if(isObject(currentRoute)) {
          if(routeHandlerDescription.addActiveClass) {
            var activeRouteClassName = routeHandlerDescription.activeClass || fw.routers.activeRouteClassName();
            if(mySegment === '/') {
              mySegment = '';
            }

            if(!isNull(newRoute) && newRoute.segment === mySegment && isString(activeRouteClassName) && activeRouteClassName.length) {
              // newRoute.segment is the same as this routers segment...add the activeRouteClassName to the element to indicate it is active
              addClass(element, activeRouteClassName);
            } else if( hasClass(element, activeRouteClassName) ) {
              removeClass(element, activeRouteClassName);
            }
          }
        }
      }
    };

    function setUpElement() {
      var myCurrentSegment = routeURLWithoutParentPath();
      if( element.tagName.toLowerCase() === 'a' ) {
        element.href = (fw.routers.html5History() ? '' : '/') + $myRouter.config.baseRoute + routeURLWithParentPath();
      }

      if( isObject(stateTracker) ) {
        stateTracker.dispose();
      }
      stateTracker = $myRouter.currentRoute.subscribe( checkForMatchingSegment.bind(null, myCurrentSegment) );

      if(elementIsSetup === false) {
        elementIsSetup = true;
        checkForMatchingSegment(myCurrentSegment, $myRouter.currentRoute());

        $myRouter.parentRouter.subscribe(setUpElement);
        fw.utils.registerEventHandler(element, routeHandlerDescription.on, function(event) {
          var currentRouteURL = routeURLWithoutParentPath();
          var handlerResult = routeHandlerDescription.handler.call(viewModel, event, currentRouteURL);
          if( handlerResult ) {
            if( isString(handlerResult) ) {
              currentRouteURL = handlerResult;
            }
            if( isString(currentRouteURL) && !isFullURL( currentRouteURL ) ) {
              $myRouter.setState( currentRouteURL );
            }
          }
        });
      }
    }

    if( isObservable(routeHandlerDescription.url) ) {
      $myRouter.subscriptions.push( routeHandlerDescription.url.subscribe(setUpElement) );
    }
    setUpElement();

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if( isObject(stateTracker) ) {
        stateTracker.dispose();
      }
    });
  }
};

// framework/router/exports.js
// -----------

extend(fw.routers, {
  // baseRoute / path which will always be stripped from the URL prior to processing the route
  baseRoute: fw.observable(''),
  activeRouteClassName: fw.observable('active'),
  disableHistory: fw.observable(false).broadcastAs({ name: 'disableHistory', namespace: $globalNamespace }),
  html5History: function() {
    return hasHTML5History;
  },
  getNearestParent: function($context) {
    var $parentRouter = nearestParentRouter($context);
    return (!isNullRouter($parentRouter) ? $parentRouter : null);
  }
});

extend(fw.outlets, {
  registerView: function(viewName, templateHTML) {
    fw.components.register(viewName, { template: templateHTML });
  },
  registerViewLocation: function(viewName, viewLocation) {
    fw.components.registerLocation(viewName, { template: viewLocation })
  }
});


// framework/component/exports.js
// ------------------

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
    if( contains(nonComponentTags, tagName) === false ) {
      nonComponentTags.push(tagName);
    }
  } else {
    nonComponentTags = filter(nonComponentTags, function(nonComponentTagName) {
      return nonComponentTagName !== tagName;
    });
  }
};

fw.component = function(componentDefinition) {
  var viewModel = componentDefinition.viewModel;

  if( isFunction(viewModel) && !isModelCtor(viewModel) ) {
    componentDefinition.viewModel = fw.viewModel( omit(componentDefinition, 'template') );
  }

  return componentDefinition;
};

// framework/component/lifecycle.js
// ------------------

function componentTriggerAfterBinding(element, viewModel) {
  if( isModel(viewModel) ) {
    var configParams = viewModel.__getConfigParams();
    if( isFunction(configParams.afterBinding) ) {
      configParams.afterBinding.call(viewModel, element);
    }
  }
}

// Use the $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if( isModel(viewModel) ) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var $parent = bindingContext.$parent;
    if( isObject($parent) && $parent.__isOutlet ) {
      $parent.$route().__getOnCompleteCallback()(element.parentElement || element.parentNode);
    }
    componentTriggerAfterBinding(element.parentElement || element.parentNode, bindingContext.$data);
  }
};

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, config, callback) {
    if( !isNativeComponent(componentName) ) {
      // TODO: Handle different types of configs
      if( isString(config) ) {
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
    if( !isNativeComponent(componentName) ) {
      callback(function(params, componentInfo) {
        var componentElement = componentInfo.element;
        var $element = (componentElement.nodeType === 8 ? (componentElement.parentElement || componentElement.parentNode) : componentElement);
        var $context = fw.contextFor($element);
        var LoadedViewModel = ViewModel;
        if( isFunction(ViewModel) ) {
          if( !isModelCtor(ViewModel) ) {
            ViewModel = fw.viewModel({ initialize: ViewModel });
          }

          // inject the context and element into the ViewModel contructor
          LoadedViewModel = ViewModel.compose({
            _preInit: function() {
              this.$context = $context;
              this.$element = $element;
            }
          });
          return new LoadedViewModel(params);
        }
        return LoadedViewModel;
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
fw.components.loaders.push( fw.components.requireLoader = {
  getConfig: function(componentName, callback) {
    var combinedFile = fw.components.getFileName(componentName, 'combined');
    var viewModelFile = fw.components.getFileName(componentName, 'viewModel');
    var templateFile = fw.components.getFileName(componentName, 'template');
    var componentLocation = fw.components.getLocation(componentName);
    var configOptions = null;
    var viewModelPath;
    var templatePath;
    var combinedPath;
    var viewModelConfig;

    if( isFunction(require) ) {
      // load component using knockouts native support for requirejs
      if( require.specified(componentName) ) {
        // component already cached, lets use it
        configOptions = {
          require: componentName
        };
      } else if( isString(componentLocation.combined) ) {
        combinedPath = componentLocation.combined;

        if( isPath(combinedPath) ) {
          combinedPath = combinedPath + combinedFile;
        }

        configOptions = {
          require: combinedPath
        };
      } else {
        // check to see if the requested component is templateOnly and should not request a viewModel (we supply a dummy object in its place)
        if( !isString(componentLocation.viewModel) ) {
          // template-only component, substitute with 'blank' viewModel
          viewModelConfig = { instance: {} };
        } else {
          viewModelPath = componentLocation.viewModel;

          if( isPath(viewModelPath) ) {
            viewModelPath = viewModelPath + viewModelFile;
          }

          if( getFilenameExtension(viewModelPath) !== getComponentExtension(componentName, 'viewModel') ) {
            viewModelPath += '.' + getComponentExtension(componentName, 'viewModel');
          }

          viewModelConfig = { require: viewModelPath };
        }

        templatePath = 'text!' + componentLocation.template;
        if( isPath(templatePath) ) {
          templatePath = templatePath + templateFile;
        }
        if( getFilenameExtension(templatePath) !== getComponentExtension(componentName, 'template') ) {
          templatePath += '.' + getComponentExtension(componentName, 'template');
        }

        configOptions = {
          viewModel: viewModelConfig,
          template: { require: templatePath }
        };
      }
    }

    callback(configOptions);
  }
});


// framework/entities/descriptorConfig.js
// ------------------

// framework/entities/behavior/ViewModel.js
// ------------------

var ViewModel = function(descriptor, configParams) {
  return {
    _preInit: function( params ) {
      if( isObject(configParams.router) ) {
        this.$router = new Router( configParams.router, this );
      }
    },
    mixin: {
      $params: result(configParams, 'params'),
      __getConfigParams: function() {
        return configParams;
      },
      dispose: function() {
        if( !this._isDisposed ) {
          this._isDisposed = true;
          if( configParams.onDispose !== noop ) {
            configParams.onDispose.call(this);
          }
          each(this, propertyDisposal);
        }
      }
    },
    _postInit: function() {
      if( this.__assertPresence !== false ) {
        this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
          if( !this.__isOutlet || (isObject(options) && options.includeOutlets) ) {
            if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
              var myNamespaceName = this.getNamespaceName();
              if(isArray(options.namespaceName) && indexOf(options.namespaceName, myNamespaceName) !== -1) {
                return this;
              } else if(isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
                return this;
              }
            } else {
              return this;
            }
          }
        }.bind(this));
      }
    }
  };
};

// framework/entities/behavior/DataModel.js
// ------------------

/**
 * Tentative API:
 *
 * var DataModel = fw.dataModel({
 *   id: 'id',
 *
 *   // string based url with automatic RESTful routes
 *   url: 'http://server.com/person',
 *
 *   // custom routes provided by callback
 *   url: function(method) {
 *     switch(method) {
 *       case 'read':
 *         return 'http://server.com/person/:id';
 *         break;
 *
 *       case 'create':
 *         return 'http://server.com/person';
 *         break;
 *
 *       case 'update':
 *         return 'http://server.com/person/:id';
 *         break;
 *
 *       case 'delete':
 *         return 'http://server.com/person/:id';
 *         break;
 *     }
 *   },
 *
 *   initialize: function() {
 *     // field declarations and mapping
 *     this.firstName = fw.observable().mapTo('firstName');
 *     this.lastName = fw.observable().mapTo('lastName');
 *     this.email = fw.observable().mapTo('email');
 *     this.movieCollection = {
 *       action: fw.observable().mapTo('movies.action'),
 *       drama: fw.observable().mapTo('movies.drama'),
 *       comedy: fw.observable().mapTo('movies.comedy'),
 *       horror: fw.observable().mapTo('movies.horror')
 *     };
 *   }
 * });
 */

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
  return dataModel.__getConfigParams().idAttribute;
}

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

  if(isNull(dataModel)) {
    throw new Error('No dataModel context found/supplied for mapTo observable');
  }

  var mappings = dataModel.__mappings;
  var primaryKey = getPrimaryKey(dataModel);
  if( !isUndefined(mappings[mapPath]) && (mapPath !== primaryKey && dataModel.$id.__isOriginalPK)) {
    throw new Error('the field \'' + mapPath + '\' is already mapped on this dataModel');
  }

  if(!isUndefined(mappings[mapPath]) && isFunction(mappings[mapPath].dispose)) {
    // remapping a path, we need to dispose of the old one first
    mappings[mapPath].dispose();
  }

  // add/set the registry entry for the mapped observable
  mappings[mapPath] = mappedObservable;

  if(mapPath === primaryKey) {
    // mapping primary key, update/set the $id property on the dataModel
    dataModel.$id = mappings[mapPath];
  }

  var changeSubscription = mappedObservable.subscribe(function() {
    dataModel.$dirty(true);
  });

  var disposeObservable = mappedObservable.dispose || noop;
  if(isFunction(mappedObservable.dispose)) {
    mappedObservable.dispose = function() {
      changeSubscription.dispose();
      disposeObservable.call(mappedObservable);
    };
  }

  return mappedObservable;
};

function insertValueIntoObject(rootObject, fieldMap, fieldValue) {
  if(isString(fieldMap)) {
    return insertValueIntoObject(rootObject, fieldMap.split('.'), fieldValue);
  }

  var propName = fieldMap.shift();
  if(fieldMap.length) {
    if(isUndefined(rootObject[propName])) {
      // nested property, lets add the child
      rootObject[propName] = {};
    }
    // recurse into the next layer
    return insertValueIntoObject(rootObject[propName], fieldMap, fieldValue);
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

  return !isString(propName) ? rootObject : (rootObject || {})[propName];
}

function noURLError() {
  throw new Error('A "url" property or function must be specified');
};

// Map from CRUD to HTTP for our default `fw.$sync` implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch':  'PATCH',
  'delete': 'DELETE',
  'read':   'GET'
};

var parseURLRegex = /^(http[s]*:\/\/[a-zA-Z0-9:\.]*)*([\/]{0,1}[\w\.:\/-]*)$/;
var parseParamsRegex = /(:[\w\.]+)/g;

each(runPostInit, function(runTask) {
  fw.ajax = ajax;
  extend(fw.settings, {
    emulateHTTP: false,
    emulateJSON: false
  });
});

fw.sync = function(action, dataModel, params) {
  params = params || {};

  var options = extend({
    type: methodMap[action],
    dataType: 'json',
    url: null,
    data: null,
    headers: {},
    emulateHTTP: fw.settings.emulateHTTP,
    emulateJSON: fw.settings.emulateJSON
  }, params);

  var url = options.url;
  if(isNull(url)) {
    var configParams = dataModel.__getConfigParams();
    url = configParams.url;
    if(isFunction(url)) {
      url = url.call(dataModel, action);
    } else {
      if(contains(['read', 'update', 'patch', 'delete'], action)) {
        // need to append /:id to url
        url = url.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute;
      }
    }
  }
  var urlPieces = (url || noURLError()).match(parseURLRegex);
  var baseURL = urlPieces[1] || '';
  options.url = last(urlPieces);

  // replace any interpolated parameters
  var urlParams = options.url.match(parseParamsRegex);
  if(urlParams) {
    each(urlParams, function(param) {
      options.url = options.url.replace(param, dataModel.$toJS(param.substr(1)));
    });
  }
  options.url = baseURL + options.url;

  if(isNull(options.data) && dataModel && contains(['create', 'update', 'patch'], action)) {
    options.contentType = 'application/json';
    options.data = dataModel.$toJS();
  }

  // For older servers, emulate JSON by encoding the request into an HTML-form.
  if(options.emulateJSON) {
    options.contentType = 'application/x-www-form-urlencoded';
    options.data = options.data ? { model: options.data } : {};
  }

  // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
  // And an `X-HTTP-Method-Override` header.
  if(options.emulateHTTP && contains(['PUT', 'DELETE', 'PATCH'], options.type)) {
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
  // var error = options.error;
  // options.error = function(xhr, textStatus, errorThrown) {
  //   options.textStatus = textStatus;
  //   options.errorThrown = errorThrown;
  //   if (error) error.call(options.context, xhr, textStatus, errorThrown);
  // };

  return fw.ajax(options);
  // dataModel.trigger('request', model, xhr, options);
};

var DataModel = function(descriptor, configParams) {
  return {
    runBeforeInit: true,
    _preInit: function( params ) {
      enterDataModelContext(this);

      this.__mappings = {};

      this.$dirty = fw.observable(false);
      this.$cid = fw.observable( fw.utils.guid() );
      this[configParams.idAttribute] = this.$id = fw.observable().mapTo(configParams.idAttribute);
      this.$id.__isOriginalPK = true;
    },
    mixin: {
      __isDataModel: true,

      // GET from server and $load into model
      $fetch: function() {
        var model = this;
        var id = this[configParams.idAttribute]();
        if(id) {
          // retrieve data from server for model using the id
          this.$sync('read', model);
        }
      },
      $save: function() {}, // PUT / POST
      $destroy: function() {}, // DELETE

      // load data into model (clears $dirty)
      $load: function( data ) {
        var dataModel = this;
        each(dataModel.__mappings, function(fieldObservable, fieldMap) {
          var fieldValue = getNestedReference(data, fieldMap);
          if(!isUndefined(fieldValue)) {
            fieldObservable(fieldValue);
          }
        });
      },

      $sync: function() {
        return fw.sync.apply(this, arguments);
      },

      $hasMappedField: function(referenceField) {
        return !!this.__mappings[referenceField];
      },

      // return current data in POJO form
      $toJS: function(referenceField, includeRoot) {
        var dataModel = this;
        if(isArray(referenceField)) {
          return reduce(referenceField, function(jsObject, fieldMap) {
            return merge(jsObject, dataModel.$toJS(fieldMap, true));
          }, {});
        } else if(!isUndefined(referenceField) && !isString(referenceField)) {
          throw new Error(dataModel.getNamespaceName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.$toJS().');
        }

        var mappedObject = reduce(this.__mappings, function reduceModelToObject(jsObject, fieldObservable, fieldMap) {
          if(isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
            insertValueIntoObject(jsObject, fieldMap, fieldObservable());
          }
          return jsObject;
        }, {});

        return includeRoot ? mappedObject : getNestedReference(mappedObject, referenceField);
      },

      // return current data in JSON form
      $toJSON: function(referenceField, includeRoot) {
        return JSON.stringify( this.$toJS(referenceField, includeRoot) );
      },

      $valid: function( referenceField ) {}, // get validation of entire model or selected field
      $validate: function() {} // perform a validation and return the result on a specific field or the entire model
    },
    _postInit: function() {
      this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
        if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
          var myNamespaceName = configParams.namespace;
          if(isArray(options.namespaceName) && indexOf(options.namespaceName, myNamespaceName) !== -1) {
            return this;
          } else if(isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
            return this;
          }
        }
      }.bind(this));

      exitDataModelContext();
    }
  };
};


entityDescriptors = entityDescriptors.concat([
  {
    tagName: 'viewmodel',
    methodName: 'viewModel',
    defaultLocation: '/viewModel/',
    resource: fw.viewModels,
    mixins: [ ViewModel ],
    defaultConfig: {
      namespace: undefined,
      autoRegister: false,
      autoIncrement: false,
      mixins: undefined,
      params: undefined,
      afterInit: noop,
      afterBinding: noop,
      onDispose: noop
    }
  }, {
    tagName: 'datamodel',
    methodName: 'dataModel',
    defaultLocation: '/dataModel/',
    resource: fw.dataModels,
    mixins: [ ViewModel, DataModel ],
    defaultConfig: {
      idAttribute: 'id',
      url: null,
      namespace: undefined,
      autoRegister: false,
      autoIncrement: true,
      mixins: undefined,
      params: undefined,
      afterInit: noop,
      afterBinding: noop,
      onDispose: noop
    }
  }, {
    tagName: 'router',
    methodName: 'router',
    defaultLocation: '/',
    resource: fw.routers
  }
]);

// framework/entities/bindingInit.js
// ------------------

function modelBinder(element, params, ViewModel) {
  var viewModelObj;
  if( isFunction(ViewModel) ) {
    viewModelObj = new ViewModel(params);
  } else {
    viewModelObj = ViewModel;
  }
  viewModelObj.$parentContext = fw.contextFor(element.parentElement || element.parentNode);

  // Have to create a wrapper element for the contents of the element. Cannot bind to
  // existing element as it has already been bound against.
  var wrapperNode = document.createElement('binding-wrapper');
  element.insertBefore(wrapperNode, element.firstChild);

  var childrenToInsert = [];
  each(element.children, function(child) {
    if(!isUndefined(child) && child !== wrapperNode) {
      childrenToInsert.push(child);
    }
  });

  each(childrenToInsert, function(child) {
    wrapperNode.appendChild(child);
  });

  fw.applyBindings(viewModelObj, wrapperNode);
};

// Monkey patch enables the viewModel or router component to initialize a model and bind to the html as intended (with lifecycle events)
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
  if(tagName === '__elementBased') {
    tagName = element.tagName;
  }

  if(isString(tagName)) {
    tagName = tagName.toLowerCase();
    if( entityDescriptors.tagNameIsPresent(tagName) ) {
      var values = valueAccessor();
      var moduleName = ( !isUndefined(values.params) ? fw.unwrap(values.params.name) : undefined ) || element.getAttribute('module') || element.getAttribute('data-module');
      var bindModel = modelBinder.bind(null, element, values.params);
      var resource = entityDescriptors.resourceFor(tagName);
      var getResourceLocationFor = getResourceLocation.bind(resource);

      if(isNull(moduleName) && isString(values)) {
        moduleName = values;
      }

      if( !isUndefined(moduleName) && !isNull(resource) ) {
        var resourceLocation = getResourceLocationFor(moduleName);

        if( isString(resourceLocation) ) {
          if( isFunction(require) ) {
            if( isPath(resourceLocation) ) {
              resourceLocation = resourceLocation + resource.getFileName(moduleName);
            }

            require([ resourceLocation ], bindModel);
          } else {
            throw new Error('Uses require, but no AMD loader is present');
          }
        } else if( isFunction(resourceLocation) ) {
          bindModel( resourceLocation );
        } else if( isObject(resourceLocation) ) {
          if( isObject(resourceLocation.instance) ) {
            bindModel( resourceLocation.instance );
          } else if( isFunction(resourceLocation.createViewModel) ) {
            bindModel( resourceLocation.createViewModel( values.params, { element: element } ) );
          }
        }
      }

      return { 'controlsDescendantBindings': true };
    } else if( tagName === 'outlet' ) {
      // we patch in the 'name' of the outlet into the params valueAccessor on the component definition (if necessary and available)
      var outletName = element.getAttribute('name') || element.getAttribute('data-name');
      if( outletName ) {
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

// framework/entities/init.js
// ----------------

function makeBooleanChecks(descriptor) {
  return {
    isModelCtor: function isModelCtor(thing) {
      return isFunction(thing) && !!thing[ descriptor.isModelCtorDuckTag ];
    },
    isModel: function isModel(thing) {
      return isObject(thing) && !!thing[ descriptor.isModelDuckTag ];
    }
  };
}

entityDescriptors = map(entityDescriptors, function prepareDescriptor(descriptor) {
  descriptor = extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    isModelCtorDuckTag: '__isModelCtor',
    isModelDuckTag: '__isModel',
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



// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  // must initialize require context (https://github.com/jrburke/requirejs/issues/1305#issuecomment-87924865)
  isFunction(require) && require([]);

  assessHistoryState();
  targetElement = targetElement || windowObject.document.body;
  originalApplyBindings({}, targetElement);
};

each(runPostInit, function(runTask) {
  runTask();
});


      return ko;
    })( root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter, root.reqwest );
  })();
}));
