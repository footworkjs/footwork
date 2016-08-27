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
  var methodName = descriptor.methodName.charAt(0).toUpperCase() + descriptor.methodName.slice(1);
  descriptor = extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    isEntityCtorDuckTag: '__is' + methodName + 'Ctor',
    isEntityDuckTag: '__is' + methodName,
    referenceNamespace: (isString(descriptor.methodName) ? ('__' + descriptor.methodName + 'Reference') : undefined)
  }, descriptor);

  return extend(descriptor, makeBooleanChecks(descriptor));
});

extend(entityDescriptors, {
  getTags: function() {
    return map(this, function(descriptor) {
      return descriptor.tagName;
    });
  },
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

function getEntityComparator(methodName, compFunctions, entityDescriptor) {
  if(isFunction(entityDescriptor[methodName])) {
    compFunctions.push(entityDescriptor[methodName]);
  }
  return compFunctions;
}

runPostInit.unshift(function() {
  var entityCtorComparators = map(entityDescriptors, 'isEntityCtor');
  var entityComparators = map(entityDescriptors, 'isEntity');

  isEntityCtor = function(thing) {
    return reduce(entityCtorComparators, function(isThing, comparator) {
      return isThing || comparator(thing);
    }, false);
  };

  isEntity = function(thing) {
    return reduce(entityComparators, function(isThing, comparator) {
      return isThing || comparator(thing);
    }, false);
  };

  isDataModel = entityDescriptors.getDescriptor('dataModel').isEntity;
  isDataModelCtor = entityDescriptors.getDescriptor('dataModel').isEntityCtor;
  isRouter = entityDescriptors.getDescriptor('router').isEntity;
});
