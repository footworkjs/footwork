var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var collectionMethods = require('./collection-methods');
var privateDataSymbol = require('../misc/config').privateDataSymbol;
var getSymbol = require('../misc/util').getSymbol;

var defaultCollectionConfig = {
  namespace: null,
  url: null,
  dataModel: null,
  idAttribute: null,
  disposeOnRemove: true,
  parse: _.identity,
  fetchOptions: {}
};

function removeDisposeAndNotify (originalFunction) {
  var removedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  this[privateDataSymbol].configParams.disposeOnRemove && _.invokeMap(removedItems, 'dispose');
  this.$namespace.publish('_.remove', removedItems);
  return removedItems;
}

function addAndNotify (originalFunction) {
  var addItems = _.map(Array.prototype.slice.call(arguments).splice(1), this[privateDataSymbol].castAs.dataModel);
  var originalResult = originalFunction.apply(this, addItems);
  this.$namespace.publish('_.add', addItems);
  return originalResult;
}

var PlainCollectionConstructor;

fw.collection = function (collectionData) {
  collectionData = collectionData || [];

  if (_.isUndefined(PlainCollectionConstructor)) {
    PlainCollectionConstructor = fw.collection.create();
  }
  return PlainCollectionConstructor(collectionData);
};

fw.collection.create = function (configParams) {
  configParams = configParams || {};

  return function CollectionConstructor (collectionData) {
    configParams = _.extend({}, defaultCollectionConfig, configParams);
    var DataModelCtor = configParams.dataModel;
    var collection = fw.observableArray();

    _.extend(collection, collectionMethods, {
      $namespace: fw.namespace(configParams.namespace || _.uniqueId('collection')),
      remove: removeDisposeAndNotify.bind(collection, collection.remove),
      pop: removeDisposeAndNotify.bind(collection, collection.pop),
      shift: removeDisposeAndNotify.bind(collection, collection.shift),
      splice: removeDisposeAndNotify.bind(collection, collection.splice),
      push: addAndNotify.bind(collection, collection.push),
      unshift: addAndNotify.bind(collection, collection.unshift),
      isFetching: fw.observable(false),
      isCreating: fw.observable(false),
      dispose: function () {
        if (!collection[privateDataSymbol].isDisposed) {
          collection[privateDataSymbol].isDisposed = true;
          collection.$namespace.dispose();
          _.invokeMap(collection(), 'dispose');
        }
      }
    });

    collection[getSymbol('isCollection')] = true;
    collection[privateDataSymbol] = {
      configParams: configParams,
      castAs: {
        modelData: function (modelData, attribute) {
          if (fw.isDataModel(modelData)) {
            return modelData.getData(attribute);
          }
          if (_.isUndefined(attribute)) {
            return modelData;
          }
          return _.result(modelData, attribute);
        },
        dataModel: function (modelData) {
          return _.isFunction(DataModelCtor) && !fw.isDataModel(modelData) ? (new DataModelCtor(modelData)) : modelData;
        }
      },
      getIdAttribute: function (options) {
        return configParams.idAttribute || (options || {}).idAttribute || 'id';
      }
    };

    collection.requestInProgress = fw.pureComputed(function () {
      return collection.isFetching() || collection.isCreating();
    });

    if (collectionData) {
      collection.set(collectionData);
    }

    return collection;
  };
};
