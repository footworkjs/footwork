// framework/model/createFactories.js
// ------------------

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function modelMixin(thing) {
  return ( (isArray(thing) && thing.length) || isObject(thing) ? thing : {} );
}

function modelClassFactory(descriptor, configParams) {
  var model = null;

  configParams = extend({}, descriptor.defaultConfig, configParams || {});

  var descriptorMixins = [];
  map(descriptor.mixins, function(mixin, index) {
    descriptorMixins.push( isFunction(mixin) ? mixin(descriptor, configParams || {}) : mixin );
  });

  var ctor = configParams.initialize || configParams.viewModel || noop;
  if( !descriptor.isEntityCtor(ctor) ) {
    var isEntityDuckTagMixin = {};
    isEntityDuckTagMixin[descriptor.isEntityDuckTag] = true;
    isEntityDuckTagMixin = { mixin: isEntityDuckTagMixin };

    var newInstanceCheckMixin = {
      _preInit: function() {
        if(this === windowObject) {
          throw new Error('Must use the new operator when instantiating a ' + descriptor.methodName + '.');
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
      modelMixin(newInstanceCheckMixin),
      modelMixin(isEntityDuckTagMixin),
      modelMixin(afterInitCallbackMixin),
      modelMixin(afterInitMixins),
      modelMixin(beforeInitMixins),
      modelMixin(configParams.mixins),
      modelMixin(descriptorMixins)
    );

    model = riveter.compose.apply( undefined, composure );

    model[ descriptor.isEntityCtorDuckTag ] = true;
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

function routerClassFactory(routerConfig) {
  var viewModel = fw.viewModel({
    router: routerConfig
  });

  if( routerConfig.autoRegister ) {
    var namespace = routerConfig.namespace;
    if( fw.routers.isRegistered(namespace) ) {
      if( fw.routers.getRegistered(namespace) !== this ) {
        throw new Error('"' + namespace + '" has already been registered as a router, autoRegister failed.');
      }
    } else {
      fw.routers.register(namespace, viewModel);
    }
  }

  return viewModel;
}

createFactories = function(descriptors) {
  // create the class factory method for each entity descriptor
  filter(descriptors, function getOnlyDescriptorsWithMethodName(descriptor) {
    return isString(descriptor.methodName);
  }).forEach(function setupFactoryMethod(descriptor) {
    switch(descriptor.methodName) {
      case 'router':
        fw[descriptor.methodName] = routerClassFactory;
        break;

      default:
        fw[descriptor.methodName] = modelClassFactory.bind(null, descriptor);
    }
  });
};
