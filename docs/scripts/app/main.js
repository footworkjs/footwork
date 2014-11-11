require([
  "jquery", "lodash", "footwork", "jwerty", "resourceHelper",
  "Page", "Body", "ViewPort", "PaneTouchManager",
  "koBindings", "koExtenders", "jquery.easing" ],
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

    window.fw = fw;

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
  }
);