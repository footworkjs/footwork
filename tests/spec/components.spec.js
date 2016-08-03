define(['footwork', 'lodash', 'jquery'],
  function(fw, _, $) {
    describe('components', function() {
      var testContainer;

      beforeEach(function() {
        resetCallbackOrder();
        jasmine.addMatchers(customMatchers);
        fixture.setBase('tests/assets/fixtures');
      });
      afterEach(function() {
        fixture.cleanup(testContainer);
      });

      it('can register a component', function() {
        var namespaceName = generateNamespaceName();
        var invalidNamespaceName = generateNamespaceName();

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: function() {}
        });

        expect(fw.components.isRegistered(namespaceName)).toBe(true);
        expect(fw.components.isRegistered(invalidNamespaceName)).not.toBe(true);
      });

      it('can instantiate a registered component via a <declarative> statement', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy');

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: fw.viewModel.create({
            initialize: initializeSpy
          })
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(makeTestContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, 20);
      });
    });
  }
);
