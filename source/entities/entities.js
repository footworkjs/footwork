/**
 * This loader wraps the elements with the $lifecycle as well as sources the viewModel/router/dataModel
 */
require('./entity-loader');

/**
 * These are the 'entities' (footwork-ized view models with lifecycle/etc hooks) that are bootstrapped by the above entity-loader
 */
require('./viewModel/viewModel');
require('./dataModel/dataModel');
require('./router/router');
