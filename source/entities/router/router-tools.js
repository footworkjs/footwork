var _ = require('lodash');

var nearestEntity = require('../entity-tools').nearestEntity;
var privateDataSymbol = require('../../misc/config').privateDataSymbol;

var util = require('../../misc/util');
var getSymbol = util.getSymbol;
var parseUri = util.parseUri;

var routerDefaults = require('./router-defaults');
var nullRouter = routerDefaults.nullRouter;
var baseRouteDescription = routerDefaults.baseRouteDescription;
var routesAreCaseSensitive = routerDefaults.routesAreCaseSensitive;
var baseRoute = routerDefaults.baseRoute;

var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatchRegex = /(^\/#)/;

function transformRouteConfigToDesc (routeDesc) {
  return _.extend({ id: _.uniqueId('route') }, baseRouteDescription, routeDesc );
}

function sameRouteDescription (desc1, desc2) {
  return desc1.id === desc2.id && _.isEqual(desc1.indexedParams, desc2.indexedParams) && _.isEqual(desc1.namedParams, desc2.namedParams);
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

  return new RegExp('^' + routeString + (routeString !== '/' ? '(\\/.*)*$' : '$'), routesAreCaseSensitive ? undefined : 'i');
}

function isNullRouter (thing) {
  return _.isObject(thing) && !!thing[getSymbol('isNullRouter')];
}

function isRoute (thing) {
  return _.isObject(thing) && !!thing.__isRoute;
}

/**
 * Locate the nearest router from a given ko $context
 * (travels up through $parentContext chain to find the router if not found on the
 * immediate $context). Returns nullRouter if none is found.
 *
 * @param {object} $context
 * @returns {object} router instance or nullRouter if none found
 */
function nearestParentRouter ($context) {
  return nearestEntity($context.$parentContext, fw.isRouter) || nullRouter;
}

/**
 * Register an outlets viewModel with its parent router.
 *
 * @param {object} router the router to register with
 * @param {string} outletName the name (property) of the outlet
 * @param {object} outletViewModel the outlets viewModel to register with the router
 */
function registerOutlet(router, outletName, outletViewModel) {
  var outletProperties = router[privateDataSymbol].outlets[outletName] = router[privateDataSymbol].outlets[outletName] || {};
  outletProperties.outletViewModel = outletViewModel;
}

/**
 * Unregister an outlets viewModel from its associated router.
 *
 * @param {object} router the router to unregister from
 * @param {string} outletName the name (property) of the outlet
 */
function unregisterOutlet(router, outletName) {
  delete router[privateDataSymbol].outlets[outletName];
}

function trimBaseRoute (router, url) {
  var configParams = router[privateDataSymbol].configParams;
  if (configParams.baseRoute && url.indexOf(configParams.baseRoute) === 0) {
    url = url.substr(configParams.baseRoute.length);
    if (url.length > 1) {
      url = url.replace(hashMatchRegex, '/');
    }
  }
  return url;
}

function normalizeURL (router, url) {
  return trimBaseRoute(router, parseUri(url).path);
}

function getUnknownRoute (router) {
  var unknownRoute = _.find(router[privateDataSymbol].routeDescriptions.reverse(), { unknown: true }) || null;

  if (!_.isNull(unknownRoute)) {
    unknownRoute = _.extend({}, baseRoute, {
      id: unknownRoute.id,
      controller: unknownRoute.controller,
      title: unknownRoute.title,
      segment: ''
    });
  }

  return unknownRoute;
}

function getRouteForURL (router, url) {
  var route = null;
  var unknownRoute = getUnknownRoute(router);

  // find all routes with a matching routeString
  var matchedRoutes = _.reduce(router[privateDataSymbol].routeDescriptions, function (matches, routeDescription) {
    var routeDescRoute = [].concat(routeDescription.route);
    _.each(routeDescRoute, function (routeString) {
      var routeParams = [];

      if (_.isString(routeString) && _.isString(url)) {
        routeParams = url.match(routeStringToRegExp(routeString));
        if (!_.isNull(routeParams) && routeDescription.filter.call(router, routeParams)) {
          matches.push({
            routeString: routeString,
            specificity: routeString.replace(namedParamRegex, "*").length,
            routeDescription: routeDescription,
            routeParams: routeParams
          });
        }
      }
    });
    return matches;
  }, []);

  // If there are matchedRoutes, find the one with the highest 'specificity' (longest normalized matching routeString)
  // and convert it into the actual route
  if (matchedRoutes.length) {
    var matchedRoute = _.reduce(matchedRoutes, function (matchedRoute, foundRoute) {
      if (_.isNull(matchedRoute) || foundRoute.specificity > matchedRoute.specificity) {
        matchedRoute = foundRoute;
      }
      return matchedRoute;
    }, null);
    var routeDescription = matchedRoute.routeDescription;
    var routeString = matchedRoute.routeString;
    var routeParams = _.clone(matchedRoute.routeParams);
    var splatSegment = routeParams.pop() || '';
    var routeParamNames = _.map(routeString.match(namedParamRegex), function (param) {
      return param.replace(':', '');
    });
    var namedParams = _.reduce(routeParamNames, function (parameterNames, parameterName, index) {
      parameterNames[parameterName] = routeParams[index + 1];
      return parameterNames;
    }, {});

    route = _.extend({}, baseRoute, {
      id: routeDescription.id,
      controller: routeDescription.controller,
      title: routeDescription.title,
      name: routeDescription.name,
      url: url,
      segment: url.substr(0, url.length - splatSegment.length),
      indexedParams: routeParams,
      namedParams: namedParams
    });
  }

  return route || unknownRoute;
}

function triggerRoute (router, routeDescription) {
  if (isRoute(routeDescription)) {
    if (!_.isUndefined(routeDescription.title)) {
      window.document.title = _.isFunction(routeDescription.title) ? routeDescription.title.apply(router, _.values(routeDescription.namedParams)) : routeDescription.title;
    }

    if (_.isUndefined(router[privateDataSymbol].currentRouteDescription) || !sameRouteDescription(router[privateDataSymbol].currentRouteDescription, routeDescription)) {
      routeDescription.controller.apply(router, _.values(routeDescription.namedParams));
      router[privateDataSymbol].currentRouteDescription = routeDescription;
    }
  }
}

module.exports = {
  namedParamRegex: namedParamRegex,
  hashMatchRegex: hashMatchRegex,
  transformRouteConfigToDesc: transformRouteConfigToDesc,
  sameRouteDescription: sameRouteDescription,
  routeStringToRegExp: routeStringToRegExp,
  isNullRouter: isNullRouter,
  isRoute: isRoute,
  nearestParentRouter: nearestParentRouter,
  registerOutlet: registerOutlet,
  unregisterOutlet: unregisterOutlet,
  trimBaseRoute: trimBaseRoute,
  normalizeURL: normalizeURL,
  getUnknownRoute: getUnknownRoute,
  getRouteForURL: getRouteForURL,
  triggerRoute: triggerRoute
};
