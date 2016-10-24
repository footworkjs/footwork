/**
 * Registry which stores component information as it is loaded.
 * This information is used by footwork to bootstrap the component/entity.
 */
var currentlyLoading;

module.exports = {
  set: function (loadingTracker) {
    currentlyLoading = loadingTracker;
  },
  get: function () {
    return currentlyLoading;
  }
};
