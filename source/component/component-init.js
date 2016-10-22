var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var privateDataSymbol = require('../misc/config').privateDataSymbol;
var nearestEntity = require('../entities/entity-tools').nearestEntity;
var entityDescriptors = require('../entities/entity-descriptors');
var originalComponentInit = fw.bindingHandlers.component.init;

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
function componentInit (element, valueAccessor, allBindings, viewModel, bindingContext) {
  var tagName = element.tagName;
  var flightTracker = element.flightTracker = {
    tagName: tagName,
    moduleName: element.getAttribute('module') || element.getAttribute('data-module')
  };

  if (element.nodeType !== 8) {
    var closestEntity = nearestEntity(bindingContext);
    if (closestEntity) {
      var inFlightChildren = closestEntity[privateDataSymbol].inFlightChildren;
      if (fw.isObservable(inFlightChildren) && _.isFunction(inFlightChildren.push)) {
        inFlightChildren.push(flightTracker);
      }

      // ensure that if the element is removed before its other resources are resolved that the flightTracker is removed/cleared
      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        inFlightChildren.remove(flightTracker);
      });
    }
  }

  if (entityDescriptors.tagNameIsPresent(tagName)) {
    require('./flight-tracker').set(flightTracker);
  }

  return originalComponentInit(element, valueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = componentInit;
