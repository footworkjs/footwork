// viewModel.js
// ------------------

// Duck type function for determining whether or not something is a footwork viewModel constructor function
function isViewModelCtor(thing) {
  return _.isFunction(thing) === true && thing.__isViewModelCtor === true;
}

// Duck type function for determining whether or not something is a footwork viewModel
function isViewModel(thing) {
  return _.isObject(thing) === true && thing.__isViewModel === true;
}

// Initialize the viewModels registry
var viewModels = {};

// Returns the number of created viewModels for each defined namespace
var viewModelCount = ko.viewModelCount = function() {
  var counts = _.reduce(namespaceNameCounter, function(viewModelCounts, viewModelCount, viewModelName) {
    viewModelCounts[viewModelName] = viewModelCount + 1;
    return viewModelCounts;
  }, {});
  counts.__total = _.reduce(_.values(counts), function(summation, num) {
    return summation + num;
  }, 0);
  return counts;
};

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all model references is returned.
var getViewModels = ko.getViewModels = function(namespaceName) {
  if( _.isUndefined(namespaceName) === true ) {
    return viewModels;
  }
  return viewModels[namespaceName];
};

// Tell all viewModels to request the values which it listens for
var refreshModels = ko.refreshViewModels = function() {
  _.invoke(getViewModels(), 'refreshReceived');
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
  var ctor;
  var afterInit;

  configParams = configParams || {};
  if( _.isUndefined(configParams) === false ) {
    ctor = configParams.viewModel || configParams.initialize || noop;
    afterInit = configParams.afterInit || noop;
  }
  afterInit = { _postInit: afterInit };
  configParams = _.extend({}, defaultViewModelConfigParams, configParams);

  var originalAfterBinding = configParams.afterBinding;
  configParams.afterBinding = function() {
    originalAfterBinding.apply(this, arguments);
    configParams.afterBinding.wasCalled = true;
  };
  configParams.afterBinding.wasCalled = false;

  var initViewModelMixin = {
    _preInit: function( initParams ) {
      this.$params = configParams.params;
      if( _.isObject(configParams.router) === true ) {
        this.$router = new Router( configParams.router, this );
      }
      this.__isViewModel = true;
      this.__getConfigParams = function() {
        return configParams;
      };
      this.__getInitParams = function() {
        return initParams;
      };
      this.__shutdown = function() {
        if( _.isFunction(configParams.afterDispose) === true ) {
          configParams.afterDispose.call(this);
        }

        _.each(this, function( property ) {
          if( isNamespace(property) === true || isRouter(property) === true ) {
            property.shutdown();
          }
        });

        if( _.isFunction(configParams.afterBinding) === true ) {
          configParams.afterBinding.wasCalled = false;
        }
      };
    },
    _postInit: function() {
      this.$namespace.request.handler('__footwork_model_reference', function() {
        return this;
      });
    }
  };

  var composure = [ ctor, initViewModelMixin ].concat( viewModelMixins, afterInit );
  if( _.isUndefined(configParams.mixins) === false ) {
    composure = composure.concat(configParams.mixins);
  }

  var model = riveter.compose.apply( undefined, composure );
  model.__isViewModelCtor = true;
  model.__configParams = configParams;

  return model;
};

// Monkey patch enables the viewModel 'component' to initialize a model and bind to the html as intended
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = ko.bindingHandlers.component.init;
ko.bindingHandlers.component.init = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
  if( _.isString(element.tagName) === true && element.tagName.toLowerCase() === 'viewmodel' ) {
    var values = valueAccessor();
    var name = element.getAttribute('name') || element.getAttribute('data-name');

    if( _.isUndefined(name) === false ) {
      var viewModelName = ko.unwrap(values.params.name);
      var resourceLocation = getResourceLocation( viewModelName ).viewModels;

      if( _.isFunction(require) === true && _.isFunction(require.defined) === true && require.defined(viewModelName) === true ) {
        // we have found a matching resource that is already cached by require, lets use it
        resourceLocation = viewModelName;
      }

      var bindViewModel = function(ViewModel) {
        var viewModelObj = ViewModel;
        if( _.isFunction(ViewModel) === true ) {
          viewModelObj = new ViewModel(values.params);
        } else {
          viewModelObj = ViewModel;
        }

        // binding the viewModelObj onto each child element is not ideal, need to do this differently
        // cannot get component.preprocess() method to work/be called for some reason
        _.each(element.children, function(child) {
          applyBindings(viewModelObj, child, doNotSetContextOnRouter);
        });

        // we told applyBindings not to specify a context on the viewModel.$router after binding because we are binding to each
        // sub-element and must specify the context as being the container element only once
        if( isRouter( viewModelObj.$router ) === true ) {
          viewModelObj.$router.context( ko.contextFor(element) );
        }
      };

      if( _.isString(resourceLocation) === true ) {
        if( _.isFunction(require) === true ) {
          if( isPath(resourceLocation) === true ) {
            resourceLocation = resourceLocation + name;
          }
          if( resourceLocation !== viewModelName && resourceLocation.match(/\.js$/) === null ) {
            resourceLocation = resourceLocation + resourceFileExtensions.viewModel;
          }

          require([ resourceLocation ], bindViewModel);
        } else {
          throw 'Uses require, but no AMD loader is present';
        }
      } else if( _.isFunction(resourceLocation) === true ) {
        bindViewModel( resourceLocation );
      } else if( _.isObject(resourceLocation) === true ) {
        if( _.isObject(resourceLocation.instance) === true ) {
          bindViewModel( resourceLocation.instance );
        } else if( _.isFunction(resourceLocation.createViewModel) === true ) {
          bindViewModel( resourceLocation.createViewModel( values.params, { element: element } ) );
        }
      }
    }

    return { 'controlsDescendantBindings': true };
  }

  return originalComponentInit(element, valueAccessor, allBindings, viewModel, bindingContext);
};