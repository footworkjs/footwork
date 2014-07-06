define([ "require", "jquery", "lodash", "knockout-footwork", "LoadState" ],
  function( require, $, _, ko, LoadState ) {
    var themes,
        $head = $('head'),
        $chosenStyle,
        themePicker = {},
        disableModifiedCheck = false,
        lessMapping = {
          'bodyBG': '@body-bg-color',
          'headerBG': '@header-bg',
          'paneBG': '@pane-bg-color',
          'controlsBG': '@controls-bg'
        },
        configurationNamespace = ko.namespace('Configuration'),
        themesNamespace = ko.namespace('Themes'),
        processingLESS = ko.observable().extend({ throttle: { timeout: 50, when: function(isProcessing) { return isProcessing === false; } } }),
        updateLESSTimeout,
        updateLESS = function() {
          if( window.less !== undefined ) {
            clearTimeout(updateLESSTimeout);
            processingLESS(true);
            updateLESSTimeout = setTimeout(function() {
              less.modifyVars( _.reduce(lessMapping, function(lessParams, lessParamName, paramName) {
                lessParams[lessParamName] = themes.customizedTheme[ paramName ]();
                return lessParams;
              }, {}) );
              
              $('style[id="less:css-style"]')[0].disabled = false;
              if($chosenStyle !== undefined) {
                $chosenStyle[0].disabled = true
              };
              processingLESS(false);
              if( disableModifiedCheck !== true ) {
                themesNamespace.publish('modified');
              }
              disableModifiedCheck = false;
            }, 100);
          }
        };

    var Theme = ko.viewModel({
      namespace: 'Theme',
      initialize: function(options) {
        var colorHexFilter = /[^a-f0-9]/gi;
        options = options || {};

        this.themeParams = {
          bodyBG: ko.observable(),
          paneBG: ko.observable(),
          headerBG: ko.observable(),
          controlsBG: ko.observable()
        };
        _.each(this.themeParams, function(param) {
          if( options.updateLESS === true ) {
            param.subscribe(function() {
              updateLESS();
            }, this);
          }
        }.bind(this));
        _.extend( this, this.themeParams );

        if( options.updateLESS === true ) {
          this.sync = function() {
            _.each(this.themeParams, function(param, paramName) {
              if( _.isEmpty(themePicker) === false && themePicker[paramName] !== undefined ) {
                themePicker[paramName].spectrum('set', param());
              }
            });
          };
        }

        this.currentTheme = ko.observable().receiveFrom('Themes', 'currentTheme')

        this.importParams = function( themeParams ) {
          var jThemeParams = JSON.stringify( _.filter(themeParams, function(color, field) {
            return lessMapping[field] !== undefined;
          }) );
          if( jThemeParams !== this._lastParamsLoad ) {
            processingLESS(true);
            _.each( this.themeParams, function(param, paramName) {
              if( themeParams[paramName] !== undefined ) {
                param( '#' + themeParams[paramName].replace(colorHexFilter, '') );
              }
            }.bind(this));
          }
          this._lastParamsLoad = jThemeParams;
        };
        this.importParams(options);

        this.active = ko.computed(function() {
          return this.currentTheme() === this;
        }, this);

        this.choose = function() {
          this.currentTheme(this);
        };

        this.params = function() {
          return _.reduce(this.themeParams, function(params, param, paramName) {
            params[paramName] = param().replace(colorHexFilter, '');
            return params;
          }, {});
        };

        this.filePartial = ko.computed(function() {
          return _.reduce( this.params(), function(fileName, param) {
            return fileName + (fileName.length ? '-' : '') + '#' + param;
          }, '');
        }, this);

        _.invoke( this._receive, 'refresh' );
      }
    });

    return ko.viewModel({
      namespace: 'Themes',
      afterBinding: function() {
        this.currentTheme( new Theme(window.theme) );
      },
      initialize: function() {
        themes = this;

        this.config = {
          visible: ko.observable().receiveFrom('Configuration', 'visible')
        };
        this.scrollPosition = ko.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.paneWidth = ko.observable().receiveFrom('Pane', 'width');
        this.visibleHeaderHeight = ko.observable().receiveFrom('Header', 'visibleHeight');
        this.currentTheme = ko.observable().broadcastAs('currentTheme', true);
        this.viewPortTheme = ko.observable();
        this.currentTab = ko.observable('choose');
        this.currentThemes = ko.observableArray();
        this.loading = ko.observable();
        this.loader = new LoadState({
          exportState: this.loading,
          watchState: processingLESS,
          messageStates: {
            busy: function() {
              if( this.currentTab() === 'customize' ) {
                if( this._initializingCustomize === true ) {
                  return 'Loading runtime compiler...';
                }
                return 'Compiling theme...';
              }
              return 'Loading...';
            }.bind(this),
            success: function() {
              if( this.currentTab() === 'customize' ) {
                return 'Theme compiled...';
              }
              return 'Loaded...';
            }.bind(this),
            fail: function() {
              if( this._initializingCustomize === true ) {
                return 'Could not load LESS runtime.';
              }
              return 'Error.';
            }
          }
        });
        this.customizedTheme = new Theme({
          bodyBG: window.theme.bodyBG,
          controlsBG: window.theme.controlsBG,
          headerBG: window.theme.headerBG,
          paneBG: window.theme.paneBG,
          updateLESS: true
        });
        this.customizeAssetsLoaded = ko.observable(false);
        this.customizeModified = ko.observable(false);
        this.namespace.subscribe('modified', function() { this.customizeModified(true); }).withContext(this);

        this.setVisible = function(data, event) {
          if( this.loading() === false ) {
            this.currentTab( $(event.target).data('tab') );
          }
        };

        this.useTheme = function() {
          var newTheme;
          this.currentThemes.push( newTheme = new Theme( this.customizedTheme.params() ) );
          this.currentTheme( newTheme );
          this.customizeModified(false);
        };

        this.chooseVisible = ko.computed(function() {
          return this.currentTab() === 'choose';
        }, this);

        this.customizeVisible = ko.computed(function() {
          var currentTab = this.currentTab(),
              state = false;

          if( currentTab === 'customize' ) {
            if( $.fn.spectrum === undefined ) {
              this._initializingCustomize = true;
              this.loader.setState('busy');
              require(["jquery.spectrum"], function() {
                var $spectrumCSS,
                    $colorPickers = $('.js-theme-color-input');
                $head.append( $spectrumCSS = $('<link rel="stylesheet" type="text/css" href="css/lib/spectrum.css" />') );
                $head.append( $('<link rel="stylesheet/less" type="text/css" href="css/style.less" />') );
                $spectrumCSS.load(function() {
                  _.each($colorPickers, function(picker) {
                    var themePropName,
                        $picker = themePicker[ themePropName = $(picker).data('theme-property') ] = $(picker);
                    $picker.spectrum({
                      positioning: 'fixed',
                      showInitial: true,
                      showInput: true,
                      hide: function() {
                        $picker.spectrum('position', false);
                      },
                      change: function(color) {
                        this.customizedTheme[ themePropName ]( color.toHexString() );
                      }.bind(this)
                    }).on('dragstop.spectrum', function(event, color) {
                      color = color.toHexString();
                      $picker.spectrum('set', color);
                      this.customizedTheme[ themePropName ](color);
                    }.bind(this));
                  }.bind(this));

                  this.customizedTheme.sync();
                  this.customizeAssetsLoaded(true);

                  this.visibleHeaderHeight.subscribe(function() { $colorPickers.spectrum('hide'); });
                  this.paneWidth.subscribe(function() { $colorPickers.spectrum('hide'); });
                  this.$viewModel.globalNamespace.subscribe('enableControl', function() { $colorPickers.spectrum('hide'); });
                  configurationNamespace.subscribe('reset', function() { $colorPickers.spectrum('hide'); });
                  this.config.visible.subscribe(function(state) { state === false && $colorPickers.spectrum('hide'); });

                  $.getScript('/scripts/lib/less.js')
                    .fail(function() { this.loader.setState('fail') })
                    .done(function() {
                        var currentTheme = this.currentTheme(),
                            themeParams;
                        if( typeof currentTheme === 'object' ) {
                          themeParams = currentTheme.params();
                        }
                        disableModifiedCheck = true;
                        this.customizedTheme.importParams(themeParams || window.theme, true);
                        this._initializingCustomize = false;
                        this.loader.setState();
                        updateLESS();
                      }.bind(this));
                  }.bind(this));
              }.bind(this), function() { this.loader.setState('fail'); });
            } else {
              this.customizedTheme.importParams( this.currentTheme().params() );
              this.customizedTheme.sync();
            }
            state = true;
          }

          return state;
        }, this);

        var defaultStylesheet = $('#default-style').get(0),
            $favicon = $('link[rel=icon]');

        this.currentTheme.subscribe(function(theme) {
          if( this.config.visible() === true ) {
            var filePartial = encodeURIComponent(theme.filePartial()),
                stylesheetURL = 'css/builds/build-' + filePartial + '.css',
                faviconURL = 'images/icon-builds/favicon-' + filePartial + '.png';
            $chosenStyle = $('<link rel="stylesheet" type="text/css" href="' + stylesheetURL + '" />');

            processingLESS(true);
            $chosenStyle.load(function() {
              if(this._chosenStyle !== undefined) {
                this._chosenStyle.remove();
              }
              this._chosenStyle = $chosenStyle;
              $chosenStyle.attr('id', 'chosen-style');
              defaultStylesheet.disabled = true;
              configurationNamespace.publish('updateSession');
              processingLESS(false);
            }.bind(this));
            $head.append($chosenStyle);
            $favicon.attr('href', faviconURL);
          }
        }, this);

        this.config.visible.subscribe(function(visible) {
          if( visible === true && this.currentThemes().length === 0 ) {
            this.loader.watch( $.getJSON('/theme/listAll') ).done( function( themes ) {
              var currentThemes = this.currentThemes();
              _.each(themes, function( themeParams ) {
                var theme = new Theme( themeParams );
                currentThemes.push( theme );
                if( JSON.stringify(theme.params()) === JSON.stringify(window.theme) ) {
                  this.currentTheme( theme );
                }
              }.bind(this));
              this.currentThemes.valueHasMutated();
            }.bind(this) );
          }
        }, this);

        this.chooseColor = function(model, event) {
          var $target = $(event.target),
              propName = $target.data('theme-property');
          setTimeout(function() {
            themePicker[propName].spectrum('toggle').spectrum('position', { left: event.clientX, top: event.clientY + themes.scrollPosition() });
          }.bind(this), 0);
        };

        return this;

      }
    });
  }
);