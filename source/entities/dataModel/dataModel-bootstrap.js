var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

/**
 * Bootstrap an instance with dataModel capabilities (fetch/save/map/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function dataModelBootstrap (instance, configParams) {
  if (!instance) {
    throw Error('Must supply the instance to boot()');
  }

  var descriptor = entityDescriptors.getDescriptor('dataModel');

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, descriptor);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true;
    instance[privateDataSymbol].idAttributeObservable = _.noop;
    instance[privateDataSymbol].mappings = fw.observable({});
    configParams = _.extend(instance[privateDataSymbol].configParams, descriptor.resource.defaultConfig, configParams || {});

    _.extend(instance, descriptor.mixin, {
      isCreating: fw.observable(false),
      isSaving: fw.observable(false),
      isFetching: fw.observable(false),
      isDestroying: fw.observable(false),
      isNew: fw.observable(true),
      isDirty: fw.observable(false)
    });

    _.extend(instance, {
      requestInProgress: fw.computed(function computeIfRequestInProgress () {
        return instance.isCreating() || instance.isSaving() || instance.isFetching() || instance.isDestroying();
      })
    });
  } else {
    throw Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = dataModelBootstrap;
