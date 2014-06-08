define([ "knockout-footwork", "paneArea", "paneEntry" ],
  function( ko, paneArea, paneEntry ) {
    var Entry = ko.model({
      mixins: paneEntry,
      factory: function(options) {
        var raw;
        this.raw = ko.observable( raw = options.entryData || {} );
        this.type = raw.type;
        this.iconType = 'icon-' + this.type;
        this.html = raw.html;
        this.dateRelative = raw.date_relative;
      }
    });

    return ko.model({
      namespace: 'Github',
      mixins: paneArea,
      params: { EntryFactory: Entry, url: '/json/githubAPI/page/' },
      factory: function() {
        this.entryTypes = function() {
          return _.reduce(this.entries(), function(entries, entry) {
            entries.push(entry.raw().type);
            return entries;
          }, []);
        };
      }
    });
  }
);