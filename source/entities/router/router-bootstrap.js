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
var getRouteForURL = routerTools.getRouteForURL;
var triggerRoute = routerTools.triggerRoute;
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

    _.extend(privateData, {
      registerOutlet: _.partial(registerOutlet, instance),
      unregisterOutlet: _.partial(unregisterOutlet, instance),
      outlets: {},
      configParams: _.extend(privateData.configParams, descriptor.resource.defaultConfig, configParams || {})
    });

    _.extend(instance, require('./router-methods'), {
      currentState: fw.observable(),
      activated: fw.observable(false),
      routes: fw.collection(privateData.configParams.routes)
    });

    privateData.currentRoute = fw.computed(function () {
      return getRouteForURL(instance, instance.currentState());
    });

    instance.currentRoute = fw.computed(function () {
      return (privateData.currentRoute() || {}).routeConfiguration;
    });

    instance.$namespace.subscribe('pushState', _.partial(routerStateChangeCommandHandler, instance, 'push'));
    instance.$namespace.subscribe('replaceState', _.partial(routerStateChangeCommandHandler, instance, 'replace'));

    instance.disposeWithInstance(
      fw.computed(function () {
        // Automatically trigger the currentRoute controller whenever the currentRoute() updates and the router is activated
        var currentRoute = privateData.currentRoute();
        var currentState = instance.currentState();
        var activated = instance.activated();
        if (activated && currentRoute) {
          if ((currentState || '').indexOf('#') !== -1) {
            var fragmentIdentifier = currentState.split('#')[1];
            privateData.scrollToFragment = function () {
              var elementToScrollTo = document.getElementById(fragmentIdentifier);
              elementToScrollTo && elementToScrollTo.scrollIntoView();
            };
          } else {
            privateData.scrollToFragment = _.noop;
          }

          triggerRoute(instance, currentRoute);
        }
      }),
      instance.activated.subscribe(function (activated) {
        // activate/deactivate the router when the activated flag is set
        if (activated) {
          // activate the router

          // set the current state as of page-load
          privateData.activating = true;
          instance.pushState(getLocation());
          privateData.activating = false;

          // setup html5 history event listener
          /* istanbul ignore if */
          if (!fw.router.disableHistory) {
            (function (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', privateData.historyPopstateHandler = function popstateEventHandler () {
                instance.currentState(getLocation());
              }, false);
            })(window.addEventListener ? ['addEventListener', ''] : /* istanbul ignore next */ ['attachEvent', 'on']);
          }

          // notify any listeners of the activation event
          instance.$namespace.publish('activated', true);
        } else {
          // deactivate the router

          // dispose of the history popstate event listener
          /* istanbul ignore if */
          if (privateData.historyPopstateHandler) {
            (function popStateListener (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', privateData.historyPopstateHandler);
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

function routerStateChangeCommandHandler (instance, mode, state) {
  var route;
  var params;

  if (_.isObject(state)) {
    route = state.name;
    params = state.params || {};
  } else {
    route = state;
  }

  instance[mode + 'State'](route, params);
}

module.exports = routerBootstrap;
