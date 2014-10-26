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
    "router":            "app/router",

    "PaneTouchManager":  "app/viewModel/PaneTouchManager",
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
  "Page", "Body", "ViewPort", "PaneTouchManager",
  "koBindings", "koExtenders", "jquery.mousewheel", "jquery.easing" ],
  function(
      $, _, fw, jwerty, resourceHelper,
      Page, Body, ViewPort, PaneTouchManager ) {

    resourceHelper();

    if( window.isCrappyBrowser === true ) {
      return false;
    }

    var $window = $(window);
    var $document = $(document);
    var $body = $('body');
    var globalNamespace = fw.namespace();
    var layoutControlNamespace = fw.namespace('LayoutControl');
    var navigationNamespace = fw.namespace('Navigation');
    var configurationNamespace = fw.namespace('Configuration');
    var bodyNamespace = fw.namespace('Body');
    var pageHashURL = fw.observable().receiveFrom('Page', 'hashURL');
    var bodyHeight = fw.observable().receiveFrom('Body', 'height');
    var scrollPosition = fw.observable().receiveFrom('ViewPort', 'scrollPosition');
    var viewPortDim = fw.observable().receiveFrom('ViewPort', 'dimensions');
    var configVisible = fw.observable().receiveFrom('Configuration', 'visible');
    var paneContentMaxHeight = fw.observable().receiveFrom('Pane', 'contentMaxHeight');
    var paneScrolling = fw.observable().receiveFrom('Pane', 'scrolling');
    var viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
    var refreshDocSize;
    
    globalNamespace.request.handler('isRunningLocally', function() {
      return _.isNull(window.location.protocol.match('^http'));
    });

    window.ko = fw;

    (new ViewPort());
    (new Page());

    if( Modernizr.touch === true ) {
      (new PaneTouchManager());
    }

    fw.applyBindings( new Body() ); // start the app and apply bindings to the primary body viewModel

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
      'esc': function() { globalNamespace.publish('clear'); configVisible( false ); }
    }, function(handler, keyCombo) {
      jwerty.key( keyCombo, handler );
    });

    $body.on('keydown', 'article', function(event) {
      event.stopPropagation();
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