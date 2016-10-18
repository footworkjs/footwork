var _ = require('../misc/lodash');

var fw = require('../../bower_components/knockoutjs/dist/knockout');

require('./sequencing');
require('./lifecycle-loader');
require('./lifecycle-binding');
require('./resource-loader');

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
