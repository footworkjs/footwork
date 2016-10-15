/* istanbul ignore next */
var _ = require('../misc/lodash');

module.exports = _.extend([
  /* filled in by viewModel/dataModel/router modules */
], {
  getTags: function() {
    return _.map(this, function(descriptor) {
      return descriptor.tagName;
    });
  },
  tagNameIsPresent: function isEntityTagNameDescriptorPresent(tagName) {
    return _.filter(this, function matchingTagNames(descriptor) {
      return descriptor.tagName === tagName;
    }).length > 0;
  },
  resourceFor: function getResourceForEntityTagName(tagName) {
    return _.reduce(this, function(resource, descriptor) {
      if (descriptor.tagName === tagName) {
        resource = descriptor.resource;
      }
      return resource;
    }, null);
  },
  getDescriptor: function getDescriptor(methodName) {
    return _.reduce(this, function reduceDescriptor(foundDescriptor, descriptor) {
      return descriptor.methodName === methodName ? descriptor : foundDescriptor;
    }, null);
  }
});
