var fw = require('knockout');
var _ = require('lodash');
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

var instanceRequestHandler = require('../entity-tools').instanceRequestHandler;

/**
 * Bootstrap an instance with dataModel capabilities (fetch/save/mapTo/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function dataModelBootstrap (instance, configParams) {
  if(!instance) {
    throw new Error('Must supply the instance (this) to boot()');
  }

  var descriptor = require('../entity-descriptors').getDescriptor('dataModel');

  // bootstrap/mixin viewModel functionality
  require('../viewModel/viewModel-bootstrap')(instance, configParams, true);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped
    configParams = configParams || {};

    var globalNS = fw.namespace();
    instance.disposeWithInstance(globalNS);
    globalNS.request.handler(descriptor.referenceNamespace, _.partial(instanceRequestHandler, instance));
  }

  return instance;
}

module.exports = dataModelBootstrap;
