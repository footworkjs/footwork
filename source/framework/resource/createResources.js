// framework/resource/createResource.js
// ------------------

// Create/extend all resource methods onto a descriptor.resource for a given descriptor inside an array of descriptors
function createResources(descriptors) {
  each(descriptors, function(descriptor) {
    if(!isUndefined(descriptor.resource)) {
      extend(descriptor.resource, resourceFactory(descriptor));
    }
  });
}

runPostInit.push(function() {
  createResources(specialTagDescriptors);
});
