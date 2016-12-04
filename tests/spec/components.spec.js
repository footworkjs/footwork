define(['footwork', 'lodash', 'fetch-mock'],
  function(fw, _, fetchMock) {
    describe('components', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

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

        expect(fw.components.getFileName(namespaceName)).toBe(null);
      });

      it('can instantiate a registered component via a <declarative> statement', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy;

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can instantiate a registered component via a <declarative> statement with a dataModel', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy;

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can instantiate a registered component via a declarative statement with a router', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy;

        fw.components.register(namespaceName, {
          template: '<div>a template</div>',
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can instantiate a component registered using an element sourced from its id as its template', function(done) {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        fw.components.register(namespaceName, {
          template: { element: namespaceName },
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<div id=' + namespaceName + '>' + textToFind + '</div><' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect($(testContainer).find(namespaceName).text().indexOf(textToFind)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can properly throw an error when specifying an incorrect element sourced from its id as its template', function() {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        fw.components.register(namespaceName, {
          template: { element: namespaceName + 'NOMATCH' },
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        expect(function() {
          fw.start(testContainer = getFixtureContainer('<div id=' + namespaceName + '>' + textToFind + '</div><' + namespaceName + '></' + namespaceName + '>'));
        }).toThrow();
      });

      it('can properly throw an error when specifying an incorrect element config for its template', function() {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        fw.components.register(namespaceName, {
          template: { element: null },
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        expect(function() {
          fw.start(testContainer = getFixtureContainer('<div id=' + namespaceName + '>' + textToFind + '</div><' + namespaceName + '></' + namespaceName + '>'));
        }).toThrow();
      });

      it('can properly throw an error when specifying an incorrect template config', function() {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        fw.components.register(namespaceName, {
          template: { myName: 'Batman' },
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        expect(function() {
          fw.start(testContainer = getFixtureContainer('<div id=' + namespaceName + '>' + textToFind + '</div><' + namespaceName + '></' + namespaceName + '>'));
        }).toThrow();
      });

      it('can instantiate a component registered using an array of DOM nodes as its template', function(done) {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        testContainer = getFixtureContainer('<div id=' + namespaceName + '>' + textToFind + '</div><' + namespaceName + '></' + namespaceName + '>');

        var theDOMNode = document.createElement("div");
        theDOMNode.innerText = textToFind;

        fw.components.register(namespaceName, {
          template: [ theDOMNode ],
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough(),
          synchronous: true
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect($(testContainer).find(namespaceName).text().indexOf(textToFind)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can instantiate a component registered using an element instance as its template', function(done) {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        testContainer = getFixtureContainer('<div id=' + namespaceName + '>' + textToFind + '</div><' + namespaceName + '></' + namespaceName + '>');

        fw.components.register(namespaceName, {
          template: { element: document.getElementById(namespaceName) },
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough(),
          synchronous: true
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect($(testContainer).find(namespaceName).text().indexOf(textToFind)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can instantiate a component registered using a template element as its template', function(done) {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        testContainer = getFixtureContainer('<template id=' + namespaceName + '>' + textToFind + '</template><' + namespaceName + '></' + namespaceName + '>');

        fw.components.register(namespaceName, {
          template: { element: document.getElementById(namespaceName) },
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough(),
          synchronous: true
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect($(testContainer).find(namespaceName).text().indexOf(textToFind)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can instantiate a component registered using a script element as its template', function(done) {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        testContainer = getFixtureContainer('<script id=' + namespaceName + ' type="text">' + textToFind + '</script><' + namespaceName + '></' + namespaceName + '>');

        fw.components.register(namespaceName, {
          template: { element: document.getElementById(namespaceName) },
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough(),
          synchronous: true
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect($(testContainer).find(namespaceName).text().indexOf(textToFind)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can instantiate a component registered using a textarea element as its template', function(done) {
        var namespaceName = generateNamespaceName();
        var textToFind = randomString();
        var initializeSpy;

        testContainer = getFixtureContainer('<textarea id=' + namespaceName + '>' + textToFind + '</textarea><' + namespaceName + '></' + namespaceName + '>');

        fw.components.register(namespaceName, {
          template: { element: document.getElementById(namespaceName) },
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this);
          }).and.callThrough(),
          synchronous: true
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect($(testContainer).find(namespaceName).text().indexOf(textToFind)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('calls the dispose() callback of a viewModel when the parent component is removed from the DOM', function(done) {
        var componentNamespaceName = generateNamespaceName();
        var viewModelNamespaceName = generateNamespaceName();
        var viewModelInitializeSpy;
        var componentInitializeSpy;
        var componentOnDisposeSpy;
        var containerViewModel;
        var valueToCheckFor = randomString();

        fw.viewModel.register(viewModelNamespaceName, viewModelInitializeSpy = jasmine.createSpy('viewModelInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: viewModelNamespaceName
          });
          this.show = fw.observable(true);
          containerViewModel = this;
        }).and.callThrough());

        fw.components.register(componentNamespaceName, {
          template: '<span data-bind="text: someProperty"></span>',
          viewModel: componentInitializeSpy = jasmine.createSpy('componentInitializeSpy', function() {
            fw.viewModel.boot(this, {
              namespace: componentNamespaceName,
              onDispose: componentOnDisposeSpy = jasmine.createSpy('componentOnDisposeSpy', function(containingElement) {
                expect(containingElement.tagName).toBe(componentNamespaceName.toUpperCase());
              }).and.callThrough()
            });
            this.someProperty = valueToCheckFor;
          }).and.callThrough()
        });

        expect(viewModelInitializeSpy).not.toHaveBeenCalled();
        expect(componentInitializeSpy).not.toHaveBeenCalled();
        expect(componentOnDisposeSpy).toBe(undefined);

        fw.start(testContainer = getFixtureContainer(
          '<viewModel module="' + viewModelNamespaceName + '">\
            <div class="content" data-bind="if: show">\
              <' + componentNamespaceName + '></' + componentNamespaceName + '>\
            </div>\
          </viewModel>'
        ));

        setTimeout(function() {
          expect(viewModelInitializeSpy).toHaveBeenCalled();
          expect(componentInitializeSpy).toHaveBeenCalled();
          expect($(testContainer).find('.content').text().indexOf(valueToCheckFor)).not.toBe(-1);

          containerViewModel.show(false);

          expect(componentOnDisposeSpy).toHaveBeenCalled();
          expect($(testContainer).find('.content').text().indexOf(valueToCheckFor)).toBe(-1);
          done();
        }, ajaxWait);
      });

      it('has the animation classes applied properly', function(done) {
        var componentNamespaceName = generateNamespaceName();
        var viewModelNamespaceName = generateNamespaceName();
        var initializeSpy;
        var afterRenderSpy;
        var theElement;

        fw.components.register(componentNamespaceName, {
          template: '<div>a template</div>',
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function() {
            fw.viewModel.boot(this, {
              afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
                theElement = element;
                expect($(theElement).hasClass(fw.animationClass.animateIn)).toBe(false);
              }).and.callThrough()
            })
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<' + componentNamespaceName + '></' + componentNamespaceName + '>'));

        expect(afterRenderSpy).toBe(undefined);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect($(theElement).hasClass(fw.animationClass.animateIn)).toBe(false);
          expect(afterRenderSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect($(theElement).hasClass(fw.animationClass.animateIn)).toBe(true);
            done();
          }, ajaxWait);
        }, 0);
      });

      it('can sequence animations', function(done) {
        var componentNamespaceName = generateNamespaceName();
        var footworkAnimatedElements = '.' + fw.animationClass.animateIn;

        fw.components.register(componentNamespaceName, {
          template: '<div class="fade-in-from-bottom">a template</div>',
          viewModel: function() {
            fw.viewModel.boot(this, {
              namespace: componentNamespaceName,
              sequenceAnimations: 30
            })
          }
        });

        testContainer = getFixtureContainer('<div data-bind="foreach: things">\
          <' + componentNamespaceName + '></' + componentNamespaceName + '>\
        </div>');

        expect($(testContainer).find(footworkAnimatedElements).length).toBe(0);

        fw.applyBindings({
          things: [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ]
        }, testContainer);

        setTimeout(function() {
          var $testContainer = $(testContainer);
          var currentThingLength = $testContainer.find(footworkAnimatedElements).length;

          expect(currentThingLength).toBeGreaterThan(0);

          setTimeout(function() {
            expect($testContainer.find(footworkAnimatedElements)).lengthToBeGreaterThan(currentThingLength);
            done();
          }, 120);
        }, 100);
      });

      it('can instantiate nested <components>', function(done) {
        var outerInitializeSpy = jasmine.createSpy('outerInitializeSpy');
        var innerInitializeSpy = jasmine.createSpy('innerInitializeSpy');
        var outerComponentNamespaceName = generateNamespaceName();
        var innerComponentNamespaceName = generateNamespaceName();

        fw.components.register(outerComponentNamespaceName, {
          template: '<' + innerComponentNamespaceName + '></' + innerComponentNamespaceName + '>',
          viewModel: outerInitializeSpy
        });

        fw.components.register(innerComponentNamespaceName, {
          template: '<div class="' + innerComponentNamespaceName + '"></div>',
          viewModel: innerInitializeSpy
        });

        expect(outerInitializeSpy).not.toHaveBeenCalled();
        expect(innerInitializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<' + outerComponentNamespaceName + '></' + outerComponentNamespaceName + '>'));

        setTimeout(function() {
          expect(outerInitializeSpy).toHaveBeenCalled();
          expect(innerInitializeSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can pass params to a component viewModel', function(done) {
        var componentNamespaceName = generateNamespaceName();
        var initializeSpy;

        fw.components.register(componentNamespaceName, {
          template: '<div></div>',
          viewModel: initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
            expect(params).toEqual({ testValueOne: 1, testValueTwo: [1,2,3] });
          })
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<' + componentNamespaceName + ' params="testValueOne: 1, testValueTwo: [1,2,3]"></' + componentNamespaceName + '>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can set and return fileExtensions correctly', function() {
        var originalExtensions = fw.components.fileExtensions();
        var fileName = randomString();
        var extensions = {
          combined: '.combinedTest',
          viewModel: '.viewModelTest',
          template: function() {
            return '.templateTest';
          }
        };

        expect(fw.components.fileExtensions()).not.toEqual(extensions);
        fw.components.fileExtensions(extensions);
        expect(fw.components.fileExtensions()).toEqual(extensions);
        expect(fw.components.getFileName(fileName, 'template')).toEqual(fileName + extensions.template());

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
            template: function() {
              return (withName ? name : '') + '.' + 'templateTest';
            }
          }, function(ext, extension, property) {
            ext[property] = _.isFunction(extension) ? extension() : (withName ? name : '');
            return ext;
          }, {});
        }

        var getFileExtensionsSpy = jasmine.createSpy('getFileExtensionsSpy', function getFileExtensions(componentName) {
          return prependName(componentName);
        }).and.callThrough();

        fw.components.fileExtensions(getFileExtensionsSpy);

        var comp1Check = prependName('comp1', true);
        var comp2Check = prependName('comp2', true);

        expect(fw.components.getFileName('comp1', 'viewModel')).toEqual(comp1Check.viewModel);
        expect(fw.components.getFileName('comp2', 'viewModel')).toEqual(comp2Check.viewModel);
        expect(fw.components.getFileName('comp2', 'template')).toEqual(comp2Check.template);

        // reset extensions back to normal
        fw.components.fileExtensions(originalExtensions);
        expect(fw.components.fileExtensions()).toEqual(originalExtensions);
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
        var namespaceName = 'registered-component-location';

        fw.components.registerLocation('registered-component-location', {
          viewModel: 'tests/assets/fixtures/registeredComponentLocation/',
          template: 'tests/assets/fixtures/registeredComponentLocation/'
        });

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can specify and load a template-only component via a registered location', function(done) {
        var namespaceName = 'template-only-component';
        var templateOnlyInnerCheckSpy = jasmine.createSpy();

        fw.viewModel.register('templateOnlyInnerCheck', templateOnlyInnerCheckSpy);

        fw.components.registerLocation(namespaceName, {
          template: 'tests/assets/fixtures/' + namespaceName + '.html'
        });

        expect(templateOnlyInnerCheckSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(templateOnlyInnerCheckSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('throws error when not provided a component name to register', function() {
        var namespaceName = 'template-only-component';

        expect(function() { fw.components.register(null, function() {}) }).toThrow();
      });

      it('can specify and load via a registered combined component module', function(done) {
        var namespaceName = 'registered-combined-component-location';

        fw.components.registerLocation(namespaceName, {
          combined: 'tests/assets/fixtures/registeredComponentLocation/registered-combined-component-location.js'
        });

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can specify and load via a registered combined component module defined with a path', function(done) {
        var namespaceName = 'registered-combined-component-location-path';

        fw.components.registerLocation(namespaceName, {
          combined: 'tests/assets/fixtures/registeredComponentLocation/'
        });

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can specify and load via a registered location with a prefixed folder', function(done) {
        var namespaceName = 'registered-component-location-prefixed';

        fw.components.registerLocation(namespaceName, {
          viewModel: 'tests/assets/fixtures/',
          template: 'tests/assets/fixtures/'
        }, true);

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can specify and load via a registered RegExp-based location', function(done) {
        var namespaceName = 'registered-regexp-component-location';

        fw.components.registerLocation(/registered-regexp-comp.*/, {
          viewModel: 'tests/assets/fixtures/registeredRegExpComponentLocation/',
          template: 'tests/assets/fixtures/registeredRegExpComponentLocation/'
        });

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can specify and load via a registered location with full file name', function(done) {
        var namespaceName = 'registered-component-location-fullname';

        fw.components.registerLocation(namespaceName, {
          viewModel: 'tests/assets/fixtures/registeredComponentLocation/registeredComponentLocationFullname.js',
          template: 'tests/assets/fixtures/registeredComponentLocation/registeredComponentLocationFullname.html'
        });

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can specify and load via a registered location for a dataModel enabled component', function(done) {
        var namespaceName = 'registered-datamodel-component-location';

        fw.components.registerLocation(namespaceName, {
          dataModel: 'tests/assets/fixtures/registeredComponentLocation/',
          template: 'tests/assets/fixtures/registeredComponentLocation/'
        });

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can specify and load via a registered location for a router enabled component', function(done) {
        var namespaceName = 'registered-router-component-location';

        fw.components.registerLocation(namespaceName, {
          router: 'tests/assets/fixtures/registeredComponentLocation/',
          template: 'tests/assets/fixtures/registeredComponentLocation/'
        });

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<' + namespaceName + '></' + namespaceName + '>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });
    });
  }
);
