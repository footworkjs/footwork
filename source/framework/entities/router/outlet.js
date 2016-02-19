// framework/entities/router/outlet.js
// ------------------

var noParentViewModelError = { $namespace: { getName: function() { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };

// This custom binding binds the outlet element to the $outlet on the router, changes on its 'route' (component definition observable) will be applied
// to the UI and load in various views
fw.virtualElements.allowedBindings.$outletBinder = true;
fw.bindingHandlers.$outletBinder = {
  init: function(element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var parentRouter = nearestParentRouter(bindingContext);
    var outletName = outletViewModel.outletName;
    var $element = outletViewModel.$element = (element.parentElement || element.parentNode);

    $element.style.position = 'relative';

    if(isRouter(parentRouter)) {
      // register this outlet with the router so that updates will propagate correctly
      // take the observable returned and define it on the outletViewModel so that outlet route changes are reflected in the view
      outletViewModel.route = parentRouter.outlet(outletName, outletViewModel);

      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        // tell the router to clean up its reference to the outletViewModel
        parentRouter.outlet(outletName, outletViewModel, false);
      });
    } else {
      var parentViewModel = (isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + parentViewModel.$namespace.getName() + '] but no router was defined.');
    }
  }
};

function routerOutlet(outletName, componentToDisplayOrOutletViewModel, options) {
  if(arguments.length < 3) {
    options = {};
  }

  if(isFunction(options)) {
    options = { onComplete: options, onFailure: noop };
  }

  var outletViewModel = null;
  var componentToDisplay = nullComponent;
  if(isOutletViewModel(componentToDisplayOrOutletViewModel)) {
    outletViewModel = componentToDisplayOrOutletViewModel;

    if(options === false) {
      // caller indicating this is a cleanup request
      delete outlets[outletName];
      return true;
    }
  } else {
    componentToDisplay = componentToDisplayOrOutletViewModel;
  }

  var wasCompleted = false;
  var viewModelParameters = options.params;
  var onComplete = options.onComplete || noop;
  var onFailure = options.onFailure || noop;
  var router = this;
  var configParams = router.__private('configParams');
  var outlets = router.outlets;

  outletName = fw.unwrap(outletName);
  if(!isObservable(outlets[outletName])) {
    outlets[outletName] = fw.observable({
      name: noComponentSelected,
      params: {},
      outletViewModel: outletViewModel,
      __getOnCompleteCallback: function() { return noop; },
      __onFailure: onFailure.bind(router)
    }).broadcastAs({ name: outletName, namespace: router.$namespace });
  }

  var outlet = outlets[outletName];
  var currentOutletDef = outlet();
  var valueHasMutated = false;
  var isInitialLoad = outlet().name === noComponentSelected;

  if(outletViewModel && !currentOutletDef.outletViewModel) {
    currentOutletDef.outletViewModel = outletViewModel;
  }
  outletViewModel = currentOutletDef.outletViewModel || null;

  if(arguments.length > 1 && !componentToDisplay) {
    componentToDisplay = nullComponent;
  }

  if(!isUndefined(componentToDisplay) && !isOutletViewModel(componentToDisplayOrOutletViewModel)) {
    if(currentOutletDef.name !== componentToDisplay) {
      currentOutletDef.name = componentToDisplay;
      valueHasMutated = true;
    }

    if(!isUndefined(viewModelParameters)) {
      currentOutletDef.params = viewModelParameters;
      valueHasMutated = true;
    }
  }

  if(outletViewModel) {
    var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay]);
    if(showDuringLoadComponent && outletViewModel.loadingDisplay() !== showDuringLoadComponent) {
      outletViewModel.loadingDisplay(showDuringLoadComponent);
    }
    outletViewModel.isChanging(true);
  }

  if(valueHasMutated) {
    var minTransitionPeriod = resultBound(configParams, 'minTransitionPeriod', router, [outletName, componentToDisplay]);

    currentOutletDef.__getOnCompleteCallback = function(element, outletViewModel) {
      var isComplete = element.children.length;
      var outletElement = element.parentNode;

      if(!wasCompleted && isComplete) {
        wasCompleted = true;
        activeOutlets.remove(outlet);
        outletElement.setAttribute('rendered', componentToDisplay);

        return function addBindingOnComplete() {
          onComplete.call(router, outletElement);
          if(outletViewModel) {
            outletViewModel.isChanging(false);
          }
        };
      } else {
        removeClass(outletElement, entityAnimateClass);
        return noop;
      }
    };

    if(activeOutlets().indexOf(outlet) === -1) {
      activeOutlets.push(outlet);
    }

    if(minTransitionPeriod < minimumAnimationDelay) {
      minTransitionPeriod = minimumAnimationDelay;
    }

    if(outletViewModel) {
      clearTimeout(outlet.transitionTimeout);
      outletViewModel.isTransitioning(true);
      outlet.transitionTimeout = setTimeout(function() {
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
      windowObject.outletViewModel = this;
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

      this.outletName = fw.unwrap(params.name);
      this.__isOutlet = true;
    },
    template: '<!-- ko $outletBinder -->' +
                '<div class="' + outletLoadingDisplay + '" data-bind="style: loadingStyle">' +
                  '<!-- ko component: loadingDisplay --><!-- /ko -->' +
                '</div>' +
                '<div class="' + outletLoadedDisplay + '" data-bind="style: contentsStyle">' +
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
