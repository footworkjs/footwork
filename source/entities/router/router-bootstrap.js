var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');
var resultBound = require('../../misc/util').resultBound;

var routerTools = require('./router-tools');
var registerOutlet = routerTools.registerOutlet;
var unregisterOutlet = routerTools.unregisterOutlet;
var trimBaseRoute = routerTools.trimBaseRoute;
var getRouteForURL = routerTools.getRouteForURL;
var triggerRoute = routerTools.triggerRoute;
var isRoute = routerTools.isRoute;
var stripQueryStringAndHashFromPath = routerTools.stripQueryStringAndHashFromPath;


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
    throw Error('Must supply the instance to boot()');
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

    _.extend(instance[privateDataSymbol], {
      registerOutlet: _.partial(registerOutlet, instance),
      unregisterOutlet: _.partial(unregisterOutlet, instance),
      historyPopstateListener: fw.observable(),
      outlets: {}
    });

    _.extend(instance, descriptor.mixin, {
      $currentState: fw.observable(),
      $activated: fw.observable(false),
      $routes: fw.collection(configParams.routes)
    });

    instance[privateDataSymbol].currentRoute = fw.computed(function () {
      var routes = instance.$routes();
      var $currentState = instance.$currentState();
      return getRouteForURL(instance, routes, trimBaseRoute(instance, stripQueryStringAndHashFromPath($currentState)));
    });

    instance.$currentRoute = fw.computed(function() {
      var currentRoute = instance[privateDataSymbol].currentRoute();
      if(currentRoute) {
        return currentRoute.routeDescription;
      } else {
        return null;
      }
    });

    instance.$namespace.command.handler('pushState', function (state) {
      var route = state;
      var params = state.params;

      if (_.isObject(state)) {
        route = state.name;
        params = params || {};
      }

      instance.pushState(route, params);
    });

    instance.$namespace.command.handler('replaceState', function (state) {
      var route = state;
      var params = state.params;

      if (_.isObject(state)) {
        route = state.name;
        params = params || {};
      }

      instance.replaceState(route, params);
    });

    instance.disposeWithInstance(
      fw.computed(function() {
        // Automatically trigger the currentRoute controller whenever the currentRoute() updates and the router is activated
        var currentRoute = instance[privateDataSymbol].currentRoute();
        var activated = instance.$activated();
        if(activated && currentRoute) {
          triggerRoute(instance, currentRoute);
        }
      }),
      instance.$activated.subscribe(function(activated) {
        // activate/deactivate the router when the $activated flag is set
        if(activated) {
          // activate the router

          // set the current state as of page-load
          var location = window.history.location || window.location;
          instance[privateDataSymbol].activating = true;
          instance.pushState(location.pathname + location.search + location.hash);
          instance[privateDataSymbol].activating = false;

          // setup html5 history event listener
          if(!fw.router.disableHistory()) {
            /* istanbul ignore next */
            var popstateEvent = function () {
              var location = window.history.location || window.location;
              instance.$currentState(trimBaseRoute(instance, location.pathname + location.search + location.hash));
            };

            (function (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', popstateEvent, false);
            })(window.addEventListener ? ['addEventListener', ''] : /* istanbul ignore next */ ['attachEvent', 'on']);

            instance[privateDataSymbol].historyPopstateListener(popstateEvent);
          }

          // notify any listeners of the activation event
          instance.$namespace.trigger('activated');
        } else {
          // deactivate the router

          // dispose of the html5 history event listener
          var historyPopstateListener = instance[privateDataSymbol].historyPopstateListener();
          if (historyPopstateListener) {
            (function (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', historyPopstateListener);
            })(window.removeEventListener ? ['removeEventListener', ''] : /* istanbul ignore next */ ['detachEvent', 'on']);
          }
        }
      })
    );
  } else {
    throw Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = routerBootstrap;
