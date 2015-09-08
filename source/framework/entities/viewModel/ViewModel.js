// framework/entities/viewModel/ViewModel.js
// ------------------

var ViewModel = function(descriptor, configParams) {
  return {
    mixin: {
      $trackSub: function(subscription) {
        var subscriptions = this.__private('subscriptions');
        if(!isArray(subscriptions)) {
          subscriptions = [];
        }
        subscription && subscriptions.push(subscription);
        this.__private('subscriptions', subscriptions);
      },
      dispose: function() {
        if( !this._isDisposed ) {
          this._isDisposed = true;
          if( configParams.onDispose !== noop ) {
            configParams.onDispose.call(this, this.__private('element'));
          }
          each(this, propertyDisposal);
          each(this.__private('subscriptions') || [], propertyDisposal);
        }
        return this;
      }
    },
    _postInit: function() {
      this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
        if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
          var myNamespaceName = this.$namespace.getName();
          if(isArray(options.namespaceName) && indexOf(options.namespaceName, myNamespaceName) !== -1) {
            return this;
          } else if(isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
            return this;
          }
        } else {
          return this;
        }
      }.bind(this));
    }
  };
};
