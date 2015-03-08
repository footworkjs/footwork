// viewModel.js
// ------------------

// Duck type function for determining whether or not something is a footwork viewModel constructor function
function isViewModelCtor(thing) {
  return isFunction(thing) && !!thing.__isViewModelCtor;
}

// Duck type function for determining whether or not something is a footwork viewModel
function isViewModel(thing) {
  return isObject(thing) && !!thing.__isViewModel;
}

var viewModelReferenceNamespace = '__viewModel_reference';

fw.viewModels = {};

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all viewModel references is returned.
var getViewModels = fw.viewModels.getAll = model.makeGetAll(viewModelReferenceNamespace);

// Make a viewModel factory
var makeViewModel = fw.viewModel = model.makeViewModelFactory({
  referenceNamespaceName: viewModelReferenceNamespace,
  isModelDuckTag: '__isViewModel',
  isModelCtorDuckTag: '__isViewModelCtor',
  isModelCtor: isViewModelCtor,
  isRegistered: isRegisteredViewModel,
  getRegistered: getRegisteredViewModel,
  register: registerViewModel
});
