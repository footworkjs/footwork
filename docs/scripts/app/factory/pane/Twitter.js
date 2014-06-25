define([ "jquery", "lodash", "knockout-footwork", "paneArea", "paneEntry" ],
  function( $, _, ko, paneArea, paneEntry ) {
    var Entry = ko.model({
      mixins: paneEntry,
      initialize: function(options) {
        var entryData = options.entryData || {};
        this.raw = ko.observable( entryData || {} );
        this.html = ko.observable( entryData.html );
      }
    });

    return ko.model({
      namespace: 'Twitter',
      mixins: paneArea,
      initialize: function() {
        this.loadEntries = function() {
          var currentPage = this.currentPage();
          this.currentPage( currentPage + 1 );

          var loadTweetsSuccess = function( entries ) {
            if( entries.length ) {
              this.moreUnavailable( false );

              _.each( entries, function( entryData ) {
                this.entries.push( new Entry({ namespace: this.getNamespaceName(), entryData: entryData }) );
              }.bind(this) );
            } else {
              this.moreUnavailable( true );
            }
          }.bind(this);

          var loadTweets = function() {
            this.loader.watch( $.ajax({
              url: '/json/twitterTimeline/page/' + currentPage,
              dataType: 'json'
            }) ).done( loadTweetsSuccess );
          }.bind(this);

          if( window.__twttrlr === undefined ) {
            $.getScript( 'https://platform.twitter.com/widgets.js', function() {
              loadTweets();
            });
          } else {
            loadTweets();
          }
        }.bind(this);

        this.loader.loading.subscribe(function( loadingState ) {
          if( loadingState === false && window.__twttrlr !== undefined ) {
            setTimeout(function() { window.twttr.widgets.load(); }, 0);
          }
        }, this);
      }
    });
  }
);