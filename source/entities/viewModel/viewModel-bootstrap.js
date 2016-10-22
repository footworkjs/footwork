var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

/**
 * Bootstrap an instance with viewModel capabilities (lifecycle/etc).
 *
 * @param {any} descriptor
 * @param {any} isEntityDuckTag
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function viewModelBootstrap (descriptor, isEntityDuckTag, instance, configParams) {
  if(!instance) {
    throw new Error('Must supply the instance (this) to boot()');
  }

  if (_.isUndefined(instance[privateDataSymbol])) {
    configParams = configParams || {};
    instance[isEntityDuckTag] = true;

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

    var globalNS = fw.namespace();
    instance.disposeWithInstance(globalNS);

    /**
     * This request handler returns references of the instance to the requester.
     */
    globalNS.request.handler(descriptor.referenceNamespace, function (options) {
      if (_.isString(options.namespaceName) || _.isArray(options.namespaceName)) {
        var myNamespaceName = instance.$namespace.getName();
        if (_.isArray(options.namespaceName) && _.indexOf(options.namespaceName, myNamespaceName) !== -1) {
          return instance;
        } else if (_.isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
          return instance;
        }
      } else {
        return instance;
      }
    });
  } else {
    throw new Error('Cannot boot an instance more than once.');
  }

  return instance;
}

module.exports = viewModelBootstrap;
