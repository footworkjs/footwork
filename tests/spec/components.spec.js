define(['footwork', 'lodash', 'jquery'],
  function(fw, _, $) {
    describe('components', function() {
      var testContainer;
      var footworkAnimationClass = 'fw-entity-animate';

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
        var viewModelSpy = jasmine.createSpy('viewModelSpy');

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: viewModelSpy
        });

        expect(fw.components.isRegistered(namespaceName)).toBe(true);
        expect(fw.components.isRegistered(invalidNamespaceName)).not.toBe(true);
        expect(viewModelSpy).not.toHaveBeenCalled();
      });

      it('can instantiate a registered component via a <declarative> statement', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy');

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: fw.viewModel.create({
            initialize: expectCallOrder(0, initializeSpy)
          })
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('can instantiate a registered component via a <declarative> statement with a dataModel', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy');

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: fw.dataModel.create({
            initialize: expectCallOrder(0, initializeSpy)
          })
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('can instantiate a registered component via a <declarative> statement with a router', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy');

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: fw.router.create({
            initialize: expectCallOrder(0, initializeSpy)
          })
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('has the animation classes applied properly', function(done) {
        var componentNamespaceName = generateNamespaceName();
        var viewModelNamespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy');
        var afterRenderSpy;
        var theElement;

        fw.components.register(componentNamespaceName, {
          template: '<div>a template</div>',
          viewModel: fw.viewModel.create({
            initialize: expectCallOrder(0, initializeSpy),
            afterRender: expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              expect(theElement).not.toHaveClass(footworkAnimationClass);
              theElement = element;
            }).and.callThrough())
          })
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + componentNamespaceName + '></' + componentNamespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(theElement).not.toHaveClass(footworkAnimationClass);

          setTimeout(function() {
            expect(afterRenderSpy).toHaveBeenCalled();
            expect(theElement).toHaveClass(footworkAnimationClass);

            done();
          }, 100);
        }, 0);
      });
    });
  }
);
