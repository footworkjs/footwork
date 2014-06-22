require.config({
  paths: {
    "knockout": "../bower_components/knockoutjs/dist/knockout",
    "lodash": "../bower_components/lodash/dist/lodash.underscore",
    "postal": "../bower_components/postal.js/lib/postal",
    "conduitjs": "../bower_components/conduitjs/lib/conduit",
    "delegate": "../bower_components/delegate.js/delegate",
    "matches": "../bower_components/matches.js/matches",
    "Apollo": "../bower_components/apollo/dist/apollo",
    "Q": "../bower_components/q/q",
    "footwork": "../dist/footwork-minimal",
  },
  waitSeconds: 1500
});

require([ "footwork" ],
  function( ko ) {
    window.ko = ko;
    if(typeof mochaPhantomJS !== 'undefined') {
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  }
);