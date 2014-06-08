;(function () {
  /*
   * jQuery pulse - toggle a .pulse class on an element in an effort to create a type of feedback
   * Copyright (c) 2013 J. Newman
   * Dual licensed under the MIT and GPL licenses.
   */
  function init( $, undefined ) {
    $.fn.pulse = function( options ) {
      if( typeof options === 'number' ) {
        options = { duration: options };
      }

      options = $.extend( {
        duration: 1000,
        className: 'pulse'
      }, options || {} );
      var namespace = '_pulseNS_' + options.className;

      this.each(function() {
        var timeout, $element = $(this);
        ( timeout = $element.data(namespace) ) !== undefined && clearTimeout( timeout );

        $element.data( namespace, timeout = $element.addClass( options.className ) );
        window.setTimeout( function() {
          $element.removeClass( options.className );
          clearTimeout( timeout );
        }, options.duration );
      });

      return this;
    };
  }

  if( typeof define === 'function' && define.amd ) {
    define([ "jquery" ], function( jQuery ) { init( jQuery ); } );
  } else if( typeof require === "function" && typeof exports === "object" && typeof module === "object" ) {
    init( require("jquery") );
  } else {
    init( jQuery || $ );
  }
}.call(this));