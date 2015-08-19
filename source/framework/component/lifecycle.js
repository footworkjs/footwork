// framework/component/lifecycle.js
// ------------------

function componentTriggerAfterBinding(element, viewModel) {
  if( isEntity(viewModel) ) {
    var configParams = viewModel.__private('configParams');
    if( isFunction(configParams.afterBinding) ) {
      var afterBinding = noop;
      if(isFunction(configParams.afterBinding)) {
        afterBinding = configParams.afterBinding;
      }

      configParams.afterBinding = function(element) {
        setTimeout(function() {
          if(element.className.indexOf(bindingClassName) === -1) {
            element.className += ' ' + bindingClassName;
          }
        }, animationIteration);
        afterBinding.call(this, element);
      };

      configParams.afterBinding.call(viewModel, element);
    }
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;
    if(isString(element.className)) {
      if(element.className.indexOf(entityClassName) === -1) {
        element.className += (element.className.length ? ' ' : '') + entityClassName;
      }
    }

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if( isEntity(viewModel) ) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;
    var $parent = bindingContext.$parent;
    if( isObject($parent) && $parent.__isOutlet ) {
      $parent.$route().__getOnCompleteCallback(element)();
    }
    componentTriggerAfterBinding(element, bindingContext.$data);
  }
};

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, config, callback) {
    if( !isInternalComponent(componentName) ) {
      // TODO: Handle different types of configs
      if( isString(config) ) {
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
    if( !isInternalComponent(componentName) ) {
      callback(function(params, componentInfo) {
        var componentElement = componentInfo.element;
        var $element = (componentElement.nodeType === 8 ? (componentElement.parentElement || componentElement.parentNode) : componentElement);
        var LoadedViewModel = ViewModel;
        if( isFunction(ViewModel) ) {
          if( !isEntityCtor(ViewModel) ) {
            ViewModel = fw.viewModel({ initialize: ViewModel });
          }

          // inject the context and element into the ViewModel contructor
          LoadedViewModel = ViewModel.compose({
            _preInit: function() {
              this.$element = $element;
            }
          });
          return new LoadedViewModel(params);
        }
        return LoadedViewModel;
      });
    } else {
      callback(null);
    }
  }
});
