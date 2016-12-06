var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

require('./map');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

var entityName = 'dataModel';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

fw[entityName] = {
  boot: require('./dataModel-bootstrap'),
  fileExtensions: '.js',
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
  registeredLocations: {},
  registered: {},
  referenceNamespace: '__' + capitalizeFirstLetter(entityName) + 'Reference'
};

require('../resource-tools').addResourceTools(descriptor);
require('../entity-descriptors').push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;


