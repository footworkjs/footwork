var _ = require('../misc/lodash');

require('./component-resource');

var resourceMethods = require('./resource-methods');
var getModelFileName = resourceMethods.getModelFileName;
var register = resourceMethods.register;
var isRegistered = resourceMethods.isRegistered;
var getRegistered = resourceMethods.getRegistered;
var registerModelLocation = resourceMethods.registerModelLocation;
var modelLocationIsRegistered = resourceMethods.modelLocationIsRegistered;
var getModelResourceLocation = resourceMethods.getModelResourceLocation;
var getModelReferences = resourceMethods.getModelReferences;

/**
 * Hydrates each entity resource with the necessary utility methods.
 *
 * @param {object} descriptor (as defined in each entity and extended onto the entity-descriptors)
 * @returns
 */
function resourceHelperFactory(descriptor) {
  var resourceMethods = {
    getFileName: getModelFileName.bind(null, descriptor),
    register: register.bind(null, descriptor),
    isRegistered: isRegistered.bind(null, descriptor),
    getRegistered: getRegistered.bind(null, descriptor),
    registerLocation: registerModelLocation.bind(null, descriptor),
    locationIsRegistered: modelLocationIsRegistered.bind(null, descriptor),
    getLocation: getModelResourceLocation.bind(null, descriptor),
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

_.each(require('../entities/entity-descriptors'), function(descriptor) {
  if (!_.isUndefined(descriptor.resource)) {
    _.extend(descriptor.resource, resourceHelperFactory(descriptor));
  }
});
