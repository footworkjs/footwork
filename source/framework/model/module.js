// framework/model/module.js
// ------------------

//import("lifecycle.js");
//import("applyBinding.js");
//import("classMethod.js");

filter(specialTagDescriptors, function onlyDescriptorsWithMethodName(descriptor) {
  return !isUndefined(descriptor.methodName);
}).forEach(function setupFactoryMethod(descriptor) {
  switch(descriptor.methodName) {
    case 'router':
      fw[descriptor.methodName] = function( routerConfig ) {
        return fw.viewModel({
          router: routerConfig
        });
      };
      break;

    default:
      // Make a class method for this descriptor on the root fw object
      fw[descriptor.methodName] = modelClassMethod.bind(null, descriptor);
      break;
  }
});
