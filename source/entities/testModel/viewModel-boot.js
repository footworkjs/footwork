var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

module.exports = function viewModelBoot(descriptor, isEntityDuckTag, instance, configParams) {
  if(_.isUndefined(instance[privateDataSymbol])) {
    instance[isEntityDuckTag] = true;

    configParams = _.extend({}, descriptor.defaultConfig, configParams);

    instance[privateDataSymbol] = {
      configParams: configParams,
      disposableItems: [],
      inFlightChildren: fw.observableArray()
    };

    _.extend(instance, descriptor.mixin);
  } else {
    throw new Error('Cannot boot an instance more than once.');
  }

  return instance;
};
