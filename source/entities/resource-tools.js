var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../misc/util');
var isPath = util.isPath;
var isAmdResolved = util.isAmdResolved;

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
}

/**
 * Return the resource registered on the descriptor using the specified resourceName.
 *
 * @param {object} descriptor The entity descriptor
 * @param {string} resourceName The name of the resource to look for
 * @returns {object} The descriptor or undefined if not found
 */
function getRegistered (descriptor, resourceName) {
  return descriptor.registered[resourceName];
}

/**
 * Register a resource using a given resourceName on a descriptor.
 *
 * @param {object} descriptor The entity descriptor
 * @param {string} resourceName The name of the resource to register with
 * @param {any} resource The item to register
 */
function register (descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
}

function getFileName (descriptor, modelName) {
  return modelName + '.' + descriptor.resource.fileExtensions.replace(/^\./, '') || '';
}

function registerLocation (descriptor, modelName, location) {
  if (_.isArray(modelName)) {
    _.each(modelName, function (name) {
      registerLocation(descriptor, name, location);
    });
  }
  descriptor.registeredLocations[ modelName ] = location;
}

function getLocation (descriptor, modelName) {
  return _.reduce(descriptor.registeredLocations, function (registeredLocation, location, registeredName) {
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

function getModelReferences (descriptor, namespaceName) {
  var references = _.reduce(fw.namespace(descriptor.referenceNamespace).request('ref', namespaceName, true), function (models, model) {
    if (!_.isUndefined(model)) {
      var namespaceName = fw.isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if (!_.isNull(namespaceName)) {
        if (_.isUndefined(models[namespaceName])) {
          models[namespaceName] = model;
        } else {
          if (!_.isArray(models[namespaceName])) {
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
 * Hydrates a entity descriptors resource with the necessary utility methods.
 *
 * @param {object} descriptor (as defined in each entity and extended onto the entity-descriptors)
 * @returns
 */
function addResourceTools (descriptor) {
  _.extend(descriptor.resource, {
    getFileName: _.partial(getFileName, descriptor),
    register: _.partial(register, descriptor),
    isRegistered: _.partial(isRegistered, descriptor),
    getRegistered: _.partial(getRegistered, descriptor),
    registerLocation: _.partial(registerLocation, descriptor),
    getLocation: _.partial(getLocation, descriptor),
    getResourceOrLocation: _.partial(getResourceOrLocation, descriptor),
    get: _.partial(getModelReferences, descriptor)
  });

  return descriptor;
}

/**
 * Return the file name extension for the given componentName and fileType.
 *
 * @param {string} componentName
 * @param {string} fileType (combined/viewModel/template)
 * @returns {string} the file extension (ie: 'js')
 */
function getComponentExtension (componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions;
  var fileExtension = '';

  if (_.isFunction(componentExtensions[fileType])) {
    fileExtension = componentExtensions[fileType](componentName);
  } else {
    fileExtension = componentExtensions[fileType] || '';
  }

  return fileExtension.replace(/^\./, '') || '';
}

module.exports = {
  addResourceTools: addResourceTools,
  getComponentExtension: getComponentExtension,
  getModelReferences: getModelReferences
};
