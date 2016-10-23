var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');
var postal = require('postal');

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
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped
    configParams = configParams || {};

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
      // setup the request handler which returns the instance
      // note we are wiring up the request handler manually so that an entire namespace does not need instantiating for this callback
      var instanceChannel = postal.channel();
      instance.disposeWithInstance(instanceChannel.subscribe('request.' + descriptor.referenceNamespace, function (params) {
        instanceChannel.publish({
          topic: 'request.' + descriptor.referenceNamespace + '.response',
          data: instanceRequestHandler(instance, params)
        });
      }));
    }
  } else {
    throw new Error('Cannot boot an instance more than once.');
  }

  return instance;
}

module.exports = viewModelBootstrap;
