var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var collectionMethods = require('./collection-methods');
var privateDataSymbol = require('../misc/util').getSymbol('footwork');
var getSymbol = require('../misc/util').getSymbol;

var defaultCollectionConfig = {
  namespace: null,
  url: null,
  dataModel: null,
  idAttribute: null,
  disposeOnRemove: true,
  parse: _.identity,
  fetchOptions: {},
  disposeItems: true
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

fw.collection = function createCollection (collectionData, configParams) {
  if(!_.isArray(collectionData)) {
    configParams = collectionData;
    collectionData = [];
  }

  collectionData = collectionData || [];
  configParams = _.extend({}, defaultCollectionConfig, configParams);

  var collection = fw.observableArray();

  _.extend(collection, collectionMethods, {
    $namespace: fw.namespace(configParams.namespace || _.uniqueId('collection')),
    remove: _.bind(removeDisposeAndNotify, collection, collection.remove),
    pop: _.bind(removeDisposeAndNotify, collection, collection.pop),
    shift: _.bind(removeDisposeAndNotify, collection, collection.shift),
    splice: _.bind(removeDisposeAndNotify, collection, collection.splice),
    push: _.bind(addAndNotify, collection, collection.push),
    unshift: _.bind(addAndNotify, collection, collection.unshift),
    isFetching: fw.observable(false),
    isCreating: fw.observable(false),
    dispose: function () {
      if (!collection[privateDataSymbol].isDisposed) {
        collection[privateDataSymbol].isDisposed = true;
        collection.$namespace.dispose();

        if(_.result(configParams, 'disposeItems')) {
          _.invokeMap(collection(), 'dispose');
        }
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
        var DataModelCtor = configParams.dataModel;
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
