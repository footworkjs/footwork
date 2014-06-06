require.config({
  paths: {
    "underscore": "../bower_components/lodash/dist/lodash.underscore",
    "knockout": "../bower_components/knockoutjs/dist/knockout",
    "conduitjs": "../bower_components/conduitjs/lib/conduit",
    "underscore": "../bower_components/lodash/dist/lodash.underscore",
    "riveter": "../bower_components/riveter/lib/riveter",
    "postal": "../bower_components/postal.js/lib/postal",
    "footwork": "../dist/footwork-minimal-amd",
  },
  waitSeconds: 1500
});

require([ "footwork" ],
  function( ko ) {
    window.ko = ko;
    
    mocha.globals(['ko']);
    mocha.checkLeaks();
    if(typeof mochaPhantomJS !== 'undefined') {
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  }
);