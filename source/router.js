// Sourced: https://github.com/BlueSpire/Durandal/blob/e88fd385fb930d38456e35812b44ecd6ea7d8f4c/platforms/Bower/Durandal/js/plugins/router.js
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var routesAreCaseSensitive = false;

function routeStringToRegExp(routeString) {
  routeString = routeString.replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function(match, optional) {
      return optional ? match : '([^\/]+)';
    })
    .replace(splatParam, '(.*?)');

  return new RegExp('^' + routeString + '$', routesAreCaseSensitive ? undefined : 'i');
}

/**
  {
    routes: [{
      route: 'test/route(/:optional)',
      title: function() {
        return ko.request('nameSpace', 'broadcast:someVariable');
      },
      nav: true
    }]
  }
 */
var routes = [];
var navigationModel;

var router = ko.router = function(config) {
  var router = this.router;

  router.config = config;

  if(_.isObject(config)) {
    router.add(config.routes);
  }

  return router.activate();
};

router.config = {};
router.namespace = ko.namespace('router');

function historyIsLoaded() {
  return _.has(History, 'Adapter');
}

function extractNavItems(routes) {
  routes = ( _.isArray(routes) ? routes : [routes] );
  return _.where(routes, { nav: true });
}

function hasNavItems(routes) {
  return extractNavItems( routes ).length > 0;
}

function isObservable(thing) {
  return _.has(thing, 'notifySubscribers');
}

function unknownRoute() {
  return (typeof router.config !== 'undefined' ? _.result(router.config.route404) : undefined);
}

router.add = function(route) {
  route = _.isArray(route) ? route : [route];
  routes.push.apply(routes, route);

  if( hasNavItems(route) && isObservable(navigationModel) ) {
    navModelUpdate.notifySubscribers(); // trigger router.navigationModel to recompute its list
  }
  console.log('router.add', route);

  return router;
};

var navModelUpdate = ko.observable();
router.navigationModel = function() {
  if(typeof navigationModel === 'undefined') {
    navigationModel = ko.computed(function() {
      this.navModelUpdate(); // dummy reference used to trigger updates
      return extractNavItems( routes );
    }, { routes: routes, navModelUpdate: navModelUpdate });
  }
  return navigationModel;
};

router.stateChanged = function(url) {
  url = url || History.getState().url;
  this.namespace.publish('stateChanged', url);
  var route = this.getRouteFor(url);

  return router;
};

router.getRouteFor = function(url) {
  _.each(routes, function(route) {
    console.log(route);
  });
};

router.activate = _.once( _.bind(function() {
  if( historyIsLoaded() ) {
    History.Adapter.bind( window, 'statechange', router.stateChanged);
  }

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