// model/module.js
// ------------------

//import("lifecycle.js");
//import("applyBinding.js");
//import("classMethod.js");

filter(specialTagDescriptors, function(descriptor) {
  // we only want the descriptors that have a methodName on them
  return !isUndefined(descriptor.methodName);
}).forEach(function(descriptor) {
  // Make a class method for this descriptor on the root fw object
  fw[descriptor.methodName] = modelClassMethod.bind(descriptor);
});
