// model.js
// ------------------

// Initialize the models registry
var models = {};

// Duck type function for determining whether or not something is a footwork model
function isFootworkModel(thing) {
  return typeof thing !== 'undefined' && thing._isFootworkModel === true;
}

// Returns the number of created models for each defined namespace
ko.modelCount = function() {
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
ko.getModels = function(namespaceName) {
  if(namespaceName === undefined) {
    return models;
  }
  return models[namespaceName];
};

// Tell all models to request the values which it listens for
ko.refreshModels = function() {
  _.invoke(ko.getModels(), 'refreshReceived');
};

ko.model = function(modelOptions) {
  if(typeof modelOptions !== 'undefined' && typeof modelOptions.viewModel !== 'undefined') {
    modelOptions.initialize = modelOptions.viewModel;
  }

  modelOptions = _.extend({
    namespace: undefined,
    componentNamespace: undefined,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    afterBinding: noop,
    initialize: noop
  }, modelOptions);

  var viewModel = {
    _preInit: function( options ) {
      modelOptions.namespace = indexedNamespaceName(modelOptions.componentNamespace || modelOptions.namespace || _.uniqueId('namespace'), modelOptions.autoIncrement);
      this._modelOptions = modelOptions;

      ko.enterNamespaceName( modelOptions.namespace );

      this.namespace = ko.currentNamespace();
      this._globalNamespace = ko.namespace();
    },
    mixin: {
      getNamespaceName: function() {
        return this.namespace.channel;
      },
      broadcastAll: function() {
        var model = this;
        _.each( this, function(property, propName) {
          if( _.isObject(property) && property.__isBroadcast === true ) {
            model.namespace.publish( propName, property() );
          }
        });
        return this;
      },
      refreshReceived: function() {
        _.each( this, function(property, propName) {
          if( _.isObject(property) && property.__isReceived === true ) {
            property.refresh();
          }
        });
        return this;
      },
      startup: function() {
        this.refreshReceived().broadcastAll();
        return this;
      }
    },
    _postInit: function( options ) {
      models[ this.getNamespaceName() ] = this;
      ko.exitNamespace();

      this.startup();
      _.isFunction(modelOptions.afterCreating) && modelOptions.afterCreating.call(this);
    }
  };

  var composure = [ modelOptions.initialize, viewModel ];
  if(modelOptions.mixins !== undefined) {
    composure = composure.concat(modelOptions.mixins);
  }
  var model = riveter.compose.apply( undefined, composure );

  model._isFootworkModel = true;
  model.options = modelOptions;

  return model;
};