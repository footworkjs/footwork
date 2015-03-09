// framework/model/createFactories.js
// ------------------

// create the class factory method for each specialTag descriptor
filter(specialTagDescriptors, function getOnlyDescriptorsWithMethodName(descriptor) {
  return isString(descriptor.methodName);
}).forEach(function setupModelFactoryMethod(descriptor) {
  switch(descriptor.methodName) {
    case 'router':
      fw[descriptor.methodName] = function routerClassFactory(routerConfig) {
        return fw.viewModel({ router: routerConfig });
      };
      break;

    default:
      fw[descriptor.methodName] = modelClassFactory.bind(null, descriptor);
      break;
  }
});
