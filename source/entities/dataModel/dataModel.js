var fw = require('../../../bower_components/knockoutjs/dist/knockout');
var _ = require('../../misc/lodash');

var entityDescriptors = require('../entity-descriptors');
var entityTools = require('../entity-tools');
var ViewModel = require('../viewModel/viewModel');

var dataModelContext = require('./dataModel-context');
var makeOrGetRequest = require('../../misc/util').makeOrGetRequest;

var dataTools = require('./data-tools');
var getNestedReference = dataTools.getNestedReference;
var insertValueIntoObject = dataTools.insertValueIntoObject;

require('./mapTo');

function dataModelIsNew() {
  var id = this.$id();
  return _.isUndefined(id) || _.isNull(id);
}

function isNode(thing) {
  var thingIsObject = _.isObject(thing);
  return (
    thingIsObject ? thing instanceof Node :
    thingIsObject && _.isNumber(thing.nodeType) === "number" && _.isString(thing.nodeName)
  );
}

var DataModel = module.exports = function DataModel(descriptor, configParams) {
  return {
    runBeforeInit: true,
    _preInit: function(params) {
      params = params || {};
      dataModelContext.enter(this);
      var pkField = configParams.idAttribute;
      this.__private('mappings', fw.observable({}));

      this.isCreating = fw.observable(false);
      this.isSaving = fw.observable(false);
      this.isFetching = fw.observable(false);
      this.isDestroying = fw.observable(false);
      this.requestInProgress = fw.pureComputed(function() {
        return this.isCreating() || this.isSaving() || this.isFetching() || this.isDestroying();
      }, this);

      this.$cid = fw.utils.guid();
      this[pkField] = this.$id = fw.observable(params[pkField]).mapTo(pkField);

      this.isNew = fw.pureComputed(dataModelIsNew, this);
    },
    mixin: {
      // GET from server and set in model
      fetch: function(options) {
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isFetching,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            var id = dataModel[configParams.idAttribute]();
            if(id) {
              // retrieve data dataModel the from server using the id
              var xhr = dataModel.sync('read', dataModel, options);

              return (xhr.done || xhr.then).call(xhr, function(response) {
                var parsedResponse = configParams.parse ? configParams.parse(response) : response;
                if(!_.isUndefined(parsedResponse[configParams.idAttribute])) {
                  dataModel.set(parsedResponse);
                }
              });
            }

            return false;
          }
        };

        return makeOrGetRequest('fetch', requestInfo);
      },

      // PUT / POST / PATCH to server
      save: function(key, val, options) {
        var dataModel = this;
        var attrs = null;

        if(isObject(key) && !isNode(key)) {
          attrs = key;
          options = val;
        } else if(isString(key) && arguments.length > 1) {
          (attrs = {})[key] = val;
        }

        if(isObject(options) && isFunction(options.stopPropagation)) {
          // method called as a result of an event binding, ignore its 'options'
          options = {};
        }

        options = extend({
          parse: true,
          wait: false,
          patch: false
        }, options);

        if(method === 'patch' && !options.attrs) {
          options.attrs = attrs;
        }

        var method = _.isUndefined(dataModel.$id()) ? 'create' : (options.patch ? 'patch' : 'update');
        var requestInfo = {
          requestRunning: (method === 'create' ? dataModel.isCreating : dataModel.isSaving),
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            if(!options.wait && !_.isNull(attrs)) {
              dataModel.set(attrs);
            }

            var xhr = dataModel.sync(method, dataModel, options);
            return (xhr.done || xhr.then).call(xhr, function(response) {
              var resourceData = configParams.parse ? configParams.parse(response) : response;

              if(options.wait && !_.isNull(attrs)) {
                resourceData = extend({}, attrs, resourceData);
              }

              if(isObject(resourceData)) {
                dataModel.set(resourceData);
              }
            });
          }
        };

        return makeOrGetRequest('save', requestInfo);
      },

      // DELETE
      destroy: function(options) {
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isDestroying,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            if(dataModel.isNew()) {
              return false;
            }

            options = options ? clone(options) : {};
            var success = options.success;
            var wait = options.wait;

            var sendDestroyEvent = function() {
              dataModel.$namespace.publish('destroy', options);
            };

            if(!options.wait) {
              sendDestroyEvent();
            }

            var xhr = dataModel.sync('delete', dataModel, options);
            return (xhr.done || xhr.then).call(xhr, function() {
              dataModel.$id(undefined);
              if(options.wait) {
                sendDestroyEvent();
              }
            });
          }
        };

        return makeOrGetRequest('destroy', requestInfo);
      },

      // set attributes in model (clears isDirty on observables/fields it saves to by default)
      set: function(key, value, options) {
        var attributes = {};

        if(isString(key)) {
          attributes = insertValueIntoObject(attributes, key, value);
        } else if(isObject(key)) {
          attributes = key;
          options = value;
        }

        options = extend({
          clearDirty: true
        }, options);

        var mappingsChanged = false;
        var model = this;
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          var fieldValue = getNestedReference(attributes, fieldMap);
          if(!_.isUndefined(fieldValue)) {
            fw.isWriteableObservable(fieldObservable) && fieldObservable(fieldValue);
            mappingsChanged = true;
            options.clearDirty && fieldObservable.isDirty(false);
            model.$namespace.publish('_.change.' + fieldMap, fieldValue);
          }
        });

        if(mappingsChanged && options.clearDirty) {
          // we updated the dirty state of a/some field(s), lets tell the dataModel $dirty computed to (re)run its evaluator function
          this.__private('mappings').valueHasMutated();
        }
      },

      get: function(referenceField, includeRoot) {
        var dataModel = this;
        if(isArray(referenceField)) {
          return reduce(referenceField, function(jsObject, fieldMap) {
            return merge(jsObject, dataModel.get(fieldMap, true));
          }, {});
        } else if(!_.isUndefined(referenceField) && !isString(referenceField)) {
          throw new Error(dataModel.$namespace.getName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.get().');
        }

        var mappedObject = reduce(this.__private('mappings')(), function reduceModelToObject(jsObject, fieldObservable, fieldMap) {
          if(_.isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
            insertValueIntoObject(jsObject, fieldMap, fieldObservable());
          }
          return jsObject;
        }, {});

        return includeRoot ? mappedObject : getNestedReference(mappedObject, referenceField);
      },

      getData: function() {
        return this.get();
      },

      toJSON: function() {
        return JSON.stringify(this.getData());
      },

      clean: function(field) {
        if(!_.isUndefined(field)) {
          var fieldMatch = new RegExp('^' + field + '$|^' + field + '\..*');
        }
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          if(_.isUndefined(field) || fieldMap.match(fieldMatch)) {
            fieldObservable.isDirty(false);
          }
        });
      },

      sync: function() {
        return fw.sync.apply(this, arguments);
      },

      hasMappedField: function(referenceField) {
        return !!this.__private('mappings')()[referenceField];
      },

      dirtyMap: function() {
        var tree = {};
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          tree[fieldMap] = fieldObservable.isDirty();
        });
        return tree;
      }
    },
    _postInit: function() {
      if(configParams.autoIncrement) {
        this.$rootNamespace.request.handler('get', function() { return this.get(); }.bind(this));
      }
      this.$namespace.request.handler('get', function() { return this.get(); }.bind(this));

      this.isDirty = fw.computed(function() {
        return reduce(this.__private('mappings')(), function(isDirty, mappedField) {
          return isDirty || mappedField.isDirty();
        }, false);
      }, this);

      dataModelContext.exit();
    }
  };
};

fw.dataModel = {};

var descriptor;
entityDescriptors.push(descriptor = entityTools.prepareDescriptor({
  tagName: 'datamodel',
  methodName: 'dataModel',
  resource: fw.dataModel,
  behavior: [ ViewModel, DataModel ],
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
    afterResolving: function resolveEntityImmediately(resolveNow) {
      resolveNow(true);
    },
    sequenceAnimations: false,
    onDispose: _.noop
  }
}));

fw.dataModel.create = entityTools.entityClassFactory.bind(null, descriptor);
