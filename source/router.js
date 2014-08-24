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
var $nullRouter = { getRoutePath: function() { return ''; } };
var Router = ko.router = function( routerConfig, $viewModel, $context ) {
  this.__isRouter = true;

  this.$globalNamespace = makeNamespace();
  this.$namespace = makeNamespace( routerConfig.namespace );
  this.$namespace.enter();

  this.$viewModel = $viewModel;
  this.$parentRouter = $nullRouter;
  this.parentRoutePath = ko.observable('');
  this.context = ko.observable();
  this.historyIsEnabled = ko.observable(false).broadcastAs('historyIsEnabled');
  this.currentState = ko.observable().broadcastAs('currentState');

  this.config = routerConfig = extend({}, routerDefaultConfig, routerConfig);
  var configBaseRoute = result(routerConfig, 'baseRoute');
  this.config.baseRoute = Router.baseRoute() + (configBaseRoute || '');

  var $router = this;
  this.$globalNamespace.request.handler('__router_reference', function() {
    return $router;
  });
  
  this.routePath = ko.computed(function() {
    var routeIndex;
    var routePath = this.currentState() || '';
    var parentRoutePath = this.parentRoutePath();

    if( routePath.length > 0 ) {
      // must substract parentRoute path
      if( parentRoutePath.length > 0 ) {
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

  this.currentAction = ko.computed(function() {
    return this.getActionForRoute( this.currentRoute() );
  }, this);

  this.currentAction.subscribe(function( Action ) {
    Action( this.$viewModel, this.$outlet );
  }, this);
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
  return ( !isUndefined(this.config) ? result(this.config.unknownRoute) : undefined);
};

Router.prototype.setRoutes = function(route) {
  this.config.routes = [];
  this.addRoutes(route);
  return this;
};

Router.prototype.addRoutes = function(route) {
  route = isArray(route) ? route : [route];
  this.config.routes = this.config.routes.concat(route);

  if( hasNavItems(route) && isObservable(this.navigationModel) ) {
    this.navModelUpdate.notifySubscribers();
  }

  return this;
};

Router.prototype.activate = function($context, $parentRouter) {
  return this
    .startup( $context, $parentRouter )
    .stateChange();
};

Router.prototype.getRoutePath = function() {
  var routePath = this.parentRoutePath() || '';

  return routePath + this.currentState();
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
  if( $parentRouter !== $nullRouter ) {
    this.$parentRouter = $parentRouter;
  } else if( isObject($context) ) {
    this.$parentRouter = $parentRouter = nearestParentRouter($context);
  }
  this.parentRoutePath($parentRouter.getRoutePath());

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
  this.$namespace.shutdown();
  this.$globalNamespace.shutdown();
};

Router.prototype.normalizeURL = function(url) {
  var isRelative = (!this.config.relativeToParent || this.$parentRouter !== $nullRouter);

  if( isRelative && url.indexOf(windowObject.location.origin) === 0 ) {
    url = url.substr(windowObject.location.origin.length);
  }

  if( isRelative && !isNull(this.config.baseRoute) && url.indexOf(this.config.baseRoute) === 0 ) {
    url = url.substr(this.config.baseRoute.length);
    if(url.length > 1) {
      url = url.replace(hashMatch, '/');
    }
  }
  return url;
};

Router.prototype.getRouteForURL = function(url) {
  var route = null;
  each(this.getRoutes(), function(routeDesc) {
    var routeString = routeDesc.route;
    var routeRegex = routeStringToRegExp(routeString);
    var routeParamValues = url.match(routeRegex);

    if( !isNull(routeParamValues) ) {
      var routeParams = _.map(routeString.match(namedParam), function(param) {
        return param.replace(':', '');
      });

      route = {
        controller: routeDesc.controller,
        title: routeDesc.title,
        url: routeParamValues[0],
        params: reduce(routeParams, function(parameters, parameterName, index) {
            parameters[parameterName] = routeParamValues[index + 1];
            return parameters;
          }, {})
      };
    }
  });
  return route;
};

Router.prototype.getActionForRoute = function(route) {
  var Action = noop;

  if( route ) {
    Action = function($viewModel, $outlet, params) {
      route.controller.call( $viewModel, $outlet, extend(route.params, params), route );
    };
  }

  if(ko.debugLevel() >= 2 && Action === noop) {
    throw 'Could not locate associated action for ' + typeof route + ' route';
  }

  return Action;
};

Router.prototype.getRoutes = function() {
  return this.config.routes;
};

Router.prototype.enableSplatForCurrentRoute = function() {
  console.log(this.currentRoute());
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

      if( !isNull($nearestParentRouter) && $myRouter.config.relativeToParent === true ) {
        destinationURL = $nearestParentRouter.getRoutePath() + destinationURL;
      }

      History.pushState( null, title || defaultTitle(), destinationURL );
      event.stopPropagation();
      event.preventDefault();
    });
  }
};