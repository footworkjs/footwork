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

// assemble all resource methods for a given config object
function getSimpleResourceMethods(config) {
  return {
    getFileName: getModelFileName.bind(config),
    register: register.bind(config),
    isRegistered: isRegistered.bind(config),
    getRegistered: getRegistered.bind(config),
    registerLocation: registerModelLocation.bind(config),
    locationIsRegistered: modelLocationIsRegistered.bind(config),
    getResourceLocation: getModelResourceLocation.bind(config),
    defaultLocation: setDefaultModelLocation.bind(config),
    fileExtensions: config.fileExtensions,
    resourceLocations: config.resourceLocations
  };
}
