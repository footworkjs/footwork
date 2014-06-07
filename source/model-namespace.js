ko.__nsStack = [];
ko.namespace = function(namespaceName) {
  return postal.channel(namespaceName);
};
ko.currentNamespace = function() {
  return ko.namespace(ko.__nsStack[0]);
};
ko.enterNamespace = function(namespaceName) {
  ko.__nsStack.unshift( namespaceName );
};
ko.exitNamespace = function() {
  ko.__nsStack.shift();
};
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
ko.getModels = function() {
  return models;
};
ko.debugModels = function(state) {
  debugModels = state;
};
ko.refreshModels = function() {
  _.invoke(ko.getModels(), 'refreshReceived');
};
var models = {},
    modelNum = 0,
    debugModels = false;

var namespaceNameCounter = {};
var indexedNamespaceName = function(name, autoIncrement) {
  if(namespaceNameCounter[name] === undefined) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + ((autoIncrement === true && namespaceNameCounter[name] > 0) ? namespaceNameCounter[name] : '');
};

ko.model = function(modelOptions) {
  modelOptions = _.extend({
    namespace: undefined,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    afterBinding: function() {},
    factory: function() {}
  }, modelOptions);

  var viewModel = {
    _preInit: function( options ) {
      modelOptions.namespace = indexedNamespaceName(modelOptions.namespace, modelOptions.autoIncrement);

      this._modelOptions = modelOptions;
      ko.enterNamespace(modelOptions.namespace);

      this._options = _.extend({
        namespace: modelOptions.namespace || ('namespace' + modelNum)
      }, options);
      modelNum++;

      this.namespace = ko.namespace( this.namespace = this._options.namespace );
      if(ko.currentNamespace().channel !== '/') {
        this.namespace = ko.currentNamespace();
      }
      this._globalChannel = ko.namespace();
    },
    mixin: {
      namespaceName: modelOptions.namespace,
      broadcastAll: function() {
        var model = this;
        if(typeof this._broadcast === 'object') {
          _.each( this._broadcast, function( observable, observableName ) {
            model.namespace.publish( observableName, observable() );
          });
        }

        _.each( this, function(property, propName) {
          if( _.isObject(property) === true && property.__isBroadcast === true ) {
            model.namespace.publish( propName, property() );
          }
        });
        return this;
      },
      refreshReceived: function() {
        if( typeof this._receive === 'object' && this._receive.refresh !== undefined ) {
          _.invoke( this._receive, 'refresh' );
          if( typeof this._receive.config === 'object' ) {
            _.invoke( this._receive.config, 'refresh' );
          }
        }

        _.each( this, function(property, propName) {
          if( _.isObject(property) === true && property.__isReceived === true ) {
            property.refresh();
          }
        });
        if( _.isObject(this.config) === true ) {
          _.invoke( this.config, 'refresh' );
        }
        return this;
      },
      startup: function() {
        this.refreshReceived().broadcastAll();
        return this;
      }
    },
    _postInit: function( options ) {
      if(debugModels === true) {
        models[ ko.currentNamespace().channel ] = this;
      }

      ko.exitNamespace();
      this.startup();
      typeof this._modelOptions.afterCreating === 'function' && this._modelOptions.afterCreating.call(this);
    }
  };

  var composure = [ modelOptions.factory, viewModel ];
  if(modelOptions.mixins !== undefined) {
    composure = composure.concat(modelOptions.mixins);
  }
  return riveter.compose.apply( undefined, composure );
};