'use strict';

describe('components', function () {
  it('Can create a component', function() {
    ko.components.register('ComponentA', {
      template: '<div>a template</div>',
      viewModel: function() {
        this.variable = ko.observable().broadcastAs('variable');
      }
    });

    expect(ko.components.isRegistered('ComponentA')).to.eql(true);
  });
});