var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../misc/util').getSymbol('footwork');
var getSymbol = require('../misc/util').getSymbol;

fw.isCollection = function (thing) {
  return _.isObject(thing) && !!thing[getSymbol('isCollection')];
};

var defaultCollectionConfig = {
  url: null,
  idAttribute: 'id',
  parse: _.identity,
  fetchOptions: {}
};

var collectionCount = 0;
fw.collection = function createCollection (configParamsOrData) {
  var configParams = {};
  var collectionData = [];

  if (_.isArray(configParamsOrData)) {
    collectionData = configParamsOrData;
  } else if (_.isObject(configParamsOrData)) {
    configParams = configParamsOrData;
    collectionData = configParams.data || [];
  }

  configParams = _.extend({}, defaultCollectionConfig, configParams);

  var collection = fw.observableArray();

  _.extend(collection, require('./collection-methods'), {
    isReading: fw.observable(false)
  });

  collection[getSymbol('isCollection')] = true;
  collection[privateDataSymbol] = {
    configParams: configParams
  };

  collection.requestInProgress = fw.pureComputed(function () {
    return collection.isReading();
  });

  if (collectionData) {
    collection(collectionData);
  }

  return collection;
};
