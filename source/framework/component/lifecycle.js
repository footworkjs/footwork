// framework/component/lifecycle.js
// ------------------

function runAnimationClassSequenceQueue(queue, isRunner) {
  if(!queue.running || isRunner) {
    var sequenceIteration = queue.shift();

    if(sequenceIteration) {
      sequenceIteration.addAnimationClass();

      if(sequenceIteration.nextIteration || queue.length) {
        queue.running = true;
        setTimeout(function() {
          runAnimationClassSequenceQueue(queue, true);
        }, sequenceIteration.nextIteration);
      }
    } else {
      queue.running = false;
    }
  }
}

var sequenceQueue = {};
function addToAndFetchQueue(element, viewModel) {
  var configParams = viewModel.__private('configParams');
  var sequenceTimeout = resultBound(configParams, 'sequenceAnimations', viewModel) || 0;
  var animationSequenceQueue = sequenceQueue[configParams.namespace] = (sequenceQueue[configParams.namespace] || []);
  var newSequenceIteration = {
    addAnimationClass: function addBindingFromQueue() {
      addClass(element, entityAnimateClass);
    },
    nextIteration: sequenceTimeout
  };

  animationSequenceQueue.push(newSequenceIteration);

  return animationSequenceQueue;
}

function componentTriggerAfterRender(element, viewModel) {
  if(isEntity(viewModel) && !viewModel.__private('afterRenderWasTriggered')) {
    viewModel.__private('afterRenderWasTriggered', true);

    var configParams = viewModel.__private('configParams');
    configParams.afterRender.call(viewModel, element);

    setTimeout(function() {
      runAnimationClassSequenceQueue(addToAndFetchQueue(element, viewModel));
    }, minimumAnimationDelay);
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    addClass(element, entityClass);

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if(isEntity(viewModel)) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    // if this element is not the 'loading' component of an outlet, then we need to
    // trigger the onComplete callback
    var $parent = bindingContext.$parent;
    if(isObject($parent) && isFunction($parent.route) && isFunction($parent.route.peek) && $parent.__isOutlet) {
      var parentRoute = $parent.route.peek();
      if (!includes(element.className.split(" "), outletLoadingDisplay) && isFunction(parentRoute.__getOnCompleteCallback)) {
        parentRoute.__getOnCompleteCallback(element)();
      }
    }

    componentTriggerAfterRender(element, bindingContext.$data);
  }
};

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, config, callback) {
    if(!isInternalComponent(componentName)) {
      // TODO: Handle different types of configs
      if(isString(config)) {
        config = '<!-- ko $life -->' + config + '<!-- /ko -->';
      } else {
        throw new Error('Unhandled config type ' + typeof config + '.');
      }
      fw.components.defaultLoader.loadTemplate(componentName, config, callback);
    } else {
      callback(null);
    }
  },
  loadViewModel: function(componentName, config, callback) {
    var ViewModel = config.viewModel || config;
    if(!isInternalComponent(componentName)) {
      callback(function(params, componentInfo) {
        var componentElement = componentInfo.element;
        if(isFunction(ViewModel)) {
          return new ViewModel(params);
        }
        return ViewModel;
      });
    } else {
      callback(null);
    }
  }
});
