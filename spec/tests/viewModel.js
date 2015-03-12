'use strict';

var sandbox = document.getElementById('sandbox');

describe('viewModel', function () {
  it('has the ability to create a viewModel', function() {
    expect(fw.viewModel).to.be.a('function');
    expect(fw.viewModel()).to.be.a('function');
  });

  it('has the ability to create a viewModel with a correctly defined namespace', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA'
    });
    var modelA = new ModelA();

    expect(modelA.getNamespaceName()).to.eql('ModelA');
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

  it('can autoRegister a viewModel during class method creation', function() {
    var isRegistered = fw.viewModels.isRegistered('AutoRegisteredViewModel');

    expect(isRegistered).to.be(false);

    var AutoRegisteredViewModel = fw.viewModel({
      namespace: 'AutoRegisteredViewModel',
      autoRegister: true,
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

    isRegistered = fw.viewModels.isRegistered('AutoRegisteredViewModel');

    expect(isRegistered).to.be(true);
  });

  it('can bind to the DOM using a <viewModel> declaration', function() {
    var wasInitialized = false;
    var container = document.getElementById('declarativeViewModel');

    fw.viewModel({
      namespace: 'ViewModelBoundWithDeclarativeStatement',
      autoRegister: true,
      initialize: function() {
        wasInitialized = true;
      }
    });

    expect(wasInitialized).to.be(false);
    fw.start(container);
    expect(wasInitialized).to.be(true);
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
});
