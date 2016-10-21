var _ = require('lodash');
var fw = require('knockout/build/output/knockout-latest');

var entityTools = require('./entity-tools');
var isEntity = entityTools.isEntity;
var isRouter = entityTools.isRouter;

var config = require('../misc/config');
var entityAnimateClass = config.entityAnimateClass;
var entityClass = config.entityClass;
var entityWrapperElement = config.entityWrapperElement;
var privateDataSymbol = config.privateDataSymbol;

var addClass = require('../misc/util').addClass;

/**
 * This method is used by applyBindings to bootstrap the lifecycle of an entity (if that is what was bound).
 *
 * @param {viewModel} entity
 * @param {DOMElement} element
 */
function entityLifecycle(entity, element) {
  if (isEntity(entity) && !entity[privateDataSymbol].afterRenderWasTriggered) {
    entity[privateDataSymbol].afterRenderWasTriggered = true;
    element = element || document.body;

    var context;
    var entityContext;
    var $configParams = entity[privateDataSymbol].configParams;
    if (element.tagName.toLowerCase() === entityWrapperElement) {
      element = element.parentElement || element.parentNode;
    }

    entity[privateDataSymbol].element = element;
    entity.$context = entityContext = fw.contextFor(element);

    var afterRender = _.noop;
    if (_.isFunction($configParams.afterRender)) {
      afterRender = $configParams.afterRender;
    }

    var resolveFlightTracker = entity[privateDataSymbol].resolveFlightTracker || _.noop;
    $configParams.afterRender = function (containerElement) {
      afterRender.call(this, containerElement);
      addClass(containerElement, entityClass);
      resolveFlightTracker(function addAnimationClass() {
        addClass(containerElement, entityAnimateClass);
      });
    };
    $configParams.afterRender.call(entity, element);

    if (isRouter(entity)) {
      entity[privateDataSymbol].context(entityContext);
    }

    if (!_.isUndefined(element)) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        entity.dispose();
      });
    }
  }
}

module.exports = entityLifecycle;
