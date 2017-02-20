var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var noComponentSelected = require('../router/router-config').noComponentSelected;

var outletTools = require('./outlet-tools');
var visibleCSS = outletTools.visibleCSS;
var hiddenCSS = outletTools.hiddenCSS;
var addAnimation = outletTools.addAnimation;
var removeAnimation = outletTools.removeAnimation;

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
    var transitionTriggerTimeout;
    var transitionCompleted = fw.observable(true);
    var readyToShowDisplay = fw.observable(false);

    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped

    _.extend(privateData, {
      addResolvedCallbackOrExecute: function addResolvedCallbackOrExecute (callback) {
        /* istanbul ignore else */
        if (privateData.outletIsChanging()) {
          resolvedCallbacks.push(callback);
        } else {
          callback();
        }
      },
      outletIsChanging: fw.observable()
    });

    var resolvedCallbacks = [];
    _.extend(instance, {
      loading: fw.observable(noComponentSelected)
    });

    function setupTransitionTrigger () {
      var transition = instance.display().transition;
      if (transition) {
        clearTimeout(transitionTriggerTimeout);
        transitionTriggerTimeout = setTimeout(function () {
          transitionCompleted(true);
        }, transition);
      } else {
        transitionCompleted(true);
      }
    }

    function showDisplayNow () {
      instance.loadingClass(removeAnimation());
      instance.displayStyle(visibleCSS);
      instance.loadingStyle(hiddenCSS);
      instance.displayClass(addAnimation());

      if (resolvedCallbacks.length) {
        _.each(resolvedCallbacks, function (callback) {
          callback();
        });
        resolvedCallbacks = [];
      }

      privateData.outletOnComplete();
    }

    _.extend(instance, {
      loadingStyle: fw.observable(),
      displayStyle: fw.observable(),
      loadingClass: fw.observable(),
      displayClass: fw.observable(),
      showLoading: function showLoading () {
        var removeAnim = removeAnimation();

        instance.loadingClass(removeAnim);
        instance.displayClass(removeAnim);
        instance.displayStyle(hiddenCSS);
        instance.loadingStyle(visibleCSS);

        transitionCompleted(false);
        readyToShowDisplay(false);

        setupTransitionTrigger();
        setTimeout(function () {
          instance.loadingClass(addAnimation());
        }, 0);
      },
      showDisplay: function showDisplay () {
        readyToShowDisplay(true);
      }
    });

    instance.disposeWithInstance(
      fw.computed(function evalShowDisplay () {
        if (transitionCompleted() && readyToShowDisplay()) {
          showDisplayNow();
        }
      }),
      privateData.outletIsChanging.subscribe(function outletChangeTrigger (outletIsChanging) {
        if (outletIsChanging) {
          instance.showLoading();
        } else {
          // wait a tic to ensure that all children begin binding prior to checking that they are all loaded (or that there are none)
          setTimeout(function () {
            /* istanbul ignore if */
            if (privateData.loadingChildren().length) {
              if (privateData.loadingChildrenWatch && _.isFunction(privateData.loadingChildrenWatch.dispose)) {
                privateData.loadingChildrenWatch.dispose();
              }

              privateData.loadingChildrenWatch = privateData.loadingChildren.subscribe(function (loadingChildren) {
                if (!loadingChildren.length) {
                  instance.showDisplay();
                }
              });
            } else {
              instance.showDisplay();
            }
          }, 20);
        }
      })
    );
  }

  return instance;
}

module.exports = outletBootstrap;
