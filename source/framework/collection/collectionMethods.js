// framework/collection/collectionMethods.js
// ------------------

var collectionMethods = {
  sync: function() {
    return fw.sync.apply(this, arguments);
  },
  get: function(id) {
    return find(this(), function findModelWithId(model) {
      return model.$id() === id || model.$cid() === id;
    });
  },
  set: function(newCollection) {
    var collection = this;
    var collectionStore = collection();
    var DataModelCtor = collection.__private('configParams').dataModel;
    var idAttribute = DataModelCtor.__private('configParams').idAttribute;
    var touchedModels = [];
    var absentModels = [];

    each(newCollection, function checkModelPresence(modelData) {
      var modelPresent = false;

      each(collectionStore, function lookForModel(model) {
        var collectionModelData = model.get();
        var modelFields = keys(collectionModelData);

        modelData = pick(modelData, modelFields);
        if(!isUndefined(modelData[idAttribute]) && !isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
          modelPresent = true;
          if(!isEqual(modelData, collectionModelData)) {
            // found model, but needs an update
            model.set(modelData);
            collection.$namespace.publish('_.change', model);
            touchedModels.push(model);
          }
        }
      });

      if(!modelPresent) {
        // not found in collection, we have to add this model
        var newModel = new DataModelCtor(modelData);
        collection.push(newModel);
        touchedModels.push(newModel);
      }
    });

    each(collectionStore, function checkForRemovals(model) {
      var modelPresent = false;
      var collectionModelData = model.get();

      each(newCollection, function isModelPresent(modelData) {
        if(sortOfEqual(modelData, collectionModelData)) {
          modelPresent = true;
        }
      });

      if(!modelPresent) {
        absentModels.push(model);
        touchedModels.push(model);
      }
    });

    if(absentModels.length) {
      collection.removeAll(absentModels);
    }

    return touchedModels;
  },
  reset: function(newCollection) {
    var oldModels = this.removeAll();
    var DataModelCtor = this.__private('configParams').dataModel;

    this(reduce(newCollection, function(newModels, modelData) {
      newModels.push(new DataModelCtor(modelData));
      return newModels;
    }.bind(this), []));

    this.$namespace.publish('_.reset', oldModels);

    return this();
  },
  fetch: function(options) {
    options = options ? clone(options) : {};

    if(isUndefined(options.parse)) {
      options.parse = true;
    }

    var xhr = this.sync('read', this, options);

    var collection = this;
    xhr.done(function(resp) {
      var method = options.reset ? 'reset' : 'set';
      collection[method](resp, options);
      collection.$namespace.publish('sync', collection, resp, options);
    });

    return xhr;
  },
  get: function() {
    return reduce(this(), function(models, model) {
      models.push(model.get());
      return models;
    }, []);
  },
  where: function(modelData) {
    return reduce(this(), function findModel(foundModel, model) {
      var collectionModelData = model.get();

      each(modelData, function lookForModel(individualModelData) {
        if(sortOfEqual(individualModelData, collectionModelData)) {
          foundModel.push(model);
        }
      });

      return foundModel;
    }, []);
  },
  findWhere: function(modelData) {
    return reduce(this(), function findModel(foundModel, model) {
      if(isNull(foundModel)) {
        if(sortOfEqual(modelData, model.get())) {
          return model;
        }
      }
      return foundModel;
    }, null);
  },
  add: function(models, options) {
    var touchedModels = [];
    options = options || {};

    if(isObject(models)) {
      models = [models];
    }
    if(!isArray(models)) {
      models = !isUndefined(models) && !isNull(models) ? [models] : [];
    }

    if(models.length) {
      var collection = this;
      var collectionData = collection();
      var DataModelCtor = this.__private('configParams').dataModel;
      var idAttribute = DataModelCtor.__private('configParams').idAttribute;

      if(isNumber(options.at)) {
        var newModels = map(models, function(modelData) {
          return new DataModelCtor(modelData);
        });

        collectionData.splice.apply(collectionData, [options.at, 0].concat(newModels));
        touchedModels.concat(newModels);

        collection.valueHasMutated();
      } else {
        each(models, function checkModelPresence(modelData) {
          var modelPresent = false;

          each(collectionData, function lookForModel(model) {
            var collectionModelData = model.get();

            if(!isUndefined(modelData[idAttribute]) && !isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
              modelPresent = true;
              if(!sortOfEqual(modelData, collectionModelData) && options.merge) {
                // found model, but needs an update
                model.set(modelData);
                collection.$namespace.publish('_.change', model);
                touchedModels.push(model);
              }
            }
          });

          if(!modelPresent) {
            // not found in collection, we have to add this model
            var newModel = new DataModelCtor(modelData);
            collection.push(newModel);
            touchedModels.push(newModel);
          }
        });
      }
    }

    return touchedModels;
  },
  removeModel: function(models) {
    var collection = this;
    var touchedModels = [];

    if(isObject(models)) {
      models = [models];
    }
    if(!isArray(models)) {
      models = !isUndefined(models) && !isNull(models) ? [models] : [];
    }

    each(models, function(modelData) {
      if(isDataModel(modelData)) {
        collection.remove(modelData);
      } else {
        var modelToRemove = collection.findWhere(modelData);
        !isNull(modelToRemove) && collection.remove(modelToRemove);
      }
    });
  }
};
