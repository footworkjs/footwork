var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var nearestEntity = require('../entities/entity-tools').nearestEntity;
var isOutletViewModel = require('../entities/router/router-tools').isOutletViewModel;
var entityDescriptors = require('../entities/entity-descriptors');

var originalComponentInit = fw.bindingHandlers.component.init;
var componentRegistry = require('./component-registry');
var componentId = 0;

/**
 * Monkey patch to bootstrap a component, tagging it with the flightTracker.
 *
 * @param {any} element
 * @param {any} valueAccessor
 * @param {any} allBindings
 * @param {any} viewModel
 * @param {any} bindingContext
 * @returns
 */
function componentInit(element, valueAccessor, allBindings, viewModel, bindingContext) {
  var tagName = element.tagName;
  var flightTracker = componentId++;

  if (element.nodeType !== 8) {
    var nearestOutlet = nearestEntity(bindingContext, isOutletViewModel);
    if (nearestOutlet) {
      var outletsInFlightChildren = nearestOutlet.inFlightChildren;
      if (fw.isObservable(outletsInFlightChildren) && _.isFunction(outletsInFlightChildren.push)) {
        outletsInFlightChildren.push(flightTracker);
      }
    }
  }

  if (entityDescriptors.tagNameIsPresent(tagName)) {
    componentRegistry[flightTracker] = {
      moduleName: element.getAttribute('module') || element.getAttribute('data-module'),
      children: element.children
    };
  }

  element.flightTracker = flightTracker;
  return originalComponentInit(element, theValueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = componentInit;
