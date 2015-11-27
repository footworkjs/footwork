// framework/component/lifecycle.js
// ------------------

function componentTriggerafterRender(element, viewModel) {
  if(isEntity(viewModel) && !viewModel.__private('afterRenderWasTriggered')) {
    viewModel.__private('afterRenderWasTriggered', true);
    var configParams = viewModel.__private('configParams');
    if(isFunction(configParams.afterRender)) {
      var afterRender = noop;
      if(isFunction(configParams.afterRender)) {
        afterRender = configParams.afterRender;
      }

      configParams.afterRender = function(element) {
        setTimeout(function() {
          if(element.className.indexOf(bindingClassName) === -1) {
            element.className += ' ' + bindingClassName;
          }
        }, animationIteration);
        afterRender.call(this, element);
      };

      configParams.afterRender.call(viewModel, element);
    }
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;
    addClass(element, entityClassName);

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if(isEntity(viewModel)) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;
    var $parent = bindingContext.$parent;
    if(isObject($parent) && $parent.__isOutlet && isFunction($parent.$route().__getOnCompleteCallback)) {
      $parent.$route().__getOnCompleteCallback(element)();
    }
    componentTriggerafterRender(element, bindingContext.$data);
  }
};

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, config, callback) {
    if(!isInternalComponent(componentName)) {
      // TODO: Handle different types of configs
      if(isString(config) ) {
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
