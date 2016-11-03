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
function viewModelBootstrap (instance, configParams, requestHandlerDescriptor) {
  if (!instance) {
    throw new Error('Must supply the instance to boot()');
  }

  var descriptor = require('../entity-descriptors').getDescriptor('viewModel');
  requestHandlerDescriptor = requestHandlerDescriptor || descriptor;

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

    // Setup the request handler which returns the instance (fw.viewModel.get())
    // Note: We are wiring up the request handler manually so that an entire namespace does not need instantiating for this callback
    instance.disposeWithInstance(defaultChannel.subscribe('request.' + requestHandlerDescriptor.referenceNamespace, function (params) {
      defaultChannel.publish({
        topic: 'request.' + requestHandlerDescriptor.referenceNamespace + '.response',
        data: instanceRequestHandler(instance, params)
      });
    }));
  }

  return instance;
}

module.exports = viewModelBootstrap;
