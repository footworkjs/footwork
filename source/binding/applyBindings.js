var fw = require('../../bower_components/knockoutjs/dist/knockout');
var _ = require('lodash');

var entityLifecycle = require('../entities/entity-lifecycle');

// Override the original applyBindings method to assess history API state and provide viewModel/dataModel/router life-cycle
var originalApplyBindings = fw.applyBindings;
var callRequire = 'require';
fw.applyBindings = function(viewModelOrBindingContext, rootNode) {
  if (_.isFunction(window.require)) {
    // must initialize default require context (https://github.com/jrburke/requirejs/issues/1305#issuecomment-87924865)
    window.require([]);
  }

  originalApplyBindings(viewModelOrBindingContext, rootNode);
  entityLifecycle(viewModelOrBindingContext, rootNode);
};
