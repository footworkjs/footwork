var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var config = require('../../misc/config');
var entityAnimateClass = config.entityAnimateClass;
var privateDataSymbol = config.privateDataSymbol;

var alwaysPassPredicate = require('../../misc/util').alwaysPassPredicate;
var getSymbol = require('../../misc/util').getSymbol;

var noComponentSelected = '_noComponentSelected';
var nullComponent = '_nullComponent';
var invalidRoutePathIdentifier = '___invalid-route';

var routesAreCaseSensitive = true;

var nullRouter = {};
nullRouter[getSymbol('isNullRouter')] = true;
nullRouter[privateDataSymbol] = {
  path: function () { return ''; }
};

var baseRoute = {
  controller: _.noop,
  indexedParams: [],
  namedParams: {},
  __isRoute: true
};

var baseRouteDescription = {
  filter: alwaysPassPredicate,
  __isRouteDesc: true
};

module.exports = {
  defaultLoadingComponent: 'default-loading-display',
  noComponentSelected: noComponentSelected,
  nullComponent: nullComponent,
  invalidRoutePathIdentifier: invalidRoutePathIdentifier,
  routesAreCaseSensitive: routesAreCaseSensitive,
  nullRouter: nullRouter,
  baseRoute: baseRoute,
  baseRouteDescription: baseRouteDescription,
  outletLoadingDisplay: 'fw-loading-display',
  outletLoadedDisplay: 'fw-loaded-display',
  activeOutlets: fw.observableArray()
};
