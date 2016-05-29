// framework/collection/collectionMethods.js
// ------------------

var collectionMethods = fw.collection.methods = {
  sync: function() {
    return fw.sync.apply(this, arguments);
  },
  get: function(id) {
    var collection = this;
    return find(collection(), function findModelWithId(model) {
      return result(model, collection.__private('getIdAttribute')()) === id || result(model, '$id') === id || result(model, '$cid') === id;
    });
  },
  getData: function() {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    return reduce(collection(), function(models, model) {
      models.push(castAsModelData(model));
      return models;
    }, []);
  },
  toJSON: function() {
    return JSON.stringify(this.getData());
  },
  pluck: function(attribute) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    return reduce(collection(), function(pluckedValues, model) {
      pluckedValues.push(castAsModelData(model, attribute));
      return pluckedValues;
    }, []);
  },
  set: function(newCollection, options) {
    if(!isArray(newCollection)) {
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

    each(newCollection, function checkModelPresence(modelData, indexOfNewModelData) {
      var modelPresent = false;
      modelData = castAsModelData(modelData);

      if(!isUndefined(modelData)) {
        each(collectionStore, function lookForModel(model) {
          var collectionModelData = castAsModelData(model);

          if(!isUndefined(modelData[idAttribute]) && !isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
            modelPresent = true;
            if(options.merge !== false && !sortOfEqual(collectionModelData, modelData)) {
              // found model, but needs an update
              (model.set || noop).call(model, modelData);
              collection.$namespace.publish('_.change', model);
              affectedModels.push(model);
            }
          }
        });

        if(!modelPresent && options.add !== false) {
          // not found in collection, we have to add this model
          var newModel = castAsDataModel(modelData);
          collectionStore.push(newModel);
          affectedModels.push(newModel);
          addedModels.push(newModel);
          collection.$namespace.publish('_.add', newModel);
        }
      }
    });

    if(options.remove !== false) {
      each(collectionStore, function checkForRemovals(model, indexOfModel) {
        var collectionModelData = castAsModelData(model);
        var modelPresent = false;

        if(collectionModelData) {
          modelPresent = reduce(newCollection, function(isPresent, modelData) {
            return isPresent || result(modelData, idAttribute) === collectionModelData[idAttribute];
          }, false);
        }

        if(!modelPresent) {
          // model currently in collection not found in the supplied newCollection so we need to mark it for removal
          absentModels.push(model);
          affectedModels.push(model);
        }
      });

      if(absentModels.length) {
        each(absentModels, function(modelToRemove) {
          var indexOfModelToRemove = collectionStore.indexOf(modelToRemove);
          if(indexOfModelToRemove > -1) {
            collectionStore.splice(indexOfModelToRemove, 1);
          }
        });
        collection.$namespace.publish('_.remove', absentModels);
        // collection.removeAll(absentModels);
      }
    }

    // re-sort based on the newCollection
    var reSorted = [];
    var wasResorted = false;
    each(newCollection, function(newModelData, modelIndex) {
      newModelData = castAsModelData(newModelData);
      var foundAtIndex = null;
      var currentModel = find(collectionStore, function(model, theIndex) {
        if(sortOfEqual(castAsModelData(model), newModelData)) {
          foundAtIndex = theIndex;
          return true;
        }
      });
      reSorted.push(currentModel);

      if(foundAtIndex !== modelIndex) {
        wasResorted = true;
      }
    });

    wasResorted = (wasResorted && reSorted.length && every(reSorted));

    if(wasResorted) {
      Array.prototype.splice.apply(collectionStore, [0, reSorted.length].concat(reSorted));
    }

    if(wasResorted || addedModels.length || absentModels.length) {
      collection.notifySubscribers();
    }

    return affectedModels;
  },
  reset: function(newCollection) {
    var collection = this;
    var oldModels = collection.removeAll();
    var castAsDataModel = collection.__private('castAs').dataModel;

    collection(reduce(newCollection, function(newModels, modelData) {
      newModels.push(castAsDataModel(modelData));
      return newModels;
    }, []));

    collection.$namespace.publish('_.reset', { newModels: collection(), oldModels: oldModels });

    return collection();
  },
  fetch: function(options) {
    var collection = this;
    var configParams = collection.__private('configParams');
    options = options ? clone(options) : {};

    var requestInfo = {
      requestRunning: collection.isFetching,
      requestLull: configParams.requestLull,
      entity: collection,
      createRequest: function() {
        if(isUndefined(options.parse)) {
          options.parse = true;
        }

        var xhr = collection.sync('read', collection, options);

        return (xhr.done || xhr.then).call(xhr, function(resp) {
          var method = options.reset ? 'reset' : 'set';
          resp = configParams.parse(resp);
          var touchedModels = collection[method](resp, options);
          collection.$namespace.publish('_.change', { touched: touchedModels, serverResponse: resp, options: options });
        });
      }
    };

    return makeOrGetRequest('fetch', requestInfo);
  },
  where: function(modelData, options) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    options = options || {};
    modelData = castAsModelData(modelData);

    return reduce(collection(), function findModel(foundModels, model) {
      var thisModelData = castAsModelData(model);
      if(regExpIsEqual(modelData, thisModelData, options.isEqual)) {
        foundModels.push(options.getData ? thisModelData : model);
      }
      return foundModels;
    }, []);
  },
  findWhere: function(modelData, options) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    options = options || {};
    modelData = castAsModelData(modelData);

    return reduce(collection(), function findModel(foundModel, model) {
      var thisModelData = castAsModelData(model);
      if(isNull(foundModel) && regExpIsEqual(modelData, thisModelData, options.isEqual)) {
        return options.getData ? thisModelData : model;
      }
      return foundModel;
    }, null);
  },
  addModel: function(models, options) {
    var collection = this;
    var affectedModels = [];
    options = options || {};

    if(isObject(models)) {
      models = [models];
    }
    if(!isArray(models)) {
      models = !isUndefined(models) && !isNull(models) ? [models] : [];
    }

    if(models.length) {
      var collectionData = collection();
      var castAsDataModel = collection.__private('castAs').dataModel;
      var castAsModelData = collection.__private('castAs').modelData;
      var idAttribute = collection.__private('getIdAttribute')();

      if(isNumber(options.at)) {
        var newModels = map(models, castAsDataModel);

        collectionData.splice.apply(collectionData, [options.at, 0].concat(newModels));
        affectedModels.concat(newModels);
        collection.$namespace.publish('_.add', newModels);

        collection.valueHasMutated();
      } else {
        each(models, function checkModelPresence(modelData) {
          var modelPresent = false;
          var theModelData = castAsModelData(modelData);

          each(collectionData, function lookForModel(model) {
            var collectionModelData = castAsModelData(model);

            if(!isUndefined(theModelData[idAttribute]) && !isNull(theModelData[idAttribute]) && theModelData[idAttribute] === collectionModelData[idAttribute]) {
              modelPresent = true;
              if(options.merge && !sortOfEqual(theModelData, collectionModelData)) {
                // found model, but needs an update
                (model.set || noop).call(model, theModelData);
                collection.$namespace.publish('_.change', model);
                affectedModels.push(model);
              }
            }
          });

          if(!modelPresent) {
            // not found in collection, we have to add this model
            var newModel = castAsDataModel(modelData);
            collection.push(newModel);
            affectedModels.push(newModel);
          }
        });
      }
    }

    return affectedModels;
  },
  create: function(model, options) {
    var collection = this;
    var castAsDataModel = collection.__private('castAs').dataModel;
    var configParams = collection.__private('configParams');
    options = options ? clone(options) : {};

    var requestInfo = {
      requestRunning: collection.isCreating,
      requestLull: configParams.requestLull,
      entity: collection,
      allowConcurrent: true,
      createRequest: function() {
        var newModel = castAsDataModel(model);
        var xhr;

        if(isDataModel(newModel)) {
          xhr = newModel.save();

          if(options.wait) {
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

    if(!isDataModelCtor(configParams.dataModel)) {
      throw new Error('No dataModel specified, cannot create() a new collection item');
    }

    return makeOrGetRequest('create', requestInfo);
  },
  removeModel: function(models) {
    var collection = this;
    var affectedModels = [];

    if(isObject(models)) {
      models = [models];
    }
    if(!isArray(models)) {
      models = !isUndefined(models) && !isNull(models) ? [models] : [];
    }

    return reduce(models, function(removedModels, model) {
      var removed = null;
      if(isDataModel(model)) {
        removed = collection.remove(model);
      } else {
        var modelsToRemove = collection.where(model);
        if(!isNull(modelsToRemove)) {
          removed = collection.removeAll(modelsToRemove);
        }
      }

      if(!isNull(removed)) {
        return removedModels.concat(removed);
      }
      return removedModels;
    }, []);
  }
};
