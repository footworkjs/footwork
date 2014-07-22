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
var footworkDefaultLoader = ko.components.footworkDefaultLoader = {
  getConfig: function(name, callback) {
    var jsFile = name + '.js';
    var templateFile = name + '.html';
    var componentLocation = componentLocations[name] || defaultComponentLocation;
    var configOptions = null;
    var extensionIsPresent = /\.[a-z0-9]{1,4}$/i;
    var viewModelPath;
    var templateFile;

    if( typeof require === 'function' ) {
      // load component using knockouts native support for requirejs
      if( typeof componentLocation.combined === 'string' ) {
        viewModelPath = componentLocation.combined;
        if( viewModelPath.match(extensionIsPresent) !== null ) {
          configOptions = { require: viewModelPath };
        } else {
          configOptions = { require: viewModelPath + '/' + jsFile };
        }
      } else {
        viewModelPath = (componentLocation.viewModels || componentLocation.viewModel);
        templatePath = 'text!' + (componentLocation.templates || componentLocation.template);

        if( viewModelPath.match(extensionIsPresent) === null ) {
          viewModelPath = viewModelPath + '/' + jsFile;
        }
        if( templatePath.match(extensionIsPresent) === null ) {
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
};
ko.components.loaders.push( footworkDefaultLoader );

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