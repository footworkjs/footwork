define([ "jquery", "lodash", "footwork", "jquery.pulse" ],
  function( $, _, fw ) {
    var PageSectionsNamespace = fw.namespace('PageSections');
    var viewPortDimensions = fw.observable().receiveFrom('ViewPort', 'dimensions');
    var headerHeight = fw.observable().receiveFrom('Header', 'height');
    var paneWidth = fw.observable().receiveFrom('Pane', 'width');
    var paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed').extend({ debounce: 200 });
    var chosenSection = fw.observable().receiveFrom('PageSections', 'chosenSection');

    return fw.viewModel({
      namespace: 'PageSection',
      initialize: function(params) {
        var pageSectionData = params.sectionData || {};
        var paneElementsNamespace = this.paneElementsNamespace = fw.namespace('PaneElements');
        var computeAnchorPos;
        var anchorComputeDelay = 100;
        var $anchor = $('#' + (_.isObject(pageSectionData) ? pageSectionData.anchor : ''));
        var $anchorContainer = $('[name=' + pageSectionData.anchor + ']');
        var parentIsCollapsed = function noop() {};
        var anchorOffset = PageSectionsNamespace.request('anchorOffset');
        var PageSection = this;

        var pageBaseURL = '';
        var resetURL = function() {
          if( !this.$globalNamespace.request('isRunningLocally') ) {
            pageBaseURL = window.location.pathname;
          }
          this.anchorAddress(pageBaseURL + '#' + (pageSectionData.anchor || ''));
        }.bind(this);
        this.$namespace.event.handler('resetURL', resetURL);
        this.anchorAddress = fw.observable();
        resetURL();

        this.currentSection = fw.observable().receiveFrom('PageSections', 'currentSection');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.paneIsOverlapping = fw.observable().receiveFrom('Body', 'overlapPane');
        this.subSections = fw.observable( _.isArray(pageSectionData.subSections) ? pageSectionData.subSections : [] );
        this.hasSubSections = fw.computed(function() {
          return this.subSections().length > 0;
        }, this);

        this.visible = fw.observable( null ).extend({ autoEnable: _.random( 200, 600 ) });
        this.title = fw.observable( pageSectionData.title || '' );
        this.hasTitle = fw.computed(function() {
          return _.isString(this.title()) && this.title().length > 0;
        }, this);
        this.anchor = pageSectionData.anchor;
        this.isCollapsable = fw.observable( !!pageSectionData.collapsable );
        this.isCollapsed = fw.observable( !!pageSectionData.isCollapsed );
        this.collapseIcon = fw.computed(function() {
          if( this.isCollapsed() ) {
            return 'icon-chevron-down';
          }
          return 'icon-chevron-up';
        }, this);
        this.active = fw.computed(function() {
          var isActive = this.currentSection() === this.anchor;
          if(isActive) {
            this.isCollapsed(false);
            parentIsCollapsed(false);
          }
          return isActive;
        }, this);

        paneElementsNamespace.subscribe('hideAll', function() {
          this.visible( false );
        }).withContext(this);

        this.toggleCollapse = function(viewModel, event) {
          this.isCollapsed( !this.isCollapsed() );
          if( _.isObject(event) && _.isFunction(event.stopPropagation) ) {
            event.stopPropagation();
          }
          return false;
        };

        this.chooseSection = function() {
          if(this.viewPortLayoutMode() === 'mobile' || this.paneIsOverlapping()) {
            if(!this.paneCollapsed()) {
              paneCollapsed(true);
            }
          }

          chosenSection( '' );
          chosenSection( this.anchor );
          $anchorContainer.pulse({ className: 'active', duration: 1000 });
          return true;
        }.bind(this);

        this.$namespace.request.handler('position', function() {
          var offset = $anchor.offset() || { top: 99999999999 };
          return { anchor: pageSectionData.anchor, position: offset.top };
        }.bind(this));

        this.visible( false );
      }
    });
  }
);