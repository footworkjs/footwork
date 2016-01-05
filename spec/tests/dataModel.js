'use strict';

var sandbox = document.getElementById('sandbox');

describe('dataModel', function () {
  it('has the ability to create a dataModel', function() {
    expect(fw.dataModel.create).to.be.a('function');
    expect(fw.dataModel.create()).to.be.a('function');

    var dataModel = new (fw.dataModel.create())();

    expect(dataModel.fetch).to.be.a('function');
    expect(dataModel.save).to.be.a('function');
    expect(dataModel.destroy).to.be.a('function');
    expect(dataModel.set).to.be.a('function');
    expect(dataModel.get).to.be.a('function');
  });

  it('has the ability to create a dataModel with a correctly defined namespace whos name we can retrieve', function() {
    var ModelA = fw.dataModel.create({
      namespace: 'dataModelA'
    });
    var modelA = new ModelA();

    expect(modelA.$namespace).to.be.an('object');
    expect(modelA.$namespace.getName()).to.eql('dataModelA0');
  });

  it('has the ability to be instantiated with with extended attributes', function() {
    var ModelA = fw.dataModel.create({
      extend: {
        extendedAttribute: true
      }
    });
    var modelA = new ModelA();

    expect(modelA.extendedAttribute).to.be(true);
  });

  it('correctly names and increments counter for indexed dataModels', function() {
    var IndexedDataModel = fw.dataModel.create({
      namespace: 'IndexedDataModel',
      autoIncrement: true
    });

    var firstDataModel = new IndexedDataModel();
    var secondDataModel = new IndexedDataModel();
    var thirdDataModel = new IndexedDataModel();

    expect(firstDataModel.$namespace.getName()).to.eql('IndexedDataModel0');
    expect(secondDataModel.$namespace.getName()).to.eql('IndexedDataModel1');
    expect(thirdDataModel.$namespace.getName()).to.eql('IndexedDataModel2');
  });

  it('correctly applies a mixin to a dataModel', function() {
    var DataModelWithMixin = fw.dataModel.create({
      namespace: 'DataModelWithMixin',
      mixins: [
        {
          _preInit: function() {
            this.preInitRan = true;
          },
          mixin: {
            mixinPresent: true
          },
          _postInit: function() {
            this.postInitRan = true;
          }
        }
      ]
    });

    var dataModel = new DataModelWithMixin();

    expect(dataModel.preInitRan).to.be(true);
    expect(dataModel.mixinPresent).to.be(true);
    expect(dataModel.postInitRan).to.be(true);
  });

  it('has the ability to create nested dataModels with correctly defined namespaces', function() {
    var ModelA = fw.dataModel.create({
      namespace: 'nestedDataModelA',
      initialize: function() {
        this.preSubModelNamespaceName = fw.utils.currentNamespaceName();
        this.subModelB = new ModelB();
        this.postSubModelNamespaceName = fw.utils.currentNamespaceName();
      }
    });

    var ModelB = fw.dataModel.create({
      namespace: 'nestedDataModelB',
      initialize: function() {
        this.preSubModelNamespaceName = fw.utils.currentNamespaceName();
        this.subModelC = new ModelC();
        this.postSubModelNamespaceName = fw.utils.currentNamespaceName();
      }
    });

    var ModelC = fw.dataModel.create({
      namespace: 'nestedDataModelC',
      initialize: function() {
        this.recordedNamespaceName = fw.utils.currentNamespaceName();
      }
    });

    var modelA = new ModelA();
    expect(modelA.preSubModelNamespaceName).to.eql('nestedDataModelA0');
    expect(modelA.postSubModelNamespaceName).to.eql('nestedDataModelA0');
    expect(modelA.subModelB.preSubModelNamespaceName).to.eql('nestedDataModelB0');
    expect(modelA.subModelB.postSubModelNamespaceName).to.eql('nestedDataModelB0');
    expect(modelA.subModelB.subModelC.recordedNamespaceName).to.eql('nestedDataModelC0');
  });

  it('calls afterBinding after initialize with the correct target element when creating and binding a new instance', function() {
    var initializeWasCalledFirst = false;
    var afterBindingWasCalledSecond = false;
    var containerIsTheSame = false;
    var container = document.getElementById('afterBindingDataModel');

    var ModelA = fw.dataModel.create({
      namespace: 'ModelA',
      initialize: function() {
        if(!afterBindingWasCalledSecond) {
          initializeWasCalledFirst = true;
        }
      },
      afterRender: function(containingElement) {
        if(initializeWasCalledFirst) {
          afterBindingWasCalledSecond = true;
        }
        if(containingElement === container) {
          containerIsTheSame = true;
        }
      }
    });

    var modelA = new ModelA();
    fw.applyBindings(modelA, container);

    expect(afterBindingWasCalledSecond).to.be(true);
    expect(containerIsTheSame).to.be(true);
  });

  it('after binding has the correct containing $element referenced', function(done) {
    var container = document.getElementById('afterBindingDataModelElementReference');

    var ModelA = fw.viewModel.create({
      namespace: 'ModelA',
      afterRender: function(containingElement) {
        expect(containingElement).to.be(container);
        done();
      }
    });

    fw.applyBindings(new ModelA(), container);
  });

  it('can register a dataModel', function() {
    expect( fw.components.isRegistered('registeredDataModelCheck') ).to.be(false);

    fw.dataModel.register('registeredDataModelCheck', function() {});

    expect( fw.dataModel.isRegistered('registeredDataModelCheck') ).to.be(true);
  });

  it('can get a registered dataModel', function() {
    expect( fw.components.isRegistered('registeredDataModelRetrieval') ).to.be(false);

    var RegisteredDataModelRetrieval = function() {};

    fw.dataModel.register('registeredDataModelRetrieval', RegisteredDataModelRetrieval);

    expect( fw.dataModel.isRegistered('registeredDataModelRetrieval') ).to.be(true);
    expect( fw.dataModel.getRegistered('registeredDataModelRetrieval') ).to.be(RegisteredDataModelRetrieval);
  });

  it('can get all instantiated dataModels', function() {
    var DataModel = fw.dataModel.create();
    var dataModels = [ new DataModel(), new DataModel() ];

    expect( _.keys(fw.dataModel.getAll()).length ).to.be.greaterThan(0);
  });

  it('can get all instantiated dataModels of a specific type/name', function() {
    var dataModels = [];
    var DataModel = fw.dataModel.create({ namespace: 'getAllSpecificDataModel', autoIncrement: false });
    var numToMake = _.random(1,15);

    for(var x = numToMake; x; x--) {
      dataModels.push(new DataModel());
    }

    expect(fw.dataModel.getAll('getAllSpecificDataModelDoesNotExist').length).to.be(0);
    expect(fw.dataModel.getAll('getAllSpecificDataModel').length).to.be(numToMake);
  });

  it('can autoRegister a dataModel during class method creation', function() {
    var isRegistered = fw.dataModel.isRegistered('autoRegisteredDataModel');

    expect(isRegistered).to.be(false);

    fw.dataModel.create({
      namespace: 'autoRegisteredDataModel',
      autoRegister: true
    });

    isRegistered = fw.dataModel.isRegistered('autoRegisteredDataModel');

    expect(isRegistered).to.be(true);
  });

  it('can bind to the DOM using a <dataModel> declaration', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('declarativeDataModel');

    fw.dataModel.create({
      namespace: 'declarativeDataModel',
      autoRegister: true,
      initialize: function() {
        wasInitialized = true;
      }
    });

    expect(wasInitialized).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(wasInitialized).to.be(true);
      done();
    }, 0);
  });

  it('can bind to the DOM using a shared instance', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('registeredDataModelInstance');
    var boundPropertyValue = 'registeredDataModelInstance';

    fw.dataModel.register('registeredDataModelInstance', {
      instance: {
        boundProperty: boundPropertyValue
      }
    });

    expect(wasInitialized).to.be(false);
    expect($('#registeredDataModelInstance .result').text()).not.to.be(boundPropertyValue);

    fw.start(container);

    setTimeout(function() {
      expect($('#registeredDataModelInstance .result').text()).to.be(boundPropertyValue);
      done();
    }, 20);
  });

  it('can bind to the DOM using a generated instance', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('registeredDataModelGenerated');
    var boundPropertyValue = 'registeredDataModelGenerated';

    fw.dataModel.register('registeredDataModelGenerated', {
      createDataModel: function(params, info) {
        expect(params.var).to.be('registeredDataModelGenerated');
        expect(info.element.getAttribute('id')).to.be('registeredDataModelGeneratedElement');

        return {
          boundProperty: boundPropertyValue
        };
      }
    });

    expect(wasInitialized).to.be(false);
    expect($('#registeredDataModelGenerated .result').text()).not.to.be(boundPropertyValue);

    fw.start(container);

    setTimeout(function() {
      expect($('#registeredDataModelGenerated .result').text()).to.be(boundPropertyValue);
      done();
    }, 20);
  });

  it('has the animation classes applied properly', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('afterBindingDataModelAnimation');
    var afterBindingCalled = false;
    var theElement;

    fw.dataModel.create({
      namespace: 'afterBindingDataModelAnimation',
      autoRegister: true,
      initialize: function() {
        wasInitialized = true;
      },
      afterRender: function(element) {
        afterBindingCalled = true;
        theElement = element;
        expect(theElement.className.indexOf('fw-entity-animate')).to.be(-1);
      }
    });

    expect(afterBindingCalled).to.be(false);
    expect(wasInitialized).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(afterBindingCalled).to.be(true);
      expect(wasInitialized).to.be(true);
      setTimeout(function() {
        expect(theElement.className.indexOf('fw-entity-animate')).to.be.greaterThan(-1);
        done();
      }, 100);
    }, 0);
  });

  it('can nest <dataModel> declarations', function(done) {
    var container = document.getElementById('nestedDataModels');
    var outerWasInitialized = false;
    var innerWasInitialized = false;

    fw.dataModel.create({
      namespace: 'nestedDataModelOuter',
      autoRegister: true,
      initialize: function() {
        outerWasInitialized = true;
      }
    });

    fw.dataModel.create({
      namespace: 'nestedDataModelInner',
      autoRegister: true,
      initialize: function() {
        innerWasInitialized = true;
      }
    });

    expect(outerWasInitialized).to.be(false);
    expect(innerWasInitialized).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(outerWasInitialized).to.be(true);
      expect(innerWasInitialized).to.be(true);
      done();
    }, 0);
  });

  it('can pass parameters through a <dataModel> declaration', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('paramsDataModel');

    fw.dataModel.create({
      namespace: 'paramsDataModel',
      autoRegister: true,
      initialize: function(params) {
        expect(params.testValueOne).to.be(1);
        expect(params.testValueTwo).to.eql([1,2,3]);
        wasInitialized = true;
      }
    });

    expect(wasInitialized).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(wasInitialized).to.be(true);
      done();
    }, 0);
  });

  it('calls onDispose when the containing element is removed from the DOM', function() {
    var container = document.getElementById('onDisposeDataModel');
    var onDisposeWasCalled = false;

    var WrapperDataModel = fw.dataModel.create({
      initialize: function() {
        this.showIt = fw.observable(true);
      }
    });

    var theElement;
    var DataModelWithDispose = fw.dataModel.create({
      namespace: 'DataModelWithDispose',
      autoRegister: true,
      afterRender: function(element) {
        theElement = element;
        expect(theElement.tagName).to.be('DATAMODEL');
      },
      onDispose: function(element) {
        onDisposeWasCalled = true;
        expect(element).to.be(theElement);
      }
    });

    var wrapper = new WrapperDataModel();
    fw.applyBindings(wrapper, container);

    expect(onDisposeWasCalled).to.be(false);

    wrapper.showIt(false);

    expect(onDisposeWasCalled).to.be(true);
  });

  it('can have a registered location set and retrieved proplerly', function() {
    fw.dataModel.registerLocation('registeredLocationRetrieval', '/bogus/path');
    expect(fw.dataModel.getLocation('registeredLocationRetrieval')).to.be('/bogus/path');
    fw.dataModel.registerLocation(/regexp.*/, '/bogus/path');
    expect(fw.dataModel.getLocation('regexp-model')).to.be('/bogus/path');
  });

  it('can have an array of dataModels registered to a location and retrieved proplerly', function() {
    fw.dataModel.registerLocation(['registeredLocationRetrievalArray1', 'registeredLocationRetrievalArray2'], '/bogus/path');
    expect(fw.dataModel.getLocation('registeredLocationRetrievalArray1')).to.be('/bogus/path');
    expect(fw.dataModel.getLocation('registeredLocationRetrievalArray2')).to.be('/bogus/path');
  });

  it('can have a registered location with filename set and retrieved proplerly', function() {
    fw.dataModel.registerLocation('registeredLocationWithFilenameRetrieval', '/bogus/path/__file__.js');
    expect(fw.dataModel.getLocation('registeredLocationWithFilenameRetrieval')).to.be('/bogus/path/__file__.js');
  });

  it('can have a specific file extension set and used correctly', function() {
    fw.dataModel.fileExtensions('.jscript');
    fw.dataModel.registerLocation('registeredLocationWithExtensionRetrieval', '/bogus/path/');

    expect(fw.dataModel.getFileName('registeredLocationWithExtensionRetrieval')).to.be('registeredLocationWithExtensionRetrieval.jscript');

    fw.dataModel.fileExtensions('.js');
  });

  it('can have a callback specified as the extension with it invoked and the return value used', function() {
    fw.dataModel.fileExtensions(function(moduleName) {
      expect(moduleName).to.be('registeredLocationWithFunctionExtensionRetrieval');
      return '.jscriptFunction';
    });
    fw.dataModel.registerLocation('registeredLocationWithFunctionExtensionRetrieval', '/bogus/path/');

    expect(fw.dataModel.getFileName('registeredLocationWithFunctionExtensionRetrieval')).to.be('registeredLocationWithFunctionExtensionRetrieval.jscriptFunction');

    fw.dataModel.fileExtensions('.js');
  });

  it('can load via requirejs with a declarative initialization from an already registered module', function(done) {
    var container = document.getElementById('AMDPreRegisteredDataModel');
    var dataModelLoaded = false;

    define('AMDPreRegisteredDataModel', ['footwork'], function(fw) {
      return fw.dataModel.create({
        initialize: function() {
          dataModelLoaded = true;
        }
      });
    });

    expect(dataModelLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(dataModelLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via registered dataModel with a declarative initialization', function(done) {
    var container = document.getElementById('registeredDataModel');
    var registeredDataModelWasLoaded = false;

    fw.dataModel.register('registeredDataModel', fw.dataModel.create({
      initialize: function() {
        registeredDataModelWasLoaded = true;
      }
    }));

    expect(registeredDataModelWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(registeredDataModelWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via requirejs with a declarative initialization from a specified location', function(done) {
    var container = document.getElementById('AMDDataModel');
    window.AMDDataModelWasLoaded = false;

    fw.dataModel.registerLocation('AMDDataModel', 'testAssets/');

    expect(window.AMDDataModelWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(window.AMDDataModelWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
    var container = document.getElementById('AMDDataModelRegexp');
    window.AMDDataModelRegexpWasLoaded = false;

    fw.dataModel.registerLocation(/AMDDataModelRegexp-.*/, 'testAssets/');

    expect(window.AMDDataModelRegexpWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(window.AMDDataModelRegexpWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
    var container = document.getElementById('AMDDataModelFullName');
    window.AMDDataModelFullNameWasLoaded = false;

    fw.dataModel.registerLocation('AMDDataModelFullName', 'testAssets/AMDDataModelFullName.js');

    expect(window.AMDDataModelFullNameWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(window.AMDDataModelFullNameWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can specify and load via requirejs with the default location', function(done) {
    var container = document.getElementById('defaultDataModelLocation');
    window.defaultDataModelLocationLoaded = false;

    fw.dataModel.defaultLocation('testAssets/defaultDataModelLocation/');

    expect(window.defaultDataModelLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.defaultDataModelLocationLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can have an observable mapped correctly at the parent level', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        this.firstName = fw.observable(person.firstName).mapTo('firstName');
        this.lastName = fw.observable(person.lastName).mapTo('lastName');
      }
    });

    var person = new Person({
      firstName: 'John',
      lastName: 'Smith'
    });

    expect(person.hasMappedField('firstName')).to.be(true);
    expect(person.hasMappedField('lastName')).to.be(true);
  });

  it('can have an observable mapped correctly at a nested level', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        this.firstName = fw.observable(person.firstName).mapTo('firstName');
        this.lastName = fw.observable(person.lastName).mapTo('lastName');
        this.movieCollection = {
          action: fw.observableArray(person.movies.action).mapTo('movies.action'),
          drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
          comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
          horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
        };
      }
    });

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

    expect(person.hasMappedField('firstName')).to.be(true);
    expect(person.hasMappedField('lastName')).to.be(true);
    expect(person.hasMappedField('movies.action')).to.be(true);
    expect(person.hasMappedField('movies.drama')).to.be(true);
    expect(person.hasMappedField('movies.comedy')).to.be(true);
    expect(person.hasMappedField('movies.horror')).to.be(true);
  });

  it('can have observables mapped and retreived correctly via get', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        this.firstName = fw.observable(person.firstName).mapTo('firstName');
        this.lastName = fw.observable(person.lastName).mapTo('lastName');
        this.movieCollection = {
          action: fw.observableArray(person.movies.action).mapTo('movies.action'),
          drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
          comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
          horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
        };
      }
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
    var person = new Person(personData);

    expect(person.get()).to.eql(personData);
  });

  it('can have observables mapped and a specific one retreived correctly via get', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        this.firstName = fw.observable(person.firstName).mapTo('firstName');
        this.lastName = fw.observable(person.lastName).mapTo('lastName');
        this.movieCollection = {
          action: fw.observableArray(person.movies.action).mapTo('movies.action'),
          drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
          comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
          horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
        };
      }
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
    var person = new Person(personData);

    expect(person.get('firstName')).to.eql(personData.firstName);
    expect(person.get('movies')).to.eql(personData.movies);
    expect(person.get('movies.action')).to.eql(personData.movies.action);
  });

  it('can have observables mapped and an array of values retreived correctly via get', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        this.firstName = fw.observable(person.firstName).mapTo('firstName');
        this.lastName = fw.observable(person.lastName).mapTo('lastName');
        this.movieCollection = {
          action: fw.observableArray(person.movies.action).mapTo('movies.action'),
          drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
          comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
          horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
        };
      }
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
    var person = new Person(personData);

    expect(person.get(['firstName', 'lastName'])).to.eql(_.pick(personData, ['firstName', 'lastName']));
  });

  it('can have a correct dirtyMap() produced', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        this.firstName = fw.observable(person.firstName).mapTo('firstName');
        this.lastName = fw.observable(person.lastName).mapTo('lastName');
        this.movieCollection = {
          action: fw.observableArray(person.movies.action).mapTo('movies.action'),
          drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
          comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
          horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
        };
      }
    });

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

    expect(person.dirtyMap()).to.eql({
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

    expect(person.dirtyMap()).to.eql({
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
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        this.firstName = fw.observable().mapTo('firstName');
        this.lastName = fw.observable().mapTo('lastName');
        this.movieCollection = {
          action: fw.observableArray().mapTo('movies.action'),
          drama: fw.observableArray().mapTo('movies.drama'),
          comedy: fw.observableArray().mapTo('movies.comedy'),
          horror: fw.observableArray().mapTo('movies.horror')
        };
      }
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
    var person = new Person();

    expect(person.firstName()).to.eql(undefined);

    person.set(personData);

    expect(person.firstName()).to.eql(personData.firstName);
  });

  it('can (re)map the primary key', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(personData) {
        this.firstName = fw.observable().mapTo('firstName');
        this.lastName = fw.observable().mapTo('lastName');
        this.movieCollection = {
          action: fw.observableArray().mapTo('movies.action'),
          drama: fw.observableArray().mapTo('movies.drama'),
          comedy: fw.observableArray().mapTo('movies.comedy'),
          horror: fw.observableArray().mapTo('movies.horror')
        };

        this.id = fw.observable().mapTo('id');
      }
    });

    var person = new Person();

    expect(person.$id).to.be(person.id);
  });

  it('can correctly be flagged as dirty when a mapped field value is altered', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        this.firstName = fw.observable(person.firstName).mapTo('firstName');
        this.lastName = fw.observable(person.lastName).mapTo('lastName');
        this.movieCollection = {
          action: fw.observableArray(person.movies.action).mapTo('movies.action'),
          drama: fw.observableArray(person.movies.drama).mapTo('movies.drama'),
          comedy: fw.observableArray(person.movies.comedy).mapTo('movies.comedy'),
          horror: fw.observableArray(person.movies.horror).mapTo('movies.horror')
        };
      }
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
    var person = new Person(personData);

    expect(person.$dirty()).to.be(false);

    person.firstName('test123');

    expect(person.$dirty()).to.be(true);
  });

  it('can correctly POST data on initial save()', function(done) {
    var postValue = '__POST__CHECK__';
    $.mockjax({
      responseTime: 10,
      url: "/personPOST",
      type: 'POST',
      responseText: {
        "id": 1,
        "firstName": postValue,
        "lastName": null,
        "email": null
      }
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: '/personPOST',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person();

    expect(person.firstName()).not.to.be(postValue);

    person.save();
    setTimeout(function() {
      expect(person.$id()).to.be(1);
      expect(person.firstName()).to.be(postValue);
      done();
    }, 40);
  });

  it('can correctly POST data on initial save() and then PUT on subsequent calls', function(done) {
    var postValue = '__POST__CHECK__';
    var putValue = '__PUT__CHECK__';
    var personData = {
      "id": 1,
      "firstName": null,
      "lastName": null,
      "email": null
    };

    $.mockjax({
      responseTime: 10,
      url: "/personPOSTPUT",
      type: 'POST',
      responseText: _.extend({}, personData, { firstName: postValue })
    });

    $.mockjax({
      responseTime: 10,
      url: "/personPOSTPUT/1",
      type: 'PUT',
      responseText: _.extend({}, personData, { firstName: putValue })
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: '/personPOSTPUT',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person();

    expect(person.firstName()).not.to.be(postValue);

    person.save();
    setTimeout(function() {
      expect(person.$id()).to.be(1);
      expect(person.firstName()).to.be(postValue);

      expect(person.firstName()).not.to.be(putValue);
      person.save();
      setTimeout(function() {
        expect(person.firstName()).to.be(putValue);
        done();
      }, 40);
    }, 40);
  });

  it('can correctly POST data and apply parse() method with return on save()', function(done) {
    var postValue = '__POST__CHECK__';
    $.mockjax({
      responseTime: 10,
      url: "/personPOSTParse",
      type: 'POST',
      responseText: {
        "id": 1,
        "firstName": null,
        "lastName": null,
        "email": null
      }
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: '/personPOSTParse',
      parse: function(response) {
        response.firstName = postValue;
        return response;
      },
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person();

    expect(person.firstName()).not.to.be(postValue);

    person.save();
    setTimeout(function() {
      expect(person.$id()).to.be(1);
      expect(person.firstName()).to.be(postValue);
      done();
    }, 40);
  });

  it('can correctly fetch() data from the server via a pre-filled idAttribute', function(done) {
    var getValue = '__GET__CHECK__';
    var personData = {
      "id": 100,
      "firstName": null,
      "lastName": null,
      "email": null
    };

    $.mockjax({
      responseTime: 10,
      url: "/personGET/" + personData.id,
      type: 'GET',
      responseText: _.extend({}, personData, { firstName: getValue })
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: '/personGET',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person(personData);

    expect(person.firstName()).not.to.be(getValue);

    var fetchResult = person.fetch();
    expect(fetchResult).to.be.an('object');
    expect(fetchResult.done).to.be.a('function');

    setTimeout(function() {
      expect(person.$id()).to.be(personData.id);
      expect(person.firstName()).to.be(getValue);
      done();
    }, 40);
  });

  it('can correctly fetch() data from the server with a provided parse() method', function(done) {
    var getValue = '__GET__CHECK__';
    var personData = {
      "id": 100,
      "firstName": null,
      "lastName": null,
      "email": null
    };

    $.mockjax({
      responseTime: 10,
      url: "/personGETParse/" + personData.id,
      type: 'GET',
      responseText: personData
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: '/personGETParse',
      parse: function(response) {
        response.firstName = getValue;
        return response;
      },
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person(personData);

    expect(person.firstName()).not.to.be(getValue);

    var fetchResult = person.fetch();
    expect(fetchResult).to.be.an('object');
    expect(fetchResult.done).to.be.a('function');

    setTimeout(function() {
      expect(person.$id()).to.be(personData.id);
      expect(person.firstName()).to.be(getValue);
      done();
    }, 40);
  });

  it('can correctly fetch() data from the server via a pre-filled custom idAttribute', function(done) {
    var getValue = '__GET__CUSTOM__CHECK__';
    var personData = {
      "customId": 100,
      "firstName": null,
      "lastName": null,
      "email": null
    };

    $.mockjax({
      responseTime: 10,
      url: "/personGETWithCustomId/" + personData.customId,
      type: 'GET',
      responseText: _.extend({}, personData, { firstName: getValue })
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: '/personGETWithCustomId',
      idAttribute: 'customId',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person(personData);

    expect(person.firstName()).not.to.be(getValue);

    var fetchResult = person.fetch();
    expect(fetchResult).to.be.an('object');
    expect(fetchResult.done).to.be.a('function');

    setTimeout(function() {
      expect(person.customId()).to.be(personData.customId);
      expect(person.firstName()).to.be(getValue);
      done();
    }, 40);
  });

  it('can correctly fetch() data from the server with overridden ajaxOptions', function(done) {
    var ajaxOptionsUrl = "/getDataModelAjaxOptions";
    var personData = {
      "id": 100,
      "firstName": 'SpecialName',
      "lastName": null,
      "email": null
    };

    $.mockjax({
      responseTime: 10,
      url: ajaxOptionsUrl,
      type: 'GET',
      responseText: personData
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: '/invalidURL',
      ajaxOptions: {
        url: ajaxOptionsUrl
      },
      initialize: function(person) {
        person = person || {};
        this.id(person.id);
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person({ id: personData.id });
    person.fetch();

    setTimeout(function() {
      expect(person.firstName()).to.be(personData.firstName);
      done();
    }, 40);
  });

  it('can correctly fetch() data from the server via a url based on an evaluator function', function(done) {
    var getValue = '__GET__CUSTOM__CHECK__';
    var personData = {
      "id": 100,
      "firstName": null,
      "lastName": null,
      "email": null
    };

    $.mockjax({
      responseTime: 10,
      url: "/personGETWithUrlInEvaluator/" + personData.id,
      type: 'GET',
      responseText: _.extend({}, personData, { firstName: getValue })
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: function() {
        return '/personGETWithUrlInEvaluator';
      },
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person(personData);

    expect(person.firstName()).not.to.be(getValue);

    var fetchResult = person.fetch();
    expect(fetchResult).to.be.an('object');
    expect(fetchResult.done).to.be.a('function');

    setTimeout(function() {
      expect(person.$id()).to.be(personData.id);
      expect(person.firstName()).to.be(getValue);
      done();
    }, 40);
  });

  it('can correctly fetch() data from the server via a url with interpolated parameters', function(done) {
    var url = '/personWithInterpolatedParams';
    var personData = {
      "id": 100,
      "firstName": 'interpolatedFirstName',
      "lastName": 'personDataLastName',
      "email": null
    };

    $.mockjax({
      responseTime: 10,
      url: url + '/' + personData.firstName,
      type: 'GET',
      responseText: personData
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      pkInURL: false,
      url: url + '/:firstName',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var person = new Person({ id: personData.id, firstName: personData.firstName });

    expect(person.lastName()).not.to.be(personData.lastName);

    var fetchResult = person.fetch();
    expect(fetchResult).to.be.an('object');
    expect(fetchResult.done).to.be.a('function');

    setTimeout(function() {
      expect(person.lastName()).to.be(personData.lastName);
      done();
    }, 40);
  });
});
