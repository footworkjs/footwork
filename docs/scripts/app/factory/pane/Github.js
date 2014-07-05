define([ "knockout-footwork", "paneArea", "paneEntry" ],
  function( ko, paneArea, paneEntry ) {
    var Entry = ko.viewModel({
      mixins: paneEntry,
      initialize: function(options) {
        var raw;
        this.raw = ko.observable( raw = options.entryData || {} );
        this.type = raw.type;
        this.iconType = 'icon-' + this.type;
        this.html = raw.html;
        this.dateRelative = raw.date_relative;
      }
    });

    return ko.viewModel({
      namespace: 'Github',
      mixins: paneArea,
      params: { Entryinitialize: Entry, url: '/json/githubAPI/page/' },
      initialize: function() {
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