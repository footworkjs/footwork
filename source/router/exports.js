// router/utility.js
// -----------

fwRouters = fw.routers = {
  // Configuration point for a baseRoute / path which will always be stripped from the URL prior to processing the route
  baseRoute: fw.observable(''),
  activeRouteClassName: fw.observable('active'),
  disableHistory: fw.observable(false).broadcastAs({ name: 'disableHistory', namespace: $globalNamespace }),
  html5History: function() {
    return hasHTML5History;
  },

  getNearestParent: function($context) {
    var $parentRouter = nearestParentRouter($context);
    return (!isNullRouter($parentRouter) ? $parentRouter : null);
  },

  // Return array of all currently instantiated $router's (optionally for a given viewModelNamespaceName)
  getAll: function(routerNamespaceName) {
    if( !isUndefined(routerNamespaceName) && !isArray(routerNamespaceName) ) {
      routerNamespaceName = [ routerNamespaceName ];
    }

    return reduce( $globalNamespace.request('__router_reference', undefined, true), function(routers, router) {
      var namespaceName = isNamespace(router.$namespace) ? router.$namespace.getName() : null;

      if( !isNull(namespaceName) ) {
        if( isUndefined(routerNamespaceName) || contains(routerNamespaceName, namespaceName) ) {
          if( isUndefined(routers[namespaceName]) ) {
            routers[namespaceName] = router;
          } else {
            if( !isArray(routers[namespaceName]) ) {
              routers[namespaceName] = [ routers[namespaceName] ];
            }
            routers[namespaceName].push(router);
          }
        }
      }
      return routers;
    }, {});
  }
};

makeRouter = fw.router = function( routerConfig ) {
  return makeViewModel({
    router: routerConfig
  });
};
