var _ = require('../../lodash');

module.exports = function ViewModel(descriptor, configParams) {
  return {
    mixin: {
      disposeWithInstance: function(subscription) {
        if(_.isArray(subscription)) {
          var self = this;
          _.each(subscription, function(sub) {
            self.disposeWithInstance(sub);
          });
        } else {
          var subscriptions = this.__private('subscriptions');
          if(!_.isArray(subscriptions)) {
            subscriptions = [];
          }

          subscription && subscriptions.push(subscription);
          this.__private('subscriptions', subscriptions);
        }
      },
      dispose: function() {
        if(!this._isDisposed) {
          this._isDisposed = true;
          if(configParams.onDispose !== noop) {
            configParams.onDispose.call(this, this.__private('element'));
          }
          _.each(this, propertyDispose);
          _.each(this.__private('subscriptions') || [], propertyDispose);
        }
        return this;
      }
    },
    _postInit: function() {
      this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
        if(_.isString(options.namespaceName) || _.isArray(options.namespaceName)) {
          var myNamespaceName = this.$namespace.getName();
          if(_.isArray(options.namespaceName) && indexOf(options.namespaceName, myNamespaceName) !== -1) {
            return this;
          } else if(_.isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
            return this;
          }
        } else {
          return this;
        }
      }.bind(this));
    }
  };
};
