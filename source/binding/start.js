var fw = require('knockout');

// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function (targetElement) {
  targetElement = targetElement || window.document.body;
  fw.applyBindings({}, targetElement);
};
