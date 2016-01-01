REQUIRE_CONFIG.paths.footwork = "../../build/footwork-bare-jquery";
require.config(REQUIRE_CONFIG);

require([ "footwork", "jquery", "mockjax" ],
  function( fw, $ ) {
    window.fw = fw;
    $.mockjaxSettings.log = function noop() {};

    if(typeof mochaPhantomJS !== 'undefined') {
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  }
);
