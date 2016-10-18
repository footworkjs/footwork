var fw = require('knockout/build/output/knockout-latest');
var riveter = require('riveter');

var _ = require('lodash');

var entityMixins = require('./entity-mixins');
var entityDescriptors = require('./entity-descriptors');
var privateData = require('../misc/privateData');

function prepareDescriptor(descriptor) {
  var methodName = descriptor.methodName.charAt(0).toUpperCase() + descriptor.methodName.slice(1);

  return _.extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    referenceNamespace: (_.isString(descriptor.methodName) ? ('__' + descriptor.methodName + 'Reference') : undefined)
  }, descriptor);
}

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function entityMixinOrNothingFrom(thing) {
  return ((_.isArray(thing) && thing.length) || _.isObject(thing) ? thing : {});
}

function entityClassFactory(descriptor, configParams) {
  var entityCtor = null;
  var privateDataMixin = {
    _preInit: function() {
      this.__private = privateData.bind(this, {
        inFlightChildren: fw.observableArray()
      }, configParams);
    }
  };

  configParams = _.extend({}, descriptor.defaultConfig, configParams || {});

  var descriptorBehavior = [];
  _.map(descriptor.behavior, function(behavior, index) {
    descriptorBehavior.push(_.isFunction(behavior) ? behavior(descriptor, configParams) : behavior);
  });

  var ctor = configParams.initialize || _.noop;
  var userExtendProps = { mixin: configParams.extend || {} };
  if (!descriptor.isEntityCtor(ctor)) {
    var isEntityDuckTagMixin = {};
    isEntityDuckTagMixin[descriptor.isEntityDuckTag] = true;
    isEntityDuckTagMixin = { mixin: isEntityDuckTagMixin };

    var newInstanceCheckMixin = {
      _preInit: function() {
        if (this === window) {
          throw new Error('Must use the new operator when instantiating a ' + descriptor.methodName + '.');
        }
      }
    };
    var afterInitMixins = _.reject(entityMixins, isBeforeInitMixin);
    var beforeInitMixins = _.map(_.filter(entityMixins, isBeforeInitMixin), function(mixin) {
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

    entityCtor = riveter.compose.apply(undefined, composure);
    entityCtor[descriptor.isEntityCtorDuckTag] = true;
    entityCtor.__private = privateData.bind(this, {}, configParams);
  } else {
    // user has specified another entity constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    entityCtor = ctor;
  }

  if (!_.isNull(entityCtor) && _.isFunction(configParams.parent)) {
    entityCtor.inherits(configParams.parent);
  }

  if (configParams.autoRegister) {
    descriptor.resource.register(configParams.namespace, entityCtor);
  }

  return entityCtor;
}

function isEntityCtor(thing) {
  return _.reduce(_.map(entityDescriptors, 'isEntityCtor'), function(isThing, comparator) {
    return isThing || comparator(thing);
  }, false);
};

function isEntity(thing) {
  return _.reduce(_.map(entityDescriptors, 'isEntity'), function(isThing, comparator) {
    return isThing || comparator(thing);
  }, false);
};

function nearestEntity($context, predicate) {
  var foundEntity = null;

  predicate = predicate || isEntity;
  var predicates = [].concat(predicate);
  function isTheThing(thing) {
    return _.reduce(predicates, function(isThing, predicate) {
      return isThing || predicate(thing);
    }, false);
  }

  if (_.isObject($context)) {
    if (isTheThing($context.$data)) {
      // found $data that matches the predicate(s) in this context
      foundEntity = $context.$data;
    } else if (_.isObject($context.$parentContext) || (_.isObject($context.$data) && _.isObject($context.$data.$parentContext))) {
      // search through next parent up the chain
      foundEntity = nearestEntity($context.$parentContext || $context.$data.$parentContext, predicate);
    }
  }
  return foundEntity;
}

module.exports = {
  prepareDescriptor: prepareDescriptor,
  entityClassFactory: entityClassFactory,
  isEntityCtor: isEntityCtor,
  isEntity: isEntity,
  nearestEntity: nearestEntity
};
