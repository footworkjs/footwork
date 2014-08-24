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

// polyfill for missing window.location.origin
if( !isString(windowObject.location.origin) ) {
  windowObject.location.origin = windowObject.location.protocol + "//" + windowObject.location.hostname + (windowObject.location.port ? ':' + windowObject.location.port: '');
}

// Predicate function that always returns true / 'pass'
var alwaysPassPredicate = function() { return true; };

var routerDefaultConfig = {
  namespace: '$router',
  baseRoute: null,
  unknownRoute: null,
  isRelative: true,
  activate: true,
  routes: []
};

// Regular expressions used to parse a uri
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w*/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatch = /(^\/#)/;
var routesAreCaseSensitive = false;

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

function historyIsReady() {
  return has(History, 'Adapter');
}

function extractNavItems(routes) {
  routes = isArray(routes) ? routes : [routes];
  return where(routes, { nav: true });
}

function hasNavItems(routes) {
  return extractNavItems( routes ).length > 0;
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
    } else if( isObject($context.$parentContext) ) {
      // search through next parent up the chain
      $parentRouter = nearestParentRouter( $context.$parentContext );
    }
  }
  return $parentRouter;
}

function isNullRouter($router) {
  return !!$router.__isNullRouter;
}

var $routerOutlet = function(outletName, componentToDisplay, viewModelParameters ) {
  var outlets = this.outlets;

  outletName = ko.unwrap( outletName );

  if( !isObservable(outlets[outletName]) ) {
    outlets[outletName] = ko.observable({
      name: '_noComponentSelected',
      params: {}
    });
  }

  var currentOutletDef = outlets[outletName]();
  var valueMutated = false;

  if( !isUndefined(componentToDisplay) ) {
    currentOutletDef.name = componentToDisplay;
    valueMutated = true;
  }
  if( !isUndefined(viewModelParameters) ) {
    currentOutletDef.params = viewModelParameters;
    valueMutated = true;
  }
  if( valueMutated === true ) {
    outlets[outletName].valueHasMutated();
  }

  return outlets[outletName];
};

var invalidRoutePathIdentifier = '___invalid-route';
var emptyStringResult = function() { return ''; };

var $baseRouter = {
  routePath: emptyStringResult,
  routeSegment: emptyStringResult,
  childRouters: ko.observableArray(),
  __isRouter: true
};

var $nullRouter = extend({}, $baseRouter, {
  __isNullRouter: true
});

var Router = ko.router = function( routerConfig, $viewModel, $context ) {
  extend(this, $baseRouter);

  this.$globalNamespace = makeNamespace();
  this.$namespace = makeNamespace( routerConfig.namespace );
  this.$namespace.enter();

  this.$viewModel = $viewModel;
  this.childRouters = ko.observableArray();
  this.hasSubRouter = ko.observable(false); // need to dynamically add splat to route def if true
  this.parentRouter = ko.observable($nullRouter);
  this.context = ko.observable();
  this.historyIsEnabled = ko.observable(false).broadcastAs('historyIsEnabled');
  this.currentState = ko.observable().broadcastAs('currentState');
  this.config = routerConfig = extend({}, routerDefaultConfig, routerConfig);
  this.config.baseRoute = Router.baseRoute() + (result(routerConfig, 'baseRoute') || '');

  this.isRelative = ko.computed(function() {
    return routerConfig.isRelative && !isNullRouter( this.parentRouter() );
  }, this);

  this.parentRoutePath = ko.computed(function() {
    var $parentRouter = this.parentRouter();
    var routePath = '';
    if( !isNullRouter($parentRouter) ) {
      var parentRoute = $parentRouter.currentRoute();
      if( isRoute(parentRoute) ) {
        routePath = $parentRouter.parentRoutePath() + parentRoute.routeSegment;
      }
    }
    return routePath;
  }, this);
  
  this.routePath = ko.computed(function() {
    var routeIndex;
    var routePath = this.currentState() || '';
    var parentRoutePath = this.parentRoutePath() || '';

    if( routePath.length > 0 ) {
      // must substract parentRoute path
      if( this.isRelative() && parentRoutePath.length > 0 ) {
        if( ( routeIndex = routePath.indexOf(parentRoutePath) ) === 0 ) {
          routePath = routePath.substr(routeIndex);
        } else {
          return invalidRoutePathIdentifier;
        }
      }
    }
    return routePath;
  }, this);
  
  this.currentRoute = ko.computed(function() {
    return this.getRouteForURL( this.routePath() );
  }, this);

  var $previousParent = $nullRouter;
  this.parentRouter.subscribe(function( $parentRouter ) {
    if( !isNullRouter($previousParent) && $previousParent !== $parentRouter ) {
      $previousParent.childRouters.remove(this);
    }
    $parentRouter.childRouters.push(this);
    $previousParent = $parentRouter;
  }, this);

  // Automatically trigger the new Action() whenever the currentRoute() updates
  var oldRoute;
  this.currentRoute.subscribe(function( newRoute ) {
    if( isUndefined(oldRoute) || oldRoute.id !== newRoute.id ) {
      this.getActionForRoute( this.currentRoute() )( /* get and call the action for the newRoute */ );
      oldRoute = newRoute;
    }
  }, this);

  this.childRouters.subscribe(function( childRouters ) {
    this.hasSubRouter( reduce(childRouters, function(hasSubRouter, childRouter) {
      return hasSubRouter || childRouter.isRelative();
    }, false) );
  }, this);

  var $router = this;
  this.$globalNamespace.request.handler('__router_reference', function() {
    return $router;
  });

  this.currentState('');

  this.navModelUpdate = ko.observable();
  this.outlets = {};
  this.$outlet = bind( $routerOutlet, this );

  this.setRoutes( routerConfig.routes );

  if( routerConfig.activate === true ) {
    this.context.subscribe(function( $context ) {
      if( isObject($context) ) {
        this.activate( $context );
      }
    }, this);
  }
  this.context( $viewModel.$context || $context );

  this.$namespace.exit();
};
Router.baseRoute = ko.observable('');

// Return array of all currently instantiated $router's
Router.getAllRouters = function() {
  return makeNamespace().request('__router_reference');
};

Router.prototype.unknownRoute = function() {
  return !isUndefined(this.config) ? result(this.config.unknownRoute) : undefined;
};

Router.prototype.setRoutes = function(route) {
  this.config.routes = [];
  this.addRoutes(route);
  return this;
};

Router.prototype.addRoutes = function(routes) {
  routes = isArray(routes) ? routes : [routes];
  this.config.routes = this.config.routes.concat( map(routes, function(route) {
    route.id = uniqueId('route');
    return route;
  }) );

  if( hasNavItems(routes) && isObservable(this.navigationModel) ) {
    this.navModelUpdate.notifySubscribers();
  }

  return this;
};

Router.prototype.activate = function($context, $parentRouter) {
  return this
    .startup( $context, $parentRouter )
    .stateChange();
};

Router.prototype.stateChange = function(url) {
  if( !isString(url) && this.historyIsEnabled() ) {
    url = History.getState().url;
  }

  if( isString(url) ) {
    this.currentState( this.normalizeURL(url) );
  }
};

Router.prototype.startup = function( $context, $parentRouter ) {
  $parentRouter = $parentRouter || $nullRouter;
  if( !isNullRouter($parentRouter) ) {
    this.parentRouter($parentRouter);
  } else if( isObject($context) ) {
    this.parentRouter( $parentRouter = nearestParentRouter($context) );
  }

  if( this.historyIsEnabled() !== true ) {
    if( historyIsReady() ) {
      History.Adapter.bind( windowObject, 'statechange', bind(function() {
        this.stateChange( History.getState().url );
      }, this) );
      this.historyIsEnabled(true);
    } else {
      this.historyIsEnabled(false);
    }
  }

  return this;
};

Router.prototype.shutdown = function() {
  delete this.stateChange;
  this.parentRouter().childRouters.remove(this);
  this.$namespace.shutdown();
  this.$globalNamespace.shutdown();
};

Router.prototype.normalizeURL = function(url) {
  if( url.indexOf(windowObject.location.origin) === 0 ) {
    url = url.substr(windowObject.location.origin.length);
  }

  if( !isNull(this.config.baseRoute) && url.indexOf(this.config.baseRoute) === 0 ) {
    url = url.substr(this.config.baseRoute.length);
    if(url.length > 1) {
      url = url.replace(hashMatch, '/');
    }
  }
  return url;
};

var baseRoute = {
  controller: noop,
  indexedParams: [],
  namedParams: {},
  __isRoute: true
};

Router.prototype.getRouteForURL = function(url) {
  var route = null;
  var $router = this;

  each(this.getRoutes(), function(routeDesc, routeIndex) {
    var isRelative = $router.isRelative();
    var routeString = routeDesc.route;
    var splatResult = '';
    if( isRelative ) {
      routeString = routeString + '/*';
    }

    var routeRegex = routeStringToRegExp(routeString);
    var routeParamValues = url.match(routeRegex);

    if( !isNull(routeParamValues) ) {
      if( isRelative ) {
        splatResult = routeParamValues.pop();
      }

      var routeParams = _.map( routeString.match(namedParam), function(param) {
        return param.replace(':', '');
      } );

      var namedParams = reduce(routeParams, function(parameters, parameterName, index) {
        parameters[parameterName] = routeParamValues[index + 1];
        return parameters;
      }, {});

      route = _.extend({}, baseRoute, {
        id: routeDesc.id,
        controller: routeDesc.controller,
        title: routeDesc.title,
        url: url,
        indexedParams: routeParamValues,
        namedParams: namedParams,
        allParams: extend( {}, namedParams, reduce(routeParamValues, function(params, routeParamValue, index) {
            params[index] = routeParamValue;
            return params;
          }, {}) ),
        routeSegment: url.substr(0, url.length - splatResult.length)
      });
    }
  });

  if( isNull(route) && ko.debugLevel() >= 2 ) {
    throw 'Could not locate associated route for [' + url + '].';
  }

  return route;
};

Router.prototype.getActionForRoute = function(route) {
  var Action = noop;
  var $router = this;

  if( route ) {
    Action = function() {
      route.controller.call( $router.$viewModel, $router.$outlet, route );
    };
  }

  return Action;
};

Router.prototype.getRoutes = function() {
  return this.config.routes;
};

Router.prototype.navigationModel = function(predicate) {
  if( isUndefined(this.navigationModel) ) {
    this.navigationModel = ko.computed(function() {
      this.navModelUpdate(); // dummy reference used to trigger updates
      return filter(
        extractNavItems(routes),
        ( predicate || alwaysPassPredicate )
      );
    }, { navModelUpdate: this.navModelUpdate }).broadcastAs({ name: 'navigationModel', namespace: this.$namespace });
  }

  return this.navigationModel;
};

var defaultTitle = ko.observable('[No Title]');
ko.bindingHandlers.$route = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.utils.registerEventHandler(element, 'click', function( event ) {
      var $myRouter = nearestParentRouter(bindingContext);
      var $nearestParentRouter = nearestParentRouter(bindingContext.$parentContext);
      var destinationURL = element.getAttribute('href');
      var title = element.getAttribute('data-title');

      if( $myRouter.isRelative() && !isNullRouter($nearestParentRouter) ) {
        destinationURL = $nearestParentRouter.routePath() + destinationURL;
      }

      History.pushState( null, title || defaultTitle(), destinationURL );
      event.stopPropagation();
      event.preventDefault();
    });
  }
};