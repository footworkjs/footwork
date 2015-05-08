// framework/entities/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given model and element
setupContextAndLifeCycle = function(entity, element) {
  if( isEntity(entity) ) {
    var $configParams = entity.__getConfigParams();
    var context;
    element = element || document.body;
    entity.$element = element;
    entity.$context = elementContext = fw.contextFor(element.tagName.toLowerCase() === 'binding-wrapper' ? (element.parentElement || element.parentNode) : element);

    if( isFunction($configParams.afterBinding) ) {
      $configParams.afterBinding.call(entity, element);
    }

    if( isRouter(entity) ) {
      entity.context( elementContext );
    }

    if( !isUndefined(element) ) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        entity.dispose();
      });
    }
  }
}
