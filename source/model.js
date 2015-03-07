// model.js
// ------------------

var model = {};

// Make a callback which returns all model references for a given namespaceString reference
model.getAllFromNamespace = function(namespaceString) {
  return function(namespaceName, options) {
    options = options || {};
    if( isString(namespaceName) || isArray(namespaceName) ) {
      options.namespaceName = namespaceName;
    }

    return reduce( $globalNamespace.request(namespaceString, extend({ includeOutlets: false }, options), true), function(models, model) {
      if( !isUndefined(model) ) {
        var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
        if( !isNull(namespaceName) ) {
          if( isUndefined(models[namespaceName]) ) {
            models[namespaceName] = model;
          } else {
            if( !isArray(models[namespaceName]) ) {
              models[namespaceName] = [ models[namespaceName] ];
            }
            models[namespaceName].push(model);
          }
        }
      }
      return models;
    }, {});
  };
};

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

// Make a model factory function for the given factoryConf
model.makeModelFactory = function(factoryConf) {
  return function(configParams) {
    configParams = configParams || {};

    var ctor = noop;
    var afterInit = noop;
    var parent = configParams.parent;

    if( !isUndefined(configParams) ) {
      ctor = configParams.viewModel || configParams.initialize || noop;
      afterInit = configParams.afterInit || noop;
    }
    afterInit = { _postInit: afterInit };
    configParams = extend({}, factoryConf.defaultConfigParams, configParams);

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
          this.$globalNamespace.request.handler(factoryConf.referenceNamespaceName, function(options) {
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

    if( !factoryConf.isModelCtor(ctor) ) {
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
      isModelDuckTagMixin[factoryConf.isModelDuckTag] = true;
      composure = composure.concat({ mixin: isModelDuckTagMixin });

      composure = composure.concat(afterInit);
      if( !isUndefined(configParams.mixins) ) {
        composure = composure.concat(configParams.mixins);
      }

      each(composure, function(composureElement) {
        if( !isUndefined(composureElement['runBeforeInit']) ) {
          delete composureElement.runBeforeInit;
        }
      });

      var model = riveter.compose.apply( undefined, composure );
      model['isModelCtorDuckTag'] = true;
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
      if( factoryConf.isRegistered(namespace) ) {
        if( factoryConf.getRegistered(namespace) !== model ) {
          throw 'namespace [' + namespace + '] has already been registered, autoRegister failed.';
        }
      } else {
        factoryConf.register(namespace, model);
      }
    }

    return model;
  };
};
