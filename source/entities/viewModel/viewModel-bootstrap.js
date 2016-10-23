var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var defaultChannel = require('postal').channel();
var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var instanceRequestHandler = require('../entity-tools').instanceRequestHandler;

/**
 * Bootstrap an instance with viewModel capabilities (lifecycle/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function viewModelBootstrap (instance, configParams, isAddingInstanceRequestHandlerLater) {
  if (!instance) {
    throw new Error('Must supply the instance to boot()');
  }

  var descriptor = require('../entity-descriptors').getDescriptor('viewModel');
  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    configParams = configParams || {};

    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped
    configParams = _.extend({}, descriptor.defaultConfig, {
      namespace: configParams.namespace ? null : _.uniqueId(descriptor.entityName)
    }, configParams);

    instance[privateDataSymbol] = {
      configParams: configParams,
      disposableItems: [],
      loadingChildren: fw.observableArray()
    };

    _.extend(instance, descriptor.mixin, {
      $namespace: fw.namespace(configParams.namespace)
    });

    if (!isAddingInstanceRequestHandlerLater) {
      // Setup the request handler which returns the instance (fw.viewModel.getAll())
      // Note: We are wiring up the request handler manually so that an entire namespace does not need instantiating for this callback
      instance.disposeWithInstance(defaultChannel.subscribe('request.' + descriptor.referenceNamespace, function (params) {
        defaultChannel.publish({
          topic: 'request.' + descriptor.referenceNamespace + '.response',
          data: instanceRequestHandler(instance, params)
        });
      }));
    }
  }

  return instance;
}

module.exports = viewModelBootstrap;
