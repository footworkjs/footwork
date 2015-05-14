// framework/entities/router/utility.js
// -----------

function transformRouteConfigToDesc(routeDesc) {
  return extend({ id: uniqueId('route') }, baseRouteDescription, routeDesc );
}

function sameRouteDescription(desc1, desc2) {
  return desc1.id === desc2.id && isEqual(desc1.indexedParams, desc2.indexedParams) && isEqual(desc1.namedParams, desc2.namedParams);
}

// Convert a route string to a regular expression which is then used to match a uri against it and determine
// whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp(routeString) {
  routeString = routeString
    .replace(escapeRegex, "\\$&")
    .replace(optionalParamRegex, "(?:$1)?")
    .replace(namedParamRegex, function(match, optional) {
      return optional ? match : "([^\/]+)";
    })
    .replace(splatParamRegex, "(.*?)");

  return new RegExp('^' + routeString + (routeString !== '/' ? '(\\/.*)*$' : '$'), routesAreCaseSensitive ? undefined : 'i');
}

function historyIsReady() {
  var typeOfHistory = typeof History;
  var isReady = ['function','object'].indexOf(typeOfHistory) !== -1 && has(History, 'Adapter');

  if(isReady && !History.Adapter.isSetup) {
    History.Adapter.isSetup = true;

    // why .unbind() is not already present in History.js is beyond me
    History.Adapter.unbind = function(callback) {
      each(History.Adapter.handlers, function(handler) {
        handler.statechange = filter(handler.statechange, function(stateChangeHandler) {
          return stateChangeHandler !== callback;
        });
      });
    };
  }

  return isReady;
}

function isNullRouter(thing) {
  return isObject(thing) && !!thing.__isNullRouter;
}

function isRoute(thing) {
  return isObject(thing) && !!thing.__isRoute;
}

// Recursive function which will locate the nearest $router from a given ko $context
// (travels up through $parentContext chain to find the router if not found on the
// immediate $context). Returns $nullRouter if none is found.
function nearestParentRouter($context) {
  var $parentRouter = $nullRouter;
  if( isObject($context) ) {
    if( isRouter($context.$data) ) {
      // found router in this context
      $parentRouter = $context.$data;
    } else if( isObject($context.$parentContext) || (isObject($context.$data) && isObject($context.$data.$parentContext)) ) {
      // search through next parent up the chain
      $parentRouter = nearestParentRouter( $context.$parentContext || $context.$data.$parentContext );
    }
  }
  return $parentRouter;
}
