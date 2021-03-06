var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var nearestEntity = require('../entity-tools').nearestEntity;

var util = require('../../misc/util');
var getSymbol = util.getSymbol;
var resultBound = util.resultBound;
var alwaysPassPredicate = util.alwaysPassPredicate;
var privateDataSymbol = util.getSymbol('footwork');

var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// Convert a route string to a regular expression which is then used to match a uri against it and determine
// whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp (routeString) {
  routeString = routeString
    .replace(escapeRegex, "\\$&")
    .replace(optionalParamRegex, "(?:$1)?")
    .replace(namedParamRegex, function (match, optional) {
      return optional ? match : "([^\/]+)";
    })
    .replace(splatParamRegex, "(.*?)");

  return new RegExp('^' + routeString + (routeString !== '/' ? '(\\/.*)*$' : '$'));
}

/**
 * Locate the nearest router from a given ko $context
 * (travels up through $parentContext chain to find the router if not found on the
 * immediate $context). Returns null if none is found.
 *
 * @param {object} $context
 * @returns {object} router instance or null if none found
 */
function nearestParentRouter ($context) {
  return nearestEntity($context.$parentContext, fw.isRouter);
}

/**
 * Register an outlets viewModel with its parent router.
 *
 * @param {object} router the router to register with
 * @param {string} outletName the name (property) of the outlet
 * @param {object} outletViewModel the outlets viewModel to register with the router
 */
function registerOutlet (router, outletName, outletViewModel) {
  var outletProperties = router[privateDataSymbol].outlets[outletName] = router[privateDataSymbol].outlets[outletName] || {};
  outletProperties.outletViewModel = outletViewModel;

  // register the outletViewModel in a place the user can access it if needed
  var outlets = router.outlets();
  outlets[outletName] = outletViewModel;
  router.outlets.notifySubscribers();
}

/**
 * Unregister an outlets viewModel from its associated router.
 *
 * @param {object} router the router to unregister from
 * @param {string} outletName the name (property) of the outlet
 */
function unregisterOutlet (router, outletName) {
  delete router[privateDataSymbol].outlets[outletName];

  // remove the outletViewModel user accessible registration
  var outlets = router.outlets();
  delete outlets[outletName];
  router.outlets.notifySubscribers();
}

/**
 * Remove the begging portion of a url so that when matching routes we do not need to specify it in each one
 *
 * @param {object} router the router
 * @param {string} url portion of url to ignore
 */
function trimBaseRoute (router, url) {
  var baseRoute = router[privateDataSymbol].configParams.baseRoute;
  if (baseRoute && url && url.indexOf(baseRoute) === 0) {
    url = url.substr(baseRoute.length);
  }
  return url;
}

/**
 * Remove the query string and hash from a url
 *
 * @param {string} url The url to remove the query string and hash from
 * @returns {string} the stripped url
 */
function stripQueryStringAndFragment (url) {
  if (url) {
    url = url.split("?")[0].split("#")[0];
  }
  return url;
}

function getRouteParams (route, routeUrl, destinationUrl) {
  var paramNames = _.map(routeUrl.match(namedParamRegex), function (param) {
    return param.replace(':', '');
  });
  var paramValues = destinationUrl.match(routeStringToRegExp(routeUrl));

  return _.reduce(paramNames, function (routeParams, parameterName, index) {
    routeParams[parameterName] = paramValues[index + 1];
    return routeParams;
  }, {});
}

function getNamedRoute (router, namedRoute) {
  return _.reduce(router.routes(), function (matchedRoute, routeConfig) {
    if (routeConfig.name === namedRoute.name && (routeConfig.predicate || alwaysPassPredicate).call(router, namedRoute) && router[privateDataSymbol].configParams.predicate.call(router, namedRoute)) {
      matchedRoute = {
        routeConfig: routeConfig,
        params: namedRoute.params,
        title: resultBound(routeConfig, 'title', router, [namedRoute]),
        controller: routeConfig.controller
      };
    }
    return matchedRoute;
  }, null);
}

function getMatchedRoute (router, destinationUrl) {
  var strippedDestinationUrl = trimBaseRoute(router, stripQueryStringAndFragment(destinationUrl));

  return _.reduce(router.routes(), function (matchedRoute, routeConfig) {
    var path = routeConfig.path;
    if (_.isString(path) || _.isArray(path)) {
      _.each([].concat(path), function (routePath) {
        if (_.isString(routePath) && _.isString(strippedDestinationUrl) && strippedDestinationUrl.match(routeStringToRegExp(routePath)) && (routeConfig.predicate || alwaysPassPredicate).call(router, strippedDestinationUrl) && router[privateDataSymbol].configParams.predicate.call(router, strippedDestinationUrl)) {
          matchedRoute = {
            routeConfig: routeConfig,
            url: destinationUrl,
            params: getRouteParams(routeConfig, routePath, strippedDestinationUrl),
            title: resultBound(routeConfig, 'title', router, [destinationUrl]),
            controller: routeConfig.controller
          };
        }
      });
    }
    return matchedRoute;
  }, null);
}

/**
 * Returns the current location of the browser, including the query string and hash portions
 *
 * @returns {string} the current location url
 */
function getLocation () {
  var location = window.history.location || window.location;
  return location.pathname + location.search + location.hash;
}

module.exports = {
  nearestParentRouter: nearestParentRouter,
  registerOutlet: registerOutlet,
  unregisterOutlet: unregisterOutlet,
  getNamedRoute: getNamedRoute,
  getMatchedRoute: getMatchedRoute,
  getLocation: getLocation,
  stripQueryStringAndFragment: stripQueryStringAndFragment
};
