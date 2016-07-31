define(['footwork', 'lodash', 'jquery'], function(fw, _, $) {

  describe('viewModel', function() {
    var testContainer;

    beforeEach(function() {
      jasmine.addMatchers(customMatchers);
      fixture.setBase('tests/assets/fixtures');
    });
    afterEach(function() {
      fixture.cleanup(testContainer);
    });

    it('has the ability to create a viewModel', function() {
      expect(fw.viewModel.create).toBeA('function');
      expect(fw.viewModel.create()).toBeA('function');
    });

    it('has the ability to create a viewModel with a correctly defined namespace whos name we can retrieve', function() {
      var ModelA = fw.viewModel.create({
        namespace: 'ModelA'
      });
      var modelA = new ModelA();

      expect(modelA.$namespace).toBeAn('object');
      expect(modelA.$namespace.getName()).toBe('ModelA');
    });

    it('has the ability to be instantiated with with extended attributes', function() {
      var ModelA = fw.viewModel.create({
        extend: {
          extendedAttribute: true
        }
      });
      var modelA = new ModelA();

      expect(modelA.extendedAttribute).toBe(true);
    });

    it('correctly names and increments counter for indexed viewModels', function() {
      var IndexedViewModel = fw.viewModel.create({
        namespace: 'IndexedViewModel',
        autoIncrement: true
      });

      var firstViewModel = new IndexedViewModel();
      var secondViewModel = new IndexedViewModel();
      var thirdViewModel = new IndexedViewModel();

      expect(firstViewModel.$namespace.getName()).toBe('IndexedViewModel0');
      expect(secondViewModel.$namespace.getName()).toBe('IndexedViewModel1');
      expect(thirdViewModel.$namespace.getName()).toBe('IndexedViewModel2');
    });
  });

});

// describe('viewModel', function () {

//   it('correctly applies a mixin to a viewModel', function() {
//     var ViewModelWithMixin = fw.viewModel.create({
//       namespace: 'ViewModelWithMixin',
//       mixins: [
//         {
//           _preInit: function() {
//             this.preInitRan = true;
//           },
//           mixin: {
//             mixinPresent: true
//           },
//           _postInit: function() {
//             this.postInitRan = true;
//           }
//         }
//       ]
//     });

//     var viewModel = new ViewModelWithMixin();

//     expect(viewModel.preInitRan).to.be(true);
//     expect(viewModel.mixinPresent).to.be(true);
//     expect(viewModel.postInitRan).to.be(true);
//   });

//   it('has the ability to create nested viewModels with correctly defined namespaces', function() {
//     var ModelA = fw.viewModel.create({
//       namespace: 'ModelA',
//       initialize: function() {
//         this.preSubModelNamespaceName = fw.utils.currentNamespaceName();
//         this.subModelB = new ModelB();
//         this.postSubModelNamespaceName = fw.utils.currentNamespaceName();
//       }
//     });

//     var ModelB = fw.viewModel.create({
//       namespace: 'ModelB',
//       initialize: function() {
//         this.preSubModelNamespaceName = fw.utils.currentNamespaceName();
//         this.subModelC = new ModelC();
//         this.postSubModelNamespaceName = fw.utils.currentNamespaceName();
//       }
//     });

//     var ModelC = fw.viewModel.create({
//       namespace: 'ModelC',
//       initialize: function() {
//         this.recordedNamespaceName = fw.utils.currentNamespaceName();
//       }
//     });

//     var modelA = new ModelA();
//     expect(modelA.preSubModelNamespaceName).to.eql('ModelA');
//     expect(modelA.postSubModelNamespaceName).to.eql('ModelA');
//     expect(modelA.subModelB.preSubModelNamespaceName).to.eql('ModelB');
//     expect(modelA.subModelB.postSubModelNamespaceName).to.eql('ModelB');
//     expect(modelA.subModelB.subModelC.recordedNamespaceName).to.eql('ModelC');
//   });

//   it('calls afterBinding after initialize with the correct target element when creating and binding a new instance', function() {
//     var initializeWasCalledFirst = false;
//     var afterBindingWasCalledSecond = false;
//     var containerIsTheSame = false;
//     var container = document.getElementById('afterBindingViewModel');

//     var ModelA = fw.viewModel.create({
//       namespace: 'ModelA',
//       initialize: function() {
//         if(!afterBindingWasCalledSecond) {
//           initializeWasCalledFirst = true;
//         }
//       },
//       afterRender: function(containingElement) {
//         if(initializeWasCalledFirst) {
//           afterBindingWasCalledSecond = true;
//         }
//         if(containingElement === container) {
//           containerIsTheSame = true;
//         }
//       }
//     });

//     var modelA = new ModelA();
//     fw.applyBindings(modelA, container);

//     expect(afterBindingWasCalledSecond).to.be(true);
//     expect(containerIsTheSame).to.be(true);
//   });

//   it('after binding has the correct containing $element referenced', function(done) {
//     var container = document.getElementById('afterBindingViewModelElementReference');

//     var ModelA = fw.viewModel.create({
//       namespace: 'ModelA',
//       afterRender: function(containingElement) {
//         expect(containingElement).to.be(container);
//         done();
//       }
//     });

//     fw.applyBindings(new ModelA(), container);
//   });

//   it('can register a viewModel', function() {
//     expect( fw.components.isRegistered('registeredViewModelCheck') ).to.be(false);

//     fw.viewModel.register('registeredViewModelCheck', function() {});

//     expect( fw.viewModel.isRegistered('registeredViewModelCheck') ).to.be(true);
//   });

//   it('can get a registered viewModel', function() {
//     expect( fw.components.isRegistered('registeredViewModelRetrieval') ).to.be(false);

//     var RegisteredViewModelRetrieval = function() {};

//     fw.viewModel.register('registeredViewModelRetrieval', RegisteredViewModelRetrieval);

//     expect( fw.viewModel.isRegistered('registeredViewModelRetrieval') ).to.be(true);
//     expect( fw.viewModel.getRegistered('registeredViewModelRetrieval') ).to.be(RegisteredViewModelRetrieval);
//   });

//   it('can get all instantiated viewModels', function() {
//     var ViewModel = fw.viewModel.create();
//     var viewModels = [ new ViewModel(), new ViewModel() ];

//     expect(_.keys(fw.viewModel.getAll()).length).to.be.greaterThan(0);
//   });

//   it('can get all instantiated viewModels of a specific type/name', function() {
//     var viewModels = [];
//     var ViewModel = fw.viewModel.create({ namespace: 'getAllSpecificViewModel' });
//     var numToMake = _.random(1,15);

//     for(var x = numToMake; x; x--) {
//       viewModels.push( new ViewModel() );
//     }

//     expect(fw.viewModel.getAll('getAllSpecificViewModelDoesNotExist').length).to.be(0);
//     expect(fw.viewModel.getAll('getAllSpecificViewModel').length).to.be(numToMake);
//   });

//   it('can autoRegister a viewModel during class method creation', function() {
//     var isRegistered = fw.viewModel.isRegistered('autoRegisteredViewModel');

//     expect(isRegistered).to.be(false);

//     fw.viewModel.create({
//       namespace: 'autoRegisteredViewModel',
//       autoRegister: true
//     });

//     isRegistered = fw.viewModel.isRegistered('autoRegisteredViewModel');

//     expect(isRegistered).to.be(true);
//   });

//   it('can bind to the DOM using a <viewModel> declaration', function(done) {
//     var wasInitialized = false;
//     var container = document.getElementById('declarativeViewModel');

//     fw.viewModel.create({
//       namespace: 'declarativeViewModel',
//       autoRegister: true,
//       initialize: function() {
//         wasInitialized = true;
//       }
//     });

//     expect(wasInitialized).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(wasInitialized).to.be(true);
//       done();
//     }, 0);
//   });

//   it('can bind to the DOM using a shared instance', function(done) {
//     var wasInitialized = false;
//     var container = document.getElementById('registeredViewModelInstance');
//     var boundPropertyValue = 'registeredViewModelInstance';

//     fw.viewModel.register('registeredViewModelInstance', {
//       instance: {
//         boundProperty: boundPropertyValue
//       }
//     });

//     expect(wasInitialized).to.be(false);
//     expect($('#registeredViewModelInstance .result').text()).not.to.be(boundPropertyValue);

//     fw.start(container);

//     setTimeout(function() {
//       expect($('#registeredViewModelInstance .result').text()).to.be(boundPropertyValue);
//       done();
//     }, 20);
//   });

//   it('can bind to the DOM using a generated instance', function(done) {
//     var wasInitialized = false;
//     var container = document.getElementById('registeredViewModelGenerated');
//     var boundPropertyValue = 'registeredViewModelGenerated';

//     fw.viewModel.register('registeredViewModelGenerated', {
//       createViewModel: function(params, info) {
//         expect(params.var).to.be('registeredViewModelGenerated');
//         expect(info.element.getAttribute('id')).to.be('registeredViewModelGeneratedElement');

//         return {
//           boundProperty: boundPropertyValue
//         };
//       }
//     });

//     expect(wasInitialized).to.be(false);
//     expect($('#registeredViewModelGenerated .result').text()).not.to.be(boundPropertyValue);

//     fw.start(container);

//     setTimeout(function() {
//       expect($('#registeredViewModelGenerated .result').text()).to.be(boundPropertyValue);
//       done();
//     }, 20);
//   });

//   it('has the animation classes applied properly', function(done) {
//     var wasInitialized = false;
//     var container = document.getElementById('afterBindingViewModelAnimation');
//     var afterBindingCalled = false;
//     var theElement;

//     fw.viewModel.create({
//       namespace: 'afterBindingViewModelAnimation',
//       autoRegister: true,
//       initialize: function() {
//         wasInitialized = true;
//       },
//       afterRender: function(element) {
//         afterBindingCalled = true;
//         theElement = element;
//         expect(theElement.className.indexOf('fw-entity-animate')).to.be(-1);
//       }
//     });

//     expect(afterBindingCalled).to.be(false);
//     expect(wasInitialized).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(afterBindingCalled).to.be(true);
//       expect(wasInitialized).to.be(true);
//       setTimeout(function() {
//         expect(theElement.className.indexOf('fw-entity-animate')).to.be.greaterThan(-1);
//         done();
//       }, 100);
//     }, 0);
//   });

//   it('can nest <viewModel> declarations', function(done) {
//     var container = document.getElementById('nestedViewModels');
//     var outerWasInitialized = false;
//     var innerWasInitialized = false;

//     fw.viewModel.create({
//       namespace: 'nestedViewModelOuter',
//       autoRegister: true,
//       initialize: function() {
//         outerWasInitialized = true;
//       }
//     });

//     fw.viewModel.create({
//       namespace: 'nestedViewModelInner',
//       autoRegister: true,
//       initialize: function() {
//         innerWasInitialized = true;
//       }
//     });

//     expect(outerWasInitialized).to.be(false);
//     expect(innerWasInitialized).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(outerWasInitialized).to.be(true);
//       expect(innerWasInitialized).to.be(true);
//       done();
//     }, 0);
//   });

//   it('can pass parameters through a <viewModel> declaration', function(done) {
//     var wasInitialized = false;
//     var container = document.getElementById('paramsViewModel');

//     fw.viewModel.create({
//       namespace: 'paramsViewModel',
//       autoRegister: true,
//       initialize: function(params) {
//         expect(params.testValueOne).to.be(1);
//         expect(params.testValueTwo).to.eql([1,2,3]);
//         wasInitialized = true;
//       }
//     });

//     expect(wasInitialized).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(wasInitialized).to.be(true);
//       done();
//     }, 0);
//   });

//   it('calls onDispose when the containing element is removed from the DOM', function() {
//     var container = document.getElementById('onDisposeViewModel');
//     var onDisposeWasCalled = false;

//     var WrapperViewModel = fw.viewModel.create({
//       initialize: function() {
//         this.showIt = fw.observable(true);
//       }
//     });

//     var theElement;
//     var ViewModelWithDispose = fw.viewModel.create({
//       namespace: 'ViewModelWithDispose',
//       autoRegister: true,
//       afterRender: function(element) {
//         theElement = element;
//         expect(theElement.tagName).to.be('VIEWMODEL');
//       },
//       onDispose: function(element) {
//         onDisposeWasCalled = true;
//         expect(element).to.be(theElement);
//       }
//     });

//     var wrapper = new WrapperViewModel();
//     fw.applyBindings(wrapper, container);

//     expect(onDisposeWasCalled).to.be(false);

//     wrapper.showIt(false);

//     expect(onDisposeWasCalled).to.be(true);
//   });

//   it('can have a registered location set and retrieved proplerly', function() {
//     fw.viewModel.registerLocation('registeredLocationRetrieval', '/bogus/path');
//     expect(fw.viewModel.getLocation('registeredLocationRetrieval')).to.be('/bogus/path');
//     fw.viewModel.registerLocation(/regexp.*/, '/bogus/path');
//     expect(fw.viewModel.getLocation('regexp-model')).to.be('/bogus/path');
//   });

//   it('can have an array of models registered to a location and retrieved proplerly', function() {
//     fw.viewModel.registerLocation(['registeredLocationRetrievalArray1', 'registeredLocationRetrievalArray2'], '/bogus/path');
//     expect(fw.viewModel.getLocation('registeredLocationRetrievalArray1')).to.be('/bogus/path');
//     expect(fw.viewModel.getLocation('registeredLocationRetrievalArray2')).to.be('/bogus/path');
//   });

//   it('can have a registered location with filename set and retrieved proplerly', function() {
//     fw.viewModel.registerLocation('registeredLocationWithFilenameRetrieval', '/bogus/path/__file__.js');
//     expect(fw.viewModel.getLocation('registeredLocationWithFilenameRetrieval')).to.be('/bogus/path/__file__.js');
//   });

//   it('can have a specific file extension set and used correctly', function() {
//     fw.viewModel.fileExtensions('.jscript');
//     fw.viewModel.registerLocation('registeredLocationWithExtensionRetrieval', '/bogus/path/');

//     expect(fw.viewModel.getFileName('registeredLocationWithExtensionRetrieval')).to.be('registeredLocationWithExtensionRetrieval.jscript');

//     fw.viewModel.fileExtensions('.js');
//   });

//   it('can have a callback specified as the extension with it invoked and the return value used', function() {
//     fw.viewModel.fileExtensions(function(moduleName) {
//       expect(moduleName).to.be('registeredLocationWithFunctionExtensionRetrieval');
//       return '.jscriptFunction';
//     });
//     fw.viewModel.registerLocation('registeredLocationWithFunctionExtensionRetrieval', '/bogus/path/');

//     expect(fw.viewModel.getFileName('registeredLocationWithFunctionExtensionRetrieval')).to.be('registeredLocationWithFunctionExtensionRetrieval.jscriptFunction');

//     fw.viewModel.fileExtensions('.js');
//   });

//   it('can load via requirejs with a declarative initialization from an already registered module', function(done) {
//     var container = document.getElementById('AMDPreRegisteredViewModel');
//     var viewModelLoaded = false;

//     define('AMDPreRegisteredViewModel', ['footwork'], function(fw) {
//       return fw.viewModel.create({
//         initialize: function() {
//           viewModelLoaded = true;
//         }
//       });
//     });

//     expect(viewModelLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(viewModelLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can load via registered viewModel with a declarative initialization', function(done) {
//     var container = document.getElementById('registeredViewModel');
//     var registeredViewModelWasLoaded = false;

//     fw.viewModel.register('registeredViewModel', fw.viewModel.create({
//       initialize: function() {
//         registeredViewModelWasLoaded = true;
//       }
//     }));

//     expect(registeredViewModelWasLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(registeredViewModelWasLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can load via requirejs with a declarative initialization from a specified location', function(done) {
//     var container = document.getElementById('AMDViewModel');
//     window.AMDViewModelWasLoaded = false;

//     fw.viewModel.registerLocation('AMDViewModel', 'testAssets/');

//     expect(window.AMDViewModelWasLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(window.AMDViewModelWasLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
//     var container = document.getElementById('AMDViewModelRegexp');
//     window.AMDViewModelRegexpWasLoaded = false;

//     fw.viewModel.registerLocation(/AMDViewModelRegexp-.*/, 'testAssets/');

//     expect(window.AMDViewModelRegexpWasLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(window.AMDViewModelRegexpWasLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
//     var container = document.getElementById('AMDViewModelFullName');
//     window.AMDViewModelFullNameWasLoaded = false;

//     fw.viewModel.registerLocation('AMDViewModelFullName', 'testAssets/AMDViewModelFullName.js');

//     expect(window.AMDViewModelFullNameWasLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(window.AMDViewModelFullNameWasLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can specify and load via requirejs with the default location', function(done) {
//     var container = document.getElementById('defaultViewModelLocation');
//     window.defaultViewModelLocationLoaded = false;

//     fw.viewModel.defaultLocation('testAssets/defaultViewModelLocation/');

//     expect(window.defaultViewModelLocationLoaded).to.be(false);

//     fw.start(container);

//     setTimeout(function() {
//       expect(window.defaultViewModelLocationLoaded).to.be(true);
//       done();
//     }, 40);
//   });
// });
