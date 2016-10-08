var fw = require('../../bower_components/knockoutjs/dist/knockout');
var _ = require('../misc/lodash');

var objectTools = require('./object-tools');
var regExpIsEqual = objectTools.regExpIsEqual;
var commonKeysEqual = objectTools.commonKeysEqual;
var sortOfEqual = objectTools.sortOfEqual;

var entityTools = require('../entities/entity-tools');
var isDataModelCtor = entityTools.isDataModelCtor;
var isDataModel = entityTools.isDataModel;

var makeOrGetRequest = require('../misc/ajax').makeOrGetRequest;

function sync() {
  return fw.sync.apply(this, arguments);
}

function get(id) {
  var collection = this;
  return _.find(collection(), function findModelWithId(model) {
    return _.result(model, collection.__private('getIdAttribute')()) === id || _.result(model, '$id') === id || _.result(model, '$cid') === id;
  });
}

function getData() {
  var collection = this;
  var castAsModelData = collection.__private('castAs').modelData;
  return _.reduce(collection(), function(models, model) {
    models.push(castAsModelData(model));
    return models;
  }, []);
}

function toJSON() {
  return JSON.stringify(this.getData());
}

function pluck(attribute) {
  var collection = this;
  var castAsModelData = collection.__private('castAs').modelData;
  return _.reduce(collection(), function(pluckedValues, model) {
    pluckedValues.push(castAsModelData(model, attribute));
    return pluckedValues;
  }, []);
}

function set(newCollection, options) {
  if (!_.isArray(newCollection)) {
    throw new Error('collection.set() must be passed an array of data/dataModels');
  }

  var collection = this;
  var collectionStore = collection();
  var castAsDataModel = collection.__private('castAs').dataModel;
  var castAsModelData = collection.__private('castAs').modelData;
  var idAttribute = collection.__private('getIdAttribute')();
  var affectedModels = [];
  var absentModels = [];
  var addedModels = [];
  options = options || {};

  _.each(newCollection, function checkModelPresence(modelData) {
    var modelPresent = false;
    modelData = castAsModelData(modelData);

    if (!_.isUndefined(modelData)) {
      _.each(collectionStore, function lookForModel(model, indexOfModel) {
        var collectionModelData = castAsModelData(model);

        if (!_.isUndefined(modelData[idAttribute]) && !_.isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
          modelPresent = true;
          if (options.merge !== false && !sortOfEqual(collectionModelData, modelData)) {
            // found model, but needs an update
            if (_.isFunction(model.set)) {
              model.set.call(model, modelData);
            } else {
              collectionStore[indexOfModel] = modelData;
            }
            collection.$namespace.publish('_.change', model);
            affectedModels.push(model);
          }
        }
      });

      if (!modelPresent && options.add !== false) {
        // not found in collection, we have to add this model
        var newModel = castAsDataModel(modelData);
        collectionStore.push(newModel);
        affectedModels.push(newModel);
        addedModels.push(newModel);
        collection.$namespace.publish('_.add', newModel);
      }
    }
  });

  if (options.remove !== false) {
    _.each(collectionStore, function checkForRemovals(model, indexOfModel) {
      var collectionModelData = castAsModelData(model);
      var modelPresent = false;

      if (collectionModelData) {
        modelPresent = _.reduce(newCollection, function(isPresent, modelData) {
          return isPresent || _.result(modelData, idAttribute) === collectionModelData[idAttribute];
        }, false);
      }

      if (!modelPresent) {
        // model currently in collection not found in the supplied newCollection so we need to mark it for removal
        absentModels.push(model);
        affectedModels.push(model);
      }
    });

    if (absentModels.length) {
      _.each(absentModels, function(modelToRemove) {
        var indexOfModelToRemove = collectionStore.indexOf(modelToRemove);
        if (indexOfModelToRemove > -1) {
          collectionStore.splice(indexOfModelToRemove, 1);
        }
      });
      collection.$namespace.publish('_.remove', absentModels);
    }
  }

  // re-sort based on the newCollection
  var reSorted = [];
  var wasResorted = false;
  _.each(newCollection, function(newModelData, modelIndex) {
    newModelData = castAsModelData(newModelData);
    var foundAtIndex = null;
    var currentModel = _.find(collectionStore, function(model, theIndex) {
      if (sortOfEqual(castAsModelData(model), newModelData)) {
        foundAtIndex = theIndex;
        return true;
      }
    });
    reSorted.push(currentModel);
    wasResorted = wasResorted || foundAtIndex !== modelIndex;
  });

  wasResorted = (wasResorted && reSorted.length && _.every(reSorted));

  if (wasResorted) {
    Array.prototype.splice.apply(collectionStore, [0, reSorted.length].concat(reSorted));
  }

  if (wasResorted || addedModels.length || absentModels.length || affectedModels.length) {
    collection.notifySubscribers();
  }

  return affectedModels;
}

function reset(newCollection) {
  var collection = this;
  var oldModels = collection.removeAll();
  var castAsDataModel = collection.__private('castAs').dataModel;

  collection(_.reduce(newCollection, function(newModels, modelData) {
    newModels.push(castAsDataModel(modelData));
    return newModels;
  }, []));

  collection.$namespace.publish('_.reset', { newModels: collection(), oldModels: oldModels });

  return collection();
}

function fetch(options) {
  var ajax = require('../misc/ajax');
  var collection = this;
  var configParams = collection.__private('configParams');
  options = options ? _.clone(options) : {};

  var requestInfo = {
    requestRunning: collection.isFetching,
    requestLull: configParams.requestLull,
    entity: collection,
    createRequest: function() {
      if (_.isUndefined(options.parse)) {
        options.parse = true;
      }

      var xhr = collection.sync('read', collection, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData(data) {
          var method = options.reset ? 'reset' : 'set';
          data = configParams.parse(data);
          var touchedModels = collection[method](data, options);

          collection.$namespace.publish('_.change', {
            touched: touchedModels,
            serverResponse: data,
            options: options
          });
        });

      return xhr;
    }
  };

  return makeOrGetRequest('fetch', requestInfo);
}

function where(modelData, options) {
  var collection = this;
  var castAsModelData = collection.__private('castAs').modelData;
  options = options || {};
  modelData = castAsModelData(modelData);

  return _.reduce(collection(), function findModel(foundModels, model) {
    var thisModelData = castAsModelData(model);
    if (regExpIsEqual(modelData, thisModelData, options.isEqual)) {
      foundModels.push(options.getData ? thisModelData : model);
    }
    return foundModels;
  }, []);
}

function findWhere(modelData, options) {
  var collection = this;
  var castAsModelData = collection.__private('castAs').modelData;
  options = options || {};
  modelData = castAsModelData(modelData);

  return _.reduce(collection(), function findModel(foundModel, model) {
    var thisModelData = castAsModelData(model);
    if (_.isNull(foundModel) && regExpIsEqual(modelData, thisModelData, options.isEqual)) {
      return options.getData ? thisModelData : model;
    }
    return foundModel;
  }, null);
}

function addModel(models, options) {
  var collection = this;
  var affectedModels = [];
  options = options || {};

  if (_.isObject(models)) {
    models = [models];
  }
  if (!_.isArray(models)) {
    models = !_.isUndefined(models) && !_.isNull(models) ? [models] : [];
  }

  if (models.length) {
    var collectionData = collection();
    var castAsDataModel = collection.__private('castAs').dataModel;
    var castAsModelData = collection.__private('castAs').modelData;
    var idAttribute = collection.__private('getIdAttribute')();

    if (_.isNumber(options.at)) {
      var newModels = _.map(models, castAsDataModel);

      collectionData.splice.apply(collectionData, [options.at, 0].concat(newModels));
      affectedModels.concat(newModels);
      collection.$namespace.publish('_.add', newModels);

      collection.valueHasMutated();
    } else {
      _.each(models, function checkModelPresence(modelData) {
        var modelPresent = false;
        var theModelData = castAsModelData(modelData);

        _.each(collectionData, function lookForModel(model) {
          var collectionModelData = castAsModelData(model);

          if (!_.isUndefined(theModelData[idAttribute]) && !_.isNull(theModelData[idAttribute]) && theModelData[idAttribute] === collectionModelData[idAttribute]) {
            modelPresent = true;
            if (options.merge && !sortOfEqual(theModelData, collectionModelData)) {
              // found model, but needs an update
              (model.set || noop).call(model, theModelData);
              collection.$namespace.publish('_.change', model);
              affectedModels.push(model);
            }
          }
        });

        if (!modelPresent) {
          // not found in collection, we have to add this model
          var newModel = castAsDataModel(modelData);
          collection.push(newModel);
          affectedModels.push(newModel);
        }
      });
    }
  }

  return affectedModels;
}

function create(model, options) {
  var collection = this;
  var castAsDataModel = collection.__private('castAs').dataModel;
  var configParams = collection.__private('configParams');
  options = options ? _.clone(options) : {};

  var requestInfo = {
    requestRunning: collection.isCreating,
    requestLull: configParams.requestLull,
    entity: collection,
    allowConcurrent: true,
    createRequest: function() {
      var newModel = castAsDataModel(model);
      var xhr;

      if (isDataModel(newModel)) {
        xhr = newModel.save();

        if (options.wait) {
          (xhr.done || xhr.then).call(xhr, function() {
            collection.addModel(newModel);
          });
        } else {
          collection.addModel(newModel)
        }
      } else {
        return newModel;
      }

      return xhr;
    }
  };

  if (!isDataModelCtor(configParams.dataModel)) {
    throw new Error('No dataModel specified, cannot create() a new collection item');
  }

  return makeOrGetRequest('create', requestInfo);
}

function removeModel(models) {
  var collection = this;
  var affectedModels = [];

  if (_.isObject(models)) {
    models = [models];
  }
  if (!_.isArray(models)) {
    models = !_.isUndefined(models) && !_.isNull(models) ? [models] : [];
  }

  return _.reduce(models, function(removedModels, model) {
    var removed = null;
    if (isDataModel(model)) {
      removed = collection.remove(model);
    } else {
      var modelsToRemove = collection.where(model);
      if (!_.isNull(modelsToRemove)) {
        removed = collection.removeAll(modelsToRemove);
      }
    }

    if (!_.isNull(removed)) {
      return removedModels.concat(removed);
    }
    return removedModels;
  }, []);
}

module.exports = {
  sync: sync,
  get: get,
  getData: getData,
  toJSON: toJSON,
  pluck: pluck,
  set: set,
  reset: reset,
  fetch: fetch,
  where: where,
  findWhere: findWhere,
  addModel: addModel,
  create: create,
  removeModel: removeModel
};
