// framework/entities/bindingInit.js
// ------------------

function entityBinder(element, params, $parentContext, Entity, $flightTracker, $parentsInFlightChildren, $outletsInFlightChildren) {
  var entityObj;
  if (isFunction(Entity)) {
    entityObj = new Entity(params);
  } else {
    entityObj = Entity;
  }
  entityObj.$parentContext = $parentContext;

  if (isEntity(entityObj)) {
    var resolveFlightTracker =  noop;

    if ($flightTracker) {
      resolveFlightTracker = function(addAnimationClass) {
        var wasResolved = false;
        function resolveThisEntityNow(isResolved) {
          function finishResolution() {
            addAnimationClass();
            if(fw.isObservable($parentsInFlightChildren) && isFunction($parentsInFlightChildren.remove)) {
              $parentsInFlightChildren.remove($flightTracker);
            }
            if(fw.isObservable($outletsInFlightChildren) && isFunction($outletsInFlightChildren.remove)) {
              $outletsInFlightChildren.remove($flightTracker);
            }
          }

          if (!wasResolved) {
            wasResolved = true;
            if (isResolved === true) {
              finishResolution();
            } else if(isPromise(isResolved) || (isArray(isResolved) && every(isResolved, isPromise))) {
              var promises = [].concat(isResolved);
              var checkPromise = function(promise) {
                (promise.done || promise.then).call(promise, function() {
                  if(every(promises, promiseIsResolvedOrRejected)) {
                    finishResolution();
                  }
                });
              };

              each(promises, checkPromise);
            }
          }
        }

        function maybeResolve() {
          entityObj.__private('configParams').resolved.call(entityObj, resolveThisEntityNow);
        }

        var $inFlightChildren = entityObj.__private('inFlightChildren');
        // if no children then resolve now, otherwise subscribe and wait till its 0
        if ($inFlightChildren().length === 0) {
          maybeResolve();
        } else {
          entityObj.$trackSub($inFlightChildren.subscribe(function(inFlightChildren) {
            inFlightChildren.length === 0 && maybeResolve();
          }));
        }
      };
    }

    entityObj.__private('resolveFlightTracker', resolveFlightTracker);
  }

  var childrenToInsert = [];
  each(element.childNodes, function(child) {
    if (!isUndefined(child)) {
      childrenToInsert.push(child);
    }
  });

  // Have to create a wrapper element for the contents of the element. Cannot bind to
  // existing element as it has already been bound against.
  var wrapperNode = document.createElement('binding-wrapper');
  element.insertBefore(wrapperNode, element.firstChild);

  each(childrenToInsert, function(child) {
    wrapperNode.appendChild(child);
  });

  fw.applyBindings(entityObj, wrapperNode);
};

// Monkey patch enables the entity to initialize a viewModel and bind to the html as intended (with lifecycle events)
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = fw.bindingHandlers.component.init;

function getResourceLocation(moduleName) {
  var resource = this;
  var resourceLocation = null;

  if( resource.isRegistered(moduleName) ) {
    // viewModel was manually registered, we preferentially use it
    resourceLocation = resource.getRegistered(moduleName);
  } else if( isFunction(require) && isFunction(require.specified) && require.specified(moduleName) ) {
    // we have found a matching resource that is already cached by require, lets use it
    resourceLocation = moduleName;
  } else {
    resourceLocation = resource.getLocation(moduleName);
  }

  return resourceLocation;
}

function initEntityTag(tagName, element, valueAccessor, allBindings, viewModel, bindingContext) {
  var theValueAccessor = valueAccessor;
  if (tagName === '__elementBased') {
    tagName = element.tagName;
  }

  var $flightTracker = { name: tagName, type: 'component' };

  if(element.nodeType !== 8 && (!isString(tagName) || tagName.toLowerCase() !== 'outlet')) {
    var $nearestEntity = nearestEntity(bindingContext);
    if ($nearestEntity) {
      var $inFlightChildren = $nearestEntity.__private('inFlightChildren');
      if (isObservable($inFlightChildren) && isFunction($inFlightChildren.push)) {
        $inFlightChildren.push($flightTracker);
      }
    }

    var $nearestOutlet = nearestEntity(bindingContext, isOutletViewModel);
    if ($nearestOutlet) {
      var $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
      if (isObservable($outletsInFlightChildren) && isFunction($outletsInFlightChildren.push)) {
        $outletsInFlightChildren.push($flightTracker);
      }
    }
  }

  if (isString(tagName)) {
    tagName = tagName.toLowerCase();
    if (entityDescriptors.tagNameIsPresent(tagName)) {
      var values = valueAccessor();
      var moduleName = (!isUndefined(values.params) ? fw.unwrap(values.params.name) : undefined) || element.getAttribute('module') || element.getAttribute('data-module');
      var bindModel = entityBinder.bind(null, element, values.params, bindingContext);
      var resource = entityDescriptors.resourceFor(tagName);
      var getResourceLocationFor = getResourceLocation.bind(resource);

      $flightTracker.name = moduleName;
      $flightTracker.type = tagName;

      if (isNull(moduleName) && isString(values)) {
        moduleName = values;
      }

      if (!isUndefined(moduleName) && !isNull(resource)) {
        var resourceLocation = getResourceLocationFor(moduleName);

        if (isString(resourceLocation)) {
          if (isFunction(require)) {
            if (!require.specified(resourceLocation)) {
              if (isPath(resourceLocation)) {
                resourceLocation = resourceLocation + resource.getFileName(moduleName);
              }
              resourceLocation = require.toUrl(resourceLocation);
            }

            require([resourceLocation], function(resource) {
              var args = Array.prototype.slice.call(arguments);
              bindModel(resource, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
            });
          } else {
            throw new Error('Uses require, but no AMD loader is present');
          }
        } else if (isFunction(resourceLocation)) {
          bindModel(resourceLocation, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
        } else if (isObject(resourceLocation)) {
          var createInstance = resourceLocation.createViewModel || resourceLocation.createDataModel;
          if(isObject(resourceLocation.instance)) {
            bindModel(resourceLocation.instance, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          } else if (isFunction(createInstance)) {
            bindModel(createInstance(values.params, { element: element }), $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          }
        }
      }

      return { 'controlsDescendantBindings': true };
    } else if (tagName === 'outlet') {
      // we patch in the 'name' of the outlet into the params valueAccessor on the component definition (if necessary and available)
      var outletName = element.getAttribute('name') || element.getAttribute('data-name');
      if(outletName) {
        theValueAccessor = function() {
          var valueAccessorResult = valueAccessor();
          if( !isUndefined(valueAccessorResult.params) && isUndefined(valueAccessorResult.params.name) ) {
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

// NOTE: Do not use the $router binding yet, it is incomplete
fw.bindingHandlers.$router = {
  preprocess: function(moduleName) {
    return "'" + moduleName + "'";
  },
  init: initEntityTag.bind(null, 'router')
};

// NOTE: Do not use the $viewModel binding yet, it is incomplete
fw.bindingHandlers.$viewModel = {
  preprocess: function(moduleName) {
    return "'" + moduleName + "'";
  },
  init: initEntityTag.bind(null, 'viewModel')
};
