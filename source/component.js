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
    viewModel.__configParams['componentNamespace'] = componentName;
  } else if( typeof viewModel === 'function' ) {
    options.namespace = componentName;
    viewModel = makeViewModel(options);
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel,
    template: options.template
  });
};

var makeComponent = ko.component = function(componentDefinition) {
  var routerDescription = componentDefinition.router;
  var viewModel = componentDefinition.viewModel;
  var mixins = componentDefinition.mixins;

  if( typeof viewModel === 'function' && isViewModelCtor(viewModel) === false ) {
    componentDefinition.viewModel = makeViewModel( _.omit(componentDefinition, 'template') );
  }

  if( typeof routerDescription === 'object' && typeof componentDefinition.viewModel.compose === 'function' ) {
    if( _.isArray(mixins) === false ) {
      componentDefinition.mixins = [];
    }
    // add mixin which creates an instance of $router on the viewModel according to the componentDefinition.router description
    componentDefinition.viewModel = viewModel.compose({
      _postInit: function() {
        this.$router = makeRouter( routerDescription );
        console.log('componentRouterMixin', this.$router);
        // this.$router = ko.router({
        //   baseRoute: 'http://footwork-test.local',
        //   routes: [
        //     { route: '/', title: 'Main Page Nav', nav: true, controller: controller },
        //     { route: '/one/:two/:three', title: 'Nav Route', nav: true, controller: controller },
        //     { route: '/2014/march/*', title: 'Date Route', controller: controller }
        //   ]
        // });
      }
    });
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

function componentTriggerAfterBinding(element, viewModel) {
  if( isViewModel(viewModel) === true ) {
    var configParams = viewModel.__getConfigParams();
    if( _.isFunction(configParams.afterBinding) === true && configParams.afterBinding.wasCalled === false ) {
      configParams.afterBinding.wasCalled = true;
      configParams.afterBinding.call(viewModel, element);
    }
  }
}

// Use the $component wrapper binding to provide lifecycle events for components
ko.virtualElements.allowedBindings.$component = true;
ko.bindingHandlers.$component = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if( isViewModel(viewModel) === true ) {
        var configParams = viewModel.__getConfigParams();
        if( _.isFunction(configParams.afterDispose) === true ) {
          configParams.afterDispose.call(viewModel, element);
        }
        if( _.isFunction(configParams.afterBinding) === true ) {
          configParams.afterBinding.wasCalled = false;
        }
      }

      _.each( viewModel, function( $namespace ) {
        if( isNamespace( $namespace ) === true ) {
          $namespace.shutdown();
        }
      });
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    if( isViewModel(viewModel) === true ) {
      componentTriggerAfterBinding(element, viewModel);
    }

    var child = ko.virtualElements.firstChild(element);
    if( typeof child !== 'undefined' ) {
      viewModel = ko.dataFor( child );
      componentTriggerAfterBinding(element, viewModel);
    }
  }
};

// Components which footwork will not wrap in the $component custom binding used for lifecycle events
// Used to keep the wrapper off of internal/natively handled and defined components such as 'outlet'
var nativeComponents = [
  'outlet'
];

// Custom loader used to wrap components with the $component custom binding
var componentWrapperTemplate = '<!-- ko $component -->COMPONENT_MARKUP<!-- /ko -->';
ko.components.loaders.unshift( ko.components.componentWrapper = {
  loadTemplate: function(componentName, templateConfig, callback) {
    if( nativeComponents.indexOf(componentName) === -1 ) {
      // TODO: Handle different types of templateConfigs
      if(typeof templateConfig === 'string') {
        templateConfig = componentWrapperTemplate.replace(/COMPONENT_MARKUP/, templateConfig);
      }
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

ko.virtualElements.allowedBindings.$outlet = true;
ko.bindingHandlers.$outlet = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var $parentViewModel = bindingContext.$parent;
    viewModel.activateRouterFrom($parentViewModel);
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
  }
};
// outlets can only exist within parent components
ko.components.register('outlet', {
  autoIncrement: true,
  viewModel: function(params) {
    var outlet = this;

    this.activateRouterFrom = function($parentViewModel) {
      if(typeof $parentViewModel.$router !== 'undefined') {

      }
      console.log('$outlet activateRouterFrom $parentViewModel', $parentViewModel);
    };
    // var $parentViewModel = this.$parent = params.$parent;
    // this.outletName = params.name;
    // this.$namespace = makeNamespace(this.outletName, $parentViewModel.$namespace);
    // this.outletIsActive = ko.observable(true);

    // // .broadcastAs({ name: this.outletName, namespace: 'outlet.' });
    // this.errors = ko.observableArray();
    // var outletObservable = $parentViewModel[ this.outletName + 'Outlet' ];
    // if(typeof outletObservable !== 'undefined') {
    //   this.targetComponent = outletObservable;
    // } else {
    //   this.targetComponent = ko.observable('error');
    //   this.errors.push('Could not locate outlet observable ($parentViewModel.' + this.outletName + 'Outlet' + ' is undefined).');
    // }
  },
  template: '\
    <!-- ko $outlet -->\
    <!-- /ko -->'
});
//    <!-- ko component: { name: targetComponent, params: { errors: errors } } --><!-- /ko -->\

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