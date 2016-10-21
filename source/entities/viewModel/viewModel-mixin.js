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
      _.each(self[privateDataSymbol].disposableItems, propertyDispose);
    }

    return self;
  },
  disposeWithInstance: function disposeWithInstance(disposableItem) {
    if (_.isArray(disposableItem)) {
      var self = this;
      _.each(disposableItem, function(item) {
        self.disposeWithInstance(item);
      });
    } else if(disposableItem) {
      this[privateDataSymbol].disposableItems.push(disposableItem);
    }
  }
};


