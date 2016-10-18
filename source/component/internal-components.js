var _ = require('lodash');

module.exports = _.extend([
  /* filled in by various modules */
], {
  isInternalComponent: function (componentName) {
    return _.indexOf(this, componentName) !== -1;
  }
});
