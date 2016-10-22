var fw = require('knockout');
var _ = require('lodash');

var privateDataSymbol = require('../misc/config').privateDataSymbol;
var nearestEntity = require('../entities/entity-tools').nearestEntity;
var entityDescriptors = require('../entities/entity-descriptors');
var originalComponentInit = fw.bindingHandlers.component.init;

/**
 * Monkey patch to bootstrap a component, tagging it with the loadingTracker.
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
  var loadingTracker = element.loadingTracker = {
    tagName: tagName,
    moduleName: element.getAttribute('module') || element.getAttribute('data-module')
  };

  if (element.nodeType !== 8) {
    var closestEntity = nearestEntity(bindingContext);
    if (closestEntity) {
      var loadingChildren = closestEntity[privateDataSymbol].loadingChildren;
      if (fw.isObservable(loadingChildren) && _.isFunction(loadingChildren.push)) {
        loadingChildren.push(loadingTracker);
      }

      // ensure that if the element is removed before its other resources are resolved that the loadingTracker is removed/cleared
      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        loadingChildren.remove(loadingTracker);
      });
    }
  }

  if (entityDescriptors.tagNameIsPresent(tagName)) {
    require('./loading-tracker').set(loadingTracker);
  }

  return originalComponentInit(element, valueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = componentInit;
