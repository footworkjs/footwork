var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var animationSequencing = require('./animation-sequencing');
var addToAndFetchQueue = animationSequencing.addToAndFetchQueue;
var runAnimationSequenceQueue = animationSequencing.runAnimationSequenceQueue;

var entityTools = require('../entities/entity-tools');
var nearestEntity = entityTools.nearestEntity;
var isEntity = entityTools.isEntity;
var isRouter = entityTools.isRouter;

var routerDefaults = require('../entities/router/router-defaults');
var outletLoadedDisplay = routerDefaults.outletLoadedDisplay;
var outletLoadingDisplay = routerDefaults.outletLoadingDisplay;

var util = require('../misc/util');
var addClass = util.addClass;
var hasClass = util.hasClass;
var isPromise = util.isPromise;
var promiseIsFulfilled = util.promiseIsFulfilled;
var getSymbol = util.getSymbol;

var config = require('../misc/config');
var entityClass = config.entityClass;
var privateDataSymbol = config.privateDataSymbol;

var makePromiseQueryable = require('../misc/ajax').makePromiseQueryable;

/**
 * The $lifecycle binding provides lifecycle events for components/viewModels/dataModels/routers
 */
fw.virtualElements.allowedBindings.$lifecycle = true;
fw.bindingHandlers.$lifecycle = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentNode;

    if (!hasClass(element, outletLoadingDisplay) && !hasClass(element, outletLoadedDisplay)) {
      // the outlet viewModel and template binding handles its animation state
      addClass(element, entityClass);
    }

    // if this is a router and its configured to do so, activate it now that its being bound
    if (fw.isRouter(viewModel) && viewModel[privateDataSymbol].configParams.activate) {
      viewModel.activate();
    }

    if (fw.isViewModel(viewModel)) {
      // provide the element for when onDispose is called
      viewModel[privateDataSymbol].element = element;

      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel.dispose();
      });
    }
  },
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentNode;

    // if this is the lifecycle update on an outlets display we need to run its callback
    if (hasClass(element, outletLoadedDisplay)) {
      var outletDisplay = bindingContext.$parent.display.peek();
      if (!hasClass(element, outletLoadingDisplay) && _.isFunction(outletDisplay.getOnCompleteCallback)) {
        var outletLoadingIsCompleted = outletDisplay.getOnCompleteCallback(element);
        outletLoadingIsCompleted();
      }
    }

    // trigger the user-specified afterRender callback
    if (isEntity(viewModel) && !viewModel[privateDataSymbol].afterRenderWasTriggered) {
      viewModel[privateDataSymbol].afterRenderWasTriggered = true;
      viewModel[privateDataSymbol].configParams.afterRender.call(viewModel, element);
    }

    // resolve the loadingTracker and trigger the addAnimationClass callback when appropriate
    resolveTrackerAndAnimate(element, viewModel, bindingContext, function addAnimationClass () {
      if (document.body.contains(element) && !hasClass(element, outletLoadingDisplay) && !hasClass(element, outletLoadedDisplay)) {
        var queue = addToAndFetchQueue(element, viewModel);
        var nearestOutlet = nearestEntity(bindingContext, fw.isOutlet);

        if (nearestOutlet) {
          // the parent outlet will run the callback that initiates the animation
          // sequence (once the rest of its dependencies finish loading as well)
          nearestOutlet.addResolvedCallbackOrExecute(function () {
            runAnimationSequenceQueue(queue);
          });
        } else {
          // no parent outlet found, lets go ahead and run the queue
          runAnimationSequenceQueue(queue);
        }
      }
    });
  }
};

/**
 * Mark the element/tracker as resolved on the parent entity (if it exists) and supply the resolveInstanceNow callback to afterResolving which
 * takes the user supplied isResolved value and adds the animation class via addAnimationClass when it has resolved.
 *
 * @param {DOMElement} element
 * @param {object} viewModel
 * @param {object} $context
 * @param {function} addAnimationClass
 */
function resolveTrackerAndAnimate (element, viewModel, $context, addAnimationClass) {
  var loadingTracker = element[getSymbol('loadingTracker')];
  var loadingParentChildren;

  var parentEntity = nearestEntity($context.$parentContext);
  if (parentEntity) {
    loadingParentChildren = parentEntity[privateDataSymbol].loadingChildren;
  }

 function finishResolution () {
    addAnimationClass();
    if (fw.isObservable(loadingParentChildren) && _.isFunction(loadingParentChildren.remove)) {
      loadingParentChildren.remove(loadingTracker);
    }
  }

  if (isEntity(viewModel)) {
    var wasResolved = false;
    function resolveInstanceNow (isResolved) {
      if (!wasResolved) {
        wasResolved = true;
        if (isResolved === true) {
          finishResolution();
        } else if (isPromise(isResolved) || _.isArray(isResolved)) {
          if (!_.every([].concat(isResolved), isPromise)) {
            throw new Error('Can only pass array of promises to resolved()');
          }

          var promises = _.map([].concat(isResolved), makePromiseQueryable);
          var checkPromise = function (promise) {
            promise.then(function () {
              if (_.every(promises, promiseIsFulfilled)) {
                finishResolution();
              }
            });
          };

          _.each(promises, checkPromise);
        }
      }
    }

   function maybeResolve () {
      viewModel[privateDataSymbol].configParams.afterResolving.call(viewModel, resolveInstanceNow);
    }

    // have to delay child check for one tick to let sub-components/entities begin binding
    setTimeout(function() {
      var loadingChildren = viewModel[privateDataSymbol].loadingChildren;

      // if there are no children then resolve now, otherwise subscribe and wait till its 0 (all children resolved)
      if (loadingChildren().length === 0) {
        maybeResolve();
      } else {
        viewModel.disposeWithInstance(loadingChildren.subscribe(function (loadingChildren) {
          loadingChildren.length === 0 && maybeResolve();
        }));
      }
    }, 0);
  } else {
    finishResolution();
  }
}
