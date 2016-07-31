/**
 * Helper which makes a new DOM node that we can use to put our test fixture into. Once created it is inserted into the DOM and returned.
 * @param  {mixed} theFixture The fixture
 * @return {DOMNode}          The generated DOM node container
 */
function makeTestContainer(theFixture) {
  var $container = $('<div/>');

  $container.append(theFixture);
  $(document.body).append($container);

  return $container.get(0);
}

var fw;
var $;
var _;
require(['footwork', 'lodash', 'jquery', 'jquery-mockjax'], function(footwork, lodash, jQuery) {
  fw = footwork;
  $ = jQuery;
  _ = lodash;

  _.extend($.mockjaxSettings, {
    logging: false,
    responseTime: 5
  });
});

var _fixtureCleanup = fixture.cleanup;
fixture.cleanup = function(container) {
  typeof container === 'object' && fw.removeNode(container);
  _fixtureCleanup.call(fixture);
};
