var _ = require('lodash');

var privateDataSymbol = require('../../misc/config').privateDataSymbol;

var routerTools = require('./router-tools');
var isNullRouter = routerTools.isNullRouter;
var transformRouteConfigToDesc = routerTools.transformRouteConfigToDesc;
var nearestParentRouter = routerTools.nearestParentRouter;
var normalizeURL = routerTools.normalizeURL;

var isEntity = require('../entity-tools').isEntity;

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

    var currentOutletDef = outlet();
    var valueHasMutated = false;

    if (arguments.length > 1 && !componentToDisplay) {
      componentToDisplay = nullComponent;
    }

    if (!_.isUndefined(componentToDisplay)) {
      if (currentOutletDef.name !== componentToDisplay) {
        currentOutletDef.name = componentToDisplay;
        valueHasMutated = true;
      }

      if (_.isObject(viewModelParameters)) {
        currentOutletDef.params = viewModelParameters;
        valueHasMutated = true;
      }
    }

    if (outletViewModel) {
      // Show the loading component (if one is defined)
      var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay || currentOutletDef.name]);
      if (showDuringLoadComponent === true) {
        showDuringLoadComponent = defaultLoadingComponent;
      }

      if (showDuringLoadComponent) {
        outletViewModel.loadingDisplay(showDuringLoadComponent);
      }
    }

    if (valueHasMutated) {
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

    if (!self.currentState()) {
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

    self[privateDataSymbol].setStateHasRun = true;

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
    }

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
        })(window.removeEventListener ? ['removeEventListener', ''] : ['detachEvent', 'on']);
      }

      _.each(this[privateDataSymbol], propertyDispose);

      return this;
    }
  }
};


