var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;
var isEntity = require('../entity-tools').isEntity;

var routerTools = require('./router-tools');
var isNullRouter = routerTools.isNullRouter;
var transformRouteConfigToDesc = routerTools.transformRouteConfigToDesc;
var nearestParentRouter = routerTools.nearestParentRouter;
var normalizeURL = routerTools.normalizeURL;

var util = require('../../misc/util');
var resultBound = util.resultBound;
var propertyDispose = util.propertyDispose;
var startingHashRegex = util.startingHashRegex;

var viewModelMixinDispose = require('../viewModel/viewModel-mixin').dispose;
var clearSequenceQueue = require('../../binding/animation-sequencing').clearSequenceQueue;
var routerDefaults = require('./router-defaults');
var noComponentSelected = routerDefaults.noComponentSelected;
var nullComponent = routerDefaults.nullComponent;
var defaultLoadingComponent = routerDefaults.defaultLoadingComponent;
var activeOutlets = routerDefaults.activeOutlets;

function changeRoute(router, historyMethod, route, routeParams) {
  var namedRoute = _.isObject(routeParams) ? route : null;
  var configParams = router[privateDataSymbol].configParams;
  var useHistory = router[privateDataSymbol].activated && router[privateDataSymbol].historyPopstateListener() && !fw.router.disableHistory();
  var location = window.history.location || window.location;

  if (!_.isNull(namedRoute)) {
    // must convert namedRoute into its URL form
    var routeDescription = _.find(router[privateDataSymbol].routeDescriptions, function (route) {
      return route.name === namedRoute;
    });

    if (!_.isUndefined(routeDescription)) {
      route = _.first([].concat(routeDescription.route));
      _.each(routeParams, function (value, fieldName) {
        route = route.replace(':' + fieldName, routeParams[fieldName]);
      });
    } else {
      throw new Error('Could not locate named route: ' + namedRoute);
    }
  }

  route = route || location.pathname;

  var isExternalURL = fw.utils.isFullURL(route);
  if (!isExternalURL) {
    route = normalizeURL(router, route);
  }

  var shouldContinueToRoute = resultBound(configParams, 'beforeRoute', router, [route || '/']);
  if (shouldContinueToRoute && !isExternalURL) {
    if (useHistory) {
      var destination = configParams.baseRoute + router[privateDataSymbol].parentRouter()[privateDataSymbol].path() + route.replace(startingHashRegex, '/');
      var method = historyMethod + 'State';
      history[method](null, '', destination);
    }
    router.currentState(route);
  }

  return router;
}

module.exports = {
  outlet: function (outletName, componentToDisplay, options) {
    options = options || {};
    if (_.isFunction(options)) {
      options = { onComplete: options, onFailure: _.noop };
    }

    var router = this;
    var viewModelParameters = options.params;
    var onComplete = options.onComplete || _.noop;
    var onFailure = options.onFailure || _.noop;
    var configParams = router[privateDataSymbol].configParams;
    var outlets = router[privateDataSymbol].outlets;
    var outletProperties = outlets[outletName] || {};
    var outlet = outletProperties.routeObservable;
    var outletViewModel = outletProperties.outletViewModel;

    if (!fw.isObservable(outlet)) {
      // router outlet observable not found, we must create a new one
      outlet = fw.observable({
        name: noComponentSelected,
        params: {},
        getOnCompleteCallback: function () { return _.noop; },
        onFailure: onFailure.bind(router)
      });

      // register the new outlet under its outletName
      outlets[outletName] = {
        outletViewModel: outletProperties.outletViewModel || null,
        routeObservable: outlet
      };
    }

    if (arguments.length > 1 && !componentToDisplay) {
      componentToDisplay = nullComponent;
    }

    // grab and set the loadingDisplay if needed
    if (outletViewModel && (!outletViewModel[privateDataSymbol].outletIsSetup || componentToDisplay)) {
      outletViewModel[privateDataSymbol].outletIsSetup = true;

      // Show the loading component (if one is defined)
      var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay || outlet().name]);
      if (showDuringLoadComponent === true) {
        showDuringLoadComponent = defaultLoadingComponent;
      }

      if (showDuringLoadComponent) {
        outletViewModel.loadingDisplay(showDuringLoadComponent);
      }
    }

    var outletHasMutated = false;
    if (!_.isUndefined(componentToDisplay)) {
      var currentOutletDef = outlet();

      if (currentOutletDef.name !== componentToDisplay) {
        currentOutletDef.name = componentToDisplay;
        outletHasMutated = true;
      }
      if (_.isObject(viewModelParameters)) {
        currentOutletDef.params = viewModelParameters;
        outletHasMutated = true;
      }

      if (outletHasMutated) {
        clearSequenceQueue();

        currentOutletDef.minTransitionPeriod = resultBound(configParams, 'minTransitionPeriod', router, [outletName, componentToDisplay]);
        if (outletViewModel) {
          outletViewModel[privateDataSymbol].loadingChildren.removeAll();
          outletViewModel.routeIsLoading(true);
        }

        currentOutletDef.getOnCompleteCallback = function (element) {
          var outletElement = element.parentNode;

          activeOutlets.remove(outlet);
          outletElement.setAttribute('data-rendered', (componentToDisplay === nullComponent ? '' : componentToDisplay));

          return function addBindingOnComplete () {
            var outletViewModel = outlets[outletName].outletViewModel;
            if (outletViewModel) {
              outletViewModel.routeIsLoading(false);
              outletViewModel.routeOnComplete = function () {
                onComplete.call(router, outletElement);
              };
            } else {
              onComplete.call(router, outletElement);
            }
          };
        };

        if (activeOutlets().indexOf(outlet) === -1) {
          activeOutlets.push(outlet);
        }

        outlet.valueHasMutated();
      }
    }

    return outlet;
  },
  setRoutes: function (routeDesc) {
    this[privateDataSymbol].routeDescriptions = [];
    this.addRoutes(routeDesc);
    return this;
  },
  addRoutes: function (routeConfig) {
    this[privateDataSymbol].routeDescriptions = this[privateDataSymbol].routeDescriptions.concat(_.map(_.isArray(routeConfig) ? routeConfig : [routeConfig], transformRouteConfigToDesc));
    return this;
  },
  activate: function () {
    var self = this;

    if (!self[privateDataSymbol].historyPopstateListener()) {
      /* istanbul ignore next */
      var popstateEvent = function () {
        var location = window.history.location || window.location;
        self.currentState(normalizeURL(self, location.pathname + location.hash));
      };

      (function (eventInfo) {
        window[eventInfo[0]](eventInfo[1] + 'popstate', popstateEvent, false);
      })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);

      self[privateDataSymbol].historyPopstateListener(popstateEvent);
    }

    if (!self.currentState()) {
      self.pushRoute();
    }

    self[privateDataSymbol].activated = true;
    self.$namespace.trigger('activated');

    return self;
  },
  replaceRoute: function (route, routeParams) {
    changeRoute(this, 'replace', route, routeParams);
    return self;
  },
  pushRoute: function (route, routeParams) {
    changeRoute(this, 'push', route, routeParams);
    return self;
  },
  dispose: function () {
    if (!this[privateDataSymbol].isDisposed) {
      // first run all of the standard viewModel disposal logic
      viewModelMixinDispose.call(this);

      var historyPopstateListener = this[privateDataSymbol].historyPopstateListener();
      if (historyPopstateListener) {
        (function (eventInfo) {
          window[eventInfo[0]](eventInfo[1] + 'popstate', historyPopstateListener);
        })(window.removeEventListener ? ['removeEventListener', ''] : /* istanbul ignore next */ ['detachEvent', 'on']);
      }

      _.each(this[privateDataSymbol], propertyDispose);

      return this;
    }
  }
};


