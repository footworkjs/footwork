//import("lifecycle.js");
//import("loader.js");

var nativeComponents = entityDescriptors.getTags();;

fw.components.getComponentNameForNode = function(node) {
  var tagName = isString(node.tagName) && node.tagName.toLowerCase();

  if(fw.components.isRegistered(tagName)
     || fw.components.locationIsRegistered(tagName)
     || nativeComponents.indexOf(tagName) !== -1) {
    return tagName;
  }
  return null;
};

fw.component = function(componentDefinition) {
  if(!isObject(componentDefinition)) {
    throw new Error('fw.component() must be supplied with a componentDefinition configuration object.');
  }

  componentDefinition.viewModel = componentDefinition.dataModel || componentDefinition.router || componentDefinition.viewModel;

  return componentDefinition;
};
