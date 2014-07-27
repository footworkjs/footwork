// component.js
// ------------------

var originalComponentRegisterFunc = ko.components.register;
var registerComponent = ko.components.register = function(componentName, options) {
  var viewModel = options.initialize || options.viewModel;
  
  if(typeof componentName !== 'string') {
    throw 'Components must be provided a componentName.';
  }

  //TODO: determine how mixins from the (optionally) supplied footwork viewModel mix in with the mixins supplied directly in the component options
  //      as well as others like params, afterBinding. Currently we will just use the viewModel's mixins/etc, only the namespace is overridden
  //      from the component definition/configuration.
  if( isViewModelCtor(viewModel) ) {
    viewModel.options.componentNamespace = componentName;
  } else if( typeof viewModel === 'function' ) {
    options.namespace = componentName;
    viewModel = makeViewModel(options);
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel,
    template: options.template
  });
};

var makeComponent = ko.component = function(options) {
  var viewModel = options.viewModel;
  var template = options.template;

  var componentDefinition = {
    viewModel: viewModel,
    template: template
  };

  if( typeof viewModel === 'function' && isViewModelCtor(viewModel) === false ) {
    componentDefinition.viewModel = makeViewModel( _.omit(options, 'template') );
  } else if( typeof viewModel === 'object' ) {
    componentDefinition.viewModel = viewModel;
  }

  return componentDefinition;
};

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
var tagIsComponent = ko.components.tagIsComponent = function(tagName, isComponent) {
  isComponent = (typeof isComponent === 'undefined' ? true : isComponent);

  if( _.isArray(tagName) === true ) {
    _.each(tagName, function(tag) {
      tagIsComponent(tag, isComponent);
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

// Monkey patch enables the viewModel 'component' to initialize a model and bind to the html as intended
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = ko.bindingHandlers.component.init;
ko.bindingHandlers.component.init = function(element, valueAccessor, ignored1, ignored2, bindingContext) {
  if( element.tagName.toLowerCase() === 'viewmodel' ) {
    var values = valueAccessor();

    if( typeof values.params.name !== 'undefined' ) {
      var viewModelName = ko.unwrap(values.params.name);
      var resourceLocation = getResourceLocation( viewModelName ).viewModels;

      if( typeof require === 'function' && typeof require.defined === 'function' && require.defined(viewModelName) === true ) {
        // we have found a matching resource that is already cached by require, lets use it
        resourceLocation = viewModelName;
      }

      var bindViewModel = function(ViewModel) {
        var viewModel = ViewModel;
        if(typeof ViewModel === 'function') {
          viewModel = new ViewModel(values.params);
        }

        // binding the viewModel onto each child element is not ideal, need to do this differently
        // cannot get component.preprocess() method to work/be called for some reason
        _.each(element.children, function(child) {
          applyBindings(viewModel, child);
        });
      };

      if(typeof resourceLocation === 'string' ) {
        if(typeof require === 'function') {
          if(isPath(resourceLocation) === true) {
            resourceLocation = resourceLocation + values.params.name;
          }
          if( resourceLocation !== viewModelName && resourceLocation.match(/\.js$/) === null ) {
            resourceLocation = resourceLocation + resourceFileExtensions.viewModel;
          }

          // TODO: figure out why the leading '/' causes a problem here but not on components loaded via require?
          resourceLocation = resourceLocation.replace(/^\//, '');

          require([ resourceLocation ], bindViewModel);
        } else {
          throw 'Uses require, but no AMD loader is present';
        }
      } else if( typeof resourceLocation === 'function' ) {
        bindViewModel( resourceLocation );
      } else if( typeof resourceLocation === 'object' ) {
        if( typeof resourceLocation.instance === 'object' ) {
          bindViewModel( resourceLocation.instance );
        } else if( typeof resourceLocation.createViewModel === 'function' ) {
          bindViewModel( resourceLocation.createViewModel( values.params, { element: element } ) );
        }
      }
    }
    return { 'controlsDescendantBindings': true };
  }
  return originalComponentInit(element, valueAccessor, ignored1, ignored2, bindingContext);
};

// Use the $component wrapper binding to provide the afterBinding() lifecycle event for components
ko.virtualElements.allowedBindings.$component = true;
ko.bindingHandlers.$component = {
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var child = ko.virtualElements.firstChild(element);
    var children = [];
    while (child) {
      children.push(child);
      child = ko.virtualElements.nextSibling(child);
    }

    if( typeof children !== 'undefined' && children.length > 0 ) {
      viewModel = ko.dataFor( children[0] );
      if( isViewModel(viewModel) === true ) {
        var configParams = viewModel.__getConfigParams();
        if( _.isFunction(configParams.afterBinding) === true && typeof configParams.afterBinding.wasCalled === 'undefined' ) {
          configParams.afterBinding.wasCalled = true;
          configParams.afterBinding.call(viewModel, element, valueAccessor, allBindings, viewModel, bindingContext);
        }
      }
    }
  }
};

// Custom loader used to wrap components with the $component custom binding
var componentWrapperTemplate = '<!-- ko $component -->COMPONENT_MARKUP<!-- /ko -->';
ko.components.loaders.unshift( ko.components.componentWrapper = {
  loadTemplate: function(componentName, templateConfig, callback) {
    if(typeof templateConfig === 'string') {
      templateConfig = componentWrapperTemplate.replace(/COMPONENT_MARKUP/,templateConfig);
    }
    ko.components.defaultLoader.loadTemplate(componentName, templateConfig, callback);
  }
});

// The footwork getConfig loader is a catch-all in the instance a registered component cannot be found.
// The loader will attempt to use requirejs via knockouts integrated support if it is available.
ko.components.loaders.push( ko.components.requireLoader = {
  getConfig: function(componentName, callback) {
    var combinedFile = componentName + resourceFileExtensions.combined;
    var viewModelFile = componentName + resourceFileExtensions.viewModel;
    var templateFile = componentName + resourceFileExtensions.template;
    var componentLocation = getResourceLocation(componentName);
    var configOptions = null;
    var viewModelPath;
    var templatePath;
    var combinedPath;

    if( typeof require === 'function' ) {
      // load component using knockouts native support for requirejs
      if( require.defined(componentName) === true ) {
        // component already cached, lets use it
        configOptions = {
          require: componentName
        };
      } else if( typeof componentLocation.combined === 'string' ) {
        combinedPath = componentLocation.combined;

        if( isPath(combinedPath) === true ) {
          combinedPath = combinedPath + combinedFile;
        }

        configOptions = {
          require: combinedPath
        };
      } else {
        viewModelPath = componentLocation.viewModels;
        templatePath = 'text!' + componentLocation.templates;

        if( isPath(viewModelPath) === true ) {
          viewModelPath = viewModelPath + viewModelFile;
        }
        if( isPath(templatePath) === true ) {
          templatePath = templatePath + templateFile;
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

// outlets can only exist within parent components
ko.components.register('outlet', {
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
  template: '\
    <!-- ko if: outletIsActive -->\
      <!-- ko component: { name: targetComponent, params: { errors: errors } } --><!-- /ko -->\
    <!-- /ko -->'
});

ko.components.register('empty', {
  viewModel: function(params) {},
  template: '<div class="empty component"></div>'
});

ko.components.register('error', {
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