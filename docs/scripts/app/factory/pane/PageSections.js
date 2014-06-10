define([ "jquery", "lodash", "knockout-footwork", "paneArea", "jquery.pulse" ],
  function( $, _, ko, paneArea ) {
    var PageSection = ko.model({
      namespace: 'PageSection',
      afterCreating: function() {
        this.visible( false );
      },
      factory: function(pageSectionData) {
        var paneElementsNamespace = ko.namespace('PaneElements'),
            computeAnchorPos, anchorComputeDelay = 100;

        pageSectionData = pageSectionData || {};

        this.pageBaseURL = ko.observable().receiveFrom('Page', 'baseURL');
        this.currentSection = ko.observable().receiveFrom('PageSections', 'currentSection');
        this.chosenSection = ko.observable().receiveFrom('PageSections', 'chosenSection');
        this.paneCollapsed = ko.observable().receiveFrom('Pane', 'collapsed');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');

        this.visible = ko.observable( null ).extend({ autoEnable: _.random( 200, 600 ) });
        this.title = ko.observable( pageSectionData.title );
        this.description = ko.observable( pageSectionData.description );
        this.anchor = ko.observable( pageSectionData.anchor );
        this.active = ko.computed(function() {
          return this.currentSection() === this.anchor();
        }, this);
        this.$anchorElement = ko.computed(function() {
          return $( '#' + this.anchor() ).parents('.section');
        }, this);
        this.anchorName = ko.computed(function() {
          return this.$anchorElement().find('a.pilcrow').attr('href').replace('#', '');
        }, this);
        this.anchorAddress = ko.computed(function() {
          return this.pageBaseURL() + '#' + this.anchorName();
        }, this);

        this.anchorPosition = ko.observable();
        computeAnchorPos = function() {
          this.anchorPosition( this.$anchorElement().offset() );
        }.bind(this);
        computeAnchorPos();

        ko.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('ViewPort', 'layoutMode').subscribe( computeAnchorPos );
        ko.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('ViewPort', 'dimensions').subscribe( computeAnchorPos );
        ko.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('Header', 'height').subscribe( computeAnchorPos );
        ko.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('Pane', 'width').subscribe( computeAnchorPos );
        ko.observable().extend({ throttle: anchorComputeDelay + 1000 }).receiveFrom('Pane', 'collapsed').subscribe( computeAnchorPos );

        this.namespace.subscribe('chooseSection', function( sectionName ) {
          sectionName === this.anchor() && this.chooseSection();
        }).withContext(this);

        this.namespace.subscribe('scrollToSection', function( sectionName ) {
          var $anchor;
          if( sectionName === this.anchor() ) {
            this.chooseSection();
            $anchor = this.$anchorElement();
            $anchor.length && window.scrollTo( 0, $anchor.offset().top );
          }
        }).withContext(this);

        paneElementsNamespace.subscribe('hideAll', function() {
          this.visible( false );
        }).withContext(this);

        this.chooseSection = function() {
          var anchorName = this.anchor();
          this.chosenSection( '' );
          this.chosenSection( anchorName );
          $('section[name=' + anchorName + ']').pulse({ className: 'active', duration: 1000 });
          if(this.viewPortLayoutMode() === 'mobile') {
            this.paneCollapsed(true);
          }
          return true;
        }.bind(this);
      }
    });

    return ko.model({
      namespace: 'PageSections',
      mixins: paneArea,
      factory: function() {
        this.visible = ko.observable(false);
        this.description = ko.observable();
        this.initialized = ko.observable(true);
        this.currentSelection = ko.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.paneContentMaxHeight = ko.observable().receiveFrom('Pane', 'contentMaxHeight').extend({ units: 'px' });
        this.defaultPaneSelection = ko.observable().receiveFrom('PaneLinks', 'defaultSelection');
        this.title = ko.observable().receiveFrom('Page', 'shortTitle');
        this.viewPortScrollPos = ko.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');

        this.sections = ko.observable().broadcastAs('sections');
        this.highlightSection = ko.observable().broadcastAs('highlightSection').extend({ autoDisable: 300 });
        this.chosenSection = ko.observable(null).extend({
          write: function( target, sectionName ) {
            target( sectionName );
            this.highlightSection( sectionName );
            this._chosenRead = false;
          }.bind(this)
        }).broadcastAs('chosenSection', true);
        this.hasSections = ko.computed(function() {
          var description = this.description() || '',
              sections = this.sections() || [];
          return sections.length || description.length;
        }, this).broadcastAs('hasSections'),
        this.sectionCount = ko.computed(function() {
          var sections = this.sections() || [];
          return sections.length;
        }, this).broadcastAs('sectionCount');
        this.currentSection = ko.computed(function() {
          var sections = this.sections(),
              scrollPosition = this.viewPortScrollPos(),
              chosenSection = this.chosenSection(),
              chosenRead = this._chosenRead;
          this._chosenRead = true;

          return ( chosenRead !== true && chosenSection ) || _.reduce( sections, function(currentSection, section) {
            if( typeof section.anchorPosition() === 'object' && scrollPosition >= section.anchorPosition().top ) {
              return section.anchor();
            }
            return currentSection;
          }, false );
        }, this).broadcastAs('currentSection');

        this.loadSections = function( sections ) {
          sections = sections || [];
          this.sections( _.reduce( sections, function( sectionArray, sectionData ) {
            sectionArray.push( new PageSection( sectionData ) );
            return sectionArray;
          }, [] ));

          if( this.hasSections() && this.viewPortLayoutMode() !== 'mobile' ) {
            this.currentSelection( this.namespaceName );
          } else {
            this.currentSelection( this.defaultPaneSelection() );
          }
        }.bind(this);

        this.namespace.subscribe('clear', function() {
          this.sections( [] );
        }).withContext(this);

        this.namespace.subscribe('load', function( pageData ) {
          if( pageData ) {
            pageData.description && this.description( pageData.description );
            this.loadSections( pageData.sections );
          }
        }).withContext(this);

        this.currentSelection.subscribe(function( newSelection ) {
          this.visible( newSelection === this.namespaceName );
        }, this);
      }
    });
  }
);