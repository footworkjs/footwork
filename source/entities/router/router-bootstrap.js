var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var defaultChannel = require('postal').channel();
var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var instanceRequestHandler = require('../entity-tools').instanceRequestHandler;
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');
var resultBound = require('../../misc/util').resultBound;

var routerTools = require('./router-tools');
var registerViewModelForOutlet = routerTools.registerViewModelForOutlet;
var unregisterViewModelForOutlet = routerTools.unregisterViewModelForOutlet;
var trimBaseRoute = routerTools.trimBaseRoute;
var normalizeURL = routerTools.normalizeURL;
var isNullRouter = routerTools.isNullRouter;
var getRouteForURL = routerTools.getRouteForURL;
var getActionForRoute = routerTools.getActionForRoute;
var isRoute = routerTools.isRoute;

var routerDefaults = require('./router-defaults');
var nullRouter = routerDefaults.nullRouter;
var noComponentSelected = routerDefaults.noComponentSelected;

/**
 * Bootstrap an instance with router capabilities (state management, outlet control, etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function routerBootstrap (instance, configParams) {
  if (!instance) {
    throw new Error('Must supply the instance to boot()');
  }

  var descriptor = entityDescriptors.getDescriptor('router');

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, descriptor);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped
    configParams = _.extend(instance[privateDataSymbol].configParams, descriptor.defaultConfig, {
      baseRoute: fw.router.baseRoute() + resultBound(configParams, 'baseRoute', instance)
    }, configParams || {});

    _.extend(instance, descriptor.mixin, {
      currentState: fw.observable()
    });

    instance.setRoutes(configParams.routes);

    instance[privateDataSymbol].outlets = {};
    instance.outlet.reset = function () {
      _.each(instance[privateDataSymbol].outlets, function (outlet) {
        outlet({ name: noComponentSelected, params: {} });
      });
    };

    _.extend(instance[privateDataSymbol], {
      registerViewModelForOutlet: _.partial(registerViewModelForOutlet, instance),
      unregisterViewModelForOutlet: _.partial(unregisterViewModelForOutlet, instance),
      childRouters: fw.observableArray(),
      parentRouter: fw.observable(nullRouter),
      historyPopstateListener: fw.observable(),
      urlParts: fw.observable(),
      routeDescriptions: []
    });

    _.extend(instance[privateDataSymbol], {
      /**
       * Computed which determines whether or not the router is configured and in a context which
       * makes it (and its routes) relative to its parent.
       */
      isRelative: fw.computed(function () {
        return configParams.isRelative && !isNullRouter(instance[privateDataSymbol].parentRouter());
      })
    });

    _.extend(instance[privateDataSymbol], {
      /**
       * Computed which gets/updates the currentRoute for the current given currentState of the router
       */
      currentRoute: fw.computed(function () {
        return getRouteForURL(instance, normalizeURL(instance, instance.currentState()));
      })
    });

    _.extend(instance[privateDataSymbol], {
      path: fw.computed(function () {
        var currentRoute = instance[privateDataSymbol].currentRoute();
        var routeSegment = '/';

        if (isRoute(currentRoute)) {
          routeSegment = (currentRoute.segment === '' ? '/' : currentRoute.segment);
        }

        return (instance[privateDataSymbol].isRelative() ? instance[privateDataSymbol].parentRouter()[privateDataSymbol].path() : '') + routeSegment;
      })
    });

    instance.$namespace.command.handler('setState', function (state) {
      var route = state;
      var params = state.params;

      if (_.isObject(state)) {
        route = state.name;
        params = params || {};
      }

      instance.setState(route, params);
    });

    // Automatically trigger the new Action() whenever the currentRoute() updates
    instance.disposeWithInstance(instance[privateDataSymbol].currentRoute.subscribe(function getActionForRouteAndTrigger (newRoute) {
      if (instance.currentState().length) {
        getActionForRoute(newRoute)( /* get and call the action for the newRoute */ );
      }
    }));
  } else {
    throw new Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = routerBootstrap;
