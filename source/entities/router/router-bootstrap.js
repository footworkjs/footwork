var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');
var resultBound = require('../../misc/util').resultBound;

var routerTools = require('./router-tools');
var registerOutlet = routerTools.registerOutlet;
var unregisterOutlet = routerTools.unregisterOutlet;
var normalizeURL = routerTools.normalizeURL;
var getRouteForURL = routerTools.getRouteForURL;
var triggerRoute = routerTools.triggerRoute;
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
      baseRoute: fw.router.baseRoute() + (resultBound(configParams, 'baseRoute', instance) || '')
    }, configParams || {});

    _.extend(instance, descriptor.mixin, {
      currentState: fw.observable()
    });

    instance[privateDataSymbol].outlets = {};

    _.extend(instance[privateDataSymbol], {
      registerOutlet: _.partial(registerOutlet, instance),
      unregisterOutlet: _.partial(unregisterOutlet, instance),
      parentRouter: fw.observable(nullRouter),
      historyPopstateListener: fw.observable(),
      routeDescriptions: []
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

        return routeSegment;
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

    // Automatically trigger the routes controller whenever the currentRoute() updates
    instance.disposeWithInstance(instance[privateDataSymbol].currentRoute.subscribe(function routeTrigger (newRoute) {
      triggerRoute(instance, newRoute);
    }));

    instance.setRoutes(configParams.routes);
  } else {
    throw new Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = routerBootstrap;
