REQUIRE_CONFIG.paths.footwork = "../../dist/footwork-bare-jquery";
require.config(REQUIRE_CONFIG);

require([ "footwork", "jquery", "mockjax" ],
  function( fw, $ ) {
    window.fw = fw;
    if(typeof mochaPhantomJS !== 'undefined') {
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  }
);
