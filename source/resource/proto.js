// resource/proto.js
// ------------------

function isRegistered(resourceName) {
  return !isUndefined( this.registered[resourceName] );
};

function getRegistered(resourceName) {
  return this.registered[resourceName];
};

function register(resourceName, resource) {
  this.registered[resourceName] = resource;
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

function getModelFileName(modelName) {
  var modelResourceLocations = this.resourceLocations;
  var fileName = modelName + '.' + getModelExtension(this.fileExtensions(), modelName);

  if( !isUndefined( modelResourceLocations[modelName] ) ) {
    var registeredLocation = modelResourceLocations[modelName];
    if( isString(registeredLocation) && !isPath(registeredLocation) ) {
      // full filename was supplied, lets return that
      fileName = last( registeredLocation.split('/') );
    }
  }

  return fileName;
}

function setDefaultModelLocation(path) {
  if( isString(path) ) {
    this.defaultLocation = path;
  }

  return this.defaultLocation;
}

function registerModelLocation(modelName, location) {
  if( isArray(modelName) ) {
    each(modelName, function(name) {
      registerLocation.call(this, name, location);
    });
  }
  this.resourceLocations[ modelName ] = location;
}

function modelLocationIsRegistered(modelName) {
  return !isUndefined(this.resourceLocations[modelName]);
}

function getModelResourceLocation(modelName) {
  if( isUndefined(modelName) ) {
    return this.resourceLocations;
  }
  return this.resourceLocations[modelName] || this.defaultLocation;
}

function getModelReferences(namespaceName, options) {
  options = options || {};
  if( isString(namespaceName) || isArray(namespaceName) ) {
    options.namespaceName = namespaceName;
  }

  return reduce( $globalNamespace.request(this.referenceNamespaceName, extend({ includeOutlets: false }, options), true), function(models, model) {
    if( !isUndefined(model) ) {
      var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if( !isNull(namespaceName) ) {
        if( isUndefined(models[namespaceName]) ) {
          models[namespaceName] = model;
        } else {
          if( !isArray(models[namespaceName]) ) {
            models[namespaceName] = [ models[namespaceName] ];
          }
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});
}

// assemble all resource methods for a given descriptor object
function getSimpleResourceMethods(descriptor) {
  var resourceMethods = {
    getFileName: getModelFileName.bind(descriptor),
    register: register.bind(descriptor),
    isRegistered: isRegistered.bind(descriptor),
    getRegistered: getRegistered.bind(descriptor),
    registerLocation: registerModelLocation.bind(descriptor),
    locationIsRegistered: modelLocationIsRegistered.bind(descriptor),
    getResourceLocation: getModelResourceLocation.bind(descriptor),
    defaultLocation: setDefaultModelLocation.bind(descriptor),
    fileExtensions: descriptor.fileExtensions,
    resourceLocations: descriptor.resourceLocations
  };

  if(!isUndefined(descriptor.referenceNamespaceName)) {
    // Returns a reference to the specified models.
    // If no name is supplied, a reference to an array containing all viewModel references is returned.
    resourceMethods.getAll = getModelReferences.bind(descriptor);
  }

  return resourceMethods;
}
