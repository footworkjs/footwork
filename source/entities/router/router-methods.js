var _ = require('footwork-lodash');
var fw = require('knockout/build/output/knockout-latest');

var isEntity = require('../entity-tools').isEntity;

var routerTools = require('./router-tools');
var getNamedRoute = routerTools.getNamedRoute;
var getMatchedRoute = routerTools.getMatchedRoute;

var util = require('../../misc/util');
var propertyDispose = util.propertyDispose;
var privateDataSymbol = util.getSymbol('footwork');
var resultBound = util.resultBound;

var viewModelMethodDispose = require('../viewModel/viewModel-methods').dispose;
var clearSequenceQueue = require('../../binding/animation-sequencing').clearSequenceQueue;
var noComponentSelected = require('./router-config').noComponentSelected;

var activeOutlets = fw.observableArray();

module.exports = {
  outlet: function (outletName, options) {
    if (!_.isObject(options)) {
      options = { display: arguments.length > 1 ? options || noComponentSelected : undefined };
    }

    var router = this;
    var outlets = router[privateDataSymbol].outlets;
    var outletProperties = outlets[outletName] || {};
    var outlet = outletProperties.routeObservable;
    var outletViewModel = outletProperties.outletViewModel;
    var routerOutletOptions = router[privateDataSymbol].configParams.outlet || {};

    if (!fw.isObservable(outlet)) {
      // router outlet observable not found, we must create a new one
      outlet = fw.observable({
        name: noComponentSelected,
        params: {},
        getOnCompleteCallback: function () { return _.noop; },
        loading: options.loading || routerOutletOptions.loading
      });

      // register the new outlet under its outletName
      outlets[outletName] = {
        outletViewModel: outletProperties.outletViewModel || null,
        routeObservable: outlet
      };
    }

    // grab and set the loading display if needed
    if (outletViewModel) {
      outletViewModel.loading(options.loading || resultBound(routerOutletOptions, 'loading', router, [outletName]) || outletViewModel.originalDisplay);
    }

    var outletHasMutated = false;
    if (!_.isUndefined(options.display)) {
      var currentOutletDef = outlet();

      if (currentOutletDef.name !== options.display) {
        currentOutletDef.name = options.display;
        outletHasMutated = true;
      }
      if (_.isObject(options.params)) {
        currentOutletDef.params = options.params;
        outletHasMutated = true;
      }

      if (outletHasMutated) {
        clearSequenceQueue();

        currentOutletDef.transition = options.transition || resultBound(routerOutletOptions, 'transition', router, [outletName]) || 0;
        if (outletViewModel) {
          outletViewModel[privateDataSymbol].loadingChildren.removeAll();
          outletViewModel.routeIsLoading(true);
        }

        currentOutletDef.getOnCompleteCallback = function (element) {
          var outletElement = element.parentNode;

          activeOutlets.remove(outlet);
          outletElement.setAttribute('data-rendered', currentOutletDef.name);

          return function addBindingOnComplete () {
            var outletViewModel = outlets[outletName].outletViewModel;
            outletViewModel.routeIsLoading(false);
            outletViewModel.routeOnComplete = function () {
              router[privateDataSymbol].scrollToFragment();
              [routerOutletOptions.onComplete, options.onComplete].forEach(function callOnCompleteFunctions (onComplete) {
                (onComplete || _.noop).call(router, outletElement);
              });
            };
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
  getRouteForState: function (currentState) {
    var route;

    if (_.isObject(currentState)) {
      route = getNamedRoute(this, currentState);
    } else {
      route = getMatchedRoute(this, currentState);
    }

    if (!route && (route = _.find(this.routes(), { unknown: true }))) {
      route = {
        controller: route.controller,
        title: route.title,
        url: _.isString(currentState) ? currentState : null
      };
    }

    return route;
  },
  replaceState: function (newState) {
    if (this.activated()) {
      this[privateDataSymbol].alterStateMethod = history.replaceState;
      this.currentState(newState);
    }

    return this;
  },
  pushState: function (newState) {
    if (this.activated()) {
      this[privateDataSymbol].alterStateMethod = history.pushState;
      this.currentState(newState);
    }

    return this;
  },
  dispose: function () {
    if (!this[privateDataSymbol].isDisposed) {
      // first run all of the standard viewModel disposal logic
      viewModelMethodDispose.call(this);

      // deactivate the router (unbinds the history event listener)
      this.activated(false);

      // dispose of all privately stored properties
      _.each(this[privateDataSymbol], propertyDispose);

      return this;
    }
  }
};


