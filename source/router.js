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
  setHref: true,
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
  childRouters: extend( bind(noop), { push: noop } ),
  routePath: function() { return ''; },
  isRelative: function() { return false; },
  __isNullRouter: true
});

var $baseRouter = {
  routePath: emptyStringResult,
  routeSegment: emptyStringResult,
  childRouters: fw.observableArray(),
  context: noop,
  __isRouter: true
};

var baseRoute = {
  controller: noop,
  indexedParams: [],
  namedParams: {},
  __isRoute: true
};

var baseRouteDescription = {
  __isRouteDesc: true,
  filter: alwaysPassPredicate
};

function transformRouteConfigToDesc(routeDesc) {
  return extend({ id: uniqueId('route') }, baseRouteDescription, routeDesc );
}

// Convert a route string to a regular expression which is then used to match a uri against it and determine whether that uri matches the described route as well as parse and retrieve its tokens
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
  if(isReady && isUndefined(History.Adapter.unbind)) {
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
// immediate $context). Returns null if none is found.
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

var isFullURL = fw.isFullURL = function(thing) {
  return isString(thing) && isFullURLRegex.test(thing);
};

fw.routers = {
  // Configuration point for a baseRoute / path which will always be stripped from the URL prior to processing the route
  baseRoute: fw.observable(''),
  getNearestParent: function($context) {
    var $parentRouter = nearestParentRouter($context);
    return (!isNullRouter($parentRouter) ? $parentRouter : null);
  },
  
  // Return array of all currently instantiated $router's
  getAll: function() {
    return reduce( $globalNamespace.request('__router_reference', undefined, true), function(routers, router) {
      var namespaceName = isNamespace(router.$namespace) ? router.$namespace.getName() : null;

      if( !isNull(namespaceName) ) {
        if( isUndefined(routers[namespaceName]) ) {
          routers[namespaceName] = router;
        } else {
          if( !isArray(routers[namespaceName]) ) {
            routers[namespaceName] = [ routers[namespaceName] ];
          }
          routers[namespaceName].push(router);
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
    var eventHandlerNotBound = true;

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
            myLinkPath = '/' + myLinkPath;
          }

          if( includeParentPath && !isNullRouter($myRouter) ) {
            myLinkPath = $myRouter.parentRouter().routePath() + myLinkPath;
          }
        }

        return myLinkPath;
      }

      return null;
    };
    var routeURLWithParentPath = bind(getRouteURL, null, true);
    var routeURLWithoutParentPath = bind(getRouteURL, null, false);

    var routeHandlerDescription = {
      eventType: 'click',
      url: function() { return null; },
      handler: function defaultHandlerForRoute(event, url) {
        if( !isFullURL(url) ) {
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
    } else if( isUndefined(urlValue) ) {
      routeHandlerDescription.url = element.getAttribute('href');;
    } else {
      throw 'Unknown type of url value provided to $route [' + typeof urlValue + ']';
    }

    var routeHandlerDescriptionURL = routeHandlerDescription.url;
    if( isString(routeHandlerDescriptionURL) ) {
      routeHandlerDescription.url = function() { return routeHandlerDescriptionURL; };
    }

    function setUpElement() {
      if(eventHandlerNotBound) {
        eventHandlerNotBound = false;

        fw.utils.registerEventHandler(element, routeHandlerDescription.eventType, function(event) {
          var routeURL = routeHandlerDescription.handler.call(viewModel, event, routeHandlerDescription.url());
          if( routeURL === true ) {
            routeURL = routeURLWithoutParentPath();
          }
          if( isString(routeURL) && !isFullURL( routeURL ) ) {
            $myRouter.setState(routeURL);
          }
        });
      }

      if( element.tagName.toLowerCase() === 'a' ) {
        element.href = routeURLWithParentPath();
      }
    }

    if( isObservable(routeHandlerDescription.url) ) {
      routeHandlerDescription.url.subscribe(setUpElement);
    }

    setUpElement();
  }
};

var Router = function( routerConfig, $viewModel, $context ) {
  extend(this, $baseRouter);
  var subscriptions = this.subscriptions = [];
  var viewModelNamespaceName;

  if( isViewModel($viewModel) ) {
    viewModelNamespaceName = $viewModel.getNamespaceName();
  }

  this.id = uniqueId('router');
  this.$globalNamespace = makeNamespace();
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
  this.historyIsEnabled = fw.observable(false).broadcastAs('historyIsEnabled');
  this.currentState = fw.observable('').broadcastAs('currentState');
  this.config = routerConfig = extend({}, routerDefaultConfig, routerConfig);
  this.config.baseRoute = fw.routers.baseRoute() + (result(routerConfig, 'baseRoute') || '');

  this.isRelative = fw.computed(function() {
    return routerConfig.isRelative && !isNullRouter( this.parentRouter() );
  }, this);
  
  this.currentRoute = fw.computed(function() {
    return this.getRouteForURL( this.currentState() );
  }, this);
  
  this.routePath = fw.computed(function() {
    var currentRoute = this.currentRoute();
    var parentRouter = this.parentRouter();
    var routePath = this.parentRouter().routePath();

    if( isRoute(currentRoute) ) {
      routePath = routePath + currentRoute.routeSegment;
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
  this.$outlet = bind( $routerOutlet, this );
  this.$outlet.reset = bind( function() {
    each( this.outlets, function(outlet) {
      outlet({ name: noComponentSelected, params: {} });
    });
  }, this);

  if( !isUndefined(routerConfig.unknownRoute) ) {
    if( isFunction(routerConfig.unknownRoute) ) {
      routerConfig.unknownRoute = { controller: routerConfig.unknownRoute };
    }
    routerConfig.routes.push( extend( routerConfig.unknownRoute, { unknown: true } ) );
  }
  this.setRoutes( routerConfig.routes );

  if( routerConfig.activate === true ) {
    subscriptions.push(this.context.subscribe(function activateRouterAfterNewContext( $context ) {
      if( isObject($context) ) {
        this.activate( $context );
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

Router.prototype.setState = function(url, noHistoryInjection) {
  if( this.historyIsEnabled() ) {
    if(!noHistoryInjection && isString(url)) {
      var historyAPIWorked = true;
      try {
        historyAPIWorked = History.pushState(null, '', this.parentRouter().routePath() + url);
      } catch(error) {
        historyAPIWorked = false;
      } finally {
        if(historyAPIWorked) {
          return;
        }
      }
    } else {
      url = History.getState().url;
    }
  }

  if( isString(url) ) {
    this.currentState( this.normalizeURL(url) );
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
    if( historyIsReady() ) {
      History.Adapter.bind( windowObject, 'statechange', this.stateChangeHandler = function() {
        $myRouter.setState( History.getState().url, true );
      } );
      this.historyIsEnabled(true);
    } else {
      this.historyIsEnabled(false);
    }
  }

  return this;
};

Router.prototype.shutdown = function() {
  var $parentRouter = this.parentRouter();
  if( !isNullRouter($parentRouter) ) {
    $parentRouter.childRouters.remove(this);
  }

  if( this.historyIsEnabled() && historyIsReady() ) {
    History.Adapter.unbind( this.stateChangeHandler );
  }

  this.$namespace.shutdown();
  this.$globalNamespace.shutdown();

  invoke(this.subscriptions, 'dispose');
  each(this, function(property) {
    if( property && isFunction(property.dispose) ) {
      property.dispose();
    }
  });
};

Router.prototype.normalizeURL = function(url) {
  var urlParts = parseUri(url);
  this.urlParts(urlParts);
  url = urlParts.path;

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
      routeSegment: ''
    });
  }

  return unknownRoute;
};

Router.prototype.getRouteForURL = function(url) {
  var route = null;
  var parentRoutePath = this.parentRouter().routePath() || '';
  var unknownRoute = this.getUnknownRoute();
  var $myRouter = this;

  // If this is a relative router we need to remove the leading parentRoutePath section of the URL
  if( this.isRelative() ) {
    if( parentRoutePath.length > 0 ) {
      if( ( routeIndex = url.indexOf(parentRoutePath) ) === 0 ) {
        url = url.substr( parentRoutePath.length );
      } else {
        return unknownRoute;
      }
    } else {
      return unknownRoute;
    }
  }

  // find all routes with a matching routeString
  var matchedRoutes = [];
  find(this.getRouteDescriptions(), function(routeDescription) {
    var routeString = routeDescription.route;
    var routeParams = [];

    if( isString(routeString) ) {
      routeParams = url.match(routeStringToRegExp(routeString));
      if( !isNull(routeParams) && routeDescription.filter.call($myRouter, { params: routeParams, urlParts: $myRouter.urlParts() }) ) {
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
      routeSegment: url.substr(0, url.length - splatSegment.length),
      indexedParams: routeParams,
      namedParams: namedParams
    });
  }

  return route || unknownRoute;
};

Router.prototype.getActionForRoute = function(routeDescription) {
  var Action = bind( function() {
    delete this.__currentRouteDescription;
    this.$outlet.reset();
  }, this );

  if( isRoute(routeDescription) ) {
    Action = bind(function() {
      if( !isUndefined(routeDescription.title) ) {
        document.title = isFunction(routeDescription.title) ? routeDescription.title.call(this) : routeDescription.title;
      }

      if( isUndefined(this.__currentRouteDescription) || this.__currentRouteDescription.id !== routeDescription.id ) {
        routeDescription.controller.call( this, routeDescription.namedParams );
        this.__currentRouteDescription = routeDescription;
      }
    }, this);
  }

  return Action;
};

Router.prototype.getRouteDescriptions = function() {
  return this.routeDescriptions;
};