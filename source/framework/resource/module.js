//import("proto.js");
//import("component.js");

// framework/resource/module.js
// ------------------

each(specialTagDescriptors, function(descriptor) {
  if(!isUndefined(descriptor.resource)) {
    extend(descriptor.resource, resourceFactory(descriptor));
  }
});
