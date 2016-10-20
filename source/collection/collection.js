var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var collectionMethods = require('./collection-methods');

var entityTools = require('../entities/entity-tools');
var isDataModel = entityTools.isDataModel;
var isDataModelCtor = entityTools.isDataModelCtor;

var defaultCollectionConfig = {
  namespace: null,
  url: null,
  dataModel: null,
  idAttribute: null,
  disposeOnRemove: true,
  parse: _.identity,
  ajaxOptions: {}
};

function removeDisposeAndNotify(originalFunction) {
  var removedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  this.__private.configParams.disposeOnRemove && _.invokeMap(removedItems, 'dispose');
  this.$namespace.publish('_.remove', removedItems);
  return removedItems;
}

function addAndNotify(originalFunction) {
  var addItems = _.map(Array.prototype.slice.call(arguments).splice(1), this.__private.castAs.dataModel);
  var originalResult = originalFunction.apply(this, addItems);
  this.$namespace.publish('_.add', addItems);
  return originalResult;
}

var PlainCollectionConstructor;

fw.collection = function(collectionData) {
  collectionData = collectionData || [];

  if (_.isUndefined(PlainCollectionConstructor)) {
    PlainCollectionConstructor = fw.collection.create();
  }
  return PlainCollectionConstructor(collectionData);
};

fw.collection.create = function(configParams) {
  configParams = configParams || {};

  return function CollectionConstructor(collectionData) {
    configParams = _.extend({}, defaultCollectionConfig, configParams);
    var DataModelCtor = configParams.dataModel;
    var collection = fw.observableArray();

    _.extend(collection, collectionMethods, {
      $namespace: fw.namespace(configParams.namespace || _.uniqueId('collection')),
      __isCollection: true,
      __private: {
        configParams: configParams,
        castAs: {
          modelData: function(modelData, attribute) {
            if (isDataModel(modelData)) {
              return modelData.getData(attribute);
            }
            if (_.isUndefined(attribute)) {
              return modelData;
            }
            return _.result(modelData, attribute);
          },
          dataModel: function(modelData) {
            return isDataModelCtor(DataModelCtor) && !isDataModel(modelData) ? (new DataModelCtor(modelData)) : modelData;
          }
        },
        getIdAttribute: function(options) {
          var idAttribute = configParams.idAttribute || (options || {}).idAttribute;
          if (_.isUndefined(idAttribute) || _.isNull(idAttribute)) {
            if (isDataModelCtor(DataModelCtor)) {
              return DataModelCtor.__private.configParams.idAttribute;
            }
          }
          return idAttribute || 'id';
        }
      },
      remove: removeDisposeAndNotify.bind(collection, collection.remove),
      pop: removeDisposeAndNotify.bind(collection, collection.pop),
      shift: removeDisposeAndNotify.bind(collection, collection.shift),
      splice: removeDisposeAndNotify.bind(collection, collection.splice),
      push: addAndNotify.bind(collection, collection.push),
      unshift: addAndNotify.bind(collection, collection.unshift),
      isFetching: fw.observable(false),
      isCreating: fw.observable(false),
      dispose: function() {
        if (!collection.isDisposed) {
          collection.isDisposed = true;
          collection.$namespace.dispose();
          _.invokeMap(collection(), 'dispose');
        }
      }
    });

    collection.requestInProgress = fw.pureComputed(function() {
      return this.isFetching() || this.isCreating();
    }, collection);

    if (collectionData) {
      collection.set(collectionData);
    }

    return collection;
  };
};
