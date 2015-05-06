// framework/component/exports.js
// ------------------

fw.components.getNormalTagList = function() {
  return clone(nonComponentTags);
};

fw.components.getComponentNameForNode = function(node) {
  var tagName = isString(node.tagName) && node.tagName.toLowerCase();

  if( fw.components.isRegistered(tagName) || fw.components.tagIsComponent(tagName) ) {
    return tagName;
  }
  return null;
};

fw.components.tagIsComponent = function(tagName, isComponent) {
  if( isUndefined(isComponent) ) {
    return indexOf(nonComponentTags, tagName) === -1;
  }

  if( isArray(tagName) ) {
    each(tagName, function(tag) {
      fw.components.tagIsComponent(tag, isComponent);
    });
  }

  if(isComponent !== true) {
    if( contains(nonComponentTags, tagName) === false ) {
      nonComponentTags.push(tagName);
    }
  } else {
    nonComponentTags = filter(nonComponentTags, function(nonComponentTagName) {
      return nonComponentTagName !== tagName;
    });
  }
};

fw.component = function(componentDefinition) {
  var viewModel = componentDefinition.viewModel;

  if( isFunction(viewModel) && !isEntityCtor(viewModel) ) {
    componentDefinition.viewModel = fw.viewModel( omit(componentDefinition, 'template') );
  }

  return componentDefinition;
};
