// framework/collection/collectionMethods.js
// ------------------

var collectionMethods = fw.collection.methods = {
  sync: function() {
    var collection = this;
    return fw.sync.apply(collection, arguments);
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
    var collection = this;
    var collectionStore = collection();
    var castAsDataModel = collection.__private('castAs').dataModel;
    var castAsModelData = collection.__private('castAs').modelData;
    var idAttribute = collection.__private('getIdAttribute')();
    var affectedModels = [];
    var absentModels = [];
    options = options || {};

    each(newCollection, function checkModelPresence(modelData) {
      var modelPresent = false;
      modelData = castAsModelData(modelData);

      if(!isUndefined(modelData)) {
        each(collectionStore, function lookForModel(model) {
          var collectionModelData = castAsModelData(model);

          if(!isUndefined(modelData[idAttribute]) && !isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
            modelPresent = true;
            if(options.merge !== false && !sortOfEqual(collectionModelData, modelData)) {
              // found model, but needs an update
              model.set(modelData);
              collection.$namespace.publish('_.change', model);
              affectedModels.push(model);
            }
          }
        });

        if(!modelPresent && options.add !== false) {
          // not found in collection, we have to add this model
          var newModel = castAsDataModel(modelData);
          collection.push(newModel);
          affectedModels.push(newModel);
        }
      }
    });

    if(options.remove !== false) {
      each(collectionStore, function checkForRemovals(model) {
        var collectionModelData = castAsModelData(model);
        var modelPresent = reduce(newCollection, function(isPresent, modelData) {
          return isPresent || result(modelData, idAttribute) === collectionModelData[idAttribute];
        }, !isUndefined(collectionModelData[idAttribute]) ? false : true);

        if(!modelPresent) {
          // model currently in collection not found in the supplied newCollection so we need to mark it for removal
          absentModels.push(model);
          affectedModels.push(model);
        }
      });

      if(absentModels.length) {
        collection.removeAll(absentModels);
      }
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
    options = options ? clone(options) : {};

    if(isUndefined(options.parse)) {
      options.parse = true;
    }

    var xhr = collection.sync('read', collection, options);

    xhr.done(function(resp) {
      var method = options.reset ? 'reset' : 'set';
      resp = collection.__private('configParams').parse(resp);
      var touchedModels = collection[method](resp, options);
      collection.$namespace.publish('_.change', { touched: touchedModels, serverResponse: resp, options: options });
    });

    return xhr;
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
                model.set(theModelData);
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

    if(!isDataModelCtor(collection.__private('configParams').dataModel)) {
      throw new Error('No dataModel specified, cannot create() a new collection item');
    }

    var castAsDataModel = collection.__private('castAs').dataModel;
    options = options || {};

    var newModel = castAsDataModel(model);
    var modelSavePromise = null;

    if(isDataModel(newModel)) {
      modelSavePromise = newModel.save();

      if(options.wait) {
        modelSavePromise.done(function() {
          collection.addModel(newModel);
        });
      } else {
        collection.addModel(newModel)
      }
    } else {
      collection.addModel(newModel);
    }

    return modelSavePromise;
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
