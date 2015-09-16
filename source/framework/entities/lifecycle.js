// framework/entities/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given entity and element
function setupContextAndLifeCycle(entity, element) {
  if( isEntity(entity) ) {
    element = element || document.body;

    var context;
    var entityContext;
    var $configParams = entity.__private('configParams');
    if(element.tagName.toLowerCase() === 'binding-wrapper') {
      element = element.parentElement || element.parentNode;
    }

    entity.__private('element', element);
    entity.$context = entityContext = fw.contextFor(element);

    if( isFunction($configParams.afterBinding) ) {
        var afterBinding = noop;
        if(isFunction($configParams.afterBinding)) {
          afterBinding = $configParams.afterBinding;
        }

        $configParams.afterBinding = function(containerElement) {
          setTimeout(function() {
            if(containerElement.className.indexOf(bindingClassName) === -1) {
              containerElement.className += ' ' + bindingClassName;
            }
          }, animationIteration);
          afterBinding.call(this, containerElement);
        };
      $configParams.afterBinding.call(entity, element);
    }

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
