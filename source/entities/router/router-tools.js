var _ = require('lodash');

var nearestEntity = require('../entity-tools').nearestEntity;

var routerDefaults = require('./router-defaults');
var $nullRouter = routerDefaults.$nullRouter;
var baseRouteDescription = routerDefaults.baseRouteDescription;
var routesAreCaseSensitive = routerDefaults.routesAreCaseSensitive;

var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatchRegex = /(^\/#)/;

function transformRouteConfigToDesc(routeDesc) {
  return _.extend({ id: _.uniqueId('route') }, baseRouteDescription, routeDesc );
}

function sameRouteDescription(desc1, desc2) {
  return desc1.id === desc2.id && _.isEqual(desc1.indexedParams, desc2.indexedParams) && _.isEqual(desc1.namedParams, desc2.namedParams);
}

// Convert a route string to a regular expression which is then used to match a uri against it and determine
// whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp(routeString) {
  routeString = routeString
    .replace(escapeRegex, "\\$&")
    .replace(optionalParamRegex, "(?:$1)?")
    .replace(namedParamRegex, function (match, optional) {
      return optional ? match : "([^\/]+)";
    })
    .replace(splatParamRegex, "(.*?)");

  return new RegExp('^' + routeString + (routeString !== '/' ? '(\\/.*)*$' : '$'), routesAreCaseSensitive ? undefined : 'i');
}

function isNullRouter(thing) {
  return _.isObject(thing) && !!thing.__isNullRouter;
}

function isRoute(thing) {
  return _.isObject(thing) && !!thing.__isRoute;
}

function isOutletViewModel(thing) {
  return _.isObject(thing) && thing.__isOutlet;
}

/**
 * Locate the nearest $router from a given ko $context
 * (travels up through $parentContext chain to find the router if not found on the
 * immediate $context). Returns $nullRouter if none is found.
 *
 * @param {object} $context
 * @returns {object} router instance or $nullRouter if none found
 */
function nearestParentRouter($context) {
  return nearestEntity($context, require('../entity-tools').isRouter) || $nullRouter;
}

module.exports = {
  namedParamRegex: namedParamRegex,
  hashMatchRegex: hashMatchRegex,
  transformRouteConfigToDesc: transformRouteConfigToDesc,
  sameRouteDescription: sameRouteDescription,
  routeStringToRegExp: routeStringToRegExp,
  isNullRouter: isNullRouter,
  isRoute: isRoute,
  isOutletViewModel: isOutletViewModel,
  nearestParentRouter: nearestParentRouter
};
