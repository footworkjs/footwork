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

fw.viewModels = {};

var viewModelReferenceNamespace = '__model_reference';

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all viewModel references is returned.
var getViewModels = fw.viewModels.getAll = model.makeGetAll(viewModelReferenceNamespace);

// Make a viewModel factory
var makeViewModel = fw.viewModel = model.makeViewModelFactory({
  defaultConfigParams: {
    namespace: undefined,
    name: undefined,
    autoRegister: false,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    initialize: noop,
    afterInit: noop,
    afterBinding: noop,
    onDispose: noop
  },
  referenceNamespaceName: viewModelReferenceNamespace,
  isModelDuckTag: '__isViewModel',
  isModelCtorDuckTag: '__isViewModelCtor',
  isModelCtor: isViewModelCtor,
  isRegistered: isRegisteredViewModel,
  getRegistered: getRegisteredViewModel,
  register: registerViewModel
});
