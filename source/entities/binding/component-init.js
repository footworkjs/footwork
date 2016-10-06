var fw = require('../../../bower_components/knockoutjs/dist/knockout');
var _ = require('../../misc/lodash');

var entityBinder = require('./entity-binder');
var nearestEntity = require('../entity-tools').nearestEntity;
var isOutletViewModel = require('../router/router-tools').isOutletViewModel;

var entityDescriptors = require('./../entity-descriptors');

function getResourceLocation(moduleName) {
  var resource = this;
  var resourceLocation = null;

  if (resource.isRegistered(moduleName)) {
    // viewModel was manually registered, we preferentially use it
    resourceLocation = resource.getRegistered(moduleName);
  } else if (_.isFunction(window.require) && _.isFunction(window.require.specified) && window.require.specified(moduleName)) {
    // we have found a matching resource that is already cached by require, lets use it
    resourceLocation = moduleName;
  } else {
    resourceLocation = resource.getLocation(moduleName);
  }

  return resourceLocation;
}

// Monkey patch enables the entity to initialize a viewModel and bind to the html as intended (with lifecycle events)
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = fw.bindingHandlers.component.init;

function initEntityTag(tagName, element, valueAccessor, allBindings, viewModel, bindingContext) {
  var theValueAccessor = valueAccessor;
  if (tagName === '__elementBased') {
    tagName = element.tagName;
  }

  var $flightTracker = { name: tagName, type: 'component' };

  if (element.nodeType !== 8 && (!_.isString(tagName) || tagName.toLowerCase() !== 'outlet')) {
    var $nearestEntity = nearestEntity(bindingContext);
    if ($nearestEntity) {
      var $inFlightChildren = $nearestEntity.__private('inFlightChildren');
      if (fw.isObservable($inFlightChildren) && _.isFunction($inFlightChildren.push)) {
        $inFlightChildren.push($flightTracker);
      }
    }

    var $nearestOutlet = nearestEntity(bindingContext, isOutletViewModel);
    if ($nearestOutlet) {
      var $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
      if (fw.isObservable($outletsInFlightChildren) && _.isFunction($outletsInFlightChildren.push)) {
        $outletsInFlightChildren.push($flightTracker);
      }
    }
  }

  if (_.isString(tagName)) {
    tagName = tagName.toLowerCase();
    if (entityDescriptors.tagNameIsPresent(tagName)) {
      var values = valueAccessor();
      var moduleName = (!_.isUndefined(values.params) ? fw.unwrap(values.params.name) : undefined) || element.getAttribute('module') || element.getAttribute('data-module');
      var bindModel = entityBinder.bind(null, element, values.params, bindingContext);
      var resource = entityDescriptors.resourceFor(tagName);
      var getResourceLocationFor = getResourceLocation.bind(resource);

      $flightTracker.name = moduleName;
      $flightTracker.type = tagName;

      if (_.isNull(moduleName) && _.isString(values)) {
        moduleName = values;
      }

      if (!_.isUndefined(moduleName) && !_.isNull(resource)) {
        var resourceLocation = getResourceLocationFor(moduleName);

        if (_.isString(resourceLocation)) {
          if (_.isFunction(window.require)) {
            if (!window.require.specified(resourceLocation)) {
              if (isPath(resourceLocation)) {
                resourceLocation = resourceLocation + resource.getFileName(moduleName);
              }
              resourceLocation = require.toUrl(resourceLocation);
            }

            window.require([resourceLocation], function(resource) {
              bindModel(resource, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
            });
          } else {
            throw new Error('Uses require, but no AMD loader is present');
          }
        } else if (_.isFunction(resourceLocation)) {
          bindModel(resourceLocation, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
        } else if (_.isObject(resourceLocation)) {
          var createInstance = resourceLocation.createViewModel || resourceLocation.createDataModel;
          if (_.isObject(resourceLocation.instance)) {
            bindModel(resourceLocation.instance, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          } else if (_.isFunction(createInstance)) {
            bindModel(createInstance(values.params, { element: element }), $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          }
        }
      }

      return { 'controlsDescendantBindings': true };
    } else if (tagName === 'outlet') {
      // we patch in the 'name' of the outlet into the params valueAccessor on the component definition (if necessary and available)
      var outletName = element.getAttribute('name') || element.getAttribute('data-name');
      if (outletName) {
        theValueAccessor = function valueAccessorMask() {
          var valueAccessorResult = valueAccessor();
          if (!_.isUndefined(valueAccessorResult.params) && _.isUndefined(valueAccessorResult.params.name)) {
            valueAccessorResult.params.name = outletName;
          }
          return valueAccessorResult;
        };
      }
    }
  }

  element.$flightTracker = $flightTracker;
  return originalComponentInit(element, theValueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = initEntityTag.bind(null, '__elementBased');
