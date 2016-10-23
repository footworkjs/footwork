var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var defaultChannel = require('postal').channel();
var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var instanceRequestHandler = require('../entity-tools').instanceRequestHandler;
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

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, true);

  var descriptor = entityDescriptors.getDescriptor('dataModel');
  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped
    configParams = configParams || {};

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
        return !!instance.$id();
      })
    });

    // Setup the request handler which returns the instance (fw.dataModel.getAll())
    // Note: We are wiring up the request handler manually so that an entire namespace does not need instantiating for this callback
    instance.disposeWithInstance(defaultChannel.subscribe('request.' + descriptor.referenceNamespace, function (params) {
      defaultChannel.publish({
        topic: 'request.' + descriptor.referenceNamespace + '.response',
        data: instanceRequestHandler(instance, params)
      });
    }));
  }

  return instance;
}

module.exports = dataModelBootstrap;
