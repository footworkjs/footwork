var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;

function getPrimaryKey (dataModel) {
  return dataModel[privateDataSymbol].configParams.idAttribute;
}

/**
 * Take the desired mapPath and wire it into the dataModel. This enables footwork to hook into
 * your observables and map their values back to its POJO form and for communication with the server.
 *
 * @param {string} mapPath The path you wish to map
 * @param {object} dataModel The dataModel instance you are mapping the observable/path to
 * @returns {observable} The mapped observable
 */
function mapTo(mapPath, dataModel) {
  var mappedObservable = this;
  var mapPath;
  var dataModel;

  if (!fw.isDataModel(dataModel)) {
    throw new Error('No dataModel context supplied for mapTo observable');
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
    dataModel.isNew = fw.computed(function() {
      return !!dataModel.$id();
    });
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
}

fw.subscribable.fn.mapTo = mapTo;
