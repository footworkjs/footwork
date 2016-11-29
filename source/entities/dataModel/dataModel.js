var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

require('./map');

var entityDescriptors = require('../entity-descriptors');
var resourceHelperFactory = require('../../misc/resource-tools').resourceHelperFactory;
var prepareDescriptor = require('../entity-tools').prepareDescriptor;

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;
var privateDataSymbol = util.getSymbol('footwork');

var entityName = 'dataModel';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

fw[entityName] = {
  boot: require('./dataModel-bootstrap')
};

var descriptor;
entityDescriptors.push(descriptor = prepareDescriptor({
  tagName: entityName.toLowerCase(),
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: isEntityDuckTag,
  isEntity: function (thing) {
    return _.isObject(thing) && !!thing[isEntityDuckTag];
  },
  mixin: require('./dataModel-mixin'),
  defaultConfig: {
    idAttribute: 'id',
    useIdInUrl: true,
    url: null,
    parse: false, // identity?
    fetchOptions: {},
    requestLull: 0
  }
}));

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

// Add/extend on the various resource methods (registerLocation/etc)
_.extend(descriptor.resource, resourceHelperFactory(descriptor));

fw[privateDataSymbol][capitalizeFirstLetter(entityName)] = function DataModel (params) {
  fw.dataModel.boot(this);
};


