// framework/model/applyBinding.js
// ------------------

// Override the original applyBindings method to provide 'viewModel' life-cycle hooks/events and to provide the $context to the $router if present.
originalApplyBindings = fw.applyBindings;
fw.applyBindings = function(viewModel, element) {
  originalApplyBindings(viewModel, element);
  setupContextAndLifeCycle(viewModel, element);
};
