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

fw.collection = function(configParams) {
  return function initCollection(collectionData) {
    var collection = fw.observableArray();

    configParams = extend({}, defaultCollectionConfig, configParams);

    var privateStuff = {
      castAs: {
        modelData: function(modelData) {
          return isDataModel(modelData) ? modelData.get() : modelData;
        }.bind(collection),
        dataModel: function(modelData) {
          var DataModelCtor = this.__private('configParams').dataModel;
          return isDataModelCtor(DataModelCtor) && !isDataModel(modelData) ? (new DataModelCtor(modelData)) : modelData;
        }.bind(collection)
      },
      getIdAttribute: function(options) {
        var idAttribute = (options || {}).idAttribute || null;
        if(isNull(idAttribute)) {
          var DataModelCtor = this.__private('configParams').dataModel;
          if(isDataModelCtor(DataModelCtor)) {
            return DataModelCtor.__private('configParams').idAttribute;
          }
        }
        return idAttribute || 'id';
      }.bind(collection)
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
  };
};
