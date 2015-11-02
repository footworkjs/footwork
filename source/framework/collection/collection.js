// framework/collection/collection.js
// ------------------

function removeDisposeAndNotify(originalFunction) {
  var removedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  this.__private('configParams').disposeOnRemove && invoke(removedItems, 'dispose');
  this.$namespace.publish('_.remove', removedItems);
  return removedItems;
}

function addAndNotify(originalFunction) {
  var addItems = Array.prototype.slice.call(arguments).splice(1);
  var originalResult = originalFunction.apply(this, addItems);
  this.$namespace.publish('_.add', addItems);
  return originalResult;
}

var plainCollection;

fw.collection = function(collectionData, configParams) {
  if(!isArray(collectionData)) {
    configParams = collectionData;
  }
  configParams = configParams || {};

  var initCollection = function(collectionData) {
    configParams = extend({}, defaultCollectionConfig, configParams);
    var collection = fw.observableArray();
    var privateStuff = {
      castAs: {
        modelData: function(modelData) {
          return isDataModel(modelData) ? modelData.get() : modelData;
        },
        dataModel: function(modelData) {
          var DataModelCtor = configParams.dataModel;
          return isDataModelCtor(DataModelCtor) && !isDataModel(modelData) ? (new DataModelCtor(modelData)) : modelData;
        }
      },
      getIdAttribute: function(options) {
        var idAttribute = configParams.idAttribute || (options || {}).idAttribute;
        if(isUndefined(idAttribute) || isNull(idAttribute)) {
          var DataModelCtor = configParams.dataModel;
          if(isDataModelCtor(DataModelCtor)) {
            return DataModelCtor.__private('configParams').idAttribute;
          }
        }
        return idAttribute || 'id';
      }
    };

    extend(collection, collectionMethods, {
      $namespace: fw.namespace(configParams.namespace || uniqueId('collection')),
      __originalData: collectionData,
      __isCollection: true,
      __private: privateData.bind(this, privateStuff, configParams),
      remove: removeDisposeAndNotify.bind(collection, collection.remove),
      pop: removeDisposeAndNotify.bind(collection, collection.pop),
      shift: removeDisposeAndNotify.bind(collection, collection.shift),
      splice: removeDisposeAndNotify.bind(collection, collection.splice),
      push: addAndNotify.bind(collection, collection.push),
      unshift: addAndNotify.bind(collection, collection.unshift),
      dispose: function() {
        if(!collection.isDisposed) {
          collection.isDisposed = true;
          collection.$namespace.dispose();
          invoke(collection(), 'dispose');
        }
      }
    });

    if(collectionData) {
      collection.set(collectionData);
    }

    return collection;
  }

  if(!isArray(collectionData)) {
    // no collectionData supplied, just return the constructor
    return initCollection;
  } else {
    // collectionData supplied we need to init a collection of some sort
    if(arguments.length === 2) {
      // user supplied custom options, use them
      return initCollection(configParams)(collectionData);
    } else {
      // no options, plain collection of data
      return plainCollection(collectionData);
    }
  }
};

plainCollection = fw.collection();
