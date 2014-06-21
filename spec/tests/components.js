'use strict';

describe('components', function () {
  it('has the ability to create a footwork component which is registered as a knockout component', function() {
    ko.component({
      name: 'ComponentA',
      template: '<div>a template</div>',
      constructor: function() {
        this.variable = ko.observable().broadcastAs('variable');
      }
    });

    expect(ko.components.isRegistered('ComponentA')).to.eql(true);
  });
});