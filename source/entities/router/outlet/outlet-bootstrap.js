var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var instanceRequestHandler = require('../../entity-tools').instanceRequestHandler;
var entityDescriptors = require('../../entity-descriptors');
var viewModelBootstrap = require('../../viewModel/viewModel-bootstrap');
var nextFrame = require('../../../misc/util').nextFrame;

var config = require('../../../misc/config');
var privateDataSymbol = config.privateDataSymbol;
var entityAnimateClass = config.entityAnimateClass;

var routerDefaults = require('../../router/router-defaults');
var nullComponent = routerDefaults.nullComponent;

var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };
var removeAnimation = {};
removeAnimation[entityAnimateClass] = false;
var addAnimation = {};
addAnimation[entityAnimateClass] = true;

/**
 * Bootstrap an instance with outlet capabilities.
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function outletBootstrap (instance, configParams) {
  /* istanbul ignore if */
  if (!instance) {
    throw Error('Must supply the instance to boot()');
  }

  var descriptor = entityDescriptors.getDescriptor('outlet');

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, descriptor);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped

    instance.loadingDisplay = fw.observable(nullComponent);
    instance.routeIsLoading = fw.observable(true);
    instance.routeIsResolving = fw.observable(true);

    var resolvedCallbacks = [];
    instance.addResolvedCallbackOrExecute = function(callback) {
      if (instance.routeIsResolving()) {
        resolvedCallbacks.push(callback);
      } else {
        callback();
      }
    };

    instance.disposeWithInstance(instance.routeIsLoading.subscribe(function(routeIsLoading) {
      if (routeIsLoading) {
        instance.routeIsResolving(true);
      } else {
        /* istanbul ignore next */
        if (instance.loadingChildrenWatch && _.isFunction(instance.loadingChildrenWatch.dispose)) {
          instance.loadingChildrenWatch.dispose();
        }

        // must allow binding to begin on any subcomponents/etc
        nextFrame(function() {
          if (instance[privateDataSymbol].loadingChildren().length) {
            /* istanbul ignore next */
            instance.loadingChildrenWatch = instance[privateDataSymbol].loadingChildren.subscribe(function(loadingChildren) {
              if (!loadingChildren.length) {
                instance.routeIsResolving(false);
                _.isFunction(instance.routeOnComplete) && instance.routeOnComplete();
              }
            });
          } else {
            instance.routeIsResolving(false);
            _.isFunction(instance.routeOnComplete) && instance.routeOnComplete();
          }
        });
      }
    }));

    instance.loadingStyle = fw.observable();
    instance.loadedStyle = fw.observable();
    instance.loadingClass = fw.observable();
    instance.loadedClass = fw.observable();

    function showLoader () {
      instance.loadingClass(removeAnimation);
      instance.loadedClass(removeAnimation);
      instance.loadedStyle(hiddenCSS);
      instance.loadingStyle(visibleCSS);

      nextFrame(function() {
        instance.loadingClass(addAnimation);
      });
    }

    function showLoadedAfterMinimumTransition () {
      instance.loadingClass(removeAnimation);
      instance.loadedStyle(visibleCSS);
      instance.loadingStyle(hiddenCSS);
      instance.loadedClass(addAnimation);

      if (resolvedCallbacks.length) {
        _.each(resolvedCallbacks, function(callback) {
          callback();
        });
        resolvedCallbacks = [];
      }
    }

    var transitionTriggerTimeout;
    function showLoaded () {
      clearTimeout(transitionTriggerTimeout);
      var minTransitionPeriod = instance.display.peek().minTransitionPeriod;
      if (minTransitionPeriod) {
        transitionTriggerTimeout = setTimeout(showLoadedAfterMinimumTransition, minTransitionPeriod);
      } else {
        showLoadedAfterMinimumTransition();
      }
    }

    instance.showLoader = showLoader;
    instance.showLoaded = showLoaded;

    instance.transitionTrigger = fw.computed(function() {
      var routeIsResolving = instance.routeIsResolving();
      if (routeIsResolving) {
        showLoader();
      } else {
        showLoaded();
      }
    });
  } else {
    /* istanbul ignore next */
    throw Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = outletBootstrap;
