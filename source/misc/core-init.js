// misc/core-init.js
// ------------------

// initialize base objects which are not present in knockout
fw.viewModels = {};
fw.dataModels = {};
fw.routers = {};

var specialTagDescriptors = [
  {
    referenceNamespaceName: '__viewModel_reference',
    isModelDuckTag: '__isViewModel',
    isModelCtorDuckTag: '__isViewModelCtor',
    isModelCtor: isViewModelCtor,
    tagName: 'viewmodel',
    factoryName: 'viewModel',
    resource: fw.viewModels,
    defaultLocation: '/viewModel/',
    fileExtensions: fw.observable('.js'),
    resourceLocations: {},
    registered: {}
  }, {
    referenceNamespaceName: '__dataModel_reference',
    isModelDuckTag: '__isDataModel',
    isModelCtorDuckTag: '__isDataModelCtor',
    isModelCtor: isDataModelCtor,
    tagName: 'datamodel',
    factoryName: 'dataModel',
    resource: fw.dataModels,
    defaultLocation: '/dataModel/',
    fileExtensions: fw.observable('.js'),
    resourceLocations: {},
    registered: {}
  }, {
    referenceNamespaceName: '__router_reference',
    tagName: 'router',
    resource: fw.routers,
    defaultLocation: '/',
    fileExtensions: fw.observable('.js'),
    resourceLocations: {},
    registered: {}
  }
];
