define([ "jquery", "lodash", "footwork", "storage" ],
  function( $, _, fw, storage ) {
    return fw.viewModel({
      namespace: 'Configuration',
      initialize: function() {
        var headerOverallMin = 35;
        var setConfig;
        var reset;
        var writeConfig;
        var sessionUpdateTimeout;
        var defaultConfig = fw.observable({
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
            collapsed: (fw.namespace('ViewPort').request('layoutMode') === 'mobile'),
            accentPadding: 20
          },
          dialog: {
            help: true,
            notice: true
          },
          transitions: true
        });

        this.scrollPosition = fw.observable(0).receiveFrom('ViewPort', 'scrollPosition');
        this.headerFixed = fw.observable(false).receiveFrom('Header', 'fixed');
        this.headerClosed = fw.observable(false).receiveFrom('Header', 'closed');
        this.headerMoving = fw.observable(false).receiveFrom('Header', 'moving');
        this.navReflowing = fw.observable(false).receiveFrom('Navigation', 'reflowing');
        this.paneAbsoluteMaxWidth = fw.observable().receiveFrom('Pane', 'maxWidth');
        this.paneAnimate3d = fw.observable().receiveFrom('Pane', 'animate3d');
        this.paneMoving = fw.observable().receiveFrom('Pane', 'moving');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortSmall = fw.observable().receiveFrom('ViewPort', 'isSmall');
        this.currentTheme = fw.observable().receiveFrom('Themes', 'currentTheme');
        this.saveSession = fw.observable( storage.get('saveSession') ).broadcastAs('saveSession', true);

        this.config = fw.observable( ( this.saveSession() === true && storage.get('configuration') ) || $.extend( true, {}, defaultConfig() ) );

        this.savePulse = fw.observable(false).extend({ autoDisable: 1000 }).broadcastAs('savePulse');
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

        this.initialized = fw.observable(false).broadcastAs('initialized');
        this.visible = fw.observable(false).broadcastAs('visible', true);
        this.heightMutable = fw.computed(function() {
          return ( this.visible() && ( !this.headerFixed() || this.scrollPosition() === 0 ) );
        }, this ).broadcastAs('heightMutable');
        this.isMobile = fw.observable( storage.get('viewPortIsMobile') || window.isMobile ).broadcastAs('isMobile', true);
        this.mobileWidthCutoff = fw.observable(515).broadcastAs('mobileWidthCutoff');
        this.defaultHeaderMaxHeight = fw.computed(function() {
          return defaultConfig().header.max.height;
        }, this ).broadcastAs('defaultHeaderMaxHeight');
        this.defaultPaneMaxWidth = fw.computed(function() {
          return defaultConfig().pane.max.width;
        }, this ).broadcastAs('defaultPaneMaxWidth');
        this.transitionsEnabled = fw.computed({
          read: function() {
            return this.config().transitions;
          },
          write: function( transitionState ) {
            setConfig({ transitions: transitionState });
          }
        }, this ).broadcastAs('transitionsEnabled', true);
        this.headerMinHeight = fw.computed({
          read: function() {
            return this.config().header.min.height;
          },
          write: function( minHeight ) {
            setConfig({ header: { min: { height: minHeight } } });
          }
        }, this ).broadcastAs('headerMinHeight', true);
        this.headerMaxHeight = fw.computed({
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
        this.headerContentMaxHeight = fw.computed({
          read: function() {
            return this.config().header.contentMaxHeight;
          },
          write: function( maxHeight ) {
            setConfig({ header: { contentMaxHeight: maxHeight } });
          }
        }, this ).broadcastAs('headerContentMaxHeight', true);
        this.headerBorderWidth = fw.computed({
          read: function() {
            return this.config().header.borderWidth;
          },
          write: function( borderWidth ) {
            setConfig({ header: { borderWidth: borderWidth } });
          }
        }, this ).broadcastAs('headerBorderWidth', true);
        this.headerLimitHeight = fw.computed({
          read: function() {
            return this.config().header.limit.height;
          },
          write: function( heightLimit ) {
            setConfig({ header: { limit: { height: heightLimit } } });
          }
        }, this ).broadcastAs('headerLimitHeight', true);
        this.paneMinWidth = fw.computed({
          read: function() {
            return this.config().pane.min.width;
          },
          write: function( minWidth ) {
            setConfig({ pane: { min: { width: minWidth } } });
          }
        }, this ).broadcastAs('paneMinWidth', true);
        this.paneMaxWidth = fw.computed({
          read: function() {
            return this.config().pane.max.width;
          },
          write: function( maxWidth ) {
            setConfig({ pane: { max: { width: maxWidth } } });
          }
        }, this ).broadcastAs('paneMaxWidth', true);
        this.paneCollapsed = fw.computed({
          read: function() {
            return this.config().pane.collapsed;
          },
          write: function( collapseState ) {
            if( ((this.navReflowing() === true || this.reflowing() === true) && this.paneAnimate3d() === true) === false ) {
              setConfig({ pane: { collapsed: collapseState } });
            } else {
              this.$namespace.publish('paneCollapsed', !collapseState);
            }
          }
        }, this ).broadcastAs('paneCollapsed', true);
        this.paneAccentPadding = fw.computed({
          read: function() {
            return this.config().pane.accentPadding;
          },
          write: function( paddingSize ) {
            setConfig({ pane: { accentPadding: paddingSize } });
          }
        }, this ).broadcastAs('paneAccentPadding', true);
        this.linksMinWidth = fw.computed({
          read: function() {
            return this.config().links.min.width;
          },
          write: function( linksMinWidth ) {
            setConfig({ links: { min: { width: linksMinWidth } } });
          }
        }, this ).broadcastAs('linksMinWidth', true);
        this.linksMaxWidth = fw.computed({
          read: function() {
            return this.config().links.max.width;
          },
          write: function( linksMaxWidth ) {
            setConfig({ links: { min: { width: linksMaxWidth } } });
          }
        }, this ).broadcastAs('linksMaxWidth', true);
        this.helpDialog = fw.computed({
          read: function() {
            return this.config().dialog.help;
          },
          write: function( helpDialogState ) {
            setConfig({ dialog: { help: helpDialogState } });
          }
        }, this ).broadcastAs('helpDialog', true);
        this.noticeDialog = fw.computed({
          read: function() {
            return this.config().dialog.notice;
          },
          write: function( noticeDialogState ) {
            setConfig({ dialog: { notice: noticeDialogState } });
          }
        }, this ).broadcastAs('noticeDialog', true);
        this.autoHideHeader = fw.computed({
          read: function() {
            return this.config().header.autoHide;
          },
          write: function( autoHideState ) {
            setConfig({ header: { autoHide: autoHideState } });
          }
        }, this ).broadcastAs('autoHideHeader', true);
        this.reflowing = fw.observable(false).broadcastAs('reflowing');

        setConfig = this.setConfig = function( mergeObj ) {
          this.config( $.extend( true, {}, this.config(), mergeObj ) );
        }.bind(this);

        this.updateSession = function() {
          clearTimeout(sessionUpdateTimeout);
          if( this.saveSession() === true && typeof this.currentTheme() === 'object' ) {
            sessionUpdateTimeout = setTimeout(function() {
              var session = {},
                  currentTheme = this.currentTheme();

              if( typeof currentTheme === 'object' && !_.isUndefined(currentTheme.params) ) {
                session.theme = currentTheme.params();
              }
              if( _.size(session) > 0 ) {
                $.post('/session/update', session);
              }
            }.bind(this), 3000);
          }
        }.bind(this);
        this.$namespace.subscribe('updateSession', this.updateSession).context(this);

        this.$namespace.subscribe('reset', reset = function( noReflow ) {
          if( this.navReflowing() === true || this.paneMoving() === true || this.headerMoving() === true ) {
            return false;
          }
          this.headerClosed(false);
          
          var defaultPaneMaxWidth = this.defaultPaneMaxWidth();
          var paneAbsoluteMaxWidth = this.paneAbsoluteMaxWidth();
          var paneMaxWidth = ( this.paneCollapsed() === false ? this.paneMaxWidth() : 0 );
          var start = {
            header: this.headerMaxHeight(),
            pane: (paneAbsoluteMaxWidth < paneMaxWidth ? paneAbsoluteMaxWidth : paneMaxWidth)
          };
          var end = {
            header: this.defaultHeaderMaxHeight(),
            pane: (paneAbsoluteMaxWidth < defaultPaneMaxWidth ? paneAbsoluteMaxWidth : defaultPaneMaxWidth)
          };
          var preserveValues = {
            header: { max: { height: start.header } },
            pane: { max: { width: start.pane } }
          };
          var overwriteConfig = $.extend( true, {}, defaultConfig() );

          if( this.viewPortSmall() || this.viewPortLayoutMode() !== 'desktop' ) {
            end.pane = defaultPaneMaxWidth;
            overwriteConfig.pane.collapsed = this.paneCollapsed();
          }

          setConfig( $.extend( true, {}, overwriteConfig, preserveValues ) );
          this.$globalNamespace.publish('configReset');

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

        this.configVersionCheck = fw.computed(function() {
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
        
        if( this.isMobile() === true || this.viewPortSmall() === true) {
          this.paneCollapsed(true);
        }
        this.initialized(true);

        return this;
      }
    });
  }
);