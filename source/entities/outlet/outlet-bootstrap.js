var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

var util = require('../../misc/util');
var nextFrame = util.nextFrame;
var privateDataSymbol = util.getSymbol('footwork');

var routerConfig = require('../router/router-config');
var noComponentSelected = routerConfig.noComponentSelected;

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
    var privateData = instance[privateDataSymbol];
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped

    _.extend(privateData, {
      addResolvedCallbackOrExecute: function (callback) {
        /* istanbul ignore else */
        if (instance.routeIsResolving()) {
          resolvedCallbacks.push(callback);
        } else {
          callback();
        }
      }
    });

    var resolvedCallbacks = [];
    _.extend(instance, {
      loading: fw.observable(noComponentSelected),
      routeIsLoading: fw.observable(true),
      routeIsResolving: fw.observable(true)
    });

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

      instance[privateDataSymbol].routeOnComplete();
    }

    var transitionTriggerTimeout;

    _.extend(instance, {
      loadingStyle: fw.observable(),
      loadedStyle: fw.observable(),
      loadingClass: fw.observable(),
      loadedClass: fw.observable(),
      showLoader: function showLoader () {
        var removeAnim = removeAnimation();

        instance.loadingClass(removeAnim);
        instance.loadedClass(removeAnim);
        instance.loadedStyle(hiddenCSS);
        instance.loadingStyle(visibleCSS);

        nextFrame(function () {
          instance.loadingClass(addAnimation());
        });
      },
      showLoaded: function showLoaded () {
        clearTimeout(transitionTriggerTimeout);
        var transition = instance.display.peek().transition;
        if (transition) {
          transitionTriggerTimeout = setTimeout(showLoadedAfterMinimumTransition, transition);
        } else {
          showLoadedAfterMinimumTransition();
        }
      }
    });

    instance.disposeWithInstance(
      instance.routeIsLoading.subscribe(function disposeWithInstanceCallback (routeIsLoading) {
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
                }
              });
            } else {
              instance.routeIsResolving(false);
            }
          });
        }
      }),
      instance.routeIsResolving.subscribe(function transitionTrigger (routeIsResolving) {
        if (routeIsResolving) {
          instance.showLoader();
        } else {
          instance.showLoaded();
        }
      })
    );
  }

  return instance;
}

module.exports = outletBootstrap;
