define(['lodash', 'footwork', 'jquery'],
  function(_, fw, $) {
    /**
     * Create the overall test container/frame you see when viewing the test runner in a browser.
     */
    $(document.body).append('<div id="tests">\
      <div id="test-title">\
        <a href="http://footworkjs.com" target="_blank"><img src="/base/dist/gh-footwork-logo.png"></a>\
        <span class="version">footwork v' + fw.footworkVersion + '</span>\
        <div class="results">\
          <div class="passed result"><span class="icon icon-thumbs-up"></span>Passed: <span class="display">0</span></div>\
          <div class="failed result"><span class="icon icon-bug"></span>Failed: <span class="display">0</span></div>\
          <div class="pending result"><span class="icon icon-clock-o"></span>Pending: <span class="display">0</span></div>\
        </div>\
      </div>\
      <div id="test-output"></div>\
    </div>\
    <div class="information"><a href="http://footworkjs.com">footworkjs.com</a> - A solid footing for web applications.</div>');
  }
);
