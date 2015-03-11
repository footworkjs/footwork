// framework/component/exports.js
// ------------------

fw.components.getNormalTagList = function() {
  return nonComponentTags.splice(0);
};

fw.components.getComponentNameForNode = function(node) {
  var tagName = isString(node.tagName) && node.tagName.toLowerCase();

  if( fw.components.isRegistered(tagName) || fw.components.tagIsComponent(tagName) ) {
    return tagName;
  }
  return null;
};

// Mark a component as consisting of a template only.
// This will cause footwork to load only the template when this component is used.
fw.components.isTemplateOnly = function(componentName, isTemplateOnly) {
  isTemplateOnly = (isUndefined(isTemplateOnly) ? true : isTemplateOnly);
  if( isArray(componentName) ) {
    each(componentName, function(compName) {
      fw.components.isTemplateOnly(compName, isTemplateOnly);
    });
  }

  componentIsTemplateOnly[componentName] = isTemplateOnly;
  if( !isArray(componentName) ) {
    return componentIsTemplateOnly[componentName] || 'normal';
  }
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

  if( isFunction(viewModel) && !isModelCtor(viewModel) ) {
    componentDefinition.viewModel = fw.viewModel( omit(componentDefinition, 'template') );
  }

  return componentDefinition;
};
