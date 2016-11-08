var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entity-descriptors');
var postbox = require('../../namespace/postbox');
var instanceRequestHandler = require('../entity-tools').instanceRequestHandler;
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

/**
 * Bootstrap an instance with viewModel capabilities (lifecycle/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function viewModelBootstrap (instance, configParams, requestHandlerDescriptor) {
  if (!instance) {
    throw Error('Must supply the instance to boot()');
  }

  var descriptor = entityDescriptors.getDescriptor('viewModel');
  requestHandlerDescriptor = requestHandlerDescriptor || descriptor;

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true;

    configParams = _.extend({}, descriptor.defaultConfig, {
      namespace: (configParams || {}).namespace ? null : _.uniqueId('instance')
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
    instance.disposeWithInstance(postbox.subscribe(function instanceResponseHandler (params) {
      postbox.notifySubscribers(instanceRequestHandler(instance, params), '__footwork.request.' + requestHandlerDescriptor.referenceNamespace + '.response');
    }, null, '__footwork.request.' + requestHandlerDescriptor.referenceNamespace));
  }

  return instance;
}

module.exports = viewModelBootstrap;
