var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var dataTools = require('./data-tools');
var insertValueIntoObject = dataTools.insertValueIntoObject;
var getNestedReference = dataTools.getNestedReference;
var evalDirtyState = dataTools.evalDirtyState;

function isNode (thing) {
  var thingIsObject = _.isObject(thing);
  return (
    thingIsObject ? thing instanceof Node :
    thingIsObject && _.isNumber(thing.nodeType) === "number" && _.isString(thing.nodeName)
  );
}

/**
 * GET from server and set in model
 *
 * @param {object} options (optional) Options passed to sync()
 * @returns {object} Promise Promise for the HTTP Request
 */
function fetchModel (options) {
  var ajax = require('../../misc/ajax');
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;
  var requestInfo = {
    requestRunning: dataModel.isFetching,
    requestLull: configParams.requestLull,
    entity: dataModel,
    createRequest: function () {
      if (!dataModel.isNew()) {
        // retrieve data dataModel the from server using the id
        var xhr = dataModel.sync('read', dataModel, options);

        ajax.handleJsonResponse(xhr)
          .then(function handleResponseData (data) {
            var parsedData = configParams.parse ? configParams.parse.call(dataModel, data, 'read') : data;
            if (!_.isUndefined(parsedData[configParams.idAttribute])) {
              dataModel.set(parsedData);
            }
          });

        return xhr;
      } else {
        return Promise.reject(new Error("Must have ID provided to a dataModel in order to fetch its data"));
      }
    }
  };

  return ajax.makeOrGetRequest('fetch', requestInfo);
}

/**
 * PUT / POST / PATCH to server
 *
 * @param {string} (optional) attrs
 * @param {object} options (optional) Options passed to sync()
 * @returns {object} Promise Promise for the HTTP Request
 */
function save (attrs, options) {
  var ajax = require('../../misc/ajax');
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;
  var attrs = isNode(attrs) ? {} : attrs;

  options = _.extend({
    wait: false,
    patch: false
  }, options);

  var method = dataModel.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
  if (method === 'patch' && !options.attrs) {
    options.attrs = attrs;
  }

  var requestInfo = {
    requestRunning: (method === 'create' ? dataModel.isCreating : dataModel.isSaving),
    requestLull: configParams.requestLull,
    entity: dataModel,
    createRequest: function () {
      if (!options.wait && !_.isNull(attrs)) {
        dataModel.set(attrs);
      }

      // retrieve data dataModel the from server using the id
      var xhr = dataModel.sync(method, dataModel, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          var parsedData = configParams.parse.call(dataModel, data, method);
          if (_.isObject(parsedData)) {
            dataModel.set(parsedData);
          }
        });

      return xhr;
    }
  };

  return ajax.makeOrGetRequest('save', requestInfo);
}

/**
 * Delete/destroy the data on the server.
 *
 * @param {boolean} wait Flag telling footwork to wait for the request to finish before sending the destroy event
 * @returns {object} Promise for the HTTP Request
 */
function destroy (wait) {
  var ajax = require('../../misc/ajax');
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;
  var requestInfo = {
    requestRunning: dataModel.isDestroying,
    requestLull: configParams.requestLull,
    entity: dataModel,
    createRequest: function () {
      if (dataModel.isNew()) {
        return false;
      }

      function sendDestroyEvent () {
        dataModel.$namespace.publish('destroy', { wait: wait });
      }
      !wait && sendDestroyEvent();

      var xhr = dataModel.sync('delete', dataModel, { wait: wait });
      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          dataModel[privateDataSymbol].idAttributeObservable(undefined);
          wait && sendDestroyEvent();
        });

      return xhr;
    }
  };

  return ajax.makeOrGetRequest('destroy', requestInfo);
}

/**
 * set attributes in model (clears isDirty on observables/fields it saves to by default)
 *
 * @param {object} attributes The attributes you want to set (only mapped values will be written)
 * @param {object} clearDirty flag indicating whether or not to clear the isDirty flag on any set observables
 * @returns {object} The dataModel instance for chaining
 */
function set (attributes, clearDirty) {
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;

  clearDirty = clearDirty || _.isUndefined(clearDirty);

  var mappingsChanged = false;
  _.each(this[privateDataSymbol].mappings, function (fieldObservable, fieldMap) {
    var fieldValue = getNestedReference(attributes, fieldMap);
    if (!_.isUndefined(fieldValue)) {
      fw.isWriteableObservable(fieldObservable) && fieldObservable(fieldValue);
      mappingsChanged = true;
      clearDirty && fieldObservable.isDirty(false);
    }
  });

  if (mappingsChanged && clearDirty) {
    dataModel.isDirty(evalDirtyState(dataModel));
  }

  return this;
}

/**
 * Convert the dataModel values into its corresponding POJO and return the result.
 *
 * @param {string} referenceField (optional) if included it will only get the referenceField (mapped)
 * @param {boolean} includeRoot (optional) if true it will include the root object in the result
 * @returns {object} The POJO representation of the dataModel
 */
function get (referenceField, includeRoot) {
  var dataModel = this;
  if (_.isArray(referenceField)) {
    return _.reduce(referenceField, function (jsObject, fieldMap) {
      return _.merge(jsObject, dataModel.get(fieldMap, true));
    }, {});
  } else if (!_.isUndefined(referenceField) && !_.isString(referenceField)) {
    throw Error(dataModel.$namespace.getName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.get().');
  }

  var mappedObject = _.reduce(this[privateDataSymbol].mappings, function reduceModelToObject (jsObject, fieldObservable, fieldMap) {
    if (_.isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
      insertValueIntoObject(jsObject, fieldMap, fieldObservable());
    }
    return jsObject;
  }, {});

  return includeRoot ? mappedObject : getNestedReference(mappedObject, referenceField);
}

/**
 * Convert the dataModel into a serialized JSON string
 *
 * @returns {string} The stringified result of the data
 */
function toJSON () {
  return this.get();
}

/**
 * Clear the dataModel of any dirty flags (if field is specified it will only clear that mapped field)
 *
 * @param {string} field (optional) If supplied the method will only clear the specified field
 */
function clean (field) {
  if (!_.isUndefined(field)) {
    var fieldMatch = new RegExp('^' + field + '$|^' + field + '\..*');
  }
  _.each(this[privateDataSymbol].mappings, function (fieldObservable, fieldMap) {
    if (_.isUndefined(field) || fieldMap.match(fieldMatch)) {
      fieldObservable.isDirty(false);
    }
  });

  return this;
}

/**
 * Locally overridable proxy method for main sync() call
 *
 * @returns Promise The sync request promise
 */
function dataModelSync () {
  return fw.sync.apply(this, arguments);
}

/**
 * Determines whether or not the passed in field has been mapped on the dataModel
 *
 * @param {string} referenceField The path/mapped field you wish to check for
 * @returns {boolean} true if the field has been mapped, false if not
 */
function hasMappedField (referenceField) {
  return !!this[privateDataSymbol].mappings[referenceField];
}

/**
 * Returns all of the mapped fields which are dirty.
 *
 * @returns {array} The list of dirty field mappings
 */
function dirtyMap () {
  return _.reduce(this[privateDataSymbol].mappings, function (map, mappedObservable, path) {
    map[path] = mappedObservable.isDirty();
    return map;
  }, {});
}

module.exports = {
  fetch: fetchModel,
  save: save,
  destroy: destroy,
  set: set,
  get: get,
  toJSON: toJSON,
  clean: clean,
  sync: dataModelSync,
  hasMappedField: hasMappedField,
  dirtyMap: dirtyMap
};


