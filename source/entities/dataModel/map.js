var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');

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
function map (mapPath, dataModel) {
  var mappedObservable = this;
  var mapPath;

  if (!fw.isDataModel(dataModel)) {
    throw Error('No dataModel context supplied for map observable');
  }

  var mappings = dataModel[privateDataSymbol].mappings();
  var primaryKey = getPrimaryKey(dataModel);

  // add/set the registry entry for the mapped observable
  mappings[mapPath] = mappedObservable;

  if (mapPath === primaryKey) {
    // mapping primary key, update/set the $id property on the dataModel
    dataModel.$id = mappings[mapPath];

    if (fw.isObservable(dataModel.isNew) && _.isFunction(dataModel.isNew.dispose)) {
      dataModel.isNew.dispose();
    }
    dataModel.isNew = fw.computed(function() {
      return !dataModel.$id();
    });
  }

  mappedObservable.isDirty = fw.observable(false);
  var changeSubscription = mappedObservable.subscribe(function (value) {
    dataModel.$namespace.publish('_.change', { param: mapPath, value: value });
    mappedObservable.isDirty(true);
  });

  var disposeObservable = mappedObservable.dispose || _.noop;
  mappedObservable.dispose = function () {
    changeSubscription.dispose();
    disposeObservable.call(mappedObservable);
  };

  dataModel[privateDataSymbol].mappings.valueHasMutated();

  return mappedObservable;
}

fw.subscribable.fn.map = map;
