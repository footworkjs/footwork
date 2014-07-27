/**
 * footwork.js - A solid footing for knockout applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v0.2.0-bare
 * Url: http://footworkjs.com
 * License(s): MIT
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal', 'delegate', 'Apollo', 'reqwest'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'), require('delegate'), require('Apollo'), require('reqwest'));
  } else {
    root.ko = factory(_, ko, postal, delegate, Apollo, reqwest);
  }
}(this, function (_, ko, postal, delegate, Apollo, reqwest) {
  // Cross-browser console log() function
  // http://patik.github.io/console.log-wrapper/
  /**
 * Cross-Browser console.log() Wrapper
 *
 * Version 2.0.0, 2013-10-20
 * By Craig Patik
 * https://github.com/patik/console.log-wrapper/
 */
/*global log:true */

// Tell IE9 to use its built-in console
if (Function.prototype.bind && /^object$|^function$/.test(typeof console) && typeof console.log === 'object' && typeof window.addEventListener === 'function') {
    ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
        .forEach(function(method) {
            console[method] = this.call(console[method], console);
        }, Function.prototype.bind);
}

// log() -- The complete, cross-browser (we don't judge!) console.log wrapper for his or her logging pleasure
if (!window.log) {
    window.log = function() {
        var args = arguments,
            isIECompatibilityView = false,
            i, sliced,
            // Test if the browser is IE8
            isIE8 = function _isIE8() {
                // Modenizr, es5-shim, and other scripts may polyfill `Function.prototype.bind` so we can't rely solely on whether that is defined
                return (!Function.prototype.bind || (Function.prototype.bind && typeof window.addEventListener === 'undefined')) &&
                    typeof console === 'object' &&
                    typeof console.log === 'object';
            };

        log.history = log.history || []; // store logs to an array for reference
        log.history.push(arguments);

        // If the detailPrint plugin is loaded, check for IE10- pretending to be an older version,
        //   otherwise it won't pass the "Browser with a console" condition below. IE8-10 can use
        //   console.log normally, even though in IE7/8 modes it will claim the console is not defined.
        // TODO: Can someone please test this on Windows Vista and Windows 8?
        if (log.detailPrint && log.needsDetailPrint) {
            (function() {
                var ua = navigator.userAgent,
                    winRegexp = /Windows\sNT\s(\d+\.\d+)/;

                // Check for certain combinations of Windows and IE versions to test for IE running in an older mode
                if (console && console.log && /MSIE\s(\d+)/.test(ua) && winRegexp.test(ua)) {
                    // Windows 7 or higher cannot possibly run IE7 or older
                    if (parseFloat(winRegexp.exec(ua)[1]) >= 6.1) {
                        isIECompatibilityView = true;
                    }
                    // Cannot test for IE8+ running in IE7 mode on XP (Win 5.1) or Vista (Win 6.0)...
                }
            }());
        }

        // Browser with a console
        if (isIECompatibilityView || typeof console.log === 'function') {
            sliced = Array.prototype.slice.call(args);

            // Get argument details for browsers with primitive consoles if this optional plugin is included
            if (log.detailPrint && log.needsDetailPrint) {
                // Display a separator before the list
                console.log('-----------------');
                args = log.detailPrint(args);
                i = 0;

                while (i < args.length) {
                    console.log(args[i]);
                    i++;
                }
            }
            // Single argument, which is a string
            else if (sliced.length === 1 && typeof sliced[0] === 'string') {
                console.log(sliced.toString());
            }
            else {
                console.log(sliced);
            }
        }
        // IE8
        else if (isIE8()) {
            if (log.detailPrint) {
                // Prettify arguments
                args = log.detailPrint(args);

                // Add separator at the beginning of the list
                args.unshift('-----------------');

                // Loop through arguments and log them individually
                i = 0;
                while (i < args.length) {
                    Function.prototype.call.call(console.log, console, Array.prototype.slice.call([args[i]]));
                    i++;
                }
            }
            else {
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(args));
            }
        }
        // IE7 and lower, and other old browsers
        else {
            // Inject Firebug lite
            if (!document.getElementById('firebug-lite')) {
                // Include the script
                (function () {
                    var script = document.createElement('script');

                    script.type = 'text/javascript';
                    script.id = 'firebug-lite';

                    // If you run the script locally, change this to /path/to/firebug-lite/build/firebug-lite.js
                    script.src = 'https://getfirebug.com/firebug-lite.js';

                    // If you want to expand the console window by default, uncomment this line
                    //document.getElementsByTagName('HTML')[0].setAttribute('debug','true');
                    document.getElementsByTagName('HEAD')[0].appendChild(script);
                }());

                setTimeout(function() {
                    window.log.apply(window, args);
                }, 2000);
            }
            else {
                // FBL was included but it hasn't finished loading yet, so try again momentarily
                setTimeout(function() {
                    window.log.apply(window, args);
                }, 500);
            }
        }
    };
}

  
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
      delegate: delegate,
      Apollo: Apollo,
      reqwest: reqwest,
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

    if(typeof root.postal.preserve === 'undefined') {
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
            factory(require("lodash"), require("conduit"), postal, this);
        };
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["lodash", "conduit", "postal"], function (_, Conduit, postal) {
            return factory(_, Conduit, postal, root);
        });
    } else {
        // Browser globals
        root.postal = factory(root._, root.Conduit, root.postal, root);
    }
}(this, function (_, Conduit, postal, global, undefined) {
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
        console.log("Expired message count: " + expired.length);
        while (expired.length) {
            expired.pop().purge();
        }
    }
    if (!postal.subscribe.after) {
        var orig = postal.subscribe;
        postal.subscribe = new Conduit.Sync({
            context: postal,
            target: orig
        });
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
    };
    return postal;
}));
      }).call(root);
    }

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ 'riveter' ];

    return (function footwork(embedded, _, ko, postal, Apollo, riveter, delegate, reqwest) {
      // main.js
// -----------

// Record the footwork version as of this build.
ko._footworkVersion = '0.2.0';

// Expose any embedded dependencies
ko.embed = embedded;

//polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

// misc utility functions
var noop = function() { };

var isPath = function(pathOrLocation) {
  return pathOrLocation.match(/\/$/i) !== null;
};

// Initialize the debugLevel observable, this controls
// what level of debug statements are logged to the console
// 0 === off
// 1 === errors / problems only
// 2 === notices (very noisy)
ko.debugLevel = ko.observable(1);

// expose internal logging methods
ko.log = function() {
  if(ko.debugLevel() >= 2) {
    log.apply(null, arguments);
  }
};
ko.logError = function() {
  if(ko.debugLevel() >= 1) {
    log.apply(null, arguments);
  }
};

// Preserve the original applyBindings method for later use
var originalApplyBindings = ko.applyBindings;

// Override the original applyBindings method to provide and enable 'model' life-cycle hooks/events.
var applyBindings = ko.applyBindings = function(model, element) {
  originalApplyBindings(model, element);

  if(isViewModel(model) === true) {
    var $configParams = model.__getConfigParams();
    if(typeof $configParams.afterBinding === 'function') {
      $configParams.afterBinding.call(model);
    }
  }
};

// This stores the mixins which are automatically added to each viewModel
var viewModelMixins = [];

// namespace.js
// ------------------

// This counter is used when model options { autoIncrement: true } and more than one model
// having the same namespace is instantiated. This is used in the event you do not want
// multiple copies of the same model to share the same namespace (if they do share a
// namespace, they receive all of the same events/messages/commands/etc).
var namespaceNameCounter = {};

// Prepare an empty namespace stack.
// This is where footwork registers its current working namespace name. Each new namespace is
// 'unshifted' and 'shifted' as they are entered and exited, keeping the most current at
// index 0.
var namespaceStack = [];

// Returns a normalized namespace name based off of 'name'. It will register the name counter
// if not present and increment it if it is, then return the name (with the counter appended
// if autoIncrement === true and the counter is > 0).
function indexedNamespaceName(name, autoIncrement) {
  if(namespaceNameCounter[name] === undefined) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + (autoIncrement === true ? namespaceNameCounter[name] : '');
}

function createEnvelope(topic, data, expires) {
  var envelope = {
    topic: topic,
    data: data
  };

  if(typeof expires !== 'undefined') {
    envelope.headers = {
      preserve: true
    };
    if(expires instanceof Date) {
      envelope.expires = expires
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
  if( typeof context !== 'undefined' ) {
    callback = _.bind(callback, context);
  }

  var handlerSubscription = this.subscribe('event.' + eventKey, callback).enlistPreserved();
  this.commandHandlers.push(handlerSubscription);

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
function registerNamespaceCommandHandler(requestKey, callback, context) {
  if( typeof context !== 'undefined' ) {
    callback = _.bind(callback, context);
  }

  var handlerSubscription = this.subscribe('command.' + requestKey, callback).enlistPreserved();
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to issue a request for data from a namespace, returning the response (or undefined if no response)
// This method will return an array of responses if more than one is received.
function requestResponseFromNamespace(requestKey, params) {
  var response = undefined;
  var responseSubscription;

  responseSubscription = this.subscribe('request.' + requestKey + '.response', function(reqResponse) {
    if(typeof response === 'undefined') {
      response = reqResponse;
    } else {
      if( _.isArray(response) === true ) {
        response.push(reqResponse);
      } else {
        response = [ response, reqResponse ];
      }
    }
  });

  this.publish( createEnvelope('request.' + requestKey, response) );
  responseSubscription.unsubscribe();

  return response;
}

// Method used to register a request handler on a namespace.
// Requests sent using the specified requestKey will be called and passed in any params specified, the return value is passed back to the issuer
function registerNamespaceRequestHandler(requestKey, callback, context) {
  if( typeof context !== 'undefined' ) {
    callback = _.bind(callback, context);
  }

  var requestHandler = _.bind(function(params) {
    var callbackResponse = callback(params);
    this.publish( createEnvelope('request.' + requestKey + '.response', callbackResponse) );
  }, this);

  var handlerSubscription = this.subscribe('request.' + requestKey, requestHandler);
  this.requestHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// This effectively shuts down all requests, commands, and events by unsubscribing all handlers on a discreet namespace object
function disconnectNamespaceHandlers() {
  _.invoke(this.requestHandlers, 'unsubscribe');
  _.invoke(this.commandHandlers, 'unsubscribe');
  _.invoke(this.eventHandlers, 'unsubscribe');
  return this;
}

function onNamespaceTemplateBind(callback, context) {
  if( typeof context !== 'undefined' ) {
    callback = _.bind(callback, context);
  }
  var handlerSubscription = this.subscribe('__elementIsBound', callback);
  this.bindingHandlers.push(handlerSubscription);

  return handlerSubscription;
}

function getNamespaceName() {
  return this.channel;
}

// Creates and returns a new namespace instance
var makeNamespace = ko.namespace = function(namespaceName, $parentNamespace) {
  if(typeof $parentNamespace !== 'undefined') {
    if(typeof $parentNamespace === 'string') {
      namespaceName = $parentNamespace + '.' + namespaceName;
    } else if(typeof $parentNamespace.channel !== 'undefined') {
      namespaceName = $parentNamespace.channel + '.' + namespaceName;
    }
  }
  var namespace = postal.channel(namespaceName);

  namespace.shutdown = _.bind( disconnectNamespaceHandlers, namespace );

  namespace.commandHandlers = [];
  namespace.command = _.bind( sendCommandToNamespace, namespace );
  namespace.command.handler = _.bind( registerNamespaceCommandHandler, namespace );
  namespace.command.handler.unregister = _.bind( unregisterNamespaceHandler, namespace );

  namespace.requestHandlers = [];
  namespace.request = _.bind( requestResponseFromNamespace, namespace );
  namespace.request.handler = _.bind( registerNamespaceRequestHandler, namespace );
  namespace.request.handler.unregister = _.bind( unregisterNamespaceHandler, namespace );

  namespace.eventHandlers = [];
  namespace.event = namespace.triggerEvent = _.bind( triggerEventOnNamespace, namespace );
  namespace.event.handler = _.bind( registerNamespaceEventHandler, namespace );
  namespace.event.handler.unregister = _.bind( unregisterNamespaceHandler, namespace );

  namespace.bindingHandlers = [];
  namespace.afterBinding = _.bind( onNamespaceTemplateBind, namespace );
  namespace.afterBinding.unregister = _.bind( unregisterNamespaceHandler, namespace );

  namespace.getName = _.bind( getNamespaceName, namespace );

  return namespace;
};

// Duck type check for a namespace object
var isNamespace = ko.isNamespace = function(thing) {
  return _.isFunction(thing.subscribe) && _.isFunction(thing.publish) && typeof thing.channel === 'string';
};

// Return the current namespace name.
var currentNamespaceName = ko.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
var currentNamespace = ko.currentNamespace = function() {
  return makeNamespace( currentNamespaceName() );
};

// enterNamespaceName() adds a namespaceName onto the namespace stack at the current index, 
// 'entering' into that namespace (it is now the currentNamespace).
// The namespace object returned from this method also has a pointer to its parent
var enterNamespaceName = ko.enterNamespaceName = function(namespaceName) {
  var $parentNamespace = currentNamespace();
  namespaceStack.unshift( namespaceName );
  return makeNamespace( currentNamespaceName() );
};

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack
var exitNamespace = ko.exitNamespace = function() {
  namespaceStack.shift();
  return currentNamespace();
};

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
viewModelMixins.push({
  _preInit: function( options ) {
    var $configParams = this.__getConfigParams();
    this.$namespace = enterNamespaceName( indexedNamespaceName($configParams.componentNamespace || $configParams.namespace || $configParams.name || _.uniqueId('namespace'), $configParams.autoIncrement) );
    this.$globalNamespace = makeNamespace();
  },
  mixin: {
    getNamespaceName: function() {
      return this.$namespace.getName();
    },
    broadcastAll: function() {
      var model = this;
      _.each( this, function(property, propName) {
        if( isABroadcastable(property) === true ) {
          property.broadcast();
        }
      });
      return this;
    },
    refreshReceived: function() {
      _.each( this, function(property, propName) {
        if( isAReceivable(property) === true ) {
          property.refresh();
        }
      });
      return this;
    }
  },
  _postInit: function( options ) {
    viewModels[ this.getNamespaceName() ] = this;
    exitNamespace();
  }
});
// viewModel.js
// ------------------

// Duck type function for determining whether or not something is a footwork viewModel constructor function
function isViewModelCtor(thing) {
  return typeof thing !== 'undefined' && thing.__isViewModelCtor === true;
}

// Duck type function for determining whether or not something is a footwork viewModel
function isViewModel(thing) {
  return typeof thing !== 'undefined' && _.isFunction(thing.__getConfigParams) === true;
}

// Initialize the viewModels registry
var viewModels = {};

// Returns the number of created viewModels for each defined namespace
var viewModelCount = ko.viewModelCount = function() {
  var counts = _.reduce(namespaceNameCounter, function(viewModelCounts, viewModelCount, viewModelName) {
    viewModelCounts[viewModelName] = viewModelCount + 1;
    return viewModelCounts;
  }, {});
  counts.__total = _.reduce(_.values(counts), function(summation, num) {
    return summation + num;
  }, 0);
  return counts;
};

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all model references is returned.
var getViewModels = ko.getViewModels = function(namespaceName) {
  if(namespaceName === undefined) {
    return viewModels;
  }
  return viewModels[namespaceName];
};

// Tell all viewModels to request the values which it listens for
var refreshModels = ko.refreshViewModels = function() {
  _.invoke(getViewModels(), 'refreshReceived');
};

var makeViewModel = ko.viewModel = function(configParams) {
  var ctor;
  var afterInit;

  configParams = configParams || {};
  if( typeof configParams !== 'undefined') {
    ctor = configParams.viewModel || configParams.initialize || noop;
    afterInit = configParams.afterInit || noop;
  }
  afterInit = { _postInit: afterInit };

  configParams = _.extend({
    namespace: undefined,
    name: undefined,
    componentNamespace: undefined,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    initialize: noop,
    afterInit: noop,
    afterBinding: noop
  }, configParams);

  var initViewModelMixin = {
    _preInit: function( initParams ) {
      this.$params = configParams.params;
      this.__getConfigParams = function() {
        return configParams;
      };
      this.__getInitParams = function() {
        return initParams;
      };
    },
    _postInit: function() {
      this.$namespace.request.handler('__footwork_model_reference', function() {
        return this;
      });
    }
  };

  var composure = [ ctor, initViewModelMixin ].concat( viewModelMixins, afterInit );
  if(configParams.mixins !== undefined) {
    composure = composure.concat(configParams.mixins);
  }

  var model = riveter.compose.apply( undefined, composure );
  model.__isViewModelCtor = true;

  return model;
};
// resource.js
// ------------------

var resourceFileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

ko.components.setFileExtensions = function(fileType, extension) {
  if( typeof fileType === 'object' ) {
    _.extend(resourceFileExtensions, fileType);
  } else if(typeof resourceFileExtensions[fileType] !== 'undefined') {
    resourceFileExtensions[fileType] = extension;
  }
};

ko.components.getFileExtensions = function() {
  return _.clone(resourceFileExtensions);
};

ko.components.getNormalTagList = function() {
  return normalTags.splice(0);
};

ko.components.getComponentNameForNode = function(node) {
  var tagName = node.tagName && node.tagName.toLowerCase();

  if( ko.components.isRegistered(tagName) || _.indexOf(normalTags, tagName) === -1 ) {
    return tagName;
  }
  return null;
};

var defaultResourceLocation = {
  combined: null,
  viewModels: '/viewModel/',
  templates: '/component/'
};
var resourceRelativeLocation = function(rootURL, returnTheValue) {
  var componentLocation = defaultResourceLocation;
  if(returnTheValue === true) {
    componentLocation = _.extend({}, defaultResourceLocation);
  }

  if( _.isObject(rootURL) === true ) {
    // assume some combination of defaultResourceLocation and normalize the parameters
    _.extend(componentLocation, _.reduce(rootURL, function(options, paramValue, paramName) {
      if(paramName === 'viewModel') {
        options.viewModels = paramValue;
        delete options.viewModel;
      } else if(paramName === 'template') {
        options.templates = paramValue;
        delete options.template;
      } else {
        options[paramName] = paramValue;
      }
      return options;
    }, {}));
  } else if( typeof rootURL === 'string' ) {
    componentLocation = {
      combined: rootURL,
      viewModels: null,
      templates: null
    };
  }

  if(returnTheValue === true) {
    return componentLocation;
  } else {
    defaultResourceLocation = componentLocation;
  }
};

var componentRelativeLocation = ko.components.loadRelativeTo = function(locations, returnTheValue) {
  var returnValue = resourceRelativeLocation(locations, returnTheValue);
  if(returnTheValue === true) {
    return returnValue;
  }
};

var resourceLocations = ko.resourceLocations = {};
var registerLocationOfComponent = ko.components.registerLocationOf = function(componentName, componentLocation) {
  if( _.isArray(componentName) === true ) {
    _.each(componentName, function(name) {
      registerLocationOfComponent(name, componentLocation);
    });
  }
  resourceLocations[ componentName ] = componentRelativeLocation(componentLocation, true);
};

var viewModelRelativeLocation = ko.viewModel.loadRelativeTo = function(rootURL, returnTheValue) {
  var returnValue = resourceRelativeLocation({ viewModel: rootURL }, returnTheValue);
  if(returnTheValue === true) {
    return returnValue;
  }
};

var registerLocationOfViewModel = ko.viewModel.registerLocationOf = function(viewModelName, viewModelLocation) {
  if( _.isArray(viewModelName) === true ) {
    _.each(viewModelName, function(name) {
      registerLocationOfViewModel(name, viewModelLocation);
    });
  }
  resourceLocations[ viewModelName ] = viewModelRelativeLocation(viewModelLocation, true);
};

// Return the resource definition for the supplied resourceName
var getResourceLocation = ko.getResourceLocation = function(resourceName) {
  return resourceLocations[resourceName] || defaultResourceLocation;
};
// component.js
// ------------------

var originalComponentRegisterFunc = ko.components.register;
var registerComponent = ko.components.register = function(componentName, options) {
  var viewModel = options.initialize || options.viewModel;
  
  if(typeof componentName !== 'string') {
    throw 'Components must be provided a componentName.';
  }

  //TODO: determine how mixins from the (optionally) supplied footwork viewModel mix in with the mixins supplied directly in the component options
  //      as well as others like params, afterBinding. Currently we will just use the viewModel's mixins/etc, only the namespace is overridden
  //      from the component definition/configuration.
  if( isViewModelCtor(viewModel) ) {
    viewModel.options.componentNamespace = componentName;
  } else if( typeof viewModel === 'function' ) {
    options.namespace = componentName;
    viewModel = makeViewModel(options);
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel,
    template: options.template
  });
};

var makeComponent = ko.component = function(options) {
  var viewModel = options.viewModel;
  var template = options.template;

  var componentDefinition = {
    viewModel: viewModel,
    template: template
  };

  if( typeof viewModel === 'function' && isViewModelCtor(viewModel) === false ) {
    componentDefinition.viewModel = makeViewModel( _.omit(options, 'template') );
  } else if( typeof viewModel === 'object' ) {
    componentDefinition.viewModel = viewModel;
  }

  return componentDefinition;
};

// These are tags which are ignored by the custom component loader
// Sourced from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var normalTags = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bgsound',
  'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
  'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element',
  'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'g', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label',
  'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'nobr',
  'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'polygon', 'path', 'pre',
  'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'spacer',
  'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea',
  'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'
];
ko.components.tagIsComponent = function(tagName, isComponent) {
  isComponent = (typeof isComponent === 'undefined' ? true : isComponent);

  if( _.isArray(tagName) === true ) {
    _.each(tagName, function(tag) {
      ko.components.tagIsComponent(tag, isComponent);
    });
  }

  if(isComponent !== true) {
    if( _.contains(normalTags, tagName) === false ) {
      normalTags.push(tagName);
    }
  } else {
    normalTags = _.filter(normalTags, function(normalTagName) {
      return normalTagName !== tagName;
    });
  }
};

// Monkey patch enables the viewModel 'component' to initialize a model and bind to the html as intended
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = ko.bindingHandlers.component.init;
ko.bindingHandlers.component.init = function(element, valueAccessor, ignored1, ignored2, bindingContext) {
  if( element.tagName.toLowerCase() === 'viewmodel' ) {
    var values = valueAccessor();

    if( typeof values.params.name !== 'undefined' ) {
      var viewModelName = ko.unwrap(values.params.name);
      var resourceLocation = getResourceLocation( viewModelName ).viewModels;

      if( typeof require === 'function' && typeof require.defined === 'function' && require.defined(viewModelName) === true ) {
        // we have found a matching resource that is already cached by require, lets use it
        resourceLocation = viewModelName;
      }

      var bindViewModel = function(ViewModel) {
        var viewModel = ViewModel;
        if(typeof ViewModel === 'function') {
          viewModel = new ViewModel(values.params);
        }

        // binding the viewModel onto each child element is not ideal, need to do this differently
        // cannot get component.preprocess() method to work/be called for some reason
        _.each(element.children, function(child) {
          applyBindings(viewModel, child);
        });
      };

      if(typeof resourceLocation === 'string' ) {
        if(typeof require === 'function') {
          if(isPath(resourceLocation) === true) {
            resourceLocation = resourceLocation + values.params.name;
          }
          if( resourceLocation !== viewModelName && resourceLocation.match(/\.js$/) === null ) {
            resourceLocation = resourceLocation + resourceFileExtensions.viewModel;
          }

          // TODO: figure out why the leading '/' causes a problem here but not on components loaded via require?
          resourceLocation = resourceLocation.replace(/^\//, '');

          require([ resourceLocation ], bindViewModel);
        } else {
          throw 'Uses require, but no AMD loader is present';
        }
      } else if( typeof resourceLocation === 'function' ) {
        bindViewModel( resourceLocation );
      } else if( typeof resourceLocation === 'object' ) {
        if( typeof resourceLocation.instance === 'object' ) {
          bindViewModel( resourceLocation.instance );
        } else if( typeof resourceLocation.createViewModel === 'function' ) {
          bindViewModel( resourceLocation.createViewModel( values.params, { element: element } ) );
        }
      }
    }
    return { 'controlsDescendantBindings': true };
  }
  return originalComponentInit(element, valueAccessor, ignored1, ignored2, bindingContext);
};

// Use the componentActive wrapper binding to provide the afterBinding() lifecycle event for components
ko.virtualElements.allowedBindings.componentActive = true;
ko.bindingHandlers.componentActive = {
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var child = ko.virtualElements.firstChild(element);
    var children = [];
    while (child) {
      children.push(child);
      child = ko.virtualElements.nextSibling(child);
    }

    if( typeof children !== 'undefined' && children.length > 0 ) {
      viewModel = ko.dataFor( children[0] );
      if( isViewModel(viewModel) === true ) {
        var configParams = viewModel.__getConfigParams();
        if( _.isFunction(configParams.afterBinding) === true && typeof configParams.afterBinding.wasCalled === 'undefined' ) {
          configParams.afterBinding.wasCalled = true;
          configParams.afterBinding.call(viewModel, element, valueAccessor, allBindings, viewModel, bindingContext);
        }
      }
    }
  }
};

// Custom loader used to wrap components with the componentActive custom binding
var componentWrapper = '<!-- ko componentActive: true -->COMPONENT_MARKUP<!-- /ko -->';
ko.components.loaders.unshift({
  loadTemplate: function(componentName, templateConfig, callback) {
    // console.info('ko.components.loaders loadTemplate', arguments);
    if(typeof templateConfig === 'string') {
      templateConfig = componentWrapper.replace(/COMPONENT_MARKUP/,templateConfig);
    }
    ko.components.defaultLoader.loadTemplate(componentName, templateConfig, callback);
  }
});

// The footwork getConfig loader is a catch-all in the instance a registered component cannot be found.
// The loader will attempt to use requirejs via knockouts integrated support if it is available.
ko.components.loaders.push({
  getConfig: function(componentName, callback) {
    var combinedFile = componentName + resourceFileExtensions.combined;
    var viewModelFile = componentName + resourceFileExtensions.viewModel;
    var templateFile = componentName + resourceFileExtensions.template;
    var componentLocation = getResourceLocation(componentName);
    var configOptions = null;
    var viewModelPath;
    var templatePath;
    var combinedPath;

    if( typeof require === 'function' ) {
      // load component using knockouts native support for requirejs
      if( require.defined(componentName) === true ) {
        // component already cached, lets use it
        configOptions = {
          require: componentName
        };
      } else if( typeof componentLocation.combined === 'string' ) {
        combinedPath = componentLocation.combined;

        if( isPath(combinedPath) === true ) {
          combinedPath = combinedPath + combinedFile;
        }

        configOptions = {
          require: combinedPath
        };
      } else {
        viewModelPath = componentLocation.viewModels;
        templatePath = 'text!' + componentLocation.templates;

        if( isPath(viewModelPath) === true ) {
          viewModelPath = viewModelPath + viewModelFile;
        }
        if( isPath(templatePath) === true ) {
          templatePath = templatePath + templateFile;
        }
        
        configOptions = {
          viewModel: { require: viewModelPath },
          template: { require: templatePath }
        };
      }
    }

    callback(configOptions);
  }
});

// outlets can only exist within parent components
ko.components.register('outlet', {
  autoIncrement: true,
  viewModel: function(params) {
    var $parentViewModel = this.$parent = params.$parent;
    this.outletName = params.name;
    this.$namespace = makeNamespace(this.outletName, $parentViewModel.$namespace);
    this.outletIsActive = ko.observable(true);

    // .broadcastAs({ name: this.outletName, namespace: 'outlet.' });
    this.errors = ko.observableArray();
    var outletObservable = $parentViewModel[ this.outletName + 'Outlet' ];
    if(typeof outletObservable !== 'undefined') {
      this.targetComponent = outletObservable;
    } else {
      this.targetComponent = ko.observable('error');
      this.errors.push('Could not locate outlet observable ($parentViewModel.' + this.outletName + 'Outlet' + ' is undefined).');
    }
  },
  template: '\
    <!-- ko if: outletIsActive -->\
      <!-- ko component: { name: targetComponent, params: { errors: errors } } --><!-- /ko -->\
    <!-- /ko -->'
});

ko.components.register('empty', {
  viewModel: function(params) {},
  template: '<div class="empty component"></div>'
});

ko.components.register('error', {
  viewModel: function(params) {
    this.message = ko.observable(params.message);
    this.errors = params.errors;
  },
  template: '\
    <div class="component error" data-bind="foreach: errors">\
      <div class="error">\
        <span class="number" data-bind="text: $index() + 1"></span>\
        <span class="message" data-bind="text: $data"></span>\
      </div>\
    </div>'
});
// broadcast-receive.js
// ----------------

var isAReceivable = ko.isAReceivable = function(thing) {
  return _.has(thing, '__isReceived') && thing.__isReceived === true;
};

var isABroadcastable = ko.isABroadcastable = function(thing) {
  return _.has(thing, '__isBroadcast') && thing.__isBroadcast === true;
};

//     this.myValue = ko.observable().receiveFrom('NamespaceName' / Namespace, 'varName');
ko.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var observable = this;

  if( isNamespace(namespace) === false ) {
    if( typeof namespace === 'string') {
      namespace = makeNamespace( namespace );
    } else {
      ko.logError('Invalid namespace [' + typeof namespace + ']');
      return observable;
    }
  }

  observable = ko.computed({
    read: target,
    write: function( value ) {
      namespace.publish( 'change.' + variable, value );
    }
  });

  observable.refresh = function() {
    namespace.publish( 'refresh.' + variable );
    return this;
  };
  namespace.subscribe( variable, function( newValue ) {
    target( newValue );
  });

  observable.__isReceived = true;
  return observable.refresh();
};

//     this.myValue = ko.observable().broadcastAs('NameOfVar');
//     this.myValue = ko.observable().broadcastAs('NameOfVar', isWritable);
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', writable: true });
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: Namespace });
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: 'NamespaceName' });
ko.subscribable.fn.broadcastAs = function(varName, option) {
  var observable = this;
  var namespace;

  if( _.isObject(varName) === true ) {
    option = varName;
  } else {
    if( typeof option === 'boolean' ) {
      option = {
        name: varName,
        writable: option
      };
    } else if( _.isObject(option) === true ) {
      option = _.extend({
        name: varName
      }, option);
    } else {
      option = {
        name: varName
      };
    }
  }

  namespace = option.namespace || currentNamespace();
  if(typeof namespace === 'string') {
    namespace = makeNamespace(channel);
  }

  if( option.writable ) {
    namespace.subscribe( 'change.' + option.name, function( newValue ) {
      observable( newValue );
    });
  }

  observable.broadcast = function() {
    namespace.publish( option.name, observable() );
    return this;
  };
  namespace.subscribe( 'refresh.' + option.name, function() {
    namespace.publish( option.name, observable() );
  });
  observable.subscribe(function( newValue ) {
    namespace.publish( option.name, newValue );
  });

  observable.__isBroadcast = true;
  return observable.broadcast();
};
// bindingHandlers.js
// ------------------

ko.bindingHandlers.registerElement = {
  preprocess: function (value, name, addBindingCallback) {
    return '\'' + value + '\'';
  },
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var elOption = ko.unwrap(valueAccessor()),
      refresh,
      defaultOptions = {
        name: element.getAttribute('id') || element.getAttribute('name'),
        context: 'relative'
      };

    if (typeof elOption === 'string') {
      elOption = _.extend(defaultOptions, { name: elOption });
    } else if (typeof elOption === 'object') {
      elOption = _.extend(defaultOptions, elOption);
    }

    if (typeof viewModel.el !== 'object') {
      viewModel.el = {};
    }

    viewModel.el[ elOption.name ] = element;
  }
};

/**
 * Source: https://github.com/SteveSanderson/knockout/wiki/Bindings---class
 */
ko.bindingHandlers['class'] = {
  'update': function( element, valueAccessor ) {
    if( element['__ko__previousClassValue__'] ) {
      Apollo.removeClass(element, element['__ko__previousClassValue__']);
    }
    var value = ko.utils.unwrapObservable(valueAccessor());
    value !== undefined && Apollo.addClass(element, value);
    element['__ko__previousClassValue__'] = value;
  }
};

ko.bindingHandlers['stopBinding'] = {
  init: function() {
    return { controlsDescendantBindings: true };
  }
};
// extenders.js
// ----------------

// custom throttle() based on ko v3.0.0 throttle(), allows value to be force()'d to a value at any time
ko.extenders.throttle = function(target, opt) {
  if( typeof opt === 'number' ) {
    opt = {
      timeout: opt,
      when: function() { return true; } // default always throttle
    };
  }

  target.throttleEvaluation = opt.timeout;

  var writeTimeoutInstance = null,
      throttledTarget = ko.dependentObservable({
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

  return throttledTarget;
};

ko.extenders.autoDisable = function( target, delay ) {
  return target.extend({
    delayTrigger: {
      delay: delay || 0,
      trigger: function( target ) { target( false ); }
    }
  });
};

ko.extenders.autoEnable = function( target, delay ) {
  return target.extend({
    delayTrigger: {
      delay: delay || 0,
      trigger: function( target ) { target( true ); }
    }
  });
};

ko.extenders.delayTrigger = function( target, options ) {
  var delay = 300,
      triggerFunc = noop,
      trigger;

  if( typeof options === 'object' ) {
    delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
    triggerFunc = options.trigger || triggerFunc;
  } else {
    delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
  }

  var clearTrigger = function() {
    clearTimeout( trigger );
    trigger = undefined;
  };

  var delayedObservable = ko.computed({
    read: target,
    write: function( state ) {
      target( state );

      if( trigger !== undefined ) {
        clearTrigger();
      }

      trigger = setTimeout(function() {
        triggerFunc( target, options );
      }.bind(target), delayedObservable.triggerDelay);
    }
  });
  delayedObservable.clearTrigger = clearTrigger;
  delayedObservable.triggerDelay = delay;

  return delayedObservable;
};

ko.extenders.delayWrite = function( target, options ) {
  var filter, delay = 300;

  if( typeof options === 'object' ) {
    delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
    filter = options.filter || function() { return true; };
  } else {
    delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
  }

  return ko.computed({
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
};
// router.js
// ------------------

/**
 * Example route:
 * {
 *   route: 'test/route(/:optional)',
 *   title: function() {
 *     return ko.request('nameSpace', 'broadcast:someVariable');
 *   },
 *   nav: true
 * }
 */

var routerDefaultConfig = {
  baseRoute: null,
  unknownRoute: null,
  activate: true,
  routes: []
};

// Create the main router method. This can be used to both activate the router and setup routes.
var routerConfig;
var router = ko.router = function(config) {
  var router = this.router;

  routerConfig = router.config = _.extend({}, routerDefaultConfig, routerConfig, config);
  routerConfig.baseRoute = _.result(routerConfig, 'baseRoute');

  return (routerConfig.activate ? setRoutes().activate() : setRoutes());
};

router.config = _.clone(routerDefaultConfig);
router.namespace = enterNamespaceName('router');

// Initialize necessary cache and boolean registers
var routes = [];
var navigationModel;
var historyIsEnabled = ko.observable().broadcastAs('historyIsEnabled');

// Declare regular expressions used to parse a uri
// Sourced: https://github.com/BlueSpire/Durandal/blob/e88fd385fb930d38456e35812b44ecd6ea7d8f4c/platforms/Bower/Durandal/js/plugins/router.js
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w*/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var routesAreCaseSensitive = false;
var hashMatch = /(^\/#)/;

// Convert a route string to a regular expression which is then used to match a uri against it and determine whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp(routeString) {
  routeString = routeString.replace(escapeRegExp, "\\$&")
    .replace(optionalParam, "(?:$1)?")
    .replace(namedParam, function(match, optional) {
      return optional ? match : "([^\/]+)";
    })
    .replace(splatParam, "(.*?)");

  return new RegExp('^' + routeString + '$', routesAreCaseSensitive ? undefined : 'i');
}

function normalizeURL(url) {
  if(_.isNull(routerConfig.baseRoute) === false && url.indexOf(routerConfig.baseRoute) === 0) {
    url = url.substr(routerConfig.baseRoute.length);
    if(url.length > 1) {
      url = url.replace(hashMatch, '/');
    }
  }
  return url;
}

function historyReady() {
  var isReady = _.has(History, 'Adapter');
  isReady === false && ko.logError('History.js is not loaded.');

  return isReady;
}

function extractNavItems(routes) {
  routes = ( _.isArray(routes) ? routes : [routes] );
  return _.where(routes, { nav: true });
}

function hasNavItems(routes) {
  return extractNavItems( routes ).length > 0;
}

function isObservable(thing) {
  return typeof thing !== 'undefined' && _.isFunction(thing.notifySubscribers);
}

function unknownRoute() {
  return (typeof routerConfig !== 'undefined' ? _.result(routerConfig.unknownRoute) : undefined);
}

var setRoutes = _.bind(router.setRoutes = function(route) {
  routes = [];
  addRoutes(route || this.config.routes);

  return router;
}, router);

var addRoutes = router.addRoutes = function(route) {
  route = _.isArray(route) ? route : [route];
  routes.push.apply(routes, route);

  if( hasNavItems(route) && isObservable(navigationModel) ) {
    navModelUpdate.notifySubscribers(); // tell router.navigationModel to recompute its list
  }

  return router;
};

var navModelUpdate = ko.observable();
var navPredicate;
var makeNavigationModel = router.navigationModel = function(predicate) {
  navPredicate = predicate || navPredicate || function() { return true; };

  if(typeof navigationModel === 'undefined') {
    navigationModel = ko.computed(function() {
      this.navModelUpdate(); // dummy reference used to trigger updates
      return _.filter( extractNavItems( routes ), navPredicate );
    }, { navModelUpdate: navModelUpdate });
  }

  return navigationModel.broadcastAs({ name: 'navigationModel', namespace: router.namespace });
};

var stateChange = router.stateChange = function(url) {
  currentState( url = normalizeURL( url || (historyIsEnabled() ? History.getState().url : '#default') ) );
  getActionFor(url)(); // get the route if it exists and run the action if one is returned

  return router;
};

var currentState = ko.observable().broadcastAs('currentState');
currentState.subscribe(function(newState) {
  ko.log('New Route:', newState);
});

var getActionFor = router.getActionFor = function(url) {
  var Action = noop;
  var originalURL = url;

  _.each(getRoutes(), function(routeDesc) {
    var routeString = routeDesc.route;
    var routeRegex = routeStringToRegExp(routeString);
    var routeParamValues = url.match(routeRegex);

    if(routeParamValues !== null && Action === noop) {
      var routeParams = _.map(routeString.match(namedParam), function(param) {
        return param.replace(':', '');
      });

      var options = {
        controller: routeDesc.controller,
        title: routeDesc.title,
        url: routeParamValues[0],
        params: _.reduce(routeParams, function(parameters, parameterName, index) {
            parameters[parameterName] = routeParamValues[index + 1];
            return parameters;
          }, {})
      };
      
      Action = function(params) {
        options.controller( _.extend(options.params, params), options );
      };
      Action.options = options;
    }
  });

  if(Action === noop) {
    ko.logError('Could not locate associated action for ', originalURL);
  }

  return Action;
};

var getRoutes = router.getRoutes = function() {
  return routes;
};

var setupHistoryAdapter = router.setupHistoryAdapter = function() {
  if(historyIsEnabled() !== true) {
    if( historyReady() ) {
      History.Adapter.bind( window, 'statechange', stateChange);
      historyIsEnabled(true);
    } else {
      historyIsEnabled(false);
    }
  }

  return router;
};

router.historyIsEnabled = ko.computed(function() {
  return this.historyIsEnabled();
}, { historyIsEnabled: historyIsEnabled });

router.activate = _.once( _.bind(function() {
  delegate(document)
    .on('click', 'a', function(event) {
      console.info('delegateClick-event', event.delegateTarget);
    });
  delegate(document)
    .on('click', '.footwork-link-target', function(event) {
      console.info('delegateClick-event', event.delegateTarget);
    });

  return setupHistoryAdapter().stateChange();
}, router) );

exitNamespace(); // exit from 'router' namespace
      return ko;
    })( root._.pick(root, embeddedDependencies), root._, root.ko, root.postal, root.Apollo, root.riveter, root.delegate, root.reqwest );
  })();
}));