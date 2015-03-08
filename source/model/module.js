// model/module.js
// ------------------

//import("lifecycle-applyBinding.js");
//import("factories.js");

filter(specialTagDescriptors, function(descriptor) {
  // we only want the descriptors that have a factoryName on them
  return !isUndefined(descriptor.factoryName);
}).forEach(function(descriptor) {
  // Returns a reference to the specified models.
  // If no name is supplied, a reference to an array containing all viewModel references is returned.
  descriptor.resource['getAll'] = modelGetAll.bind(descriptor);

  // Make a factory for this descriptor on the root fw object
  fw[descriptor.factoryName] = modelFactory.bind(descriptor);
});
