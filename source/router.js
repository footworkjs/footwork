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
  namespace: '_router',
  baseRoute: null,
  unknownRoute: null,
  activate: true,
  routes: []
};

// Regular expressions used to parse a uri
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*\w*/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatch = /(^\/#)/;
var routesAreCaseSensitive = false;

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

function historyReady() {
  return _.has(History, 'Adapter');
}

function extractNavItems(routes) {
  routes = ( _.isArray(routes) ? routes : [routes] );
  return _.where(routes, { nav: true });
}

function hasNavItems(routes) {
  return extractNavItems( routes ).length > 0;
}

var Router = function( routerConfig, viewModel ) {
  this.$viewModel = viewModel;

  this.config = routerConfig = _.extend({}, routerDefaultConfig, routerConfig);
  this.config.baseRoute = _.result(routerConfig, 'baseRoute');

  this.$namespace = makeNamespace( routerConfig.namespace );
  this.$namespace.enter();

  this.historyIsEnabled = ko.observable(false).broadcastAs('historyIsEnabled');
  this.currentState = ko.observable().broadcastAs('currentState');
  this.navModelUpdate = ko.observable();
  this.outlets = {};

  this.currentState.subscribe(function(state) {
    console.log('currentState', state);
  });

  this.setRoutes( routerConfig.routes );

  if(routerConfig.activate === true) {
    this.activate();
  }

  this.$namespace.exit();
};

Router.prototype.unknownRoute = function() {
  return (typeof this.config !== 'undefined' ? _.result(this.config.unknownRoute) : undefined);
};

Router.prototype.setRoutes = function(route) {
  this.addRoutes(route);
  return this;
};

Router.prototype.addRoutes = function(route) {
  route = _.isArray(route) ? route : [route];
  this.config.routes.concat(route);

  if( hasNavItems(route) && isObservable(this.navigationModel) ) {
    this.navModelUpdate.notifySubscribers(); // tell this.navigationModel to recompute its list
  }

  return this;
};

Router.prototype.activate = function() {
  return this
    .setupHistoryAdapter()
    .stateChange();
};

Router.prototype.setupHistoryAdapter = function() {
  if(this.historyIsEnabled() !== true) {
    if( historyReady() === true ) {
      History.Adapter.bind( window, 'statechange', this.stateChange);
      this.historyIsEnabled(true);
    } else {
      this.historyIsEnabled(false);
    }
  }

  return this;
};

Router.prototype.stateChange = function(url) {
  this.currentState( url = this.normalizeURL( url || (this.historyIsEnabled() === true ? History.getState().url : '#default') ) );

  var $outlet = _.bind( function(outletName, componentToDisplay, viewModelParameters ) {
    outletName = ko.unwrap( outletName );

    /* do stuff here */
  }, this );

  // get the route if it exists and run the action if one is returned
  this.getActionFor(url)( this.$viewModel, $outlet );
  // this.getActionFor(url)();

  return this;
};

Router.prototype.normalizeURL = function(url) {
  if( _.isNull(this.config.baseRoute) === false && url.indexOf(this.config.baseRoute) === 0 ) {
    url = url.substr(this.config.baseRoute.length);
    if(url.length > 1) {
      url = url.replace(hashMatch, '/');
    }
  }
  return url;
};

Router.prototype.getActionFor = function(url) {
  var Action = noop;
  var originalURL = url;

  _.each(this.getRoutes(), function(routeDesc) {
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
      
      Action = function($viewModel, $outlet, params) {
        options.controller( $viewModel, $outlet, _.extend(options.params, params), options );
      };
      Action.options = options;
    }
  });

  if(ko.debugLevel() >= 2 && Action === noop) {
    throw 'Could not locate associated action for ' + originalURL;
  }

  return Action;
};

Router.prototype.getRoutes = function() {
  return this.config.routes;
};

Router.prototype.navigationModel = function(predicate) {
  if(typeof this.navigationModel === 'undefined') {
    this.navigationModel = ko.computed(function() {
      this.navModelUpdate(); // dummy reference used to trigger updates
      return _.filter(
        extractNavItems(routes),
        (predicate || function() { return true; })
      );
    }, { navModelUpdate: this.navModelUpdate }).broadcastAs({ name: 'navigationModel', namespace: this.$namespace });
  }

  return this.navigationModel;
};