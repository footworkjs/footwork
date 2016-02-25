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
        outletViewModel.dispose();
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
  var viewModelParameters = options.params;
  var onComplete = options.onComplete || noop;
  var onFailure = options.onFailure || noop;
  var configParams = router.__private('configParams');
  var outlets = router.outlets;
  var outletProperties = outlets[outletName] || {};
  var outlet = outletProperties.routeObservable;
  var outletViewModel = outletProperties.outletViewModel;

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
    var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay || currentOutletDef.name]);
    if(showDuringLoadComponent) {
      outletViewModel.loadingDisplay(showDuringLoadComponent);
    }
  }

  if(valueHasMutated) {
    clearSequenceQueue();

    if(outletViewModel) {
      outletViewModel.minTransitionPeriod = resultBound(configParams, 'minTransitionPeriod', router, [outletName, componentToDisplay]);
      outletViewModel.routeIsLoading(true);
    }

    currentOutletDef.__getOnCompleteCallback = function(element) {
      var changeIsComplete = !!element.children.length;
      var outletElement = element.parentNode;

      if(changeIsComplete) {
        activeOutlets.remove(outlet);
        outletElement.setAttribute('rendered', (componentToDisplay === nullComponent ? '' : componentToDisplay));

        return function addBindingOnComplete() {
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

    outlet.valueHasMutated();
  }

  return outlet;
};

var outletLoadingDisplay = 'fw-loading-display';
var outletLoadedDisplay = 'fw-loaded-display';
var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };
var removeAnimation = {};
removeAnimation[entityAnimateClass] = false;
var addAnimation = {};
addAnimation[entityAnimateClass] = true;

function registerOutletComponent() {
  internalComponents.push('outlet');
  fw.components.register('outlet', {
    viewModel: function(params) {
      var outlet = this;

      this.outletName = fw.unwrap(params.name);
      this.__isOutlet = true;

      this.loadingDisplay = fw.observable(nullComponent);
      this.inFlightChildren = fw.observableArray();
      this.routeIsLoading = fw.observable(true);
      this.routeIsResolving = fw.observable(true);

      var resolvedCallbacks = [];
      this.addResolvedCallbackOrExecute = function(callback) {
        if(outlet.routeIsResolving()) {
          resolvedCallbacks.push(callback);
        } else {
          callback();
        }
      };

      this.routeIsLoadingSub = this.routeIsLoading.subscribe(function(routeIsLoading) {
        if(routeIsLoading) {
          outlet.routeIsResolving(true);
        } else {
          if(this.flightWatch && isFunction(this.flightWatch.dispose)) {
            this.flightWatch.dispose();
          }

          // must call setTimeout to allow binding to begin on any subcomponents/etc
          setTimeout(function() {
            if(outlet.inFlightChildren().length) {
              outlet.flightWatch = outlet.inFlightChildren.subscribe(function(inFlightChildren) {
                if(!inFlightChildren.length) {
                  outlet.routeIsResolving(false);
                }
              });
            } else {
              outlet.routeIsResolving(false);
            }
          }, 0);
        }
      });

      this.loadingStyle = fw.observable();
      this.loadedStyle = fw.observable();
      this.loadingClass = fw.observable();
      this.loadedClass = fw.observable();

      function showLoader() {
        outlet.loadingClass(removeAnimation);
        outlet.loadedClass(removeAnimation);
        outlet.loadedStyle(hiddenCSS);
        outlet.loadingStyle(visibleCSS);
        setTimeout(function() {
          outlet.loadingClass(addAnimation);
        }, 0);
      }

      function showLoadedAfterMinimumTransition() {
        outlet.loadingClass(removeAnimation);
        outlet.loadedClass(removeAnimation);
        outlet.loadedStyle(visibleCSS);
        outlet.loadingStyle(hiddenCSS);
        setTimeout(function() {
          outlet.loadedClass(addAnimation);
          if(resolvedCallbacks.length) {
            setTimeout(function() {
              each(resolvedCallbacks, function(callback) {
                callback();
              });
              resolvedCallbacks = [];
            }, 0);
          }
        }, 0);
      }

      var transitionTriggerTimeout;
      function showLoaded() {
        clearTimeout(transitionTriggerTimeout);
        if(outlet.minTransitionPeriod) {
          transitionTriggerTimeout = setTimeout(showLoadedAfterMinimumTransition, outlet.minTransitionPeriod);
        } else {
          showLoadedAfterMinimumTransition();
        }
      }

      this.transitionTrigger = fw.computed(function() {
        var routeIsResolving = this.routeIsResolving();
        if(routeIsResolving) {
          showLoader();
        } else {
          showLoaded();
        }
      }, this);

      this.dispose = function() {
        each(outlet, function(outletProperty) {
          if(outletProperty && isFunction(outletProperty.dispose)) {
            outletProperty.dispose();
          }
        });
      };
    },
    template: '<!-- ko $outletBinder -->' +
                '<div class="' + outletLoadingDisplay + ' ' + entityClass + '" data-bind="style: loadingStyle, css: loadingClass">' +
                  '<!-- ko component: loadingDisplay --><!-- /ko -->' +
                '</div>' +
                '<div class="' + outletLoadedDisplay + ' ' + entityClass + '" data-bind="style: loadedStyle, css: loadedClass">' +
                  '<!-- ko component: route --><!-- /ko -->' +
                '</div>' +
              '<!-- /ko -->'
  });

  internalComponents.push(noComponentSelected);
  fw.components.register(noComponentSelected, {
    template: '<div class="no-component-selected"></div>'
  });
  fw.components.register(nullComponent, {
    template: '<div class="null-component"></div>'
  });
};

runPostInit.push(registerOutletComponent);
