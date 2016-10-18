var fw = require('../../../../bower_components/knockoutjs/dist/knockout');
var _ = require('lodash');

var resultBound = require('../../../misc/util').resultBound;
var clearSequenceQueue = require('../../../component/sequencing').clearSequenceQueue;

var routerDefaults = require('../router-defaults');
var noComponentSelected = routerDefaults.noComponentSelected;
var nullComponent = routerDefaults.nullComponent;
var defaultLoadingComponent = routerDefaults.defaultLoadingComponent;
var activeOutlets = routerDefaults.activeOutlets;

module.exports = function routerOutlet(outletName, componentToDisplay, options) {
  options = options || {};
  if (_.isFunction(options)) {
    options = { onComplete: options, onFailure: _.noop };
  }

  var router = this;
  var viewModelParameters = options.params;
  var onComplete = options.onComplete || _.noop;
  var onFailure = options.onFailure || _.noop;
  var configParams = router.__private('configParams');
  var outlets = router.outlets;
  var outletProperties = outlets[outletName] || {};
  var outlet = outletProperties.routeObservable;
  var outletViewModel = outletProperties.outletViewModel;

  if (!fw.isObservable(outlet)) {
    // router outlet observable not found, we must create a new one
    outlet = fw.observable({
      name: noComponentSelected,
      params: {},
      getOnCompleteCallback: function() { return _.noop; },
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

    if (showDuringLoadComponent === true || (!showDuringLoadComponent &&  resultBound(fw.router, 'showDefaultLoader', router, [outletName, componentToDisplay || currentOutletDef.name]))) {
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
      outletViewModel.inFlightChildren([]);
      outletViewModel.routeIsLoading(true);
    }

    currentOutletDef.getOnCompleteCallback = function(element) {
      var outletElement = element.parentNode;

      activeOutlets.remove(outlet);
      outletElement.setAttribute('rendered', (componentToDisplay === nullComponent ? '' : componentToDisplay));

      return function addBindingOnComplete() {
        var outletViewModel = router.outlets[outletName].outletViewModel;
        if (outletViewModel) {
          outletViewModel.routeIsLoading(false);
          outletViewModel.routeOnComplete = function() {
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
};
