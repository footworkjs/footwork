var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var nearestEntity = require('../entity-tools').nearestEntity;

var util = require('../../misc/util');
var getSymbol = util.getSymbol;
var resultBound = util.resultBound;
var alwaysPassPredicate = util.alwaysPassPredicate;
var privateDataSymbol = util.getSymbol('footwork');

var routerConfig = require('./router-config');
var baseRoute = routerConfig.baseRoute;

var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatchRegex = /(^\/#)/;

function sameRoute (route1, route2) {
  return route1.routeConfiguration === route2.routeConfiguration && _.isEqual(route1.routeParams, route2.routeParams);
}

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

function trimBaseRoute (router, url) {
  var configParams = router[privateDataSymbol].configParams;
  if (configParams.baseRoute && url && url.indexOf(configParams.baseRoute) === 0) {
    url = url.substr(configParams.baseRoute.length);
    if (url.length > 1) {
      url = url.replace(hashMatchRegex, '/');
    }
  }
  return url;
}

function triggerRoute (router, route) {
  if (!_.isUndefined(route.title)) {
    window.document.title = _.isFunction(route.title) ? route.title.apply(router, _.values(route.routeParams)) : route.title;
  }

  if (_.isUndefined(router[privateDataSymbol].previousRoute) || !sameRoute(router[privateDataSymbol].previousRoute, route)) {
    router[privateDataSymbol].previousRoute = route;
    route.controller.apply(router, _.values(route.routeParams));
  }
}

/**
 * Change the route on the specified router to the specified route using the specified historyMethod and routeParams
 *
 * @param {object} router The router instance to manipulate
 * @param {string} historyMethod push/replace the url onto the history stack (if using history)
 * @param {string} route The desired route to change to
 * @param {object} routeParams (optional) parameters to pass to the route controller
 * @returns {object} the router
 */
function changeRoute (router, historyMethod, route, routeParams) {
  if (router.$activated()) {
    var namedRoute = _.isObject(routeParams) ? route : null;
    var configParams = router[privateDataSymbol].configParams;
    route = route;

    if (!_.isNull(namedRoute)) {
      // must convert namedRoute into its URL form
      var routeDescription = _.find(router.$routes(), function (route) {
        return route.name === namedRoute;
      });

      if (!_.isUndefined(routeDescription)) {
        // render the url of the named route to store in the $currentState
        route = routeDescription.route;
        _.each(routeParams, function (value, fieldName) {
          route = route.replace(':' + fieldName, routeParams[fieldName]);
        });
      } else {
        throw Error('Could not locate named route: ' + namedRoute);
      }
    }

    if (!fw.utils.isFullURL(route)) {
      var foundRoute = getRouteForURL(router, route);
      if (foundRoute && (foundRoute.routeConfiguration.beforeRoute || alwaysPassPredicate).call(router, foundRoute.url) && resultBound(configParams, 'beforeRoute', router, [route || '/'])) {
        /* istanbul ignore if */
        if (!router[privateDataSymbol].activating && route && router[privateDataSymbol].historyPopstateListener() && !fw.router.disableHistory) {
          history[historyMethod + 'State'](null, '', configParams.baseRoute + route);
        }
        router.$currentState(route);
      }
    }
  }

  return router;
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

function getRouteForURL (router, url) {
  var currentRouteDetails;
  var matchedRoutes = [];
  var routeConfiguration;
  var routes = router.$routes();
  url = trimBaseRoute(router, stripQueryStringAndHashFromPath(url));

  // find all routes with a matching routeString
  if (routes) {
    matchedRoutes = _.reduce(routes, function (matches, routeConfiguration) {
      var routeConfigRoute = [].concat(routeConfiguration.route);
      _.each(routeConfigRoute, function (routeString) {
        var routeParams = [];

        if (_.isString(routeString) && _.isString(url)) {
          routeParams = url.match(routeStringToRegExp(routeString));
          if (!_.isNull(routeParams) && (routeConfiguration.filter || alwaysPassPredicate).call(router, routeParams)) {
            matches.push({
              routeString: routeString,
              specificity: routeString.replace(namedParamRegex, "*").length,
              routeConfiguration: routeConfiguration,
              routeParams: routeParams
            });
          }
        }
      });
      return matches;
    }, []);
  }

  // If there are matchedRoutes, find the one with the highest 'specificity' (longest matching routeString)
  // and convert it into the actual route
  if (matchedRoutes.length) {
    var matchedRoute = _.reduce(matchedRoutes, function (matchedRoute, foundRoute) {
      if (_.isNull(matchedRoute) || foundRoute.specificity > matchedRoute.specificity) {
        matchedRoute = foundRoute;
      }
      return matchedRoute;
    }, null);

    var routeString = matchedRoute.routeString;
    var routeParams = _.clone(matchedRoute.routeParams);
    var routeParamNames = _.map(routeString.match(namedParamRegex), function (param) {
      return param.replace(':', '');
    });
    var routeParams = _.reduce(routeParamNames, function (parameterNames, parameterName, index) {
      parameterNames[parameterName] = routeParams[index + 1];
      return parameterNames;
    }, {});

    currentRouteDetails = {
      url: url,
      routeParams: routeParams
    };

    routeConfiguration = matchedRoute.routeConfiguration;
  } else {
    routeConfiguration = _.find(routes, { unknown: true }) || {};
  }

  return _.extend({
    routeConfiguration: routeConfiguration,
    controller: routeConfiguration.controller || _.noop,
    name: routeConfiguration.name,
    title: routeConfiguration.title,
    routeParams: {}
  }, currentRouteDetails);
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
  namedParamRegex: namedParamRegex,
  hashMatchRegex: hashMatchRegex,
  routeStringToRegExp: routeStringToRegExp,
  nearestParentRouter: nearestParentRouter,
  registerOutlet: registerOutlet,
  unregisterOutlet: unregisterOutlet,
  changeRoute: changeRoute,
  getRouteForURL: getRouteForURL,
  triggerRoute: triggerRoute,
  getLocation: getLocation
};
