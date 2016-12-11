var _ = require('footwork-lodash');

module.exports = _.extend([
  /* filled in by viewModel/dataModel/router/outlet modules */
], {
  getDescriptor: function getDescriptor (tagName) {
    tagName = tagName.toLowerCase();
    return _.reduce(this, function reduceDescriptor (foundDescriptor, descriptor) {
      return descriptor.tagName.toLowerCase() === tagName ? descriptor : foundDescriptor;
    }, null);
  }
});
