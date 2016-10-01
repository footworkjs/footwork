var fw = require('../bower_components/knockoutjs/dist/knockout.js');

// Record the footwork version as of this build.
fw.footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
fw.embed = embedded;

// Directly expose the Deferred factory
fw.deferred = Deferred;

fw.viewModel = {};
fw.dataModel = {};
fw.router = {};
fw.outlet = {};
fw.settings = {};
