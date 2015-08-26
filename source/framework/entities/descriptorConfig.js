// framework/entities/descriptorConfig.js
// ------------------

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
      extend: {},
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
      pkInURL: true,
      parse: false,
      namespace: undefined,
      autoRegister: false,
      autoIncrement: true,
      extend: {},
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
      namespace: '$router',
      autoRegister: false,
      autoIncrement: false,
      showDuringLoad: noComponentSelected,
      extend: {},
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
