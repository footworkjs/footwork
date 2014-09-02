define([ "jquery", "lodash", "footwork", "jquery.pulse" ],
  function( $, _, ko ) {
    var PageSection = ko.viewModel({
      namespace: 'PageSection',
      afterInit: function() {
        this.visible( false );
      },
      initialize: function(pageSectionData) {
        var paneElementsNamespace = ko.namespace('PaneElements');
        var computeAnchorPos, anchorComputeDelay = 100;

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
        this.anchorAddress = ko.computed(function() {
          return this.pageBaseURL() + '#' + this.anchor();
        }, this);

        this.anchorPosition = ko.observable();
        computeAnchorPos = function() {
          this.anchorPosition( $( '[name=' + this.anchor() + ']' ).offset() );
        }.bind(this);
        computeAnchorPos();

        ko.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('ViewPort', 'layoutMode').subscribe( computeAnchorPos );
        ko.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('ViewPort', 'dimensions').subscribe( computeAnchorPos );
        ko.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('Header', 'height').subscribe( computeAnchorPos );
        ko.observable().extend({ throttle: anchorComputeDelay }).receiveFrom('Pane', 'width').subscribe( computeAnchorPos );
        ko.observable().extend({ throttle: anchorComputeDelay + 1000 }).receiveFrom('Pane', 'collapsed').subscribe( computeAnchorPos );

        this.$namespace.subscribe('chooseSection', function( sectionName ) {
          sectionName === this.anchor() && this.chooseSection();
        }).withContext(this);

        this.$namespace.subscribe('scrollToSection', function( sectionName ) {
          var $anchor;
          if( sectionName === this.anchor() ) {
            this.chooseSection();
            $anchor = $( '[name=' + this.anchor() + ']' );
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

    return ko.viewModel({
      namespace: 'PageSections',
      afterInit: function() {
        this.checkSelection();
      },
      initialize: function() {
        this.visible = ko.observable(false);
        this.description = ko.observable();
        this.initialized = ko.observable(true);
        this.currentSelection = ko.observable().receiveFrom('PaneLinks', 'currentSelection');
        this._paneContentMaxHeight = ko.observable().receiveFrom('Pane', 'contentMaxHeight');
        this.paneContentMaxHeight = this._paneContentMaxHeight.extend({ units: 'px' });
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
          var description = this.description() || '';
          var sections = this.sections() || [];
          return sections.length || description.length;
        }, this).broadcastAs('hasSections'),
        this.sectionCount = ko.computed(function() {
          var sections = this.sections() || [];
          return sections.length;
        }, this).broadcastAs('sectionCount');
        this.currentSection = ko.computed(function() {
          var sections = this.sections();
          var scrollPosition = this.viewPortScrollPos();
          var chosenSection = this.chosenSection();
          var chosenRead = this._chosenRead;
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
            pageData.description && this.description( pageData.description );
            this.loadSections( pageData.sections );
          }
        }.bind(this);
        loadMetaData( ko.namespace('Page').request('metaData') );
        this.$namespace.subscribe('loadMetaData', loadMetaData).withContext(this);

        this.checkSelection = function(newSelection) {
          newSelection = newSelection || this.currentSelection();
          this.visible( newSelection === this.getNamespaceName() );
        };
        this.currentSelection.subscribe(this.checkSelection, this);
      }
    });
  }
);