// framework/entities/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given entity and element
function setupContextAndLifeCycle(entity, element) {
  if( isEntity(entity) ) {
    element = element || document.body;

    var context;
    var elementContext;
    var $configParams = entity.__getConfigParams();
    if(element.tagName.toLowerCase() === 'binding-wrapper') {
      element = element.parentElement || element.parentNode;
    }

    if(element.className.indexOf(entityClassName) === -1) {
      element.className += entityClassName;
    }

    entity.$element = element;
    entity.$context = elementContext = fw.contextFor(element);

    if( isFunction($configParams.afterBinding) ) {
        var afterBinding = noop;
        if(isFunction($configParams.afterBinding)) {
          afterBinding = $configParams.afterBinding;
        }

        $configParams.afterBinding = function(element) {
          setTimeout(function() {
            if(element.className.indexOf(bindingClassName) === -1)
            element.className += ' ' + bindingClassName;
          }, 20);
          afterBinding.call(this, element);
        };
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
