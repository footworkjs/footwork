// framework/entities/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given entity and element
function setupContextAndLifeCycle(entity, element) {
  if(isEntity(entity) && !entity.__private('afterBindingWasTriggered')) {
    entity.__private('afterBindingWasTriggered', true);
    element = element || document.body;

    var context;
    var entityContext;
    var $configParams = entity.__private('configParams');
    if(element.tagName.toLowerCase() === 'binding-wrapper') {
      element = element.parentElement || element.parentNode;
    }

    entity.__private('element', element);
    entity.$context = entityContext = fw.contextFor(element);

    var afterBinding = noop;
    if(isFunction($configParams.afterBinding)) {
      afterBinding = $configParams.afterBinding;
    }

    $configParams.afterBinding = function(containerElement) {
      addClass(containerElement, entityClassName);
      setTimeout(function() {
        addClass(containerElement, bindingClassName);
      }, animationIteration);
      afterBinding.call(this, containerElement);
    };
    $configParams.afterBinding.call(entity, element);

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
