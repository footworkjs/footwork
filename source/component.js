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
  if( isFootworkViewModelCtor(viewModel) ) {
    viewModel.options.componentNamespace = options.namespace;
  } else if( _.isFunction(viewModel) ) {
    viewModel = this.viewModel(options);
  }

  //TODO: determine how mixins from the (optionally) supplied footwork model mix in with the mixins supplied directly in the component options
  //      as well as others like params, afterBinding. Currently we will just use the viewModel's mixins/etc, only the namespace is overridden
  //      from the template definition.

  ko.components.register(options.name, {
    viewModel: viewModel,
    template: options.template
  });
}

ko.components.register('outlet', {
  viewModel: function() {
    this.isSuccess = ko.observable('SUCCESSING INTENSIFIES');
  },
  // use comment bindings!
  template: '<div data-bind="text: isSuccess"></div>'
});