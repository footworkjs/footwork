var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

var util = require('../../misc/util');
var nextFrame = util.nextFrame;
var privateDataSymbol = util.getSymbol('footwork');

var routerDefaults = require('../router/router-defaults');
var noComponentSelected = routerDefaults.noComponentSelected;

var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };


function addAnimation () {
  var addAnimation = {};
  addAnimation[fw.animationClass.animateIn] = true;
  return addAnimation;
}

function removeAnimation () {
  var removeAnimation = {};
  removeAnimation[fw.animationClass.animateIn] = false;
  return removeAnimation;
}

/**
 * Bootstrap an instance with outlet capabilities.
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function outletBootstrap (instance, configParams) {
  var descriptor = entityDescriptors.getDescriptor('outlet');

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, descriptor);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped

    var resolvedCallbacks = [];
    _.extend(instance, {
      loadingDisplay: fw.observable(noComponentSelected),
      routeIsLoading: fw.observable(true),
      routeIsResolving: fw.observable(true),
      addResolvedCallbackOrExecute: function (callback) {
        /* istanbul ignore else */
        if (instance.routeIsResolving()) {
          resolvedCallbacks.push(callback);
        } else {
          callback();
        }
      }
    });

    function showLoader () {
      var removeAnim = removeAnimation();

      instance.loadingClass(removeAnim);
      instance.loadedClass(removeAnim);
      instance.loadedStyle(hiddenCSS);
      instance.loadingStyle(visibleCSS);

      nextFrame(function () {
        instance.loadingClass(addAnimation());
      });
    }

    function showLoadedAfterMinimumTransition () {
      instance.loadingClass(removeAnimation());
      instance.loadedStyle(visibleCSS);
      instance.loadingStyle(hiddenCSS);
      instance.loadedClass(addAnimation());

      if (resolvedCallbacks.length) {
        _.each(resolvedCallbacks, function (callback) {
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

    _.extend(instance, {
      loadingStyle: fw.observable(),
      loadedStyle: fw.observable(),
      loadingClass: fw.observable(),
      loadedClass: fw.observable(),
      showLoader: showLoader,
      showLoaded: showLoaded
    });

    instance.transitionTrigger = fw.computed(function () {
      var routeIsResolving = instance.routeIsResolving();
      if (routeIsResolving) {
        showLoader();
      } else {
        showLoaded();
      }
    });

    instance.disposeWithInstance(instance.routeIsLoading.subscribe(function disposeWithInstanceCallback (routeIsLoading) {
      if (routeIsLoading) {
        instance.routeIsResolving(true);
      } else {
        /* istanbul ignore next */
        if (instance.loadingChildrenWatch && _.isFunction(instance.loadingChildrenWatch.dispose)) {
          instance.loadingChildrenWatch.dispose();
        }

        // must allow binding to begin on any subcomponents/etc
        nextFrame(function () {
          if (instance[privateDataSymbol].loadingChildren().length) {
            /* istanbul ignore next */
            instance.loadingChildrenWatch = instance[privateDataSymbol].loadingChildren.subscribe(function (loadingChildren) {
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
  }

  return instance;
}

module.exports = outletBootstrap;
