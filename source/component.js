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
  viewModel: function(params) {
    console.log('new empty component');
  },
  template: '<div class="empty component">[Empty]</div>'
});

ko.component({
  name: 'error',
  viewModel: function(params) {
    this.message = ko.observable(params.message);
    this.errors = params.errors;
    console.log('new error component');
  },
  template: '\
    <div class="component error" data-bind="foreach: errors">\
      <span class="message" data-bind="text: $data"></span>\
    </div>'
});

// outlets can only exist within parent components
ko.component({
  name: 'outlet',
  autoIncrement: true,
  viewModel: function(params) {
    var $parent = this.$parent = params.$parent;
    this.outletName = params.name;
    this.$namespace = makeNamespace(this.outletName, $parent.$namespace);
    this.outletIsActive = ko.observable(true);

    // .broadcastAs({ name: this.outletName, namespace: 'outlet.' });
    this.errors = ko.observableArray();
    var outletObservable = $parent[ this.outletName + 'Outlet' ];
    if(typeof outletObservable !== 'undefined') {
      this.targetComponent = outletObservable;
    } else {
      this.targetComponent = ko.observable('error');
      this.errors.push('Could not locate outlet observable');
    }
  },
  // use comment bindings!
  // template: '<!-- ko if: outletIsActive -->[OUTLET]<div data-bind="component: { name: targetComponent, params: { parentNamespace: namespace, $outletViewModel: $data, $parentViewModel: $parent } }, class: outletName"></div><!-- /ko -->'
  template: '\
    <!-- ko if: outletIsActive -->\
      <div class="outlet" data-bind="component: { name: targetComponent, params: { errors: errors } }, class: outletName"></div>\
    <!-- /ko -->'
});