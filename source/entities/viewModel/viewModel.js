var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('../entity-descriptors');
var resourceHelperFactory = require('../../misc/resource-tools').resourceHelperFactory;

var entityTools = require('../entity-tools');
var prepareDescriptor = entityTools.prepareDescriptor;
var resolveEntityImmediately = entityTools.resolveEntityImmediately;

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;
var privateDataSymbol = util.getSymbol('footwork');

var entityName = 'viewModel';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

fw[entityName] = {
  boot: require('./viewModel-bootstrap'),
  defaultConfig: {
    namespace: undefined,
    afterRender: _.noop,
    afterResolving: resolveEntityImmediately,
    sequenceAnimations: false,
    onDispose: _.noop
  }
};

var descriptor;
entityDescriptors.push(descriptor = prepareDescriptor({
  tagName: entityName.toLowerCase(),
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: isEntityDuckTag,
  isEntity: function (thing) {
    return _.isObject(thing) && !!thing[isEntityDuckTag];
  }
}));

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

// Add/extend on the various resource methods (registerLocation/etc)
_.extend(descriptor.resource, resourceHelperFactory(descriptor));

fw[privateDataSymbol][capitalizeFirstLetter(entityName)] = function ViewModel (params) {
  fw.viewModel.boot(this);
};


