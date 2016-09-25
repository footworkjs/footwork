// framework/component/lifecycle.js
// ------------------

function clearSequenceQueue() {
  each(sequenceQueue, function(sequence, queueNamespace) {
    each(sequence, function(sequenceIteration) {
      sequenceIteration.addAnimationClass();
    });
    delete sequenceQueue[queueNamespace];
  });
}

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
      } else {
        queue.running = false;
      }
    } else {
      queue.running = false;
    }
  }
}

var sequenceQueue = {};
function addToAndFetchQueue(element, viewModel) {
  var configParams = viewModel.__private('configParams');
  var sequenceTimeout = resultBound(configParams, 'sequenceAnimations', viewModel) || fw.settings.defaultAnimationSequence || 0;
  var animationSequenceQueue = sequenceQueue[configParams.namespace] = (sequenceQueue[configParams.namespace] || []);
  var newSequenceIteration = {
    addAnimationClass: function addBindingFromQueue() {
      nextFrame(function() {
        addClass(element, entityAnimateClass);
      });
    },
    nextIteration: sequenceTimeout
  };

  animationSequenceQueue.push(newSequenceIteration);

  return animationSequenceQueue;
}

function componentTriggerAfterRender(element, viewModel, $context) {
  if(isEntity(viewModel) && !viewModel.__private('afterRenderWasTriggered')) {
    viewModel.__private('afterRenderWasTriggered', true);

    function addAnimationClass() {
      var classList = element.className.split(" ");
      if(!includes(classList, outletLoadingDisplay) && !includes(classList, outletLoadedDisplay)) {
        var queue = addToAndFetchQueue(element, viewModel);
        var nearestOutlet = nearestEntity($context, isOutletViewModel);

        if(nearestOutlet) {
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
    (viewModel.__private('resolveFlightTracker') || noop)(addAnimationClass);
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    var classList = element.className.split(" ");
    if(!includes(classList, outletLoadingDisplay) && !includes(classList, outletLoadedDisplay)) {
      // the outlet viewModel and template binding handles its animation state
      addClass(element, entityClass);
    }

    if(isEntity(viewModel) && !viewModel.__private('element')) {
      viewModel.__private('element', element);
    }

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
    if(isObject($parent) && isObservable($parent.route) && $parent.__isOutlet) {
      var parentRoute = $parent.route.peek();
      var classList = element.className.split(" ");
      if (!includes(classList, outletLoadingDisplay) && isFunction(parentRoute.getOnCompleteCallback)) {
        parentRoute.getOnCompleteCallback(element)();
      }
    }

    componentTriggerAfterRender(element, bindingContext.$data, bindingContext);
  }
};

function cloneNodesFromTemplateSourceElement(elemInstance) {
  switch (fw.utils.tagNameLower(elemInstance)) {
    case 'script':
      return fw.utils.parseHtmlFragment(elemInstance.text);
    case 'textarea':
      return fw.utils.parseHtmlFragment(elemInstance.value);
    case 'template':
      // For browsers with proper <template> element support (i.e., where the .content property
      // gives a document fragment), use that document fragment.
      if (isDocumentFragment(elemInstance.content)) {
        return fw.utils.cloneNodes(elemInstance.content.childNodes);
      }
  }

  // Regular elements such as <div>, and <template> elements on old browsers that don't really
  // understand <template> and just treat it as a regular container
  return fw.utils.cloneNodes(elemInstance.childNodes);
}

function isDocumentFragment(obj) {
  if (window['DocumentFragment']) {
    return obj instanceof DocumentFragment;
  } else {
    return obj && obj.nodeType === 11;
  }
}

function isDomElement(obj) {
  if (window['HTMLElement']) {
    return obj instanceof HTMLElement;
  } else {
    return obj && obj.tagName && obj.nodeType === 1;
  }
}

function wrapWithLifeCycle(template) {
  var templateString = (isString(template) ? template : '');
  var wrapper = fw.utils.parseHtmlFragment('<!-- ko $life -->' + templateString + '<!-- /ko -->');

  if(templateString.length) {
    return wrapper;
  }

  return [].concat(wrapper[0], template, wrapper[1]);
}

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, templateConfig, callback) {
    if(!isInternalComponent(componentName)) {
      if (typeof templateConfig === 'string') {
        // Markup - parse it
        callback(wrapWithLifeCycle(templateConfig));
      } else if (templateConfig instanceof Array) {
        // Assume already an array of DOM nodes
        callback(wrapWithLifeCycle(templateConfig));
      } else if (isDocumentFragment(templateConfig)) {
        // Document fragment - use its child nodes
        callback(wrapWithLifeCycle(fw.utils.makeArray(templateConfig.childNodes)));
      } else if (templateConfig['element']) {
        var element = templateConfig['element'];
        if (isDomElement(element)) {
          // Element instance - copy its child nodes
          callback(wrapWithLifeCycle(cloneNodesFromTemplateSourceElement(element)));
        } else if (typeof element === 'string') {
          // Element ID - find it, then copy its child nodes
          var elemInstance = document.getElementById(element);
          if (elemInstance) {
            callback(wrapWithLifeCycle(cloneNodesFromTemplateSourceElement(elemInstance)));
          } else {
            errorCallback('Cannot find element with ID ' + element);
          }
        } else {
          errorCallback('Unknown element type: ' + element);
        }
      } else {
        errorCallback('Unknown template value: ' + templateConfig);
      }

      // fw.components.defaultLoader.loadTemplate(componentName, templateConfig, callback);
    } else {
      callback(null);
    }
  }
});
