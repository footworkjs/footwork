define([ "jquery", "lodash", "footwork", "LoadState" ],
  function( $, _, fw, LoadState ) {
    return {
      _preInit: function() {
        this.currentSelection = fw.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.paneContentMaxHeight = fw.observable().receiveFrom('Pane', 'contentMaxHeight').extend({ units: 'px' });

        this.loader = new LoadState({
          messageStates: {
            busy: 'Loading...',
            ready: 'View more...',
            success: 'View more...',
            fail: 'Error.'
          }
        });

        this.entries = fw.observableArray([]);
        this.currentPage = fw.observable(1);
        this.description = fw.observable();
        this.moreUnavailable = fw.observable(false);
        this.moreEntriesButtonText = this.loader.message;
        this.initialized = fw.computed(function() {
          return !!this.entries().length;
        }, this);

        this.loadEntries = function() {
          var currentPage = this.currentPage();
          this.currentPage( currentPage + 1 );

          if( !_.isUndefined(this.$params) && !_.isUndefined(this.$params.url) ) {
            this.loader
              .watch( $.ajax({ url: this.$params.url + currentPage, dataType: 'json' }) )
              .done(function( entries ) {
                if( entries.length ) {
                  var observedEntries = this.entries();
                  this.moreUnavailable( false );
                  _.each( entries, function( entryData ) {
                    observedEntries.push( (new this.$params.EntryInitialize({ namespace: this.$namespace, entryData: entryData })) );
                  }.bind(this) );
                  this.entries.valueHasMutated();
                } else {
                  this.moreUnavailable( true );
                }
              }.bind(this));
          }
        }.bind(this);

        this.visible = fw.computed(function() {
          if( this.currentSelection() === this.getNamespaceName() ) {
            if( this.entries().length === 0 ) {
              this.loadEntries();
            }
            return true;
          }
          return false;
        }, this);

        this.state = fw.computed(function() {
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