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
      throw new Error('Must provide a dataModel for a collection to use');
    }

    var privateDataStore = {};

    extend(collection, collectionMethods, {
      $namespace: fw.namespace(config.namespace || uniqueId('collection')),
      __originalData: collectionData,
      __isCollection: true,
      __private: privateData.bind(this, privateDataStore, config),
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
      collection.$set(collectionData);
    }

    return collection;
  };
};
