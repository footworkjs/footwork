define([ "knockout-footwork", "lodash" ],
  function( ko, _ ) {
    return ko.viewModel({
      namespace: 'LayoutControl',
      initialize: function() {
        this.active = {
          header: ko.observable(),
          column: ko.observable(),
          corner: ko.observable()
        };

        this.config = {
          defaultPaneMaxWidth: ko.observable().receiveFrom('Configuration', 'defaultPaneMaxWidth'),
          transitionsEnabled: ko.observable().receiveFrom('Configuration', 'transitionsEnabled'),
          headerMinHeight: ko.observable().receiveFrom('Configuration', 'headerMinHeight'),
          headerMaxHeight: ko.observable().receiveFrom('Configuration', 'headerMaxHeight'),
          paneMinWidth: ko.observable().receiveFrom('Configuration', 'paneMinWidth'),
          paneMaxWidth: ko.observable().receiveFrom('Configuration', 'paneMaxWidth'),
          headerLimitHeight: ko.observable().receiveFrom('Configuration', 'headerLimitHeight'),
          heightMutable: ko.observable().receiveFrom('Configuration', 'heightMutable'),
          reflowing: ko.observable().receiveFrom('Configuration', 'reflowing')
        };
        this.visible = ko.observable(false).receiveFrom('Configuration', 'visible');
        this.visibleHeaderHeight = ko.observable(0).receiveFrom('Header', 'visibleHeight');
        this.paneCollapsed = ko.observable(0).receiveFrom('Pane', 'collapsed');
        this.columnWidth = ko.observable(0).receiveFrom('Pane', 'columnWidth');
        this.paneMaxWidth = ko.observable(0).receiveFrom('Pane', 'maxWidth');
        this.scrollPosition = ko.observable(false).receiveFrom('ViewPort', 'scrollPosition');
        this.viewPortHas3dTransforms = ko.observable(false).receiveFrom('ViewPort', 'has3dTransforms');

        this.enabled = ko.computed(function() {
          return this.active.header() || this.active.column() || this.active.corner();
        }, this).broadcastAs('enabled');
        this.currentControl = ko.observable(false).broadcastAs('currentControl');
        this.headerMutable = this.config.heightMutable.broadcastAs('headerMutable');

        this.containerTop = ko.observable();
        this.containerMarginLeft = ko.observable();

        this.columnMutable = ko.computed(function() {
          return this.paneCollapsed() === false && this.visible();
        }, this);

        this.cornerMutable = ko.computed(function() {
          return this.headerMutable() && this.columnMutable();
        }, this);

        // string/css observables
        this.headerTopOffset = ko.computed(function() {
          return ( this.config.headerMaxHeight() - this.scrollPosition() ) + 'px';
        }, this);
        this.headerTopPos = ko.computed(function() {
          var pos = '0px';
          if( this.viewPortHas3dTransforms() === false ) {
            pos = this.headerTopOffset();
          }
          return pos;
        }, this);
        this.headerTopTransform = ko.computed(function() {
          var transform = 'none';
          if( this.viewPortHas3dTransforms() === true ) {
            transform = 'translateY(' + this.headerTopOffset() + ')';
          }
          return transform;
        }, this);

        this.columnLeftOffset = ko.computed(function() {
          return ( parseInt(this.columnWidth(), 10) - 10 ) + 'px';
        }, this);

        this.columnLeftPos = ko.computed(function() {
          var pos = '0px';
          if( this.viewPortHas3dTransforms() === false ) {
            pos = this.columnLeftOffset();
          }
          return pos;
        }, this);
        this.columnTransform = ko.computed(function() {
          var transform = 'none';
          if( this.viewPortHas3dTransforms() === true ) {
            transform = 'translateX(' + this.columnLeftOffset() + ')';
          }
          return transform;
        }, this);

        this.cornerTopOffset = ko.computed(function() {
          return ( this.config.headerMaxHeight() - this.scrollPosition() - 5 ) + 'px';
        }, this);

        this.cornerLeftOffset = ko.computed(function() {
          return ( parseInt(this.columnWidth()) - 15 ) + 'px';
        }, this);

        this.cornerTopPos = ko.computed(function() {
          var pos = '0px';
          if( this.viewPortHas3dTransforms() === false ) {
            pos = this.cornerTopOffset();
          }
          return pos;
        }, this);

        this.cornerLeftPos = ko.computed(function() {
          var pos = '0px';
          if( this.viewPortHas3dTransforms() === false ) {
            pos = this.cornerLeftOffset();
          }
          return pos;
        }, this);

        this.cornerTransform = ko.computed(function() {
          var transform = 'none';
          if( this.viewPortHas3dTransforms() === true ) {
            transform = 'translate3d(' + this.cornerLeftOffset() + ',' + this.cornerTopOffset() + ',0px)';
          }
          return transform;
        }, this);

        // events
        this.mutate = {
          column: function( newMousePos ) {
            var paneMaxWidth = this.paneMaxWidth(),
                paneMinWidth = this.config.paneMinWidth();

            newMousePos.x += this._mouseOffset && this._mouseOffset.left || 0;

            if( newMousePos.x >= paneMaxWidth ) {
              newMousePos.x = (this.config.defaultPaneMaxWidth() > paneMaxWidth ? this.config.defaultPaneMaxWidth() : paneMaxWidth);
            }

            if( newMousePos.x < paneMinWidth ) {
              newMousePos.x = paneMinWidth;
            }

            this.config.paneMaxWidth( newMousePos.x );
          }.bind( this ),
          header: function( newMousePos ) {
            var headerMinHeight = this.config.headerMinHeight(),
                headerLimitHeight = this.config.headerLimitHeight();

            newMousePos.y += this._mouseOffset && this._mouseOffset.top || 0;

            if( newMousePos.y < headerMinHeight ) {
              newMousePos.y = headerMinHeight;
            } else if( newMousePos.y > headerLimitHeight ) {
              newMousePos.y = headerLimitHeight;
            }
            this.config.headerMaxHeight( newMousePos.y );
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
          if( this.config.reflowing() === false ) {
            var handlerControl = event.target.getAttribute("data-control");

            this._mouseOffset = { left: parseInt( this.columnWidth(), 10 ) - event.pageX, top: this.config.headerMaxHeight() - event.pageY };
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
        }).withContext(this);

        return this;
      }
    });
  }
);