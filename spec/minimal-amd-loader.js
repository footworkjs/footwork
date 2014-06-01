require.config({
  paths: {
    "underscore": "../bower_components/lodash/dist/lodash.underscore",
    "knockout": "../bower_components/knockoutjs/dist/knockout",
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