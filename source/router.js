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

var router = ko.router = function(options) {
  var router = this.router;

  if(_.isObject(options)) {
    _.map(options.routes, function(route) {
      router.add(route);
    });
  }

  return router;
};

router.add = function(route) {
  routes.push(route);
  if( _.has(navigationModel, 'valueHasMutated') ) {
    navigationModel.valueHasMutated();
  }
  console.log('router.add', route);
};

router.navigationModel = function() {
  if(typeof navigationModel === 'undefined') {
    navigationModel = ko.observableArray( routes );
  }
  return navigationModel;
};

router.activate = _.once( _.bind(function() {
  
}, router) );

// Note, URL parsing/parametrization code shamelessly 'borrowed' from Durandal (http://durandaljs.com/) - Thanks!
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