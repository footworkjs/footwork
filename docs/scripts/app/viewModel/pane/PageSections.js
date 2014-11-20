define([ "jquery", "lodash", "footwork", "PageSection" ],
  function( $, _, fw, PageSection ) {
    return fw.viewModel({
      namespace: 'PageSections',
      afterBinding: function() {
        this.checkSelection();
      },
      initialize: function() {
        var isInitialLoad = true;
        var PageSections = this;
        var pageSectionNamespace = this.pageSectionNamespace = fw.namespace('PageSection');
        var bodyRouterNamespace = this.bodyRouterNamespace = fw.namespace('BodyRouter');
        var anchorOffset = 0;

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
            var theAnchor = currentSection;

            if( _.isObject(section.anchorPosition()) && scrollPosition >= (section.anchorPosition().top - anchorOffset) ) {
              theAnchor = section.anchor;
            }

            if( section.subSections().length ) {
              // have to search through sub-sections as well
              theAnchor = _.reduce( section.subSections(), function(currentSection, section) {
                if( _.isFunction(section.anchorPosition) && _.isObject(section.anchorPosition()) && scrollPosition >= (section.anchorPosition().top - anchorOffset) ) {
                  currentSection = section.anchor;
                }
                return currentSection;
              }, theAnchor);
            }

            return theAnchor;
          }.bind(this), false );
        }, this).broadcastAs('currentSection');

        function clearSections() {
          _.each(PageSections.sections(), function(section) {
            section.dispose();
          });
          PageSections.sections([]);
        }

        this.loadSections = function( sections ) {
          sections = sections || [];
          clearSections();
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
          clearSections();
        }).withContext(this);

        var loadMetaData = function( pageData ) {
          if( pageData ) {
            anchorOffset = pageData.anchorOffset || 0;
            pageData.title && this.title(pageData.title);
            pageData.description && this.description(pageData.description);
            this.loadSections(pageData.sections);
            if(isInitialLoad) {
              isInitialLoad = false;
              pageSectionNamespace.publish( 'scrollToSection', bodyRouterNamespace.request('urlParts').anchor );
            }
          }
        }.bind(this);
        loadMetaData( fw.namespace('Page').request('metaData') );

        this.$namespace.request.handler('anchorOffset', function() {
          return anchorOffset;
        });

        this.$namespace.subscribe('pageMetaData', loadMetaData).withContext(this);

        this.$namespace.command.handler('showAllBefore', function(shownSection) {
          var foundSection = false;
          _.each(this.sections(), function(section) {
            if(!foundSection && section !== shownSection) {
              section.isCollapsed(false);
            } else {
              foundSection = true;
            }
          });
        }.bind(this));

        this.checkSelection = function(newSelection) {
          newSelection = newSelection || this.currentSelection();
          this.visible( newSelection === this.getNamespaceName() );
        };
        this.currentSelSub = this.currentSelection.subscribe(this.checkSelection, this);
      }
    });
  }
);