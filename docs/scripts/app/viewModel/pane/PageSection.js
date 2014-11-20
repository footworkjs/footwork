define([ "jquery", "lodash", "footwork", "jquery.pulse" ],
  function( $, _, fw ) {
    var PageSectionCtor = fw.viewModel({
      namespace: 'PageSection',
      initialize: function(pageSectionData, parent) {
        var paneElementsNamespace = this.paneElementsNamespace = fw.namespace('PaneElements');
        var computeAnchorPos;
        var anchorComputeDelay = 100;
        var $anchor = $('#' + (_.isObject(pageSectionData) ? pageSectionData.anchor : ''));
        var $anchorContainer = $('[name=' + pageSectionData.anchor + ']');
        var parentIsCollapsed = function noop() {};
        var anchorOffset = fw.namespace('PageSections').request('anchorOffset');
        var PageSection = this;

        pageSectionData = pageSectionData || {};
        var subSections = ( _.isArray(pageSectionData.subSections) ? pageSectionData.subSections : [] );

        var pageBaseURL = '';
        if( !this.$globalNamespace.request('isRunningLocally') ) {
          pageBaseURL = fw.namespace('BodyRouter').request('currentRoute').url;
        }

        this.currentSection = fw.observable().receiveFrom('PageSections', 'currentSection');
        this.chosenSection = fw.observable().receiveFrom('PageSections', 'chosenSection');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed').extend({ debounce: 200 });
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.paneIsOverlapping = fw.observable().receiveFrom('Body', 'overlapPane');
        this.subSections = fw.observable([]);
        this.hasSubSections = fw.computed(function() {
          return this.subSections().length > 0;
        }, this);

        if( subSections.length ) {
          this.subSections( _.map( $.extend(true, [], subSections), function(subSectionData) {
            return new PageSectionCtor(subSectionData, PageSection);
          }) );
        }

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
        if( _.isObject(parent) && _.isFunction(parent.isCollapsed) ) {
          parentIsCollapsed = parent.isCollapsed;
        }
        this.active = fw.computed(function() {
          var isActive = this.currentSection() === this.anchor;
          if(isActive) {
            this.isCollapsed(false);
            parentIsCollapsed(false);
            if(!_.isUndefined(parent)) {
              fw.namespace('PageSections').command('showAllBefore', parent);
            }
          }
          return isActive;
        }, this);
        this.anchorAddress = fw.computed(function() {
          return pageBaseURL + '#' + this.anchor;
        }, this);

        this.anchorPosition = fw.observable();
        computeAnchorPos = function() {
          clearTimeout(this.computeAnchorTimeout);
          this.computeAnchorTimeout = setTimeout(function() {
            this.anchorPosition( $anchor.offset() );
          }.bind(this), 500);
        }.bind(this);
        computeAnchorPos();

        this.viewPortDimensions = fw.observable().receiveFrom('ViewPort', 'dimensions');
        this.headerHeight = fw.observable().receiveFrom('Header', 'height');
        this.paneWidth = fw.observable().receiveFrom('Pane', 'width');
        this.layoutModeSub = this.viewPortLayoutMode.subscribe( computeAnchorPos );
        this.dimensionSub = this.viewPortDimensions.subscribe( computeAnchorPos );
        this.heightSub = this.headerHeight.subscribe( computeAnchorPos );
        this.widthSub = this.paneWidth.subscribe( computeAnchorPos );
        this.collapsedSub = this.paneCollapsed.subscribe( computeAnchorPos );

        this.$namespace.subscribe('chooseSection', function( sectionName ) {
          sectionName === this.anchor && this.chooseSection();
        }).withContext(this);

        this.$namespace.subscribe('scrollToSection', function( sectionName ) {
          if( sectionName === this.anchor ) {
            this.chooseSection();
            $anchor.length && window.scrollTo( 0, $anchor.offset().top - anchorOffset );
          }
        }).withContext(this);

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
              this.paneCollapsed(true);
            }
          }

          this.chosenSection( '' );
          this.chosenSection( this.anchor );
          $anchorContainer.pulse({ className: 'active', duration: 1000 });
          return true;
        }.bind(this);

        this.dispose = function() {
          _.each(this.subSections(), function(subSection) {
            if( _.isFunction(subSection.dispose) ) {
              subSection.dispose();
            }
          });
          if( _.isFunction(this.__shutdown) ) {
            this.__shutdown();
          }
        };

        this.visible( false );
      }
    });

    return PageSectionCtor;
  }
);