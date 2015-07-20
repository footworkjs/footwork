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
    var collectionChanged = false;
    var collectionStore = this();
    var DataModelCtor = this.__getConfigParams().dataModel;
    var modelFields;
    var idAttribute;
    var touchedModels = [];

    // remove any models present that are not in the new collection or update them if needed
    var absentModels = [];
    each(collectionStore, function removeNonPresentModels(model) {
      var modelPresent = false;
      var collectionModelData = model.$toJS();

      if(isUndefined(modelFields)) {
        modelFields = keys(collectionModelData);
        idAttribute = model.__getConfigParams().idAttribute;
      }

      each(newCollection, function isThisModel(modelData) {
        modelData = pick(modelData, modelFields);
        if(isEqual(modelData, collectionModelData)) {
          // found identical model
          modelPresent = true;
        } else if(modelData[idAttribute] === collectionModelData[idAttribute]) {
          // found model, but needs an update
          modelPresent = true;
          model.$set(modelData);
          this.$namespace.publish('_.change', model);
          touchedModels.push(model);
        }
      });

      if(!modelPresent) {
        // not found, must remove this model from our collection
        this.$namespace.publish('_.remove', model);
        absentModels.push(model);
        touchedModels.push(model);
      }
    }, this);
    this.removeAll(absentModels);

    // add in any new models
    each(newCollection, function addNewModelToCollection(modelData) {
      if(isUndefined(modelData[idAttribute]) || isNull(modelData[idAttribute])) {
        // new model
        var newModel = new DataModelCtor(modelData);
        collectionStore.push(newModel);
        this.$namespace.publish('_.add', newModel);
        collectionChanged = true;
        touchedModels.push(newModel);
      }
    }, this);

    collectionChanged && this.valueHasMutated();

    return touchedModels;
  },
  $reset: function(newCollection) {
    var oldModels = this();

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
  $toJS: function() {
    return reduce(this(), function(models, model) {
      models.push(model.$toJS());
      return models;
    }, []);
  },
  $toJSON: function() {
    return JSON.stringify(this.$toJS());
  }
};
