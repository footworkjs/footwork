var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');

function insertValueIntoObject (rootObject, fieldMap, fieldValue) {
  if (_.isString(fieldMap)) {
    return insertValueIntoObject(rootObject, fieldMap.split('.'), fieldValue);
  }

  var propName = fieldMap.shift();
  if (fieldMap.length) {
    if (_.isUndefined(rootObject[propName])) {
      // nested property, lets add the container object
      rootObject[propName] = {};
    }
    // recurse into the next layer
    insertValueIntoObject(rootObject[propName], fieldMap, fieldValue);
  } else {
    rootObject[propName] = fieldValue;
  }

  return rootObject;
}

function getNestedReference (rootObject, fieldMap) {
  var propName = fieldMap;

  if (!_.isUndefined(fieldMap)) {
    if (_.isString(fieldMap)) {
      // initial call with string based fieldMap, recurse into main loop
      return getNestedReference(rootObject, fieldMap.split('.'));
    }

    propName = fieldMap.shift();
    if (fieldMap.length) {
      // recurse into the next layer
      return getNestedReference((rootObject || {})[propName], fieldMap);
    }
  }

  return !_.isString(propName) ? rootObject : _.result(rootObject || {}, propName);
}

function evalDirtyState (dataModel) {
  var mappings = dataModel[privateDataSymbol].mappings();
  return _.reduce(mappings, function(dirty, mappedObservable, path) {
    return dirty || mappedObservable.isDirty();
  }, false);
}

module.exports = {
  insertValueIntoObject: insertValueIntoObject,
  getNestedReference: getNestedReference,
  evalDirtyState: evalDirtyState
};
