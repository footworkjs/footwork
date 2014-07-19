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

// These are tags which are ignored by the custom component loader
// Sourced from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var normalTags = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bgsound',
  'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
  'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element',
  'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head',
  'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li',
  'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'nobr', 'noframes',
  'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt',
  'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong',
  'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title',
  'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'
];

ko.components.getComponentNameForNode = function(node) {
  var tagNameLower = node.tagName && node.tagName.toLowerCase();

  if( ko.components.isRegistered(tagNameLower) || _.indexOf(normalTags, tagNameLower) === -1 ) {
    return tagNameLower;
  } else {
    return null;
  }
};

ko.components.footworkDefaultLoader = {
  getConfig: function(name, callback) {
    // TODO NEXT: ajax loading of component via user-configured (or default) conventions
    var configOptions = {
      viewModel: function() {},
      template: '<div class="ComponentLoader NoConfig">ComponentLoader</div>'
    };

    callback(configOptions);
  }
};
ko.components.loaders.push( ko.components.footworkDefaultLoader );

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