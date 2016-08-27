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
