// framework/setup.js
// ----------------

function makeDescriptorTags(descriptor) {
  var tags = {};
  if( isString(descriptor.methodName) ) {
    var name = capitalizeFirstLetter(descriptor.methodName);
    extend(tags, {
      isModelDuckTag: '__is' + name,
      isModelCtorDuckTag: '__is' + name + 'Ctor',
      referenceNamespaceName: '__' + name + 'Reference'
    });
  }
  return tags;
}

function prepareDescriptor(descriptor) {
  return extend({
      resourceLocations: {},
      registered: {},
      fileExtensions: fw.observable('.js')
    },
    makeDescriptorTags(descriptor),
    descriptor);
}

specialTagDescriptors = map(specialTagDescriptors, prepareDescriptor);

extend(specialTagDescriptors, {
  tagNameIsPresent: function isSpecialTagDescriptorPresent(tagName) {
    return filter(specialTagDescriptors, function matchingTagNames(descriptor) {
      return descriptor.tagName === tagName;
    }).length > 0;
  },
  resourceFor: function getResourceForSpecialTag(tagName) {
    return reduce(specialTagDescriptors, function(resource, descriptor) {
      if(descriptor.tagName === tagName) {
        resource = descriptor.resource;
      }
      return resource;
    }, null);
  }
});
