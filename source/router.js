// router.js
// ------------------

/**
 * Example route:
 * {
 *   routes: [{
 *     route: 'test/route(/:optional)',
 *     title: function() {
 *       return ko.request('nameSpace', 'broadcast:someVariable');
 *     },
 *     nav: true
 *   }]
 * }
 */

// Initialize necessary cache and boolean registers
var routes = [];
var navigationModel;
var historyIsEnabled;

// Declare regular expressions used to parse a uri
// Sourced: https://github.com/BlueSpire/Durandal/blob/e88fd385fb930d38456e35812b44ecd6ea7d8f4c/platforms/Bower/Durandal/js/plugins/router.js
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var routesAreCaseSensitive = false;

// Convert a route string to a regular expression which is then used to match a uri against it and determine whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp(routeString) {
  routeString = routeString.replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function(match, optional) {
      return optional ? match : '([^\/]+)';
    })
    .replace(splatParam, '(.*?)');

  return new RegExp('^' + routeString + '$', routesAreCaseSensitive ? undefined : 'i');
}

function historyReady() {
  var isReady = _.has(History, 'Adapter');
  isReady === false && log('History.js is not loaded.');

  return isReady;
}

function extractNavItems(routes) {
  routes = ( _.isArray(routes) ? routes : [routes] );
  return _.where(routes, { nav: true });
}

function hasNavItems(routes) {
  return extractNavItems( routes ).length > 0;
}

function isObservable(thing) {
  return typeof thing !== 'undefined' && _.isFunction(thing.notifySubscribers);
}

function unknownRoute() {
  return (typeof router.config !== 'undefined' ? _.result(router.config.route404) : undefined);
}

var router = ko.router = function(config) {
  var router = this.router;

  router.config = config = _.extend({
    activate: true,
    routes: []
  }, router.config, config);
  router.setRoutes();

  return (config.activate ? router.activate() : router);
};

router.config = {};
router.namespace = ko.namespace('router');

router.setRoutes = function(route) {
  routes = [];
  router.addRoutes(route || this.config.routes);

  return router;
};

router.addRoutes = function(route) {
  route = _.isArray(route) ? route : [route];
  routes.push.apply(routes, route);

  if( hasNavItems(route) && isObservable(navigationModel) ) {
    navModelUpdate.notifySubscribers(); // trigger router.navigationModel to recompute its list
  }

  return router;
};

var navModelUpdate = ko.observable();
var navPredicate;
router.navigationModel = function(predicate) {
  navPredicate = predicate || navPredicate || function() { return true; };

  if(typeof navigationModel === 'undefined') {
    navigationModel = ko.computed(function() {
      this.navModelUpdate(); // dummy reference used to trigger updates
      return _.filter( extractNavItems( routes ), navPredicate );
    }, { navModelUpdate: navModelUpdate });
  }

  return navigationModel;
};

router.stateChanged = function(url) {
  url = url || (historyIsEnabled ? History.getState().url : '#default');
  this.namespace.publish('stateChanged', url);
  var route = this.getRouteFor(url);

  return router;
};

router.getRouteFor = function(url) {
  _.each(router.getRoutes(), function(route) {
    console.log(route);
  });
};

router.getRoutes = function() {
  return routes;
};

router.setupHistoryAdapter = function() {
  if(historyIsEnabled !== true) {
    historyIsEnabled = false;
    if( historyReady() ) {
      History.Adapter.bind( window, 'statechange', router.stateChanged);
      historyIsEnabled = true;
    }
  }

  return historyIsEnabled;
}

router.historyIsEnabled = function() {
  return historyIsEnabled;
};

router.activate = _.once( _.bind(function() {
  router.setupHistoryAdapter();

  delegate(document)
    .on('click', 'a', function(event) {
      console.info('delegateClick-event', event.delegateTarget);
    });
  delegate(document)
    .on('click', '.footwork-link-target', function(event) {
      console.info('delegateClick-event', event.delegateTarget);
    });

  return router.stateChanged();
}, router) );