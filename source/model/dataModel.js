// dataModel.js
// ------------------

// Duck type function for determining whether or not something is a footwork viewModel constructor function
function isDataModelCtor(thing) {
  return isFunction(thing) && !!thing.__isDataModelCtor;
}

// Duck type function for determining whether or not something is a footwork dataModel
function isDataModel(thing) {
  return isObject(thing) && !!thing.__isDataModel;
}

var dataModelReferenceNamespace = '__dataModel_reference';

fw.dataModels = {};

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all viewModel references is returned.
var getDataModels = fw.dataModels.getAll = model.makeGetAll(dataModelReferenceNamespace);

// Make a dataModel factory
var makeDataModel = fw.dataModel = model.makeViewModelFactory({
  referenceNamespaceName: dataModelReferenceNamespace,
  isModelDuckTag: '__isDataModel',
  isModelCtorDuckTag: '__isDataModelCtor',
  isModelCtor: isDataModelCtor,
  isRegistered: isRegisteredDataModel,
  getRegistered: getRegisteredDataModel,
  register: registerDataModel
});
