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

var defaultGetViewModelOptions = {
  includeOutlets: false
};

fw.viewModels = {};

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all model references is returned.
var getViewModels = fw.viewModels.getAll = function(namespaceName, options) {
  options = options || {};
  if( isString(namespaceName) || isArray(namespaceName) ) {
    options.namespaceName = namespaceName;
  }

  return reduce( $globalNamespace.request('__model_reference', extend({}, defaultGetViewModelOptions, options), true), function(viewModels, viewModel) {
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

var defaultViewModelConfigParams = {
  namespace: undefined,
  name: undefined,
  autoRegister: false,
  autoIncrement: false,
  mixins: undefined,
  params: undefined,
  initialize: noop,
  afterInit: noop,
  afterBinding: noop,
  onDispose: noop
};

function beforeInitMixins(mixin) {
  return !!mixin.runBeforeInit;
}

var makeViewModel = fw.viewModel = function(configParams) {
  configParams = configParams || {};

  var ctor = noop;
  var afterInit = noop;
  var parentViewModel = configParams.parent;

  if( !isUndefined(configParams) ) {
    ctor = configParams.viewModel || configParams.initialize || noop;
    afterInit = configParams.afterInit || noop;
  }
  afterInit = { _postInit: afterInit };
  configParams = extend({}, defaultViewModelConfigParams, configParams);

  var initViewModelMixin = {
    _preInit: function( params ) {
      if( isObject(configParams.router) ) {
        this.$router = new Router( configParams.router, this );
      }
    },
    mixin: {
      __isViewModel: true,
      $params: result(configParams, 'params'),
      __getConfigParams: function() {
        return configParams;
      },
      dispose: function() {
        if( !this._isDisposed ) {
          this._isDisposed = true;
          if( configParams.onDispose !== noop ) {
            configParams.onDispose.call(this);
          }
          each(this, propertyDisposal);
        }
      }
    },
    _postInit: function() {
      if( this.__assertPresence !== false ) {
        this.$globalNamespace.request.handler('__model_reference', function(options) {
          if( !this.__isOutlet || (isObject(options) && options.includeOutlets) ) {
            if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
              if(isArray(options.namespaceName) && indexOf(options.namespaceName, this.getNamespaceName()) !== -1) {
                return this;
              } else if(isString(options.namespaceName) && options.namespaceName === this.getNamespaceName()) {
                return this;
              }
            } else {
              return this;
            }
          }
        }.bind(this));
      }
    }
  };

  if( !isViewModelCtor(ctor) ) {
    var composure = [ ctor ];
    var afterInitMixins = reject(viewModelMixins, beforeInitMixins);
    var beforeInitMixins = filter(viewModelMixins, beforeInitMixins);

    if( beforeInitMixins.length ) {
      composure = composure.concat(beforeInitMixins);
    }
    composure = composure.concat(initViewModelMixin);
    if( afterInitMixins.length ) {
      composure = composure.concat(afterInitMixins);
    }

    composure = composure.concat(afterInit);
    if( !isUndefined(configParams.mixins) ) {
      composure = composure.concat(configParams.mixins);
    }

    each(composure, function(element) {
      if( !isUndefined(element['runBeforeInit']) ) {
        delete element.runBeforeInit;
      }
    });

    var model = riveter.compose.apply( undefined, composure );
    model.__isViewModelCtor = true;
    model.__configParams = configParams;
  } else {
    // user has specified another viewModel constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    model = ctor;
  }

  if( !isUndefined(parentViewModel) ) {
    model.inherits(parentViewModel);
  }

  if( configParams.autoRegister ) {
    var namespace = configParams.namespace || configParams.name;
    if( isRegisteredViewModel(namespace) ) {
      if( getRegisteredViewModel(namespace) !== model ) {
        throw 'namespace [' + namespace + '] already registered using a different viewModel, autoRegister failed.';
      }
    } else {
      registerViewModel(namespace, model);
    }
  }

  return model;
};

// Provides lifecycle functionality and $context for a given viewModel and element
function applyContextAndLifeCycle(viewModel, element) {
  if( isViewModel(viewModel) ) {
    var $configParams = viewModel.__getConfigParams();
    var context;
    element = element || document.body;
    viewModel.$element = element;
    viewModel.$context = elementContext = fw.contextFor(element);

    if( isFunction($configParams.afterBinding) ) {
      $configParams.afterBinding.call(viewModel, element);
    }

    if( isRouter(viewModel.$router) ) {
      viewModel.$router.context( elementContext );
    }

    if( !isUndefined(element) ) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        viewModel.dispose();
      });
    }
  }
}

// Override the original applyBindings method to provide 'viewModel' life-cycle hooks/events and to provide the $context to the $router if present.
var originalApplyBindings = fw.applyBindings;
var applyBindings = fw.applyBindings = function(viewModel, element) {
  originalApplyBindings(viewModel, element);
  applyContextAndLifeCycle(viewModel, element);
};

function bindComponentViewModel(element, params, ViewModel) {
  var viewModelObj;
  if( isFunction(ViewModel) ) {
    viewModelObj = new ViewModel(values.params);
  } else {
    viewModelObj = ViewModel;
  }
  viewModelObj.$parentContext = fw.contextFor(element.parentElement || element.parentNode);

  // binding the viewModelObj onto each child element is not ideal, need to do this differently
  // cannot get component.preprocess() method to work/be called for some reason
  each(element.children, function(child) {
    originalApplyBindings(viewModelObj, child);
  });
  applyContextAndLifeCycle(viewModelObj, element);

  // we told applyBindings not to specify a context on the viewModel.$router after binding because we are binding to each
  // sub-element and must specify the context as being the container element only once
  if( isRouter(viewModelObj.$router) ) {
    viewModelObj.$router.context( fw.contextFor(element) );
  }
};

// Monkey patch enables the viewModel component to initialize a model and bind to the html as intended (with lifecycle events)
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = fw.bindingHandlers.component.init;

var initSpecialTag = function(tagName, element, valueAccessor, allBindings, viewModel, bindingContext) {
  var theValueAccessor = valueAccessor;
  if(tagName === '__elementBased') {
    tagName = element.tagName;
  }

  if(isString(tagName)) {
    tagName = tagName.toLowerCase();
    if( tagName === 'viewmodel' || tagName === 'router' ) {
      if(tagName === 'router') {
        // debugger;
      }
      var values = valueAccessor();
      var moduleName = ( !isUndefined(values.params) ? fw.unwrap(values.params.name) : undefined ) || element.getAttribute('module') || element.getAttribute('data-module');
      var bindViewModel = bindComponentViewModel.bind(null, element, values.params);

      var isRegistered = (tagName === 'viewmodel' ? isRegisteredViewModel : isRegisteredRouter);
      var getRegistered = (tagName === 'viewmodel' ? getRegisteredViewModel : getRegisteredRouter);
      var getResourceLocation = (tagName === 'viewmodel' ? getViewModelResourceLocation : getRouterResourceLocation);
      var getFileName = (tagName === 'viewmodel' ? getViewModelFileName : getRouterFileName);

      if(isNull(moduleName) && isString(values)) {
        moduleName = values;
      }

      if( !isUndefined(moduleName) ) {
        var resourceLocation = null;

        if( isRegistered(moduleName) ) {
          // viewModel was manually registered, we preferentially use it
          resourceLocation = getRegistered(moduleName);
        } else if( isFunction(require) && isFunction(require.defined) && require.defined(moduleName) ) {
          // we have found a matching resource that is already cached by require, lets use it
          resourceLocation = moduleName;
        } else {
          resourceLocation = getResourceLocation(moduleName);
        }

        if( isString(resourceLocation) ) {
          if( isFunction(require) ) {
            if( isPath(resourceLocation) ) {
              resourceLocation = resourceLocation + getFileName(moduleName);
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

fw.bindingHandlers.$router = {
  preprocess: function(moduleName) {
    /**
     * get config for router from constructor module
     * viewModel.$router = new Router( configParams.router, this );
     */
    return "'" + moduleName + "'";
  },
  init: initSpecialTag.bind(null, 'router')
};

fw.bindingHandlers.$viewModel = {
  preprocess: function(moduleName) {
    return "'" + moduleName + "'";
  },
  init: initSpecialTag.bind(null, 'viewModel')
};

fw.bindingHandlers.component.init = initSpecialTag.bind(null, '__elementBased');