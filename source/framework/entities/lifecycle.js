// framework/entities/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given model and element
function setupContextAndLifeCycle(entity, element) {
  if( isEntity(entity) ) {
    element = element || document.body;

    var context;
    var elementContext;
    var $configParams = entity.__getConfigParams();
    if(element.tagName.toLowerCase() === 'binding-wrapper') {
      element = element.parentElement || element.parentNode;
    }

    entity.$element = element;
    entity.$context = elementContext = fw.contextFor(element);

    if( isFunction($configParams.afterBinding) ) {
      $configParams.afterBinding.call(entity, element);
    }

    if( isRouter(entity) ) {
      entity.__router('context')( elementContext );
    }

    if( !isUndefined(element) ) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        entity.dispose();
      });
    }
  }
}
