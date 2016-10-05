var fw = require('../../../../bower_components/knockoutjs/dist/knockout');
var _ = require('../../../misc/lodash');
var internalComponents = require('../../../component/internal-components');
var nextFrame = require('../../../misc/util').nextFrame;

var config = require('../../../misc/config');
var entityAnimateClass = config.entityAnimateClass;
var entityClass = config.entityClass;

var routerDefaults = require('../router-defaults');
var noComponentSelected = routerDefaults.noComponentSelected;
var nullComponent = routerDefaults.nullComponent;
var outletLoadingDisplay = routerDefaults.outletLoadingDisplay;
var outletLoadedDisplay = routerDefaults.outletLoadedDisplay;

var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };
var removeAnimation = {};
removeAnimation[entityAnimateClass] = false;
var addAnimation = {};
addAnimation[entityAnimateClass] = true;

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
        if(outlet.flightWatch && _.isFunction(outlet.flightWatch.dispose)) {
          outlet.flightWatch.dispose();
        }

        // must allow binding to begin on any subcomponents/etc
        nextFrame(function() {
          if(outlet.inFlightChildren().length) {
            outlet.flightWatch = outlet.inFlightChildren.subscribe(function(inFlightChildren) {
              if(!inFlightChildren.length) {
                outlet.routeIsResolving(false);
                _.isFunction(outlet.routeOnComplete) && outlet.routeOnComplete();
              }
            });
          } else {
            outlet.routeIsResolving(false);
            _.isFunction(outlet.routeOnComplete) && outlet.routeOnComplete();
          }
        });
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

      nextFrame(function() {
        outlet.loadingClass(addAnimation);
      });
    }

    function showLoadedAfterMinimumTransition() {
      outlet.loadingClass(removeAnimation);
      outlet.loadedStyle(visibleCSS);
      outlet.loadingStyle(hiddenCSS);
      outlet.loadedClass(addAnimation);

      if(resolvedCallbacks.length) {
        each(resolvedCallbacks, function(callback) {
          callback();
        });
        resolvedCallbacks = [];
      }
    }

    var transitionTriggerTimeout;
    function showLoaded() {
      clearTimeout(transitionTriggerTimeout);
      var minTransitionPeriod = outlet.route.peek().minTransitionPeriod;
      if(minTransitionPeriod) {
        transitionTriggerTimeout = setTimeout(showLoadedAfterMinimumTransition, minTransitionPeriod);
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
        if(outletProperty && _.isFunction(outletProperty.dispose)) {
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
