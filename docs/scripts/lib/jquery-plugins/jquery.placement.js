;(function () {
  /*
   * jQuery placement - calculate the absolute position, dimensions, and offsets of an element from the containing document
   * Examples and documentation at: http://staticty.pe/code/placement.js/
   * Copyright (c) 2013 J. Newman
   * Version: 1.0 (13-July-2013)
   * Dual licensed under the MIT and GPL licenses.
   */
  function init( $, undefined ) {
    $.fn.placement = function( options ) {
      var defaultOptions = {
            prop: [ 'top', 'bottom', 'height', 'width', 'left', 'right' ],
            adjustment: { },
            context: 'document'
          },
          options = ( options !== undefined && $.extend( true, {}, defaultOptions, options ) ) || defaultOptions,
          props = [],
          positionGetter = ( options.context === 'document' ? 'offset' : 'position' );

      this.each(function() {
        var $element = $(this),
            prop = { $el: $element };

        var CalcProp = function CalcProp( $element ) {
          var cached = {},
              self = this;

          this.placement = function() {
            return cached.placement || ( cached.placement = $element[ positionGetter ]() );
          };

          this.top = function() {
            return cached.top || ( cached.top = this.placement().top + ( parseInt( options.adjustment.top, 10 ) || 0) );
          };

          this.bottom = function() {
            return cached.bottom || ( cached.bottom = self.top() + self.height() + ( parseInt( options.adjustment.bottom, 10 ) || 0) );
          };

          this.left = function() {
            return cached.left || ( cached.left = this.placement().left + ( parseInt( options.adjustment.left, 10 ) || 0) );
          };

          this.right = function() {
            return cached.right || ( cached.right = self.left() + self.width() + ( parseInt( options.adjustment.right, 10 ) || 0) );
          };

          this.height = function() {
            return cached.height || ( cached.height = $element.outerHeight() + ( parseInt( options.adjustment.height, 10 ) || 0) );
          };

          this.width = function() {
            return cached.width || ( cached.width = $element.outerWidth() + ( parseInt( options.adjustment.width, 10 ) || 0) );
          };

          this.getCache = function() {
            return cached;
          };

          return this;
        };

        var calc = new CalcProp( $element );

        $.each( options.prop, function( index, property ) {
          prop[ property ] = calc[ property ]();
        });

        props.push( prop );
      });

      if( props.length > 1 ) {
        return props;
      }

      return props[0];
    };
  }

  if( typeof define === 'function' && define.amd ) {
    define([ "jquery" ], function( jQuery ) { init( jQuery ); } );
  } else if( typeof module !== 'undefined' && module.exports ) {
    init( require("jquery") );
  } else {
    init( jQuery || $ );
  }
}.call(this));
