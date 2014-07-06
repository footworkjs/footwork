define([ "jquery", "lodash", "knockout-footwork", "storage" ],
  function( $, _, ko, storage ) {
    return ko.viewModel({
      namespace: 'Configuration',
      initialize: function() {
        var headerOverallMin = 35,
            setConfig,
            reset,
            writeConfig,
            sessionUpdateTimeout,
            defaultConfig = ko.observable({
              revision: 6,
              header: {
                min: { height: headerOverallMin },
                max: { height: 60 },
                contentMaxHeight: 80,
                limit: { height: 320 },
                borderWidth: 5,
                autoHide: false
              },
              links: {
                min: { width: 155 },
                max: { width: 195 }
              },
              pane: {
                min: { width: 161 },
                max: { width: 340 },
                collapsed: false,
                accentPadding: 20
              },
              dialog: {
                help: true,
                notice: true
              },
              transitions: true
            });

        this.scrollPosition = ko.observable(0).receiveFrom('ViewPort', 'scrollPosition');
        this.headerFixed = ko.observable(false).receiveFrom('Header', 'fixed');
        this.headerClosed = ko.observable(false).receiveFrom('Header', 'closed');
        this.headerMoving = ko.observable(false).receiveFrom('Header', 'moving');
        this.navReflowing = ko.observable(false).receiveFrom('Navigation', 'reflowing');
        this.paneAbsoluteMaxWidth = ko.observable().receiveFrom('Pane', 'maxWidth');
        this.paneAnimate3d = ko.observable().receiveFrom('Pane', 'animate3d');
        this.paneMoving = ko.observable().receiveFrom('Pane', 'moving');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortSmall = ko.observable().receiveFrom('ViewPort', 'isSmall');
        this.currentTheme = ko.observable().receiveFrom('Themes', 'currentTheme');
        this.saveSession = ko.observable( storage.get('saveSession') ).broadcastAs('saveSession', true);

        this.config = ko.observable( ( this.saveSession() === true && storage.get('configuration') ) || $.extend( true, {}, defaultConfig() ) );

        this.savePulse = ko.observable(false).extend({ autoDisable: 1000 }).broadcastAs('savePulse');
        this.throttledConfig = this.config.extend({ throttle: 300 });
        this.throttledConfig.extend({ throttle: 300 }).subscribe(
          writeConfig = function( configuration ) {
            configuration = configuration || this.config();

            if( this.saveSession() === true ) {
              storage.set( 'configuration', configuration );
              this.savePulse(true);
            }
          }.bind(this)
        );

        this.visible = ko.observable( false ).broadcastAs('visible', true);
        this.heightMutable = ko.computed(function() {
          return ( this.visible() && ( !this.headerFixed() || this.scrollPosition() === 0 ) );
        }, this ).broadcastAs('heightMutable');
        this.isMobile = ko.observable( storage.get('viewPortIsMobile') || window.isMobile ).broadcastAs('isMobile', true);
        this.defaultHeaderMaxHeight = ko.computed(function() {
          return defaultConfig().header.max.height;
        }, this ).broadcastAs('defaultHeaderMaxHeight');
        this.defaultPaneMaxWidth = ko.computed(function() {
          return defaultConfig().pane.max.width;
        }, this ).broadcastAs('defaultPaneMaxWidth');
        this.transitionsEnabled = ko.computed({
          read: function() {
            return this.config().transitions;
          },
          write: function( transitionState ) {
            setConfig({ transitions: transitionState });
          }
        }, this ).broadcastAs('transitionsEnabled', true);
        this.headerMinHeight = ko.computed({
          read: function() {
            return this.config().header.min.height;
          },
          write: function( minHeight ) {
            setConfig({ header: { min: { height: minHeight } } });
          }
        }, this ).broadcastAs('headerMinHeight', true);
        this.headerMaxHeight = ko.computed({
          read: function() {
            if( this.viewPortLayoutMode() === 'desktop' || this.viewPortLayoutMode() === 'tablet' ) {
              return this.config().header.max.height;
            } else {
              return this.config().header.min.height;
            }
          },
          write: function( maxHeight ) {
            setConfig({ header: { max: { height: maxHeight } } });
          }
        }, this ).broadcastAs('headerMaxHeight', true);
        this.headerContentMaxHeight = ko.computed({
          read: function() {
            return this.config().header.contentMaxHeight;
          },
          write: function( maxHeight ) {
            setConfig({ header: { contentMaxHeight: maxHeight } });
          }
        }, this ).broadcastAs('headerContentMaxHeight', true);
        this.headerBorderWidth = ko.computed({
          read: function() {
            return this.config().header.borderWidth;
          },
          write: function( borderWidth ) {
            setConfig({ header: { borderWidth: borderWidth } });
          }
        }, this ).broadcastAs('headerBorderWidth', true);
        this.headerLimitHeight = ko.computed({
          read: function() {
            return this.config().header.limit.height;
          },
          write: function( heightLimit ) {
            setConfig({ header: { limit: { height: heightLimit } } });
          }
        }, this ).broadcastAs('headerLimitHeight', true);
        this.paneMinWidth = ko.computed({
          read: function() {
            return this.config().pane.min.width;
          },
          write: function( minWidth ) {
            setConfig({ pane: { min: { width: minWidth } } });
          }
        }, this ).broadcastAs('paneMinWidth', true);
        this.paneMaxWidth = ko.computed({
          read: function() {
            return this.config().pane.max.width;
          },
          write: function( maxWidth ) {
            setConfig({ pane: { max: { width: maxWidth } } });
          }
        }, this ).broadcastAs('paneMaxWidth', true);
        this.paneCollapsed = ko.computed({
          read: function() {
            return this.config().pane.collapsed;
          },
          write: function( collapseState ) {
            if( ((this.navReflowing() === true || this.reflowing() === true) && this.paneAnimate3d() === true) === false ) {
              setConfig({ pane: { collapsed: collapseState } });
            } else {
              this.namespace.publish('paneCollapsed', !collapseState);
            }
          }
        }, this ).broadcastAs('paneCollapsed', true);
        this.paneAccentPadding = ko.computed({
          read: function() {
            return this.config().pane.accentPadding;
          },
          write: function( paddingSize ) {
            setConfig({ pane: { accentPadding: paddingSize } });
          }
        }, this ).broadcastAs('paneAccentPadding', true);
        this.linksMinWidth = ko.computed({
          read: function() {
            return this.config().links.min.width;
          },
          write: function( linksMinWidth ) {
            setConfig({ links: { min: { width: linksMinWidth } } });
          }
        }, this ).broadcastAs('linksMinWidth', true);
        this.linksMaxWidth = ko.computed({
          read: function() {
            return this.config().links.max.width;
          },
          write: function( linksMaxWidth ) {
            setConfig({ links: { min: { width: linksMaxWidth } } });
          }
        }, this ).broadcastAs('linksMaxWidth', true);
        this.helpDialog = ko.computed({
          read: function() {
            return this.config().dialog.help;
          },
          write: function( helpDialogState ) {
            setConfig({ dialog: { help: helpDialogState } });
          }
        }, this ).broadcastAs('helpDialog', true);
        this.noticeDialog = ko.computed({
          read: function() {
            return this.config().dialog.notice;
          },
          write: function( noticeDialogState ) {
            setConfig({ dialog: { notice: noticeDialogState } });
          }
        }, this ).broadcastAs('noticeDialog', true);
        this.autoHideHeader = ko.computed({
          read: function() {
            return this.config().header.autoHide;
          },
          write: function( autoHideState ) {
            setConfig({ header: { autoHide: autoHideState } });
          }
        }, this ).broadcastAs('autoHideHeader', true);
        this.reflowing = ko.observable(false).broadcastAs('reflowing');

        setConfig = this.setConfig = function( mergeObj ) {
          this.config( $.extend( true, {}, this.config(), mergeObj ) );
        }.bind(this);

        this.updateSession = function() {
          clearTimeout(sessionUpdateTimeout);
          if( this.saveSession() === true && typeof this.currentTheme() === 'object' ) {
            sessionUpdateTimeout = setTimeout(function() {
              var session = {},
                  currentTheme = this.currentTheme();

              if( typeof currentTheme === 'object' && currentTheme.params !== undefined ) {
                session.theme = currentTheme.params();
              }
              if( _.size(session) > 0 ) {
                $.post('/session/update', session);
              }
            }.bind(this), 3000);
          }
        }.bind(this);
        this.namespace.subscribe('updateSession', this.updateSession).withContext(this);

        this.namespace.subscribe('reset', reset = function( noReflow ) {
          if( this.navReflowing() === true || this.paneMoving() === true || this.headerMoving() === true ) {
            return false;
          }
          this.headerClosed(false);
          
          var defaultPaneMaxWidth = this.defaultPaneMaxWidth(),
              paneAbsoluteMaxWidth = this.paneAbsoluteMaxWidth(),
              paneMaxWidth = ( this.paneCollapsed() === false ? this.paneMaxWidth() : 0 ),
              start = {
                header: this.headerMaxHeight(),
                pane: (paneAbsoluteMaxWidth < paneMaxWidth ? paneAbsoluteMaxWidth : paneMaxWidth)
              },
              end = {
                header: this.defaultHeaderMaxHeight(),
                pane: (paneAbsoluteMaxWidth < defaultPaneMaxWidth ? paneAbsoluteMaxWidth : defaultPaneMaxWidth)
              },
              preserveValues = {
                header: { max: { height: start.header } },
                pane: { max: { width: start.pane } }
              },
              overwriteConfig = $.extend( true, {}, defaultConfig() );

          if( this.viewPortSmall() || this.viewPortLayoutMode() !== 'desktop' ) {
            end.pane = defaultPaneMaxWidth;
            overwriteConfig.pane.collapsed = this.paneCollapsed();
          }

          setConfig( $.extend( true, {}, overwriteConfig, preserveValues ) );
          this.$viewModel.globalNamespace.publish('configReset');

          this.reflowing(true);
          $(start).animate( end, {
            duration: ( noReflow === true ? 0 : 1000 ),
            specialEasing: {
              header: "easeOutElastic",
              pane: "easeOutElastic"
            },
            step: function(currentVal, tween) {
              if( tween.prop === 'header' ) {
                this.headerMaxHeight( parseInt( currentVal, 10 ) );
              } else {
                this.paneMaxWidth( parseInt( currentVal, 10 ) );
              }
            }.bind(this),
            complete: function() {
              this.paneMaxWidth( defaultPaneMaxWidth );
              this.reflowing(false);
            }.bind(this)
          });
        }.bind(this));

        this.configVersionCheck = ko.computed(function() {
          if( ( this.config().revision || 0 ) !== defaultConfig().revision ) {
            reset( true );
          }
        }, this );

        this.isMobile.subscribe(function( mobileState ) {
          storage.set( 'viewPortIsMobile', mobileState );
        }, this);

        this.saveSession.subscribe(function( saveSessionState ) {
          storage.set( 'saveSession', saveSessionState );
          if( saveSessionState ) {
            writeConfig();
            this.updateSession();
          }
        }, this);

        return this;
      }
    });
  }
);