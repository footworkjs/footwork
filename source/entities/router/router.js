var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entity-descriptors');
var resourceHelperFactory = require('../../misc/resource-tools').resourceHelperFactory;
var prepareDescriptor = require('../entity-tools').prepareDescriptor;

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
  baseRoute: fw.observable(''),
  activeRouteClassName: fw.observable('active'),
  disableHistory: fw.observable(false)
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
  mixin: require('./router-mixin'),
  defaultConfig: {
    showDuringLoad: require('./router-defaults').noComponentSelected,
    onDispose: _.noop,
    baseRoute: '',
    isRelative: false,
    activate: true,
    beforeRoute: alwaysPassPredicate,
    minTransitionPeriod: 0
  }
}));

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

// Add/extend on the various resource methods (registerLocation/etc)
_.extend(descriptor.resource, resourceHelperFactory(descriptor));

require('../../misc/config')[capitalizeFirstLetter(entityName)] = function DefaultInstance (params) {
  if (_.isObject(params) && _.isObject(params.$viewModel)) {
    _.extend(this, params.$viewModel);
  }
};


