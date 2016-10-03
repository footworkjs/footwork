var fw = require('../../bower_components/knockoutjs/dist/knockout.js');
var _ = require('../misc/lodash');

// Override the original applyBindings method to assess history API state and provide viewModel/dataModel/router life-cycle
var originalApplyBindings = fw.applyBindings;
fw.applyBindings = function(viewModelOrBindingContext, rootNode) {
  // must initialize default require context (https://github.com/jrburke/requirejs/issues/1305#issuecomment-87924865)
  _.isFunction(require) && require([]);

  originalApplyBindings(viewModelOrBindingContext, rootNode);
  setupContextAndLifeCycle(viewModelOrBindingContext, rootNode);
};
