// component.js
// ------------------

ko.component = function(options) {
  if(typeof options.name !== 'string') {
    ko.logError('Components must be provided a name (namespace).');
  }

  if(typeof options.template !== 'string') {
    ko.logError('Components must be provided a template.');
  }

  options.namespace = options.name = _.result(options, 'name');
  var viewModel = options.initialize || options.viewModel;
  if( isViewModelCtor(viewModel) ) {
    viewModel.options.componentNamespace = options.namespace;
  } else if( _.isFunction(viewModel) ) {
    viewModel = makeViewModel(options);
  }

  //TODO: determine how mixins from the (optionally) supplied footwork viewModel mix in with the mixins supplied directly in the component options
  //      as well as others like params, afterBinding. Currently we will just use the viewModel's mixins/etc, only the namespace is overridden
  //      from the component definition/configuration.

  ko.components.register(options.name, {
    viewModel: viewModel,
    template: options.template
  });
}

// These are tags which are ignored by the custom component loader
// Sourced from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var normalTags = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bgsound',
  'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
  'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element',
  'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'g', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label',
  'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'nobr',
  'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'polygon', 'path', 'pre',
  'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'spacer',
  'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea',
  'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'
];
ko.components.tagIsComponent = function(tagName, isComponent) {
  isComponent = (typeof isComponent === 'undefined' ? true : isComponent);

  if( _.isArray(tagName) === true ) {
    _.each(tagName, function(tag) {
      ko.components.tagIsComponent(tag, isComponent);
    });
  }

  if(isComponent !== true) {
    if( _.contains(normalTags, tagName) === false ) {
      normalTags.push(tagName);
    }
  } else {
    normalTags = _.filter(normalTags, function(normalTagName) {
      return normalTagName !== tagName;
    });
  }
};

var componentFileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

ko.components.setFileExtensions = function(fileType, extension) {
  if( typeof fileType === 'object' ) {
    _.extend(componentFileExtensions, fileType);
  } else if(typeof componentFileExtensions[fileType] !== 'undefined') {
    componentFileExtensions[fileType] = extension;
  }
};

ko.components.getFileExtensions = function() {
  return _.clone(componentFileExtensions);
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


var defaultComponentLocation = {
  combined: null,
  viewModels: '/components',
  templates: '/components'
};
var componentRelativeLocation = ko.components.loadRelativeTo = function(rootURL, returnTheValue) {
  var componentLocation = defaultComponentLocation;
  if(returnTheValue === true) {
    componentLocation = _.extend({}, defaultComponentLocation);
  }

  if( _.isObject(rootURL) === true
      && typeof (rootURL.viewModels || rootURL.viewModel) !== 'undefined'
      && typeof (rootURL.template || rootURL.templates) !== 'undefined' ) {
    componentLocation = rootURL;
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
    defaultComponentLocation = componentLocation;
  }
};

var componentLocations = {};
var registerLocationOfComponent = ko.components.registerLocationOf = function(componentName, location) {
  if( _.isArray(componentName) === true ) {
    _.each(componentName, function(component) {
      registerLocationOfComponent(component, location);
    });
  }
  componentLocations[ componentName ] = componentRelativeLocation(location, true);
};

// The footwork loader is a catch-all in the instance a registered component cannot be found.
// The loader will attempt to use requirejs via knockouts integrated support if it is available.
ko.components.loaders.push( ko.components.footworkDefaultLoader = {
  getConfig: function(name, callback) {
    var combinedFile = name + componentFileExtensions.combined;
    var viewModelFile = name + componentFileExtensions.viewModel;
    var templateFile = name + componentFileExtensions.template;
    var componentLocation = componentLocations[name] || defaultComponentLocation;
    var configOptions = null;
    var viewModelPath;
    var templatePath;
    var combinedPath;

    if( typeof require === 'function' ) {
      // load component using knockouts native support for requirejs
      if( typeof componentLocation.combined === 'string' ) {
        combinedPath = componentLocation.combined;

        if( isPath(combinedPath) === true ) {
          combinedPath = combinedPath + '/' + combinedFile;
        }

        configOptions = {
          require: combinedPath
        };
      } else {
        viewModelPath = (componentLocation.viewModels || componentLocation.viewModel);
        templatePath = 'text!' + (componentLocation.templates || componentLocation.template);

        if( isPath(viewModelPath) === true ) {
          viewModelPath = viewModelPath + '/' + viewModelFile;
        }
        if( isPath(templatePath) === true ) {
          templatePath = templatePath + '/' + templateFile;
        }
        
        configOptions = {
          viewModel: { require: viewModelPath },
          template: { require: templatePath }
        };
      }
    }

    callback(configOptions);
  }
});


// Temporary solution to being able to programmatically wrap components in a custom binding
// TODO: Handle this for user when it becomes possible (knockout 3.3?)
ko.bindingHandlers['bindingEvents'] = {
  'update': function( element, valueAccessor ) {
    ko.namespace( ko.unwrap(valueAccessor()) ).publish('__elementIsBound', element);
  }
};

// outlets can only exist within parent components
ko.component({
  name: 'outlet',
  autoIncrement: true,
  viewModel: function(params) {
    var $parentViewModel = this.$parent = params.$parent;
    this.outletName = params.name;
    this.$namespace = makeNamespace(this.outletName, $parentViewModel.$namespace);
    this.outletIsActive = ko.observable(true);

    // .broadcastAs({ name: this.outletName, namespace: 'outlet.' });
    this.errors = ko.observableArray();
    var outletObservable = $parentViewModel[ this.outletName + 'Outlet' ];
    if(typeof outletObservable !== 'undefined') {
      this.targetComponent = outletObservable;
    } else {
      this.targetComponent = ko.observable('error');
      this.errors.push('Could not locate outlet observable ($parentViewModel.' + this.outletName + 'Outlet' + ' is undefined).');
    }
  },
  // use comment bindings!
  // template: '<!-- ko if: outletIsActive -->[OUTLET]<div data-bind="component: { name: targetComponent, params: { parentNamespace: namespace, $outletViewModel: $data, $parentViewModel: $parent } }, class: outletName"></div><!-- /ko -->'
  template: '\
    <!-- ko if: outletIsActive -->\
      <!-- ko component: { name: targetComponent, params: { errors: errors } } --><!-- /ko -->\
    <!-- /ko -->'
});

ko.component({
  name: 'empty',
  viewModel: function(params) {},
  template: '<div class="empty component"></div>'
});

ko.component({
  name: 'error',
  viewModel: function(params) {
    this.message = ko.observable(params.message);
    this.errors = params.errors;
  },
  template: '\
    <div class="component error" data-bind="foreach: errors">\
      <div class="error">\
        <span class="number" data-bind="text: $index() + 1"></span>\
        <span class="message" data-bind="text: $data"></span>\
      </div>\
    </div>'
});