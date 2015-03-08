// model/module.js
// ------------------

//import("lifecycle-applyBinding.js");
//import("factory.js");

filter(specialTagDescriptors, function(descriptor) {
  // we only want the descriptors that have a factoryName on them
  return !isUndefined(descriptor.factoryName);
}).forEach(function(descriptor) {
  // Make a factory for this descriptor on the root fw object
  fw[descriptor.factoryName] = modelFactory.bind(descriptor);
});
