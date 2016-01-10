// framework/entities/createFactories.js
// ------------------

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function entityMixinOrNothingFrom(thing) {
  return ((isArray(thing) && thing.length) || isObject(thing) ? thing : {});
}

function entityClassFactory(descriptor, configParams) {
  var entityCtor = null;
  var privateDataMixin = {
    _preInit: function() {
      var privateDataStore = {
        inFlightChildren: fw.observableArray()
      };
      this.__private = privateData.bind(this, privateDataStore, configParams);
    }
  };

  configParams = extend({}, descriptor.defaultConfig, configParams || {});

  var descriptorBehavior = [];
  map(descriptor.behavior, function(behavior, index) {
    descriptorBehavior.push(isFunction(behavior) ? behavior(descriptor, configParams || {}) : behavior);
  });

  var ctor = configParams.initialize || noop;
  var userExtendProps = { mixin: configParams.extend || {} };
  if (!descriptor.isEntityCtor(ctor)) {
    var isEntityDuckTagMixin = {};
    isEntityDuckTagMixin[descriptor.isEntityDuckTag] = true;
    isEntityDuckTagMixin = { mixin: isEntityDuckTagMixin };

    var newInstanceCheckMixin = {
      _preInit: function() {
        if (this === windowObject) {
          throw new Error('Must use the new operator when instantiating a ' + descriptor.methodName + '.');
        }
      }
    };
    var afterInitMixins = reject(entityMixins, isBeforeInitMixin);
    var beforeInitMixins = map(filter(entityMixins, isBeforeInitMixin), function(mixin) {
      delete mixin.runBeforeInit;
      return mixin;
    });

    var composure = [ctor].concat(
      entityMixinOrNothingFrom(privateDataMixin),
      entityMixinOrNothingFrom(userExtendProps),
      entityMixinOrNothingFrom(newInstanceCheckMixin),
      entityMixinOrNothingFrom(isEntityDuckTagMixin),
      entityMixinOrNothingFrom(afterInitMixins),
      entityMixinOrNothingFrom(beforeInitMixins),
      entityMixinOrNothingFrom(configParams.mixins),
      entityMixinOrNothingFrom(descriptorBehavior)
    );

    entityCtor = riveter.compose.apply( undefined, composure );

    entityCtor[descriptor.isEntityCtorDuckTag] = true;

    var privateDataStore = {};
    entityCtor.__private = privateData.bind(this, privateDataStore, configParams);
  } else {
    // user has specified another entity constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    entityCtor = ctor;
  }

  if (!isNull(entityCtor) && isFunction(configParams.parent)) {
    entityCtor.inherits(configParams.parent);
  }

  if (configParams.autoRegister) {
    descriptor.resource.register(configParams.namespace, entityCtor);
  }

  return entityCtor;
}

function createEntityFactories() {
  // create the class factory method for each entity descriptor
  filter(entityDescriptors, function getOnlyDescriptorsWithMethodName(descriptor) {
    return isString(descriptor.methodName);
  }).forEach(function setupClassFactory(descriptor) {
    fw[descriptor.methodName].create = entityClassFactory.bind(null, descriptor);
  });
};

runPostInit.unshift(createEntityFactories);
