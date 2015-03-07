// component.js
// ------------------

fw.components.getNormalTagList = function() {
  return nonComponentTags.splice(0);
};

fw.components.getComponentNameForNode = function(node) {
  var tagName = isString(node.tagName) && node.tagName.toLowerCase();

  if( fw.components.isRegistered(tagName) || tagIsComponent(tagName) ) {
    return tagName;
  }
  return null;
};

var makeComponent = fw.component = function(componentDefinition) {
  var viewModel = componentDefinition.viewModel;

  if( isFunction(viewModel) && !isViewModelCtor(viewModel) ) {
    componentDefinition.viewModel = makeViewModel( omit(componentDefinition, 'template') );
  }

  return componentDefinition;
};

//import("component/processing.js");
//import("component/lifecycle.js");
//import("component/loader.js");
