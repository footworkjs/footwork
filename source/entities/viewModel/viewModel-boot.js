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
function viewModelBoot (descriptor, isEntityDuckTag, instance, configParams) {
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
      inFlightChildren: fw.observableArray()
    };

    _.extend(instance, descriptor.mixin);

    var globalNS = fw.namespace();
    instance.disposeWithInstance(globalNS);

    /**
     * This request handler returns references of the instance to the requester.
     */
    globalNS.request.handler(descriptor.referenceNamespace, function (options) {
      var myNamespaceName = configParams.namespace;
      if (_.isArray(options.namespaceName) && options.namespaceName.indexOf(myNamespaceName) !== -1) {
        return instance;
      } else if (_.isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
        return instance;
      }
    });
  } else {
    throw new Error('Cannot boot an instance more than once.');
  }

  return instance;
}

module.exports = viewModelBoot;
