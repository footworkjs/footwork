var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

require('./map');

var entityDescriptors = require('../entity-descriptors');
var resourceHelperFactory = require('../../entities/resource-tools').resourceHelperFactory;

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;
var privateDataSymbol = util.getSymbol('footwork');

var entityName = 'dataModel';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

fw[entityName] = {
  boot: require('./dataModel-bootstrap'),
  defaultConfig: {
    idAttribute: 'id',
    url: null,
    parse: _.identity,
    fetchOptions: {},
    requestLull: 0
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
entityDescriptors.push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

// Add/extend on the various resource methods (registerLocation/etc)
_.extend(descriptor.resource, resourceHelperFactory(descriptor));


