'use strict';

describe('sanity', function () {
  it('has the ability to create a namespace', function() {
    expect(fw.namespace).to.be.a('function');
    expect(fw.namespace()).to.be.an('object');
  });

  it('has the ability to create a model', function() {
    expect(fw.viewModel).to.be.a('function');
    expect(fw.viewModel()).to.be.a('function');
  });

  it('has the ability to create a model with a correctly defined namespace', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA'
    });
    var modelA = new ModelA();

    expect(modelA.getNamespaceName()).to.eql('ModelA');
  });

  it('has the ability to create nested models with correctly defined namespaces', function() {
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
});
