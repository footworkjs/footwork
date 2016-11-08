var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var config = require('../../misc/config');
var entityAnimateClass = config.entityAnimateClass;
var privateDataSymbol = config.privateDataSymbol;

var getSymbol = require('../../misc/util').getSymbol;

var noComponentSelected = '_noComponentSelected';
var nullComponent = '_nullComponent';
var invalidRoutePathIdentifier = '___invalid-route';

var routesAreCaseSensitive = true;

var nullRouter = {};
nullRouter[getSymbol('isNullRouter')] = true;

module.exports = {
  defaultLoadingComponent: 'default-loading-display',
  noComponentSelected: noComponentSelected,
  nullComponent: nullComponent,
  invalidRoutePathIdentifier: invalidRoutePathIdentifier,
  routesAreCaseSensitive: routesAreCaseSensitive,
  nullRouter: nullRouter,
  outletLoadingDisplay: 'fw-loading-display',
  outletLoadedDisplay: 'fw-loaded-display',
  activeOutlets: fw.observableArray()
};
