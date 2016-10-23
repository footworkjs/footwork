var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entity-descriptors');

var entityTools = require('../entity-tools');
var prepareDescriptor = entityTools.prepareDescriptor;
var resolveEntityImmediately = entityTools.resolveEntityImmediately;

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

var entityName = 'router';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

fw[entityName] = {
  boot: require('./router-bootstrap')
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
    /* fill in later */
  }
}));

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

require('../../misc/config')[capitalizeFirstLetter(entityName)] = function DefaultInstance (params) {
  if (_.isObject(params) && _.isObject(params.$viewModel)) {
    _.extend(this, params.$viewModel);
  }
};


