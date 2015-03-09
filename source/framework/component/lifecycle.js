// framework/component/lifecycle.js
// ------------------

// Components which footwork will not wrap in the $life custom binding used for lifecycle events
// Used to keep the wrapper off of internal/natively handled and defined components such as 'outlet'
var nativeComponents = [
  'outlet'
];
function isNativeComponent(componentName) {
  return indexOf(nativeComponents, componentName) !== -1;
}

function componentTriggerAfterBinding(element, viewModel) {
  if( isViewModel(viewModel) ) {
    var configParams = viewModel.__getConfigParams();
    if( isFunction(configParams.afterBinding) ) {
      configParams.afterBinding.call(viewModel, element);
    }
  }
}

var componentLifecycleWrapperTemplate = '<!-- ko $life -->COMPONENT_MARKUP<!-- /ko -->';

// Use the $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if( isViewModel(viewModel) ) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var $parent = bindingContext.$parent;
    if( isObject($parent) && $parent.__isOutlet ) {
      $parent.$route().__getOnCompleteCallback()(element.parentElement || element.parentNode);
    }
    componentTriggerAfterBinding(element.parentElement || element.parentNode, bindingContext.$data);
  }
};

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, config, callback) {
    if( !isNativeComponent(componentName) ) {
      // TODO: Handle different types of configs
      if( isString(config) ) {
        config = componentLifecycleWrapperTemplate.replace(/COMPONENT_MARKUP/, config);
      } else {
        throw 'Unhandled config type ' + typeof config + '.';
      }
      fw.components.defaultLoader.loadTemplate(componentName, config, callback);
    } else {
      callback(null);
    }
  },
  loadViewModel: function(componentName, config, callback) {
    var ViewModel = config.viewModel || config;
    if( !isNativeComponent(componentName) ) {
      callback(function(params, componentInfo) {
        var componentElement = componentInfo.element;
        var $element = (componentElement.nodeType === 8 ? (componentElement.parentElement || componentElement.parentNode) : componentElement);
        var $context = fw.contextFor($element);
        var LoadedViewModel = ViewModel;
        if( isFunction(ViewModel) ) {
          if( !isViewModelCtor(ViewModel) ) {
            ViewModel = fw.viewModel({ initialize: ViewModel });
          }

          // inject the context and element into the ViewModel contructor
          LoadedViewModel = ViewModel.compose({
            _preInit: function() {
              this.$context = $context;
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
