var oldExploderVersion = 8;
var bindingElement = {
  oldExploderTagName: 'div',
  oldExploderClassName: 'fw-old-browser',
  open: {
    prefix: '<!-- ko ',
    postfix: ' -->'
  },
  close: '<!-- /ko -->'
};

/* istanbul ignore next */
(function checkForOldIE () {
  if (typeof navigator !== 'undefined') {
    var clientNavigator = navigator.userAgent.toLowerCase();
    var exploderVersion = (clientNavigator.indexOf('msie') != -1) ? parseInt(clientNavigator.split('msie')[1]) : (oldExploderVersion + 1);

    if (exploderVersion <= oldExploderVersion) {
      // client is using an older IE, we have to initialize the wrapper with a normal element (ie < 9 doesn't support virtual elements)
      bindingElement.open = {
        prefix: '<' + bindingElement.oldExploderTagName + ' class="' + bindingElement.oldExploderClassName + '" data-bind="',
        postfix: '">'
      };
      bindingElement.close = '</' + bindingElement.oldExploderTagName + '>';
    }
  }
})();

module.exports = bindingElement;
