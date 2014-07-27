// resource.js
// ------------------

var resourceFileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

ko.components.setFileExtensions = function(fileType, extension) {
  if( typeof fileType === 'object' ) {
    _.extend(resourceFileExtensions, fileType);
  } else if(typeof resourceFileExtensions[fileType] !== 'undefined') {
    resourceFileExtensions[fileType] = extension;
  }
};

ko.components.getFileExtensions = function() {
  return _.clone(resourceFileExtensions);
};

ko.components.getNormalTagList = function() {
  return normalTags.splice(0);
};

ko.components.getComponentNameForNode = function(node) {
  var tagName = node.tagName && node.tagName.toLowerCase();

  if( ko.components.isRegistered(tagName) || _.indexOf(normalTags, tagName) === -1 ) {
    return tagName;
  }
  return null;
};

var defaultResourceLocation = {
  combined: null,
  viewModels: '/viewModel/',
  templates: '/component/'
};
var resourceRelativeLocation = function(rootURL, returnTheValue) {
  var componentLocation = defaultResourceLocation;
  if(returnTheValue === true) {
    componentLocation = _.extend({}, defaultResourceLocation);
  }

  if( _.isObject(rootURL) === true ) {
    // assume some combination of defaultResourceLocation and normalize the parameters
    _.extend(componentLocation, _.reduce(rootURL, function(options, paramValue, paramName) {
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
  } else if( typeof rootURL === 'string' ) {
    componentLocation = {
      combined: rootURL,
      viewModels: null,
      templates: null
    };
  }

  if(returnTheValue === true) {
    return componentLocation;
  } else {
    defaultResourceLocation = componentLocation;
  }
};

var componentRelativeLocation = ko.components.loadRelativeTo = function(locations, returnTheValue) {
  var returnValue = resourceRelativeLocation(locations, returnTheValue);
  if(returnTheValue === true) {
    return returnValue;
  }
};

var resourceLocations = ko.resourceLocations = {};
var registerLocationOfComponent = ko.components.registerLocationOf = function(componentName, componentLocation) {
  if( _.isArray(componentName) === true ) {
    _.each(componentName, function(name) {
      registerLocationOfComponent(name, componentLocation);
    });
  }
  resourceLocations[ componentName ] = componentRelativeLocation(componentLocation, true);
};

var viewModelRelativeLocation = ko.viewModel.loadRelativeTo = function(rootURL, returnTheValue) {
  var returnValue = resourceRelativeLocation({ viewModel: rootURL }, returnTheValue);
  if(returnTheValue === true) {
    return returnValue;
  }
};

var registerLocationOfViewModel = ko.viewModel.registerLocationOf = function(viewModelName, viewModelLocation) {
  if( _.isArray(viewModelName) === true ) {
    _.each(viewModelName, function(name) {
      registerLocationOfViewModel(name, viewModelLocation);
    });
  }
  resourceLocations[ viewModelName ] = viewModelRelativeLocation(viewModelLocation, true);
};

// Return the resource definition for the supplied resourceName
var getResourceLocation = ko.getResourceLocation = function(resourceName) {
  return resourceLocations[resourceName] || defaultResourceLocation;
};