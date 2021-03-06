var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

var routerTools = require('./router-tools');
var registerOutlet = routerTools.registerOutlet;
var unregisterOutlet = routerTools.unregisterOutlet;
var getLocation = routerTools.getLocation;

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
    var privateData = instance[privateDataSymbol];
    instance[descriptor.isEntityDuckTag] = true;

    var previousRoute;

    _.extend(privateData, {
      registerOutlet: _.partial(registerOutlet, instance),
      unregisterOutlet: _.partial(unregisterOutlet, instance),
      outlets: {},
      configParams: _.extend(privateData.configParams, descriptor.resource.defaultConfig, configParams || {})
    });

    _.extend(instance, require('./router-methods'), {
      currentState: fw.observable(),
      currentRoute: fw.observable(),
      activated: fw.observable(false),
      routes: fw.observableArray(privateData.configParams.routes),
      outlets: fw.observable({})
    });

    instance.disposeWithInstance(
      instance.activated.subscribe(function routerActivation (activated) {
        // activate/deactivate the router when the activated flag is set
        if (activated) {
          var currentState = instance.currentState();
          if (currentState) {
            // user set the state explicitly prior to activation, lets execute it now
            instance.currentRoute(instance.getRouteForState(currentState));
          } else {
            // get the current state/route as of activation from the browser url/location
            instance.currentState(getLocation());
          }

          if (!fw.router.disableHistory) {
            (function setupPopStateListener (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', privateData.historyPopstateHandler = function popstateEventHandler (event) {
                instance.currentState(event.state);
              }, false);
            })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);
          }
        } else {
          if (privateData.historyPopstateHandler) {
            (function removePopStateListener (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', privateData.historyPopstateHandler);
            })(window.removeEventListener ? ['removeEventListener', ''] : ['detachEvent', 'on']);
          }
        }
      }),
      instance.currentState.subscribe(function evalRoute (currentState) {
        instance.currentRoute(instance.getRouteForState(currentState));
      }),
      instance.currentRoute.subscribe(function execRoute (currentRoute) {
        // Trigger the currentRoute controller whenever the currentRoute() updates
        if (currentRoute && instance.activated() && !_.isEqual(previousRoute, currentRoute)) {
          previousRoute = currentRoute;

          var state = instance.currentState();
          var route = currentRoute.route;
          var params = currentRoute.params;

          // register the callback for any defined fragment identifier found in the currentState if needed (after the route loads we need to trigger scrolling to the fragment)
          privateData.scrollToFragment = _.noop;
          if (_.isString(state) && state.indexOf('#') !== -1) {
            var fragmentIdentifier = state.split('#')[1];
            privateData.scrollToFragment = function () {
              var elementToScrollTo = document.getElementById(fragmentIdentifier);
              elementToScrollTo && _.isFunction(elementToScrollTo.scrollIntoView) && elementToScrollTo.scrollIntoView();
            };
          }

          if (currentRoute.title) {
            window.document.title = currentRoute.title;
          }

          if (privateData.alterStateMethod && !fw.router.disableHistory) {
            privateData.alterStateMethod.call(history, state, null, (currentRoute.url ? privateData.configParams.baseRoute + currentRoute.url : null));
            privateData.alterStateMethod = null;
          }

          _.isFunction(currentRoute.controller) && currentRoute.controller.call(instance, params);
        }
      })
    );
  } else {
    throw Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = routerBootstrap;
