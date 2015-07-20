// framework/collection/exports.js
// ------------------

fw.collection = function(conf) {
  return function initCollection(collectionData) {
    var collection = fw.observableArray();

    var config = extend({}, defaultCollectionConfig, conf);
    if(!isDataModelCtor(config.dataModel)) {
      throw new Error('Must provide a dataModel for a collection');
    }

    collection.__getConfigParams = function() {
      return config;
    };

    var router = {};
    this.__private = function privateData(propName, propValue) {
      var isGetBaseObjOp = arguments.length === 0;
      var isReadOp = arguments.length === 1;
      var isWriteOp = arguments.length === 2;

      if(isGetBaseObjOp) {
        return router;
      } else if(isReadOp) {
        return propName === 'configParams' ? config : router[propName];
      } else if(isWriteOp) {
        router[propName] = propValue;
        return router[propName];
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
