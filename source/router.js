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
    _.map(config.routes, function(route) {
      router.add(route);
    });
  }

  return router.activate();
};

router.config = {};
router.namespace = ko.namespace('router');

router.add = function(route) {
  routes.push(route);

  if( _(route).has('nav') && route.nav === true && _(navigationModel).has('valueHasMutated') ) {
    navigationModel.push(route);
  }
  console.log('router.add', route);
};

router.navigationModel = function() {
  if(typeof navigationModel === 'undefined') {
    navigationModel = ko.observableArray( _(routes).where({ nav: true }) );
  }
  return navigationModel;
};

router.stateChanged = function(url) {
  url = url || History.getState().url;
  this.namespace.publish('stateChanged', url);
  var route = this.getRouteFor(url);
};

router.getRouteFor = function(url) {
  var route = router.config.route404;
  _.each(routes, function(route) {
    console.log(route);
  });
};

router.activate = _.once( _.bind(function() {
  console.log('router.activate');
  delegate(document).on('click', 'a', function(event) {
    console.info('delegateClick-event', event.delegateTarget);
  });

  History.Adapter.bind( window, 'statechange', router.stateChanged);
  router.stateChanged();
  return router;
}, router) );