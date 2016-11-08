var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var bindingElement = require('../binding/binding-element');
var isEntity = require('../entities/entity-tools').isEntity;
var makeArray = require('../misc/util').makeArray;

// Override the original applyBindings method to provide viewModel/dataModel/router life-cycle events
var originalApplyBindings = fw.applyBindings;
fw.applyBindings = function (viewModelOrBindingContext, rootNode) {
  rootNode = rootNode || window.document.body;

  if (isEntity(viewModelOrBindingContext)) {
    originalApplyBindings(viewModelOrBindingContext, wrapWithLifeCycle(rootNode));
  } else {
    originalApplyBindings(viewModelOrBindingContext, rootNode);
  }
};

/**
 * Wrap the supplied rootNode with the lifecycle binding. This enables footwork to track when
 * the instance is bound to or removed from the dom, triggering its various lifecycle events.
 *
 * @param {string|[DOMNodes]} template
 * @returns {[DOMNodes]} The wrapped component
 */
function wrapWithLifeCycle (rootNode) {
  var wrapper = fw.utils.parseHtmlFragment(bindingElement.open.prefix + '$lifecycle' + bindingElement.open.postfix + bindingElement.close);

  wrapper = [].concat(wrapper[0], makeArray(rootNode.childNodes), wrapper[1]);
  _.each(wrapper, function (node) {
    rootNode.appendChild(node);
  });

  return rootNode;
}
