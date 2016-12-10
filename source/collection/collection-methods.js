var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var makeOrGetRequest = require('../misc/ajax').makeOrGetRequest;
var privateDataSymbol = require('../misc/util').getSymbol('footwork');

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * Note: object 'a' can provide a regex value for a property and have it searched matching on the regex value
 * @param  {object} a Object to compare (which can contain regex values for properties)
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function regExpIsEqual (a, b, isEq) {
  isEq = isEq || regExpIsEqual;

  if (_.isObject(a) && _.isObject(b)) {
    return _.every(_.reduce(a, function (comparison, paramValue, paramName) {
      var isCongruent = false;
      var bParamValue = b[paramName];
      if (bParamValue) {
        if (_.isRegExp(paramValue)) {
          isCongruent = !_.isNull(bParamValue.match(paramValue));
        } else {
          isCongruent = isEq(paramValue, bParamValue);
        }
      }

      comparison.push(isCongruent);
      return comparison;
    }, []));
  } else {
    return a === b;
  }
}

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * In other words: A == B, but B does not necessarily == A
 * @param  {object} a Object to compare
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function sortOfEqual (a, b, isEq) {
  isEq = isEq || _.isEqual;

  if (_.isObject(a) && _.isObject(b)) {
    var AKeys = _.keys(a);
    var BKeys = _.keys(b);
    var commonKeys = _.intersection(AKeys, BKeys);
    var hasAllAKeys = _.every(AKeys, function (Akey) {
      return BKeys.indexOf(Akey) !== -1;
    })
    return commonKeys.length > 0 && hasAllAKeys && isEq(_.pick(a, commonKeys), _.pick(b, commonKeys));
  } else {
    return a === b;
  }
}

function collectionSync () {
  return fw.sync.apply(this, arguments);
}

function pluck (attribute) {
  var collection = this;
  var castAsModelData = collection[privateDataSymbol].castAs.modelData;
  return _.reduce(collection(), function (pluckedValues, model) {
    pluckedValues.push(castAsModelData(model, attribute));
    return pluckedValues;
  }, []);
}

/**
 * Convert the collection to its plain object form for toJSON support.
 *
 * @returns {array} The collection of data
 */
function toJSON () {
  var data = this.get();
  return _.reduce(this.get(), function(blob, entry) {
    if(fw.isDataModel(entry)) {
      blob.push(entry.get());
    } else {
      blob.push(entry);
    }
    return blob;
  }, []);
}

/**
 * Get the collection item with the specified id
 *
 * @param {any} id The id (mapped via idAttribute config option) of the entry to get
 * @returns {any} the found result (if any)
 */
function get (id) {
  var collection = this;
  return _.reduce(collection(), function(found, model) {
    var wasFound = _.isUndefined(id) || _.result(model, collection[privateDataSymbol].getIdAttribute()) === id;
    if(id && !found && wasFound) {
      found = model;
    } else if (!id && wasFound) {
      found.push(model);
    }
    return found;
  }, id ? null : []);
}

function set (newCollection, options) {
  if (!_.isArray(newCollection)) {
    throw Error('collection.set() must be passed an array of data/dataModels');
  }

  var collection = this;
  var collectionStore = collection();
  var castAsDataModel = collection[privateDataSymbol].castAs.dataModel;
  var castAsModelData = collection[privateDataSymbol].castAs.modelData;
  var idAttribute = collection[privateDataSymbol].getIdAttribute();
  var affectedModels = [];
  var absentModels = [];
  var addedModels = [];
  options = options || {};

  _.each(newCollection, function checkModelPresence (modelData) {
    var modelPresent = false;
    modelData = castAsModelData(modelData);

    if (!_.isUndefined(modelData)) {
      _.each(collectionStore, function lookForModel (model, indexOfModel) {
        var collectionModelData = castAsModelData(model);

        if (!_.isUndefined(modelData[idAttribute]) && !_.isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
          modelPresent = true;
          if (options.merge !== false && !sortOfEqual(collectionModelData, modelData)) {
            // found model, but needs an update
            if (fw.isDataModel(model)) {
              model.set(modelData);
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
    _.each(collectionStore, function checkForRemovals (model, indexOfModel) {
      var collectionModelData = castAsModelData(model);
      var modelPresent = false;

      if (collectionModelData) {
        modelPresent = _.reduce(newCollection, function (isPresent, modelData) {
          var bothValuesAreFalsey = !_.result(modelData, idAttribute) && !collectionModelData[idAttribute];
          return isPresent || (_.result(modelData, idAttribute) === collectionModelData[idAttribute] || bothValuesAreFalsey);
        }, false);
      }

      if (!modelPresent) {
        // model currently in collection not found in the supplied newCollection so we need to mark it for removal
        absentModels.push(model);
        affectedModels.push(model);
      }
    });

    if (absentModels.length) {
      _.each(absentModels, function (modelToRemove) {
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
  _.each(newCollection, function (newModelData, modelIndex) {
    newModelData = castAsModelData(newModelData);
    var foundAtIndex = null;
    var currentModel = _.find(collectionStore, function (model, theIndex) {
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

function reset (newCollection) {
  var collection = this;
  var oldModels = collection.removeAll();
  var castAsDataModel = collection[privateDataSymbol].castAs.dataModel;

  collection(_.reduce(newCollection, function (newModels, modelData) {
    newModels.push(castAsDataModel(modelData));
    return newModels;
  }, []));

  collection.$namespace.publish('_.reset', { newModels: collection(), oldModels: oldModels });

  return collection();
}

function fetch (options) {
  var ajax = require('../misc/ajax');
  var collection = this;
  var configParams = collection[privateDataSymbol].configParams;
  options = options ? _.clone(options) : {};

  var requestInfo = {
    requestRunning: collection.isFetching,
    requestLull: configParams.requestLull,
    entity: collection,
    createRequest: function () {
      if (_.isUndefined(options.parse)) {
        options.parse = true;
      }

      var xhr = collection.sync('read', collection, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          if (data) {
            var method = options.reset ? 'reset' : 'set';
            data = configParams.parse(data);
            var touchedModels = collection[method](data, options);

            collection.$namespace.publish('_.change', {
              touched: touchedModels,
              serverResponse: data,
              options: options
            });
          }
        });

      return xhr;
    }
  };

  return makeOrGetRequest('fetch', requestInfo);
}

function where (modelData, options) {
  var collection = this;
  var castAsModelData = collection[privateDataSymbol].castAs.modelData;
  options = options || {};
  modelData = castAsModelData(modelData);

  return _.reduce(collection(), function findModel (foundModels, model) {
    var thisModelData = castAsModelData(model);
    if (regExpIsEqual(modelData, thisModelData, options.isEqual)) {
      foundModels.push(options.getData ? thisModelData : model);
    }
    return foundModels;
  }, []);
}

function findWhere (modelData, options) {
  var collection = this;
  var castAsModelData = collection[privateDataSymbol].castAs.modelData;
  options = options || {};
  modelData = castAsModelData(modelData);

  return _.reduce(collection(), function findModel (foundModel, model) {
    var thisModelData = castAsModelData(model);
    if (_.isNull(foundModel) && regExpIsEqual(modelData, thisModelData, options.isEqual)) {
      return options.getData ? thisModelData : model;
    }
    return foundModel;
  }, null);
}

function add (models, options) {
  var collection = this;
  var affectedModels = [];
  options = options || {};

  if (_.isObject(models)) {
    models = [models];
  }

  var collectionData = collection();
  var castAsDataModel = collection[privateDataSymbol].castAs.dataModel;
  var castAsModelData = collection[privateDataSymbol].castAs.modelData;
  var idAttribute = collection[privateDataSymbol].getIdAttribute();

  if (_.isNumber(options.at)) {
    var newModels = _.map(models, castAsDataModel);

    collectionData.splice.apply(collectionData, [options.at, 0].concat(newModels));
    affectedModels.concat(newModels);
    collection.$namespace.publish('_.add', newModels);

    collection.valueHasMutated();
  } else {
    _.each(models, function checkModelPresence (modelData) {
      var modelPresent = false;
      var theModelData = castAsModelData(modelData);

      _.each(collectionData, function lookForModel (model) {
        var collectionModelData = castAsModelData(model);

        if (!_.isUndefined(theModelData[idAttribute]) && !_.isNull(theModelData[idAttribute]) && theModelData[idAttribute] === collectionModelData[idAttribute]) {
          modelPresent = true;
          if (options.merge && !sortOfEqual(theModelData, collectionModelData)) {
            // found model, but needs an update
            if (fw.isDataModel(model)) {
              model.set(theModelData);
            } else {
              _.extend(model, theModelData);
            }

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

  return affectedModels;
}

function create (model, options) {
  var ajax = require('../misc/ajax');
  var collection = this;
  var castAsDataModel = collection[privateDataSymbol].castAs.dataModel;
  var configParams = collection[privateDataSymbol].configParams;
  options = options ? _.clone(options) : {};

  var requestInfo = {
    requestRunning: collection.isCreating,
    requestLull: configParams.requestLull,
    entity: collection,
    allowConcurrent: true,
    createRequest: function () {
      var newModel = castAsDataModel(model);
      var xhr;

      if (fw.isDataModel(newModel)) {
        xhr = newModel.save();

        if (options.wait) {
          ajax.handleJsonResponse(xhr)
            .then(function (responseData) {
              responseData && collection.add(newModel);
            });
        } else {
          collection.add(newModel)
        }
      } else {
        return newModel;
      }

      return xhr;
    }
  };

  if (!_.isFunction(configParams.dataModel)) {
    throw Error('No dataModel specified, cannot create() a new collection item');
  }

  return makeOrGetRequest('create', requestInfo);
}

function removeModel (models) {
  var collection = this;
  var affectedModels = [];

  if (_.isObject(models)) {
    models = [models];
  }
  if (!_.isArray(models)) {
    models = !_.isUndefined(models) && !_.isNull(models) ? [models] : [];
  }

  return _.reduce(models, function (removedModels, model) {
    var removed = null;
    if (fw.isDataModel(model)) {
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
  sync: collectionSync,
  get: get,
  toJSON: toJSON,
  pluck: pluck,
  set: set,
  reset: reset,
  fetch: fetch,
  where: where,
  findWhere: findWhere,
  add: add,
  create: create,
  removeModel: removeModel
};
