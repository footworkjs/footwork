require.config({
  paths: {
    "knockout": "../bower_components/knockoutjs/dist/knockout",
    "lodash": "../bower_components/lodash/dist/lodash.underscore",
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