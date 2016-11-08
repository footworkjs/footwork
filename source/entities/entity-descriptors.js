var _ = require('footwork-lodash');

module.exports = _.extend([
  /* filled in by viewModel/dataModel/router modules */
], {
  tagNameIsPresent: function isEntityTagNameDescriptorPresent (tagName) {
    tagName = tagName.toLowerCase();
    return _.filter(this, function matchingTagNames (descriptor) {
      return descriptor.tagName.toLowerCase() === tagName;
    }).length > 0;
  },
  getDescriptor: function getDescriptor (tagName) {
    tagName = tagName.toLowerCase();
    return _.reduce(this, function reduceDescriptor (foundDescriptor, descriptor) {
      return descriptor.tagName.toLowerCase() === tagName ? descriptor : foundDescriptor;
    }, null);
  }
});
