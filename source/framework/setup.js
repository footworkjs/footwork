// framework/setup.js
// ----------------

function isModelCtor(thing) {
  return isFunction(thing) && !!thing.__isModelCtor;
}

function isModel(thing) {
  return isObject(thing) && !!thing.__isModel;
}

function makeDescriptorTags(descriptor) {
  var tags = {};
  if( isString(descriptor.methodName) ) {
    var name = capitalizeFirstLetter(descriptor.methodName);
    extend(tags, {
      referenceNamespaceName: '__' + name + 'Reference',
      isModelCtorDuckTag: '__isModelCtor',
      isModelDuckTag: '__isModel',
      isModelCtor: isModelCtor,
      isModel: isModel
    });
  }
  return tags;
}

specialTagDescriptors = map(specialTagDescriptors, function prepareDescriptor(descriptor) {
  return extend({
      resourceLocations: {},
      registered: {},
      fileExtensions: fw.observable('.js')
    },
    makeDescriptorTags(descriptor),
    descriptor);
});

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
