// framework/collection/exports.js
// ------------------

var defaultCollectionConfig = {};

fw.collection = function(config) {
  var collection = fw.observableArray();

  extend({}, defaultCollectionConfig, config);

  return collection;
};
