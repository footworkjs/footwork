define(['footwork', 'lodash', 'jquery'],
  function(fw, _, $) {
    describe('dataModel', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

      it('has the ability to create a dataModel', function() {
        expect(fw.dataModel.create).toBeA('function');
        expect(fw.dataModel.create()).toBeA('function');

        var dataModel = new (fw.dataModel.create())();

        expect(dataModel.fetch).toBeA('function');
        expect(dataModel.save).toBeA('function');
        expect(dataModel.destroy).toBeA('function');
        expect(dataModel.set).toBeA('function');
        expect(dataModel.get).toBeA('function');
      });

      it('has the ability to create a dataModel with a correctly defined namespace whos name we can retrieve', function() {
        var namespaceName = generateNamespaceName();
        var ModelA = fw.dataModel.create({
          namespace: namespaceName
        });
        var modelA = new ModelA();

        expect(modelA.$namespace).toBeAn('object');
        expect(modelA.$namespace.getName()).toBe(namespaceName);
      });

      it('has the ability to be instantiated with with extended attributes', function() {
        var ModelA = fw.dataModel.create({
          extend: {
            extendedAttribute: true
          }
        });
        var modelA = new ModelA();

        expect(modelA.extendedAttribute).toBe(true);
      });

      it('correctly names and increments counter for indexed dataModels', function() {
        var IndexedDataModel = fw.dataModel.create({
          namespace: 'IndexedDataModel',
          autoIncrement: true
        });

        var firstDataModel = new IndexedDataModel();
        var secondDataModel = new IndexedDataModel();
        var thirdDataModel = new IndexedDataModel();

        expect(firstDataModel.$namespace.getName()).toBe('IndexedDataModel0');
        expect(secondDataModel.$namespace.getName()).toBe('IndexedDataModel1');
        expect(thirdDataModel.$namespace.getName()).toBe('IndexedDataModel2');
      });

      it('correctly applies a mixin to a dataModel', function() {
        var namespaceName = generateNamespaceName();
        var preInitCallbackSpy = jasmine.createSpy('preInitCallbackSpy').and.callThrough();
        var postInitCallbackSpy = jasmine.createSpy('postInitCallbackSpy').and.callThrough();
        var initializeSpy = jasmine.createSpy('initializeSpy').and.callThrough();

        var DataModelWithMixin = fw.dataModel.create({
          namespace: namespaceName,
          initialize: expectCallOrder(1, initializeSpy),
          mixins: [
            {
              _preInit: expectCallOrder(0, preInitCallbackSpy),
              mixin: {
                mixinPresent: true
              },
              _postInit: expectCallOrder(2, postInitCallbackSpy)
            }
          ]
        });

        var dataModel = new DataModelWithMixin();

        expect(preInitCallbackSpy).toHaveBeenCalled();
        expect(dataModel.mixinPresent).toBe(true);
        expect(postInitCallbackSpy).toHaveBeenCalled();
      });

      it('has the ability to create nested dataModels with correctly defined namespaces', function() {
        var initializeSpyA;
        var initializeSpyB;
        var initializeSpyC;

        var ModelA = fw.dataModel.create({
          namespace: 'ModelA',
          initialize: expectCallOrder(0, initializeSpyA = jasmine.createSpy('initializeSpyA', function() {
            expect(fw.utils.currentNamespaceName()).toBe('ModelA');
            this.subModelB = new ModelB();
            expect(fw.utils.currentNamespaceName()).toBe('ModelA');
          }).and.callThrough())
        });

        var ModelB = fw.dataModel.create({
          namespace: 'ModelB',
          initialize: expectCallOrder(1, initializeSpyB = jasmine.createSpy('initializeSpyB', function() {
            expect(fw.utils.currentNamespaceName()).toBe('ModelB');
            this.subModelC = new ModelC();
            expect(fw.utils.currentNamespaceName()).toBe('ModelB');
          }).and.callThrough())
        });

        var ModelC = fw.dataModel.create({
          namespace: 'ModelC',
          initialize: expectCallOrder(2, initializeSpyC = jasmine.createSpy('initializeSpyC', function() {
            expect(fw.utils.currentNamespaceName()).toBe('ModelC');
          }).and.callThrough())
        });

        expect(initializeSpyA).not.toHaveBeenCalled();
        expect(initializeSpyB).not.toHaveBeenCalled();
        expect(initializeSpyC).not.toHaveBeenCalled();

        var modelA = new ModelA();

        expect(initializeSpyA).toHaveBeenCalled();
        expect(initializeSpyB).toHaveBeenCalled();
        expect(initializeSpyC).toHaveBeenCalled();
      });

      it('calls afterRender after initialize with the correct target element when creating and binding a new instance', function() {
        var checkForClass = 'check-for-class';
        var initializeSpy;
        var afterRenderSpy;

        var ModelA = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy')),
          afterRender: expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(containingElement) {
            expect(containingElement).toHaveClass(checkForClass);
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).not.toHaveBeenCalled();

        fw.applyBindings(new ModelA(), testContainer = makeTestContainer('', '<div class="' + checkForClass + '"></div>'));

        expect(initializeSpy).toHaveBeenCalled();
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
        var DataModel = fw.dataModel.create();
        var dataModels = [ new DataModel(), new DataModel() ];

        expect(_.keys(fw.dataModel.getAll())).lengthToBeGreaterThan(0);
      });

      it('can get all instantiated dataModels of a specific type/name', function() {
        var dataModels = [];
        var specificDataModelNamespace = generateNamespaceName();
        var DataModel = fw.dataModel.create({ namespace: specificDataModelNamespace });
        var numToMake = _.random(1,15);

        for(var x = numToMake; x; x--) {
          dataModels.push(new DataModel());
        }

        expect(fw.dataModel.getAll(generateNamespaceName())).lengthToBe(0);
        expect(fw.dataModel.getAll(specificDataModelNamespace)).lengthToBe(numToMake);
      });

      it('can autoRegister a dataModel during class method creation', function() {
        var namespaceName = generateNamespaceName();
        expect(fw.dataModel.isRegistered(namespaceName)).toBe(false);

        fw.dataModel.create({
          namespace: namespaceName,
          autoRegister: true
        });

        expect(fw.dataModel.isRegistered(namespaceName)).toBe(true);
      });

      it('can bind to the DOM using a <dataModel> declaration', function(done) {
        var wasInitialized = false;
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy();

        fw.dataModel.create({
          namespace: namespaceName,
          autoRegister: true,
          initialize: initializeSpy
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalledTimes(1);
          done();
        }, 50);
      });

      it('can bind to the DOM using a shared instance', function(done) {
        var namespaceName = generateNamespaceName();
        var boundPropertyValue = randomString();

        fw.dataModel.register(namespaceName, {
          instance: {
            boundProperty: boundPropertyValue
          }
        });

        testContainer = makeTestContainer('<dataModel module="' + namespaceName + '">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </dataModel>');

        expect(testContainer).not.toContainText(boundPropertyValue);

        fw.start(testContainer);

        setTimeout(function() {
          expect(testContainer).toContainText(boundPropertyValue);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a generated instance', function(done) {
        var namespaceName = generateNamespaceName();
        var boundPropertyValue = randomString();
        var boundPropertyValueElement = boundPropertyValue + '-element';
        var createDataModelInstance;

        fw.dataModel.register(namespaceName, {
          createDataModel: expectCallOrder(0, createDataModelInstance = jasmine.createSpy('createDataModel', function(params, info) {
            expect(params.var).toBe(boundPropertyValue);
            expect(info.element).toHaveId(boundPropertyValueElement);

            return {
              boundProperty: boundPropertyValue
            };
          }).and.callThrough())
        });

        expect(createDataModelInstance).not.toHaveBeenCalled();
        testContainer = makeTestContainer('<dataModel module="' + namespaceName + '" id="' + boundPropertyValueElement + '" params="var: \'' + boundPropertyValue + '\'">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </dataModel>');

        expect(testContainer).not.toContainText(boundPropertyValue);
        fw.start(testContainer);

        setTimeout(function() {
          expect(createDataModelInstance).toHaveBeenCalled();
          expect(testContainer).toContainText(boundPropertyValue);
          done();
        }, ajaxWait);
      });

      it('has the animation classes applied properly', function() {
        var namespaceName = generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;

        fw.dataModel.create({
          namespace: namespaceName,
          autoRegister: true,
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy').and.callThrough()),
          afterRender: expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
            theElement = element;
            expect(theElement).not.toHaveClass(footworkAnimationClass);
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).not.toHaveBeenCalled();
        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        expect(initializeSpy).toHaveBeenCalled();
        expect(afterRenderSpy).toHaveBeenCalled();
        expect(theElement).toHaveClass(footworkAnimationClass);
      });

      it('can nest <dataModel> declarations', function() {
        var namespaceNameOuter = generateNamespaceName();
        var namespaceNameInner = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy');

        fw.dataModel.create({
          namespace: namespaceNameOuter,
          autoRegister: true,
          initialize: expectCallOrder(0, initializeSpy)
        });

        fw.dataModel.create({
          namespace: namespaceNameInner,
          autoRegister: true,
          initialize: expectCallOrder(1, initializeSpy)
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceNameOuter + '">\
          <dataModel module="' + namespaceNameInner + '"></dataModel>\
        </dataModel>'));

        expect(initializeSpy).toHaveBeenCalledTimes(2);
      });

      it('can pass parameters through a <dataModel> declaration', function() {
        var namespaceName = generateNamespaceName();
        var initializeSpy;

        fw.dataModel.create({
          namespace: namespaceName,
          autoRegister: true,
          initialize: initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
            expect(params.testValueOne).toBe(1);
            expect(params.testValueTwo).toEqual([1,2,3]);
          }).and.callThrough()
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '" params="testValueOne: 1, testValueTwo: [1,2,3]"></dataModel>'));
        expect(initializeSpy).toHaveBeenCalled();
      });

      it('calls onDispose when the containing element is removed from the DOM', function() {
        var namespaceName = generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;
        var onDisposeSpy;

        var WrapperDataModel = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
            this.showIt = fw.observable(true);
          }).and.callThrough())
        });

        var DataModelWithDispose = fw.dataModel.create({
          namespace: namespaceName,
          autoRegister: true,
          afterRender: expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
            theElement = element;
            expect(theElement.tagName).toBe('DATAMODEL');
          }).and.callThrough()),
          onDispose: expectCallOrder(2, onDisposeSpy = jasmine.createSpy('onDisposeSpy', function(element) {
            expect(element).toBe(theElement);
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).not.toHaveBeenCalled();

        var wrapper = new WrapperDataModel();

        expect(initializeSpy).toHaveBeenCalled();
        expect(afterRenderSpy).not.toHaveBeenCalled();

        fw.applyBindings(wrapper, testContainer = makeTestContainer('<div data-bind="if: showIt">\
          <dataModel module="' + namespaceName + '"></dataModel>\
        </div>'));

        expect(onDisposeSpy).not.toHaveBeenCalled();

        wrapper.showIt(false);

        expect(afterRenderSpy).toHaveBeenCalled();
        expect(onDisposeSpy).toHaveBeenCalled();
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
        fw.dataModel.fileExtensions(customExtension);
        fw.dataModel.registerLocation(namespaceName, '/bogus/path/');

        expect(fw.dataModel.getFileName(namespaceName)).toBe(namespaceName + customExtension);

        fw.dataModel.fileExtensions('.js');
      });

      it('can have a callback specified as the extension with it invoked and the return value used', function() {
        var namespaceName = generateNamespaceName();
        var customExtension = '.jscriptFunction';
        fw.dataModel.fileExtensions(function(moduleName) {
          expect(moduleName).toBe(namespaceName);
          return customExtension;
        });
        fw.dataModel.registerLocation(namespaceName, '/bogus/path/');

        expect(fw.dataModel.getFileName(namespaceName)).toBe(namespaceName + customExtension);

        fw.dataModel.fileExtensions('.js');
      });

      it('can load via requirejs with a declarative initialization from an already registered module', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy();

        define(namespaceName, ['footwork'], function(fw) {
          return fw.dataModel.create({
            initialize: initializeSpy
          });
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, 50);
      });

      it('can load via registered dataModel with a declarative initialization', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy();

        fw.dataModel.register(namespaceName, fw.dataModel.create({
          initialize: initializeSpy
        }));

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, 50);
      });

      it('can load via requirejs with a declarative initialization from a specified location', function(done) {
        var namespaceName = 'AMDDataModel';

        fw.dataModel.registerLocation(namespaceName, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
        var namespaceName = 'AMDDataModelRegexp-test';

        fw.dataModel.registerLocation(/AMDDataModelRegexp-.*/, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
        var namespaceName = 'AMDDataModelFullName';

        fw.dataModel.registerLocation(namespaceName, 'tests/assets/fixtures/' + namespaceName + '.js');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can specify and load via requirejs with the default location', function(done) {
        var namespaceName = 'defaultDataModel';

        fw.dataModel.defaultLocation('tests/assets/fixtures/defaultDataModelLocation/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can have an observable mapped correctly at the parent level', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            this.firstName = fw.observable(person.firstName).mapTo('firstName');
            this.lastName = fw.observable(person.lastName).mapTo('lastName');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person({
          firstName: 'John',
          lastName: 'Smith'
        });

        expect(initializeSpy).toHaveBeenCalled();

        expect(person.hasMappedField('firstName')).toBe(true);
        expect(person.hasMappedField('lastName')).toBe(true);
      });

      it('can have an observable mapped correctly at a nested level', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            this.firstName = fw.observable(person.firstName).mapTo('firstName');
            this.lastName = fw.observable(person.lastName).mapTo('lastName');
            this.movieCollection = {
              action: fw.observableArray(person.movies.action).mapTo('movies.action'),
              drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
              comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
              horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
            };
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

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

        expect(initializeSpy).toHaveBeenCalled();

        expect(person.hasMappedField('firstName')).toBe(true);
        expect(person.hasMappedField('lastName')).toBe(true);
        expect(person.hasMappedField('movies.action')).toBe(true);
        expect(person.hasMappedField('movies.drama')).toBe(true);
        expect(person.hasMappedField('movies.comedy')).toBe(true);
        expect(person.hasMappedField('movies.horror')).toBe(true);
      });

      it('can have observables mapped and retreived correctly via get', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            this.firstName = fw.observable(person.firstName).mapTo('firstName');
            this.lastName = fw.observable(person.lastName).mapTo('lastName');
            this.movieCollection = {
              action: fw.observableArray(person.movies.action).mapTo('movies.action'),
              drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
              comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
              horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
            };
          }).and.callThrough())
        });

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

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.get()).toEqual(personData);
      });

      it('can have observables mapped and a specific one retreived correctly via get', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            this.firstName = fw.observable(person.firstName).mapTo('firstName');
            this.lastName = fw.observable(person.lastName).mapTo('lastName');
            this.movieCollection = {
              action: fw.observableArray(person.movies.action).mapTo('movies.action'),
              drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
              comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
              horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
            };
          }).and.callThrough())
        });

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

        expect(initializeSpy).not.toHaveBeenCalled();
        var person = new Person(personData);

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.get('firstName')).toEqual(personData.firstName);
        expect(person.get('movies')).toEqual(personData.movies);
        expect(person.get('movies.action')).toEqual(personData.movies.action);
      });

      it('can have observables mapped and an array of values retreived correctly via get', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            this.firstName = fw.observable(person.firstName).mapTo('firstName');
            this.lastName = fw.observable(person.lastName).mapTo('lastName');
            this.movieCollection = {
              action: fw.observableArray(person.movies.action).mapTo('movies.action'),
              drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
              comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
              horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
            };
          }).and.callThrough())
        });

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

        expect(initializeSpy).not.toHaveBeenCalled();
        var person = new Person(personData);

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.get(['firstName', 'lastName'])).toEqual(_.pick(personData, ['firstName', 'lastName']));
      });

      it('can have a correct dirtyMap() produced', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            this.firstName = fw.observable(person.firstName).mapTo('firstName');
            this.lastName = fw.observable(person.lastName).mapTo('lastName');
            this.movieCollection = {
              action: fw.observableArray(person.movies.action).mapTo('movies.action'),
              drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
              comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
              horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
            };
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();
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
        expect(initializeSpy).toHaveBeenCalled();

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
      });

      it('can load data in using dataModel.set()', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            this.firstName = fw.observable().mapTo('firstName');
            this.lastName = fw.observable().mapTo('lastName');
            this.movieCollection = {
              action: fw.observableArray().mapTo('movies.action'),
              drama: fw.observableArray().mapTo('movies.drama'),
              comedy: fw.observableArray().mapTo('movies.comedy'),
              horror: fw.observableArray().mapTo('movies.horror')
            };
          }).and.callThrough())
        });

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

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person();

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.firstName()).toEqual(undefined);

        person.set(personData);

        expect(person.firstName()).toEqual(personData.firstName);
      });

      it('can (re)map the primary key', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(personData) {
            this.firstName = fw.observable().mapTo('firstName');
            this.lastName = fw.observable().mapTo('lastName');
            this.movieCollection = {
              action: fw.observableArray().mapTo('movies.action'),
              drama: fw.observableArray().mapTo('movies.drama'),
              comedy: fw.observableArray().mapTo('movies.comedy'),
              horror: fw.observableArray().mapTo('movies.horror')
            };

            this.id = fw.observable().mapTo('id');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person();

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.$id).toBe(person.id);
      });

      it('can correctly be flagged as isDirty when a mapped field value is altered', function() {
        var initializeSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            this.firstName = fw.observable(person.firstName).mapTo('firstName');
            this.lastName = fw.observable(person.lastName).mapTo('lastName');
            this.movieCollection = {
              action: fw.observableArray(person.movies.action).mapTo('movies.action'),
              drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
              comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
              horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
            };
          }).and.callThrough())
        });

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

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.isDirty()).toBe(false);

        person.firstName('test123');

        expect(person.isDirty()).toBe(true);
      });

      it('can correctly POST data on initial save()', function(done) {
        var initializeSpy;
        var mockUrl = generateUrl();
        var postValue = randomString();

        $.mockjax({
          responseTime: 5,
          url: mockUrl,
          type: 'POST',
          responseText: {
            "id": 1,
            "firstName": postValue,
            "lastName": null,
            "email": null
          }
        });

        var Person = fw.dataModel.create({
          url: mockUrl,
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person();

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(postValue);
        expect(person.save()).toBeA('promise');

        setTimeout(function() {
          expect(person.$id()).toBe(1);
          expect(person.firstName()).toBe(postValue);
          done();
        }, ajaxWait);
      });

      it('can correctly POST data on initial save() and then PUT on subsequent calls', function(done) {
        var initializeSpy;
        var mockUrl = generateUrl();
        var postValue = randomString();
        var putValue = randomString();
        var personData = {
          "id": 1,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        $.mockjax({
          responseTime: 5,
          url: mockUrl,
          type: 'POST',
          responseText: _.extend({}, personData, { firstName: postValue })
        });

        $.mockjax({
          responseTime: 5,
          url: mockUrl + '/1',
          type: 'PUT',
          responseText: _.extend({}, personData, { firstName: putValue })
        });

        var Person = fw.dataModel.create({
          url: mockUrl,
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person();

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(postValue);
        expect(person.save()).toBeA('promise');

        setTimeout(function() {
          expect(person.$id()).toBe(1);
          expect(person.firstName()).toBe(postValue);
          expect(person.firstName()).not.toBe(putValue);

          person.save();
          setTimeout(function() {
            expect(person.firstName()).toBe(putValue);
            done();
          }, ajaxWait);
        }, ajaxWait);
      });

      it('can correctly POST data and apply parse() method with return on save()', function(done) {
        var initializeSpy;
        var parseSpy;
        var mockUrl = generateUrl();
        var postValue = randomString();

        var mockResponse = {
          "id": 1,
          "firstName": null,
          "lastName": null,
          "email": null
        };
        $.mockjax({
          responseTime: 5,
          url: mockUrl,
          type: 'POST',
          responseText: mockResponse
        });

        var Person = fw.dataModel.create({
          url: mockUrl,
          parse: expectCallOrder(1, parseSpy = jasmine.createSpy('parseSpy', function(response) {
            response.firstName = postValue;
            return response;
          }).and.callThrough()),
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(parseSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person();

        expect(initializeSpy).toHaveBeenCalled();
        expect(parseSpy).not.toHaveBeenCalled();
        expect(person.firstName()).not.toBe(postValue);
        expect(person.save()).toBeA('promise');

        setTimeout(function() {
          expect(parseSpy).toHaveBeenCalled();
          expect(person.$id()).toBe(1);
          expect(person.firstName()).toBe(postValue);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server via a pre-filled idAttribute', function(done) {
        var initializeSpy;
        var mockUrl = generateUrl();
        var getValue = '__GET__CHECK__';
        var personData = {
          "id": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        $.mockjax({
          responseTime: 5,
          url: mockUrl + "/" + personData.id,
          type: 'GET',
          responseText: _.extend({}, personData, { firstName: getValue })
        });

        var Person = fw.dataModel.create({
          url: mockUrl,
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);
        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(person.$id()).toBe(personData.id);
          expect(person.firstName()).toBe(getValue);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server with a provided parse() method', function(done) {
        var initializeSpy;
        var parseSpy;
        var mockUrl = generateUrl();
        var getValue = '__GET__CHECK__';
        var personData = {
          "id": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        $.mockjax({
          responseTime: 5,
          url: mockUrl + '/' + personData.id,
          type: 'GET',
          responseText: personData
        });

        var Person = fw.dataModel.create({
          url: mockUrl,
          parse: expectCallOrder(1, parseSpy = jasmine.createSpy('parseSpy', function(response) {
            response.firstName = getValue;
            return response;
          }).and.callThrough()),
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(initializeSpy).toHaveBeenCalled();
        expect(parseSpy).not.toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);
        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(parseSpy).toHaveBeenCalled();
          expect(person.$id()).toBe(personData.id);
          expect(person.firstName()).toBe(getValue);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server via a pre-filled custom idAttribute', function(done) {
        var initializeSpy;
        var mockUrl = generateUrl();
        var getValue = '__GET__CUSTOM__CHECK__';
        var personData = {
          "customId": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        $.mockjax({
          responseTime: 5,
          url: mockUrl + '/' + personData.customId,
          type: 'GET',
          responseText: _.extend({}, personData, { firstName: getValue })
        });

        var Person = fw.dataModel.create({
          url: mockUrl,
          idAttribute: 'customId',
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);
        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(person.customId()).toBe(personData.customId);
          expect(person.firstName()).toBe(getValue);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server with overridden ajaxOptions', function(done) {
        var initializeSpy;
        var mockUrl = generateUrl();
        var personData = {
          "id": 100,
          "firstName": randomString(),
          "lastName": null,
          "email": null
        };

        $.mockjax({
          responseTime: 5,
          url: mockUrl,
          type: 'GET',
          responseText: personData
        });

        var Person = fw.dataModel.create({
          url: mockUrl,
          ajaxOptions: {
            url: mockUrl
          },
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.id(person.id);
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person({ id: personData.id });

        expect(initializeSpy).toHaveBeenCalled();

        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(person.firstName()).toBe(personData.firstName);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server via a url based on an evaluator function', function(done) {
        var initializeSpy;
        var urlSpy;
        var mockUrl = generateUrl();
        var getValue = '__GET__CUSTOM__CHECK__';
        var personData = {
          "id": 100,
          "firstName": null,
          "lastName": null,
          "email": null
        };

        $.mockjax({
          responseTime: 5,
          url: mockUrl + '/' + personData.id,
          type: 'GET',
          responseText: _.extend({}, personData, { firstName: getValue })
        });

        var Person = fw.dataModel.create({
          url: expectCallOrder(1, urlSpy = jasmine.createSpy('urlSpy', function() {
            return mockUrl;
          }).and.callThrough()),
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(urlSpy).not.toHaveBeenCalled();

        var person = new Person(personData);

        expect(initializeSpy).toHaveBeenCalled();
        expect(urlSpy).not.toHaveBeenCalled();
        expect(person.firstName()).not.toBe(getValue);

        expect(person.fetch()).toBeA('promise');
        expect(urlSpy).toHaveBeenCalled();

        setTimeout(function() {
          expect(person.$id()).toBe(personData.id);
          expect(person.firstName()).toBe(getValue);
          done();
        }, ajaxWait);
      });

      it('can correctly fetch() data from the server via a url with interpolated parameters', function(done) {
        var initializeSpy;
        var mockUrl = generateUrl();
        var personData = {
          "id": 100,
          "firstName": 'interpolatedFirstName',
          "lastName": 'personDataLastName',
          "email": null
        };

        $.mockjax({
          responseTime: 5,
          url: mockUrl + '/' + personData.firstName,
          type: 'GET',
          responseText: personData
        });

        var Person = fw.dataModel.create({
          useKeyInUrl: false,
          url: mockUrl + '/:firstName',
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var person = new Person({ id: personData.id, firstName: personData.firstName });

        expect(initializeSpy).toHaveBeenCalled();
        expect(person.lastName()).not.toBe(personData.lastName);

        expect(person.fetch()).toBeA('promise');

        setTimeout(function() {
          expect(person.lastName()).toBe(personData.lastName);
          done();
        }, ajaxWait);
      });
    });
  }
);
