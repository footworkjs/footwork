// framework/model/modelClassFactory.js
// ------------------

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function modelClassFactory(descriptor, configParams) {
  configParams = extend({
    namespace: undefined,
    name: undefined,
    autoRegister: false,
    autoIncrement: false,
    mixins: undefined,
    params: undefined,
    afterInit: noop,
    afterBinding: noop,
    onDispose: noop
  }, configParams || {});

  var ctor = configParams.initialize || configParams.viewModel || noop;
  var afterInit = noop;
  var parent = configParams.parent;

  var initModelMixin = {
    _preInit: function( params ) {
      if( isObject(configParams.router) ) {
        this.$router = new Router( configParams.router, this );
      }
    },
    mixin: {
      $params: result(configParams, 'params'),
      __getConfigParams: function() {
        return configParams;
      },
      dispose: function() {
        if( !this._isDisposed ) {
          this._isDisposed = true;
          if( configParams.onDispose !== noop ) {
            configParams.onDispose.call(this);
          }
          each(this, propertyDisposal);
        }
      }
    },
    _postInit: function() {
      if( this.__assertPresence !== false ) {
        this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
          if( !this.__isOutlet || (isObject(options) && options.includeOutlets) ) {
            if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
              if(isArray(options.namespaceName) && indexOf(options.namespaceName, this.getNamespaceName()) !== -1) {
                return this;
              } else if(isString(options.namespaceName) && options.namespaceName === this.getNamespaceName()) {
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

  if( !descriptor.isModelCtor(ctor) ) {
    var composure = [ ctor ];
    var afterInitMixins = reject(modelMixins, isBeforeInitMixin);
    var beforeInitMixins = filter(modelMixins, isBeforeInitMixin);

    if( afterInitMixins.length ) {
      composure = composure.concat(afterInitMixins);
    }
    composure = composure.concat(initModelMixin);
    if( beforeInitMixins.length ) {
      composure = composure.concat(beforeInitMixins);
    }

    // must 'mixin' the duck tag which marks this object as a model
    var isModelDuckTagMixin = {};
    isModelDuckTagMixin[descriptor.isModelDuckTag] = true;
    composure = composure.concat({ mixin: isModelDuckTagMixin });

    composure = composure.concat({ _postInit: configParams.afterInit || afterInit });

    if( !isUndefined(configParams.mixins) ) {
      composure = composure.concat(configParams.mixins);
    }

    each(composure, function(composureElement) {
      delete composureElement.runBeforeInit;
    });

    var model = riveter.compose.apply( undefined, composure );
    model[ descriptor.isModelCtorDuckTag ] = true;
    model.__configParams = configParams;
  } else {
    // user has specified another model constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    model = ctor;
  }

  if( !isUndefined(parent) ) {
    model.inherits(parent);
  }

  if( configParams.autoRegister ) {
    var namespace = configParams.namespace;
    if( descriptor.resource.isRegistered(namespace) ) {
      if( descriptor.resource.getRegistered(namespace) !== model ) {
        throw 'namespace [' + namespace + '] has already been registered, autoRegister failed.';
      }
    } else {
      descriptor.resource.register(namespace, model);
    }
  }

  return model;
}
