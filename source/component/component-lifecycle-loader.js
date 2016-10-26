var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entities/entity-descriptors');
var bindingElement = require('../binding/binding-element');

var util = require('../misc/util');
var isDocumentFragment = util.isDocumentFragment;
var isDomElement = util.isDomElement;
var makeArray = util.makeArray;

/**
 * The component lifecycle loader wraps all non-viewModel/dataModel/router custom component
 * contents with the $lifecycle binding which enables the lifecycle hooks (afterBinding/afterRender/onDispose).
 */
fw.components.loaders.unshift(fw.components.componentLifecycleLoader = {
  loadTemplate: function (componentName, templateConfig, callback) {
    /**
     * This loader is only for non-viewModel/dataModel/router components.
     * viewModels/dataModels/routers have their own loader which handles them (../entities/entity-loader)
     */
    if (!entityDescriptors.getDescriptor(componentName)) {
      // This is a regular component (not an entity) we need to wrap it with the $lifecycle binding
      if (typeof templateConfig === 'string') {
        // Markup - parse it
        callback(wrapWithLifeCycle(templateConfig));
      } else if (templateConfig instanceof Array) {
        // Assume already an array of DOM nodes
        callback(wrapWithLifeCycle(templateConfig));
      } else if (isDocumentFragment(templateConfig)) {
        // Document fragment - use its child nodes
        callback(wrapWithLifeCycle(makeArray(templateConfig.childNodes)));
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
      // This is an entity, leave it to the entity lifecycle loader
      callback(null);
    }
  }
});

/**
 * Clone and return the supplied DOM nodes in the nodesArray
 *
 * @param {any} nodesArray
 * @returns {array} New array of DOM nodes
 */
function cloneNodes (nodesArray) {
  for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
    var clonedNode = nodesArray[i].cloneNode(true);
    newNodesArray.push(clonedNode);
  }
  return newNodesArray;
}

/**
 * Clone and return the nodes from the elemInstance.
 *
 * @param {DOMNode} elemInstance
 * @returns {[DOMNodes]} The cloned DOM nodes
 */
function cloneNodesFromTemplateSourceElement (elemInstance) {
  switch (elemInstance.tagName.toLowerCase()) {
    case 'script':
      return fw.utils.parseHtmlFragment(elemInstance.text);
    case 'textarea':
      return fw.utils.parseHtmlFragment(elemInstance.value);
    case 'template':
      // For browsers with proper <template> element support (i.e., where the .content property
      // gives a document fragment), use that document fragment.
      if (isDocumentFragment(elemInstance.content)) {
        return cloneNodes(elemInstance.content.childNodes);
      }
  }

  // Regular elements such as <div>, and <template> elements on old browsers that don't really
  // understand <template> and just treat it as a regular container
  return cloneNodes(elemInstance.childNodes);
}

/**
 * Wrap the supplied template with the $lifecycle binding. This enables footwork to track when
 * the instance is bound to or removed from the dom, triggering its various lifecycle events.
 *
 * @param {string|[DOMNodes]} template
 * @returns {[DOMNodes]} The wrapped component
 */
function wrapWithLifeCycle (template) {
  var templateString = _.isString(template) ? template : '';
  var wrapper = fw.utils.parseHtmlFragment(bindingElement.open.prefix + '$lifecycle' + bindingElement.open.postfix + templateString + bindingElement.close);

  if (templateString.length) {
    return wrapper;
  }

  return [].concat(wrapper[0], template, wrapper[1]);
}
