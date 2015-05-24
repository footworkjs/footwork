// framework/entities/router/Router.js
// ------------------

var Router = function(descriptor, configParams) {
  return {
    _preInit: function( params ) {
      var $router = this;
      var router = {};  // internal data/etc
      var routerConfigParams = extend({}, configParams);

      this.__getConfigParams = function() {
        return routerConfigParams;
      };

      var __router = this.__router = function privateData(propName, propValue) {
        var isGetBaseObjOp = arguments.length === 0;
        var isReadOp = arguments.length === 1;
        var isWriteOp = arguments.length === 2;

        if(isGetBaseObjOp) {
          return router;
        } else if(isReadOp) {
          return router[propName];
        } else if(isWriteOp) {
          router[propName] = propValue;
          return router[propName];
        }
      };

      routerConfigParams.baseRoute = fw.routers.baseRoute() + (result(routerConfigParams, 'baseRoute') || '');

      var subscriptions = router.subscriptions = fw.observableArray();
      router.urlParts = fw.observable();
      router.childRouters = fw.observableArray();
      router.parentRouter = fw.observable($nullRouter);
      router.context = fw.observable();
      router.historyIsEnabled = fw.observable(false);
      router.disableHistory = fw.observable().receiveFrom(this.$globalNamespace, 'disableHistory');
      router.currentState = fw.observable('').broadcastAs('currentState');

      function trimBaseRoute(url) {
        var routerConfig = $router.__getConfigParams();
        if( !isNull(routerConfig.baseRoute) && url.indexOf(routerConfig.baseRoute) === 0 ) {
          url = url.substr(routerConfig.baseRoute.length);
          if(url.length > 1) {
            url = url.replace(hashMatchRegex, '/');
          }
        }
        return url;
      }

      function normalizeURL(url) {
        var urlParts = parseUri(url);
        router.urlParts(urlParts);

        if(!fw.routers.html5History()) {
          if(url.indexOf('#') !== -1) {
            url = '/' + urlParts.anchor.replace(startingSlashRegex, '');
          } else if(router.currentState() !== url) {
            url = '/';
          }
        } else {
          url = urlParts.path;
        }

        return trimBaseRoute(url);
      }
      router.normalizeURL = normalizeURL;

      function getUnknownRoute() {
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
      }

      function getRouteForURL(url) {
        var route = null;
        var parentRoutePath = router.parentRouter().path() || '';
        var unknownRoute = getUnknownRoute();

        // If this is a relative router we need to remove the leading parentRoutePath section of the URL
        if(router.isRelative() && parentRoutePath.length > 0 && (routeIndex = url.indexOf(parentRoutePath + '/')) === 0) {
          url = url.substr( parentRoutePath.length );
        }

        // find all routes with a matching routeString
        var matchedRoutes = reduce($router.routeDescriptions, function(matches, routeDescription) {
          var routeString = routeDescription.route;
          var routeParams = [];

          if( isString(routeString) ) {
            routeParams = url.match(routeStringToRegExp(routeString));
            if( !isNull(routeParams) && routeDescription.filter.call($router, routeParams, router.urlParts.peek()) ) {
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
      }

      function DefaultAction() {
        delete router.currentRouteDescription;
        $router.$outlet.reset();
      }

      function RoutedAction(routeDescription) {
        if( !isUndefined(routeDescription.title) ) {
          document.title = isFunction(routeDescription.title) ? routeDescription.title.call($router, routeDescription.namedParams, this__router('urlParts')()) : routeDescription.title;
        }

        if( isUndefined(router.currentRouteDescription) || !sameRouteDescription(router.currentRouteDescription, routeDescription) ) {
          (routeDescription.controller || noop).apply( $router, values(routeDescription.namedParams) );
          router.currentRouteDescription = routeDescription;
        }
      }

      function getActionForRoute(routeDescription) {
        var Action;

        if( isRoute(routeDescription) ) {
          Action = RoutedAction.bind($router, routeDescription);
        }

        return Action || DefaultAction;
      }

      router.isRelative = fw.computed(function() {
        return routerConfigParams.isRelative && !isNullRouter( this.parentRouter() );
      }, router);

      this.currentRoute = router.currentRoute = fw.computed(function() {
        return getRouteForURL(normalizeURL(this.currentState()) );
      }, router);

      this.path = router.path = fw.computed(function() {
        var currentRoute = this.currentRoute();
        var routeSegment = '/';

        if( isRoute(currentRoute) ) {
          routeSegment = (currentRoute.segment === '' ? '/' : currentRoute.segment);
        }

        return (this.isRelative() ? this.parentRouter().path() : '') + routeSegment;
      }, router);

      this.$namespace.command.handler('setState', this.setState, this);
      this.$namespace.request.handler('currentRoute', function() { return this.currentRoute(); }, this);
      this.$namespace.request.handler('urlParts', function() { return router.urlParts(); }, this);

      var parentPathSubscription;
      var $previousParent = $nullRouter;
      subscriptions.push(router.parentRouter.subscribe(function( $parentRouter ) {
        if( !isNullRouter($previousParent) && $previousParent !== $parentRouter ) {
          $previousParent.router.childRouters.remove(this);

          if(parentPathSubscription) {
            subscriptions.remove(parentPathSubscription);
            parentPathSubscription.dispose();
          }
          subscriptions.push(parentPathSubscription = $parentRouter.path.subscribe(function triggerRouteRecompute() {
            $router.router.currentState.notifySubscribers();
          }));
        }
        $parentRouter.__router('childRouters').push(this);
        $previousParent = $parentRouter;
      }, this));

      // Automatically trigger the new Action() whenever the currentRoute() updates
      subscriptions.push( router.currentRoute.subscribe(function getActionForRouteAndTrigger( newRoute ) {
        if(router.currentState().length) {
          getActionForRoute(newRoute)( /* get and call the action for the newRoute */ );
        }
      }, this) );

      this.outlets = {};
      this.$outlet = $routerOutlet.bind(this);
      this.$outlet.reset = function() {
        each( this.outlets, function(outlet) {
          outlet({ name: noComponentSelected, params: {} });
        });
      }.bind(this);

      if( !isUndefined(routerConfigParams.unknownRoute) ) {
        if( isFunction(routerConfigParams.unknownRoute) ) {
          routerConfigParams.unknownRoute = { controller: routerConfigParams.unknownRoute };
        }
        routerConfigParams.routes.push( extend( routerConfigParams.unknownRoute, { unknown: true } ) );
      }
      this.setRoutes( routerConfigParams.routes );

      if( routerConfigParams.activate === true ) {
        subscriptions.push(router.context.subscribe(function activateRouterAfterNewContext( $context ) {
          if( isObject($context) ) {
            this.activate($context);
          }
        }, this));
      }
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
        $parentRouter = $parentRouter || nearestParentRouter($context);

        if( !isNullRouter($parentRouter) ) {
          this.__router('parentRouter')($parentRouter);
        } else if( isObject($context) ) {
          $parentRouter = nearestParentRouter($context);
          if( $parentRouter !== this ) {
            this.__router('parentRouter')($parentRouter);
          }
        }

        if( !this.__router('historyIsEnabled')() ) {
          if( historyIsReady() && !this.__router('disableHistory')() ) {
            History.Adapter.bind( windowObject, 'popstate', this.__router('stateChangeHandler', function(event) {
              var url = '';
              if(!fw.routers.html5History() && windowObject.location.hash.length > 1) {
                url = windowObject.location.hash;
              } else {
                url = windowObject.location.pathname + windowObject.location.hash;
              }

              this.__router('currentState')( this.__router('normalizeURL')(url) );
            }.bind(this) ));
            this.__router('historyIsEnabled')(true);
          } else {
            this.__router('historyIsEnabled')(false);
          }
        }

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
            this.__router('currentState')( this.__router('normalizeURL')(History.getState().url ) );
          }
        } else if(isString(url)) {
          this.__router('currentState')( this.__router('normalizeURL')(url ) );
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
