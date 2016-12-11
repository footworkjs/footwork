var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

var entityName = 'dataModel';

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
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: getSymbol('is' + capitalizeFirstLetter(entityName)),
  isEntity: function (thing) {
    return _.isObject(thing) && thing[descriptor.isEntityDuckTag];
  },
  registeredLocations: {},
  registered: {},
  referenceNamespace: getSymbol(entityName)
};

require('./map');
require('../resource-tools')(descriptor);
require('../entity-descriptors').push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;
