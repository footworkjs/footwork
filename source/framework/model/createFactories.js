// framework/model/createFactories.js
// ------------------

createFactories = function(descriptors) {
  // create the class factory method for each entity descriptor
  filter(descriptors, function getOnlyDescriptorsWithMethodName(descriptor) {
    return isString(descriptor.methodName);
  }).forEach(function setupFactoryMethod(descriptor) {
    switch(descriptor.methodName) {
      case 'router':
        fw[descriptor.methodName] = routerClassFactory;
        break;

      default:
        fw[descriptor.methodName] = modelClassFactory.bind(null, descriptor);
    }
  });
};
