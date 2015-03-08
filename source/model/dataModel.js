// dataModel.js
// ------------------

// Returns a reference to the specified viewModels.
// If no name is supplied, a reference to an array containing all viewModel references is returned.
fw.dataModels.getAll = modelGetAll.bind(dataModelConfig);

// Make a dataModel factory
fw.dataModel = modelFactory.bind(dataModelConfig);
