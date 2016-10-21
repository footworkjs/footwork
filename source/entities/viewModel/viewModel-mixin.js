var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var propertyDispose = require('../../misc/util').propertyDispose;

module.exports = {
  dispose: function dispose() {
    var self = this;

    if (!self[privateDataSymbol].isDisposed) {
      var configParams = self[privateDataSymbol].configParams;
      self[privateDataSymbol].isDisposed = true;

      if (configParams.onDispose !== _.noop) {
        configParams.onDispose.call(self, self[privateDataSymbol].element);
      }

      _.each(self, propertyDispose);
      _.each(self[privateDataSymbol].disposableItems, propertyDispose);
    }

    return self;
  },
  disposeWithInstance: function disposeWithInstance(disposableItem) {
    var self = this;
    if (_.isArray(disposableItem)) {
      _.each(disposableItem, function(item) {
        self.disposeWithInstance(item);
      });
    } else if(disposableItem) {
      self[privateDataSymbol].disposableItems.push(disposableItem);
    }
  }
};


