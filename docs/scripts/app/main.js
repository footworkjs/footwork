require.config({
  baseUrl: "/scripts",
  map: {
    "*": {
      "jquery": "noconflict-jquery"
    },
    "noconflict-jquery": {
      "jquery": "jquery"
    }
  },
  paths: {
    "jquery":            "../bower_components/jquery/dist/jquery",
    "postal":            "../bower_components/postal.js/lib/postal",
    "conduitjs":         "../bower_components/conduitjs/lib/conduit",
    "knockout":          "../bower_components/knockoutjs/dist/knockout",
    "footwork":          "../bower_components/footwork/dist/footwork-bare",
    "storage":           "../bower_components/store-js/store",
    "lodash":            "../bower_components/lodash/dist/lodash.underscore",
    "history":           "../bower_components/history.js/scripts/bundled/html5/native.history",
    "jquery.touchy":     "../bower_components/touchy/jquery.touchy",
    "jquery.spectrum":   "../bower_components/spectrum/spectrum",
    "jwerty":            "lib/jwerty", // jwerty does not provide an AMD build, this is a custom wrapped version
    "jquery.pulse":      "lib/jquery-plugins/jquery.pulse",
    "jquery.mousewheel": "lib/jquery-plugins/jquery.mousewheel",
    "jquery.easing":     "lib/jquery-plugins/jquery.easing",

    "paneEntry":         "app/mixin/paneEntry",
    "paneArea":          "app/mixin/paneArea",
    "koExtenders":       "app/misc/extenders",
    "koBindings":        "app/misc/bindingHandlers",
    "noconflict-jquery": "app/misc/noconflict-jquery",
    "LoadProfile":       "app/helper/LoadProfile",
    "LoadState":         "app/helper/LoadState",
    "resourceHelper":    "app/helper/resourceHelper",

    "Footer":            "app/viewModel/Footer",
    "PaneDragManager":   "app/viewModel/PaneDragManager",
    "ViewPort":          "app/viewModel/ViewPort",
    "Header":            "app/viewModel/Header",
    "Navigation":        "app/viewModel/Navigation",
    "Body":              "app/viewModel/Body",
    "Page":              "app/viewModel/Page"
  },
  waitSeconds: 1500
});

require([
  "jquery", "lodash", "footwork", "jwerty", "resourceHelper",
  "Page", "Body", "ViewPort",
  "koBindings", "koExtenders", "jquery.touchy", "jquery.mousewheel", "jquery.easing" ],
  function(
      $, _, ko, jwerty, resourceHelper,
      Page, Body, ViewPort ) {

    resourceHelper();

    if( window.isCrappyBrowser === true ) {
      return false;
    }

    var $window = $(window);
    var $document = $(document);
    var $body = $('body');
    var globalNamespace = ko.namespace();
    var pageNamespace = ko.namespace('Page');
    var layoutControlNamespace = ko.namespace('LayoutControl');
    var navigationNamespace = ko.namespace('Navigation');
    var configurationNamespace = ko.namespace('Configuration');
    var bodyNamespace = ko.namespace('Body');
    var pageHashURL = ko.observable().receiveFrom('Page', 'hashURL');
    var bodyHeight = ko.observable().receiveFrom('Body', 'height');
    var scrollPosition = ko.observable().receiveFrom('ViewPort', 'scrollPosition');
    var viewPortDim = ko.observable().receiveFrom('ViewPort', 'dimensions');
    var configVisible = ko.observable().receiveFrom('Configuration', 'visible');
    var paneContentMaxHeight = ko.observable().receiveFrom('Pane', 'contentMaxHeight');
    var paneScrolling = ko.observable().receiveFrom('Pane', 'scrolling');
    var viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
    var refreshDocSize;

    window.ko = ko;
    window._initMeta = function( metaData ) {
      pageNamespace.publish( 'initMeta', metaData );
    };

    (new ViewPort());
    (new Page());

    if( Modernizr.touch === true ) {
      require( ['PaneDragManager'], function(PaneDragManager) {
        (new PaneDragManager());
      });
    }

    ko.applyBindings( new Body() );

    $window.scroll( function() {
      scrollPosition( $document.scrollTop() );
    }).resize( function() {
      viewPortDim({ width: $window.width(), height: $window.height() });
    }).on('mouseup', function() {
      layoutControlNamespace.publish('disableControl');
    }).on('hashchange', function() {
      pageHashURL(location.hash);
    }).trigger('scroll').trigger('resize');

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