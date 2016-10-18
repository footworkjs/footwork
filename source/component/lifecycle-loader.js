var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var internalComponents = require('./internal-components');

var util = require('../misc/util');
var isDocumentFragment = util.isDocumentFragment;
var isDomElement = util.isDomElement;

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift(fw.components.lifecycleLoader = {
  loadTemplate: function(componentName, templateConfig, callback) {
    if (!internalComponents.isInternalComponent(componentName)) {
      if (typeof templateConfig === 'string') {
        // Markup - parse it
        callback(wrapWithLifeCycle(templateConfig));
      } else if (templateConfig instanceof Array) {
        // Assume already an array of DOM nodes
        callback(wrapWithLifeCycle(templateConfig));
      } else if (isDocumentFragment(templateConfig)) {
        // Document fragment - use its child nodes
        callback(wrapWithLifeCycle(fw.utils.makeArray(templateConfig.childNodes)));
      } else if (templateConfig['element']) {
        var element = templateConfig['element'];
        if (isDomElement(element)) {
          // Element instance - copy its child nodes
          callback(wrapWithLifeCycle(cloneNodesFromTemplateSourceElement(element)));
        } else if (typeof element === 'string') {
          // Element ID - find it, then copy its child nodes
          var elemInstance = document.getElementById(element);
          if (elemInstance) {
            callback(wrapWithLifeCycle(cloneNodesFromTemplateSourceElement(elemInstance)));
          } else {
            errorCallback('Cannot find element with ID ' + element);
          }
        } else {
          errorCallback('Unknown element type: ' + element);
        }
      } else {
        throw new Error('Unhandled config type: ' + typeof templateConfig + '.');
      }
    } else {
      callback(null);
    }
  }
});

/**
 * Clone and return the nodes from the source element.
 *
 * @param {DOMNode} elemInstance
 * @returns {[DOMNodes]} The cloned DOM nodes
 */
function cloneNodesFromTemplateSourceElement(elemInstance) {
  switch (fw.utils.tagNameLower(elemInstance)) {
    case 'script':
      return fw.utils.parseHtmlFragment(elemInstance.text);
    case 'textarea':
      return fw.utils.parseHtmlFragment(elemInstance.value);
    case 'template':
      // For browsers with proper <template> element support (i.e., where the .content property
      // gives a document fragment), use that document fragment.
      if (isDocumentFragment(elemInstance.content)) {
        return fw.utils.cloneNodes(elemInstance.content.childNodes);
      }
  }

  // Regular elements such as <div>, and <template> elements on old browsers that don't really
  // understand <template> and just treat it as a regular container
  return fw.utils.cloneNodes(elemInstance.childNodes);
}

/**
 * Wrap the supplied template with the lifecycle binding. This enables footwork to track when
 * the instance is bound to or removed from the dom, triggering its various lifecycle events.
 *
 * @param {string|[DOMNodes]} template
 * @returns {[DOMNodes]} The wrapped component
 */
function wrapWithLifeCycle(template) {
  var templateString = _.isString(template) ? template : '';
  var wrapper = fw.utils.parseHtmlFragment('<!-- ko $life -->' + templateString + '<!-- /ko -->');

  if (templateString.length) {
    return wrapper;
  }

  return [].concat(wrapper[0], template, wrapper[1]);
}
