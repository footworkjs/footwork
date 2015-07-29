// framework/entities/viewModel/ViewModel.js
// ------------------

var ViewModel = function(descriptor, configParams) {
  return {
    _preInit: function() {
      var privateDataStore = {};
      this.__private = privateData.bind(this, privateDataStore, configParams);
    },
    mixin: {
      $params: result(configParams, 'params'),
      __getConfigParams: function() {
        return configParams;
      },
      $trackSub: function(subscription) {
        if(!isArray(this.__subscriptions)) {
          this.__subscriptions = [];
        }
        subscription && this.__subscriptions.push(subscription);
      },
      dispose: function() {
        if( !this._isDisposed ) {
          this._isDisposed = true;
          if( configParams.onDispose !== noop ) {
            configParams.onDispose.call(this);
          }
          each(this, propertyDisposal);
          each(this.__subscriptions || [], propertyDisposal);
        }
        return this;
      }
    },
    _postInit: function() {
      if( this.__assertPresence !== false ) {
        this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
          if( !this.__isOutlet || (isObject(options) && options.includeOutlets) ) {
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
          }
        }.bind(this));
      }
    }
  };
};
