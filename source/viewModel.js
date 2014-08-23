// viewModel.js
// ------------------

// Duck type function for determining whether or not something is a footwork viewModel constructor function
function isViewModelCtor(thing) {
  return isFunction(thing) && !!thing.__isViewModelCtor;
}

// Duck type function for determining whether or not something is a footwork viewModel
function isViewModel(thing) {
  return isObject(thing) && !!thing.__isViewModel;
}

// Initialize the viewModels registry
var viewModels = {};

// Preserve the original applyBindings method for later use
var originalApplyBindings = ko.applyBindings;

// Returns the number of created viewModels for each defined namespace
var viewModelCount = ko.viewModelCount = function() {
  var counts = reduce(namespaceNameCounter, function(viewModelCounts, viewModelCount, viewModelName) {
    viewModelCounts[viewModelName] = viewModelCount + 1;
    return viewModelCounts;
  }, {});
  counts.__total = reduce(_.values(counts), function(summation, num) {
    return summation + num;
  }, 0);
  return counts;
};

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all model references is returned.
var getViewModels = ko.getViewModels = function(namespaceName) {
  if( isUndefined(namespaceName) ) {
    return viewModels;
  }
  return viewModels[namespaceName];
};

// Tell all viewModels to request the values which it listens for
var refreshModels = ko.refreshViewModels = function() {
  invoke(getViewModels(), 'refreshReceived');
};

var defaultViewModelConfigParams = {
  namespace: undefined,
  name: undefined,
  componentNamespace: undefined,
  autoIncrement: false,
  mixins: undefined,
  params: undefined,
  initialize: noop,
  afterInit: noop,
  afterBinding: noop,
  afterDispose: noop
};
var makeViewModel = ko.viewModel = function(configParams) {
  var ctor = noop;
  var afterInit = noop;

  configParams = configParams || {};
  if( !isUndefined(configParams) ) {
    ctor = configParams.viewModel || configParams.initialize || noop;
    afterInit = configParams.afterInit || noop;
  }
  afterInit = { _postInit: afterInit };
  configParams = extend({}, defaultViewModelConfigParams, configParams);

  var originalAfterBinding = configParams.afterBinding;
  configParams.afterBinding = function() {
    if( configParams.afterBinding.wasCalled !== true ) {
      originalAfterBinding.apply(this, arguments);
      configParams.afterBinding.wasCalled = true;
    }
  };
  configParams.afterBinding.wasCalled = false;

  var initViewModelMixin = {
    _preInit: function( initParams ) {
      this.__isViewModel = true;
      this.$params = configParams.params;

      if( isObject(configParams.router) ) {
        this.$router = new Router( configParams.router, this );
      }
      
      this.__getConfigParams = function() {
        return configParams;
      };
      this.__getInitParams = function() {
        return initParams;
      };
      this.__shutdown = function() {
        if( isFunction(configParams.afterDispose) ) {
          configParams.afterDispose.call(this);
        }

        each(this, function( property ) {
          if( isNamespace(property) || isRouter(property) ) {
            property.shutdown();
          }
        });

        if( isFunction(configParams.afterBinding) ) {
          configParams.afterBinding.wasCalled = false;
        }
      };
    },
    _postInit: function() {
      this.$globalNamespace.request.handler('__footwork_model_reference', function() {
        return this;
      });
    }
  };

  var composure = [ ctor, initViewModelMixin ].concat( viewModelMixins, afterInit );
  if( !isUndefined(configParams.mixins) ) {
    composure = composure.concat(configParams.mixins);
  }

  var model = riveter.compose.apply( undefined, composure );
  model.__isViewModelCtor = true;
  model.__configParams = configParams;

  return model;
};

// Override the original applyBindings method to provide 'viewModel' life-cycle hooks/events and to provide the $context to the $router if present.
var doNotSetContextOnRouter = false;
var setContextOnRouter = true;
var applyBindings = ko.applyBindings = function(viewModel, element, shouldSetContext) {
  originalApplyBindings(viewModel, element);
  shouldSetContext = isUndefined(shouldSetContext) ? setContextOnRouter : shouldSetContext;

  if( isViewModel(viewModel) ) {
    var $configParams = viewModel.__getConfigParams();
    
    if( isFunction($configParams.afterBinding) ) {
      $configParams.afterBinding.call(viewModel, element);
    }

    if( shouldSetContext === setContextOnRouter && isRouter( viewModel.$router ) ) {
      viewModel.$router.context( ko.contextFor(element) );
    }
    
    if( !isUndefined(element) ) {
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        viewModel.__shutdown();
      });
    }
  }
};

// Monkey patch enables the viewModel 'component' to initialize a model and bind to the html as intended (with lifecycle events)
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = ko.bindingHandlers.component.init;
ko.bindingHandlers.component.init = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
  var theValueAccessor = valueAccessor;
  if( isString(element.tagName) ) {
    var tagName = element.tagName.toLowerCase();
    if( tagName === 'viewmodel' ) {
      var values = valueAccessor();
      var name = element.getAttribute('module') || element.getAttribute('data-module');

      if( !isUndefined(name) ) {
        var viewModelName = ko.unwrap(values.params.name);
        var resourceLocation = getResourceLocation( viewModelName ).viewModels;

        if( isFunction(require) && isFunction(require.defined) && require.defined(viewModelName) ) {
          // we have found a matching resource that is already cached by require, lets use it
          resourceLocation = viewModelName;
        }

        var bindViewModel = function(ViewModel) {
          var viewModelObj;
          if( isFunction(ViewModel) ) {
            viewModelObj = new ViewModel(values.params);
          } else {
            viewModelObj = ViewModel;
          }

          // binding the viewModelObj onto each child element is not ideal, need to do this differently
          // cannot get component.preprocess() method to work/be called for some reason
          each(element.children, function(child) {
            applyBindings(viewModelObj, child, doNotSetContextOnRouter);
          });

          // we told applyBindings not to specify a context on the viewModel.$router after binding because we are binding to each
          // sub-element and must specify the context as being the container element only once
          if( isRouter(viewModelObj.$router) ) {
            viewModelObj.$router.context( ko.contextFor(element) );
          }
        };

        if( isString(resourceLocation) ) {
          if( isFunction(require) ) {
            if( isPath(resourceLocation) ) {
              resourceLocation = resourceLocation + name;
            }
            if( resourceLocation !== viewModelName && endsInDotJS.test(resourceLocation) === false ) {
              resourceLocation = resourceLocation + resourceFileExtensions.viewModel;
            }

            require([ resourceLocation ], bindViewModel);
          } else {
            throw 'Uses require, but no AMD loader is present';
          }
        } else if( isFunction(resourceLocation) ) {
          bindViewModel( resourceLocation );
        } else if( isObject(resourceLocation) ) {
          if( isObject(resourceLocation.instance) ) {
            bindViewModel( resourceLocation.instance );
          } else if( isFunction(resourceLocation.createViewModel) ) {
            bindViewModel( resourceLocation.createViewModel( values.params, { element: element } ) );
          }
        }
      }

      return { 'controlsDescendantBindings': true };
    } else if( tagName === 'outlet' ) {
      // we patch in the 'name' of the outlet into the params valueAccessor on the component definition (if necessary and available)
      var outletName = element.getAttribute('name') || element.getAttribute('data-name');
      if( outletName ) {
        theValueAccessor = function() {
          var valueAccessorResult = valueAccessor();
          if( !isUndefined(valueAccessorResult.params) && isUndefined(valueAccessorResult.params.name) ) {
            valueAccessorResult.params.name = outletName;
          }
          return valueAccessorResult;
        };
      }
    }
  }

  return originalComponentInit(element, theValueAccessor, allBindings, viewModel, bindingContext);
};