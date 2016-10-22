var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var dataModelContext = require('./dataModel-context');
var dataModelIsNew = require('./data-tools').dataModelIsNew;

var isDataModel = require('../entity-tools').isDataModel;
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

function getPrimaryKey(dataModel) {
  return dataModel[privateDataSymbol].configParams.idAttribute;
}

fw.subscribable.fn.mapTo = function (option) {
  var mappedObservable = this;
  var mapPath;
  var dataModel;

  if (_.isString(option)) {
    mapPath = option;
    dataModel = dataModelContext.getCurrent();
  } else if (_.isObject(option)) {
    mapPath = option.path;
    dataModel = option.dataModel;
  } else {
    throw new Error('Invalid options supplied to mapTo');
  }

  if (!isDataModel(dataModel)) {
    throw new Error('No dataModel context found/supplied for mapTo observable');
  }

  var mappings = dataModel[privateDataSymbol].mappings();
  var primaryKey = getPrimaryKey(dataModel);

  if (!_.isUndefined(mappings[mapPath]) && _.isFunction(mappings[mapPath].dispose)) {
    // remapping a path, we need to dispose of the old one first
    mappings[mapPath].dispose();
  }

  // add/set the registry entry for the mapped observable
  mappings[mapPath] = mappedObservable;

  if (mapPath === primaryKey) {
    // mapping primary key, update/set the $id property on the dataModel
    dataModel.$id = mappings[mapPath];
    if (fw.isObservable(dataModel.isNew) && _.isFunction(dataModel.isNew.dispose)) {
      dataModel.isNew.dispose();
    }
    dataModel.isNew = fw.pureComputed(dataModelIsNew, dataModel);
  }

  mappedObservable.isDirty = fw.observable(false);
  var changeSubscription = mappedObservable.subscribe(function (value) {
    dataModel.$namespace.publish('_.change', { param: mapPath, value: value });
    mappedObservable.isDirty(true);
  });

  var disposeObservable = mappedObservable.dispose || _.noop;
  if (_.isFunction(mappedObservable.dispose)) {
    mappedObservable.dispose = function () {
      changeSubscription.dispose();
      disposeObservable.call(mappedObservable);
    };
  }

  dataModel[privateDataSymbol].mappings.valueHasMutated();

  return mappedObservable;
};
