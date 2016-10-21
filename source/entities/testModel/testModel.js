var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entity-descriptors');
var prepareDescriptor = require('../entity-tools').prepareDescriptor;

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var makeSymbol = util.makeSymbol;

var entityName = 'viewModel';
var isEntityDuckTag = makeSymbol('__is' + capitalizeFirstLetter(entityName));
var entityResource = fw[entityName] = {};

var descriptor;
entityDescriptors.push(descriptor = prepareDescriptor({
  tagName: entityName.toLowerCase(),
  entityName: entityName,
  resource: entityResource,
  isEntity: function (thing) {
    return _.isObject(thing) && !!thing[ isEntityDuckTag ];
  },
  mixin: require('./viewModel-mixin'),
  defaultConfig: {
    namespace: undefined,
    autoRegister: false,
    afterRender: _.noop,
    afterResolving: function resolveEntityImmediately(resolveNow) {
      resolveNow(true);
    },
    sequenceAnimations: false,
    onDispose: _.noop
  }
}));

_.extend(fw[entityName], {
  boot: _.partial(require('./viewModel-boot'), descriptor, isEntityDuckTag),
  getPrivateData: require('../../misc/util').getPrivateData
});

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

require('../../misc/config')[capitalizeFirstLetter(entityName)] = function (params) {
  if (_.isObject(params) && _.isObject(params.$viewModel)) {
    _.extend(this, params.$viewModel);
  }
};


