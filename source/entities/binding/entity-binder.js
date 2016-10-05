var fw = require('../../../bower_components/knockoutjs/dist/knockout');
var _ = require('../../misc/lodash');

var util = require('../../misc/util');
var isPromise = util.isPromise;
var isPath = util.isPath;
var promiseIsResolvedOrRejected = util.promiseIsResolvedOrRejected;

var isEntity = require('../entity-tools').isEntity;

module.exports = function entityBinder(element, params, $parentContext, Entity, $flightTracker, $parentsInFlightChildren, $outletsInFlightChildren) {
  var entityObj;
  if (_.isFunction(Entity)) {
    entityObj = new Entity(params);
  } else {
    entityObj = Entity;
  }
  entityObj.$parentContext = $parentContext;

  if (isEntity(entityObj)) {
    var resolveFlightTracker =  _.noop;

    if ($flightTracker) {
      resolveFlightTracker = function(addAnimationClass) {
        var wasResolved = false;
        function resolveThisEntityNow(isResolved) {
          function finishResolution() {
            addAnimationClass();
            if(fw.isObservable($parentsInFlightChildren) && _.isFunction($parentsInFlightChildren.remove)) {
              $parentsInFlightChildren.remove($flightTracker);
            }
            if(fw.isObservable($outletsInFlightChildren) && _.isFunction($outletsInFlightChildren.remove)) {
              $outletsInFlightChildren.remove($flightTracker);
            }
          }

          if (!wasResolved) {
            wasResolved = true;
            if (isResolved === true) {
              finishResolution();
            } else if(isPromise(isResolved) || (_.isArray(isResolved) && _.every(isResolved, isPromise))) {
              var promises = [].concat(isResolved);
              var checkPromise = function(promise) {
                (promise.done || promise.then).call(promise, function() {
                  if(_.every(promises, promiseIsResolvedOrRejected)) {
                    finishResolution();
                  }
                });
              };

              _.each(promises, checkPromise);
            }
          }
        }

        function maybeResolve() {
          entityObj.__private('configParams').afterResolving.call(entityObj, resolveThisEntityNow);
        }

        var $inFlightChildren = entityObj.__private('inFlightChildren');
        // if no children then resolve now, otherwise subscribe and wait till its 0
        if ($inFlightChildren().length === 0) {
          maybeResolve();
        } else {
          entityObj.disposeWithInstance($inFlightChildren.subscribe(function(inFlightChildren) {
            inFlightChildren.length === 0 && maybeResolve();
          }));
        }
      };
    }

    entityObj.__private('resolveFlightTracker', resolveFlightTracker);
  }

  var childrenToInsert = [];
  _.each(element.childNodes, function(child) {
    if (!isUndefined(child)) {
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
