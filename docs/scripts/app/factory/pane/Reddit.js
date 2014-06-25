define([ "jquery", "lodash", "knockout-footwork", "paneArea", "paneEntry" ],
  function( $, _, ko, paneArea, paneEntry ) {
    var Entry = ko.model({
      mixins: paneEntry,
      initialize: function(options) {
        var entryData = options.entryData;

        this.raw = ko.observable( entryData.data );
        this.type = ko.observable(entryData.type);
        this.entryTemplate = ko.computed(function() {
          return 'reddit-' + this.type();
        }, this);
        this.entryIcon = ko.computed(function() {
          return 'icon-' + this.entryTemplate();
        }, this);

        this.upvotes = ko.observable( entryData.data.ups || 0 );
        this.downvotes = ko.observable( entryData.data.downs || 0 );
        this.score = ko.computed(function() {
          return this.raw().score || (this.upvotes() - this.downvotes());
        }, this);
        this.scoreIsNegative = ko.computed(function() {
          return this.score() < 0 ? true : false;
        }, this);
        this.offsetScore = ko.computed(function() {
          return (this.scoreIsNegative() ? '-' : '+') + Math.abs(this.score());
        }, this);

        this.numComments = ko.computed(function() {
          return this.raw().num_comments || -1;
        }, this);
        this.subreddit = ko.computed(function() {
          return '/r/' + this.raw().subreddit;
        }, this);
        this.subredditURL = ko.computed(function() {
          return 'http://reddit.com' + this.subreddit();
        }, this);

        this.thumbnail = ko.observable(entryData.data.thumbnail);

        this.relevantURL = ko.observable(entryData.url); // topic or post url
        this.contextURL = ko.computed(function() {
          var link = '';
          var entry = this.raw();

          if( entry.permalink ) {
            link = 'http://reddit.com' + entry.permalink;
          } else {
            link = 'http://reddit.com' + this.subreddit() + '/comments/' + entry.link_id + '/_/' + entry.id;
          }
          if( this.type() === 'comment' ) {
            link = link + '?context=3';
          }

          return link;
        }, this);

        this.postTitle = ko.computed(function() {
          var entry = this.raw();
          if(entry.link_title.toLowerCase() === 'unknown title') {
            return entry.title;
          }
          return entry.link_title;
        }, this);

        this.postHTML = ko.computed(function() {
          var entry = this.raw();
          return $( '<div/>' ).html( entry.body_html || entry.selftext_html ).text();
        }, this);
      }
    });

    return ko.model({
      namespace: 'Reddit',
      mixins: paneArea,
      params: { Entryinitialize: Entry, url: '/json/redditAPI/page/' }
    });
  }
);