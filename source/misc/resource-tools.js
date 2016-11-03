var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../misc/util');
var isPath = util.isPath;
var isAmdResolved = util.isAmdResolved;

var isNamespace = require('../namespace/namespace').isNamespace;
var regExpMatch = /^\/|\/$/g;

/**
 * Determines whether or not the supplied resourceName has been registered on the entity descriptor.
 *
 * @param {object} descriptor The entity descriptor
 * @param {string} resourceName The name of the resource to look for
 * @returns {boolean} True if the resource is registered
 */
function isRegistered (descriptor, resourceName) {
  return !_.isUndefined(descriptor.registered[resourceName]);
};

/**
 * Return the resource registered on the descriptor using the specified resourceName.
 *
 * @param {object} descriptor The entity descriptor
 * @param {string} resourceName The name of the resource to look for
 * @returns {object} The descriptor or undefined if not found
 */
function getRegistered (descriptor, resourceName) {
  return descriptor.registered[resourceName];
};

/**
 * Register a resource using a given resourceName on a descriptor.
 *
 * @param {object} descriptor The entity descriptor
 * @param {string} resourceName The name of the resource to register with
 * @param {any} resource The item to register
 */
function register (descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
};

function getModelExtension (extensions, modelName) {
  var fileExtension = '';

  if (_.isFunction(extensions)) {
    fileExtension = extensions(modelName);
  } else if (_.isString(extensions)) {
    fileExtension = extensions;
  }

  return fileExtension.replace(/^\./, '') || '';
}

function getFileName (descriptor, modelName) {
  var modelResourceLocations = descriptor.resourceLocations;
  var fileName = modelName + '.' + getModelExtension(descriptor.fileExtensions(), modelName);

  if (!_.isUndefined(modelResourceLocations[modelName])) {
    var registeredLocation = modelResourceLocations[modelName];
    if (_.isString(registeredLocation) && !isPath(registeredLocation)) {
      // full filename was supplied, lets return that
      fileName = _.last(registeredLocation.split('/'));
    }
  }

  return fileName;
}

function registerLocation (descriptor, modelName, location) {
  if (_.isArray(modelName)) {
    _.each(modelName, function (name) {
      registerLocation(descriptor, name, location);
    });
  }
  descriptor.resourceLocations[ modelName ] = location;
}

function modelResourceLocation (descriptor, modelName) {
  return _.reduce(descriptor.resourceLocations, function (registeredLocation, location, registeredName) {
    if (!registeredLocation) {
      if (!_.isNull(registeredName.match(regExpMatch)) && !_.isNull(modelName.match(registeredName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if (modelName === registeredName) {
        registeredLocation = location;
      }
    }
    return registeredLocation;
  }, undefined);
}

function getLocation (descriptor, modelName) {
  if (_.isUndefined(modelName)) {
    return descriptor.resourceLocations;
  }

  return modelResourceLocation(descriptor, modelName);
}

function locationIsRegistered (descriptor, modelName) {
  return !!modelResourceLocation(descriptor, modelName);
}

var defaultNamespace = fw.namespace();
function getModelReferences (descriptor, namespaceName) {
  var references = _.reduce(defaultNamespace.request(descriptor.referenceNamespace, namespaceName, true), function (models, model) {
    if (!_.isUndefined(model)) {
      var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if (!_.isNull(namespaceName)) {
        if (_.isUndefined(models[namespaceName])) {
          models[namespaceName] = model;
        } else {
          if(!_.isArray(models[namespaceName])) {
            models[namespaceName] = [models[namespaceName]];
          }
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});

  if (_.isString(namespaceName)) {
    return references[namespaceName];
  }
  return references;
}


function getResourceOrLocation (descriptor, moduleName) {
  var resource = descriptor.resource;
  var resourceOrLocation = null;

  if (resource.isRegistered(moduleName)) {
    // viewModel was manually registered
    resourceOrLocation = resource.getRegistered(moduleName);
  } else {
    resourceOrLocation = resource.getLocation(moduleName);
  }

  return resourceOrLocation;
}


/**
 * Hydrates each entity resource with the necessary utility methods.
 *
 * @param {object} descriptor (as defined in each entity and extended onto the entity-descriptors)
 * @returns
 */
function resourceHelperFactory (descriptor) {
  var resourceMethods = {
    getFileName: getFileName.bind(null, descriptor),
    register: register.bind(null, descriptor),
    isRegistered: isRegistered.bind(null, descriptor),
    getRegistered: getRegistered.bind(null, descriptor),
    registerLocation: registerLocation.bind(null, descriptor),
    locationIsRegistered: locationIsRegistered.bind(null, descriptor),
    getLocation: getLocation.bind(null, descriptor),
    getResourceOrLocation: getResourceOrLocation.bind(null, descriptor),

    fileExtensions: descriptor.fileExtensions,
    resourceLocations: descriptor.resourceLocations
  };

  if (!_.isUndefined(descriptor.referenceNamespace)) {
    // Returns a reference to the specified models.
    // If no name is supplied, a reference to an array containing all viewModel references is returned.
    resourceMethods.get = getModelReferences.bind(null, descriptor);
  }

  return resourceMethods;
}

/**
 * Return the file name extension for the given componentName and fileType.
 *
 * @param {string} componentName
 * @param {string} fileType (combined/viewModel/template)
 * @returns {string} the file extension (ie: 'js')
 */
function getComponentExtension (componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions();
  var fileExtension = '';

  if (_.isFunction(componentExtensions)) {
    fileExtension = componentExtensions(componentName)[fileType];
  } else if (_.isObject(componentExtensions)) {
    if (_.isFunction(componentExtensions[fileType])) {
      fileExtension = componentExtensions[fileType](componentName);
    } else {
      fileExtension = componentExtensions[fileType] || '';
    }
  }

  return fileExtension.replace(/^\./, '') || '';
}

module.exports = {
  resourceHelperFactory: resourceHelperFactory,
  getComponentExtension: getComponentExtension,
  getModelReferences: getModelReferences
};
