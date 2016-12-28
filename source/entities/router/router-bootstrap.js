var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

var util = require('../../misc/util');
var resultBound = util.resultBound;
var alwaysPassPredicate = util.alwaysPassPredicate;

var routerTools = require('./router-tools');
var registerOutlet = routerTools.registerOutlet;
var unregisterOutlet = routerTools.unregisterOutlet;
var getCurrentRoute = routerTools.getCurrentRoute;
var getLocation = routerTools.getLocation;
var changeState = routerTools.changeState;
var getRouteParams = routerTools.getRouteParams;

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

    _.extend(privateData, {
      registerOutlet: _.partial(registerOutlet, instance),
      unregisterOutlet: _.partial(unregisterOutlet, instance),
      outlets: {},
      configParams: _.extend(privateData.configParams, descriptor.resource.defaultConfig, configParams || {})
    });

    _.extend(instance, require('./router-methods'), {
      currentState: fw.observable(),
      activated: fw.observable(false),
      routes: fw.observableArray(privateData.configParams.routes)
    });

    instance.currentRoute = fw.computed(function () {
      return getCurrentRoute(instance, instance.currentState());
    });

    var previousRoute;
    var previousRouteParams;
    instance.disposeWithInstance(
      instance.activated.subscribe(function (activated) {
        // activate/deactivate the router when the activated flag is set
        if (activated) {
          // activate the router
          // set the current state/route as of page-load
          changeState(instance, null, getLocation());

          /* istanbul ignore if */
          if (!fw.router.disableHistory) {
            (function setupPopStateListener (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', privateData.historyPopstateHandler = function popstateEventHandler () {
                instance.currentState(getLocation());
              }, false);
            })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);
          }

          // notify any listeners of the activation event
          instance.$namespace.publish('activated', true);
        } else {
          // deactivate the router
          /* istanbul ignore if */
          if (privateData.historyPopstateHandler) {
            (function removePopStateListener (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', privateData.historyPopstateHandler);
            })(window.removeEventListener ? ['removeEventListener', ''] : ['detachEvent', 'on']);
          }
        }
      }),
      instance.currentRoute.subscribe(function (currentRoute) {
        // Trigger the currentRoute controller whenever the currentRoute() updates
        var currentState = instance.currentState() || '';
        var routeParams = getRouteParams(currentRoute, currentState);

        if (instance.activated() && currentRoute && (previousRoute !== currentRoute || !_.isEqual(previousRouteParams, routeParams))) {
          previousRouteParams = routeParams;
          previousRoute = currentRoute;

          if (currentState.indexOf('#') !== -1) {
            var fragmentIdentifier = currentState.split('#')[1];
            privateData.scrollToFragment = function () {
              var elementToScrollTo = document.getElementById(fragmentIdentifier);
              elementToScrollTo && _.isFunction(elementToScrollTo.scrollIntoView) && elementToScrollTo.scrollIntoView();
            };
          } else {
            privateData.scrollToFragment = _.noop;
          }

          // set the title and trigger the controller
          if (currentRoute.title) {
            window.document.title = resultBound(currentRoute, 'title', instance);
          }
          currentRoute.controller.call(instance, routeParams);
        }
      })
    );
  } else {
    throw Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = routerBootstrap;
