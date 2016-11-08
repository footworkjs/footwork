var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../misc/config').privateDataSymbol;
var setLoadingTracker = require('../misc/loading-tracker').set;
var nearestEntity = require('../entities/entity-tools').nearestEntity;
var getSymbol = require('../misc/util').getSymbol;
var entityDescriptors = require('../entities/entity-descriptors');
var originalComponentBindingInit = fw.bindingHandlers.component.init;

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
function componentBindingInit (element, valueAccessor, allBindings, viewModel, bindingContext) {
  var tagName = (element.tagName || '').toLowerCase();
  var loadingTracker = element[getSymbol('loadingTracker')] = {
    tagName: tagName,
    moduleName: element.getAttribute('module') || /* istanbul ignore next */ element.getAttribute('data-module'),
    elementName: element.getAttribute('name') || /* istanbul ignore next */ element.getAttribute('data-name')
  };

  /**
   * If this is not an outlet we need to add ourselves to the parent loadingChildren observableArray.
   * Once this component is loaded the $lifecycle binding then removes the loadingTracker from the loadingChildren observableArray.
   * The loadingTracker observableArray is used to trigger when an instance and all its children are fully 'resolved' (bound and rendered).
   */
  if (tagName !== 'outlet') {
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
    setLoadingTracker(loadingTracker);

    // ensure that the (./loaders/entity-loader) getConfig callback is run every time a viewModel/dataModel/router/outlet declaration is encountered
    fw.components.clearCachedDefinition(tagName);
  }

  return originalComponentBindingInit(element, valueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = componentBindingInit;
