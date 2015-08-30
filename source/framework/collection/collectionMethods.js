// framework/collection/collectionMethods.js
// ------------------

var collectionMethods = {
  $sync: function() {
    return fw.sync.apply(this, arguments);
  },
  $get: function(id) {
    return find(this(), function findModelWithId(model) {
      return model.$id() === id || model.$cid() === id;
    });
  },
  $set: function(newCollection) {
    var collection = this;
    var collectionStore = collection();
    var DataModelCtor = collection.__private('configParams').dataModel;
    var idAttribute = DataModelCtor.__private('configParams').idAttribute;
    var touchedModels = [];
    var absentModels = [];

    each(newCollection, function checkForAdditionsOrChanges(modelData) {
      var modelPresent = false;

      each(collectionStore, function lookForModel(model) {
        var collectionModelData = model.$get();
        var modelFields = keys(collectionModelData);

        modelData = pick(modelData, modelFields);
        if(!isUndefined(modelData[idAttribute]) && !isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
          modelPresent = true;
          if(!isEqual(modelData, collectionModelData)) {
            // found model, but needs an update
            model.$set(modelData);
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
      var collectionModelData = model.$get();
      var modelFields = filter(keys(collectionModelData), function(thing) { return thing !== idAttribute; });

      each(newCollection, function isModelPresent(modelData) {
        modelData = pick(modelData, modelFields);
        if(isEqual(modelData, omit(collectionModelData, idAttribute))) {
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
  $reset: function(newCollection) {
    var oldModels = this.removeAll();
    var DataModelCtor = this.__private('configParams').dataModel;

    this(reduce(newCollection, function(newModels, modelData) {
      newModels.push(new DataModelCtor(modelData));
      return newModels;
    }, []));

    this.$namespace.publish('_.reset', oldModels);

    return this();
  },
  $fetch: function(options) {
    options = options ? clone(options) : {};

    if(isUndefined(options.parse)) {
      options.parse = true;
    }

    var xhr = this.$sync('read', this, options);

    var collection = this;
    xhr.done(function(resp) {
      var method = options.reset ? '$reset' : '$set';
      collection[method](resp, options);
      collection.$namespace.publish('sync', collection, resp, options);
    });

    return xhr;
  },
  $get: function() {
    return reduce(this(), function(models, model) {
      models.push(model.$get());
      return models;
    }, []);
  }
};
