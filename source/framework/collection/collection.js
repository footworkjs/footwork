// framework/collection/collection.js
// ------------------

function removeDisposeAndNotify(originalFunction) {
  var removedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  invoke(removedItems, 'dispose');
  this.$namespace.publish('_.remove', removedItems);
  return removedItems;
}

function addAndNotify(originalFunction) {
  var addedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  this.$namespace.publish('_.add', addedItems);
  return addedItems;
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
    collection.remove = removeDisposeAndNotify.bind(collection, collection.remove);
    collection.pop = removeDisposeAndNotify.bind(collection, collection.pop);
    collection.shift = removeDisposeAndNotify.bind(collection, collection.shift);
    collection.splice = removeDisposeAndNotify.bind(collection, collection.splice);
    collection.push = addAndNotify.bind(collection, collection.push);
    collection.unshift = addAndNotify.bind(collection, collection.unshift);

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
