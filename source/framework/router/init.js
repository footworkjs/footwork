// framework/router/init.js
// ------------------

var routerDefaultConfig = {
  namespace: '$router',
  baseRoute: null,
  isRelative: true,
  activate: true,
  routes: []
};

// Regular expressions used to parse a uri
var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatchRegex = /(^\/#)/;
var routesAreCaseSensitive = true;

var invalidRoutePathIdentifier = '___invalid-route';

var $baseRouter = {
  path: emptyStringResult,
  segment: emptyStringResult,
  childRouters: fw.observableArray(),
  context: noop,
  userInitialize: noop,
  __isRouter: true
};

var $nullRouter = extend({}, $baseRouter, {
  childRouters: extend( noop.bind(), { push: noop } ),
  path: function() { return ''; },
  isRelative: function() { return false; },
  __isNullRouter: true
});

var baseRoute = {
  controller: noop,
  indexedParams: [],
  namedParams: {},
  __isRoute: true
};

var baseRouteDescription = {
  filter: alwaysPassPredicate,
  __isRouteDesc: true
};
