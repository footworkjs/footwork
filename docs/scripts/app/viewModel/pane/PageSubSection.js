define([ "jquery", "lodash", "footwork", "jquery.pulse" ],
  function( $, _, fw ) {
    return fw.viewModel({
      namespace: 'SubSection',
      initialize: function(subSectionData, parent) {
        subSectionData = subSectionData || {};
        var $anchor = $('#' + (_.isObject(subSectionData) ? subSectionData.anchor : ''));
        var $anchorContainer = $('[name=' + subSectionData.anchor + ']');
        var pageBaseURL = '';
        if( !this.$globalNamespace.request('isRunningLocally') ) {
          pageBaseURL = fw.namespace('BodyRouter').request('currentRoute').url;
        }

        this.anchor = subSectionData.anchor;
        this.currentSection = fw.observable().receiveFrom('PageSections', 'currentSection');
        this.chosenSection = fw.observable().receiveFrom('PageSections', 'chosenSection');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.paneIsOverlapping = fw.observable().receiveFrom('Body', 'overlapPane');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed').extend({ debounce: 200 });
        this.title = fw.observable(subSectionData.title);
        this.anchorAddress = fw.observable(pageBaseURL + '#' + (subSectionData.anchor || ''));
        this.active = fw.computed(function() {
          var isActive = this.currentSection() === subSectionData.anchor;
          if(isActive) {
            parent.isCollapsed(false);
          }
          return isActive;
        }, this);

        this.anchorPosition = fw.observable();
        computeAnchorPos = function() {
          this.anchorPosition( $anchor.offset() );
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

        this.chooseSection = function() {
          if(this.viewPortLayoutMode() === 'mobile' || this.paneIsOverlapping()) {
            if(!this.paneCollapsed()) {
              this.paneCollapsed(true);
            }
          }

          this.chosenSection( '' );
          this.chosenSection( subSectionData.anchor );
          $anchorContainer.pulse({ className: 'active', duration: 1000 });
          return true;
        }.bind(this);

        this.dispose = function() {
          this.__shutdown();
        };
      }
    });
  }
);