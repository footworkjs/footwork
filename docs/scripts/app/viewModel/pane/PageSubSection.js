define([ "jquery", "lodash", "footwork", "jquery.pulse" ],
  function( $, _, fw ) {
    var BodyRouterNamespace = fw.namespace('BodyRouter');
    var globalNamespace = fw.namespace();

    var paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
    var viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
    var paneIsOverlapping = fw.observable().receiveFrom('Body', 'overlapPane');
    var chosenSection = fw.observable().receiveFrom('PageSections', 'chosenSection');

    var PageSectionsNamespace = fw.namespace('PageSections');
    window.continue = true;
    window.run = function() {
      PageSectionsNamespace.publish('pageMetaData', {"title":"viewModel","description":"viewModel declaration, instantiation, and binding.","sections":[{"anchor":"introduction","title":"Introduction","subSections":[{"anchor":"configuration","title":"Configuration"},{"anchor":"initialization","title":"Initialization / Usage"},{"anchor":"loading-registering","title":"AMD / Lazy Loading / Registering"},{"anchor":"module-formats","title":"Module Formats"}]},{"anchor":"mixins","title":"Mixins","subSections":[{"anchor":"mixin-configuration","title":"Configuration"},{"anchor":"mixin-usage","title":"Usage"}]},{"anchor":"misc","title":"Utility / Misc","collapsable":true,"isCollapsed":true,"subSections":[{"anchor":"getAll","title":"fw.viewModels.getAll()"},{"anchor":"isRegistered","title":"fw.viewModels.isRegistered()"},{"anchor":"getRegistered","title":"fw.viewModels.getRegistered()"},{"anchor":"getResourceLocation","title":"fw.viewModels.getResourceLocation()"},{"anchor":"getFileName","title":"fw.viewModels.getFileName()"},{"anchor":"fileExtensions","title":"fw.viewModels.fileExtensions()"}]}]});
      if(window.continue === true) {
        setTimeout(run, 600);
      }
    };

    return fw.viewModel({
      namespace: 'PageSubSection',
      initialize: function(params) {
        var subSectionData = params.sectionData;
        var parent = params.parent;
        var $anchorContainer = $('[name=' + subSectionData.anchor + ']');
        var $anchor = $('#' + (_.isObject(subSectionData) ? subSectionData.anchor : ''));
        
        var pageBaseURL = '';
        if( !globalNamespace.request('isRunningLocally') ) {
          pageBaseURL = BodyRouterNamespace.request('currentRoute').url;
        }

        this.anchorAddress = fw.observable(pageBaseURL + '#' + (subSectionData.anchor || ''));
        this.currentSection = fw.observable().receiveFrom('PageSections', 'currentSection');
        this.title = subSectionData.title;
        this.active = fw.computed(function() {
          var isActive = this.currentSection() === subSectionData.anchor;
          if(isActive) {
            parent.isCollapsed(false);
          }
          return isActive;
        }, this);

        this.chooseSection = function() {
          if(viewPortLayoutMode() === 'mobile' || paneIsOverlapping()) {
            if(!paneCollapsed()) {
              paneCollapsed(true);
            }
          }

          chosenSection( '' );
          chosenSection( subSectionData.anchor );
          $anchorContainer.pulse({ className: 'active', duration: 1000 });
          return true;
        }.bind(this);

        this.$namespace.request.handler('position', function() {
          return { anchor: subSectionData.anchor, position: $anchor.offset().top };
        }.bind(this));
      }
    });
  }
);