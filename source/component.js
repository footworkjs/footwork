ko.component = function(options) {
  if(typeof options.name !== 'string') {
    throw 'Components must be provided a name (namespace).';
  }

  if(typeof options.template !== 'string') {
    throw 'Components must be provided a template.';
  }

  options.namespace = options.name;
  var viewModel = this.model(options);
  
  ko.components.register(options.name, {
    viewModel: viewModel,
    template: options.template
  });
}