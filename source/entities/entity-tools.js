var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

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

/**
 * Determines whether or not the passed in instance is an 'entity' (a viewModel/dataModel/router/outlet view model instance)
 *
 * @param {any} thing
 * @returns {boolean} true if the instance is an entity, false if not
 */
function isEntity (thing) {
  return _.reduce(_.map(entityDescriptors, 'isEntity'), function (isThing, comparator) {
    return isThing || comparator(thing);
  }, false);
};

/**
 * Determine whether or not theThing passes one of the callback predicate functions listed in predicates
 *
 * @param {any} theThing The thing to check for
 * @param {[function]} predicates Array of callback predicate functions used to determine whether or not theThing passes validation
 * @returns {boolean} true if theThing passes one of the listed predicate functions
 */
function isTheThing (theThing, predicates) {
  return _.reduce(predicates, function (isThing, predicate) {
    return isThing || predicate(theThing);
  }, false);
}

/**
 * Returns reference to the nearest parent 'entity' (viewModel/dataModel/router/outlet view model instance) to the knockout $context.
 * You can optionally pass in a predicate function which adds in an extra validation check for the instance
 *
 * @param {any} $context the knockout context to start searching from
 * @param {any} predicate (optional) callback which is passed the instance and return value is computed into the final result
 * @returns {any} the nearest parent instance or null if none was found
 */
function nearestEntity ($context, predicate) {
  predicate = predicate || isEntity;

  var predicates = [].concat(predicate);
  var foundEntity = null;

  if (_.isObject($context)) {
    if (isTheThing($context.$data, predicates)) {
      // found $data that matches the predicate(s) in this context
      foundEntity = $context.$data;
    } else if (_.isObject($context.$parentContext)) {
      // search through next parent up the chain
      foundEntity = nearestEntity($context.$parentContext, predicate);
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
function instanceRequestHandler (instance, namespaceName) {
  if (_.isString(namespaceName) || _.isArray(namespaceName)) {
    var myNamespaceName = instance.$namespace.getName();
    if (_.isArray(namespaceName) && _.indexOf(namespaceName, myNamespaceName) !== -1) {
      return instance;
    } else if (_.isString(namespaceName) && namespaceName === myNamespaceName) {
      return instance;
    }
  } else {
    return instance;
  }
}

/**
 * Function which calls resolveNow to resolve the entity immediately
 *
 * @param {function} resolveNow
 */
function resolveEntityImmediately (resolveNow) {
  resolveNow(true);
}

module.exports = {
  prepareDescriptor: prepareDescriptor,
  isEntity: isEntity,
  nearestEntity: nearestEntity,
  instanceRequestHandler: instanceRequestHandler,
  resolveEntityImmediately: resolveEntityImmediately
};
