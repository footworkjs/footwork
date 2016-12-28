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
var requiredNamedParamRegex = /\/:(\w+)/g;
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
}

/**
 * Unregister an outlets viewModel from its associated router.
 *
 * @param {object} router the router to unregister from
 * @param {string} outletName the name (property) of the outlet
 */
function unregisterOutlet (router, outletName) {
  delete router[privateDataSymbol].outlets[outletName];
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
function stripQueryStringAndHashFromPath (url) {
  if (url) {
    return url.split("?")[0].split("#")[0];
  } else {
    return url;
  }
}

function getRouteParams (route, url) {
  var matchedRoute = getMatchedRoutes(route, url)[0];

  if (matchedRoute) {
    var routeUrl = matchedRoute.routeString;
    var routeParamNames = _.map(routeUrl.match(namedParamRegex), function (param) {
      return param.replace(':', '');
    });
    var routeParams = url.match(routeStringToRegExp(routeUrl));

    return _.reduce(routeParamNames, function (parameterNames, parameterName, index) {
      parameterNames[parameterName] = routeParams[index + 1];
      return parameterNames;
    }, {});
  }

  return {};
}

/**
 * Change the route on the specified router to the specified route.
 *
 * @param {object} router The router instance to manipulate
 * @param {string} historyMethod push/replace the url onto the history stack (if using history)
 * @param {string} route The desired route to change to
 * @returns {object} the router
 */
function changeState (router, historyMethod, newState) {
  if (router.activated()) {
    var configParams = router[privateDataSymbol].configParams;
    var routePredicate = alwaysPassPredicate;
    var foundRoute = null;
    var routeUrl;

    if (_.isObject(newState)) {
      // find named route
      foundRoute = _.find(router.routes(), function (routeConfig) {
        var requiredRouteParams = [];
        var isNamedRoute = routeConfig.name === newState.name;
        if (isNamedRoute) {
          requiredRouteParams = _.map(routeConfig.route.match(requiredNamedParamRegex), function (param) {
            return param.substr(2);
          });

          return _.isEqual(requiredRouteParams, _.keys(newState.params));
        }
        return false;
      });

      if (foundRoute) {
        routePredicate = foundRoute.predicate || alwaysPassPredicate;

        // render the url of the named route to store in the currentState
        routeUrl = foundRoute.route;
        var routeParams = getRouteParams(foundRoute, newState);
        _.each(newState.params, function (value, fieldName) {
          routeUrl = routeUrl.replace(':' + fieldName, routeParams[fieldName]);
        });
      }
    } else if (!fw.utils.isFullURL(newState)) {
      // find route via url route string
      routePredicate = (getCurrentRoute(router, newState) || {}).predicate || alwaysPassPredicate;
      routeUrl = newState;
    }

    /* istanbul ignore if */
    if (routeUrl && routePredicate.call(router, newState) && configParams.predicate.call(router, newState) && historyMethod && !fw.router.disableHistory) {
      history[historyMethod + 'State'](null, '', configParams.baseRoute + routeUrl);
    }

    router.currentState(routeUrl);
  }

  return router;
}

function getCurrentRoute (router, currentState) {
  var routes = router.routes.peek();
  var matchedRoutes = getMatchedRoutes(routes, trimBaseRoute(router, stripQueryStringAndHashFromPath(currentState)));
  var matchedRoute;

  // If there are matchedRoutes, return the one with the highest 'specificity'
  if (matchedRoutes.length) {
    matchedRoute = matchedRoutes[0].routeConfiguration;
  }

  return matchedRoute || _.find(routes, { unknown: true });
}

function getMatchedRoutes (routes, url) {
  return _.reduce([].concat(routes), function (matches, routeConfiguration) {
    routeConfiguration && routeConfiguration.route && _.each([].concat(routeConfiguration.route), function (routeString) {
      if (_.isString(routeString) && _.isString(url) && url.match(routeStringToRegExp(routeString))) {
        matches.push({
          routeConfiguration: routeConfiguration,
          routeString: routeString
        });
      }
    });
    return matches;
  }, []);
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
  routeStringToRegExp: routeStringToRegExp,
  nearestParentRouter: nearestParentRouter,
  registerOutlet: registerOutlet,
  unregisterOutlet: unregisterOutlet,
  changeState: changeState,
  getCurrentRoute: getCurrentRoute,
  getLocation: getLocation,
  getRouteParams: getRouteParams
};
