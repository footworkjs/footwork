var fw = require('knockout/build/output/knockout-latest');

var nullRouter = {};
nullRouter[require('../../misc/util').getSymbol('isNullRouter')] = true;

module.exports = {
  noComponentSelected: '_noComponentSelected',
  nullComponent: '_nullComponent',
  invalidRoutePathIdentifier: '___invalid-route',
  routesAreCaseSensitive: true,
  nullRouter: nullRouter,
  outletLoadingDisplay: 'fw-loading-display',
  outletLoadedDisplay: 'fw-loaded-display',
  activeOutlets: fw.observableArray()
};
