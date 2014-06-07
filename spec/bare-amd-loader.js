require.config({
  paths: {
    "knockout": "../bower_components/knockoutjs/dist/knockout",
    "conduitjs": "../bower_components/conduitjs/lib/conduit",
    "lodash": "../bower_components/lodash/dist/lodash.underscore",
    "riveter": "../bower_components/riveter/lib/riveter",
    "conduitjs": "../bower_components/conduitjs/lib/conduit",
    "postal": "../bower_components/postal.js/lib/postal",
    "apollo": "../bower_components/apollo/dist/apollo",
    "footwork": "../dist/footwork-bare",
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