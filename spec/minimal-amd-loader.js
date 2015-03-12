require.config({
  paths: {
    "knockout": "../bower_components/knockoutjs/dist/knockout",
    "lodash": "../bower_components/lodash/lodash",
    "postal": "../bower_components/postal.js/lib/postal",
    "footwork": "../dist/footwork-minimal",
  },
  waitSeconds: 1500
});

require([ "footwork" ],
  function( fw ) {
    window.fw = fw;
    if(typeof mochaPhantomJS !== 'undefined') {
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  }
);
