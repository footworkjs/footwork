// framework/resource/proto.js
// ------------------

function isRegistered(descriptor, resourceName) {
  return !isUndefined( descriptor.registered[resourceName] );
};

function getRegistered(descriptor, resourceName) {
  return descriptor.registered[resourceName];
};

function register(descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
};

function getModelExtension(dataModelExtensions, modelName) {
  var fileExtension = '';

  if( isFunction(dataModelExtensions) ) {
    fileExtension = dataModelExtensions(modelName);
  } else if( isString(dataModelExtensions) ) {
    fileExtension = dataModelExtensions;
  }

  return fileExtension.replace(/^\./, '') || '';
}

function getModelFileName(descriptor, modelName) {
  var modelResourceLocations = descriptor.resourceLocations;
  var fileName = modelName + '.' + getModelExtension(descriptor.fileExtensions(), modelName);

  if( !isUndefined( modelResourceLocations[modelName] ) ) {
    var registeredLocation = modelResourceLocations[modelName];
    if( isString(registeredLocation) && !isPath(registeredLocation) ) {
      // full filename was supplied, lets return that
      fileName = last( registeredLocation.split('/') );
    }
  }

  return fileName;
}

function setDefaultModelLocation(descriptor, path) {
  if( isString(path) ) {
    descriptor.defaultLocation = path;
  }

  return descriptor.defaultLocation;
}

function registerModelLocation(descriptor, modelName, location) {
  if( isArray(modelName) ) {
    each(modelName, function(name) {
      registerModelLocation.call(descriptor, name, location);
    });
  }
  descriptor.resourceLocations[ modelName ] = location;
}

function modelLocationIsRegistered(descriptor, modelName) {
  return !isUndefined(descriptor.resourceLocations[modelName]);
}

function getModelResourceLocation(descriptor, modelName) {
  if( isUndefined(modelName) ) {
    return descriptor.resourceLocations;
  }
  return descriptor.resourceLocations[modelName] || descriptor.defaultLocation;
}

function getModelReferences(descriptor, namespaceName, options) {
  options = options || {};
  if( isString(namespaceName) || isArray(namespaceName) ) {
    options.namespaceName = namespaceName;
  }

  var references = reduce( $globalNamespace.request(descriptor.referenceNamespace, extend({ includeOutlets: false }, options), true), function(models, model) {
    if( !isUndefined(model) ) {
      var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if( !isNull(namespaceName) ) {
        if( isUndefined(models[namespaceName]) ) {
          models[namespaceName] = [ model ];
        } else {
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});

  var referenceKeys = keys(references);
  if(isString(namespaceName) && referenceKeys.length === 1) {
    return references[referenceKeys[0]];
  }
  return references;
}

// assemble all resource methods for a given descriptor object
function resourceFactory(descriptor) {
  var resourceMethods = {
    getFileName: getModelFileName.bind(null, descriptor),
    register: register.bind(null, descriptor),
    isRegistered: isRegistered.bind(null, descriptor),
    getRegistered: getRegistered.bind(null, descriptor),
    registerLocation: registerModelLocation.bind(null, descriptor),
    locationIsRegistered: modelLocationIsRegistered.bind(null, descriptor),
    getLocation: getModelResourceLocation.bind(null, descriptor),
    defaultLocation: setDefaultModelLocation.bind(null, descriptor),
    fileExtensions: descriptor.fileExtensions,
    resourceLocations: descriptor.resourceLocations
  };

  if(!isUndefined(descriptor.referenceNamespace)) {
    // Returns a reference to the specified models.
    // If no name is supplied, a reference to an array containing all viewModel references is returned.
    resourceMethods.getAll = getModelReferences.bind(null, descriptor);
  }

  return resourceMethods;
}
