// framework/entities/descriptorConfig.js
// ------------------

function resolveEntityImmediately(resolveNow) {
  resolveNow(true);
}

entityDescriptors = entityDescriptors.concat([
  {
    tagName: 'viewmodel',
    methodName: 'viewModel',
    defaultLocation: '/viewModel/',
    resource: fw.viewModel,
    behavior: [ ViewModel ],
    defaultConfig: {
      namespace: undefined,
      autoRegister: false,
      autoIncrement: false,
      extend: {},
      mixins: undefined,
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop
    }
  }, {
    tagName: 'datamodel',
    methodName: 'dataModel',
    defaultLocation: '/dataModel/',
    resource: fw.dataModel,
    behavior: [ ViewModel, DataModel ],
    defaultConfig: {
      idAttribute: 'id',
      url: null,
      useKeyInUrl: true,
      parse: false,
      ajaxOptions: {},
      namespace: undefined,
      autoRegister: false,
      autoIncrement: false,
      extend: {},
      mixins: undefined,
      requestLull: undefined,
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop
    }
  }, {
    tagName: 'router',
    methodName: 'router',
    defaultLocation: '/',
    resource: fw.router,
    behavior: [ ViewModel, Router ],
    defaultConfig: {
      namespace: '$router',
      autoRegister: false,
      autoIncrement: false,
      showDuringLoad: noComponentSelected,
      extend: {},
      mixins: undefined,
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop,
      baseRoute: null,
      isRelative: true,
      activate: true,
      beforeRoute: null,
      minTransitionPeriod: 0,
      routes: []
    }
  }
]);
