var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var sequencing = require('./sequencing');
var addToAndFetchQueue = sequencing.addToAndFetchQueue;
var runAnimationClassSequenceQueue = sequencing.runAnimationClassSequenceQueue;

var entityTools = require('../entities/entity-tools');
var nearestEntity = entityTools.nearestEntity;
var isEntity = entityTools.isEntity;

var routerDefaults = require('../entities/router/router-defaults');
var outletLoadedDisplay = routerDefaults.outletLoadedDisplay;
var outletLoadingDisplay = routerDefaults.outletLoadingDisplay;
var isOutletViewModel = require('../entities/router/router-tools').isOutletViewModel;

var util = require('../misc/util');
var addClass = util.addClass;
var hasClass = util.hasClass;
var isPromise = util.isPromise;
var promiseIsFulfilled = util.promiseIsFulfilled;

var config = require('../misc/config');
var entityClass = config.entityClass;
var privateDataSymbol = config.privateDataSymbol;

/**
 * Mark the component as resolved on the parent outlet (if it exists) and supply the resolveThisEntityNow callback which
 * takes the user supplied isResolved value and adds the animation class via addAnimationClass when it has resolved.
 *
 * @param {DOMElement} element
 * @param {object} viewModel
 * @param {object} $context
 * @param {function} addAnimationClass
 */
function resolveComponent(element, viewModel, $context, addAnimationClass) {
  var flightTracker = element.flightTracker;
  var parentInFlightChildren;

  var parentEntity = nearestEntity($context);
  if (parentEntity) {
    parentInFlightChildren = parentEntity[privateDataSymbol].inFlightChildren;
  }

  function finishResolution() {
    addAnimationClass();
    if (fw.isObservable(parentInFlightChildren) && _.isFunction(parentInFlightChildren.remove)) {
      parentInFlightChildren.remove(flightTracker);
    }
  }

  if (isEntity(viewModel)) {
    var wasResolved = false;
    function resolveInstanceNow(isResolved) {
      if (!wasResolved) {
        wasResolved = true;
        if (isResolved === true) {
          finishResolution();
        } else if (isPromise(isResolved) || _.isArray(isResolved)) {
          if(!_.every(isResolved, isPromise)) {
            throw new Error('Can only pass array of promises to resolved()');
          }

          var promises = [].concat(isResolved);
          var checkPromise = function(promise) {
            promise.then(function() {
              if (_.every(promises, promiseIsFulfilled)) {
                finishResolution();
              }
            });
          };

          _.each(promises, checkPromise);
        }
      }
    }

    function maybeResolve() {
      viewModel[privateDataSymbol].configParams.afterResolving.call(viewModel, resolveInstanceNow);
    }

    var inFlightChildren = viewModel[privateDataSymbol].inFlightChildren;
    // if no children then resolve now, otherwise subscribe and wait till its 0
    if (inFlightChildren().length === 0) {
      maybeResolve();
    } else {
      viewModel.disposeWithInstance(inFlightChildren.subscribe(function(inFlightChildren) {
        inFlightChildren.length === 0 && maybeResolve();
      }));
    }
  } else {
    finishResolution();
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    if (!hasClass(element, outletLoadingDisplay) && !hasClass(element, outletLoadedDisplay)) {
      // the outlet viewModel and template binding handles its animation state
      addClass(element, entityClass);
    }

    if (isEntity(viewModel)) {
      if(!viewModel[privateDataSymbol].element) {
        viewModel[privateDataSymbol].element = element;
        fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
          viewModel.dispose();
        });
      }
    }
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    // if this element is not the 'loading' component of an outlet, then we need to
    // trigger the onComplete callback
    if (isOutletViewModel(bindingContext.$parent)) {
      var parentRoute = bindingContext.$parent.route.peek();
      var classList = element.className.split(" ");
      if (!_.includes(classList, outletLoadingDisplay) && _.isFunction(parentRoute.getOnCompleteCallback)) {
        parentRoute.getOnCompleteCallback(element)();
      }
    }

    if (isEntity(viewModel) && !viewModel[privateDataSymbol].afterRenderWasTriggered) {
      viewModel[privateDataSymbol].afterRenderWasTriggered = true;

      // trigger the user-specified afterRender callback
      viewModel[privateDataSymbol].configParams.afterRender.call(viewModel, element);
    }

    // resolve the flight tracker and trigger the addAnimationClass callback when appropriate
    resolveComponent(element, viewModel, bindingContext, function addAnimationClass() {
      if (!hasClass(element, outletLoadingDisplay) && !hasClass(element, outletLoadedDisplay)) {
        var queue = addToAndFetchQueue(element, viewModel);
        var nearestOutlet = nearestEntity(bindingContext, isOutletViewModel);

        if (nearestOutlet) {
          // the parent outlet will run the callback that initiates the animation
          // sequence (once the rest of its dependencies finish loading as well)
          nearestOutlet.addResolvedCallbackOrExecute(function() {
            runAnimationClassSequenceQueue(queue);
          });
        } else {
          // no parent outlet found, lets go ahead and run the queue
          runAnimationClassSequenceQueue(queue);
        }
      }
    });
  }
};
