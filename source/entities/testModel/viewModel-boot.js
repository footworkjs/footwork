var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

module.exports = function viewModelBoot(instance, configParams) {
  if(_.isUndefined(instance[privateDataSymbol])) {
    instance[privateDataSymbol] = {
      configParams: configParams
    };
  } else {
    throw new Error('Cannot boot an instance more than once.');
  }
};
