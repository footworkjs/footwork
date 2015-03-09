// framework/init.js
// ------------------

// Record the footwork version as of this build.
fw.footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
fw.embed = embedded;

// initialize base objects which are not present in knockout
fw.viewModels = {};
fw.dataModels = {};
fw.routers = {};
fw.outlets = {};

var isViewModelCtor;
var isDataModelCtor;
var isViewModel;
var isDataModel;

var specialTagDescriptors = map([
  {
    tagName: 'viewmodel',
    methodName: 'viewModel',
    resource: fw.viewModels,
    defaultLocation: '/viewModel/',
    referenceNamespaceName: '__viewModel_reference',
    isModelDuckTag: '__isViewModel',
    isModelCtorDuckTag: '__isViewModelCtor',
    isModelCtor: isViewModelCtor = function isViewModelCtor(thing) {
      return isFunction(thing) && !!thing.__isViewModelCtor;
    },
    isModel: isViewModel = function isViewModel(thing) {
      return isObject(thing) && !!thing.__isViewModel;
    }
  }, {
    tagName: 'datamodel',
    methodName: 'dataModel',
    resource: fw.dataModels,
    defaultLocation: '/dataModel/',
    referenceNamespaceName: '__dataModel_reference',
    isModelDuckTag: '__isDataModel',
    isModelCtorDuckTag: '__isDataModelCtor',
    isModelCtor: isDataModelCtor = function isDataModelCtor(thing) {
      return isFunction(thing) && !!thing.__isDataModelCtor;
    },
    isModel: isDataModel = function isDataModel(thing) {
      return isObject(thing) && !!thing.__isDataModel;
    }
  }, {
    tagName: 'router',
    resource: fw.routers,
    defaultLocation: '/',
    referenceNamespaceName: '__router_reference'
  }
], function prepareDescriptor(descriptor) {
  return extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js')
  }, descriptor);
});
