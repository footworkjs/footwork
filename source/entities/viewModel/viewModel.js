var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityTools = require('../entity-tools');
var resolveEntityImmediately = entityTools.resolveEntityImmediately;

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

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

var descriptor = {
  tagName: entityName.toLowerCase(),
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: isEntityDuckTag,
  isEntity: function (thing) {
    return _.isObject(thing) && !!thing[isEntityDuckTag];
  },
  resourceLocations: {},
  registered: {},
  fileExtensions: fw.observable('.js'),
  referenceNamespace: '__' + capitalizeFirstLetter(entityName) + 'Reference'
};
require('../entity-descriptors').push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

// Add/extend on the various resource methods (registerLocation/etc)
var resourceHelperFactory = require('../../entities/resource-tools').resourceHelperFactory;
_.extend(descriptor.resource, resourceHelperFactory(descriptor));


