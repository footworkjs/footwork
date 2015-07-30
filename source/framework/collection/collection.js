// framework/collection/collection.js
// ------------------

function removeAndDispose(originalFunction) {
  var removedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  invoke(removedItems, 'dispose');
  return removedItems;
}

fw.collection = function(conf) {
  return function initCollection(collectionData) {
    var collection = fw.observableArray();

    var config = extend({}, defaultCollectionConfig, conf);
    if(!isDataModelCtor(config.dataModel)) {
      throw new Error('Must provide a dataModel for a collection');
    }

    var privateDataStore = {};
    collection.__private = privateData.bind(this, privateDataStore, config);

    // Make sure we dispose all dataModels when they are removed
    collection.remove = removeAndDispose.bind(collection, collection.remove);
    collection.pop = removeAndDispose.bind(collection, collection.pop);
    collection.shift = removeAndDispose.bind(collection, collection.shift);
    collection.splice = removeAndDispose.bind(collection, collection.splice);

    collection.dispose = function() {
      if(!collection.isDisposed) {
        collection.isDisposed = true;
        collection.$namespace.dispose();
        invoke(collection(), 'dispose');
      }
    };

    extend(collection, collectionMethods, {
      $namespace: fw.namespace(config.namespace || uniqueId('collection')),
      __originalData: collectionData,
      __isCollection: true
    });

    if(collectionData) {
      collection.$set(collectionData);
    }

    return collection;
  };
};
