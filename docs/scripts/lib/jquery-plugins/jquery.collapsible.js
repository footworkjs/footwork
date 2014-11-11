(function (factory) {
  if( typeof define === 'function' && define.amd ) {
    define(['jquery'], factory);
  } else if( typeof exports === 'object' ) {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function ($) {
  $.fn.collapsible = function() {
    this.each(function() {
      var $container = $(this);
      var $children = $container.children('li');

      this.$children = $children;
      $children.on('click', function(event) {
        var openTarget = false;
        if( !$(this).hasClass('expanded') ) {
          openTarget = true;
        }

        $children.removeClass('expanded');

        if(openTarget) {
          $(event.currentTarget).addClass('expanded');
        }
      });
      $children.children('.content').click(function(event) { event.stopPropagation(); });
    });

    return this;
  };
}));