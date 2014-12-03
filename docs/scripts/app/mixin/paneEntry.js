define([ "footwork", "lodash" ],
  function( fw, _ ) {
    return {
      _preInit: function( options ) {
        var activeTimeout;
        var paneElementsChannel = fw.namespace('PaneElements');

        this.visible = fw.observable( null ).extend({ autoEnable: _.random( 200, 600 ) });
        this.active = fw.observable(false);
        this.clickable = fw.observable(false);
        this.viewportIsMobile = fw.observable().receiveFrom('ViewPort', 'isMobile');
        this.viewportIsTablet = fw.observable().receiveFrom('ViewPort', 'isTablet');
        this.paneScrolling = fw.observable(false).receiveFrom('Pane', 'scrolling');

        this.state = fw.computed(function() {
          return {
            visible: this.visible(),
            active: this.active()
          };
        }, this);

        this.active.subscribe(function(state) {
          if(state === true) {
            clearTimeout(activeTimeout);
            activeTimeout = setTimeout(function() {
              this.clickable(true);
            }.bind(this), 300);
          } else {
            this.clickable(false);
          }
        }, this);
        this.$namespace.subscribe('deactivate', function(callingObject) {
          if( callingObject !== this && this.paneScrolling() === false ) {
            this.active(false);
          }
        }).context(this);

        paneElementsChannel.subscribe('hideAll', function() {
          this.visible( false );
        }).context(this);

        this.filterClick = function(model, event) {
            var $link = $(event.target),
                touchDevice = [ this.viewportIsTablet(), this.viewportIsMobile() ];

            if($link.prop('tagName') !== 'A') {
              $link = $link.parents('a');
            }

          if(( _.any(touchDevice) && this.clickable() === true ) || _.contains(touchDevice, true) === false) {
            window.open($link.prop('href'), '_blank');
          }
        };

        this.activate = function() {
          if( this.paneScrolling() === false ) {
            this.active(true);
            this.$namespace.publish('deactivate', this);
          }
        };

        this.visible( false );
      }
    };
  }
);