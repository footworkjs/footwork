// framework/specialTags/DataModel.js
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
 *   validate: {
 *     'firstName': 'notEmpty',
 *     'lastName': 'notEmpty',
 *     'email': 'validEmail',
 *     'movies.action': function(actionMovies) {
 *       return actionMovies.indexOf('Commando') !== -1;
 *     }
 *   }
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

  var config = dataModel.$$dataModel;
  if( !isUndefined(config.fields[mapPath]) ) {
    throw new Error('this path is already mapped on this dataModel');
  }
  config.fields[mapPath] = mappedObservable;

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
    insertValueIntoObject(rootObject[propName], fieldMap, fieldValue);
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
      return getNestedReference(rootObject[propName], fieldMap);
    }
  }

  return !isString(propName) ? rootObject : rootObject[propName];
}

var DataModel = function(descriptor, configParams) {
  configParams = extend({}, {
    id: 'id'
  }, configParams);

  return {
    runBeforeInit: true,
    _preInit: function( params ) {
      enterDataModelContext(this);
    },
    mixin: {
      __isDataModel: true,
      // internal tracking/mapping/etc data
      $$dataModel: {
        fields: {}
      },
      $fetch: function() {}, // GET from server and $load into model
      $save: function() {}, // PUT / POST
      $destroy: function() {}, // DELETE
      $load: function(/* { ... } */) {}, // load data into model (clears $dirty)
      $toJS: function $toJS(referenceField) {
        var mappedObject = reduce(this.$$dataModel.fields, function reduceModelToObject(jsObject, fieldObservable, fieldMap) {
          if(isUndefined(referenceField) || fieldMap.indexOf(referenceField) === 0) {
            insertValueIntoObject(jsObject, fieldMap, fieldObservable());
          }
          return jsObject;
        }, {});

        return getNestedReference(mappedObject, referenceField);
      }, // return current data in POJO form
      $toJSON: function() {}, // return current data in JSON form,
      $dirty: function() {}, // return whether or not the model data has been changed, or set it to a state
      $valid: function(/* 'movies.drama' */) {}, // get validation of entire model or selected field
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
