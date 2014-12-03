define([ "footwork", "lodash" ],
  function( fw, _ ) {
    return fw.viewModel({
      namespace: 'LayoutControl',
      initialize: function() {
        this.active = {
          header: fw.observable(),
          column: fw.observable(),
          corner: fw.observable()
        };

        this.defaultPaneMaxWidth = fw.observable().receiveFrom('Configuration', 'defaultPaneMaxWidth');
        this.transitionsEnabled = fw.observable().receiveFrom('Configuration', 'transitionsEnabled');
        this.headerMinHeight = fw.observable().receiveFrom('Configuration', 'headerMinHeight');
        this.headerMaxHeight = fw.observable().receiveFrom('Configuration', 'headerMaxHeight');
        this.configPaneMinWidth = fw.observable().receiveFrom('Configuration', 'paneMinWidth');
        this.configPaneMaxWidth = fw.observable().receiveFrom('Configuration', 'paneMaxWidth');
        this.headerLimitHeight = fw.observable().receiveFrom('Configuration', 'headerLimitHeight');
        this.heightMutable = fw.observable().receiveFrom('Configuration', 'heightMutable');
        this.reflowing = fw.observable().receiveFrom('Configuration', 'reflowing');
        this.visible = fw.observable(false).receiveFrom('Configuration', 'visible');
        this.visibleHeaderHeight = fw.observable(0).receiveFrom('Header', 'visibleHeight');
        this.paneCollapsed = fw.observable(0).receiveFrom('Configuration', 'paneCollapsed');
        this.columnWidth = fw.observable(0).receiveFrom('Pane', 'columnWidth');
        this.paneMaxWidth = fw.observable(0).receiveFrom('Pane', 'maxWidth');
        this.scrollPosition = fw.observable(false).receiveFrom('ViewPort', 'scrollPosition');
        this.viewPortHas3dTransforms = fw.observable(false).receiveFrom('ViewPort', 'has3dTransforms');

        this.enabled = fw.computed(function() {
          return this.active.header() || this.active.column() || this.active.corner();
        }, this).broadcastAs('enabled');
        this.currentControl = fw.observable(false).broadcastAs('currentControl');
        this.headerMutable = this.heightMutable.broadcastAs('headerMutable');

        this.containerTop = fw.observable();
        this.containerMarginLeft = fw.observable();

        this.columnMutable = fw.computed(function() {
          return this.paneCollapsed() === false && this.visible();
        }, this);

        this.cornerMutable = fw.computed(function() {
          return this.headerMutable() && this.columnMutable();
        }, this);

        // string/css observables
        this.headerTopOffset = fw.computed(function() {
          return ( this.headerMaxHeight() - this.scrollPosition() ) + 'px';
        }, this);
        this.headerTopPos = fw.computed(function() {
          var pos = '0px';
          if( this.viewPortHas3dTransforms() === false ) {
            pos = this.headerTopOffset();
          }
          return pos;
        }, this);
        this.headerTopTransform = fw.computed(function() {
          var transform = 'none';
          if( this.viewPortHas3dTransforms() === true ) {
            transform = 'translateY(' + this.headerTopOffset() + ')';
          }
          return transform;
        }, this);

        this.columnLeftOffset = fw.computed(function() {
          return ( parseInt(this.columnWidth(), 10) - 10 ) + 'px';
        }, this);

        this.columnLeftPos = fw.computed(function() {
          var pos = '0px';
          if( this.viewPortHas3dTransforms() === false ) {
            pos = this.columnLeftOffset();
          }
          return pos;
        }, this);
        this.columnTransform = fw.computed(function() {
          var transform = 'none';
          if( this.viewPortHas3dTransforms() === true ) {
            transform = 'translateX(' + this.columnLeftOffset() + ')';
          }
          return transform;
        }, this);

        this.cornerTopOffset = fw.computed(function() {
          return ( this.headerMaxHeight() - this.scrollPosition() - 5 ) + 'px';
        }, this);

        this.cornerLeftOffset = fw.computed(function() {
          return ( parseInt(this.columnWidth()) - 15 ) + 'px';
        }, this);

        this.cornerTopPos = fw.computed(function() {
          var pos = '0px';
          if( this.viewPortHas3dTransforms() === false ) {
            pos = this.cornerTopOffset();
          }
          return pos;
        }, this);

        this.cornerLeftPos = fw.computed(function() {
          var pos = '0px';
          if( this.viewPortHas3dTransforms() === false ) {
            pos = this.cornerLeftOffset();
          }
          return pos;
        }, this);

        this.cornerTransform = fw.computed(function() {
          var transform = 'none';
          if( this.viewPortHas3dTransforms() === true ) {
            transform = 'translate3d(' + this.cornerLeftOffset() + ',' + this.cornerTopOffset() + ',0px)';
          }
          return transform;
        }, this);

        // events
        this.mutate = {
          column: function( newMousePos ) {
            var paneMaxWidth = this.paneMaxWidth();
            var paneMinWidth = this.configPaneMinWidth();

            newMousePos.x += this._mouseOffset && this._mouseOffset.left || 0;

            if( newMousePos.x >= paneMaxWidth ) {
              newMousePos.x = (this.defaultPaneMaxWidth() > paneMaxWidth ? this.defaultPaneMaxWidth() : paneMaxWidth);
            }

            if( newMousePos.x < paneMinWidth ) {
              newMousePos.x = paneMinWidth;
            }

            this.configPaneMaxWidth( newMousePos.x );
          }.bind( this ),
          header: function( newMousePos ) {
            var headerMinHeight = this.headerMinHeight();
            var headerLimitHeight = this.headerLimitHeight();

            newMousePos.y += this._mouseOffset && this._mouseOffset.top || 0;

            if( newMousePos.y < headerMinHeight ) {
              newMousePos.y = headerMinHeight;
            } else if( newMousePos.y > headerLimitHeight ) {
              newMousePos.y = headerLimitHeight;
            }
            this.headerMaxHeight( newMousePos.y );
          }.bind( this ),
          corner: function( newMousePos ) {
            this.mutate.column( newMousePos );
            this.mutate.header( newMousePos );
          }.bind( this )
        };

        this.mutateControl = function( event ) {
          this.mutate[ this.currentControl() ]( { x: event.pageX, y: event.pageY } );
        }.bind( this );

        this.enable = function( model, event ) {
          if( this.reflowing() === false ) {
            var handlerControl = event.target.getAttribute("data-control");

            this._mouseOffset = { left: parseInt( this.columnWidth(), 10 ) - event.pageX, top: this.headerMaxHeight() - event.pageY };
            _.each( this.active, function( controlState, controlName ) {
              if( controlName === handlerControl ) {
                controlState( true );
              } else {
                controlState( false );
              }
            });

            this.currentControl( handlerControl );
            this.$globalNamespace.publish( 'enableControl', this.mutateControl );
          }
        }.bind( this );

        this.disable = function() {
          this._mouseOffset = { left: 0, top: 0 };
          _.each( this.active, function( controlState ) {
            controlState(false);
          });
          this.currentControl(false);
          this.$globalNamespace.publish( 'disableControl', this.mutateControl );
        }.bind( this );

        this.$namespace.subscribe( 'disableControl', function() {
          this.disable();
        }).context(this);

        return this;
      }
    });
  }
);