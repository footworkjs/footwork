define([ "jquery", "lodash", "knockout-footwork", "LoadState" ],
  function( $, _, ko, LoadState ) {
    return {
      _preInit: function() {
        this.currentSelection = ko.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.paneContentMaxHeight = ko.observable().receiveFrom('Pane', 'contentMaxHeight').extend({ units: 'px' });

        this.loader = new LoadState({
          messageStates: {
            busy: 'Loading...',
            ready: 'View more...',
            success: 'View more...',
            fail: 'Error.'
          }
        });

        this.entries = ko.observableArray([]);
        this.currentPage = ko.observable(1);
        this.description = ko.observable();
        this.descriptionVisible = ko.computed(function() {
          return this.description() !== undefined && this.description().length > 0;
        }, this);
        this.moreUnavailable = ko.observable(false);
        this.moreEntriesButtonText = this.loader.message;

        this.loadEntries = function() {
          var currentPage = this.currentPage();
          this.currentPage( currentPage + 1 );

          if(this.$viewModel.configParams.params !== undefined && this.$viewModel.configParams.params.url !== undefined) {
            this.loader
              .watch( $.ajax({ url: this.$viewModelOptions.params.url + currentPage, dataType: 'json' }) )
              .done(function( entries ) {
                if( entries.length ) {
                  var observedEntries = this.entries();
                  this.moreUnavailable( false );
                  _.each( entries, function( entryData ) {
                    observedEntries.push( (new this.$viewModelOptions.params.EntryFactory({ namespace: this.namespace, entryData: entryData })) );
                  }.bind(this) );
                  this.entries.valueHasMutated();
                } else {
                  this.moreUnavailable( true );
                }
              }.bind(this));
          }
        }.bind(this);
        
        this.initialized = ko.computed(function() {
          return !!this.entries().length;
        }, this);

        this.visible = ko.computed(function() {
          if( this.currentSelection() === this.namespaceName ) {
            if( this.entries().length === 0 ) {
              this.loadEntries();
            }
            return true;
          }
          return false;
        }, this);

        this.state = ko.computed(function() {
          return {
            initialized: this.initialized(),
            visible: this.visible(),
            loading: this.loader.loading()
          };
        }, this);
      }
    };
  }
);