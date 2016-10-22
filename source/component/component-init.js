var fw = require('knockout/build/output/knockout-latest');
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
  var loadingTracker = element[require('../misc/util').getSymbol('__loadingTracker')] = {
    tagName: tagName,
    moduleName: element.getAttribute('module') || /* istanbul ignore next */ element.getAttribute('data-module')
  };

  if (element.nodeType !== 8) {
    var closestEntity = nearestEntity(bindingContext);
    if (closestEntity) {
      closestEntity[privateDataSymbol].loadingChildren.push(loadingTracker);

      // ensure that if the element is removed before its other resources are resolved that the loadingTracker is removed/cleared
      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        closestEntity[privateDataSymbol].loadingChildren.remove(loadingTracker);
      });
    }
  }

  if (entityDescriptors.tagNameIsPresent(tagName)) {
    // save the tracker so that the (./loaders/entity-loader) loader can find out what module was requested (the element is not available to it so we save it here for reference later)
    require('./loading-tracker').set(loadingTracker);

    // ensure that the (./loaders/entity-loader) getConfig callback is run every time a viewModel/dataModel/router declaration is encountered
    fw.components.clearCachedDefinition(tagName.toLowerCase());
  }

  return originalComponentInit(element, valueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = componentInit;
