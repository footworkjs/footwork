// framework/entities/behavior/DataModel.js
// ------------------

/**
 * Tentative API:
 *
 * var DataModel = fw.dataModel({
 *   id: 'id',
 *
 *   // string based url with automatic RESTful routes
 *   url: 'http://server.com/person',
 *
 *   // custom routes provided by callback
 *   url: function(method) {
 *     switch(method) {
 *       case 'read':
 *         return 'http://server.com/person/:id';
 *         break;
 *
 *       case 'create':
 *         return 'http://server.com/person';
 *         break;
 *
 *       case 'update':
 *         return 'http://server.com/person/:id';
 *         break;
 *
 *       case 'delete':
 *         return 'http://server.com/person/:id';
 *         break;
 *     }
 *   },
 *
 *   initialize: function() {
 *     // field declarations and mapping
 *     this.firstName = fw.observable().mapTo('firstName');
 *     this.lastName = fw.observable().mapTo('lastName');
 *     this.email = fw.observable().mapTo('email');
 *     this.movieCollection = {
 *       action: fw.observable().mapTo('movies.action'),
 *       drama: fw.observable().mapTo('movies.drama'),
 *       comedy: fw.observable().mapTo('movies.comedy'),
 *       horror: fw.observable().mapTo('movies.horror')
 *     };
 *   }
 * });
 */

var dataModelContext = [];
function enterDataModelContext(dataModel) {
  dataModelContext.unshift(dataModel);
}
function exitDataModelContext() {
  dataModelContext.shift();
}

function currentDataModelContext() {
  return dataModelContext.length ? dataModelContext[0] : null;
}

fw.subscribable.fn.mapTo = function(option) {
  var mappedObservable = this;
  var mapPath;
  var dataModel;

  if(isString(option)) {
    mapPath = option;
    dataModel = currentDataModelContext();
  } else if(isObject(option)) {
    mapPath = option.path;
    dataModel = option.dataModel;
  } else {
    throw new Error('Invalid options supplied to mapTo');
  }

  if(isNull(dataModel)) {
    throw new Error('No dataModel context found/supplied for mapTo observable');
  }

  var mappings = dataModel.__mappings;
  if( !isUndefined(mappings[mapPath]) ) {
    throw new Error('this path is already mapped on this dataModel');
  }
  mappings[mapPath] = mappedObservable;

  var changeSubscription = mappedObservable.subscribe(function() {
    dataModel.$dirty(true);
  });

  var disposeObservable = mappedObservable.dispose || noop;
  if(isFunction(mappedObservable.dispose)) {
    mappedObservable.dispose = function() {
      changeSubscription.dispose();
      disposeObservable.call(mappedObservable);
    };
  }

  return mappedObservable;
};

function insertValueIntoObject(rootObject, fieldMap, fieldValue) {
  if(isString(fieldMap)) {
    return insertValueIntoObject(rootObject, fieldMap.split('.'), fieldValue);
  }

  var propName = fieldMap.shift();
  if(fieldMap.length) {
    if(isUndefined(rootObject[propName])) {
      // nested property, lets add the child
      rootObject[propName] = {};
    }
    // recurse into the next layer
    return insertValueIntoObject(rootObject[propName], fieldMap, fieldValue);
  } else {
    rootObject[propName] = fieldValue;
  }

  return rootObject;
}

function getNestedReference(rootObject, fieldMap) {
  var propName = fieldMap;

  if(!isUndefined(fieldMap)) {
    if(isString(fieldMap)) {
      // initial call with string based fieldMap, recurse into main loop
      return getNestedReference(rootObject, fieldMap.split('.'));
    }

    propName = fieldMap.shift();
    if(fieldMap.length) {
      // recurse into the next layer
      return getNestedReference((rootObject || {})[propName], fieldMap);
    }
  }

  return !isString(propName) ? rootObject : (rootObject || {})[propName];
}

function noURLError() {
  throw new Error('A "url" property or function must be specified');
};

// Map from CRUD to HTTP for our default `fw.$sync` implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch':  'PATCH',
  'delete': 'DELETE',
  'read':   'GET'
};

var parseURLRegex = /^(http:\/\/|https:\/\/)*([a-zA-Z0-9:\.]+)[\/]{0,1}([\w\.:\/-]*)$/;
var parseParamsRegex = /(:[\w\.]+)/;

each(runPostInit, function(runTask) {
  fw.ajax = ajax;
  extend(fw.settings, {
    emulateHTTP: false,
    emulateJSON: false
  });
});

fw.sync = function(method, dataModel, options) {
  var type = methodMap[method];
  var params = {
    type: type,
    dataType: 'json'
  };

  options = options || {};
  extend(options, {
    url: null,
    data: null,
    headers: {},
    emulateHTTP: fw.settings.emulateHTTP,
    emulateJSON: fw.settings.emulateJSON
  }, options);

  var url = options.url;
  if(isNull(url)) {
    var configParams = dataModel.__getConfigParams();
    url = configParams.url;
    if(isFunction(url)) {
      url = url.call(dataModel, method);
    } else {
      if(contains(['read', 'update', 'patch', 'delete'], method)) {
        // need to append /:id to url
        url = url.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute;
      }
    }
  }
  var urlPieces = (url || noURLError()).match(parseURLRegex);
  var protocol = urlPieces[1] || '';
  params.url = last(urlPieces);

  // replace any interpolated parameters
  var urlParams = params.url.match(parseParamsRegex);
  if(urlParams) {
    each(urlParams, function(param) {
      params.url = params.url.replace(param, dataModel.$toJS(param.substr(1)));
    });
  }
  params.url = protocol + params.url;

  if(isNull(options.data) && dataModel && contains(['create', 'update', 'patch'], method)) {
    params.contentType = 'application/json';
    params.data = dataModel.$toJS();
  }

  // For older servers, emulate JSON by encoding the request into an HTML-form.
  if(options.emulateJSON) {
    params.contentType = 'application/x-www-form-urlencoded';
    params.data = !isNull(params.data) ? { model: params.data } : {};
  }

  // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
  // And an `X-HTTP-Method-Override` header.
  if(options.emulateHTTP && contains(['PUT', 'DELETE', 'PATCH'], type)) {
    params.type = 'POST';

    if(options.emulateJSON) {
      params.data._method = type;
    }
    extend(options.headers, { 'X-HTTP-Method-Override': type });
  }

  // Don't process data on a non-GET request.
  if(params.type !== 'GET' && !options.emulateJSON) {
    params.processData = false;
  }

  // Pass along `textStatus` and `errorThrown` from jQuery.
  // var error = options.error;
  // options.error = function(xhr, textStatus, errorThrown) {
  //   options.textStatus = textStatus;
  //   options.errorThrown = errorThrown;
  //   if (error) error.call(options.context, xhr, textStatus, errorThrown);
  // };

  return fw.ajax(extend(params, options));
  // dataModel.trigger('request', model, xhr, options);
};

var DataModel = function(descriptor, configParams) {
  return {
    runBeforeInit: true,
    _preInit: function( params ) {
      enterDataModelContext(this);

      this.__mappings = {};

      this.$dirty = fw.observable(false);
      this.$cid = fw.observable( fw.utils.guid() );
      this[configParams.idAttribute] = this.$id = fw.observable().mapTo(configParams.idAttribute);
    },
    mixin: {
      __isDataModel: true,

      // GET from server and $load into model
      $fetch: function() {
        var model = this;
        var id = this[configParams.idAttribute]();
        if(id) {
          // retrieve data from server for model using the id
          this.$sync('read', model);
        }
      },
      $save: function() {}, // PUT / POST
      $destroy: function() {}, // DELETE

      // load data into model (clears $dirty)
      $load: function( data ) {
        var dataModel = this;
        each(dataModel.__mappings, function(fieldObservable, fieldMap) {
          var fieldValue = getNestedReference(data, fieldMap);
          if(!isUndefined(fieldValue)) {
            fieldObservable(fieldValue);
          }
        });
      },

      $sync: function() {
        return fw.sync.apply(this, arguments);
      },

      $hasMappedField: function(referenceField) {
        return !!this.__mappings[referenceField];
      },

      // return current data in POJO form
      $toJS: function(referenceField, includeRoot) {
        var dataModel = this;
        if(isArray(referenceField)) {
          return reduce(referenceField, function(jsObject, fieldMap) {
            return merge(jsObject, dataModel.$toJS(fieldMap, true));
          }, {});
        } else if(!isUndefined(referenceField) && !isString(referenceField)) {
          throw new Error(dataModel.getNamespaceName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.$toJS().');
        }

        var mappedObject = reduce(this.__mappings, function reduceModelToObject(jsObject, fieldObservable, fieldMap) {
          if(isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
            insertValueIntoObject(jsObject, fieldMap, fieldObservable());
          }
          return jsObject;
        }, {});

        return includeRoot ? mappedObject : getNestedReference(mappedObject, referenceField);
      },

      // return current data in JSON form
      $toJSON: function(referenceField, includeRoot) {
        return JSON.stringify( this.$toJS(referenceField, includeRoot) );
      },

      $valid: function( referenceField ) {}, // get validation of entire model or selected field
      $validate: function() {} // perform a validation and return the result on a specific field or the entire model
    },
    _postInit: function() {
      this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
        if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
          var myNamespaceName = configParams.namespace;
          if(isArray(options.namespaceName) && indexOf(options.namespaceName, myNamespaceName) !== -1) {
            return this;
          } else if(isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
            return this;
          }
        }
      }.bind(this));

      exitDataModelContext();
    }
  };
};
