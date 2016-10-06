var fw = require('../../../bower_components/knockoutjs/dist/knockout');
var _ = require('../../misc/lodash');

var entityDescriptors = require('../entity-descriptors');
var entityTools = require('../entity-tools');
var entityClassFactory = entityTools.entityClassFactory;

var ViewModel = module.exports = function ViewModel(descriptor, configParams) {
  return {
    mixin: {
      disposeWithInstance: function(subscription) {
        if(_.isArray(subscription)) {
          var self = this;
          _.each(subscription, function(sub) {
            self.disposeWithInstance(sub);
          });
        } else {
          var subscriptions = this.__private('subscriptions');
          if(!_.isArray(subscriptions)) {
            subscriptions = [];
          }

          subscription && subscriptions.push(subscription);
          this.__private('subscriptions', subscriptions);
        }
      },
      dispose: function() {
        if(!this._isDisposed) {
          this._isDisposed = true;
          if(configParams.onDispose !== noop) {
            configParams.onDispose.call(this, this.__private('element'));
          }
          _.each(this, propertyDispose);
          _.each(this.__private('subscriptions') || [], propertyDispose);
        }
        return this;
      }
    },
    _postInit: function() {
      this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
        if(_.isString(options.namespaceName) || _.isArray(options.namespaceName)) {
          var myNamespaceName = this.$namespace.getName();
          if(_.isArray(options.namespaceName) && _.indexOf(options.namespaceName, myNamespaceName) !== -1) {
            return this;
          } else if(_.isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
            return this;
          }
        } else {
          return this;
        }
      }.bind(this));
    }
  };
};

fw.viewModel = {};

var methodName = 'viewModel';
var isEntityCtorDuckTag = '__is' + methodName + 'Ctor';
var isEntityDuckTag = '__is' + methodName;
function isViewModelCtor(thing) {
  return _.isFunction(thing) && !!thing[ isEntityCtorDuckTag ];
}
function isViewModel(thing) {
  return _.isObject(thing) && !!thing[ isEntityDuckTag ];
}

var descriptor;
entityDescriptors.push(descriptor = entityTools.prepareDescriptor({
  tagName: methodName.toLowerCase(),
  methodName: methodName,
  resource: fw.viewModel,
  behavior: [ ViewModel ],
  isEntityCtorDuckTag: isEntityCtorDuckTag,
  isEntityDuckTag: isEntityDuckTag,
  isEntityCtor: isViewModelCtor,
  isEntity: isViewModel,
  defaultConfig: {
    namespace: undefined,
    autoRegister: false,
    autoIncrement: false,
    extend: {},
    mixins: undefined,
    afterRender: _.noop,
    afterResolving: function resolveEntityImmediately(resolveNow) {
      resolveNow(true);
    },
    sequenceAnimations: false,
    onDispose: _.noop
  }
}));

fw.viewModel.create = entityTools.entityClassFactory.bind(null, descriptor);

require('../../misc/config').DefaultViewModel = fw.viewModel.create({
  namespace: '_DefaultViewModelNamespace',
  autoIncrement: true,
  initialize: function(params) {
    if(_.isObject(params) && _.isObject(params.$viewModel)) {
      _.extend(this, params.$viewModel);
    }
  }
});
