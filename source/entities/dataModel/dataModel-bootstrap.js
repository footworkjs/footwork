var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');
var evalDirtyState = require('./data-tools').evalDirtyState;

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
    var privateData = instance[privateDataSymbol];
    instance[descriptor.isEntityDuckTag] = true;

    _.extend(privateData, {
      idAttributeObservable: _.noop,
      mappings: {},
      configParams: _.extend(privateData.configParams, descriptor.resource.defaultConfig, configParams || {})
    });

    _.extend(instance, require('./dataModel-methods'), {
      isCreating: fw.observable(false),
      isReading: fw.observable(false),
      isUpdating: fw.observable(false),
      isDeleting: fw.observable(false),
      isNew: fw.observable(true),
      isDirty: fw.observable(false)
    });

    _.extend(instance, {
      isSaving: fw.computed(function computeRequestInProgress () {
        return instance.isCreating() || instance.isUpdating();
      }),
      requestInProgress: fw.computed(function computeRequestInProgress () {
        return instance.isCreating() || instance.isReading() || instance.isUpdating() || instance.isDeleting();
      })
    });

    instance.$removeMap = function (path) {
      if (privateData.mappings[path]) {
        privateData.mappings[path].dispose();
        delete privateData.mappings[path];
        instance.isDirty(evalDirtyState(instance));
      }
    };
  } else {
    throw Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = dataModelBootstrap;
