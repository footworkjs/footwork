// resource/module.js
// ------------------

//import("proto.js");
//import("component.js");

each(specialTagDescriptors, function(descriptor) {
  if(!isUndefined(descriptor.resource)) {
    extend(descriptor.resource, getSimpleResourceMethods(descriptor));
  }
});
