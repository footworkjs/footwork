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
      // register this outlet with the router so that updates will propagate correctly
      // take the observable returned and define it on the outletViewModel so that outlet route changes are reflected in the view
      outletViewModel.route = $parentRouter.outlet(outletName);
    } else {
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + $parentViewModel.$namespace.getName() + '] but no router was defined.');
    }
  }
};

function routerOutlet(outletName, componentToDisplay, options) {
  options = options || {};
  if(isFunction(options)) {
    options = { onComplete: options, onFailure: noop };
  }

  var wasCompleted = false;
  var viewModelParameters = options.params;
  var onComplete = options.onComplete || noop;
  var onFailure = options.onFailure || noop;
  var router = this;
  var outlets = router.outlets;

  outletName = fw.unwrap(outletName);
  if(!isObservable(outlets[outletName])) {
    outlets[outletName] = fw.observable({
      name: noComponentSelected,
      params: {},
      __getOnCompleteCallback: function() { return noop; },
      __onFailure: onFailure.bind(router)
    }).broadcastAs({ name: outletName, namespace: router.$namespace });
  }

  var outlet = outlets[outletName];
  var currentOutletDef = outlet();
  var valueHasMutated = false;
  var isInitialLoad = outlet().name === noComponentSelected;

  if(arguments.length > 1 && !componentToDisplay) {
    componentToDisplay = nullComponent;
  }

  if(!isUndefined(componentToDisplay)) {
    if((currentOutletDef.loadingFor || currentOutletDef.name) !== componentToDisplay) {
      currentOutletDef.name = componentToDisplay;
      valueHasMutated = true;
    }

    if(!isUndefined(viewModelParameters)) {
      currentOutletDef.params = viewModelParameters;
      valueHasMutated = true;
    }
  }

  if(valueHasMutated) {
    var configParams = router.__private('configParams');
    var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay]);
    var minTransitionPeriod = resultBound(configParams, 'minTransitionPeriod', router, [outletName, componentToDisplay]);

    var showDuringLoad = {
      name: showDuringLoadComponent,
      loadingFor: componentToDisplay,
      __getOnCompleteCallback: function(element) {
        element.setAttribute('rendered', '');

        if(element.children.length) {
          element.children[0].___isLoadingComponent = true;
        }

        removeClass(element, entityAnimateClass);
        return function addBindingOnComplete() {
          setTimeout(function() {
            addClass(element, entityAnimateClass);
          }, minimumAnimationDelay);
        };
      }
    };

    currentOutletDef.__getOnCompleteCallback = function(element) {
      var isComplete = element.children.length && isUndefined(element.children[0].___isLoadingComponent);

      if(!wasCompleted && isComplete) {
        wasCompleted = true;
        activeOutlets.remove(outlet);
        element.setAttribute('rendered', componentToDisplay);

        return function addBindingOnComplete() {
          setTimeout(function() {
            addClass(element, entityAnimateClass);
          }, minimumAnimationDelay);

          onComplete.call(router, element);
        };
      } else {
        removeClass(element, entityAnimateClass);
        return noop;
      }
    };

    if(activeOutlets().indexOf(outlet) === -1) {
      activeOutlets.push(outlet);
    }

    if(showDuringLoad.name) {
      clearTimeout(outlet.transitionTimeout);
      outlet(showDuringLoad);

      fw.components.get(currentOutletDef.name, function() {
        // now that its cached and loaded, lets show the desired component
        outlet.transitionTimeout = setTimeout(function() {
          outlet(currentOutletDef);
        }, minTransitionPeriod);
      });
    } else {
      outlet.valueHasMutated();
    }
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
      this.isChanging = fw.observable(true);
      this.isTransitioning = fw.observable(false);
      this.isLoading = fw.computed(function() {
        return this.inFlightChildren().length > 0 || this.isTransitioning() || this.isChanging();
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
    template: '<!-- ko $outletBinder, component: route --><!-- /ko -->'
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
