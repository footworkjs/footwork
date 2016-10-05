var _ = require('../misc/lodash');

module.exports = _.extend([
  /* filled in by various modules */
], {
  isInternalComponent: function (componentName) {
    return indexOf(this, componentName) !== -1;
  }
});
