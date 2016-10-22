var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entity-descriptors');
var entityTools = require('../entity-tools');
var ViewModel = require('../viewModel/viewModel');

var dataModelContext = require('./dataModel-context');
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

var dataTools = require('./data-tools');
var getNestedReference = dataTools.getNestedReference;
var insertValueIntoObject = dataTools.insertValueIntoObject;
var dataModelIsNew = dataTools.dataModelIsNew;

function isNode (thing) {
  var thingIsObject = _.isObject(thing);
  return (
    thingIsObject ? thing instanceof Node :
    thingIsObject && _.isNumber(thing.nodeType) === "number" && _.isString(thing.nodeName)
  );
}

var DataModel = module.exports = function DataModel (descriptor, configParams) {
  return {
    runBeforeInit: true,
    _preInit: function (params) {
      params = params || {};
      dataModelContext.enter(this);
      var pkField = configParams.idAttribute;
      this[privateDataSymbol].mappings = fw.observable({});

      this.isCreating = fw.observable(false);
      this.isSaving = fw.observable(false);
      this.isFetching = fw.observable(false);
      this.isDestroying = fw.observable(false);
      this.requestInProgress = fw.pureComputed(function () {
        return this.isCreating() || this.isSaving() || this.isFetching() || this.isDestroying();
      }, this);

      this.$cid = fw.utils.guid();
      this[pkField] = this.$id = fw.observable(params[pkField]).mapTo(pkField);

      this.isNew = fw.pureComputed(dataModelIsNew, this);
    },
    mixin: {
      // GET from server and set in model
      fetch: function (options) {
        var ajax = require('../../misc/ajax');
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isFetching,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function () {
            var id = dataModel[configParams.idAttribute]();
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
      },

      // PUT / POST / PATCH to server
      save: function (key, val, options) {
        var ajax = require('../../misc/ajax');
        var dataModel = this;
        var attrs = null;

        if (_.isObject(key) && !isNode(key)) {
          attrs = key;
          options = val;
        } else if (_.isString(key) && arguments.length > 1) {
          (attrs = {})[key] = val;
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

        var method = _.isUndefined(dataModel.$id()) ? 'create' : (options.patch ? 'patch' : 'update');
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
      },

      // DELETE
      destroy: function (options) {
        var ajax = require('../../misc/ajax');
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isDestroying,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function () {
            if (dataModel.isNew()) {
              return false;
            }

            options = options ? _.clone(options) : {};
            var success = options.success;
            var wait = options.wait;

            var sendDestroyEvent = function () {
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
      },

      // set attributes in model (clears isDirty on observables/fields it saves to by default)
      set: function (key, value, options) {
        var attributes = {};

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
        _.each(this[privateDataSymbol].mappings(), function (fieldObservable, fieldMap) {
          var fieldValue = getNestedReference(attributes, fieldMap);
          if (!_.isUndefined(fieldValue)) {
            fw.isWriteableObservable(fieldObservable) && fieldObservable(fieldValue);
            mappingsChanged = true;
            options.clearDirty && fieldObservable.isDirty(false);
            model.$namespace.publish('_.change.' + fieldMap, fieldValue);
          }
        });

        if (mappingsChanged && options.clearDirty) {
          // we updated the dirty state of a/some field(s), lets tell the dataModel $dirty computed to (re)run its evaluator function
          this[privateDataSymbol].mappings.valueHasMutated();
        }
      },

      get: function (referenceField, includeRoot) {
        var dataModel = this;
        if (_.isArray(referenceField)) {
          return _.reduce(referenceField, function (jsObject, fieldMap) {
            return _.merge(jsObject, dataModel.get(fieldMap, true));
          }, {});
        } else if (!_.isUndefined(referenceField) && !_.isString(referenceField)) {
          throw new Error(dataModel.$namespace.getName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.get().');
        }

        var mappedObject = _.reduce(this[privateDataSymbol].mappings(), function reduceModelToObject (jsObject, fieldObservable, fieldMap) {
          if (_.isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
            insertValueIntoObject(jsObject, fieldMap, fieldObservable());
          }
          return jsObject;
        }, {});

        return includeRoot ? mappedObject : getNestedReference(mappedObject, referenceField);
      },

      getData: function () {
        return this.get();
      },

      toJSON: function () {
        return JSON.stringify(this.getData());
      },

      clean: function (field) {
        if (!_.isUndefined(field)) {
          var fieldMatch = new RegExp('^' + field + '$|^' + field + '\..*');
        }
        _.each(this[privateDataSymbol].mappings(), function (fieldObservable, fieldMap) {
          if (_.isUndefined(field) || fieldMap.match(fieldMatch)) {
            fieldObservable.isDirty(false);
          }
        });
      },

      sync: function () {
        return fw.sync.apply(this, arguments);
      },

      hasMappedField: function (referenceField) {
        return !!this[privateDataSymbol].mappings()[referenceField];
      },

      dirtyMap: function () {
        var tree = {};
        _.each(this[privateDataSymbol].mappings(), function (fieldObservable, fieldMap) {
          tree[fieldMap] = fieldObservable.isDirty();
        });
        return tree;
      }
    },
    _postInit: function () {
      if (configParams.autoIncrement) {
        this.$rootNamespace.request.handler('get', function () { return this.get(); }.bind(this));
      }
      this.$namespace.request.handler('get', function () { return this.get(); }.bind(this));

      this.isDirty = fw.computed(function () {
        return _.reduce(this[privateDataSymbol].mappings(), function (isDirty, mappedField) {
          return isDirty || mappedField.isDirty();
        }, false);
      }, this);

      dataModelContext.exit();
    }
  };
};

fw.dataModel = {};

var methodName = 'dataModel';
var isEntityCtorDuckTag = '__is' + methodName + 'Ctor';
var isEntityDuckTag = '__is' + methodName;
function isDataModelCtor (thing) {
  return _.isFunction(thing) && !!thing[ isEntityCtorDuckTag ];
}
function isDataModel (thing) {
  return _.isObject(thing) && !!thing[ isEntityDuckTag ];
}

var descriptor;
entityDescriptors.push(descriptor = entityTools.prepareDescriptor({
  tagName: methodName.toLowerCase(),
  methodName: methodName,
  resource: fw.dataModel,
  behavior: [ ViewModel, DataModel ],
  isEntityCtorDuckTag: isEntityCtorDuckTag,
  isEntityDuckTag: isEntityDuckTag,
  isEntityCtor: isDataModelCtor,
  isEntity: isDataModel,
  defaultConfig: {
    idAttribute: 'id',
    url: null,
    useKeyInUrl: true,
    parse: false,
    ajaxOptions: {},
    namespace: undefined,
    autoRegister: false,
    autoIncrement: false,
    extend: {},
    mixins: undefined,
    requestLull: undefined,
    afterRender: _.noop,
    afterResolving: function resolveEntityImmediately (resolveNow) {
      resolveNow(true);
    },
    sequenceAnimations: false,
    onDispose: _.noop
  }
}));

fw.dataModel.create = entityTools.entityClassFactory.bind(null, descriptor);

_.extend(entityTools, {
  isDataModelCtor: isDataModelCtor,
  isDataModel: isDataModel
});

require('./mapTo');
