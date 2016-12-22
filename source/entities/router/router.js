var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;
var alwaysPassPredicate = util.alwaysPassPredicate;

var entityName = 'router';

require('./route-binding');

fw[entityName] = {
  boot: require('./router-bootstrap'),
  baseRoute: '',
  activeClass: 'active',
  disableHistory: false,
  fileExtensions: '.js',
  defaultConfig: {
    showDuringLoad: require('./router-config').noComponentSelected,
    onDispose: _.noop,
    baseRoute: '',
    activate: true,
    beforeRoute: alwaysPassPredicate,
    transition: 0
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

require('../resource-tools')(descriptor);
require('../entity-descriptors').push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;
