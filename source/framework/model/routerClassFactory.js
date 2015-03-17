// framework/model/routerClassFactory.js
// ------------------

function routerClassFactory(routerConfig) {
  var viewModel = fw.viewModel({
    router: routerConfig
  });

  if( routerConfig.autoRegister ) {
    var namespace = routerConfig.namespace;
    if( fw.routers.isRegistered(namespace) ) {
      if( fw.routers.getRegistered(namespace) !== this ) {
        throw new Error('"' + namespace + '" has already been registered as a router, autoRegister failed.');
      }
    } else {
      fw.routers.register(namespace, viewModel);
    }
  }

  return viewModel;
}
