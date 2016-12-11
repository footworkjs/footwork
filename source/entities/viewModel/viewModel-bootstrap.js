var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('../entity-descriptors');
var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var resultBound = require('../../misc/util').resultBound;

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

    configParams = _.extend({}, descriptor.resource.defaultConfig, {
      namespace: (configParams || {}).namespace ? null : _.uniqueId(requestHandlerDescriptor.entityName)
    }, configParams);

    instance[privateDataSymbol] = {
      configParams: configParams,
      disposableItems: [],
      loadingChildren: fw.observableArray()
    };

    _.extend(instance, require('./viewModel-methods'), {
      $namespace: fw.namespace(resultBound(configParams, 'namespace', instance))
    });

    // Setup the request handler which returns the instance
    instance.disposeWithInstance(fw.namespace(requestHandlerDescriptor.referenceNamespace).requestHandler('ref', function(namespaceName) {
      if (_.isString(namespaceName) || _.isArray(namespaceName)) {
        if (_.isArray(namespaceName) && _.indexOf(namespaceName, configParams.namespace) !== -1) {
          return instance;
        } else if (_.isString(namespaceName) && namespaceName === configParams.namespace) {
          return instance;
        }
      } else {
        return instance;
      }
    }));
  }

  return instance;
}

module.exports = viewModelBootstrap;
