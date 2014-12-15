// footwork.js
// ----------------------------------
// v0.8.0pre
//
// Copyright (c)2014 Jonathan Newman (http://staticty.pe).
// Distributed under MIT license
//
// http://footworkjs.com

/**
 * footwork.js - A solid footing for web applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v0.8.0pre
 * Url: http://footworkjs.com
 * License(s): MIT
 */

// main.js
// -----------

// Map ko to the variable 'fw' internally to make it clear this is the 'footwork' flavored version of knockout we are dealing with.
// Footwork will also map itself to 'fw' on the global object when no script loader is used.
var fw = ko;

// Record the footwork version as of this build.
fw.footworkVersion = '0.8.0pre';

// Expose any embedded dependencies
fw.embed = embedded;

// misc regex patterns
var hasTrailingSlash = /\/$/i;
var hasStartingSlash = /^\//i;
var hasStartingHash = /^#/i;

// misc utility functions
var noop = function() { };

var isObservable = fw.isObservable;

function isPath(pathOrFile) {
  return hasTrailingSlash.test(pathOrFile);
};

function hasPathStart(path) {
  return hasStartingSlash.test(path);
};

function hasHashStart(string) {
  return hasStartingHash.test(string);
}

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

// Pull out lodash utility function references for better minification and easier implementation swap
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

// Internal registry which stores the mixins that are automatically added to each viewModel
var viewModelMixins = [];

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
  if( isUndefined(namespaceNameCounter[name]) ) {
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
function disconnectNamespaceHandlers() {
  var namespace = this;
  each(['requestHandlers', 'commandHandlers', 'eventHandlers', 'subscriptions'], function(handlers) {
    invoke(namespace[handlers], 'unsubscribe');
  });
  return this;
}

function getNamespaceName() {
  return this.channel;
}

// Creates and returns a new namespace instance
var makeNamespace = fw.namespace = function(namespaceName, $parentNamespace) {
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
    if( currentNamespaceName() === this.getName() ) {
      return exitNamespace();
    }
  };

  return namespace;
};

// Duck type check for a namespace object
var isNamespace = fw.isNamespace = function(thing) {
  return !isUndefined(thing) && !!thing.__isNamespace;
};

// Return the current namespace name.
var currentNamespaceName = fw.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
var currentNamespace = fw.currentNamespace = function() {
  return makeNamespace( currentNamespaceName() );
};

// enterNamespaceName() adds a namespaceName onto the namespace stack at the current index, 
// 'entering' into that namespace (it is now the currentNamespace).
// The namespace object returned from this method also has a pointer to its parent
var enterNamespaceName = fw.enterNamespaceName = function(namespaceName) {
  var $parentNamespace = currentNamespace();
  namespaceStack.unshift( namespaceName );
  return makeNamespace( currentNamespaceName() );
};

// enterNamespace() uses a current namespace definition as the one to enter into.
var enterNamespace = fw.enterNamespace = function(namespace) {
  namespaceStack.unshift( namespace.getName() );
  return namespace;
};

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack
var exitNamespace = fw.exitNamespace = function() {
  namespaceStack.shift();
  return currentNamespace();
};

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
viewModelMixins.push({
  runBeforeInit: true,
  _preInit: function( options ) {
    var $configParams = this.__getConfigParams();
    this.$namespace = enterNamespaceName( indexedNamespaceName($configParams.namespace || $configParams.name || _.uniqueId('namespace'), $configParams.autoIncrement) );
    this.$globalNamespace = makeNamespace();
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
var $globalNamespace = makeNamespace();

// 'start' up footwork at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  targetElement = targetElement || windowObject.document.body;
  originalApplyBindings({}, targetElement);
};

// dispose a known property type
function propertyDisposal( property, name ) {
  if( (isNamespace(property) || isRouter(property) || isBroadcastable(property) || isReceivable(property) || isObservable(property)) && isFunction(property.dispose) ) {
    property.dispose();  
  }
}

// broadcast-receive.js
// ----------------

function isReceivable(thing) {
  return isObject(thing) && !!thing.__isReceivable;
}

function isBroadcastable(thing) {
  return isObject(thing) && !!thing.__isBroadcastable;
}

// factory method which turns an observable into a receivable
fw.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var observable = this;
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;

  if( isString(namespace) ) {
    namespace = makeNamespace( namespace );
    isLocalNamespace = true;
  }

  if( !isNamespace(namespace) ) {
    throw 'Invalid namespace provided for receiveFrom() observable.';
  }

  observable = fw.computed({
    read: target,
    write: function( value ) {
      namespace.publish( '__change.' + variable, value );
    }
  });

  observable.refresh = function() {
    namespace.publish( '__refresh.' + variable );
    return this;
  };

  namespaceSubscriptions.push( namespace.subscribe( variable, function( newValue ) {
    target( newValue );
  }) );

  var observableDispose = observable.dispose;
  observable.dispose = observable.dispose = function() {
    invoke(namespaceSubscriptions, 'unsubscribe');
    if( isLocalNamespace ) {
      namespace.dispose();
    }
    observableDispose.call(observable);
  };

  observable.__isReceivable = true;
  return observable.refresh();
};

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcastAs = function(varName, option) {
  var observable = this;
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

  namespace = option.namespace || currentNamespace();
  if( isString(namespace) ) {
    namespace = makeNamespace(namespace);
    isLocalNamespace = true;
  }

  if( !isNamespace(namespace) ) {
    throw 'Invalid namespace provided for broadcastAs() observable.';
  }

  if( option.writable ) {
    namespaceSubscriptions.push( namespace.subscribe( '__change.' + option.name, function( newValue ) {
      observable( newValue );
    }) );
  }

  observable.broadcast = function() {
    namespace.publish( option.name, observable() );
    return this;
  };

  namespaceSubscriptions.push( namespace.subscribe( '__refresh.' + option.name, function() {
    namespace.publish( option.name, observable() );
  }) );
  subscriptions.push( observable.subscribe(function( newValue ) {
    namespace.publish( option.name, newValue );
  }) );

  observable.dispose = observable.dispose = function() {
    invoke(namespaceSubscriptions, 'unsubscribe');
    invoke(subscriptions, 'dispose');
    if( isLocalNamespace ) {
      namespace.dispose();
    }
  };

  observable.__isBroadcastable = true;
  return observable.broadcast();
};
// router.js
// ------------------

// Predicate function that always returns true / 'pass'
var alwaysPassPredicate = function() { return true; };

var emptyStringResult = function() { return ''; };

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
var isFullURLRegex = /(^[a-z]+:\/\/|^\/\/)/i;
var routesAreCaseSensitive = true;

var invalidRoutePathIdentifier = '___invalid-route';

var $nullRouter = extend({}, $baseRouter, {
  childRouters: extend( noop.bind(), { push: noop } ),
  path: function() { return ''; },
  isRelative: function() { return false; },
  __isNullRouter: true
});

var $baseRouter = {
  path: emptyStringResult,
  segment: emptyStringResult,
  childRouters: fw.observableArray(),
  context: noop,
  userInitialize: noop,
  __isRouter: true
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

function transformRouteConfigToDesc(routeDesc) {
  return extend({ id: uniqueId('route') }, baseRouteDescription, routeDesc );
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
  var isReady = has(History, 'Adapter');

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

var noComponentSelected = '_noComponentSelected';
var $routerOutlet = function(outletName, componentToDisplay, options ) {
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
    });
  }

  var outlet = outlets[outletName];
  var currentOutletDef = outlet();
  var valueHasMutated = false;
  var isInitialLoad = outlet().name === noComponentSelected;

  if( !isUndefined(componentToDisplay) ) {
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

fw.outlets = {
  registerView: function(viewName, templateHTML) {
    registerComponent(viewName, { template: templateHTML });
  },
  registerViewLocation: function(viewName, viewLocation) {
    registerLocationOfComponent(viewName, { template: viewLocation })
    registerComponentAsTemplateOnly(viewName);
  }
};

var isFullURL = fw.isFullURL = function(thing) {
  return isString(thing) && isFullURLRegex.test(thing);
};

var hasHTML5History = windowObject.history && windowObject.history.pushState;
if(!isUndefined(windowObject.History) && isObject(windowObject.History.options) && windowObject.History.options.html4Mode) {
  // user is overriding to force html4mode hash-based history
  hasHTML5History = false;
}

var fwRouters = fw.routers = {
  // Configuration point for a baseRoute / path which will always be stripped from the URL prior to processing the route
  baseRoute: fw.observable(''),
  activeRouteClassName: fw.observable('active'),
  disableHistory: fw.observable(false).broadcastAs({ name: 'disableHistory', namespace: $globalNamespace }),
  html5History: function() {
    return hasHTML5History;
  },

  getNearestParent: function($context) {
    var $parentRouter = nearestParentRouter($context);
    return (!isNullRouter($parentRouter) ? $parentRouter : null);
  },
  
  // Return array of all currently instantiated $router's (optionally for a given viewModelNamespaceName)
  getAll: function(viewModelNamespaceName) {
    if( !isUndefined(viewModelNamespaceName) && !isArray(viewModelNamespaceName) ) {
      viewModelNamespaceName = [ viewModelNamespaceName ];
    }

    return reduce( $globalNamespace.request('__router_reference', undefined, true), function(routers, router) {
      var namespaceName = isNamespace(router.$namespace) ? router.$namespace.getName() : null;
      if( !isUndefined(router.$viewModel) ) {
        namespaceName = router.$viewModel.$namespace.getName();
      }

      if( !isNull(namespaceName) ) {
        if( isUndefined(viewModelNamespaceName) || contains(viewModelNamespaceName, namespaceName) ) {
          if( isUndefined(routers[namespaceName]) ) {
            routers[namespaceName] = router;
          } else {
            if( !isArray(routers[namespaceName]) ) {
              routers[namespaceName] = [ routers[namespaceName] ];
            }
            routers[namespaceName].push(router);
          }
        }
      }
      return routers;
    }, {});
  }
};

fw.router = function( routerConfig, $viewModel, $context ) {
  return new Router( routerConfig, $viewModel, $context );
};

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
      throw 'Unknown type of url value provided to $route [' + typeof urlValue + ']';
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
            if(hasHashStart(myLinkPath)) {
              var currentRoute = $myRouter.currentRoute();
              if(!isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + myLinkPath;
              }
              hashOnly = true;
            } else {
              myLinkPath = '/' + myLinkPath;
            }
          }

          if( includeParentPath && !isNullRouter($myRouter) ) {
            myLinkPath = $myRouter.parentRouter().path() + myLinkPath;

            if(fwRouters.html5History() === false) {
              myLinkPath = '#' + (myLinkPath.indexOf('/') === 0 ? myLinkPath.substring(1) : myLinkPath);
            }
          }
        }

        return myLinkPath;
      }

      return null;
    };
    var routeURLWithParentPath = getRouteURL.bind(null, true);
    var routeURLWithoutParentPath = getRouteURL.bind(null, false);

    function checkForMatchingSegment(mySegment, newRoute) {
      if(routeHandlerDescription.addActiveClass) {
        var activeRouteClassName = routeHandlerDescription.activeClass || fwRouters.activeRouteClassName();
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
    };

    function setUpElement() {
      var myCurrentSegment = routeURLWithoutParentPath();
      if( element.tagName.toLowerCase() === 'a' ) {
        element.href = (fwRouters.html5History() ? '' : '/') + routeURLWithParentPath();
      }

      if( isObject(stateTracker) ) {
        stateTracker.dispose();
      }
      stateTracker = $myRouter.currentRoute.subscribe( checkForMatchingSegment.bind(null, myCurrentSegment) );

      if(elementIsSetup === false) {
        elementIsSetup = true;
        checkForMatchingSegment(myCurrentSegment, $myRouter.currentRoute());
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

var Router = function( routerConfig, $viewModel, $context ) {
  extend(this, $baseRouter);
  var subscriptions = this.subscriptions = [];
  var viewModelNamespaceName;

  if( isViewModel($viewModel) ) {
    viewModelNamespaceName = $viewModel.getNamespaceName();
  }

  var $globalNamespace = this.$globalNamespace = makeNamespace();
  this.id = uniqueId('router');
  this.$namespace = makeNamespace( routerConfig.namespace || (viewModelNamespaceName + 'Router') );
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
    var parentRouter = this.parentRouter();
    var routePath = this.parentRouter().path();

    if( isRoute(currentRoute) ) {
      routePath = routePath + currentRoute.segment;
    }
    return routePath;
  }, this);

  var $previousParent = $nullRouter;
  subscriptions.push(this.parentRouter.subscribe(function( $parentRouter ) {
    if( !isNullRouter($previousParent) && $previousParent !== $parentRouter ) {
      $previousParent.childRouters.remove(this);
    }
    $parentRouter.childRouters.push(this);
    $previousParent = $parentRouter;
  }, this));

  // Automatically trigger the new Action() whenever the currentRoute() updates
  subscriptions.push( this.currentRoute.subscribe(function getActionForRouteAndTrigger( newRoute ) {
    this.getActionForRoute( newRoute )( /* get and call the action for the newRoute */ );
  }, this) );

  var $router = this;
  this.$globalNamespace.request.handler('__router_reference', function() {
    return $router;
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
    this.userInitialize = routerConfig.initialize;
  }

  if( routerConfig.activate === true ) {
    subscriptions.push(this.context.subscribe(function activateRouterAfterNewContext( $context ) {
      if( isObject($context) ) {
        this
          .activate( $context )
          .userInitialize();
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
  this.startup( $context, $parentRouter );
  if( this.currentState() === '' ) {
    this.setState();
  }
  return this;
};

var doNotPushOntoHistory = true;
var pushOntoHistory = false;
Router.prototype.setState = function(url) {
  if( this.historyIsEnabled() && !this.disableHistory() ) {
    if(isString(url)) {
      var historyAPIWorked = true;
      try {
        historyAPIWorked = History.pushState(null, '', this.parentRouter().path() + url);
      } catch(error) {
        console.error(error);
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
  }
};

Router.prototype.startup = function( $context, $parentRouter ) {
  var $myRouter = this;
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
        if(!fwRouters.html5History() && windowObject.location.pathname === '/' && windowObject.location.hash.length > 1) {
          this.currentState( this.normalizeURL('/' + windowObject.location.hash.substring(1)) );
        } else {
          this.currentState( this.normalizeURL(windowObject.location.pathname + windowObject.location.hash) );
        }
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

  invoke(this.subscriptions, 'dispose');
  each(omit(this, function(property) {
    return isViewModel(property);
  }), propertyDisposal);
};

Router.prototype.normalizeURL = function(url) {
  var urlParts = parseUri(url);
  this.urlParts(urlParts);

  if(!fwRouters.html5History() && urlParts.path === '/') {
    url = '/' + urlParts.anchor;
  } else {
    url = urlParts.path;
  }

  if( !isNull(this.config.baseRoute) && url.indexOf(this.config.baseRoute) === 0 ) {
    url = url.substr(this.config.baseRoute.length);
    if(url.length > 1) {
      url = url.replace(hashMatchRegex, '/');
    }
  }
  return url;
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
  var matchedRoutes = [];
  find(this.getRouteDescriptions(), function(routeDescription) {
    var routeString = routeDescription.route;
    var routeParams = [];

    if( isString(routeString) ) {
      routeParams = url.match(routeStringToRegExp(routeString));
      if( !isNull(routeParams) && routeDescription.filter.call($myRouter, routeParams, $myRouter.urlParts()) ) {
        matchedRoutes.push({
          routeString: routeString,
          specificity: routeString.replace(namedParamRegex, "*").length,
          routeDescription: routeDescription,
          routeParams: routeParams
        });
      }
    }
    return route;
  });

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

Router.prototype.getActionForRoute = function(routeDescription) {
  var Action = function() {
    delete this.__currentRouteDescription;
    this.$outlet.reset();
  }.bind(this);

  if( isRoute(routeDescription) ) {
    Action = function() {
      if( !isUndefined(routeDescription.title) ) {
        document.title = isFunction(routeDescription.title) ? routeDescription.title.call(this, routeDescription.namedParams, this.urlParts()) : routeDescription.title;
      }

      if( isUndefined(this.__currentRouteDescription) || this.__currentRouteDescription.id !== routeDescription.id ) {
        routeDescription.controller.call( this, routeDescription.namedParams );
        this.__currentRouteDescription = routeDescription;
      }
    }.bind(this);
  }

  return Action;
};

Router.prototype.getRouteDescriptions = function() {
  return this.routeDescriptions;
};
// viewModel.js
// ------------------

// Duck type function for determining whether or not something is a footwork viewModel constructor function
function isViewModelCtor(thing) {
  return isFunction(thing) && !!thing.__isViewModelCtor;
}

// Duck type function for determining whether or not something is a footwork viewModel
function isViewModel(thing) {
  return isObject(thing) && !!thing.__isViewModel;
}

var defaultGetViewModelOptions = {
  includeOutlets: false
};

fw.viewModels = {};

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all model references is returned.
var getViewModels = fw.viewModels.getAll = function(namespaceName, options) {
  options = options || {};
  if( isString(namespaceName) || isArray(namespaceName) ) {
    options.namespaceName = namespaceName;
  }

  return reduce( $globalNamespace.request('__model_reference', extend({}, defaultGetViewModelOptions, options), true), function(viewModels, viewModel) {
    if( !isUndefined(viewModel) ) {
      var namespaceName = isNamespace(viewModel.$namespace) ? viewModel.$namespace.getName() : null;
      if( !isNull(namespaceName) ) {
        if( isUndefined(viewModels[namespaceName]) ) {
          viewModels[namespaceName] = viewModel;
        } else {
          if( !isArray(viewModels[namespaceName]) ) {
            viewModels[namespaceName] = [ viewModels[namespaceName] ];
          }
          viewModels[namespaceName].push(viewModel);
        }
      }
    }
    return viewModels;
  }, {});
};

var defaultViewModelConfigParams = {
  namespace: undefined,
  name: undefined,
  autoRegister: false,
  autoIncrement: false,
  mixins: undefined,
  params: undefined,
  initialize: noop,
  afterInit: noop,
  afterBinding: noop,
  onDispose: noop
};

function beforeInitMixins(mixin) {
  return !!mixin.runBeforeInit;
}

var makeViewModel = fw.viewModel = function(configParams) {
  configParams = configParams || {};

  var ctor = noop;
  var afterInit = noop;
  var parentViewModel = configParams.parent;

  if( !isUndefined(configParams) ) {
    ctor = configParams.viewModel || configParams.initialize || noop;
    afterInit = configParams.afterInit || noop;
  }
  afterInit = { _postInit: afterInit };
  configParams = extend({}, defaultViewModelConfigParams, configParams);

  var initViewModelMixin = {
    _preInit: function( params ) {
      if( isObject(configParams.router) ) {
        this.$router = new Router( configParams.router, this );
      }
    },
    mixin: {
      __isViewModel: true,
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
        this.$globalNamespace.request.handler('__model_reference', function(options) {
          if( !this.__isOutlet || (isObject(options) && options.includeOutlets) ) {
            if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
              if(isArray(options.namespaceName) && indexOf(options.namespaceName, this.getNamespaceName()) !== -1) {
                return this;
              } else if(isString(options.namespaceName) && options.namespaceName === this.getNamespaceName()) {
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

  if( !isViewModelCtor(ctor) ) {
    var composure = [ ctor ];
    var afterInitMixins = reject(viewModelMixins, beforeInitMixins);
    var beforeInitMixins = filter(viewModelMixins, beforeInitMixins);

    if( beforeInitMixins.length ) {
      composure = composure.concat(beforeInitMixins);
    }
    composure = composure.concat(initViewModelMixin);
    if( afterInitMixins.length ) {
      composure = composure.concat(afterInitMixins);
    }
    
    composure = composure.concat(afterInit);
    if( !isUndefined(configParams.mixins) ) {
      composure = composure.concat(configParams.mixins);
    }

    each(composure, function(element) {
      if( !isUndefined(element['runBeforeInit']) ) {
        delete element.runBeforeInit;
      }
    });

    var model = riveter.compose.apply( undefined, composure );
    model.__isViewModelCtor = true;
    model.__configParams = configParams;
  } else {
    // user has specified another viewModel constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    model = ctor;
  }

  if( !isUndefined(parentViewModel) ) {
    model.inherits(parentViewModel);
  }

  if( configParams.autoRegister ) {
    var namespace = configParams.namespace || configParams.name;
    if( isRegisteredViewModel(namespace) ) {
      if( getRegisteredViewModel(namespace) !== model ) {
        throw 'namespace [' + namespace + '] already registered using a different viewModel, autoRegister failed.';
      }
    } else {
      registerViewModel(namespace, model);
    }
  }

  return model;
};

// Provides lifecycle functionality and $context for a given viewModel and element
function applyContextAndLifeCycle(viewModel, element) {
  if( isViewModel(viewModel) ) {
    var $configParams = viewModel.__getConfigParams();
    var context;
    element = element || document.body;
    viewModel.$element = element;
    viewModel.$context = elementContext = fw.contextFor(element);

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

// Override the original applyBindings method to provide 'viewModel' life-cycle hooks/events and to provide the $context to the $router if present.
var originalApplyBindings = fw.applyBindings;
var applyBindings = fw.applyBindings = function(viewModel, element) {
  originalApplyBindings(viewModel, element);
  applyContextAndLifeCycle(viewModel, element);
};

function bindComponentViewModel(element, params, ViewModel) {
  var viewModelObj;
  if( isFunction(ViewModel) ) {
    viewModelObj = new ViewModel(values.params);
  } else {
    viewModelObj = ViewModel;
  }
  viewModelObj.$parentContext = fw.contextFor(element.parentElement || element.parentNode);

  // binding the viewModelObj onto each child element is not ideal, need to do this differently
  // cannot get component.preprocess() method to work/be called for some reason
  each(element.children, function(child) {
    originalApplyBindings(viewModelObj, child);
  });
  applyContextAndLifeCycle(viewModelObj, element);

  // we told applyBindings not to specify a context on the viewModel.$router after binding because we are binding to each
  // sub-element and must specify the context as being the container element only once
  if( isRouter(viewModelObj.$router) ) {
    viewModelObj.$router.context( fw.contextFor(element) );
  }
};

// Monkey patch enables the viewModel component to initialize a model and bind to the html as intended (with lifecycle events)
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = fw.bindingHandlers.component.init;
fw.bindingHandlers.component.init = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
  var theValueAccessor = valueAccessor;
  if( isString(element.tagName) ) {
    var tagName = element.tagName.toLowerCase();
    if( tagName === 'viewmodel' ) {
      var values = valueAccessor();
      var viewModelName = ( !isUndefined(values.params) ? fw.unwrap(values.params.name) : undefined ) || element.getAttribute('module') || element.getAttribute('data-module');
      var bindViewModel = bindComponentViewModel.bind(null, element, values.params);

      if( !isUndefined(viewModelName) ) {
        var resourceLocation = null;

        if( isRegisteredViewModel(viewModelName) ) {
          // viewModel was manually registered, we preferentially use it
          resourceLocation = getRegisteredViewModel(viewModelName);
        } else if( isFunction(require) && isFunction(require.defined) && require.defined(viewModelName) ) {
          // we have found a matching resource that is already cached by require, lets use it
          resourceLocation = viewModelName;
        } else {
          resourceLocation = getViewModelResourceLocation(viewModelName);
        }

        if( isString(resourceLocation) ) {
          if( isFunction(require) ) {
            if( isPath(resourceLocation) ) {
              resourceLocation = resourceLocation + getViewModelFileName(viewModelName);
            }

            require([ resourceLocation ], bindViewModel);
          } else {
            throw 'Uses require, but no AMD loader is present';
          }
        } else if( isFunction(resourceLocation) ) {
          bindViewModel( resourceLocation );
        } else if( isObject(resourceLocation) ) {
          if( isObject(resourceLocation.instance) ) {
            bindViewModel( resourceLocation.instance );
          } else if( isFunction(resourceLocation.createViewModel) ) {
            bindViewModel( resourceLocation.createViewModel( values.params, { element: element } ) );
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
// component.js
// ------------------

var originalComponentRegisterFunc = fw.components.register;
var registerComponent = fw.components.register = function(componentName, options) {
  var viewModel = options.initialize || options.viewModel;
  
  if( !isString(componentName) ) {
    throw 'Components must be provided a componentName.';
  }

  if( isFunction(viewModel) && !isViewModelCtor(viewModel) ) {
    options.namespace = componentName;
    viewModel = makeViewModel(options);
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || fw.viewModel(),
    template: options.template
  });
};

fw.components.getNormalTagList = function() {
  return nonComponentTags.splice(0);
};

fw.components.getComponentNameForNode = function(node) {
  var tagName = isString(node.tagName) && node.tagName.toLowerCase();

  if( fw.components.isRegistered(tagName) || tagIsComponent(tagName) ) {
    return tagName;
  }
  return null;
};

var makeComponent = fw.component = function(componentDefinition) {
  var viewModel = componentDefinition.viewModel;

  if( isFunction(viewModel) && !isViewModelCtor(viewModel) ) {
    componentDefinition.viewModel = makeViewModel( omit(componentDefinition, 'template') );
  }

  return componentDefinition;
};

// Register a component as consisting of a template only.
// This will cause footwork to load only the template when this component is used.
var componentTemplateOnlyRegister = [];
var registerComponentAsTemplateOnly = fw.components.isTemplateOnly = function(componentName, isTemplateOnly) {
  isTemplateOnly = (isUndefined(isTemplateOnly) ? true : isTemplateOnly);
  if( isArray(componentName) ) {
    each(componentName, function(compName) {
      registerComponentAsTemplateOnly(compName, isTemplateOnly);
    });
  }

  componentTemplateOnlyRegister[componentName] = isTemplateOnly;
  if( !isArray(componentName) ) {
    return componentTemplateOnlyRegister[componentName] || 'normal';
  }
};

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
  'lineargradient', 'stop', 'line'
];
var tagIsComponent = fw.components.tagIsComponent = function(tagName, isComponent) {
  if( isUndefined(isComponent) ) {
    return indexOf(nonComponentTags, tagName) === -1;
  }

  if( isArray(tagName) ) {
    each(tagName, function(tag) {
      tagIsComponent(tag, isComponent);
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

// Components which footwork will not wrap in the $life custom binding used for lifecycle events
// Used to keep the wrapper off of internal/natively handled and defined components such as 'outlet'
var nativeComponents = [
  'outlet'
];
function isNativeComponent(componentName) {
  return indexOf(nativeComponents, componentName) !== -1;
}

function componentTriggerAfterBinding(element, viewModel) {
  if( isViewModel(viewModel) ) {
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
      if( isViewModel(viewModel) ) {
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
var componentWrapperTemplate = '<!-- ko $life -->COMPONENT_MARKUP<!-- /ko -->';
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, config, callback) {
    if( !isNativeComponent(componentName) ) {
      // TODO: Handle different types of configs
      if( isString(config) ) {
        config = componentWrapperTemplate.replace(/COMPONENT_MARKUP/, config);
      } else {
        throw 'Unhandled config type ' + typeof config + '.';
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
          if( !isViewModelCtor(ViewModel) ) {
            ViewModel = makeViewModel({ initialize: ViewModel });
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

// The footwork getConfig loader is a catch-all in the instance a registered component cannot be found.
// The loader will attempt to use requirejs via knockouts integrated support if it is available.
fw.components.loaders.push( fw.components.requireLoader = {
  getConfig: function(componentName, callback) {
    var combinedFile = getComponentFileName(componentName, 'combined');
    var viewModelFile = getComponentFileName(componentName, 'viewModel');
    var templateFile = getComponentFileName(componentName, 'template');
    var componentLocation = getComponentResourceLocation(componentName);
    var configOptions = null;
    var viewModelPath;
    var templatePath;
    var combinedPath;

    if( isFunction(require) ) {
      // load component using knockouts native support for requirejs
      if( require.defined(componentName) ) {
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
        viewModelPath = componentLocation.viewModels;
        templatePath = 'text!' + componentLocation.templates;

        if( isPath(viewModelPath) ) {
          viewModelPath = viewModelPath + viewModelFile;
        }
        if( isPath(templatePath) ) {
          templatePath = templatePath + templateFile;
        }
        
        // check to see if the requested component is templateOnly and should not request a viewModel (we supply a dummy object in its place)
        var viewModelConfig = { require: viewModelPath };
        if( componentTemplateOnlyRegister[componentName] ) {
          viewModelConfig = { instance: {} };
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
      throw 'Outlet [' + outletName + '] defined inside of viewModel [' + $parentViewModel.getNamespaceName() + '] but no router was defined.';
    }
  }
};

registerComponent('outlet', {
  autoIncrement: true,
  viewModel: function(params) {
    this.outletName = fw.unwrap(params.name);
    this.__isOutlet = true;
  },
  template: '<!-- ko $bind, component: $route --><!-- /ko -->'
});

registerComponent('_noComponentSelected', {
  viewModel: function(params) {
    this.__assertPresence = false;
  },
  template: '<div class="no-component-selected"></div>'
});

registerComponent('error', {
  viewModel: function(params) {
    this.message = fw.observable(params.message);
    this.errors = params.errors;
    this.__assertPresence = false;
  },
  template: '\
    <div class="component error" data-bind="foreach: errors">\
      <div class="error">\
        <span class="number" data-bind="text: $index() + 1"></span>\
        <span class="message" data-bind="text: $data"></span>\
      </div>\
    </div>'
});
// resource.js
// ------------------

// component resource section
var defaultComponentFileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

var componentFileExtensions = fw.components.fileExtensions = fw.observable( clone(defaultComponentFileExtensions) );

var componentIsRegistered = fw.components.isRegistered;

var getComponentFileName = fw.components.getFileName = function(componentName, fileType) {
  var componentExtensions = componentFileExtensions();
  var fileName = componentName;

  if( componentIsRegistered(componentName) ) {
    return null;
  }

  if( isFunction(componentExtensions) ) {
    fileName += componentExtensions(componentName)[fileType];
  } else if( isObject(componentExtensions) ) {
    if( isFunction(componentExtensions[fileType]) ) {
      fileName += componentExtensions[fileType](componentName);
    } else {
      fileName += componentExtensions[fileType] || '';
    }
  }

  switch(fileType) {
    case 'viewModel':
      fileType = 'viewModels';
      break;
    case 'template':
      fileType = 'templates';
      break;
  }

  if( !isUndefined( componentResourceLocations[componentName] ) ) {
    var registeredLocation = componentResourceLocations[componentName];
    if( !isUndefined(registeredLocation[fileType]) && !isPath(registeredLocation[fileType]) ) {
      if( isString(registeredLocation[fileType]) ) {
        // full filename was supplied, lets return that
        fileName = last( registeredLocation[fileType].split('/') );
      } else {
        return null;
      }
    }
  }
  
  return fileName;
};

var defaultComponentLocation = {
  combined: null,
  viewModels: '/viewModel/',
  templates: '/component/'
};
var componentResourceLocations = fw.components.resourceLocations = {};
var componentDefaultLocation = fw.components.defaultLocation = function(root, updateDefault) {
  var componentLocation = (isUndefined(updateDefault) || updateDefault === true) ? defaultComponentLocation : clone(defaultComponentLocation);

  if( isObject(root) ) {
    // assume some combination of defaultComponentLocation and normalize the parameters
    extend(componentLocation, reduce(root, function(options, paramValue, paramName) {
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
  } else if( isString(root) ) {
    componentLocation = {
      combined: rootURL,
      viewModels: null,
      templates: null
    };
  }

  return componentLocation;
};

var registerLocationOfComponent = fw.components.registerLocation = function(componentName, componentLocation) {
  if( isArray(componentName) ) {
    each(componentName, function(name) {
      registerLocationOfComponent(name, componentLocation);
    });
  }
  componentResourceLocations[ componentName ] = componentDefaultLocation(componentLocation, false);
};

var locationIsRegisteredForComponent = fw.components.locationIsRegistered = function(componentName) {
  return !isUndefined(componentResourceLocations[componentName]);
};

// Return the component resource definition for the supplied componentName
var getComponentResourceLocation = fw.components.getResourceLocation = function(componentName) {
  if( isUndefined(componentName) ) {
    return componentResourceLocations;
  }
  return componentResourceLocations[componentName] || defaultComponentLocation;
};


// viewModel resource section
var defaultViewModelFileExtensions = '.js';
var viewModelFileExtensions = fw.viewModels.fileExtensions = fw.observable( defaultViewModelFileExtensions );

var getViewModelFileName = fw.viewModels.getFileName = function(viewModelName) {
  var viewModelExtensions = viewModelFileExtensions();
  var fileName = viewModelName;

  if( isFunction(viewModelExtensions) ) {
    fileName += viewModelExtensions(viewModelName);
  } else if( isString(viewModelExtensions) ) {
    fileName += viewModelExtensions;
  }

  if( !isUndefined( viewModelResourceLocations[viewModelName] ) ) {
    var registeredLocation = viewModelResourceLocations[viewModelName];
    if( isString(registeredLocation) && !isPath(registeredLocation) ) {
      // full filename was supplied, lets return that
      fileName = last( registeredLocation.split('/') );
    }
  }

  return fileName;
};

var defaultViewModelLocation = '/viewModel/';
var viewModelResourceLocations = fw.viewModels.resourceLocations = {};
var viewModelDefaultLocation = fw.viewModels.defaultLocation = function(path, updateDefault) {
  var viewModelLocation = defaultViewModelLocation;

  if( isString(path) ) {
    viewModelLocation = path;
  }

  if(updateDefault) {
    defaultViewModelLocation = viewModelLocation;
  }

  return viewModelLocation;
};

var registeredViewModels = {};
var registerViewModel = fw.viewModels.register = function(viewModelName, viewModel) {
  registeredViewModels[viewModelName] = viewModel;
};

var isRegisteredViewModel = fw.viewModels.isRegistered = function(viewModelName) {
  return !isUndefined( registeredViewModels[viewModelName] );
};

var getRegisteredViewModel = fw.viewModels.getRegistered = function(viewModelName) {
  return registeredViewModels[viewModelName];
};

var registerLocationOfViewModel = fw.viewModels.registerLocation = function(viewModelName, viewModelLocation) {
  if( isArray(viewModelName) ) {
    each(viewModelName, function(name) {
      registerLocationOfViewModel(name, viewModelLocation);
    });
  }
  viewModelResourceLocations[ viewModelName ] = viewModelDefaultLocation(viewModelLocation, false);
};

var locationIsRegisteredForViewModel = fw.viewModels.locationIsRegistered = function(viewModelName) {
  return !isUndefined(viewModelResourceLocations[viewModelName]);
};

// Return the viewModel resource definition for the supplied viewModelName
var getViewModelResourceLocation = fw.viewModels.getResourceLocation = function(viewModelName) {
  if( isUndefined(viewModelName) ) {
    return viewModelResourceLocations;
  }
  return viewModelResourceLocations[viewModelName] || getComponentResourceLocation(viewModelName).viewModels || defaultViewModelLocation;
};
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