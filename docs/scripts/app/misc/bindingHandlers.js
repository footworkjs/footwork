define(["jquery", "lodash", "knockout", "postal" ],
  function( $, _, ko, postal ) {
    /**
     * Trigger remote events
     */
    ko.bindingHandlers['command'] = {
      init: function ( element, valueAccessor, allBindings, viewModel, bindingContext ) {
        var eventsToHandle = valueAccessor() || {};

        _.each( eventsToHandle, function( eventOptions, eventName ) {
          ko.utils.registerEventHandler( element, eventName, function ( event ) {
            if( eventOptions.ns ) {
              postal.channel( eventOptions.ns ).publish( eventOptions.order, eventOptions.value );
            }
          });
        });
      }
    };

    ko.bindingHandlers['transition'] = {
      'update': function( element, valueAccessor ) {
        var transitionDefinition = ko.utils.unwrapObservable(valueAccessor());
        $(element).css({ WebkitTransition : transitionDefinition,
                             MozTransition: transitionDefinition,
                              MsTransition: transitionDefinition,
                               OTransition: transitionDefinition,
                                transition: transitionDefinition });
      }
    };

    ko.bindingHandlers['transform'] = {
      'update': function( element, valueAccessor ) {
        var transformDefinition = ko.utils.unwrapObservable(valueAccessor());
        $(element).css({ WebkitTransform : transformDefinition,
                             MozTransform: transformDefinition,
                              MsTransform: transformDefinition,
                               OTransform: transformDefinition,
                                transform: transformDefinition });
      }
    };

    // credit: http://www.knockmeout.net/
    ko.bindingHandlers['logger'] = {
      update: function( element, valueAccessor, allBindings ) {
        //store a counter with this element
        var count = ko.utils.domData.get( element, "_ko_logger" ) || 0,
        data = ko.toJS( valueAccessor() || allBindings() );

        ko.utils.domData.set(element, "_ko_logger", ++count);

        if( console && console.log ) {
          console.log(count, element, data);
        }
      }
    };

    /**
     * Source: https://github.com/SteveSanderson/knockout/wiki/Bindings---class
     */
    ko.bindingHandlers['class'] = {
      'update': function( element, valueAccessor ) {
        var $element = $(element);
        if( element['__ko__previousClassValue__'] ) {
          $element.removeClass(element['__ko__previousClassValue__']);
        }
        var value = ko.utils.unwrapObservable(valueAccessor());
        typeof value !== 'undefined' && $element.addClass(value);
        element['__ko__previousClassValue__'] = value;
      }
    };

    ko.bindingHandlers['stopBinding'] = {
      init: function() {
        return { controlsDescendantBindings: true };
      }
    };
  }
);