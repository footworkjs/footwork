/**
 * footwork.js - A solid footing for larger knockout applications.
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

//see http://patik.com/blog/complete-cross-browser-console-log/
// Tell IE9 to use its built-in console
var treatAsIE8 = false;
if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {
  try {
    ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
      .forEach(function(method) {
        console[method] = this.call(console[method], console);
      }, Function.prototype.bind);
  } catch (ex) {
    treatAsIE8 = true;
  }
}

// misc utility noop function
var noop = function() { };

// Initialize the debugLevel observable, this controls
// what level of debug statements are logged to the console
// 0 === off
// 1 === errors
// 2 === notices (very noisy)
ko.debugLevel = ko.observable(0);

// internal logging method used when debugging is on
var log;
ko.log = log = function() {
  if(ko.debugLevel() > 2) {
    // originally sourced from Durandal (http://durandaljs.com/)
    try {
      // Modern browsers
      if (typeof console != 'undefined' && typeof console.log == 'function') {
        // Opera 11
        if (window.opera) {
          var i = 0;
          while (i < arguments.length) {
            console.log('Item ' + (i + 1) + ': ' + arguments[i]);
            i++;
          }
        }
        // All other modern browsers
        else if ((slice.call(arguments)).length == 1 && typeof slice.call(arguments)[0] == 'string') {
          console.log((slice.call(arguments)).toString());
        } else {
          console.log.apply(console, slice.call(arguments));
        }
      }
      // IE8
      else if ((!Function.prototype.bind || treatAsIE8) && typeof console != 'undefined' && typeof console.log == 'object') {
        Function.prototype.call.call(console.log, console, slice.call(arguments));
      }

      // IE7 and lower, and other old browsers
    } catch (ignore) { }
  }
};

var logError;
ko.logError = logError = function(error, err) {
  if(ko.debugLevel() > 1) {
    // originally sourced from Durandal (http://durandaljs.com/)
    var exception;
    
    if(error instanceof Error){
      exception = error;
    } else {
      exception = new Error(error);
    }
    
    exception.innerError = err;
    
    //Report the error as an error, not as a log
    try {
      // Modern browsers (it's only a single item, no need for argument splitting as in log() above)
      if (typeof console != 'undefined' && typeof console.error == 'function') {
        console.error(exception);
      }
      // IE8
      else if ((!Function.prototype.bind || treatAsIE8) && typeof console != 'undefined' && typeof console.error == 'object') {
        Function.prototype.call.call(console.error, console, exception);
      }
      // IE7 and lower, and other old browsers
    } catch (ignore) { }

    throw exception;
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
    if(typeof model._modelOptions.afterBinding === 'function') {
      model._modelOptions.afterBinding.call(model);
    }
  }
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
  return name + ((autoIncrement === true && namespaceNameCounter[name] > 0) ? namespaceNameCounter[name] : '');
}

// Creates and returns a new namespace channel
ko.namespace = function(namespaceName) {
  return postal.channel(namespaceName);
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
// will shift the current namespace off of the stack, exiting to the
// next namespace in the stack
ko.exitNamespace = function() {
  namespaceStack.shift();
  return ko.currentNamespace();
};

// model.js
// ------------------

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

ko.model = function(modelOptions) {
  modelOptions = _.extend({
    namespace: undefined,
    componentNamespace: undefined,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    afterBinding: noop,
    constructor: noop
  }, modelOptions);

  var viewModel = {
    _preInit: function( options ) {
      modelOptions.namespace = indexedNamespaceName(modelOptions.componentNamespace || modelOptions.namespace || _.uniqueId('namespace'), modelOptions.autoIncrement);
      this._modelOptions = modelOptions;

      ko.enterNamespaceName( modelOptions.namespace );

      this.namespace = ko.currentNamespace();
      this._globalNamespace = ko.namespace();
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
      _.isFunction(modelOptions.afterCreating) && modelOptions.afterCreating.call(this);
    }
  };

  var composure = [ modelOptions.constructor, viewModel ];
  if(modelOptions.mixins !== undefined) {
    composure = composure.concat(modelOptions.mixins);
  }
  var model = riveter.compose.apply( undefined, composure );

  model._isFootworkModel = true;
  model.options = modelOptions;

  return model;
};
ko.component = function(options) {
  if(typeof options.name !== 'string') {
    throw 'Components must be provided a name (namespace).';
  }

  if(typeof options.template !== 'string') {
    throw 'Components must be provided a template.';
  }

  options.namespace = options.name = _.result(options, 'name');
  var viewModel = (options.constructor._isFootworkModel === true ? options.constructor : this.model(options));
  viewModel.options.componentNamespace = options.namespace;

  //TODO: determine how mixins from the (optionally) supplied footwork model mix in with the mixins supplied directly in the component options
  //      as well as others like params, afterBinding.

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

//     this.myValue = ko.observable().receiveFrom('Namespace' / Namespace, 'varName');
ko.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var observable = this;
  var channel;

  if( _.isObject(namespace) === true && namespace.channel !== undefined ) {
    channel = namespace;
  } else if(typeof namespace === 'string') {
    channel = postal.channel( namespace );
  } else {
    logError('Invalid namespace [' + typeof namespace + ']');
    return observable;
  }

  observable = ko.computed({
    read: target,
    write: function( value ) {
      channel.publish( 'change.' + variable, value );
    }
  });

  observable.refresh = function() {
    channel.publish( 'refresh.' + variable );
  };
  channel.subscribe( variable, function( newValue ) {
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
  var observable = this, channel;

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

  channel = option.namespace || ko.currentNamespace();
  if(typeof channel === 'string') {
    channel = ko.namespace(channel);
  }

  if( option.writable ) {
    channel.subscribe( 'change.' + option.name, function( newValue ) {
      observable( newValue );
    });
  }

  channel.subscribe( 'refresh.' + option.name, function() {
    channel.publish( option.name, observable() );
  });
  observable.subscribe(function( newValue ) {
    channel.publish( option.name, newValue );
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
      triggerFunc = function() {},
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
 *   routes: [{
 *     route: 'test/route(/:optional)',
 *     title: function() {
 *       return ko.request('nameSpace', 'broadcast:someVariable');
 *     },
 *     nav: true
 *   }]
 * }
 */

var routerDefaultConfig = {
  baseRoute: 'http://site.com',
  activate: true,
  unknownRoute: undefined,
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

// Convert a route string to a regular expression which is then used to match a uri against it and determine whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp(routeString) {
  routeString = routeString.replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function(match, optional) {
      return optional ? match : '([^\/]+)';
    })
    .replace(splatParam, '(.*?)');

  return new RegExp('^' + routeString + '$', routesAreCaseSensitive ? undefined : 'i');
}

function normalizeURL(url) {
  return url.substr(router.config.baseRoute.length).replace(/(^\/#)*(^#)*/, '/');
}

function historyReady() {
  var isReady = _.has(History, 'Adapter');
  isReady === false && errorLog('History.js is not loaded.');

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

var getActionFor = router.getActionFor = function(url) {
  var action = noop;

  _.each(router.getRoutes(), function(routeDesc) {
    var routeString = routeDesc.route;
    var routeRegex = routeStringToRegExp(routeString);
    var routeParamValues = url.match(routeRegex);

    if(routeParamValues !== null && action === noop) {
      var routeParams = _.map(routeString.match(namedParam), function(param) {
        return param.replace(':','');
      });

      var options = {
        controller: routeDesc.controller,
        url: routeParamValues[0],
        params: _.reduce(routeParams, function(parameters, parameterName, index) {
            parameters[parameterName] = routeParamValues[index + 1];
            return parameters;
          }, {})
      };
      
      action = function(params) {
        options.controller( _.extend(options.params, params) );
      };
      action.options = options;
    }
  });

  return action;
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

router.namespace = ko.exitNamespace(); // exit from 'router' namespace
      return ko;
    })( root._.pick(root, embeddedDependencies), root._, root.ko, root.postal, root.Apollo, root.riveter, root.delegate, root.Q, root.Qajax );
  })();
}));