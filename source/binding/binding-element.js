var bindingElement = {
  oldExploderTagName: 'div',
  open: {
    prefix: '<!-- ko ',
    postfix: ' -->'
  },
  close: '<!-- /ko -->'
};

(function checkForOldIE() {
  var clientNavigator = navigator.userAgent.toLowerCase();
  var exploderVersion = (clientNavigator.indexOf('msie') != -1) ? parseInt(clientNavigator.split('msie')[1]) : 10;

  /* istanbul ignore if */
  if(exploderVersion < 9) {
    bindingElement.open = {
      prefix: '<' + bindingElement.oldExploderTagName + ' data-bind="',
      postfix: '">'
    };
  }
})();

module.exports = bindingElement;
