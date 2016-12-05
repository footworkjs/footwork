var fw = require('knockout/build/output/knockout-latest');

/**
 * This module simply returns the subscribable used to abstract the pub/sub functionality in footwork.
 * Reference: http://www.knockmeout.net/2012/05/using-ko-native-pubsub.html
 */
var postboxes = {};

module.exports = function postbox (namespaceName) {
  if (!postboxes[namespaceName]) {
    postboxes[namespaceName] = new fw.subscribable();
  }

  return postboxes[namespaceName];
};
