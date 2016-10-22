var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entity-descriptors');
var prepareDescriptor = require('../entity-tools').prepareDescriptor;

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var makeSymbol = util.makeSymbol;

var entityName = 'router';
var isEntityDuckTag = makeSymbol('__is' + capitalizeFirstLetter(entityName));

var descriptor;
entityDescriptors.push(descriptor = prepareDescriptor({
  tagName: entityName.toLowerCase(),
  entityName: entityName,
  resource: fw[entityName] = {},
  isEntityDuckTag: isEntityDuckTag,
  isEntity: function (thing) {
    return _.isObject(thing) && !!thing[isEntityDuckTag];
  },
  mixin: require('./router-mixin'),
  defaultConfig: {
    namespace: undefined,
    afterRender: _.noop,
    afterResolving: function resolveEntityImmediately (resolveNow) {
      resolveNow(true);
    },
    sequenceAnimations: false,
    onDispose: _.noop
  }
}));

_.extend(fw[entityName], {
  boot: require('./router-bootstrap'),
  getPrivateData: require('../../misc/util').getPrivateData
});

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

require('../../misc/config')[capitalizeFirstLetter(entityName)] = function DefaultInstance (params) {
  if (_.isObject(params) && _.isObject(params.$viewModel)) {
    _.extend(this, params.$viewModel);
  }
};


