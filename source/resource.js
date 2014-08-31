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

var defaultComponentLocation = {
  combined: null,
  viewModels: '/viewModel/',
  templates: '/component/'
};
var componentRelativeLocation = ko.components.loadRelativeTo = function(root, updateDefault) {
  var componentLocation = (isUndefined(updateDefault) || updateDefault === true) ? defaultComponentLocation : clone(defaultComponentLocation);

  if( isObject(root) ) {
    // assume some combination of defaultComponentLocation and normalize the parameters
    extend(componentLocation, reduce(root, function(options, paramValue, paramName) {
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
  } else if( isString(root) ) {
    componentLocation = {
      combined: rootURL,
      viewModels: null,
      templates: null
    };
  }

  return componentLocation;
};

var componentResourceLocations = ko.components.resourceLocations = {};
var registerLocationOfComponent = ko.components.registerLocationOf = function(componentName, componentLocation) {
  if( isArray(componentName) ) {
    each(componentName, function(name) {
      registerLocationOfComponent(name, componentLocation);
    });
  }
  componentResourceLocations[ componentName ] = componentRelativeLocation(componentLocation, false);
};

// Return the component resource definition for the supplied componentName
var getComponentResourceLocation = ko.components.getResourceLocation = function(componentName) {
  if( isUndefined(componentName) ) {
    return componentResourceLocations;
  }
  return componentResourceLocations[componentName] || defaultComponentLocation;
};

var defaultViewModelLocation = '/viewModel/';
var viewModelRelativeLocation = ko.viewModels.loadRelativeTo = function(root, updateDefault) {
  var viewModelLocation = defaultViewModelLocation;

  if( isString(root) ) {
    viewModelLocation = root;
  }

  if(updateDefault) {
    defaultViewModelLocation = viewModelLocation;
  }

  return viewModelLocation;
};

var viewModelResourceLocations = ko.components.resourceLocations = {};
var registerLocationOfViewModel = ko.viewModels.registerLocationOf = function(viewModelName, viewModelLocation) {
  if( isArray(viewModelName) ) {
    each(viewModelName, function(name) {
      registerLocationOfViewModel(name, viewModelLocation);
    });
  }
  viewModelResourceLocations[ viewModelName ] = viewModelRelativeLocation(viewModelLocation, false);
};

// Return the viewModel resource definition for the supplied viewModelName
var getViewModelResourceLocation = ko.viewModels.getResourceLocation = function(viewModelName) {
  if( isUndefined(viewModelName) ) {
    return viewModelResourceLocations;
  }
  return viewModelResourceLocations[viewModelName] || getComponentResourceLocation(viewModelName).viewModels || defaultViewModelLocation;
};