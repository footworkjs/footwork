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
        }, 0);
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
        }, 0);
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
        }, 0);
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

        fw.start(testContainer = makeTestContainer('<' + componentNamespaceName + '></' + componentNamespaceName + '>'));

        expect(afterRenderSpy).not.toHaveBeenCalled();

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(theElement).not.toHaveClass(footworkAnimationClass);
          expect(afterRenderSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect(theElement).toHaveClass(footworkAnimationClass);
            done();
          }, 20);
        }, 0);
      });

      xit('can sequence animations', function(done) {
        var componentNamespaceName = generateNamespaceName();
        var footworkAnimatedElements = '.' + footworkAnimationClass;

        fw.components.register(componentNamespaceName, {
          template: '<div>a template</div>',
          sequenceAnimations: 20,
          viewModel: fw.viewModel.create({
            namespace: generateNamespaceName()
          })
        });

        testContainer = makeTestContainer('<div data-bind="foreach: things">\
          <' + componentNamespaceName + '></' + componentNamespaceName + '>\
        </div>');

        expect(testContainer).not.toContainElement(footworkAnimatedElements);

        fw.applyBindings({
          things: [ {}, {}, {}, {}, {} ]
        }, testContainer);

        setTimeout(function() {
          var $testContainer = $(testContainer);
          var currentThingLength = $testContainer.find(footworkAnimatedElements).length;

          expect(currentThingLength).toBeGreaterThan(0);

          setTimeout(function() {
            expect($testContainer.find(footworkAnimatedElements)).lengthToBeGreaterThan(currentThingLength);
            done();
          }, 120);
        }, 40);
      });

      it('can instantiate nested <components>', function(done) {
        var outerInitializeSpy = jasmine.createSpy('outerInitializeSpy');
        var innerInitializeSpy = jasmine.createSpy('innerInitializeSpy');
        var outerComponentNamespaceName = generateNamespaceName();
        var innerComponentNamespaceName = generateNamespaceName();

        fw.components.register(outerComponentNamespaceName, {
          template: '<' + innerComponentNamespaceName + '></' + innerComponentNamespaceName + '>',
          viewModel: fw.viewModel.create({
            initialize: expectCallOrder(0, outerInitializeSpy)
          })
        });

        fw.components.register(innerComponentNamespaceName, {
          template: '<div class="' + innerComponentNamespaceName + '"></div>',
          viewModel: fw.viewModel.create({
            initialize: expectCallOrder(1, innerInitializeSpy)
          })
        });

        expect(outerInitializeSpy).not.toHaveBeenCalled();
        expect(innerInitializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + outerComponentNamespaceName + '></' + outerComponentNamespaceName + '>'));

        setTimeout(function() {
          expect(outerInitializeSpy).toHaveBeenCalled();
          expect(innerInitializeSpy).toHaveBeenCalled();

          done();
        }, 20);
      });

      it('can pass params to a component viewModel', function(done) {
        var componentNamespaceName = generateNamespaceName();
        var initializeSpy;

        fw.components.register(componentNamespaceName, {
          template: '<div></div>',
          viewModel: fw.viewModel.create({
            initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
              expect(params).toEqual({ testValueOne: 1, testValueTwo: [1,2,3] });
            }))
          })
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + componentNamespaceName + ' params="testValueOne: 1, testValueTwo: [1,2,3]"></' + componentNamespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('can pass params to a \'default\' component viewModel', function(done) {
        var viewModelNamespaceName = generateNamespaceName();
        var componentNamespaceName = generateNamespaceName();
        var initializeSpy;
        var valueToFind = fw.utils.guid();

        fw.components.register(componentNamespaceName, {
          template: '<div class="passed-value" data-bind="text: someVariable"></div>'
        });

        fw.viewModel.register(viewModelNamespaceName, fw.viewModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
            this.boundViewModel = {
              someVariable: valueToFind
            };
          }).and.callThrough())
        }));

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<viewModel module="' + viewModelNamespaceName + '">\
          <div data-bind="with: boundViewModel">\
            <' + componentNamespaceName + ' params="$viewModel: $data"></' + componentNamespaceName + '>\
          </div>\
        </viewModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(testContainer).toContainText(valueToFind);

          done();
        }, 20);
      });

      it('can set and return fileExtensions correctly', function() {
        var originalExtensions = fw.components.fileExtensions();
        var extensions = {
          combined: '.combinedTest',
          viewModel: '.viewModelTest',
          template: '.templateTest'
        };

        expect(fw.components.fileExtensions()).not.toEqual(extensions);
        fw.components.fileExtensions(extensions);
        expect(fw.components.fileExtensions()).toEqual(extensions);

        // reset extensions back to normal
        fw.components.fileExtensions(originalExtensions);
        expect(fw.components.fileExtensions()).not.toEqual(extensions);
      });

      it('can set fileExtensions via a callback', function() {
        var originalExtensions = fw.components.fileExtensions();

        function prependName(name, withName) {
          return _.reduce({
            combined: '.' + name + 'combinedTest',
            viewModel: '.' + name + 'viewModelTest',
            template: '.' + name + 'templateTest'
          }, function(ext, extension, property) {
            ext[property] = (withName ? name : '') + extension;
            return ext;
          }, {});
        }

        var getFileExtensionsSpy = jasmine.createSpy('getFileExtensionsSpy', function getFileExtensions(componentName) {
          return prependName(componentName);
        }).and.callThrough();

        fw.components.fileExtensions(expectCallOrder([0, 1], getFileExtensionsSpy));

        var comp1Check = prependName('comp1', true);
        var comp2Check = prependName('comp2', true);

        expect(fw.components.getFileName('comp1', 'viewModel')).toEqual(comp1Check.viewModel);
        expect(fw.components.getFileName('comp2', 'viewModel')).toEqual(comp2Check.viewModel);

        // reset extensions back to normal
        fw.components.fileExtensions(originalExtensions);
        expect(fw.components.fileExtensions()).toEqual(originalExtensions);
      });

      it('can get the normal tag list', function() {
        var tagList = fw.components.getNormalTagList();
        expect(tagList).toContain('div');
        expect(tagList).toContain('span');
        expect(tagList).toContain('canvas');
      });

      it('can set a tag as not being a component', function() {
        var componentName = generateNamespaceName();

        expect(fw.components.tagIsComponent(componentName)).toBe(true);
        fw.components.tagIsComponent(componentName, false);
        expect(fw.components.tagIsComponent(componentName)).toBe(false);
      });

      it('can specify and load via the default location', function(done) {
        window.defaultComponentLocationLoaded = false;

        fw.components.defaultLocation({
          viewModel: 'tests/assets/fixtures/defaultComponentLocation/',
          template: 'tests/assets/fixtures/defaultComponentLocation/'
        });

        expect(window.defaultComponentLocationLoaded).toBe(false);

        fw.start(testContainer = makeTestContainer('<default-component-location></default-component-location>'));

        setTimeout(function() {
          expect(window.defaultComponentLocationLoaded).toBe(true);
          done();
        }, 20);
      });

      it('can specify a location and verify it', function() {
        var namespaceName = generateNamespaceName();
        var location = {
          viewModel: 'tests/assets/fixtures/registeredComponentLocation/',
          template: 'tests/assets/fixtures/registeredComponentLocation/'
        };

        fw.components.registerLocation(namespaceName, location);
        fw.components.registerLocation(/^regexp-test.*$/, location);

        expect(fw.components.getLocation(namespaceName)).toEqual(location);
        expect(fw.components.getLocation('regexp-test-regexp')).toEqual(location);
      });

      it('can register an array of components to a location and retrieve them proplerly', function() {
        var location = {
          viewModel: 'tests/assets/fixtures/registeredComponentLocation/',
          template: 'tests/assets/fixtures/registeredComponentLocation/'
        };

        var namespaceNames = [generateNamespaceName(), generateNamespaceName(), generateNamespaceName()];
        fw.components.registerLocation(namespaceNames, location);

        _.each(namespaceNames, function(namespaceName) {
          expect(fw.components.getLocation(namespaceName)).toEqual(location);
        });
      });

      it('can specify and load via a registered location', function(done) {
        window.registeredComponentLocationLoaded = false;

        fw.components.registerLocation('registered-component-location', {
          viewModel: 'tests/assets/fixtures/registeredComponentLocation/',
          template: 'tests/assets/fixtures/registeredComponentLocation/'
        });

        expect(window.registeredComponentLocationLoaded).toBe(false);

        fw.start(testContainer = makeTestContainer('<registered-component-location></registered-component-location>'));

        setTimeout(function() {
          expect(window.registeredComponentLocationLoaded).toBe(true);
          done();
        }, 20);
      });

      it('can specify and load via a registered location with a prefixed folder', function(done) {
        window.registeredComponentLocationPrefixedLoaded = false;

        fw.components.registerLocation('registered-component-location-prefixed', {
          viewModel: 'tests/assets/fixtures/',
          template: 'tests/assets/fixtures/'
        }, true);

        expect(window.registeredComponentLocationPrefixedLoaded).toBe(false);

        fw.start(testContainer = makeTestContainer('<registered-component-location-prefixed></registered-component-location-prefixed>'));

        setTimeout(function() {
          expect(window.registeredComponentLocationPrefixedLoaded).toBe(true);
          done();
        }, 20);
      });

      it('can specify and load via a registered RegExp-based location', function(done) {
        window.registeredRegExpComponentLocationLoaded = false;

        fw.components.registerLocation(/registered-regexp-comp.*/, {
          viewModel: 'tests/assets/fixtures/registeredRegExpComponentLocation/',
          template: 'tests/assets/fixtures/registeredRegExpComponentLocation/'
        });

        expect(window.registeredRegExpComponentLocationLoaded).toBe(false);

        fw.start(testContainer = makeTestContainer('<registered-regexp-component-location></registered-regexp-component-location>'));

        setTimeout(function() {
          expect(window.registeredRegExpComponentLocationLoaded).toBe(true);
          done();
        }, 20);
      });

      it('can specify and load via a registered location with full file name', function(done) {
        window.registeredComponentLocationFullNameLoaded = false;

        fw.components.registerLocation('registered-component-location-fullname', {
          viewModel: 'tests/assets/fixtures/registeredComponentLocation/registeredComponentLocationFullname.js',
          template: 'tests/assets/fixtures/registeredComponentLocation/registeredComponentLocationFullname.html'
        });

        expect(window.registeredComponentLocationFullNameLoaded).toBe(false);

        fw.start(testContainer = makeTestContainer('<registered-component-location-fullname></registered-component-location-fullname>'));

        setTimeout(function() {
          expect(window.registeredComponentLocationFullNameLoaded).toBe(true);
          done();
        }, 20);
      });

      it('can specify and load via a registered location for a combined component', function(done) {
        var container = document.getElementById('registeredCombinedComponentLocation');
        window.registeredComponentLocationLoaded = false;

        fw.components.registerLocation('registered-combined-component-location', { combined: 'tests/assets/fixtures/registeredComponentLocation/' });

        expect(window.registeredComponentLocationLoaded).toBe(false);

        fw.start(testContainer = makeTestContainer('<registered-combined-component-location></registered-combined-component-location>'));

        setTimeout(function() {
          expect(window.registeredComponentLocationLoaded).toBe(true);
          done();
        }, 20);
      });

      it('can specify and load via a registered location for a dataModel enabled component', function(done) {
        var container = document.getElementById('registeredDataModelComponentLocation');
        window.registeredComponentLocationLoaded = false;

        fw.components.registerLocation('registered-datamodel-component-location', {
          dataModel: 'tests/assets/fixtures/registeredComponentLocation/',
          template: 'tests/assets/fixtures/registeredComponentLocation/'
        });

        expect(window.registeredComponentLocationLoaded).toBe(false);

        fw.start(testContainer = makeTestContainer('<registered-datamodel-component-location></registered-datamodel-component-location>'));

        setTimeout(function() {
          expect(window.registeredComponentLocationLoaded).toBe(true);
          done();
        }, 20);
      });

      it('can specify and load via a registered location for a router enabled component', function(done) {
        var container = document.getElementById('registeredRouterComponentLocation');
        window.registeredComponentLocationLoaded = false;

        fw.components.registerLocation('registered-router-component-location', {
          router: 'tests/assets/fixtures/registeredComponentLocation/',
          template: 'tests/assets/fixtures/registeredComponentLocation/'
        });

        expect(window.registeredComponentLocationLoaded).toBe(false);

        fw.start(testContainer = makeTestContainer('<registered-router-component-location></registered-router-component-location>'));

        setTimeout(function() {
          expect(window.registeredComponentLocationLoaded).toBe(true);
          done();
        }, 20);
      });

      it('can load with a declarative initialization from an already registered combined module with a viewModel', function(done) {
        var viewModelSpy = jasmine.createSpy('viewModelSpy');
        var namespaceName = generateNamespaceName();

        define(namespaceName, ['footwork'], function(fw) {
          return fw.component({
            viewModel: expectCallOrder(0, viewModelSpy),
            template: '<div></div>'
          });
        });

        expect(viewModelSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(viewModelSpy).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('can load with a declarative initialization from an already registered combined module with a dataModel', function(done) {
        var dataModelSpy = jasmine.createSpy('dataModelSpy');
        var namespaceName = generateNamespaceName();

        define(namespaceName, ['footwork'], function(fw) {
          return fw.component({
            dataModel: expectCallOrder(0, dataModelSpy),
            template: '<div></div>'
          });
        });

        expect(dataModelSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(dataModelSpy).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('can load with a declarative initialization from an already registered combined module with a router', function(done) {
        var routerSpy = jasmine.createSpy('routerSpy');
        var namespaceName = generateNamespaceName();

        define(namespaceName, ['footwork'], function(fw) {
          return fw.component({
            router: expectCallOrder(0, routerSpy),
            template: '<div></div>'
          });
        });

        expect(routerSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(routerSpy).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('can be registered as template only which is resolved and injected correctly', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy');

        fw.components.registerLocation('template-only-component', { template: 'tests/assets/fixtures/' });
        fw.viewModel.register('templateOnlyInnerCheck', fw.viewModel.create({
          initialize: expectCallOrder(0, initializeSpy)
        }));

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<template-only-component></template-only-component>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, 20);
      });
    });
  }
);
