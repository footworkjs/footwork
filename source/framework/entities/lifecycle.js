// framework/entities/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given entity and element
function setupContextAndLifeCycle(entity, element) {
  if(isEntity(entity) && !entity.__private('afterRenderWasTriggered')) {
    entity.__private('afterRenderWasTriggered', true);
    element = element || document.body;

    var context;
    var entityContext;
    var $configParams = entity.__private('configParams');
    if(element.tagName.toLowerCase() === 'binding-wrapper') {
      element = element.parentElement || element.parentNode;
    }

    entity.__private('element', element);
    entity.$context = entityContext = fw.contextFor(element);

    var afterRender = noop;
    if(isFunction($configParams.afterRender)) {
      afterRender = $configParams.afterRender;
    }

    var resolveFlightTracker = entity.__private('resolveFlightTracker') || noop;
    $configParams.afterRender = function(containerElement) {
      addClass(containerElement, entityClass);
      function addAnimationClass() {
        setTimeout(function() {
          addClass(containerElement, entityAnimateClass);
        }, minimumAnimationDelay);
      }
      afterRender.call(this, containerElement);
      resolveFlightTracker(addAnimationClass);
    };
    $configParams.afterRender.call(entity, element);

    if( isRouter(entity) ) {
      entity.__private('context')(entityContext);
    }

    if( !isUndefined(element) ) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        entity.dispose();
      });
    }
  }
}
