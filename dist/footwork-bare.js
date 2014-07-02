/**
 * footwork.js - A solid footing for knockout applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v0.2.0-bare
 * Url: http://footworkjs.com
 * License(s): MIT
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal', 'q', 'delegate', 'Apollo', 'Qajax'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'), require('q'), require('delegate'), require('Apollo'), require('Qajax'));
  } else {
    root.ko = factory(_, ko, postal, Q, delegate, Apollo, Qajax);
  }
}(this, function (_, ko, postal, Q, delegate, Apollo, Qajax) {
  var windowObject = window;

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
      Q: Q,
      Qajax: Qajax
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
        module.exports = factory(require("underscore"));
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["underscore"], function (_) {
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

    // list of dependencies to 'export' inside the library as .embed properties
    var embeddedDependencies = [ 'riveter' ];

    return (function footwork(embedded, _, ko, postal, Apollo, riveter, delegate, Q, Qajax) {
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
var applyBindings = ko.applyBindings;

// Override the original applyBindings method to provide and enable 'model' life-cycle hooks/events.
ko.applyBindings = function(model, element) {
  applyBindings(model, element);

  if(typeof model !== 'undefined' && typeof model.startup === 'function' && typeof model._options !== 'undefined') {
    if(model._options.startup !== false) {
      model.startup();
    }
    console.log('applyBindings',model);
    if(typeof model._modelOptions.afterBinding === 'function') {
      model._modelOptions.afterBinding.call(model);
    }
  }
};

// model.js
// ------------------

// Duck type function for determining whether or not something is a footwork model
function isFootworkModel(thing) {
  return typeof thing !== 'undefined' && thing._isFootworkModel === true;
}

// Initialize the models registry
var models = {};

// Returns the number of created models for each defined namespace
ko.modelCount = function() {
  var counts = _.reduce(namespaceNameCounter, function(modelCounts, modelCount, modelName) {
    modelCounts[modelName] = modelCount + 1;
    return modelCounts;
  }, {});
  counts.__total = _.reduce(_.values(counts), function(summation, num) {
    return summation + num;
  }, 0);
  return counts;
};

// Returns a reference to the specified models.
// If no name is supplied, a reference to an array containing all model references is returned.
ko.getModels = function(namespaceName) {
  if(namespaceName === undefined) {
    return models;
  }
  return models[namespaceName];
};

// Tell all models to request the values which it listens for
ko.refreshModels = function() {
  _.invoke(ko.getModels(), 'refreshReceived');
};

var modelMixins = [];

ko.model = function(modelOptions) {
  if( typeof modelOptions !== 'undefined' && _.isFunction(modelOptions.viewModel) === true ) {
    modelOptions.initialize = modelOptions.viewModel;
  }

  var modelOptions = _.extend({
    namespace: undefined,
    componentNamespace: undefined,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    afterBinding: noop,
    initialize: noop
  }, modelOptions);

  var modelOptionsMixin = {
    _preInit: function( initOptions ) {
      this._model = {
        modelOptions: modelOptions,
        initOptions: initOptions
      }
    }
  };

  var composure = [ modelOptions.initialize, modelOptionsMixin ].concat( modelMixins );
  if(modelOptions.mixins !== undefined) {
    composure = composure.concat(modelOptions.mixins);
  }

  var model = riveter.compose.apply( undefined, composure );
  model._isFootworkModel = true;

  return model;
};
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

function triggerEventOnNamespace(eventKey, params) {
  this.publish('event.' + eventKey, params);
  return this;
}

function registerNamespaceEventHandler(eventKey, callback) {
  var handlerSubscription = this.subscribe('event.' + eventKey, callback);
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

function unregisterNamespaceEventHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

function sendCommandToNamespace(commandKey, params) {
  this.publish('command.' + commandKey, params);
  return this;
}

function registerNamespaceCommandHandler(requestKey, callback) {
  var handlerSubscription = this.subscribe('command.' + requestKey, callback);
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

function unregisterNamespaceCommandHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

function requestResponseFromNamespace(requestKey, params) {
  var response;
  var subscription;

  subscription = this.subscribe('request.' + requestKey + '.response', function(reqResponse) {
    response = reqResponse;
  });
  this.publish('request.' + requestKey, params);
  subscription.unsubscribe();

  return response;
}

function registerNamespaceRequestHandler(requestKey, callback) {
  var handler = function(params) {
    var callbackResponse = callback(params);
    this.publish('request.' + requestKey + '.response', callbackResponse);
  };

  var handlerSubscription = this.subscribe('request.' + requestKey, _.bind(handler, this));
  this.requestHandlers.push(handlerSubscription);

  return handlerSubscription;
}

function unregisterNamespaceRequestHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

function disconnectNamespaceHandlers() {
  _.invoke(this.requestHandlers, 'unsubscribe');
  _.invoke(this.commandHandlers, 'unsubscribe');
  _.invoke(this.eventHandlers, 'unsubscribe');
  return this;
}

// Creates and returns a new namespace instance
ko.namespace = function(namespaceName) {
  var namespace = postal.channel(namespaceName);

  namespace.shutdown = _.bind( disconnectNamespaceHandlers, namespace );

  namespace.commandHandlers = [];
  namespace.command = _.bind( sendCommandToNamespace, namespace );
  namespace.command.handler = _.bind( registerNamespaceCommandHandler, namespace );
  namespace.command.handler.unregister = _.bind( unregisterNamespaceCommandHandler, namespace );

  namespace.requestHandlers = [];
  namespace.request = _.bind( requestResponseFromNamespace, namespace );
  namespace.request.handler = _.bind( registerNamespaceRequestHandler, namespace );
  namespace.request.handler.unregister = _.bind( unregisterNamespaceRequestHandler, namespace );

  namespace.eventHandlers = [];
  namespace.event = namespace.triggerEvent = _.bind( triggerEventOnNamespace, namespace );
  namespace.event.handler = _.bind( registerNamespaceEventHandler, namespace );
  namespace.event.handler.unregister = _.bind( unregisterNamespaceEventHandler, namespace );

  return namespace;
};

// Duck type check for a namespace object
ko.isNamespace = function(thing) {
  return _.isFunction(thing.subscribe) && _.isFunction(thing.publish) && typeof thing.channel === 'string';
};

// Return the current namespace name.
ko.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
ko.currentNamespace = function() {
  return ko.namespace(ko.currentNamespaceName());
};

// enterNamespaceName() adds a namespaceName onto the namespace stack at the current index, 
// 'entering' into that namespace (it is now the currentNamespace)
ko.enterNamespaceName = function(namespaceName) {
  namespaceStack.unshift( namespaceName );
  return ko.currentNamespace();
};

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack
ko.exitNamespace = function() {
  namespaceStack.shift();
  return ko.currentNamespace();
};

// mixin provided to models which enables namespace capabilities including pub/sub, cqrs, etc
modelMixins.push({
  _preInit: function( options ) {
    this._model.globalNamespace = ko.namespace();
    this._model.namespaceName = indexedNamespaceName(this._model.modelOptions.componentNamespace || this._model.modelOptions.namespace || _.uniqueId('namespace'), this._model.modelOptions.autoIncrement);

    ko.enterNamespaceName( this._model.namespaceName );
    this.namespace = ko.currentNamespace();
  },
  mixin: {
    getNamespaceName: function() {
      return this.namespace.channel;
    },
    broadcastAll: function() {
      var model = this;
      _.each( this, function(property, propName) {
        if( _.isObject(property) && property.__isBroadcast === true ) {
          model.namespace.publish( propName, property() );
        }
      });
      return this;
    },
    refreshReceived: function() {
      _.each( this, function(property, propName) {
        if( _.isObject(property) && property.__isReceived === true ) {
          property.refresh();
        }
      });
      return this;
    },
    startup: function() {
      this.refreshReceived().broadcastAll();
      return this;
    }
  },
  _postInit: function( options ) {
    models[ this.getNamespaceName() ] = this;
    ko.exitNamespace();

    this.startup();
    _.isFunction(this._model.modelOptions.afterCreating) && this._model.modelOptions.afterCreating.call(this);
  }
});
ko.component = function(options) {
  if(typeof options.name !== 'string') {
    ko.logError('Components must be provided a name (namespace).');
  }

  if(typeof options.template !== 'string') {
    ko.logError('Components must be provided a template.');
  }

  options.namespace = options.name = _.result(options, 'name');
  var viewModel = options.initialize || options.viewModel;
  if( isFootworkModel(viewModel) ) {
    viewModel.options.componentNamespace = options.namespace;
  } else if( _.isFunction(viewModel) ) {
    viewModel = this.model(options);
  }

  //TODO: determine how mixins from the (optionally) supplied footwork model mix in with the mixins supplied directly in the component options
  //      as well as others like params, afterBinding. Currently we will just use the viewModel's mixins/etc, only the namespace is overridden
  //      from the template definition.

  ko.components.register(options.name, {
    viewModel: viewModel,
    template: options.template
  });
}
// broadcast-receive.js
// ----------------

ko.isAReceivable = function(thing) {
  return _.has(thing, '__isReceived') && thing.__isReceived === true;
};

ko.isABroadcastable = function(thing) {
  return _.has(thing, '__isBroadcast') && thing.__isBroadcast === true;
};

//     this.myValue = ko.observable().receiveFrom('NamespaceName' / Namespace, 'varName');
ko.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var observable = this;

  if( ko.isNamespace(namespace) === false && typeof namespace === 'string') {
    namespace = ko.namespace( namespace );
  } else {
    ko.logError('Invalid namespace [' + typeof namespace + ']');
    return observable;
  }

  observable = ko.computed({
    read: target,
    write: function( value ) {
      namespace.publish( 'change.' + variable, value );
    }
  });

  observable.refresh = function() {
    namespace.publish( 'refresh.' + variable );
  };
  namespace.subscribe( variable, function( newValue ) {
    target( newValue );
  });

  observable.__isReceived = true;
  return observable;
};

//     this.myValue = ko.observable().broadcastAs('NameOfVar');
//     this.myValue = ko.observable().broadcastAs('NameOfVar', isWritable);
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', writable: true });
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: Namespace });
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: 'NamespaceName' });
ko.subscribable.fn.broadcastAs = function(varName, option) {
  var observable = this;
  var namespace;

  if(_.isObject(varName) === true) {
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

  namespace = option.namespace || ko.currentNamespace();
  if(typeof namespace === 'string') {
    namespace = ko.namespace(channel);
  }

  if( option.writable ) {
    namespace.subscribe( 'change.' + option.name, function( newValue ) {
      observable( newValue );
    });
  }

  namespace.subscribe( 'refresh.' + option.name, function() {
    namespace.publish( option.name, observable() );
  });
  observable.subscribe(function( newValue ) {
    namespace.publish( option.name, newValue );
  });

  observable.__isBroadcast = true;
  return observable;
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
var router = ko.router = function(config) {
  var router = this.router;

  router.config = config = _.extend({}, routerDefaultConfig, router.config, config);
  router.config.baseRoute = _.result(router.config, 'baseRoute');

  return (config.activate ? router.setRoutes().activate() : router.setRoutes());
};

router.config = _.clone(routerDefaultConfig);
router.namespace = ko.enterNamespaceName('router');

// Initialize necessary cache and boolean registers
var routes = [];
var navigationModel;
var historyIsEnabled = ko.observable().broadcastAs('historyIsEnabled');

// Declare regular expressions used to parse a uri
// Sourced: https://github.com/BlueSpire/Durandal/blob/e88fd385fb930d38456e35812b44ecd6ea7d8f4c/platforms/Bower/Durandal/js/plugins/router.js
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var routesAreCaseSensitive = false;
var hashMatch = /(^\/#)*(^#)*/;

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
  if(_.isNull(router.config.baseRoute) === false && url.indexOf(router.config.baseRoute) === 0) {
    url = url.substr(router.config.baseRoute.length);
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
  return (typeof router.config !== 'undefined' ? _.result(router.config.unknownRoute) : undefined);
}

router.setRoutes = function(route) {
  routes = [];
  router.addRoutes(route || this.config.routes);

  return router;
};

router.addRoutes = function(route) {
  route = _.isArray(route) ? route : [route];
  routes.push.apply(routes, route);

  if( hasNavItems(route) && isObservable(navigationModel) ) {
    navModelUpdate.notifySubscribers(); // tell router.navigationModel to recompute its list
  }

  return router;
};

var navModelUpdate = ko.observable();
var navPredicate;
router.navigationModel = function(predicate) {
  navPredicate = predicate || navPredicate || function() { return true; };

  if(typeof navigationModel === 'undefined') {
    navigationModel = ko.computed(function() {
      this.navModelUpdate(); // dummy reference used to trigger updates
      return _.filter( extractNavItems( routes ), navPredicate );
    }, { navModelUpdate: navModelUpdate });
  }

  return navigationModel.broadcastAs({ name: 'navigationModel', namespace: router.namespace });
};

var currentState = ko.observable().broadcastAs('currentState');
router.stateChange = function(url) {
  currentState( url = normalizeURL( url || (historyIsEnabled() ? History.getState().url : '#default') ) );
  getActionFor(url)(); // get the route if it exists and run the action if one is returned

  return router;
};
currentState.subscribe(function(newState) {
  ko.log('New Route:', newState);
});

var getActionFor = router.getActionFor = function(url) {
  var Action = noop;
  var originalURL = url;

  _.each(router.getRoutes(), function(routeDesc) {
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

router.getRoutes = function() {
  return routes;
};

router.setupHistoryAdapter = function() {
  if(historyIsEnabled() !== true) {
    if( historyReady() ) {
      History.Adapter.bind( window, 'statechange', router.stateChange);
      historyIsEnabled(true);
    } else {
      historyIsEnabled(false);
    }
  }

  return router;
}

router.historyIsEnabled = function() {
  return historyIsEnabled();
};

router.activate = _.once( _.bind(function() {
  delegate(document)
    .on('click', 'a', function(event) {
      console.info('delegateClick-event', event.delegateTarget);
    });
  delegate(document)
    .on('click', '.footwork-link-target', function(event) {
      console.info('delegateClick-event', event.delegateTarget);
    });

  return router.setupHistoryAdapter().stateChange();
}, router) );

ko.components.register('outlet', {
  viewModel: function() {
    this.isSuccess = ko.observable('SUCCESSING INTENSIFIES');
  },
  // use comment bindings!
  template: '<div data-bind="text: isSuccess"></div>'
});

router.namespace = ko.exitNamespace(); // exit from 'router' namespace
      return ko;
    })( root._.pick(root, embeddedDependencies), root._, root.ko, root.postal, root.Apollo, root.riveter, root.delegate, root.Q, root.Qajax );
  })();
}));