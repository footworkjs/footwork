'use strict';

describe('components', function () {
  it('has the ability to create a footwork component which is registered as a knockout component', function() {
    ko.component({
      name: 'ComponentA',
      constructor: function() {
        this.variable = ko.observable().broadcastAs('variable');
      },
      template: '<div>a template</div>'
    });

    expect(ko.components.isRegistered('ComponentA')).to.eql(true);
  });
});