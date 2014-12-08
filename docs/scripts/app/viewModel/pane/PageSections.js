define([ "jquery", "lodash", "footwork" ],
  function( $, _, fw ) {
    var pageNamespace = fw.namespace('Page');
    var currentSelection = fw.observable().receiveFrom('PaneLinks', 'currentSelection');
    var pageSectionNamespace = fw.namespace('PageSection');
    var pageSubSectionNamespace = fw.namespace('PageSubSection');
    var bodyRouterNamespace = fw.namespace('BodyRouter');
    var defaultPaneSelection = fw.observable().receiveFrom('PaneLinks', 'defaultSelection');
    var viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
    var headerHeight = fw.observable().receiveFrom('Header', 'height');
    var viewPortDimensions = fw.observable().receiveFrom('ViewPort', 'dimensions');
    var paneWidth = fw.observable().receiveFrom('Pane', 'width');
    var paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');

    var anchorPositions = fw.observable([]);
    var computeAnchorDelay;
    function computeAnchorPos() {
      clearTimeout(computeAnchorDelay);
      computeAnchorDelay = setTimeout(function() {
        var positions = [];
        var sectionPositions = pageSectionNamespace.request('position', null, true);
        var subSectionPositions = pageSubSectionNamespace.request('position', null, true);

        if(!_.isUndefined(sectionPositions) && sectionPositions.length) {
          positions = positions.concat(sectionPositions);
        }
        if(!_.isUndefined(subSectionPositions) && subSectionPositions.length) {
          positions = positions.concat(subSectionPositions);
        }

        anchorPositions( _.sortBy(positions, function(section) {
          return section.position;
        }) );
      }, 500);
    };
    this.layoutModeSub = viewPortLayoutMode.subscribe( computeAnchorPos );
    this.dimensionSub = viewPortDimensions.subscribe( computeAnchorPos );
    this.heightSub = headerHeight.subscribe( computeAnchorPos );
    this.widthSub = paneWidth.subscribe( computeAnchorPos );
    this.collapsedSub = paneCollapsed.subscribe( computeAnchorPos );

    return fw.viewModel({
      namespace: 'PageSections',
      afterBinding: function() {
        this.checkSelection();
      },
      initialize: function() {
        var isInitialLoad = true;
        var goToSection = null;
        var PageSections = this;
        var anchorOffset = 0;

        this.visible = fw.observable(false);
        this.description = fw.observable();
        this.hasDescription = fw.computed(function() {
          var description = this.description();
          return _.isString(description) && description.length;
        }, this);
        this.title = fw.observable();
        this.viewPortScrollPos = fw.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.paneContentMaxHeight = fw.observable().receiveFrom('Pane', 'contentMaxHeight').extend({ units: 'px' });

        this.sections = fw.observable();
        this.chosenSection = fw.observable(null).extend({
          write: function( target, sectionName ) {
            target( sectionName );
            this._chosenRead = false;
          }.bind(this)
        }).broadcastAs('chosenSection', true);
        this.hasSections = fw.observable(function() {
          var description = this.description() || '';
          var sections = this.sections() || [];
          return sections.length || description.length;
        }, this).broadcastAs('hasSections');
        this.currentSection = fw.computed(function() {
          var sections = this.sections();
          var scrollPosition = this.viewPortScrollPos();
          var chosenSection = this.chosenSection();
          var chosenRead = this._chosenRead;
          this._chosenRead = true;
          
          return ( chosenRead !== true && chosenSection ) ||  _.reduce( anchorPositions(), function(currentSection, section) {
            var theAnchor = currentSection;
            if( scrollPosition >= (section.position - anchorOffset - 3) ) {
              theAnchor = section.anchor;
            }
            return theAnchor;
          }.bind(this), false );
        }, this).broadcastAs('currentSection');

        this.loadSections = function( sections ) {
          sections = sections || [];
          this.sections(sections);
          computeAnchorPos();

          if( this.hasSections() && viewPortLayoutMode() !== 'mobile' ) {
            currentSelection( this.getNamespaceName() );
          } else {
            currentSelection( defaultPaneSelection() );
          }
        }.bind(this);

        var loadMetaData = function( pageData ) {
          if( pageData ) {
            anchorOffset = pageData.anchorOffset || 0;
            pageData.title && this.title(pageData.title);
            this.description(pageData.description);
            this.loadSections(pageData.sections);
          }
        }.bind(this);
        loadMetaData( pageNamespace.request('metaData') );
        this.anchorSub = anchorPositions.subscribe(function(anchorPosition) {
          if(isInitialLoad || _.isString(goToSection)) {
            isInitialLoad = false;
            goToSection = null;
            _.each(anchorPosition, function(anchorPos) {
              if( anchorPos.anchor ===  window.location.hash.substring(1) ) {
                window.scrollTo( 0, anchorPos.position - anchorOffset );
              }
            });
          }
        });

        this.$namespace.command.handler('goToSection', function(sectionAnchor) {
          goToSection = sectionAnchor;
        });
        this.$namespace.subscribe('pageMetaData', loadMetaData).context(this);

        this.checkSelection = function(newSelection) {
          newSelection = newSelection || currentSelection();
          this.visible( newSelection === this.getNamespaceName() );
        };
        this.currentSelSub = currentSelection.subscribe(this.checkSelection, this);
      }
    });
  }
);