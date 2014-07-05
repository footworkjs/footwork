'use strict';

describe('sanity', function () {
  it('has the ability to create a namespace', function() {
    expect(ko.namespace).to.be.a('function');
    expect(ko.namespace()).to.be.an('object');
  });

  it('has the ability to create a model', function() {
    expect(ko.viewModel).to.be.a('function');
    expect(ko.viewModel()).to.be.a('function');
  });

  it('has the ability to create a model with a correctly defined namespace', function() {
    var ModelA = ko.viewModel({
      namespace: 'ModelA'
    });
    var modelA = new ModelA();

    expect(modelA.getNamespaceName()).to.eql('ModelA');
  });

  it('has the ability to create nested models with correctly defined namespaces', function() {
    var ModelA = ko.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.preSubModelNamespaceName = ko.currentNamespaceName();
        this.subModelB = new ModelB();
        this.postSubModelNamespaceName = ko.currentNamespaceName();
      }
    });

    var ModelB = ko.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.preSubModelNamespaceName = ko.currentNamespaceName();
        this.subModelC = new ModelC();
        this.postSubModelNamespaceName = ko.currentNamespaceName();
      }
    });

    var ModelC = ko.viewModel({
      namespace: 'ModelC',
      initialize: function() {
        this.recordedNamespaceName = ko.currentNamespaceName();
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