// framework/model/modelClassFactory.js
// ------------------

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function modelMixin(thing) {
  return ( (isArray(thing) && thing.length) || isObject(thing) ? thing : {} );
}

function modelClassFactory(descriptor, configParams) {
  var model = null;

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

  var ctor = configParams.initialize || configParams.viewModel || noop;
  if( !descriptor.isModelCtor(ctor) ) {
    var isModelDuckTagMixin = {};
    isModelDuckTagMixin[descriptor.isModelDuckTag] = true;
    isModelDuckTagMixin = { mixin: isModelDuckTagMixin };

    var newInstanceCheckMixin = {
      _preInit: function() {
        if(this === windowObject) {
          throw new Error('Must call the new operator when instantiating a new ' + descriptor.methodName + '.');
        }
      }
    };
    var afterInitCallbackMixin = { _postInit: configParams.afterInit || noop };
    var afterInitMixins = reject(modelMixins, isBeforeInitMixin);
    var beforeInitMixins = map(filter(modelMixins, isBeforeInitMixin), function(mixin) {
      delete mixin.runBeforeInit;
      return mixin;
    });

    var composure = [ ctor ].concat(
      // latest in execution
      modelMixin(newInstanceCheckMixin),
      modelMixin(afterInitCallbackMixin),
      modelMixin(afterInitMixins),
      modelMixin(configParams.mixins),
      modelMixin(initModelMixin),
      modelMixin(beforeInitMixins),
      modelMixin(isModelDuckTagMixin)
      // earliest in execution
    );

    model = riveter.compose.apply( undefined, composure );

    model[ descriptor.isModelCtorDuckTag ] = true;
    model.__configParams = configParams;
  } else {
    // user has specified another model constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    model = ctor;
  }

  if( !isNull(model) && isFunction(configParams.parent) ) {
    model.inherits(configParams.parent);
  }

  if( configParams.autoRegister ) {
    var namespace = configParams.namespace;
    if( descriptor.resource.isRegistered(namespace) ) {
      if( descriptor.resource.getRegistered(namespace) !== model ) {
        throw new Error('"' + namespace + '" has already been registered as a ' + descriptor.methodName + ', autoRegister failed.');
      }
    } else {
      descriptor.resource.register(namespace, model);
    }
  }

  return model;
}
