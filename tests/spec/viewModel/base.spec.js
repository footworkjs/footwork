define(['footwork', 'lodash', 'tools'],
  function(fw, _, tools) {
    describe('viewModel core', function() {
      beforeEach(tools.prepareTestEnv);
      afterEach(tools.cleanTestEnv);

      it('has the ability to create a viewModel', function() {
        var BadViewModel = function ViewModel() {
          var self = fw.viewModel.boot();
        };
        expect(function() { new BadViewModel() }).toThrow();

        var ViewModel = function ViewModel() {
          var self = fw.viewModel.boot(this);
          expect(self).toBe(this);
        };

        var vm = new ViewModel();

        expect(vm).toBeA('viewModel');
        expect(vm).toBeInstanceOf(ViewModel);
      });

      it('has the ability to create a viewModel with a correctly defined namespace whos name we can retrieve', function() {
        var namespaceName = tools.generateNamespaceName();
        var Model = function () {
          var self = fw.viewModel.boot(this, {
            namespace: namespaceName
          });
        };

        var modelA = new Model();

        expect(modelA.$namespace).toBeAn('object');
        expect(modelA.$namespace.getName()).toBe(namespaceName);
      });

      it('calls afterRender after initialize with the correct target element when creating and binding a new instance', function() {
        var checkForClass = 'check-for-class';
        var initializeSpy;
        var afterRenderSpy;

        var ModelA = tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.viewModel.boot(this, {
            afterRender: tools.expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(containingElement) {
              expect(containingElement).toHaveClass(checkForClass);
            }).and.callThrough())
          });

          expect(afterRenderSpy).not.toHaveBeenCalled();
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        fw.applyBindings(new ModelA(), testContainer = tools.getFixtureContainer('', '<div class="' + checkForClass + '"></div>'));

        expect(initializeSpy).toHaveBeenCalled();
        expect(afterRenderSpy).toHaveBeenCalled();
      });

      it('can register and get a registered viewModel', function() {
        var namespaceName = tools.generateNamespaceName();
        expect(fw.viewModel.isRegistered(namespaceName)).toBe(false);

        var Model = jasmine.createSpy('Model');
        fw.viewModel.register(namespaceName, Model);

        expect(fw.viewModel.isRegistered(namespaceName)).toBe(true);
        expect(fw.viewModel.getRegistered(namespaceName)).toBe(Model);
        expect(Model).not.toHaveBeenCalled();
      });

      it('can get all instantiated viewModels', function() {
        var ViewModel = function() {
          fw.viewModel.boot(this);
        };
        var viewModels = [ new ViewModel(), new ViewModel() ];

        expect(_.keys(fw.viewModel.getAll())).lengthToBeGreaterThan(0);
      });

      it('can get all instantiated viewModels of a specific type/name', function() {
        var viewModels = [];
        var specificViewModelNamespace = tools.generateNamespaceName();
        var ViewModel = function() {
          fw.viewModel.boot(this, { namespace: specificViewModelNamespace });
        };
        var numToMake = _.random(1,15);

        for(var x = numToMake; x; x--) {
          viewModels.push(new ViewModel());
        }

        expect(fw.viewModel.getAll(tools.generateNamespaceName())).lengthToBe(0);
        expect(fw.viewModel.getAll(specificViewModelNamespace)).lengthToBe(numToMake);
      });

      it('can bind to the DOM using a &lt;viewModel&gt; declaration', function(done) {
        var wasInitialized = false;
        var namespaceName = tools.generateNamespaceName();
        var ViewModelSpy = jasmine.createSpy('ViewModelSpy', function() {
          fw.viewModel.boot(this, {
            namespace: namespaceName
          });
        }).and.callThrough();

        fw.viewModel.register(namespaceName, ViewModelSpy);

        expect(ViewModelSpy).not.toHaveBeenCalled();
        fw.start(testContainer = tools.getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(ViewModelSpy).toHaveBeenCalledTimes(1);
          done();
        }, 50);
      });

      it('can bind to the DOM using a shared instance', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var boundPropertyValue = tools.randomString();

        fw.viewModel.register(namespaceName, {
          instance: {
            boundProperty: boundPropertyValue
          }
        });

        testContainer = tools.getFixtureContainer('<viewModel module="' + namespaceName + '">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </viewModel>');

        expect(testContainer).not.toContainText(boundPropertyValue);

        fw.start(testContainer);

        setTimeout(function() {
          expect(testContainer).toContainText(boundPropertyValue);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a generated instance', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var boundPropertyValue = tools.randomString();
        var boundPropertyValueElement = boundPropertyValue + '-element';
        var createViewModelInstance;

        fw.viewModel.register(namespaceName, {
          createViewModel: tools.expectCallOrder(0, createViewModelInstance = jasmine.createSpy('createViewModel', function(params, info) {
            expect(params.var).toBe(boundPropertyValue);
            expect(info.element).toHaveId(boundPropertyValueElement);

            return {
              boundProperty: boundPropertyValue
            };
          }).and.callThrough())
        });

        expect(createViewModelInstance).not.toHaveBeenCalled();
        testContainer = tools.getFixtureContainer('<viewModel module="' + namespaceName + '" id="' + boundPropertyValueElement + '" params="var: \'' + boundPropertyValue + '\'">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </viewModel>');

        expect(testContainer).not.toContainText(boundPropertyValue);
        fw.start(testContainer);

        setTimeout(function() {
          expect(createViewModelInstance).toHaveBeenCalled();
          expect(testContainer).toContainText(boundPropertyValue);
          done();
        }, ajaxWait);
      });

      it('has the animation classes applied properly', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;

        fw.viewModel.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: namespaceName,
            afterRender: tools.expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              theElement = element;
              expect(theElement).not.toHaveClass(footworkAnimationClass);
            }).and.callThrough())
          });
        }).and.callThrough()));

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);
        fw.start(testContainer = tools.getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(afterRenderSpy).toHaveBeenCalled();
          expect(theElement).toHaveClass(footworkAnimationClass);
          done();
        }, ajaxWait);
      });

      it('can nest <viewModel> declarations', function(done) {
        var namespaceNameOuter = tools.randomString();
        var namespaceNameInner = tools.randomString();
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.viewModel.boot(this); });

        fw.viewModel.register(namespaceNameOuter, tools.expectCallOrder(0, initializeSpy));
        fw.viewModel.register(namespaceNameInner, tools.expectCallOrder(1, initializeSpy));

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<viewModel module="' + namespaceNameOuter + '">\
          <viewModel module="' + namespaceNameInner + '"></viewModel>\
        </viewModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalledTimes(2);
          done();
        }, ajaxWait);
      });
    });
  }
);
