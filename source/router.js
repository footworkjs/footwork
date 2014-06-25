// router.js
// ------------------

/**
 * Example route:
 * {
 *   route: 'test/route(/:optional)',
 *   title: function() {
 *     return ko.request('nameSpace', 'broadcast:someVariable');
 *   },
 *   nav: true
 * }
 */

var routerDefaultConfig = {
  baseRoute: null,
  unknownRoute: null,
  activate: true,
  routes: []
};

// Create the main router method. This can be used to both activate the router and setup routes.
var router = ko.router = function(config) {
  var router = this.router;

  router.config = config = _.extend({}, routerDefaultConfig, router.config, config);
  router.config.baseRoute = _.result(router.config, 'baseRoute');

  return (config.activate ? router.setRoutes().activate() : router.setRoutes());
};

router.config = _.clone(routerDefaultConfig);
router.namespace = ko.enterNamespaceName('router');

// Initialize necessary cache and boolean registers
var routes = [];
var navigationModel;
var historyIsEnabled = ko.observable().broadcastAs('historyIsEnabled');

// Declare regular expressions used to parse a uri
// Sourced: https://github.com/BlueSpire/Durandal/blob/e88fd385fb930d38456e35812b44ecd6ea7d8f4c/platforms/Bower/Durandal/js/plugins/router.js
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var routesAreCaseSensitive = false;
var hashMatch = /(^\/#)*(^#)*/;

// Convert a route string to a regular expression which is then used to match a uri against it and determine whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp(routeString) {
  routeString = routeString.replace(escapeRegExp, "\\$&")
    .replace(optionalParam, "(?:$1)?")
    .replace(namedParam, function(match, optional) {
      return optional ? match : "([^\/]+)";
    })
    .replace(splatParam, "(.*?)");

  return new RegExp('^' + routeString + '$', routesAreCaseSensitive ? undefined : 'i');
}

function normalizeURL(url) {
  if(_.isNull(router.config.baseRoute) === false && url.indexOf(router.config.baseRoute) === 0) {
    url = url.substr(router.config.baseRoute.length);
    if(url.length > 1) {
      url = url.replace(hashMatch, '/');
    }
  }
  return url;
}

function historyReady() {
  var isReady = _.has(History, 'Adapter');
  isReady === false && ko.logError('History.js is not loaded.');

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
  return (typeof router.config !== 'undefined' ? _.result(router.config.unknownRoute) : undefined);
}

router.setRoutes = function(route) {
  routes = [];
  router.addRoutes(route || this.config.routes);

  return router;
};

router.addRoutes = function(route) {
  route = _.isArray(route) ? route : [route];
  routes.push.apply(routes, route);

  if( hasNavItems(route) && isObservable(navigationModel) ) {
    navModelUpdate.notifySubscribers(); // tell router.navigationModel to recompute its list
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

  return navigationModel.broadcastAs({ name: 'navigationModel', namespace: router.namespace });
};

var currentState = ko.observable().broadcastAs('currentState');
router.stateChange = function(url) {
  currentState( url = normalizeURL( url || (historyIsEnabled() ? History.getState().url : '#default') ) );
  getActionFor(url)(); // get the route if it exists and run the action if one is returned

  return router;
};
currentState.subscribe(function(newState) {
  ko.log('New Route:', newState);
});

var getActionFor = router.getActionFor = function(url) {
  var Action = noop;
  var originalURL = url;

  _.each(router.getRoutes(), function(routeDesc) {
    var routeString = routeDesc.route;
    var routeRegex = routeStringToRegExp(routeString);
    var routeParamValues = url.match(routeRegex);

    if(routeParamValues !== null && Action === noop) {
      var routeParams = _.map(routeString.match(namedParam), function(param) {
        return param.replace(':', '');
      });

      var options = {
        controller: routeDesc.controller,
        title: routeDesc.title,
        url: routeParamValues[0],
        params: _.reduce(routeParams, function(parameters, parameterName, index) {
            parameters[parameterName] = routeParamValues[index + 1];
            return parameters;
          }, {})
      };
      
      Action = function(params) {
        options.controller( _.extend(options.params, params), options );
      };
      Action.options = options;
    }
  });

  if(Action === noop) {
    ko.logError('Could not locate associated action for ', originalURL);
  }

  return Action;
};

router.getRoutes = function() {
  return routes;
};

router.setupHistoryAdapter = function() {
  if(historyIsEnabled() !== true) {
    if( historyReady() ) {
      History.Adapter.bind( window, 'statechange', router.stateChange);
      historyIsEnabled(true);
    } else {
      historyIsEnabled(false);
    }
  }

  return router;
}

router.historyIsEnabled = function() {
  return historyIsEnabled();
};

router.activate = _.once( _.bind(function() {
  delegate(document)
    .on('click', 'a', function(event) {
      console.info('delegateClick-event', event.delegateTarget);
    });
  delegate(document)
    .on('click', '.footwork-link-target', function(event) {
      console.info('delegateClick-event', event.delegateTarget);
    });

  return router.setupHistoryAdapter().stateChange();
}, router) );

router.namespace = ko.exitNamespace(); // exit from 'router' namespace