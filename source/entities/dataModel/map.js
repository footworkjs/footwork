var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');

function idAttributePath (dataModel) {
  return dataModel[privateDataSymbol].configParams.idAttribute;
}

function evalDirtyState (dataModel) {
  var mappings = dataModel[privateDataSymbol].mappings();
  return _.reduce(mappings, function(dirty, mappedObservable, path) {
    return dirty || mappedObservable.isDirty();
  }, false);
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

  if (!fw.isDataModel(dataModel)) {
    throw Error('No dataModel context supplied for map observable');
  }

  if (mapPath === idAttributePath(dataModel)) {
    dataModel[privateDataSymbol].idAttributeObservable = mappedObservable;
    dataModel.isNew(!mappedObservable());

    // dispose of the old primary key subscription and create subscription to new primary key observable
    dataModel[privateDataSymbol].idAttributeSubscription && dataModel[privateDataSymbol].idAttributeSubscription.dispose();
    dataModel[privateDataSymbol].idAttributeSubscription = mappedObservable.subscribe(function determineIfModelIsNew (idAttributeValue) {
      dataModel.isNew(!idAttributeValue);
    });
  }

  mappedObservable.isDirty = fw.observable(false);
  var changeSubscription = mappedObservable.subscribe(function (value) {
    dataModel.$namespace.publish('_.change', { param: mapPath, value: value });
    mappedObservable.isDirty(true);
  });
  var isDirtySubscription = mappedObservable.isDirty.subscribe(function (isDirty) {
    dataModel.isDirty(evalDirtyState(dataModel));
  });

  var disposeObservable = mappedObservable.dispose || _.noop;
  mappedObservable.dispose = function () {
    dataModel[privateDataSymbol].idAttributeSubscription && dataModel[privateDataSymbol].idAttributeSubscription.dispose();
    changeSubscription.dispose();
    isDirtySubscription.dispose();
    disposeObservable.call(mappedObservable);
  };

  dataModel[privateDataSymbol].mappings()[mapPath] = mappedObservable;
  dataModel[privateDataSymbol].mappings.valueHasMutated();

  return mappedObservable;
}

fw.subscribable.fn.map = map;
