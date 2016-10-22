var _ = require('lodash');

module.exports = _.extend([
  /* filled in by viewModel/dataModel/router modules */
], {
  getTags: function () {
    return _.map(this, function (descriptor) {
      return descriptor.tagName;
    });
  },
  tagNameIsPresent: function isEntityTagNameDescriptorPresent (tagName) {
    tagName = _.isString(tagName) ? tagName.toLowerCase() : null;
    return _.filter(this, function matchingTagNames (descriptor) {
      return descriptor.tagName.toLowerCase() === tagName;
    }).length > 0;
  },
  resourceFor: function getResourceForEntityTagName (tagName) {
    return _.reduce(this, function (resource, descriptor) {
      if (descriptor.tagName === tagName) {
        resource = descriptor.resource;
      }
      return resource;
    }, null);
  },
  getDescriptor: function getDescriptor (tagName) {
    tagName = _.isString(tagName) ? tagName.toLowerCase() : null;
    return _.reduce(this, function reduceDescriptor (foundDescriptor, descriptor) {
      return descriptor.tagName.toLowerCase() === tagName ? descriptor : foundDescriptor;
    }, null);
  }
});
