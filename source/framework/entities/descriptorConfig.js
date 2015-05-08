// framework/entities/descriptorConfig.js
// ------------------

//import("behavior/ViewModel.js");
//import("behavior/DataModel.js");
//import("behavior/Router.js");

entityDescriptors = entityDescriptors.concat([
  {
    tagName: 'viewmodel',
    methodName: 'viewModel',
    defaultLocation: '/viewModel/',
    resource: fw.viewModels,
    behavior: [ ViewModel ],
    defaultConfig: {
      namespace: undefined,
      autoRegister: false,
      autoIncrement: false,
      mixins: undefined,
      afterBinding: noop,
      onDispose: noop
    }
  }, {
    tagName: 'datamodel',
    methodName: 'dataModel',
    defaultLocation: '/dataModel/',
    resource: fw.dataModels,
    behavior: [ ViewModel, DataModel ],
    defaultConfig: {
      idAttribute: 'id',
      url: null,
      namespace: undefined,
      autoRegister: false,
      autoIncrement: true,
      mixins: undefined,
      afterBinding: noop,
      onDispose: noop
    }
  }, {
    tagName: 'router',
    methodName: 'router',
    defaultLocation: '/',
    resource: fw.routers,
    behavior: [ ViewModel, Router ],
    defaultConfig: {
      idAttribute: 'id',
      namespace: '$router',
      autoRegister: false,
      autoIncrement: false,
      mixins: undefined,
      afterBinding: noop,
      onDispose: noop,
      baseRoute: null,
      isRelative: true,
      activate: true,
      routes: []
    }
  }
]);
