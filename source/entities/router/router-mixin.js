var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;

var routerTools = require('./router-tools');
var isNullRouter = routerTools.isNullRouter;
var transformRouteConfigToDesc = routerTools.transformRouteConfigToDesc;
var nearestParentRouter = routerTools.nearestParentRouter;

var isEntity = require('../entity-tools').isEntity;

var util = require('../../misc/util');
var resultBound = util.resultBound;
var propertyDispose = util.propertyDispose;

var viewModelMixinDispose = require('../viewModel/viewModel-mixin').dispose;

module.exports = {
  setRoutes: function (routeDesc) {
    this[privateDataSymbol].routeDescriptions = [];
    this.addRoutes(routeDesc);
    return this;
  },
  addRoutes: function (routeConfig) {
    this[privateDataSymbol].routeDescriptions = this[privateDataSymbol].routeDescriptions.concat(_.map(_.isArray(routeConfig) ? routeConfig : [routeConfig], transformRouteConfigToDesc));
    return this;
  },
  activate: function ($context, $parentRouter) {
    var self = this;
    $context = $context || self[privateDataSymbol].context();
    $parentRouter = $parentRouter || nearestParentRouter($context);

    if (!isNullRouter($parentRouter)) {
      self[privateDataSymbol].parentRouter($parentRouter);
    } else if (_.isObject($context)) {
      $parentRouter = nearestParentRouter($context);
      if ($parentRouter !== self) {
        self[privateDataSymbol].parentRouter($parentRouter);
      }
    }

    if (!self[privateDataSymbol].historyPopstateListener()) {
      var popstateEvent = function () {
        var location = window.history.location || window.location;
        self.currentState(normalizeURL(self, location.pathname + location.hash));
      };

      (function (eventInfo) {
        window[eventInfo[0]](eventInfo[1] + 'popstate', popstateEvent, false);
      })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);

      self[privateDataSymbol].historyPopstateListener(popstateEvent);
    }

    if (self.currentState() === '') {
      self.setState();
    }

    self.$namespace.trigger('activated', { context: $context, parentRouter: $parentRouter });
    return self;
  },
  setState: function (url, routeParams) {
    var self = this;
    var namedRoute = _.isObject(routeParams) ? url : null;
    var configParams = self[privateDataSymbol].configParams;
    var useHistory = self[privateDataSymbol].historyPopstateListener() && !fw.router.disableHistory();
    var location = window.history.location || window.location;

    if (!_.isNull(namedRoute)) {
      // must convert namedRoute into its URL form
      var routeDescription = _.find(self[privateDataSymbol].routeDescriptions, function (route) {
        return route.name === namedRoute;
      });

      if (!_.isUndefined(routeDescription)) {
        url = _.first([].concat(routeDescription.route));
        _.each(routeParams, function (value, fieldName) {
          url = url.replace(':' + fieldName, routeParams[fieldName]);
        });
      } else {
        throw new Error('Could not locate named route: ' + namedRoute);
      }
    }

    if (!_.isString(url)) {
      url = useHistory ? location.pathname : '/';
    }

    var isExternalURL = fw.utils.isFullURL(url);
    if (!isExternalURL) {
      url = normalizeURL(self, url);
    }

    var shouldContinueToRoute = resultBound(configParams, 'beforeRoute', self, [url || '/']);
    if (shouldContinueToRoute && !isExternalURL) {
      if (useHistory) {
        var destination = configParams.baseRoute + self[privateDataSymbol].parentRouter()[privateDataSymbol].path() + url.replace(startingHashRegex, '/');
        history.pushState(null, '', destination);
      }
      self.currentState(url);

      var routePath = self[privateDataSymbol].path();
      _.each(self[privateDataSymbol].childRouters(), function (childRouter) {
        childRouter.currentState(routePath);
      });
    }

    return self;
  },
  dispose: function () {
    if (!this[privateDataSymbol].isDisposed) {
      // first run all of the standard viewModel disposal logic
      viewModelMixinDispose.call(this);

      var $parentRouter = this[privateDataSymbol].parentRouter();
      if (!isNullRouter($parentRouter)) {
        $parentRouter[privateDataSymbol].childRouters.remove(this);
      }

      var historyPopstateListener = this[privateDataSymbol].historyPopstateListener();
      if (historyPopstateListener) {
        (function (eventInfo) {
          window[eventInfo[0]](eventInfo[1] + 'popstate', historyPopstateListener);
        })(window.removeEventListener ? ['removeEventListener', ''] : ['detachEvent', 'on']);
      }

      _.each(this[privateDataSymbol], propertyDispose);

      return this;
    }
  }
};


