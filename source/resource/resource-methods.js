var fw = require('../../bower_components/knockoutjs/dist/knockout');
var _ = require('../misc/lodash');

var isNamespace = require('../namespace/namespace').isNamespace;
var isPath = require('../misc/util').isPath;

function isRegistered(descriptor, resourceName) {
  return !_.isUndefined(descriptor.registered[resourceName]);
};

function getRegistered(descriptor, resourceName) {
  return descriptor.registered[resourceName];
};

function register(descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
};

function getModelExtension(dataModelExtensions, modelName) {
  var fileExtension = '';

  if (_.isFunction(dataModelExtensions)) {
    fileExtension = dataModelExtensions(modelName);
  } else if (_.isString(dataModelExtensions)) {
    fileExtension = dataModelExtensions;
  }

  return fileExtension.replace(/^\./, '') || '';
}

function getModelFileName(descriptor, modelName) {
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

function registerModelLocation(descriptor, modelName, location) {
  if (_.isArray(modelName)) {
    _.each(modelName, function(name) {
      registerModelLocation(descriptor, name, location);
    });
  }
  descriptor.resourceLocations[ modelName ] = location;
}

function modelResourceLocation(descriptor, modelName) {
  return _.reduce(descriptor.resourceLocations, function(registeredLocation, location, registeredName) {
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

function modelLocationIsRegistered(descriptor, modelName) {
  return !!modelResourceLocation(descriptor, modelName);
}

function getModelResourceLocation(descriptor, modelName) {
  if (_.isUndefined(modelName)) {
    return descriptor.resourceLocations;
  }

  return modelResourceLocation(descriptor, modelName);
}

var $globalNamespace = fw.namespace();
function getModelReferences(descriptor, namespaceName, options) {
  options = options || {};
  if (_.isString(namespaceName) || _.isArray(namespaceName)) {
    options.namespaceName = namespaceName;
  }

  var references = _.reduce($globalNamespace.request(descriptor.referenceNamespace, _.extend({ includeOutlets: false }, options), true), function(models, model) {
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

module.exports = {
  isRegistered: isRegistered,
  getRegistered: getRegistered,
  register: register,
  getModelFileName: getModelFileName,
  registerModelLocation: registerModelLocation,
  modelResourceLocation: modelResourceLocation,
  modelLocationIsRegistered: modelLocationIsRegistered,
  getModelResourceLocation: getModelResourceLocation,
  getModelReferences: getModelReferences
};
