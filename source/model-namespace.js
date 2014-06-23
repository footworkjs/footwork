// model-namespace.js
// ------------------

// Prepare an empty namespace stack.
// This is where footwork registers its current working namespace name. Each new namespace is
// 'unshifted' and 'shifted' as they are entered and exited, keeping the most current at
// index 0.
ko.__nsStack = [];

// Creates and returns a new namespace channel
ko.namespace = function(namespaceName) {
  return postal.channel(namespaceName);
};

// Return the current namespace name.
ko.currentNamespaceName = function() {
  return ko.__nsStack[0];
};

// Return the current namespace channel.
ko.currentNamespace = function() {
  return ko.namespace(ko.currentNamespaceName());
};

// enterNamespaceName() adds a namespaceName onto the namespace stack at the current index, 
// 'entering' into that namespace (it is now the currentNamespace)
ko.enterNamespaceName = function(namespaceName) {
  ko.__nsStack.unshift( namespaceName );
};

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, exiting to the
// next namespace in the stack
ko.exitNamespace = function() {
  ko.__nsStack.shift();
};

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

// Tell footwork whether or not it should count and keep references to all created models
// NOTE: This can lead to memory leaks and should not be used in production.
var debugModels = false;
ko.debugModels = function(state) {
  debugModels = state;
};

// Tell all models to request the values which it listens for
ko.refreshModels = function() {
  _.invoke(ko.getModels(), 'refreshReceived');
};

// Initialize the models registry
var models = {};

// This counter is used when model options { autoIncrement: true } and more than one model
// having the same namespace is instantiated. This is used in the event you do not want
// multiple copies of the same model to share the same namespace (if they do share a
// namespace, they receive all of the same events/messages/commands/etc).
var namespaceNameCounter = {};

function indexedNamespaceName(name, autoIncrement) {
  if(namespaceNameCounter[name] === undefined) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + ((autoIncrement === true && namespaceNameCounter[name] > 0) ? namespaceNameCounter[name] : '');
}

function NamespaceMask(namespaceName) {
  this._preInit = function() {
    this.forceNamespaceName = namespaceName;
  };
  this._postInit = function() {
    delete this.forceNamespaceName;
  };
}

ko.model = function(modelOptions) {
  modelOptions = _.extend({
    namespace: undefined,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    afterBinding: function() {},
    constructor: function() {},
    componentNamespace: undefined
  }, modelOptions);

  // var mask = new NamespaceMask(namespaceName);

  var viewModel = {
    _preInit: function( options ) {
      modelOptions.namespace = indexedNamespaceName(modelOptions.componentNamespace || modelOptions.namespace || _.uniqueId('namespace'), modelOptions.autoIncrement);
      this._modelOptions = modelOptions;

      // var namespace = ko.currentNamespace();
      ko.enterNamespaceName( modelOptions.namespace );
      this.namespace = ko.currentNamespace();
      this._globalNamespace = ko.namespace();
    },
    mixin: {
      getNamespaceName: function() {
        return this.namespace.channel;
      },
      getModelOptions: function() {
        return modelOptions;
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
      if(debugModels === true) {
        models[ this.getNamespaceName() ] = this;
      }

      ko.exitNamespace();
      this.startup();
      _.isFunction(modelOptions.afterCreating) && modelOptions.afterCreating.call(this);
    }
  };

  var composure = [ modelOptions.constructor, viewModel ];
  if(modelOptions.mixins !== undefined) {
    composure = composure.concat(modelOptions.mixins);
  }
  var model = riveter.compose.apply( undefined, composure );

  model._isFootworkModel = true;
  model.options = modelOptions;

  return model;
};