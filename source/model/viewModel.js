// viewModel.js
// ------------------

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all viewModel references is returned.
fw.viewModels.getAll = modelGetAll.bind(viewModelConfig);

// Make a viewModel factory
fw.viewModel = modelFactory.bind(viewModelConfig);
