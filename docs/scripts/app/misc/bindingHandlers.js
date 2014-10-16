define(["jquery", "lodash", "knockout", "postal" ],
  function( $, _, fw, postal ) {
    /**
     * Trigger remote events
     */
    fw.bindingHandlers['command'] = {
      init: function ( element, valueAccessor, allBindings, viewModel, bindingContext ) {
        var eventsToHandle = valueAccessor() || {};

        _.each( eventsToHandle, function( eventOptions, eventName ) {
          fw.utils.registerEventHandler( element, eventName, function ( event ) {
            if( eventOptions.ns ) {
              postal.channel( eventOptions.ns ).publish( eventOptions.order, eventOptions.value );
            }
          });
        });
      }
    };

    fw.bindingHandlers['transition'] = {
      'update': function( element, valueAccessor ) {
        var transitionDefinition = fw.utils.unwrapObservable(valueAccessor());
        $(element).css({ WebkitTransition : transitionDefinition,
                             MozTransition: transitionDefinition,
                              MsTransition: transitionDefinition,
                               OTransition: transitionDefinition,
                                transition: transitionDefinition });
      }
    };

    fw.bindingHandlers['transform'] = {
      'update': function( element, valueAccessor ) {
        var transformDefinition = fw.utils.unwrapObservable(valueAccessor());
        $(element).css({ WebkitTransform : transformDefinition,
                             MozTransform: transformDefinition,
                              MsTransform: transformDefinition,
                               OTransform: transformDefinition,
                                transform: transformDefinition });
      }
    };

    // credit: http://www.knockmeout.net/
    fw.bindingHandlers['logger'] = {
      update: function( element, valueAccessor, allBindings ) {
        //store a counter with this element
        var count = fw.utils.domData.get( element, "_ko_logger" ) || 0,
        data = fw.toJS( valueAccessor() || allBindings() );

        fw.utils.domData.set(element, "_ko_logger", ++count);

        if( console && console.log ) {
          console.log(count, element, data);
        }
      }
    };

    /**
     * Source: https://github.com/SteveSanderson/knockout/wiki/Bindings---class
     */
    fw.bindingHandlers['class'] = {
      'update': function( element, valueAccessor ) {
        var $element = $(element);
        if( element['__ko__previousClassValue__'] ) {
          $element.removeClass(element['__ko__previousClassValue__']);
        }
        var value = fw.utils.unwrapObservable(valueAccessor());
        typeof value !== 'undefined' && $element.addClass(value);
        element['__ko__previousClassValue__'] = value;
      }
    };

    fw.bindingHandlers['stopBinding'] = {
      init: function() {
        return { controlsDescendantBindings: true };
      }
    };
  }
);