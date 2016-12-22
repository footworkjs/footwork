var _ = require('footwork-lodash');
var fw = require('knockout/build/output/knockout-latest');

var isEntity = require('../entity-tools').isEntity;
var changeRoute = require('./router-tools').changeRoute;

var util = require('../../misc/util');
var resultBound = util.resultBound;
var propertyDispose = util.propertyDispose;
var privateDataSymbol = util.getSymbol('footwork');

var viewModelMethodDispose = require('../viewModel/viewModel-methods').dispose;
var clearSequenceQueue = require('../../binding/animation-sequencing').clearSequenceQueue;
var routerConfig = require('./router-config');
var noComponentSelected = routerConfig.noComponentSelected;
var noComponentSelected = routerConfig.noComponentSelected;

var activeOutlets = fw.observableArray();

module.exports = {
  outlet: function (outletName, componentToDisplay, options) {
    options = options || {};
    if (_.isFunction(options)) {
      options = { onComplete: options };
    }

    var router = this;
    var viewModelParameters = options.params;
    var onComplete = options.onComplete || _.noop;
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
        getOnCompleteCallback: function () { return _.noop; }
      });

      // register the new outlet under its outletName
      outlets[outletName] = {
        outletViewModel: outletProperties.outletViewModel || null,
        routeObservable: outlet
      };
    }

    if (arguments.length > 1 && !componentToDisplay) {
      componentToDisplay = noComponentSelected;
    }

    // grab and set the loadingDisplay if needed
    if (outletViewModel && (!outletViewModel[privateDataSymbol].outletIsSetup || componentToDisplay)) {
      outletViewModel[privateDataSymbol].outletIsSetup = true;

      // Show the loading component (if one is defined)
      var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay || outlet().name]);
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

        currentOutletDef.transition = resultBound(configParams, 'transition', router, [outletName, componentToDisplay]);
        if (outletViewModel) {
          outletViewModel[privateDataSymbol].loadingChildren.removeAll();
          outletViewModel.routeIsLoading(true);
        }

        currentOutletDef.getOnCompleteCallback = function (element) {
          var outletElement = element.parentNode;

          activeOutlets.remove(outlet);
          outletElement.setAttribute('data-rendered', (componentToDisplay === noComponentSelected ? '' : componentToDisplay));

          return function addBindingOnComplete () {
            var outletViewModel = outlets[outletName].outletViewModel;
            outletViewModel.routeIsLoading(false);
            outletViewModel.routeOnComplete = function () {
              onComplete.call(router, outletElement);
              router[privateDataSymbol].scrollToFragment();
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
  replaceState: function (route, routeParams) {
    changeRoute(this, 'replace', route, routeParams);
    return self;
  },
  pushState: function (route, routeParams) {
    changeRoute(this, 'push', route, routeParams);
    return self;
  },
  dispose: function () {
    if (!this[privateDataSymbol].isDisposed) {
      // first run all of the standard viewModel disposal logic
      viewModelMethodDispose.call(this);

      // deactivate the router (unbinds the history event listener)
      this.$activated(false);

      // dispose of all privately stored properties
      _.each(this[privateDataSymbol], propertyDispose);

      return this;
    }
  }
};


