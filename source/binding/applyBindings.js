var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityTools = require('../entities/entity-tools');
var isEntity = entityTools.isEntity;
var isRouter = entityTools.isRouter;

// Override the original applyBindings method to provide viewModel/dataModel/router life-cycle events
var originalApplyBindings = fw.applyBindings;
fw.applyBindings = function(viewModelOrBindingContext, rootNode) {
  originalApplyBindings(viewModelOrBindingContext, rootNode);

  if(isEntity(viewModelOrBindingContext)) {
    var configParams = viewModelOrBindingContext.__private.configParams;

    // trigger afterRender on the viewModel
    configParams.afterRender.call(viewModelOrBindingContext, rootNode);

    // supply the context to the instance if it is a router
    if (isRouter(viewModelOrBindingContext)) {
      viewModelOrBindingContext.__private.context(fw.contextFor(rootNode));
    }
  }
};
