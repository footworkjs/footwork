'use strict';

var sandbox = document.getElementById('sandbox');

describe('router', function () {

  it('can have callback triggered after outlet component is resolved and composed', function(done) {
    var container = document.getElementById('outletCallback');
    var controllerRan = false;
    var componentInstantiated = false;
    var outletCallbackRan = false;
    var router;

    fw.components.register('outletCallbackComponent', {
      viewModel: function() {
        componentInstantiated = true;
      },
      template: '<div class="outletCallbackComponent"></div>'
    });

    fw.router.create({
      namespace: 'outletCallback',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      routes: [
        {
          route: '/outletCallback',
          controller: function() {
            controllerRan = true;
            this.outlet('output', 'outletCallbackComponent', function(element) {
              expect(element.tagName.toLowerCase()).to.be('outlet');
              expect($(element).find('.outletCallbackComponent').length).to.be(1);
              outletCallbackRan = true;
            });
          }
        }
      ]
    });

    expect(controllerRan).to.be(false);
    expect(componentInstantiated).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/outletCallback');
      expect(controllerRan).to.be(true);

      setTimeout(function() {
        expect(componentInstantiated).to.be(true);
        expect(outletCallbackRan).to.be(true);
        done();
      }, 40);
    }, 40);
  });
});
