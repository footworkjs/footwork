require.config({
  baseUrl: "./scripts",
  map: {
    "*": {
      "jquery": "noconflict-jquery"
    },
    "noconflict-jquery": {
      "jquery": "jquery"
    }
  },
  paths: {
    "jquery":            "../components/jquery/dist/jquery",
    "postal":            "../components/postal.js/lib/postal",
    "jwerty":            "lib/jwerty", // jwerty does not provide an AMD build, this is a custom wrapped version
    "knockout":          "../components/knockoutjs/dist/knockout",
    "knockout-footwork": "../../dist/footwork-bare",
    "storage":           "../components/store-js/store",
    "lodash":            "../components/lodash/dist/lodash.underscore",
    "history":           "../components/history.js/scripts/bundled/html5/native.history",
    "conduitjs":         "lib/conduit", // ConduitJS currently has a broken UMD wrapper, this is a forked and fixed version
    "jquery.touchy":     "lib/jquery-plugins/jquery.touchy",
    "jquery.pulse":      "lib/jquery-plugins/jquery.pulse",
    "jquery.mousewheel": "lib/jquery-plugins/jquery.mousewheel",
    "jquery.spectrum":   "lib/jquery-plugins/jquery.spectrum",
    "jquery.easing":     "lib/jquery-plugins/jquery.easing",

    "paneEntry":         "app/mixin/paneEntry",
    "paneArea":          "app/mixin/paneArea",
    "koExtenders":       "app/misc/extenders",
    "koBindings":        "app/misc/bindingHandlers",
    "noconflict-jquery": "app/misc/noconflict-jquery",
    "LoadProfile":       "app/helper/LoadProfile",
    "LoadState":         "app/helper/LoadState",
    "PaneDragManager":   "app/factory/PaneDragManager",
    "ViewPort":          "app/factory/ViewPort",
    "Header":            "app/factory/Header",
    "Navigation":        "app/factory/Navigation",
    "Body":              "app/factory/Body",
    "Page":              "app/factory/Page",
    "Pane":              "app/factory/Pane",
    "Footer":            "app/factory/Footer",
    "PaneLinks":         "app/factory/pane/PaneLinks",
    "Github":            "app/factory/pane/Github",
    "Reddit":            "app/factory/pane/Reddit",
    "Twitter":           "app/factory/pane/Twitter",
    "MainMenu":          "app/factory/pane/MainMenu",
    "PageSections":      "app/factory/pane/PageSections",
    "Configuration":     "app/factory/config/Configuration",
    "ConfigManagement":  "app/factory/config/ConfigManagement",
    "LayoutControl":     "app/factory/config/LayoutControl",
    "Themes":            "app/factory/config/Themes"
  },
  waitSeconds: 1500
});

require([
  "jquery", "lodash", "knockout-footwork", "jwerty", "PaneDragManager",
  "Page", "Header", "Body", "Footer", "Navigation", "Pane", "PaneLinks", "MainMenu", "PageSections", "Reddit", "Twitter", "Github", "ViewPort", "Configuration", "ConfigManagement", "Themes", "LayoutControl",
  "koBindings", "koExtenders", "jquery.touchy", "jquery.mousewheel", "jquery.easing" ],
  function(
      $, _, ko, jwerty, PaneDragManager,
      Page, Header, Body, Footer, Navigation, Pane, PaneLinks, MainMenu, PageSections, Reddit, Twitter, Github, ViewPort, Configuration, ConfigManagement, Themes, LayoutControl ) {

    if( window.isCrappyBrowser === true ) {
      return false;
    }

    var $window = $(window),
        $document = $(document),
        $body = $('body'),
        globalNamespace = ko.namespace(),
        pageNamespace = ko.namespace('Page'),
        layoutControlNamespace = ko.namespace('LayoutControl'),
        navigationNamespace = ko.namespace('Navigation'),
        configurationNamespace = ko.namespace('Configuration'),
        bodyNamespace = ko.namespace('Body'),
        pageHashURL = ko.observable().receiveFrom('Page', 'hashURL'),
        bodyHeight = ko.observable().receiveFrom('Body', 'height'),
        scrollPosition = ko.observable().receiveFrom('ViewPort', 'scrollPosition'),
        viewPortDim = ko.observable().receiveFrom('ViewPort', 'dimensions'),
        configVisible = ko.observable().receiveFrom('Configuration', 'visible'),
        paneContentMaxHeight = ko.observable().receiveFrom('Pane', 'contentMaxHeight'),
        paneScrolling = ko.observable().receiveFrom('Pane', 'scrolling'),
        viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode'),
        refreshDocSize,
        models = [];

    ko.debugModels(true);
    window.ko = ko;
    _.each([ { Factory: LayoutControl, target: '.js-layoutControl' },
             { Factory: Configuration, target: '.js-configuration' },
             { Factory: ConfigManagement, target: '.js-configManagement' },
             { Factory: Header, target: '.js-header' },
             { Factory: Body, target: '.js-body' },
             { Factory: Footer, target: '.js-footer' },
             { Factory: Navigation, target: '.js-navigation' },
             { Factory: Pane, target: '.js-pane' },
             { Factory: PaneLinks, target: '.js-paneLinks' },
             { Factory: PageSections, target: '.js-pageSections' },
             { Factory: MainMenu, target: '.js-mainMenu' },
             { Factory: Reddit, target: '.js-reddit' },
             { Factory: Twitter, target: '.js-twitter' },
             { Factory: Github, target: '.js-github' },
             { Factory: ViewPort },
             { Factory: Page },
             { Factory: PaneDragManager, useWhen: function() { return Modernizr.touch === true; } } ],
    function( theModel ) {
      theModel = _.extend({ useWhen: function() { return true; } }, theModel);
      if( theModel.useWhen() === true ) {
        var model = new theModel.Factory({ startup: false });
        _.each($(theModel.target), function( element ) {
          ko.applyBindings( model, element );
        });
        models.push(model);
      }
    });

    $window.scroll( function() {
      scrollPosition( $document.scrollTop() );
    }).resize( function() {
      viewPortDim({ width: $window.width(), height: $window.height() });
    }).on('mouseup', function() {
      layoutControlNamespace.publish('disableControl');
    }).on('hashchange', function() {
      pageHashURL(location.hash);
    }).trigger('scroll').trigger('resize');

    _.invoke( models, 'startup' );

    globalNamespace.subscribe('refreshDocSize', refreshDocSize = function() {
      bodyHeight( $document.height() );
    }).withContext(this);
    refreshDocSize();

    globalNamespace.subscribe( 'enableControl', function( controlHandler ) {
      $window.on( 'mousemove', controlHandler );
    });
    globalNamespace.subscribe( 'disableControl', function( controlHandler ) {
      $window.unbind( 'mousemove', controlHandler );
    });

    window._initMeta = function( metaData ) {
      pageNamespace.publish( 'initMeta', metaData );
    };

    _.each({
      'alt+r': function() { viewPortLayoutMode() !== 'mobile' && configurationNamespace.publish('reset'); },
      'ctrl+x': function() { navigationNamespace.publish('toggleHeader'); },
      'ctrl+z': function() { bodyNamespace.publish('togglePane'); },
      'esc': function() { configVisible( false ); }
    }, function(handler, keyCombo) {
      jwerty.key( keyCombo, handler );
    });

    $body.on('keydown', 'article', function(event) {
      event.stopPropagation();
    }).on('click', 'a.internal', function(event) {
      var $el = $(event.target);
      if( $el.hasClass('internal') === false ) {
        $el = $el.parents('.internal');
      }

      pageNamespace.publish('loadURL', { url: $el.attr('href'), title: $el.data('title') });
      event.preventDefault();
    });

    $('.pane-component > .content').on('mousewheel', function(event, direction) {
      var maxHeight = paneContentMaxHeight();

      if( !isNaN(maxHeight) && maxHeight !== this.scrollHeight && (( this.scrollTop === ( this.scrollHeight - maxHeight ) && direction < 0 ) || ( this.scrollTop === 0 && direction > 0 )) ) {
        event.preventDefault();
        paneScrolling(true);
      }
    });
  }
);