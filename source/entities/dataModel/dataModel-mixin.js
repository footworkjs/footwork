var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;

var dataTools = require('./data-tools');
var insertValueIntoObject = dataTools.insertValueIntoObject;
var getNestedReference = dataTools.getNestedReference;

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
    createRequest: function() {
      var id = _.result(dataModel, configParams.idAttribute) || _.result(dataModel, '$id');
      if (id) {
        // retrieve data dataModel the from server using the id
        var xhr = dataModel.sync('read', dataModel, options);

        ajax.handleJsonResponse(xhr)
          .then(function handleResponseData (data) {
            var parsedData = configParams.parse ? configParams.parse(data) : data;
            if (!_.isUndefined(parsedData[configParams.idAttribute])) {
              dataModel.set(parsedData);
            }
          });

        return xhr;
      }

      return false;
    }
  };

  return ajax.makeOrGetRequest('fetch', requestInfo);
}

/**
 * PUT / POST / PATCH to server
 *
 * @param {string} (optional) key
 * @param {any} (optional) val
 * @param {object} options (optional) Options passed to sync()
 * @returns {object} Promise Promise for the HTTP Request
 */
function save (key, val, options) {
  var ajax = require('../../misc/ajax');
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;
  var attrs = null;

  if (_.isObject(key) && !isNode(key)) {
    attrs = key;
    options = val;
  } else if (_.isString(key) && arguments.length > 1) {
    (attrs = {})[key] = val;
    options = _.extend(options || {}, { attrs: attrs });
  }

  if (_.isObject(options) && _.isFunction(options.stopPropagation)) {
    // method called as a result of an event binding, ignore its 'options'
    options = {};
  }

  options = _.extend({
    parse: true,
    wait: false,
    patch: false
  }, options);

  if (method === 'patch' && !options.attrs) {
    options.attrs = attrs;
  }

  var method = !dataModel.$id() ? 'create' : (options.patch ? 'patch' : 'update');
  var requestInfo = {
    requestRunning: (method === 'create' ? dataModel.isCreating : dataModel.isSaving),
    requestLull: configParams.requestLull,
    entity: dataModel,
    createRequest: function() {
      if (!options.wait && !_.isNull(attrs)) {
        dataModel.set(attrs);
      }

      // retrieve data dataModel the from server using the id
      var xhr = dataModel.sync(method, dataModel, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          var parsedData = configParams.parse ? configParams.parse(data) : data;

          if (options.wait && !_.isNull(attrs)) {
            parsedData = _.extend({}, attrs, parsedData);
          }

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
 * @param {object} options (optional) Options passed to sync()
 * @returns {object} Promise Promise for the HTTP Request
 */
function destroy (options) {
  var ajax = require('../../misc/ajax');
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;
  var requestInfo = {
    requestRunning: dataModel.isDestroying,
    requestLull: configParams.requestLull,
    entity: dataModel,
    createRequest: function() {
      if (dataModel.isNew()) {
        return false;
      }

      options = options ? _.clone(options) : {};
      var success = options.success;
      var wait = options.wait;

      var sendDestroyEvent = function() {
        dataModel.$namespace.publish('destroy', options);
      };

      if (!options.wait) {
        sendDestroyEvent();
      }

      var xhr = dataModel.sync('delete', dataModel, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          dataModel.$id(undefined);
          if (options.wait) {
            sendDestroyEvent();
          }
        });

      return xhr;
    }
  };

  return ajax.makeOrGetRequest('destroy', requestInfo);
}

/**
 * set attributes in model (clears isDirty on observables/fields it saves to by default)
 *
 * @param {string} key
 * @param {any} value
 * @param {object} options
 */
function set (key, value, options) {
  var attributes = {};
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;

  if (_.isString(key)) {
    attributes = insertValueIntoObject(attributes, key, value);
  } else if (_.isObject(key)) {
    attributes = key;
    options = value;
  }

  options = _.extend({
    clearDirty: true
  }, options);

  var mappingsChanged = false;
  var model = this;
  _.each(this[privateDataSymbol].mappings(), function(fieldObservable, fieldMap) {
    var fieldValue = getNestedReference(attributes, fieldMap);
    if (!_.isUndefined(fieldValue)) {
      fw.isWriteableObservable(fieldObservable) && fieldObservable(fieldValue);
      mappingsChanged = true;
      options.clearDirty && fieldObservable.isDirty(false);
      model.$namespace.publish('_.change.' + fieldMap, fieldValue);
    }
  });

  // make sure that if the user supplied an id value that it is written to whatever available $id is available
  // by default dataModels are instantiated with a $id, leaving it up to the user to (re)map it as desired
  if(attributes[configParams.idAttribute] && !fw.isObservable(dataModel[configParams.idAttribute])) {
    dataModel.$id(attributes[configParams.idAttribute]);
  }

  if (mappingsChanged && options.clearDirty) {
    // we updated the dirty state of a/some field(s), lets tell the dataModel $dirty computed to (re)run its evaluator function
    this[privateDataSymbol].mappings.valueHasMutated();
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
function getData (referenceField, includeRoot) {
  var dataModel = this;
  if (_.isArray(referenceField)) {
    return _.reduce(referenceField, function(jsObject, fieldMap) {
      return _.merge(jsObject, dataModel.get(fieldMap, true));
    }, {});
  } else if (!_.isUndefined(referenceField) && !_.isString(referenceField)) {
    throw Error(dataModel.$namespace.getName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.get().');
  }

  var mappedObject = _.reduce(this[privateDataSymbol].mappings(), function reduceModelToObject (jsObject, fieldObservable, fieldMap) {
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
  return this.getData();
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
  _.each(this[privateDataSymbol].mappings(), function(fieldObservable, fieldMap) {
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
  return !!this[privateDataSymbol].mappings()[referenceField];
}

/**
 * Returns all of the mapped fields which are dirty.
 *
 * @returns {array} The list of dirty field mappings
 */
function dirtyMap () {
  var tree = {};
  _.each(this[privateDataSymbol].mappings(), function(fieldObservable, fieldMap) {
    tree[fieldMap] = fieldObservable.isDirty();
  });
  return tree;
}

module.exports = {
  fetch: fetchModel,
  save: save,
  destroy: destroy,
  set: set,
  get: getData,
  getData: getData,
  toJSON: toJSON,
  clean: clean,
  sync: dataModelSync,
  hasMappedField: hasMappedField,
  dirtyMap: dirtyMap
};


