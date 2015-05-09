// framework/entities/router/Router.js
// ------------------

function DefaultAction() {
  delete this.__currentRouteDescription;
  this.$outlet.reset();
}

function RoutedAction(routeDescription) {
  if( !isUndefined(routeDescription.title) ) {
    document.title = isFunction(routeDescription.title) ? routeDescription.title.call(this, routeDescription.namedParams, this__router('urlParts')()) : routeDescription.title;
  }

  if( isUndefined(this.__currentRouteDescription) || !sameRouteDescription(this.__currentRouteDescription, routeDescription) ) {
    (routeDescription.controller || noop).apply( this, values(routeDescription.namedParams) );
    this.__currentRouteDescription = routeDescription;
  }
}

function activateRouter($router, $context, $parentRouter ) {
  $parentRouter = $parentRouter || $nullRouter;

  if( !isNullRouter($parentRouter) ) {
    $router.__router('parentRouter')($parentRouter);
  } else if( isObject($context) ) {
    $parentRouter = nearestParentRouter($context);
    if( $parentRouter !== $router ) {
      $router.__router('parentRouter')($parentRouter);
    }
  }

  if( !$router.__router('historyIsEnabled')() ) {
    if( historyIsReady() && !$router.__router('disableHistory')() ) {
      History.Adapter.bind( windowObject, 'popstate', $router.__router('stateChangeHandler', function(event) {
        var url = '';
        if(!fw.routers.html5History() && windowObject.location.hash.length > 1) {
          url = windowObject.location.hash;
        } else {
          url = windowObject.location.pathname + windowObject.location.hash;
        }

        $router.__router('currentState')( normalizeURL($router, url) );
      }));
      $router.__router('historyIsEnabled')(true);
    } else {
      $router.__router('historyIsEnabled')(false);
    }
  }

  return $router;
};

function normalizeURL($router, url) {
  var urlParts = parseUri(url);
  $router.__router('urlParts')(urlParts);

  if(!fw.routers.html5History()) {
    if(url.indexOf('#') !== -1) {
      url = '/' + urlParts.anchor.replace(startingSlashRegex, '');
    } else if($router.__router('currentState')() !== url) {
      url = '/';
    }
  } else {
    url = urlParts.path;
  }

  return trimBaseRoute($router, url);
};

function getRouteForURL($router, url) {
  var route = null;
  var parentRoutePath = $router.__router('parentRouter')().path() || '';
  var unknownRoute = getUnknownRoute($router);

  // If this is a relative router we need to remove the leading parentRoutePath section of the URL
  if($router.__router('isRelative')() && parentRoutePath.length > 0 && (routeIndex = url.indexOf(parentRoutePath + '/')) === 0) {
    url = url.substr( parentRoutePath.length );
  }

  // find all routes with a matching routeString
  var matchedRoutes = reduce($router.routeDescriptions, function(matches, routeDescription) {
    var routeString = routeDescription.route;
    var routeParams = [];

    if( isString(routeString) ) {
      routeParams = url.match(routeStringToRegExp(routeString));
      if( !isNull(routeParams) && routeDescription.filter.call($router, routeParams, $router.__router('urlParts').peek()) ) {
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

function getUnknownRoute($router) {
  var unknownRoute = findWhere(($router.routeDescriptions || []).reverse(), { unknown: true }) || null;

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

function getActionForRoute($router, routeDescription) {
  var Action;

  if( isRoute(routeDescription) ) {
    Action = RoutedAction.bind($router, routeDescription);
  }

  return Action || DefaultAction.bind($router);
};

var Router = function(descriptor, configParams) {
  return {
    _preInit: function( params ) {
      var $router = this;
      var subscriptions;
      var routerData = {};

      var __router = this.__router = function privateData(propName, propValue) {
        var isGetBaseObjOp = arguments.length === 0;
        var isReadOp = arguments.length === 1;
        var isWriteOp = arguments.length === 2;

        if(isGetBaseObjOp) {
          return routerData;
        } else if(isReadOp) {
          return routerData[propName];
        } else if(isWriteOp) {
          routerData[propName] = propValue;
          return routerData[propName];
        }
      };

      configParams.baseRoute = fw.routers.baseRoute() + (result(configParams, 'baseRoute') || '');

      __router('subscriptions', subscriptions = fw.observableArray());
      __router('urlParts', fw.observable());
      __router('childRouters', fw.observableArray());
      __router('parentRouter', fw.observable($nullRouter));
      __router('context', fw.observable());
      __router('historyIsEnabled', fw.observable(false));
      __router('disableHistory', fw.observable().receiveFrom(this.$globalNamespace, 'disableHistory'));
      __router('currentState', fw.observable('').broadcastAs('currentState'));

      __router('isRelative', fw.computed(function() {
        return configParams.isRelative && !isNullRouter( this.parentRouter() );
      }, __router()));

      this.currentRoute = __router('currentRoute', fw.computed(function() {
        return getRouteForURL($router, normalizeURL($router, this.currentState()) );
      }, __router()));

      this.path = __router('path', fw.computed(function() {
        var currentRoute = this.currentRoute();
        var routeSegment = '/';

        if( isRoute(currentRoute) ) {
          routeSegment = (currentRoute.segment === '' ? '/' : currentRoute.segment);
        }

        return (this.isRelative() ? this.parentRouter().path() : '') + routeSegment;
      }, __router()));

      this.$namespace.command.handler('setState', this.setState, this);
      this.$namespace.request.handler('currentRoute', function() { return this.currentRoute(); }, this);
      this.$namespace.request.handler('urlParts', function() { return __router('urlParts')(); }, this);

      var parentPathSubscription;
      var $previousParent = $nullRouter;
      subscriptions.push(__router('parentRouter').subscribe(function( $parentRouter ) {
        if( !isNullRouter($previousParent) && $previousParent !== $parentRouter ) {
          $previousParent.__router('childRouters').remove(this);

          if(parentPathSubscription) {
            subscriptions.remove(parentPathSubscription);
            parentPathSubscription.dispose();
          }
          subscriptions.push(parentPathSubscription = $parentRouter.path.subscribe(function triggerRouteRecompute() {
            $router.__router('currentState').notifySubscribers();
          }));
        }
        $parentRouter.__router('childRouters').push(this);
        $previousParent = $parentRouter;
      }, this));

      // Automatically trigger the new Action() whenever the currentRoute() updates
      subscriptions.push( __router('currentRoute').subscribe(function getActionForRouteAndTrigger( newRoute ) {
        if(this.__router('currentState')().length) {
          getActionForRoute($router, newRoute)( /* get and call the action for the newRoute */ );
        }
      }, this) );

      this.outlets = {};
      this.$outlet = $routerOutlet.bind(this);
      this.$outlet.reset = function() {
        each( this.outlets, function(outlet) {
          outlet({ name: noComponentSelected, params: {} });
        });
      }.bind(this);

      if( !isUndefined(configParams.unknownRoute) ) {
        if( isFunction(configParams.unknownRoute) ) {
          configParams.unknownRoute = { controller: configParams.unknownRoute };
        }
        configParams.routes.push( extend( configParams.unknownRoute, { unknown: true } ) );
      }
      this.setRoutes( configParams.routes );

      if( configParams.activate === true ) {
        subscriptions.push(this.__router('context').subscribe(function activateRouterAfterNewContext( $context ) {
          if( isObject($context) ) {
            this.activate($context);
          }
        }, this));
      }

      this.$namespace.exit();
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
        $context = $context || this.__router('context')();
        activateRouter(this, $context, $parentRouter || nearestParentRouter($context) );
        if( this.__router('currentState')() === '' ) {
          this.setState();
        }
        return this;
      },
      setState: function(url) {
        if( this.__router('historyIsEnabled')() && !this.__router('disableHistory')() ) {
          if(isString(url)) {
            var historyAPIWorked = true;
            try {
              historyAPIWorked = History.pushState(null, '', this.__getConfigParams().baseRoute + this.__router('parentRouter')().path() + url.replace(startingHashRegex, '/'));
            } catch(historyException) {
              historyAPIWorked = false;
            } finally {
              if(historyAPIWorked) {
                return;
              }
            }
          } else if(isFunction(History.getState)) {
            this.__router('currentState')( normalizeURL(this, History.getState().url ) );
          }
        } else if(isString(url)) {
          this.__router('currentState')( normalizeURL(this, url ) );
        } else {
          this.__router('currentState')('/');
        }

        if(!historyIsReady()) {
          var routePath = this.path();
          each(this.__router('childRouters')(), function(childRouter) {
            childRouter.__router('currentState')(routePath);
          });
        }

        return this;
      },
      dispose: function() {
        var $parentRouter = this.__router('parentRouter')();
        if( !isNullRouter($parentRouter) ) {
          $parentRouter.__router('childRouters').remove(this);
        }

        if( this.__router('historyIsEnabled')() && historyIsReady() ) {
          History.Adapter.unbind( this.__router('stateChangeHandler') );
        }

        this.$namespace.dispose();
        this.$globalNamespace.dispose();
        invoke(this.__router('subscriptions'), 'dispose');

        each(omit(this, function(property) {
          return isEntity(property);
        }), propertyDisposal);

        each(omit(this.__router(), function(property) {
          return isEntity(property);
        }), propertyDisposal);
      }
    }
  };
};
