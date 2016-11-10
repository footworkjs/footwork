var _ = require('footwork-lodash');

var util = require('../../misc/util');
var privateDataSymbol = util.getSymbol('footwork');
var propertyDispose = util.propertyDispose;

module.exports = {
  dispose: function dispose () {
    var self = this;

    if (!self[privateDataSymbol].isDisposed) {
      self[privateDataSymbol].isDisposed = true;
      var configParams = self[privateDataSymbol].configParams;

      if (configParams.onDispose !== _.noop) {
        configParams.onDispose.call(self, self[privateDataSymbol].element);
      }

      _.each(self, propertyDispose);
      _.each(self[privateDataSymbol].disposableItems, propertyDispose);
    }

    return self;
  },
  disposeWithInstance: function disposeWithInstance (disposableItem) {
    var self = this;

    if(arguments.length > 1) {
      disposableItem = Array.prototype.slice.call(arguments);
    }

    if (_.isArray(disposableItem)) {
      _.each(disposableItem, function (item) {
        self.disposeWithInstance(item);
      });
    } else if (disposableItem) {
      self[privateDataSymbol].disposableItems.push(disposableItem);
    }
  }
};


