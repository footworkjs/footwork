'use strict';

describe('sanity', function () {
  it('has the ability to create a namespace', function() {
    expect(ko.namespace).to.be.a('function');
    expect(ko.namespace()).to.be.an('object');
  });

  it('has the ability to create a model', function() {
    expect(ko.model).to.be.a('function');
    expect(ko.model()).to.be.a('function');
  });

  it('has the ability to create a model with the correctly defined namespace', function() {
    var ModelA = ko.model({
      namespace: 'ModelA'
    });
    var modelA = new ModelA();

    expect(modelA.namespaceName).to.eql('ModelA');
  });

  it('has the ability to create nested models with the correctly defined namespaces', function() {
    var ModelA = ko.model({
      namespace: 'ModelA',
      factory: function() {
        this.preSubModelNamespaceName = ko.currentNamespaceName();
        this.subModelB = new ModelB();
        this.postSubModelNamespaceName = ko.currentNamespaceName();
      }
    });

    var ModelB = ko.model({
      namespace: 'ModelB',
      factory: function() {
        this.preSubModelNamespaceName = ko.currentNamespaceName();
        this.subModelC = new ModelC();
        this.postSubModelNamespaceName = ko.currentNamespaceName();
      }
    });

    var ModelC = ko.model({
      namespace: 'ModelC'
    });

    var modelA = new ModelA();
    expect(modelA.preSubModelNamespaceName).to.eql('ModelA');
    expect(modelA.postSubModelNamespaceName).to.eql('ModelA');
    expect(modelA.subModelB.preSubModelNamespaceName).to.eql('ModelB');
    expect(modelA.subModelB.postSubModelNamespaceName).to.eql('ModelB');
    expect(modelA.subModelB.subModelC.namespaceName).to.eql('ModelC');
  });
});