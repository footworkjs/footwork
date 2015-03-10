// framework/specialTags/init.js
// ----------------

function makeBooleanChecks(descriptor) {
  var booleanFunctions = {};

  booleanFunctions.isModelCtor = function(thing) {
    return isFunction(thing) && !!thing[ descriptor.isModelCtorDuckTag ];
  };

  booleanFunctions.isModel = function(thing) {
    return isFunction(thing) && !!thing[ descriptor.isModelDuckTag ];
  };

  return booleanFunctions;
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
  getDescriptor: function(methodName) {
    return reduce(this, function findDescriptor(foundDescriptor, descriptor) {
      return descriptor.methodName === methodName ? descriptor : foundDescriptor;
    }, null);
  }
});
