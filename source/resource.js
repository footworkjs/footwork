// resource.js
// ------------------

var resourceFileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

ko.components.setFileExtensions = function(fileType, extension) {
  if( isObject(fileType) ) {
    extend(resourceFileExtensions, fileType);
  } else if( !isUndefined(resourceFileExtensions[fileType]) ) {
    resourceFileExtensions[fileType] = extension;
  }
};

ko.components.getFileExtensions = function() {
  return clone(resourceFileExtensions);
};

ko.components.getNormalTagList = function() {
  return normalTags.splice(0);
};

ko.components.getComponentNameForNode = function(node) {
  var tagName = isString(node.tagName) && node.tagName.toLowerCase();

  if( ko.components.isRegistered(tagName) || indexOf(normalTags, tagName) === -1 ) {
    return tagName;
  }
  return null;
};

var defaultResourceLocation = {
  combined: null,
  viewModels: '/viewModel/',
  templates: '/component/'
};
var resourceRelativeLocation = function(rootURL, updateConfig) {
  var componentLocation = (isUndefined(updateConfig) || updateConfig === true) ? defaultResourceLocation : clone(defaultResourceLocation);

  if( isObject(rootURL) ) {
    // assume some combination of defaultResourceLocation and normalize the parameters
    extend(componentLocation, reduce(rootURL, function(options, paramValue, paramName) {
      if(paramName === 'viewModel') {
        options.viewModels = paramValue;
        delete options.viewModel;
      } else if(paramName === 'template') {
        options.templates = paramValue;
        delete options.template;
      } else {
        options[paramName] = paramValue;
      }
      return options;
    }, {}));
  } else if( isString(rootURL) ) {
    componentLocation = {
      combined: rootURL,
      viewModels: null,
      templates: null
    };
  }

  return componentLocation;
};

var componentRelativeLocation = ko.components.loadRelativeTo = function(locations, updateConfig) {
  return resourceRelativeLocation(locations, updateConfig);
};

var resourceLocations = ko.resourceLocations = {};
var registerLocationOfComponent = ko.components.registerLocationOf = function(componentName, componentLocation) {
  if( isArray(componentName) ) {
    each(componentName, function(name) {
      registerLocationOfComponent(name, componentLocation);
    });
  }
  resourceLocations[ componentName ] = componentRelativeLocation(componentLocation, false);
};

var viewModelRelativeLocation = ko.viewModel.loadRelativeTo = function(rootURL, updateConfig) {
  return resourceRelativeLocation({ viewModel: rootURL }, updateConfig);
};

var registerLocationOfViewModel = ko.viewModel.registerLocationOf = function(viewModelName, viewModelLocation) {
  if( isArray(viewModelName) ) {
    each(viewModelName, function(name) {
      registerLocationOfViewModel(name, viewModelLocation);
    });
  }
  resourceLocations[ viewModelName ] = viewModelRelativeLocation(viewModelLocation, false);
};

// Return the resource definition for the supplied resourceName
var getResourceLocation = ko.getResourceLocation = function(resourceName) {
  return resourceLocations[resourceName] || defaultResourceLocation;
};