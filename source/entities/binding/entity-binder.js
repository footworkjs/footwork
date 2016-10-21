var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../../misc/util');
var isPromise = util.isPromise;
var isPath = util.isPath;
var promiseIsFulfilled = util.promiseIsFulfilled;

var config = require('../../misc/config');
var entityWrapperElement = config.entityWrapperElement;
var privateDataSymbol = config.privateDataSymbol;

var isEntity = require('../entity-tools').isEntity;

module.exports = function entityBinder(element, params, $parentContext, Entity, flightTracker, parentsInFlightChildren, outletsInFlightChildren) {
  var entityObj;
  if (_.isFunction(Entity)) {
    entityObj = new Entity(params);
  } else {
    entityObj = Entity;
  }
  entityObj.$parentContext = $parentContext;

  if (isEntity(entityObj)) {
    var resolveFlightTracker =  _.noop;

    if (flightTracker) {
      resolveFlightTracker = function(addAnimationClass) {
        var wasResolved = false;
        function resolveThisEntityNow(isResolved) {
          function finishResolution() {
            addAnimationClass();
            if (fw.isObservable(parentsInFlightChildren) && _.isFunction(parentsInFlightChildren.remove)) {
              parentsInFlightChildren.remove(flightTracker);
            }
            if (fw.isObservable(outletsInFlightChildren) && _.isFunction(outletsInFlightChildren.remove)) {
              outletsInFlightChildren.remove(flightTracker);
            }
          }

          if (!wasResolved) {
            wasResolved = true;
            if (isResolved === true) {
              finishResolution();
            } else if (isPromise(isResolved) || (_.isArray(isResolved) && _.every(isResolved, isPromise))) {
              var promises = [].concat(isResolved);
              var checkPromise = function(promise) {
                (promise.done || promise.then).call(promise, function() {
                  if (_.every(promises, promiseIsFulfilled)) {
                    finishResolution();
                  }
                });
              };

              _.each(promises, checkPromise);
            }
          }
        }

        function maybeResolve() {
          entityObj[privateDataSymbol].configParams.afterResolving.call(entityObj, resolveThisEntityNow);
        }

        var inFlightChildren = entityObj[privateDataSymbol].inFlightChildren;
        // if no children then resolve now, otherwise subscribe and wait till its 0
        if (inFlightChildren().length === 0) {
          maybeResolve();
        } else {
          entityObj.disposeWithInstance(inFlightChildren.subscribe(function(inFlightChildren) {
            inFlightChildren.length === 0 && maybeResolve();
          }));
        }
      };
    }

    entityObj[privateDataSymbol].resolveFlightTracker = resolveFlightTracker;
  }

  var childrenToInsert = [];
  _.each(element.childNodes, function(child) {
    if (!_.isUndefined(child)) {
      childrenToInsert.push(child);
    }
  });

  // Have to create a wrapper element for the contents of the element. Cannot bind to
  // existing element as it has already been bound against.
  var wrapperNode = document.createElement(entityWrapperElement);
  element.insertBefore(wrapperNode, element.firstChild);

  _.each(childrenToInsert, function(child) {
    wrapperNode.appendChild(child);
  });

  fw.applyBindings(entityObj, wrapperNode);
};
