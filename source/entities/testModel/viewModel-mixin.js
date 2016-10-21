var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var propertyDispose = require('../../misc/util').propertyDispose;

module.exports = {
  dispose: function dispose() {
    var self = this;
    var configParams = self[privateDataSymbol].configParams;

    if (!self[privateDataSymbol].isDisposed) {
      self[privateDataSymbol].isDisposed = true;

      if (configParams.onDispose !== _.noop) {
        configParams.onDispose.call(self, self[privateDataSymbol].element);
      }

      _.each(self, propertyDispose);
      _.each(self[privateDataSymbol].subscriptions, propertyDispose);
    }

    return self;
  },
  disposeWithInstance: function disposeWithInstance(subscription) {
    if (_.isArray(subscription)) {
      var self = this;
      _.each(subscription, function(sub) {
        self.disposeWithInstance(sub);
      });
    } else if(subscription) {
      this[privateDataSymbol].subscriptions.push(subscription);
    }
  }
};


