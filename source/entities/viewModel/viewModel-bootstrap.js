var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

var instanceRequestHandler = require('../entity-tools').instanceRequestHandler;

/**
 * Bootstrap an instance with viewModel capabilities (lifecycle/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function viewModelBootstrap (instance, configParams, addingInstanceRequestHandlerLater) {
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

    if(!addingInstanceRequestHandlerLater) {
      var globalNS = fw.namespace();
      instance.disposeWithInstance(globalNS);
      globalNS.request.handler(descriptor.referenceNamespace, _.partial(instanceRequestHandler, instance));
    }
  } else {
    throw new Error('Cannot boot an instance more than once.');
  }

  return instance;
}

module.exports = viewModelBootstrap;
