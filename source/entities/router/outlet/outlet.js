var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../../entity-descriptors');

var entityTools = require('../../entity-tools');
var prepareDescriptor = entityTools.prepareDescriptor;

var util = require('../../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

require('./outlet-loader');
require('./outlet-binder');

var entityName = 'outlet';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

fw[entityName] = {
  boot: require('./outlet-bootstrap'),
  registerView: function (viewName, templateHTML) {
    fw.components.register(viewName, { template: templateHTML });
  },
  registerViewLocation: function (viewName, viewLocation) {
    fw.components.registerLocation(viewName, { template: viewLocation });
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
  },
  mixin: require('./outlet-mixin'),
  defaultConfig: {}
}));

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;


