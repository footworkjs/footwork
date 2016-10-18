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

var addClass = require('../misc/util').addClass;
var entityClass = require('../misc/config').entityClass;

function componentTriggerAfterRender(element, viewModel, $context) {
  if (isEntity(viewModel) && !viewModel.__private('afterRenderWasTriggered')) {
    viewModel.__private('afterRenderWasTriggered', true);

    function addAnimationClass() {
      var classList = element.className.split(" ");
      if (!_.includes(classList, outletLoadingDisplay) && !_.includes(classList, outletLoadedDisplay)) {
        var queue = addToAndFetchQueue(element, viewModel);
        var nearestOutlet = nearestEntity($context, isOutletViewModel);

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
    }

    // trigger the user-specified afterRender callback
    viewModel.__private('configParams').afterRender.call(viewModel, element);

    // resolve the flight tracker and trigger the addAnimationClass callback when appropriate
    (viewModel.__private('resolveFlightTracker') || _.noop)(addAnimationClass);
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    var classList = element.className.split(" ");
    if (!_.includes(classList, outletLoadingDisplay) && !_.includes(classList, outletLoadedDisplay)) {
      // the outlet viewModel and template binding handles its animation state
      addClass(element, entityClass);
    }

    if (isEntity(viewModel) && !viewModel.__private('element')) {
      viewModel.__private('element', element);
    }

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if (isEntity(viewModel)) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    // if this element is not the 'loading' component of an outlet, then we need to
    // trigger the onComplete callback
    var $parent = bindingContext.$parent;
    if (_.isObject($parent) && fw.isObservable($parent.route) && $parent.__isOutlet) {
      var parentRoute = $parent.route.peek();
      var classList = element.className.split(" ");
      if (!_.includes(classList, outletLoadingDisplay) && _.isFunction(parentRoute.getOnCompleteCallback)) {
        parentRoute.getOnCompleteCallback(element)();
      }
    }

    componentTriggerAfterRender(element, bindingContext.$data, bindingContext);
  }
};
