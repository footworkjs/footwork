// framework/entities/router/outlet.js
// ------------------

var noParentViewModelError = { $namespace: { getName: function() { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };

// This custom binding binds the outlet element to the $outlet on the router, changes on its 'route' (component definition observable) will be applied
// to the UI and load in various views
fw.virtualElements.allowedBindings.$outletBinder = true;
fw.bindingHandlers.$outletBinder = {
  init: function(element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var $parentViewModel = (isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var $parentRouter = nearestParentRouter(bindingContext);
    var outletName = outletViewModel.outletName;

    if(isRouter($parentRouter)) {
      // register the viewModel with the outlet for future use when its route is changed
      $parentRouter.__private('registerViewModelForOutlet')(outletName, outletViewModel);
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        // tell the router to clean up its reference to the outletViewModel
        $parentRouter.__private('unregisterViewModelForOutlet')(outletName);
      });

      // register this outlet with its $parentRouter
      outletViewModel.route = $parentRouter.outlet(outletName);
    } else {
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + $parentViewModel.$namespace.getName() + '] but no router was defined.');
    }
  }
};

function registerViewModelForOutlet(outletName, outletViewModel) {
  var outletProperties = this.outlets[outletName] || {};
  outletProperties.outletViewModel = outletViewModel;
}

function unregisterViewModelForOutlet(outletName) {
  var outletProperties = this.outlets[outletName] || {};
  delete outletProperties.outletViewModel;
}

function routerOutlet(outletName, componentToDisplay, options) {
  options = options || {};
  if(isFunction(options)) {
    options = { onComplete: options, onFailure: noop };
  }

  var router = this;
  var changeWasCompleted = false;
  var viewModelParameters = options.params;
  var onComplete = options.onComplete || noop;
  var onFailure = options.onFailure || noop;
  var configParams = router.__private('configParams');
  var outlets = router.outlets;
  var outletProperties = outlets[outletName] || {};
  var outlet = outletProperties.routeObservable;
  var outletViewModel = outletProperties.outletViewModel;

  outletName = fw.unwrap(outletName);
  if(!isObservable(outlet)) {
    // router outlet observable not found, we must create a new one
    outlet = fw.observable({
      name: noComponentSelected,
      params: {},
      __getOnCompleteCallback: function() { return noop; },
      __onFailure: onFailure.bind(router)
    }).broadcastAs({
      name: outletName,
      namespace: router.$namespace
    });

    // register the new outlet under its outletName
    outlets[outletName] = {
      outletViewModel: outletProperties.outletViewModel || null,
      routeObservable: outlet
    };
  }

  var currentOutletDef = outlet();
  var valueHasMutated = false;
  var isInitialLoad = outlet().name === noComponentSelected;

  if(arguments.length > 1 && !componentToDisplay) {
    componentToDisplay = nullComponent;
  }

  if(!isUndefined(componentToDisplay)) {
    if(currentOutletDef.name !== componentToDisplay) {
      currentOutletDef.name = componentToDisplay;
      valueHasMutated = true;
    }

    if(isObject(viewModelParameters)) {
      currentOutletDef.params = viewModelParameters;
      valueHasMutated = true;
    }
  }

  if(outletViewModel) {
    // Show the loading component (if one is defined)
    var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay || outlet().name]);
    if(showDuringLoadComponent) {
      outletViewModel.loadingDisplay(showDuringLoadComponent);
    }
    outletViewModel.routeIsLoading(true);
  }

  if(valueHasMutated) {
    var minTransitionPeriod = resultBound(configParams, 'minTransitionPeriod', router, [outletName, componentToDisplay]);

    currentOutletDef.__getOnCompleteCallback = function(element) {
      var changeIsComplete = element.children.length;
      var outletElement = element.parentNode;

      if(!changeWasCompleted && changeIsComplete) {
        changeWasCompleted = true;
        activeOutlets.remove(outlet);
        outletElement.setAttribute('rendered', componentToDisplay);

        return function addBindingOnComplete() {
          setTimeout(function() {
            addClass(outletElement, entityAnimateClass);
          }, minimumAnimationDelay);

          var outletViewModel = router.outlets[outletName].outletViewModel;
          if(outletViewModel) {
            outletViewModel.routeIsLoading(false);
          }

          onComplete.call(router, outletElement);
        };
      } else {
        removeClass(outletElement, entityAnimateClass);
        return noop;
      }
    };

    if(activeOutlets().indexOf(outlet) === -1) {
      activeOutlets.push(outlet);
    }

    if(outletViewModel) {
      // Tell the outletViewModel to display the temporary loading component for a period of time
      clearTimeout(outletProperties.transitionTimeout);
      outletViewModel.isTransitioning(true);
      outletProperties.transitionTimeout = setTimeout(function() {
        outletViewModel.isTransitioning(false);
      }, minTransitionPeriod);
    }

    outlet.valueHasMutated();
  }

  return outlet;
};

var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };
var outletLoadingDisplay = 'fw-loading-display';
var outletLoadedDisplay = 'fw-loaded-display';
function registerOutletComponent() {
  internalComponents.push('outlet');
  fw.components.register('outlet', {
    viewModel: function(params) {
      this.loadingDisplay = fw.observable(nullComponent);
      this.inFlightChildren = fw.observableArray();
      this.routeIsLoading = fw.observable(true);
      this.isTransitioning = fw.observable(false);
      this.isLoading = fw.computed(function() {
        return this.inFlightChildren().length > 0 || this.isTransitioning() || this.routeIsLoading();
      }, this);

      this.loadingStyle = fw.computed(function() {
        if(this.isLoading()) {
          return visibleCSS;
        }
        return hiddenCSS;
      }, this);

      this.contentsStyle = fw.computed(function() {
        if(this.isLoading()) {
          return hiddenCSS;
        }
        return visibleCSS;
      }, this);

      this.isLoadingClass = fw.computed(function() {
        var classState = {};
        classState[entityAnimateClass] = this.isLoading();
        return classState;
      }, this);

      this.isLoadedClass = fw.computed(function() {
        var classState = {};
        classState[entityAnimateClass] = !this.isLoading();
        return classState;
      }, this);

      this.outletName = fw.unwrap(params.name);
      this.__isOutlet = true;
    },
    template: '<!-- ko $outletBinder -->' +
                '<div class="' + outletLoadingDisplay + ' ' + entityClass + '" data-bind="style: loadingStyle, css: isLoadingClass">' +
                  '<!-- ko component: loadingDisplay --><!-- /ko -->' +
                '</div>' +
                '<div class="' + outletLoadedDisplay + ' ' + entityClass + '" data-bind="style: contentsStyle, css: isLoadedClass">' +
                  '<!-- ko component: route --><!-- /ko -->' +
                '</div>' +
              '<!-- /ko -->'
  });

  internalComponents.push(noComponentSelected);
  fw.components.register(noComponentSelected, {
    template: '<div class="no-component-selected"></div>'
  });
  internalComponents.push(nullComponent);
  fw.components.register(nullComponent, {
    template: '<div class="null-component"></div>'
  });
};

runPostInit.push(registerOutletComponent);
