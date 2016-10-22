var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('./entity-descriptors');
var capitalizeFirstLetter = require('../misc/util').capitalizeFirstLetter;

function prepareDescriptor (descriptor) {
  return _.extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    referenceNamespace: '__' + capitalizeFirstLetter(descriptor.entityName) + 'Reference'
  }, descriptor);
}

function isEntityCtor (thing) {
  return _.reduce(_.map(entityDescriptors, 'isEntityCtor'), function (isThing, comparator) {
    return isThing || comparator(thing);
  }, false);
};

function isEntity (thing) {
  return _.reduce(_.map(entityDescriptors, 'isEntity'), function (isThing, comparator) {
    return isThing || comparator(thing);
  }, false);
};

function nearestEntity ($context, predicate) {
  var foundEntity = null;

  predicate = predicate || isEntity;
  var predicates = [].concat(predicate);
 function isTheThing (thing) {
    return _.reduce(predicates, function (isThing, predicate) {
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

/**
 * This request handler returns references of the instance to the requester when it matches the passed in namespaceName.
 *
 * @param {any} instance
 * @param {any} options
 * @returns {object} the instance passed in if the passed in namespace matches
 */
function instanceRequestHandler (instance, options) {
  if (_.isString(options.namespaceName) || _.isArray(options.namespaceName)) {
    var myNamespaceName = instance.$namespace.getName();
    if (_.isArray(options.namespaceName) && _.indexOf(options.namespaceName, myNamespaceName) !== -1) {
      return instance;
    } else if (_.isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
      return instance;
    }
  } else {
    return instance;
  }
}

module.exports = {
  prepareDescriptor: prepareDescriptor,
  isEntityCtor: isEntityCtor,
  isEntity: isEntity,
  isRouter: _.noop,
  isDataModel: _.noop,
  isDataModelCtor: _.noop,
  nearestEntity: nearestEntity,
  instanceRequestHandler: instanceRequestHandler
};
