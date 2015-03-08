// misc/core-init.js
// ------------------

// initialize base objects which are not present in knockout
fw.viewModels = {};
fw.dataModels = {};
fw.routers = {};

function prepDescriptor(descriptor) {
  return extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js')
  }, descriptor);
}

var specialTagDescriptors = map([
  {
    tagName: 'viewmodel',
    factoryName: 'viewModel',
    resource: fw.viewModels,
    defaultLocation: '/viewModel/',
    referenceNamespaceName: '__viewModel_reference',
    isModelDuckTag: '__isViewModel',
    isModelCtorDuckTag: '__isViewModelCtor',
    isModelCtor: isViewModelCtor
  }, {
    tagName: 'datamodel',
    factoryName: 'dataModel',
    resource: fw.dataModels,
    defaultLocation: '/dataModel/',
    referenceNamespaceName: '__dataModel_reference',
    isModelDuckTag: '__isDataModel',
    isModelCtorDuckTag: '__isDataModelCtor',
    isModelCtor: isDataModelCtor
  }, {
    tagName: 'router',
    resource: fw.routers,
    defaultLocation: '/',
    referenceNamespaceName: '__router_reference'
  }
], prepDescriptor);
