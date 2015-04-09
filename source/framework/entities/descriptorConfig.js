// framework/entities/descriptorConfig.js
// ------------------

//import("behavior/ViewModel.js");
//import("behavior/DataModel.js");

entityDescriptors = entityDescriptors.concat([
  {
    tagName: 'viewmodel',
    methodName: 'viewModel',
    defaultLocation: '/viewModel/',
    resource: fw.viewModels,
    mixins: [ ViewModel ],
    defaultConfig: {
      namespace: undefined,
      autoRegister: false,
      autoIncrement: false,
      mixins: undefined,
      params: undefined,
      afterInit: noop,
      afterBinding: noop,
      onDispose: noop
    }
  }, {
    tagName: 'datamodel',
    methodName: 'dataModel',
    defaultLocation: '/dataModel/',
    resource: fw.dataModels,
    mixins: [ ViewModel, DataModel ],
    debug: false,
    defaultConfig: {
      idAttribute: 'id',
      url: null,
      namespace: undefined,
      autoRegister: false,
      autoIncrement: true,
      mixins: undefined,
      params: undefined,
      afterInit: noop,
      afterBinding: noop,
      onDispose: noop
    }
  }, {
    tagName: 'router',
    methodName: 'router',
    defaultLocation: '/',
    resource: fw.routers
  }
]);
