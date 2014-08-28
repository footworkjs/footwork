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

// Preserve the original applyBindings method for later use
var originalApplyBindings = ko.applyBindings;

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all model references is returned.
var getViewModels = ko.getViewModels = function(includeOutlets) {
  return reduce( [].concat( makeNamespace().request('__model_reference', (includeOutlets ? { includeOutlets: true } : undefined)) ), function(viewModels, viewModel) {
    if( !isUndefined(viewModel) ) {
      var namespaceName = isNamespace(viewModel.$namespace) ? viewModel.$namespace.getName() : null;

      if( !isNull(namespaceName) ) {
        if( isUndefined(viewModels[namespaceName]) ) {
          viewModels[namespaceName] = viewModel;
        } else {
          if( !isArray(viewModels[namespaceName]) ) {
            viewModels[namespaceName] = [ viewModels[namespaceName] ];
          }
          viewModels[namespaceName].push(viewModel);
        }
      }
    }
    return viewModels;
  }, {});
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
      if( this.__assertPresence !== false ) {
        this.$globalNamespace.request.handler('__model_reference', bind(function(options) {
          if( !this.__isOutlet || (isObject(options) && options.includeOutlets) ) {
            return this;
          }
        }, this));
      }
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