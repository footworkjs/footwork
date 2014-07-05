// model.js
// ------------------

// Duck type function for determining whether or not something is a footwork model constructor function
function isFootworkModelCtor(thing) {
  return typeof thing !== 'undefined' && thing._isFootworkModelCtor === true;
}

// Duck type function for determining whether or not something is a footwork model
function isFootworkModel(thing) {
  return typeof thing !== 'undefined' && thing._isFootworkModel === true && _.isObject(thing._model) === true;
}

// Initialize the models registry
var models = {};

// Returns the number of created models for each defined namespace
var modelCount = ko.modelCount = function() {
  var counts = _.reduce(namespaceNameCounter, function(modelCounts, modelCount, modelName) {
    modelCounts[modelName] = modelCount + 1;
    return modelCounts;
  }, {});
  counts.__total = _.reduce(_.values(counts), function(summation, num) {
    return summation + num;
  }, 0);
  return counts;
};

// Returns a reference to the specified models.
// If no name is supplied, a reference to an array containing all model references is returned.
var getModels = ko.getModels = function(namespaceName) {
  if(namespaceName === undefined) {
    return models;
  }
  return models[namespaceName];
};

// Tell all models to request the values which it listens for
var refreshModels = ko.refreshModels = function() {
  _.invoke(getModels(), 'refreshReceived');
};

var modelMixins = [];

var makeViewModel = ko.viewModel = function(modelOptions) {
  if( typeof modelOptions !== 'undefined' && _.isFunction(modelOptions.viewModel) === true ) {
    modelOptions.initialize = modelOptions.viewModel;
  }

  var modelOptions = _.extend({
    namespace: undefined,
    componentNamespace: undefined,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    afterBinding: noop,
    initialize: noop
  }, modelOptions);

  var modelOptionsMixin = {
    _preInit: function( initOptions ) {
      this._isFootworkModel = true;
      this._model = {
        modelOptions: modelOptions,
        initOptions: initOptions || {}
      }
    },
    _postInit: function() {
      this.namespace.request.handler('__footwork_model_reference', function() {
        return this;
      });
    }
  };

  var composure = [ modelOptions.initialize, modelOptionsMixin ].concat( modelMixins );
  if(modelOptions.mixins !== undefined) {
    composure = composure.concat(modelOptions.mixins);
  }

  var model = riveter.compose.apply( undefined, composure );
  model._isFootworkModelCtorCtor = true;

  return model;
};