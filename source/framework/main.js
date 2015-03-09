// framework/main.js
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

var noComponentSelected = '_noComponentSelected';
var hasHTML5History;
var originalApplyBindings;

// Components which footwork will not wrap in the $life custom binding used for lifecycle events
// Used to keep the wrapper off of internal/natively handled and defined components such as 'outlet'
var nativeComponents = [];

var specialTagDescriptors = [
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
    methodName: 'router',
    resource: fw.routers,
    defaultLocation: '/',
    referenceNamespaceName: '__router_reference'
  }
];

//import("utility.js");
//import("setup.js");
//import("namespace/module.js");
//import("resource/module.js");
//import("broadcastable-receivable/module.js");
//import("model/module.js");
//import("router/module.js");
//import("component/module.js");

//import("specialTags.js");
//import("start.js");
