// framework/collection/collection.js
// ------------------

fw.collection = function(conf) {
  return function initCollection(collectionData) {
    var collection = fw.observableArray();

    var config = extend({}, defaultCollectionConfig, conf);
    if(!isDataModelCtor(config.dataModel)) {
      throw new Error('Must provide a dataModel for a collection');
    }

    var privateDataStore = {};
    collection.__private = privateData.bind(this, privateDataStore, config);

    var originalRemove = this.remove;

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
