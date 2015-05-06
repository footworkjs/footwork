// framework/entities/init.js
// ----------------

function makeBooleanChecks(descriptor) {
  return {
    isEntityCtor: function isEntityCtor(thing) {
      return isFunction(thing) && !!thing[ descriptor.isEntityCtorDuckTag ];
    },
    isEntity: function isEntity(thing) {
      return isObject(thing) && !!thing[ descriptor.isEntityDuckTag ];
    }
  };
}

entityDescriptors = map(entityDescriptors, function prepareDescriptor(descriptor) {
  descriptor = extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    isEntityCtorDuckTag: '__isEntityCtor',
    isEntityDuckTag: '__isEntity',
    referenceNamespace: (isString(descriptor.methodName) ? ('__' + descriptor.methodName + 'Reference') : undefined)
  }, descriptor);

  return extend(descriptor, makeBooleanChecks(descriptor));
});

extend(entityDescriptors, {
  tagNameIsPresent: function isEntityTagNameDescriptorPresent(tagName) {
    return filter(this, function matchingTagNames(descriptor) {
      return descriptor.tagName === tagName;
    }).length > 0;
  },
  resourceFor: function getResourceForEntityTagName(tagName) {
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
