var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');
var postal = require('postal');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var instanceRequestHandler = require('../entity-tools').instanceRequestHandler;
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

/**
 * Bootstrap an instance with router capabilities (fetch/save/mapTo/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function routerBootstrap (instance, configParams) {
  if (!instance) {
    throw new Error('Must supply the instance to boot()');
  }

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, true);

  var descriptor = entityDescriptors.getDescriptor('router');
  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped
    configParams = configParams || {};

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

  return instance;
}

module.exports = routerBootstrap;
