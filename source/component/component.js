var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

require('./lifecycle-binding');
require('./component-init');
require('./loaders/entity-loader');
require('./loaders/component-lifecycle-loader');
require('./loaders/component-resource-loader');

var entityDescriptors = require('../entities/entity-descriptors');

fw.components.getComponentNameForNode = function(node) {
  var tagName = _.isString(node.tagName) && node.tagName.toLowerCase();

  if(fw.components.isRegistered(tagName)
     || fw.components.locationIsRegistered(tagName)
     || entityDescriptors.tagNameIsPresent(tagName)) {
    return tagName;
  }

  return null;
};
