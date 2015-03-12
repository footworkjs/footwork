'use strict';

describe('components', function () {
  it('can create a component', function() {
    fw.components.register('ComponentA', {
      template: '<div>a template</div>',
      viewModel: function() {
        this.variable = fw.observable().broadcastAs('variable');
      }
    });

    expect(fw.components.isRegistered('ComponentA')).to.eql(true);
  });

  it('can instantiate a components viewModel via a <declarative> statement', function(done) {
    var componentInitialized = false;
    var container = document.getElementById('declarativeComponent');

    expect(componentInitialized).to.be(false);

    fw.components.register('declarative-component', {
      template: '<div>a template</div>',
      viewModel: fw.viewModel({
        initialize: function() {
          console.info('yo');
          componentInitialized = true;
        }
      })
    });

    fw.start(container);

    setTimeout(function() {
      expect(componentInitialized).to.be(true);
      done();
    }, 0);
  });
});
