'use strict';

var sandbox = document.getElementById('sandbox');

describe('viewModel', function () {
  it('has the ability to create a viewModel', function() {
    expect(fw.viewModel).to.be.a('function');
    expect(fw.viewModel()).to.be.a('function');
  });

  it('has the ability to create a viewModel with a correctly defined namespace whos name we can retrieve', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA'
    });
    var modelA = new ModelA();

    expect(modelA.$namespace).to.be.an('object');
    expect(modelA.getNamespaceName()).to.eql('ModelA');
  });

  it('correctly names and increments counter for indexed viewModels', function() {
    var IndexedViewModel = fw.viewModel({
      namespace: 'IndexedViewModel',
      autoIncrement: true
    });

    var firstViewModel = new IndexedViewModel();
    var secondViewModel = new IndexedViewModel();
    var thirdViewModel = new IndexedViewModel();

    expect(firstViewModel.getNamespaceName()).to.eql('IndexedViewModel0');
    expect(secondViewModel.getNamespaceName()).to.eql('IndexedViewModel1');
    expect(thirdViewModel.getNamespaceName()).to.eql('IndexedViewModel2');
  });

  it('correctly applies a mixin to a viewModel', function() {
    var ViewModelWithMixin = fw.viewModel({
      namespace: 'ViewModelWithMixin',
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

    var viewModel = new ViewModelWithMixin();

    expect(viewModel.preInitRan).to.be(true);
    expect(viewModel.mixinPresent).to.be(true);
    expect(viewModel.postInitRan).to.be(true);
  });

  it('has the ability to create nested viewModels with correctly defined namespaces', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.preSubModelNamespaceName = fw.utils.currentNamespaceName();
        this.subModelB = new ModelB();
        this.postSubModelNamespaceName = fw.utils.currentNamespaceName();
      }
    });

    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.preSubModelNamespaceName = fw.utils.currentNamespaceName();
        this.subModelC = new ModelC();
        this.postSubModelNamespaceName = fw.utils.currentNamespaceName();
      }
    });

    var ModelC = fw.viewModel({
      namespace: 'ModelC',
      initialize: function() {
        this.recordedNamespaceName = fw.utils.currentNamespaceName();
      }
    });

    var modelA = new ModelA();
    expect(modelA.preSubModelNamespaceName).to.eql('ModelA');
    expect(modelA.postSubModelNamespaceName).to.eql('ModelA');
    expect(modelA.subModelB.preSubModelNamespaceName).to.eql('ModelB');
    expect(modelA.subModelB.postSubModelNamespaceName).to.eql('ModelB');
    expect(modelA.subModelB.subModelC.recordedNamespaceName).to.eql('ModelC');
  });

  it('calls afterInit after initialize when creating a new instance', function() {
    var initializeWasCalledFirst = false;
    var afterInitWasCalledSecond = false;

    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        if(!afterInitWasCalledSecond) {
          initializeWasCalledFirst = true;
        }
      },
      afterInit: function() {
        if(initializeWasCalledFirst) {
          afterInitWasCalledSecond = true;
        }
      }
    });
    var modelA = new ModelA();

    expect(afterInitWasCalledSecond).to.be(true);
  });

  it('calls afterBinding after initialize with the correct target element when creating and binding a new instance', function() {
    var initializeWasCalledFirst = false;
    var afterBindingWasCalledSecond = false;
    var containerIsTheSame = false;
    var container = document.getElementById('afterBinding');

    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        if(!afterBindingWasCalledSecond) {
          initializeWasCalledFirst = true;
        }
      },
      afterBinding: function(containingElement) {
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
    var hasElementReference = false;
    var checkForReference;
    var modelA;
    var container = document.getElementById('afterBindingElementReference');

    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      afterBinding: function(containingElement) {
        checkForReference();
      }
    });

    checkForReference = function() {
      if( _.isObject(modelA.$element) ) {
        hasElementReference = true;
      }

      expect(modelA.$element).to.be.an('object');
      expect(modelA.$element).to.be(container);
      done();
    };

    modelA = new ModelA();

    expect(hasElementReference).to.be(false);

    fw.applyBindings(modelA, container);
  });

  it('can register a viewModel', function() {
    expect( fw.components.isRegistered('registeredViewModelCheck') ).to.be(false);

    fw.viewModels.register('registeredViewModelCheck', function() {});

    expect( fw.viewModels.isRegistered('registeredViewModelCheck') ).to.be(true);
  });

  it('can get a registered viewModel', function() {
    expect( fw.components.isRegistered('registeredViewModelRetrieval') ).to.be(false);

    var RegisteredViewModelRetrieval = function() {};

    fw.viewModels.register('registeredViewModelRetrieval', RegisteredViewModelRetrieval);

    expect( fw.viewModels.isRegistered('registeredViewModelRetrieval') ).to.be(true);
    expect( fw.viewModels.getRegistered('registeredViewModelRetrieval') ).to.be(RegisteredViewModelRetrieval);
  });

  it('can get all instantiated viewModels', function() {
    var ViewModel = fw.viewModel();
    var viewModels = [ new ViewModel(), new ViewModel() ];

    expect( _.keys(fw.viewModels.getAll()).length ).to.be.greaterThan(0);
  });

  it('can get all instantiated viewModels of a specific type/name', function() {
    var viewModels = [];
    var ViewModel = fw.viewModel({ namespace: 'getAllSpecificViewModel' });
    var numToMake = _.random(1,15);

    for(var x = numToMake; x; x--) {
      viewModels.push( new ViewModel() );
    }

    expect( fw.viewModels.getAll('getAllSpecificViewModel').length ).to.be(numToMake);
  });

  it('can autoRegister a viewModel during class method creation', function() {
    var isRegistered = fw.viewModels.isRegistered('autoRegisteredViewModel');

    expect(isRegistered).to.be(false);

    fw.viewModel({
      namespace: 'autoRegisteredViewModel',
      autoRegister: true
    });

    isRegistered = fw.viewModels.isRegistered('autoRegisteredViewModel');

    expect(isRegistered).to.be(true);
  });

  it('can bind to the DOM using a <viewModel> declaration', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('declarativeViewModel');

    fw.viewModel({
      namespace: 'declarativeViewModel',
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

  it('can nest <viewModel> declarations', function(done) {
    var container = document.getElementById('nestedViewModels');
    var outerWasInitialized = false;
    var innerWasInitialized = false;

    fw.viewModel({
      namespace: 'nestedViewModelOuter',
      autoRegister: true,
      initialize: function() {
        outerWasInitialized = true;
      }
    });

    fw.viewModel({
      namespace: 'nestedViewModelInner',
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

  it('can pass parameters through a <viewModel> declaration', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('paramsViewModel');

    fw.viewModel({
      namespace: 'paramsViewModel',
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
    var container = document.getElementById('onDispose');
    var onDisposeWasCalled = false;

    var WrapperViewModel = fw.viewModel({
      initialize: function() {
        this.showIt = fw.observable(true);
      }
    });

    var ViewModelWithDispose = fw.viewModel({
      namespace: 'ViewModelWithDispose',
      autoRegister: true,
      onDispose: function() {
        onDisposeWasCalled = true;
      }
    });

    var wrapper = new WrapperViewModel();
    fw.applyBindings(wrapper, container);

    expect(onDisposeWasCalled).to.be(false);

    wrapper.showIt(false);

    expect(onDisposeWasCalled).to.be(true);
  });

  it('can have a registered location set and retrieved proplerly', function() {
    fw.viewModels.registerLocation('registeredLocationRetrieval', '/bogus/path');
    expect(fw.viewModels.getLocation('registeredLocationRetrieval')).to.be('/bogus/path');
  });

  it('can have a registered location with filename set and retrieved proplerly', function() {
    fw.viewModels.registerLocation('registeredLocationWithFilenameRetrieval', '/bogus/path/__file__.js');
    expect(fw.viewModels.getLocation('registeredLocationWithFilenameRetrieval')).to.be('/bogus/path/__file__.js');
  });

  it('can have a specific file extension set and used correctly', function() {
    fw.viewModels.fileExtensions('.jscript');
    fw.viewModels.registerLocation('registeredLocationWithExtensionRetrieval', '/bogus/path/');

    expect(fw.viewModels.getFileName('registeredLocationWithExtensionRetrieval')).to.be('registeredLocationWithExtensionRetrieval.jscript');

    fw.viewModels.fileExtensions('.js');
  });

  it('can have a callback specified as the extension with it invoked and the return value used', function() {
    fw.viewModels.fileExtensions(function(moduleName) {
      expect(moduleName).to.be('registeredLocationWithFunctionExtensionRetrieval');
      return '.jscriptFunction';
    });
    fw.viewModels.registerLocation('registeredLocationWithFunctionExtensionRetrieval', '/bogus/path/');

    expect(fw.viewModels.getFileName('registeredLocationWithFunctionExtensionRetrieval')).to.be('registeredLocationWithFunctionExtensionRetrieval.jscriptFunction');

    fw.viewModels.fileExtensions('.js');
  });

  it.skip('can load via requirejs with a declarative initialization from an already registered module', function(done) {
    /**
     * This test should work but requirejs currently doesn't seem to specify modules correctly.
     *
     * The following should work but does not:
     *
     * expect(require.specified('test')).to.be(false); // PASS
     *
     * define('test', [], function() {});
     *
     * expect(require.specified('test')).to.be(true); // FAIL
     *
     * It DOES work once your require() the module...but specified() is supposed to work without that.
     */

    var container = document.getElementById('AMDPreRegisteredViewModel');
    var viewModelLoaded = false;

    define('AMDPreRegisteredViewModel', ['fw'], function(fw) {
      return fw.viewModel({
        initialization: function() {
          viewModelLoaded = true;
        }
      });
    });

    expect(viewModelLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(viewModelLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via registered viewModel with a declarative initialization', function(done) {
    var container = document.getElementById('registeredViewModel');
    var registeredViewModelWasLoaded = false;

    fw.viewModels.register('registeredViewModel', fw.viewModel({
      initialize: function() {
        registeredViewModelWasLoaded = true;
      }
    }));

    expect(registeredViewModelWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(registeredViewModelWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via requirejs with a declarative initialization from a specified location', function(done) {
    var container = document.getElementById('AMDViewModel');
    window.AMDViewModelWasLoaded = false;

    fw.viewModels.registerLocation('AMDViewModel', 'scripts/testAssets/');

    expect(window.AMDViewModelWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(window.AMDViewModelWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
    var container = document.getElementById('AMDViewModelFullName');
    window.AMDViewModelFullNameWasLoaded = false;

    fw.viewModels.registerLocation('AMDViewModelFullName', 'scripts/testAssets/AMDViewModelFullName.js');

    expect(window.AMDViewModelFullNameWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(window.AMDViewModelFullNameWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can specify and load via requirejs with the default location', function(done) {
    var container = document.getElementById('defaultViewModelLocation');
    window.defaultViewModelLocationLoaded = false;

    fw.viewModels.defaultLocation('scripts/testAssets/defaultViewModelLocation/');

    expect(window.defaultViewModelLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.defaultViewModelLocationLoaded).to.be(true);
      done();
    }, 40);
  });
});
