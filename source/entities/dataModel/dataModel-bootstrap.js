var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

/**
 * Bootstrap an instance with dataModel capabilities (fetch/save/mapTo/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function dataModelBootstrap (instance, configParams) {
  if (!instance) {
    throw new Error('Must supply the instance to boot()');
  }

  var descriptor = entityDescriptors.getDescriptor('dataModel');

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, descriptor);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped
    configParams = _.extend(instance[privateDataSymbol].configParams, descriptor.defaultConfig, configParams || {});

    instance[privateDataSymbol].mappings = fw.observable({});

    _.extend(instance, descriptor.mixin, {
      $cid: fw.utils.guid(),
      $id: fw.observable().mapTo(configParams.idAttribute, instance),
      isCreating: fw.observable(false),
      isSaving: fw.observable(false),
      isFetching: fw.observable(false),
      isDestroying: fw.observable(false),
      isDirty: fw.computed(function() {
        return _.reduce(instance[privateDataSymbol].mappings(), function(isDirty, mappedField) {
          return isDirty || mappedField.isDirty();
        }, false);
      })
    });

    _.extend(instance, {
      requestInProgress: fw.computed(function() {
        return instance.isCreating() || instance.isSaving() || instance.isFetching() || instance.isDestroying();
      }),
      isNew: fw.computed(function() {
        return !instance.$id();
      })
    });
  } else {
    throw new Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = dataModelBootstrap;
