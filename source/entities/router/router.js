var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;
var alwaysPassPredicate = util.alwaysPassPredicate;

var entityName = 'router';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

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
    minTransitionPeriod: 0
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
  referenceNamespace: getSymbol(entityName)
};

require('../resource-tools')(descriptor);
require('../entity-descriptors').push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;
