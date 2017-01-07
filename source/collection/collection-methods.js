var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var ajax = require('../misc/ajax');
var privateDataSymbol = require('../misc/util').getSymbol('footwork');

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * Note: object 'a' can provide a regex value for a property and have it searched matching on the regex value
 * @param  {object} a Object to compare (which can contain regex values for properties)
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function regExpIsEqual (a, b, isEq) {
  isEq = isEq || regExpIsEqual;

  if (_.isObject(a) && _.isObject(b)) {
    return _.every(_.reduce(a, function (comparison, paramValue, paramName) {
      var isCongruent = false;
      var bParamValue = b[paramName];
      if (bParamValue) {
        if (_.isRegExp(paramValue)) {
          isCongruent = !_.isNull(bParamValue.match(paramValue));
        } else {
          isCongruent = isEq(paramValue, bParamValue);
        }
      }

      comparison.push(isCongruent);
      return comparison;
    }, []));
  } else {
    return a === b;
  }
}

function collectionSync () {
  return fw.sync.apply(this, arguments);
}

function pluck (attribute) {
  return _.reduce(this(), function (pluckedValues, model) {
    pluckedValues.push(model[attribute]);
    return pluckedValues;
  }, []);
}

/**
 * Convert the collection to its plain object form for toJSON support.
 *
 * @returns {array} The collection of data
 */
function toJSON () {
  return this();
}

/**
 * Get list of items that match modelData
 *
 * @param {object} modelData object to compare against
 * @param {function} comparator callback function used to compare the values
 * @returns {any} the found results (if any)
 */
function where (modelData, comparator) {
  return _.reduce(this(), function findModel (foundModels, model) {
    if (regExpIsEqual(modelData, model, comparator)) {
      foundModels.push(model);
    }
    return foundModels;
  }, []);
}

/**
 * Get first item that matches modelData
 *
 * @param {object} modelData object to compare against
 * @param {function} comparator callback function used to compare the values
 * @returns {any} the found result (if any)
 */
function findWhere (modelData, comparator) {
  return _.reduce(this(), function findModel (foundModel, model) {
    if (_.isNull(foundModel) && regExpIsEqual(modelData, model, comparator)) {
      return model;
    }
    return foundModel;
  }, null);
}

function fetchCollection (options) {
  var collection = this;
  var configParams = collection[privateDataSymbol].configParams;
  options = _.extend({ parse: true }, options);

  var requestInfo = {
    requestRunning: collection.isReading,
    requestLull: configParams.requestLull,
    entity: collection,
    createRequest: function () {
      var xhr = collection.sync('read', collection, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          var parsedData = configParams.parse(data);
          _.isArray(parsedData) && collection(parsedData);
        });

      return xhr;
    }
  };

  return ajax.makeOrGetRequest('fetch', requestInfo);
}

module.exports = {
  sync: collectionSync,
  toJSON: toJSON,
  pluck: pluck,
  fetch: fetchCollection,
  where: where,
  findWhere: findWhere
};
