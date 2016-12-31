define(['footwork', 'lodash', 'fetch-mock'],
  function(fw, _, fetchMock) {
    describe('dataModel', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

      it('has the ability to create a dataModel', function() {
        var BadDataModel = function DataModel() {
          var self = fw.dataModel.boot();
        };
        expect(function() { new BadDataModel() }).toThrow();

        var AlsoBadDataModel = function DataModel() {
          fw.dataModel.boot(this);
          fw.dataModel.boot(this);
        };
        expect(function() { new AlsoBadDataModel() }).toThrow();

        var DataModel = function DataModel() {
          var self = fw.dataModel.boot(this);
          expect(self).toBe(this);
        };

        var vm = new DataModel();

        expect(vm).toBeA('dataModel');
        expect(vm).toBeInstanceOf(DataModel);
      });

      it('has the ability to create a dataModel with a correctly defined namespace whos name we can retrieve', function() {
        var namespaceName = generateNamespaceName();
        var Model = function () {
          var self = fw.dataModel.boot(this, {
            namespace: namespaceName
          });
        };

        var modelA = new Model();

        expect(modelA.$namespace).toBeAn('object');
        expect(modelA.$namespace.getName()).toBe(namespaceName);
      });

      it('calls afterRender after initialize with the correct target element when creating and binding a new instance', function() {
        var checkForClass = 'check-for-class';
        var afterRenderSpy;

        var ModelA = jasmine.createSpy('ModelASpy', function() {
          fw.dataModel.boot(this, {
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(containingElement) {
              expect(containingElement.className.indexOf(checkForClass)).not.toBe(-1);
            }).and.callThrough()
          });

          expect(afterRenderSpy).not.toHaveBeenCalled();
        }).and.callThrough();

        expect(ModelA).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        fw.applyBindings(new ModelA(), testContainer = getFixtureContainer('', '<div class="' + checkForClass + '"></div>'));

        expect(ModelA).toHaveBeenCalled();
        expect(afterRenderSpy).toHaveBeenCalled();
      });

      it('can register and get a registered dataModel', function() {
        var namespaceName = generateNamespaceName();
        expect(fw.dataModel.isRegistered(namespaceName)).toBe(false);

        var Model = jasmine.createSpy('Model');
        fw.dataModel.register(namespaceName, Model);

        expect(fw.dataModel.isRegistered(namespaceName)).toBe(true);
        expect(fw.dataModel.getRegistered(namespaceName)).toBe(Model);
        expect(Model).not.toHaveBeenCalled();
      });

      it('can get all instantiated dataModels', function() {
        var DataModel = function() {
          fw.dataModel.boot(this);
        };
        var dataModels = [ new DataModel(), new DataModel() ];

        expect(_.keys(fw.dataModel.get())).lengthToBeGreaterThan(0);
      });

      it('can get instantiated dataModels', function() {
        var dataModels = [];
        var specificDataModelNamespace = generateNamespaceName();
        var DataModel = function() {
          fw.dataModel.boot(this, { namespace: specificDataModelNamespace });
        };
        var numToMake = 8;

        var singleDataModelNamespace = generateNamespaceName();
        new (function() {
          fw.dataModel.boot(this, { namespace: singleDataModelNamespace });
        })();
        expect(fw.dataModel.get(singleDataModelNamespace)).toBeAn('object');

        for(var x = numToMake; x; x--) {
          dataModels.push(new DataModel());
        }

        expect(fw.dataModel.get(generateNamespaceName())).toBe(undefined);
        expect(fw.dataModel.get(specificDataModelNamespace)).lengthToBe(numToMake);
      });

      it('can bind to the DOM using a dataModel declaration', function(done) {
        var wasInitialized = false;
        var namespaceName = generateNamespaceName();
        var DataModelSpy = jasmine.createSpy('DataModelSpy', function() {
          fw.dataModel.boot(this, {
            namespace: namespaceName
          });
        }).and.callThrough();

        fw.dataModel.register(namespaceName, DataModelSpy);

        expect(DataModelSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(DataModelSpy).toHaveBeenCalledTimes(1);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a shared instance', function(done) {
        var namespaceName = generateNamespaceName();
        var boundPropertyValue = _.uniqueId('random');

        fw.dataModel.register(namespaceName, {
          instance: {
            boundProperty: boundPropertyValue
          }
        });

        testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </dataModel>');

        fw.start(testContainer);

        setTimeout(function() {
          expect(testContainer.innerHTML.indexOf(boundPropertyValue)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a generated instance', function(done) {
        var namespaceName = generateNamespaceName();
        var boundPropertyValue = _.uniqueId('random');
        var boundPropertyValueElement = boundPropertyValue + '-element';
        var createDataModelInstance;

        fw.dataModel.register(namespaceName, {
          createViewModel: createDataModelInstance = jasmine.createSpy('createDataModel', function(params, info) {
            expect(params.thing).toBe(boundPropertyValue);
            expect(info.element.id).toBe(boundPropertyValueElement);

            return {
              boundProperty: boundPropertyValue
            };
          }).and.callThrough()
        });

        expect(createDataModelInstance).not.toHaveBeenCalled();
        testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '" id="' + boundPropertyValueElement + '" params="thing: \'' + boundPropertyValue + '\'">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </dataModel>');

        fw.start(testContainer);
        expect(testContainer.children[0].innerHTML.indexOf(boundPropertyValue)).toBe(-1);

        setTimeout(function() {
          expect(createDataModelInstance).toHaveBeenCalled();
          expect(testContainer.innerHTML.indexOf(boundPropertyValue)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('has the animation classes applied properly', function(done) {
        var namespaceName = generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;

        fw.dataModel.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.dataModel.boot(this, {
            namespace: namespaceName,
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              theElement = element;
              expect(theElement.className.indexOf(fw.animationClass.animateIn)).toBe(-1);
            }).and.callThrough()
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);
        fw.start(testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(afterRenderSpy).toHaveBeenCalled();
          expect(theElement.className.indexOf(fw.animationClass.animateIn)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can nest dataModel declarations', function(done) {
        var namespaceNameOuter = _.uniqueId('random');
        var namespaceNameInner = _.uniqueId('random');
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.dataModel.boot(this); });

        fw.dataModel.register(namespaceNameOuter, initializeSpy);
        fw.dataModel.register(namespaceNameInner, initializeSpy);

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<dataModel module="' + namespaceNameOuter + '">\
          <dataModel module="' + namespaceNameInner + '"></dataModel>\
        </dataModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalledTimes(2);
          done();
        }, ajaxWait);
      });

      it('can pass parameters through a dataModel declaration', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy;

        fw.dataModel.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
          fw.dataModel.boot(this);
          expect(params.testValueOne).toBe(1);
          expect(params.testValueTwo).toEqual([1,2,3]);
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '" params="testValueOne: 1, testValueTwo: [1,2,3]"></dataModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('calls onDispose when the containing element is removed from the DOM', function(done) {
        var namespaceName = generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;
        var onDisposeSpy;

        var WrapperDataModel = initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.dataModel.boot(this);
          this.showIt = fw.observable(true);
        }).and.callThrough();

        fw.dataModel.register(namespaceName, function() {
          fw.dataModel.boot(this, {
            namespace: namespaceName,
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              theElement = element;
              expect(theElement.tagName).toBe('DATAMODEL');
            }).and.callThrough(),
            onDispose: onDisposeSpy = jasmine.createSpy('onDisposeSpy', function(element) {
              expect(element).toBe(theElement);
            }).and.callThrough()
          });
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        var wrapper = new WrapperDataModel();

        expect(initializeSpy).toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        fw.applyBindings(wrapper, testContainer = getFixtureContainer('<div data-bind="if: showIt">\
          <dataModel module="' + namespaceName + '"></dataModel>\
        </div>'));

        setTimeout(function() {
          expect(onDisposeSpy).not.toHaveBeenCalled();

          wrapper.showIt(false);

          expect(afterRenderSpy).toHaveBeenCalled();
          expect(onDisposeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can have a registered location set and retrieved proplerly', function() {
        var namespaceName = generateNamespaceName();
        fw.dataModel.registerLocation(namespaceName, '/bogus/path');
        expect(fw.dataModel.getLocation(namespaceName)).toBe('/bogus/path');
        fw.dataModel.registerLocation(/regexp.*/, '/bogus/path');
        expect(fw.dataModel.getLocation('regexp-model')).toBe('/bogus/path');
      });

      it('can have an array of models registered to a location and retrieved proplerly', function() {
        var namespaceNames = [ generateNamespaceName(), generateNamespaceName() ];
        fw.dataModel.registerLocation(namespaceNames, '/bogus/path');
        expect(fw.dataModel.getLocation(namespaceNames[0])).toBe('/bogus/path');
        expect(fw.dataModel.getLocation(namespaceNames[1])).toBe('/bogus/path');
      });

      it('can have a registered location with filename set and retrieved proplerly', function() {
        var namespaceName = generateNamespaceName();
        fw.dataModel.registerLocation(namespaceName, '/bogus/path/__file__.js');
        expect(fw.dataModel.getLocation(namespaceName)).toBe('/bogus/path/__file__.js');
      });

      it('can have a specific file extension set and used correctly', function() {
        var namespaceName = generateNamespaceName();
        var customExtension = '.jscript';
        fw.dataModel.fileExtensions = customExtension;
        fw.dataModel.registerLocation(namespaceName, '/bogus/path/');

        expect(fw.dataModel.getFileName(namespaceName)).toBe(namespaceName + customExtension);

        fw.dataModel.fileExtensions = '.js';
      });

      it('can load via registered dataModel with a declarative initialization', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.dataModel.boot(this, { namespace: namespaceName }); });

        fw.dataModel.register(namespaceName, initializeSpy);

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location', function(done) {
        var namespaceName = 'AMDDataModel';

        fw.dataModel.registerLocation(namespaceName, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
        var namespaceName = 'AMDDataModelRegexp-test';

        fw.dataModel.registerLocation(/AMDDataModelRegexp-.*/, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
        var namespaceName = 'AMDDataModelFullName';

        fw.dataModel.registerLocation(namespaceName, 'tests/assets/fixtures/' + namespaceName + '.js');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('mapTo correctly throws error without a specified instance', function() {
        expect(function() {fw.observable().map('firstName')}).toThrow();
      });

      it('can have an observable mapped and remapped correctly at the parent level', function() {
        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person({
          firstName: 'John',
          lastName: 'Smith'
        });

        expect(Person).toHaveBeenCalled();

        expect(person.hasMappedField('firstName')).toBe(true);
        expect(person.hasMappedField('lastName')).toBe(true);
      });

      it('can have an observable mapped and unmapped correctly', function() {
        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var personData = {
          firstName: _.uniqueId('random'),
          lastName: _.uniqueId('random')
        };
        var personDataNoFirstName = {
          lastName: personData.lastName
        };

        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();

        expect(person.hasMappedField('firstName')).toBe(true);
        expect(person.hasMappedField('lastName')).toBe(true);
        expect(person.get()).toEqual(personData);

        person.$removeMap('firstName');
        expect(person.hasMappedField('firstName')).toBe(false);
        expect(person.get()).toEqual(personDataNoFirstName);
      });

      it('can have an observable mapped correctly at a nested level', function() {
        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
          this.movieCollection = {
            action: fw.observableArray(person.movies.action).map('movies.action', this),
            drama: fw.observableArray(person.movies.drama).map('movies.drama', this),
            comedy: fw.observableArray(person.movies.comedy).map('movies.comedy', this),
            horror: fw.observableArray(person.movies.horror).map('movies.horror', this)
          };
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person({
          firstName: 'John',
          lastName: 'Smith',
          movies: {
            action: ['Commando', 'Predator', 'Timecop', 'Terminator'],
            drama: ['The Shawshank Redemption'],
            comedy: ['Dumb and Dumber', 'Billy Madison'],
            horror: ['Friday the 13th', 'Jason']
          }
        });

        expect(Person).toHaveBeenCalled();

        expect(person.hasMappedField('firstName')).toBe(true);
        expect(person.hasMappedField('lastName')).toBe(true);
        expect(person.hasMappedField('movies.action')).toBe(true);
        expect(person.hasMappedField('movies.drama')).toBe(true);
        expect(person.hasMappedField('movies.comedy')).toBe(true);
        expect(person.hasMappedField('movies.horror')).toBe(true);
      });

      it('can have mapped observables disposed of properly when parent dataModel is removed from the DOM', function(done) {
        var wasInitialized = false;
        var namespaceName = generateNamespaceName();
        var containerViewModelNamespace = generateNamespaceName();
        var containerVM;
        var dataModel;

        fw.viewModel.register(containerViewModelNamespace, function ContainerViewModel() {
          containerVM = this;
          this.show = fw.observable(true);
        });

        var DataModelSpy = jasmine.createSpy('DataModelSpy', function() {
          dataModel = this;
          fw.dataModel.boot(this, {
            namespace: namespaceName
          });
          this.prop = fw.observable().map('prop', this);
        }).and.callThrough();

        fw.dataModel.register(namespaceName, DataModelSpy);

        expect(DataModelSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<viewModel module="' + containerViewModelNamespace + '">\
          <!-- ko if: show -->\
            <dataModel module="' + namespaceName + '"></dataModel>\
          <!-- /ko -->\
        </viewModel>'));

        setTimeout(function() {
          expect(DataModelSpy).toHaveBeenCalledTimes(1);
          expect(dataModel.isDirty()).toBe(false);

          dataModel.prop('something');
          expect(dataModel.isDirty()).toBe(true);

          dataModel.clean();
          expect(dataModel.isDirty()).toBe(false);

          containerVM.show(false);
          expect(dataModel.isDirty()).toBe(false);
          dataModel.prop('something');
          expect(dataModel.isDirty()).toBe(false);

          done();
        }, ajaxWait);
      });

      it('can have observables mapped and retreived correctly via get', function() {
        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this);
          this.id = fw.observable(person.id).map('id', this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
          this.movieCollection = {
            action: fw.observableArray(person.movies.action).map('movies.action', this),
            drama: fw.observableArray(person.movies.drama).map('movies.drama', this),
            comedy: fw.observableArray(person.movies.comedy).map('movies.comedy', this),
            horror: fw.observableArray(person.movies.horror).map('movies.horror', this)
          };
        }).and.callThrough();

        var personData = {
          id: undefined,
          firstName: 'John',
          lastName: 'Smith',
          movies: {
            action: ['Commando', 'Predator', 'Timecop', 'Terminator'],
            drama: ['The Shawshank Redemption'],
            comedy: ['Dumb and Dumber', 'Billy Madison'],
            horror: ['Friday the 13th', 'Jason']
          }
        };

        expect(Person).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(person.get()).toEqual(personData);
      });

      it('can have observables mapped and a specific one retreived correctly via get', function() {
        var Person = jasmine.createSpy('initializeSpy', function(person) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
          this.movieCollection = {
            action: fw.observableArray(person.movies.action).map('movies.action', this),
            drama: fw.observableArray(person.movies.drama).map('movies.drama', this),
            comedy: fw.observableArray(person.movies.comedy).map('movies.comedy', this),
            horror: fw.observableArray(person.movies.horror).map('movies.horror', this)
          };
        }).and.callThrough();

        var personData = {
          firstName: 'John',
          lastName: 'Smith',
          movies: {
            action: ['Commando', 'Predator', 'Timecop', 'Terminator'],
            drama: ['The Shawshank Redemption'],
            comedy: ['Dumb and Dumber', 'Billy Madison'],
            horror: ['Friday the 13th', 'Jason']
          }
        };

        expect(Person).not.toHaveBeenCalled();
        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(person.get('firstName')).toEqual(personData.firstName);
        expect(person.get('movies')).toEqual(personData.movies);
        expect(person.get('movies.action')).toEqual(personData.movies.action);
      });

      it('can have observables mapped and an array of values retreived correctly via get', function() {
        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
          this.movieCollection = {
            action: fw.observableArray(person.movies.action).map('movies.action', this),
            drama: fw.observableArray(person.movies.drama).map('movies.drama', this),
            comedy: fw.observableArray(person.movies.comedy).map('movies.comedy', this),
            horror: fw.observableArray(person.movies.horror).map('movies.horror', this)
          };
        }).and.callThrough();

        var personData = {
          firstName: 'John',
          lastName: 'Smith',
          movies: {
            action: ['Commando', 'Predator', 'Timecop', 'Terminator'],
            drama: ['The Shawshank Redemption'],
            comedy: ['Dumb and Dumber', 'Billy Madison'],
            horror: ['Friday the 13th', 'Jason']
          }
        };

        expect(Person).not.toHaveBeenCalled();
        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(person.get(['firstName', 'lastName'])).toEqual(_.pick(personData, ['firstName', 'lastName']));
        expect(function() { person.get(null); }).toThrow();
      });

      it('can have observables mapped and converted into JSON form using JSON.stringify', function() {
        var Person = jasmine.createSpy('initializeSpy', function(person) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
          this.movieCollection = {
            action: fw.observableArray(person.movies.action).map('movies.action', this),
            drama: fw.observableArray(person.movies.drama).map('movies.drama', this),
            comedy: fw.observableArray(person.movies.comedy).map('movies.comedy', this),
            horror: fw.observableArray(person.movies.horror).map('movies.horror', this)
          };
        }).and.callThrough();

        var personData = {
          firstName: 'John',
          lastName: 'Smith',
          movies: {
            action: ['Commando', 'Predator', 'Timecop', 'Terminator'],
            drama: ['The Shawshank Redemption'],
            comedy: ['Dumb and Dumber', 'Billy Madison'],
            horror: ['Friday the 13th', 'Jason']
          }
        };

        expect(Person).not.toHaveBeenCalled();
        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(JSON.parse(JSON.stringify(person))).toEqual(personData);
      });

      it('can have a correct dirtyMap() produced', function() {
        var Person = jasmine.createSpy('initializeSpy', function(person) {
          fw.dataModel.boot(this);
          this.id = fw.observable(person.id).map('id', this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
          this.movieCollection = {
            action: fw.observableArray(person.movies.action).map('movies.action', this),
            drama: fw.observableArray(person.movies.drama).map('movies.drama', this),
            comedy: fw.observableArray(person.movies.comedy).map('movies.comedy', this),
            horror: fw.observableArray(person.movies.horror).map('movies.horror', this)
          };
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();
        var person = new Person({
          firstName: 'John',
          lastName: 'Smith',
          movies: {
            action: ['Commando', 'Predator', 'Timecop', 'Terminator'],
            drama: ['The Shawshank Redemption'],
            comedy: ['Dumb and Dumber', 'Billy Madison'],
            horror: ['Friday the 13th', 'Jason']
          }
        });
        expect(Person).toHaveBeenCalled();

        expect(person.dirtyMap()).toEqual({
          "id": false,
          "firstName": false,
          "lastName": false,
          "movies.action": false,
          "movies.drama": false,
          "movies.comedy": false,
          "movies.horror": false
        });

        person.firstName('test');
        person.movieCollection.comedy.push('Kung Fury');

        expect(person.dirtyMap()).toEqual({
          "id": false,
          "firstName": true,
          "lastName": false,
          "movies.action": false,
          "movies.drama": false,
          "movies.comedy": true,
          "movies.horror": false
        });

        person.clean('firstName');

        expect(person.dirtyMap()).toEqual({
          "id": false,
          "firstName": false,
          "lastName": false,
          "movies.action": false,
          "movies.drama": false,
          "movies.comedy": true,
          "movies.horror": false
        });
      });

      it('can load data in using dataModel.set()', function() {
        var Person = jasmine.createSpy('initializeSpy', function(person) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable().map('firstName', this);
          this.lastName = fw.observable().map('lastName', this);
          this.movieCollection = {
            action: fw.observableArray().map('movies.action', this),
            drama: fw.observableArray().map('movies.drama', this),
            comedy: fw.observableArray().map('movies.comedy', this),
            horror: fw.observableArray().map('movies.horror', this)
          };
        }).and.callThrough();

        var personData = {
          firstName: 'John',
          lastName: 'Smith',
          movies: {
            action: ['Commando', 'Predator', 'Timecop', 'Terminator'],
            drama: ['The Shawshank Redemption'],
            comedy: ['Dumb and Dumber', 'Billy Madison'],
            horror: ['Friday the 13th', 'Jason']
          }
        };

        expect(Person).not.toHaveBeenCalled();

        var person = new Person();

        expect(Person).toHaveBeenCalled();
        expect(person.firstName()).toEqual(undefined);

        person.set(personData);

        expect(person.firstName()).toEqual(personData.firstName);
      });

      it('can (re)map the primary key', function() {
        var Person = jasmine.createSpy('PersonSpy', function(personData) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable().map('firstName', this);
          this.lastName = fw.observable().map('lastName', this);

          this.id = fw.observable().map('id', this);
          expect(this.isNew()).toBe(true);

          this.movieCollection = {
            action: fw.observableArray().map('movies.action', this),
            drama: fw.observableArray().map('movies.drama', this),
            comedy: fw.observableArray().map('movies.comedy', this),
            horror: fw.observableArray().map('movies.horror', this)
          };

          this.id = fw.observable(true).map('id', this);
          expect(this.isNew()).toBe(false);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person();

        expect(Person).toHaveBeenCalled();
      });

      it('can correctly be flagged as isDirty when a mapped field value is altered', function() {
        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
          this.movieCollection = {
            action: fw.observableArray(person.movies.action).map('movies.action', this),
            drama: fw.observableArray(person.movies.drama).map('movies.drama', this),
            comedy: fw.observableArray(person.movies.comedy).map('movies.comedy', this),
            horror: fw.observableArray(person.movies.horror).map('movies.horror', this)
          };
        }).and.callThrough();

        var personData = {
          firstName: 'John',
          lastName: 'Smith',
          movies: {
            action: ['Commando', 'Predator', 'Timecop', 'Terminator'],
            drama: ['The Shawshank Redemption'],
            comedy: ['Dumb and Dumber', 'Billy Madison'],
            horror: ['Friday the 13th', 'Jason']
          }
        };

        expect(Person).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(person.isDirty()).toBe(false);

        person.firstName('test123');

        expect(person.isDirty()).toBe(true);
      });

      it('can correctly throw an error when a requested operation occurs without a url specified', function() {
        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person();

        expect(Person).toHaveBeenCalled();

        expect(function() { person.save() }).toThrow();
      });

      it('can correctly POST data on initial save()', function(done) {
        var mockUrl = generateUrl();
        var postValue = _.uniqueId('random');
        var responseData = {
          "id": 1,
          "firstName": postValue,
          "lastName": null,
          "email": null
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl
          });
          person = person || {};
          this.id = fw.observable(person.id).map('id', this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
          this.lastName = fw.observable(person.lastName).map('lastName', this);
          this.email = fw.observable(person.email).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person();

        expect(Person).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(postValue);

        fetchMock.restore().post(mockUrl, function(url, options) {
          expect(options.headers['content-type']).toBe('application/json');
          return responseData;
        });
        expect(person.save()).toBeA('promise');

        setTimeout(function() {
          expect(person.id()).toBe(1);
          expect(person.firstName()).toBe(postValue);
          done();
        }, ajaxWait);
      });

      it('can correctly DELETE data on destroy()', function(done) {
        var postValue = _.uniqueId('random');
        var responseData = {
          "id": 1,
          "firstName": postValue,
          "lastName": null,
          "email": null
        };
        var mockUrl = generateUrl();

        var Person = function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl
          });

          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        };

        var person = new Person(responseData);
        var nonPerson = new Person(_.extend({}, responseData, { id: undefined }));

        fetchMock.restore().delete(mockUrl + '/' + responseData.id, responseData);

        var destroyPromise;
        var nonPersonDestroyPromise;
        expect(destroyPromise = person.destroy()).toBeA('promise');
        expect(nonPersonDestroyPromise = nonPerson.destroy()).toBeA('promise');

        setTimeout(function() {
          destroyPromise.then(function(response) {
            expect(response.status).toBe(200);

            nonPersonDestroyPromise.then(function(response) {
              expect(response).toBe(false);
              done();
            });
          });
        }, ajaxWait);
      });

      it('can correctly POST data on initial save() and then PUT on subsequent calls', function(done) {
        var mockUrl = generateUrl();
        var postValue = _.uniqueId('random');
        var putValue = _.uniqueId('random');
        var personData = {
          "id": 1,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl
          });
          person = person || {};
          this.id = fw.observable(person.id).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person();

        expect(Person).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(postValue);

        fetchMock.restore().post(mockUrl, _.extend({}, personData, { firstName: postValue }));
        expect(person.save()).toBeA('promise');

        setTimeout(function() {
          expect(person.id()).toBe(1);
          expect(person.firstName()).toBe(postValue);
          expect(person.firstName()).not.toBe(putValue);

          fetchMock.restore().put(mockUrl + '/1', _.extend({}, personData, { firstName: putValue }));
          person.save();
          setTimeout(function() {
            expect(person.firstName()).toBe(putValue);
            done();
          }, ajaxWait);
        }, ajaxWait);
      });

      it('can correctly POST data and apply parse() method with return on save()', function(done) {
        var parseSpy;
        var mockUrl = generateUrl();
        var postValue = _.uniqueId('random');

        var mockResponse = {
          "id": 1,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl,
            parse: parseSpy = jasmine.createSpy('parseSpy', function(response, requestType) {
              expect(this).toBeA('dataModel');
              expect(requestType).toBe('create');
              response.firstName = postValue;
              return response;
            }).and.callThrough(),
          });
          person = person || {};
          this.id = fw.observable(person.id).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(parseSpy).toBe(undefined);
        expect(Person).not.toHaveBeenCalled();

        var person = new Person();

        expect(Person).toHaveBeenCalled();
        expect(parseSpy).not.toHaveBeenCalled();
        expect(person.firstName()).not.toBe(postValue);

        fetchMock.restore().post(mockUrl, mockResponse);
        expect(person.save()).toBeA('promise');

        setTimeout(function() {
          expect(parseSpy).toHaveBeenCalled();
          expect(person.id()).toBe(1);
          expect(person.firstName()).toBe(postValue);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server via a pre-filled idAttribute', function(done) {
        var mockUrl = generateUrl();
        var getValue = _.uniqueId('random');
        var personData = {
          "id": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);

        fetchMock.restore().get(mockUrl + "/" + personData.id, _.extend({}, personData, { firstName: getValue }));
        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(person.id()).toBe(personData.id);
          expect(person.firstName()).toBe(getValue);
          done();
        }, ajaxWait);
      });

      it('can correctly generate rejected promise from fetch() requested without an idAttribute value', function(done) {
        var mockUrl = generateUrl();
        var getValue = _.uniqueId('random');
        var personData = {
          "id": null,
          "firstName": null,
          "lastName": null,
          "email": null
        };
        var rejectSpy = jasmine.createSpy('rejectSpy');
        var thenSpy = jasmine.createSpy('thenSpy');

        var Person = jasmine.createSpy('initializeSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);

        var promise = person.fetch();
        expect(promise).toBeA('promise');
        expect(person.firstName()).not.toBe(getValue);

        promise.then(thenSpy, rejectSpy);

        setTimeout(function() {
          expect(thenSpy).not.toHaveBeenCalled();
          expect(rejectSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server with a specified requestLull time', function(done) {
        var initializeSpy;
        var requestLullCallbackSpy = jasmine.createSpy('requestLullCallbackSpy', function(operationType) {
          expect(this).toBeA('dataModel');
          expect(operationType).toBe('fetch');
          return 150;
        }).and.callThrough();
        var mockUrl = generateUrl();
        var getValue = _.uniqueId('random');
        var personData = {
          "id": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        var LulledPerson = jasmine.createSpy('LulledPersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl,
            requestLull: 150
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        var LulledPersonWithCallback = jasmine.createSpy('LulledPersonWithCallbackSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl,
            requestLull: requestLullCallbackSpy
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        var Person = initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(LulledPerson).not.toHaveBeenCalled();
        expect(LulledPersonWithCallback).not.toHaveBeenCalled();
        expect(requestLullCallbackSpy).not.toHaveBeenCalled();

        var lulledPerson = new LulledPerson(personData);
        var lulledPersonWithCallback = new LulledPersonWithCallback(personData);
        var person = new Person(personData);

        expect(LulledPerson).toHaveBeenCalled();
        expect(lulledPerson.firstName()).not.toBe(getValue);

        expect(LulledPersonWithCallback).toHaveBeenCalled();
        expect(requestLullCallbackSpy).not.toHaveBeenCalled();
        expect(lulledPersonWithCallback.firstName()).not.toBe(getValue);

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);

        fetchMock.restore().get(mockUrl + "/" + personData.id, _.extend({}, personData, { firstName: getValue }));
        expect(lulledPerson.fetch()).toBeA('promise');
        expect(lulledPersonWithCallback.fetch()).toBeA('promise');
        expect(person.fetch()).toBeA('promise');

        expect(requestLullCallbackSpy).toHaveBeenCalled();

        setTimeout(function() {
          expect(lulledPerson.requestInProgress()).toBe(true);
          expect(lulledPersonWithCallback.requestInProgress()).toBe(true);
          expect(person.requestInProgress()).toBe(false);

          setTimeout(function() {
            expect(lulledPerson.requestInProgress()).toBe(false);
            expect(lulledPersonWithCallback.requestInProgress()).toBe(false);
            done();
          }, 250);
        }, 20);
      });

      it('can correctly fetch() data from the server with a provided parse() method', function(done) {
        var parseSpy;
        var mockUrl = generateUrl();
        var getValue = _.uniqueId('random');
        var personData = {
          "id": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl,
            parse: parseSpy = jasmine.createSpy('parseSpy', function(response, requestType) {
              expect(this).toBeA('dataModel');
              expect(requestType).toBe('read');
              response.firstName = getValue;
              return response;
            }).and.callThrough()
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(parseSpy).not.toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);

        fetchMock.restore().get(mockUrl + '/' + personData.id, personData);
        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(parseSpy).toHaveBeenCalled();
          expect(person.id()).toBe(personData.id);
          expect(person.firstName()).toBe(getValue);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server via a pre-filled custom idAttribute', function(done) {
        var mockUrl = generateUrl();
        var getValue = _.uniqueId('random');
        var personData = {
          "customId": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl,
            idAttribute: 'customId'
          });
          person = person || {};
          this.customId = fw.observable(person.customId || null).map('customId', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);

        fetchMock.restore().get(mockUrl + '/' + personData.customId, _.extend({}, personData, { firstName: getValue }));
        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(person.customId()).toBe(personData.customId);
          expect(person.firstName()).toBe(getValue);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server with overridden fetchOptions', function(done) {
        var personData = {
          "id": 100,
          "firstName": _.uniqueId('random'),
          "lastName": null,
          "email": null
        };
        var mockUrl = generateUrl();

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl,
            fetchOptions: {
              method: 'post'
            }
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person({ id: personData.id });

        expect(Person).toHaveBeenCalled();

        fetchMock.restore().post(mockUrl + '/' + personData.id, personData);
        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(person.firstName()).toBe(personData.firstName);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server with overridden global fetchOptions', function(done) {
        var personData = {
          "id": 100,
          "firstName": _.uniqueId('random'),
          "lastName": null,
          "email": null
        };
        var mockUrl = generateUrl();
        var passedOptions = {
          someUniqueValue: _.uniqueId('random')
        };

        fw.fetchOptions = function(action, concern, options) {
          expect(action).toBe('read');
          expect(concern).toBeA('dataModel');
          expect(options).toEqual(passedOptions);

          return {
            method: 'post'
          };
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person({ id: personData.id });

        expect(Person).toHaveBeenCalled();

        fetchMock.restore().post(mockUrl + '/' + personData.id, personData);
        expect(person.fetch(passedOptions)).toBeA('promise');

        setTimeout(function() {
          expect(person.firstName()).toBe(personData.firstName);
          fw.fetchOptions = {};
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server via a url based on an evaluator function', function(done) {
        var urlSpy;
        var mockUrl = generateUrl();
        var getValue = _.uniqueId('random');
        var personData = {
          "id": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: urlSpy = jasmine.createSpy('urlSpy', function() {
              return mockUrl;
            }).and.callThrough()
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();
        expect(urlSpy).toBe(undefined);

        var person = new Person(personData);

        expect(Person).toHaveBeenCalled();
        expect(urlSpy).not.toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);

        fetchMock.restore().get(mockUrl + '/' + personData.id, _.extend({}, personData, { firstName: getValue }));
        expect(person.fetch()).toBeA('promise');
        expect(urlSpy).toHaveBeenCalled();

        setTimeout(function() {
          expect(person.id()).toBe(personData.id);
          expect(person.firstName()).toBe(getValue);
          done();
        }, ajaxWait);
      });

      it('can correctly construct and issue requests via a url based on a explicit action definitions', function(done) {
        var getValue = _.uniqueId('random');
        var personData = {
          "id": 100,
          "firstName": null
        };

        var createUrl = generateUrl();
        var readUrl = generateUrl();
        var updateUrl = generateUrl();
        var deleteUrl = generateUrl();

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: {
              'create': 'POST ' + createUrl,
              'read': 'GET ' + readUrl,
              'update': updateUrl, // test url only (footwork should fill in request method from default list)
              'delete': 'DELETE ' + deleteUrl
            }
          });
          person = person || {};
          this.id = fw.observable(person.id).map('id', this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
        }).and.callThrough();

        // reset fetchMock
        fetchMock.restore();

        var postSpy = jasmine.createSpy('postSpy').and.returnValue(personData);
        fetchMock.post(createUrl, postSpy);

        var readSpy = jasmine.createSpy('readSpy').and.returnValue(personData);
        fetchMock.get(readUrl, readSpy);

        var updateSpy = jasmine.createSpy('updateSpy').and.returnValue(personData);
        fetchMock.put(updateUrl, updateSpy);

        var deleteSpy = jasmine.createSpy('deleteSpy').and.returnValue(personData);
        fetchMock.delete(deleteUrl, deleteSpy);

        expect(Person).not.toHaveBeenCalled();

        var createPerson = new Person();
        var readPerson = new Person(personData);
        var updatePerson = new Person(personData);
        var deletePerson = new Person(personData);

        expect(Person).toHaveBeenCalled();

        expect(createPerson.save()).toBeA('promise');
        expect(readPerson.fetch()).toBeA('promise');
        expect(updatePerson.save()).toBeA('promise');
        expect(deletePerson.destroy()).toBeA('promise');

        setTimeout(function() {
          expect(postSpy).toHaveBeenCalled();
          expect(readSpy).toHaveBeenCalled();
          expect(updateSpy).toHaveBeenCalled();
          expect(deleteSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can correctly construct and issue requests via a url based on a explicit action definitions defined by a callback', function(done) {
        var getValue = _.uniqueId('random');
        var personData = {
          "id": 100,
          "firstName": _.uniqueId('random')
        };

        var createUrl = generateUrl();
        var readUrl = generateUrl();
        var updateUrl = generateUrl();
        var deleteUrl = generateUrl();

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: {
              'create': function() {
                expect(this).toBeA('dataModel');
                return 'POST ' + createUrl;
              },
              'read': function() {
                expect(this).toBeA('dataModel');
                return 'GET ' + readUrl + '/:firstName';
              },
              'update': function() {
                expect(this).toBeA('dataModel');
                return 'PUT ' + updateUrl;
              },
              'delete': function() {
                expect(this).toBeA('dataModel');
                return 'DELETE ' + deleteUrl;
              }
            }
          });
          person = person || {};
          this.id = fw.observable(person.id).map('id', this);
          this.firstName = fw.observable(person.firstName).map('firstName', this);
        }).and.callThrough();

        // reset fetchMock
        fetchMock.restore();

        var postSpy = jasmine.createSpy('postSpy').and.returnValue(personData);
        fetchMock.post(createUrl, postSpy);

        var readSpy = jasmine.createSpy('readSpy').and.returnValue(personData);
        fetchMock.get(readUrl + '/' + personData.firstName, readSpy);

        var updateSpy = jasmine.createSpy('updateSpy').and.returnValue(personData);
        fetchMock.put(updateUrl, updateSpy);

        var deleteSpy = jasmine.createSpy('deleteSpy').and.returnValue(personData);
        fetchMock.delete(deleteUrl, deleteSpy);

        expect(Person).not.toHaveBeenCalled();

        var createPerson = new Person();
        var readPerson = new Person(personData);
        var updatePerson = new Person(personData);
        var deletePerson = new Person(personData);

        expect(Person).toHaveBeenCalled();

        expect(createPerson.save()).toBeA('promise');
        expect(readPerson.fetch()).toBeA('promise');
        expect(updatePerson.save()).toBeA('promise');
        expect(deletePerson.destroy()).toBeA('promise');

        setTimeout(function() {
          expect(postSpy).toHaveBeenCalled();
          expect(readSpy).toHaveBeenCalled();
          expect(updateSpy).toHaveBeenCalled();
          expect(deleteSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server via a url with interpolated parameters', function(done) {
        var mockUrl = generateUrl();
        var personData = {
          "id": 100,
          "firstName": 'interpolatedFirstName',
          "lastName": 'personDataLastName',
          "email": null
        };

        var Person = jasmine.createSpy('PersonSpy', function(person) {
          fw.dataModel.boot(this, {
            url: mockUrl + '/:firstName'
          });
          person = person || {};
          this.id = fw.observable(person.id || null).map('id', this);
          this.firstName = fw.observable(person.firstName || null).map('firstName', this);
          this.lastName = fw.observable(person.lastName || null).map('lastName', this);
          this.email = fw.observable(person.email || null).map('email', this);
        }).and.callThrough();

        expect(Person).not.toHaveBeenCalled();

        var person = new Person({ id: personData.id, firstName: personData.firstName });

        expect(Person).toHaveBeenCalled();
        expect(person.lastName()).not.toBe(personData.lastName);

        fetchMock.restore().get(mockUrl + '/' + personData.firstName + '/' + personData.id, personData);
        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(person.lastName()).toBe(personData.lastName);
          done();
        }, ajaxWait);
      });
    });
  }
);
