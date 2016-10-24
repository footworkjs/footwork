var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../misc/util');
var isPath = util.isPath;
var isAmdResolved = util.isAmdResolved;

var isNamespace = require('../namespace/namespace').isNamespace;
var regExpMatch = /^\/|\/$/g;

function isRegistered (descriptor, resourceName) {
  return !_.isUndefined(descriptor.registered[resourceName]);
};

function getRegistered (descriptor, resourceName) {
  return descriptor.registered[resourceName];
};

function register (descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
};

function getModelExtension (dataModelExtensions, modelName) {
  var fileExtension = '';

  if (_.isFunction(dataModelExtensions)) {
    fileExtension = dataModelExtensions(modelName);
  } else if (_.isString(dataModelExtensions)) {
    fileExtension = dataModelExtensions;
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

var $globalNamespace = fw.namespace();
function getModelReferences (descriptor, namespaceName, options) {
  options = options || {};
  if (_.isString(namespaceName) || _.isArray(namespaceName)) {
    options.namespaceName = namespaceName;
  }

  var references = _.reduce($globalNamespace.request(descriptor.referenceNamespace, _.extend({ includeOutlets: false }, options), true), function (models, model) {
    if (!_.isUndefined(model)) {
      var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if (!_.isNull(namespaceName)) {
        if (_.isUndefined(models[namespaceName])) {
          models[namespaceName] = [model];
        } else {
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});

  var referenceKeys = _.keys(references);
  if (_.isString(namespaceName)) {
    if (referenceKeys.length === 1) {
      return references[referenceKeys[0]] || [];
    }
    return [];
  }
  return references;
}


function getResourceOrLocation (descriptor, moduleName) {
  var resource = descriptor.resource;
  var resourceOrLocation = null;

  if (resource.isRegistered(moduleName)) {
    // viewModel was manually registered
    resourceOrLocation = resource.getRegistered(moduleName);
  } else if (isAmdResolved(moduleName)) {
    // found a matching resource that is already cached by require
    resourceOrLocation = moduleName;
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
    resourceMethods.getAll = getModelReferences.bind(null, descriptor);
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
  getComponentExtension: getComponentExtension
};
