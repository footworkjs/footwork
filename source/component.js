ko.component = function(options) {
  if(typeof options.name !== 'string') {
    throw 'Components must be provided a name (namespace).';
  }

  if(typeof options.template !== 'string') {
    throw 'Components must be provided a template.';
  }

  options.namespace = options.name = _.result(options, 'name');
  var viewModel = (options.constructor._isFootworkModel === true ? options.constructor : this.model(options));
  viewModel.options.componentNamespace = options.namespace;

  //TODO: determine how mixins from the (optionally) supplied footwork model mix in with the mixins supplied directly in the component options
  //      as well as others like params, afterBinding.

  ko.components.register(options.name, {
    viewModel: viewModel,
    template: options.template
  });
}