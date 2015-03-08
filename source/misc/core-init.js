// misc/core-init.js
// ------------------

// initialize base objects which are not present in knockout
fw.viewModels = {};
fw.dataModels = {};
fw.routers = {};

var viewModelConfig = {
  referenceNamespaceName: '__viewModel_reference',
  isModelDuckTag: '__isViewModel',
  isModelCtorDuckTag: '__isViewModelCtor',
  isModelCtor: isViewModelCtor,
  tagName: 'viewmodel',
  resource: fw.viewModels,
  defaultLocation: '/viewModel/',
  fileExtensions: fw.observable('.js'),
  resourceLocations: {},
  registeredModels: {}
};

var dataModelConfig = {
  referenceNamespaceName: '__dataModel_reference',
  isModelDuckTag: '__isDataModel',
  isModelCtorDuckTag: '__isDataModelCtor',
  isModelCtor: isDataModelCtor,
  tagName: 'datamodel',
  resource: fw.dataModels,
  defaultLocation: '/dataModel/',
  fileExtensions: fw.observable( '.js' ),
  resourceLocations: {},
  registeredModels: {}
};
