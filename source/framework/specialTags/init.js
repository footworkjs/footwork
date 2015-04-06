// framework/specialTags/init.js
// ----------------

function makeBooleanChecks(descriptor) {
  return {
    isModelCtor: function isModelCtor(thing) {
      return isFunction(thing) && !!thing[ descriptor.isModelCtorDuckTag ];
    },
    isModel: function isModel(thing) {
      return isObject(thing) && !!thing[ descriptor.isModelDuckTag ];
    }
  };
}

specialTagDescriptors = map(specialTagDescriptors, function prepareDescriptor(descriptor) {
  descriptor = extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    isModelCtorDuckTag: '__isModelCtor',
    isModelDuckTag: '__isModel',
    referenceNamespace: (isString(descriptor.methodName) ? ('__' + descriptor.methodName + 'Reference') : undefined)
  }, descriptor);

  return extend(descriptor, makeBooleanChecks(descriptor));
});

extend(specialTagDescriptors, {
  tagNameIsPresent: function isSpecialTagDescriptorPresent(tagName) {
    return filter(this, function matchingTagNames(descriptor) {
      return descriptor.tagName === tagName;
    }).length > 0;
  },
  resourceFor: function getResourceForSpecialTag(tagName) {
    return reduce(this, function(resource, descriptor) {
      if(descriptor.tagName === tagName) {
        resource = descriptor.resource;
      }
      return resource;
    }, null);
  },
  getDescriptor: function getDescriptor(methodName) {
    return reduce(this, function reduceDescriptor(foundDescriptor, descriptor) {
      return descriptor.methodName === methodName ? descriptor : foundDescriptor;
    }, null);
  }
});
