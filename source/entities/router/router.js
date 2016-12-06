var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;
var alwaysPassPredicate = util.alwaysPassPredicate;

var entityName = 'router';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

require('./route-binding');
require('./outlet/outlet');

fw[entityName] = {
  boot: require('./router-bootstrap'),
  baseRoute: '',
  activeRouteClassName: 'active',
  disableHistory: false,
  defaultConfig: {
    showDuringLoad: require('./router-defaults').noComponentSelected,
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
