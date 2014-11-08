define([ "jquery", "lodash", "footwork", "jquery.pulse" ],
  function( $, _, fw ) {
    var anchorOffset;

    var PageSection = fw.viewModel({
      namespace: 'PageSection',
      initialize: function(pageSectionData) {
        var paneElementsNamespace = fw.namespace('PaneElements');
        var computeAnchorPos, anchorComputeDelay = 100;

        pageSectionData = pageSectionData || {};

        var pageBaseURL = '';
        if( !this.$globalNamespace.request('isRunningLocally') ) {
          pageBaseURL = fw.namespace('BodyRouter').request('currentRoute').url;
        }
        this.currentSection = fw.observable().receiveFrom('PageSections', 'currentSection');
        this.chosenSection = fw.observable().receiveFrom('PageSections', 'chosenSection');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed').extend({ debounce: 200 });
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');

        this.visible = fw.observable( null ).extend({ autoEnable: _.random( 200, 600 ) });
        this.title = fw.observable( pageSectionData.title );
        this.description = fw.observable( pageSectionData.description );
        this.anchor = fw.observable( pageSectionData.anchor );
        this.active = fw.computed(function() {
          return this.currentSection() === this.anchor();
        }, this);
        this.anchorAddress = fw.computed(function() {
          return pageBaseURL + '#' + this.anchor();
        }, this);

        this.anchorPosition = fw.observable();
        computeAnchorPos = function() {
          this.anchorPosition( $( '#' + this.anchor() ).offset() );
        }.bind(this);
        computeAnchorPos();

        fw.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('ViewPort', 'layoutMode').subscribe( computeAnchorPos );
        fw.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('ViewPort', 'dimensions').subscribe( computeAnchorPos );
        fw.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('Header', 'height').subscribe( computeAnchorPos );
        fw.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('Pane', 'width').subscribe( computeAnchorPos );
        fw.observable().extend({ throttle: anchorComputeDelay + 1000 }).receiveFrom('Configuration', 'paneCollapsed').subscribe( computeAnchorPos );

        this.$namespace.subscribe('chooseSection', function( sectionName ) {
          sectionName === this.anchor() && this.chooseSection();
        }).withContext(this);

        this.$namespace.subscribe('scrollToSection', function( sectionName ) {
          var $anchor;
          if( sectionName === this.anchor() ) {
            this.chooseSection();
            $anchor = $( '#' + this.anchor() );
            $anchor.length && window.scrollTo( 0, $anchor.offset().top - anchorOffset );
          }
        }).withContext(this);

        paneElementsNamespace.subscribe('hideAll', function() {
          this.visible( false );
        }).withContext(this);

        this.goToSection = function(anchorName) {
          this.chosenSection( '' );
          this.chosenSection( anchorName );
          $('[name=' + anchorName + ']').pulse({ className: 'active', duration: 1000 });
        };

        this.chooseSection = function() {
          if(this.viewPortLayoutMode() === 'mobile') {
            if(!this.paneCollapsed()) {
              this.goToSection( this.anchor() );
              this.paneCollapsed(true);
            }
          } else {
            this.goToSection( this.anchor() );
          }
          return true;
        }.bind(this);

        this.visible( false );
      }
    });

    return fw.viewModel({
      namespace: 'PageSections',
      afterBinding: function() {
        this.checkSelection();
      },
      initialize: function() {
        var isInitialLoad = true;

        this.visible = fw.observable(false);
        this.description = fw.observable();
        this.hasDescription = fw.computed(function() {
          var description = this.description();
          return _.isString(description) && description.length;
        }, this);
        this.initialized = fw.observable(true);
        this.currentSelection = fw.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.paneContentMaxHeight = fw.observable().receiveFrom('Pane', 'contentMaxHeight').extend({ units: 'px' });
        this.defaultPaneSelection = fw.observable().receiveFrom('PaneLinks', 'defaultSelection');
        this.title = fw.observable();
        this.viewPortScrollPos = fw.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.headerVisibleHeight = fw.observable().receiveFrom('Header','visibleHeight');

        this.sections = fw.observable().broadcastAs('sections');
        this.highlightSection = fw.observable().broadcastAs('highlightSection').extend({ autoDisable: 300 });
        this.chosenSection = fw.observable(null).extend({
          write: function( target, sectionName ) {
            target( sectionName );
            this.highlightSection( sectionName );
            this._chosenRead = false;
          }.bind(this)
        }).broadcastAs('chosenSection', true);
        this.hasSections = fw.computed(function() {
          var description = this.description() || '';
          var sections = this.sections() || [];
          return sections.length || description.length;
        }, this).broadcastAs('hasSections'),
        this.sectionCount = fw.computed(function() {
          var sections = this.sections() || [];
          return sections.length;
        }, this).broadcastAs('sectionCount');
        this.currentSection = fw.computed(function() {
          var sections = this.sections();
          var scrollPosition = this.viewPortScrollPos();
          var chosenSection = this.chosenSection();
          var chosenRead = this._chosenRead;
          this._chosenRead = true;

          return ( chosenRead !== true && chosenSection ) || _.reduce( sections, function(currentSection, section) {
            if( _.isObject(section.anchorPosition()) && scrollPosition >= (section.anchorPosition().top - anchorOffset) ) {
              return section.anchor();
            }
            return currentSection;
          }.bind(this), false );
        }, this).broadcastAs('currentSection');

        this.loadSections = function( sections ) {
          sections = sections || [];
          this.sections( _.reduce( sections, function( sectionArray, sectionData ) {
            sectionArray.push( new PageSection( sectionData ) );
            return sectionArray;
          }, [] ));

          if( this.hasSections() && this.viewPortLayoutMode() !== 'mobile' ) {
            this.currentSelection( this.getNamespaceName() );
          } else {
            this.currentSelection( this.defaultPaneSelection() );
          }
        }.bind(this);

        this.$namespace.subscribe('clear', function() {
          this.sections( [] );
        }).withContext(this);

        var loadMetaData = function( pageData ) {
          if( pageData ) {
            anchorOffset = pageData.anchorOffset || 0;
            pageData.title && this.title(pageData.title);
            pageData.description && this.description(pageData.description);
            this.loadSections(pageData.sections);
            if(isInitialLoad) {
              isInitialLoad = false;
              fw.namespace('PageSection').publish( 'scrollToSection', fw.namespace('BodyRouter').request('urlParts').anchor );
            }
          }
        }.bind(this);
        loadMetaData( fw.namespace('Page').request('metaData') );
        this.$namespace.subscribe('pageMetaData', loadMetaData).withContext(this);

        this.checkSelection = function(newSelection) {
          newSelection = newSelection || this.currentSelection();
          this.visible( newSelection === this.getNamespaceName() );
        };
        this.currentSelection.subscribe(this.checkSelection, this);
      }
    });
  }
);