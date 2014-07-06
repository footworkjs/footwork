// viewModel.js
// ------------------

// Duck type function for determining whether or not something is a footwork viewModel constructor function
function isViewModelCtor(thing) {
  return typeof thing !== 'undefined' && thing._isViewModelCtor === true;
}

// Duck type function for determining whether or not something is a footwork viewModel
function isViewModel(thing) {
  return typeof thing !== 'undefined' && _.isObject(thing.$viewModel) === true;
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
var getModels = ko.getViewModels = function(namespaceName) {
  if(namespaceName === undefined) {
    return viewModels;
  }
  return viewModels[namespaceName];
};

// Tell all viewModels to request the values which it listens for
var refreshModels = ko.refreshViewModels = function() {
  _.invoke(getModels(), 'refreshReceived');
};

var makeViewModel = ko.viewModel = function(configParams) {
  if( typeof configParams !== 'undefined' && _.isFunction(configParams.viewModel) === true ) {
    configParams.initialize = configParams.viewModel;
  }

  configParams = _.extend({
    namespace: undefined,
    componentNamespace: undefined,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    afterBinding: noop,
    initialize: noop
  }, configParams);

  var viewModelMixin = {
    _preInit: function( initParams ) {
      this.$viewModel = {
        configParams: configParams,
        initParams: initParams || {}
      }
    },
    _postInit: function() {
      this.namespace.request.handler('__footwork_model_reference', function() {
        return this;
      });
    }
  };

  var composure = [ configParams.initialize, viewModelMixin ].concat( viewModelMixins );
  if(configParams.mixins !== undefined) {
    composure = composure.concat(configParams.mixins);
  }

  var model = riveter.compose.apply( undefined, composure );
  model._isViewModelCtorCtor = true;

  return model;
};