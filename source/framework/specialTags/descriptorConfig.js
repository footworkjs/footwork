// framework/specialTags/descriptorConfig.js
// ------------------

//import("ViewModel.js");
//import("DataModel.js");

specialTagDescriptors = specialTagDescriptors.concat([
  {
    tagName: 'viewmodel',
    methodName: 'viewModel',
    defaultLocation: '/viewModel/',
    resource: fw.viewModels,
    mixins: [ ViewModel ],
    defaultConfig: {
      namespace: undefined,
      name: undefined,
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
    defaultConfig: {
      namespace: undefined,
      name: undefined,
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
