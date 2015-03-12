'use strict';

describe('sanity', function () {
  it('has a fw.viewModels property', function() {
    expect(fw.viewModels).to.be.an('object');
  });

  it('has a fw.components property', function() {
    expect(fw.components).to.be.an('object');
  });

  it('has a fw.outlets property', function() {
    expect(fw.outlets).to.be.an('object');
  });

  it('has the ability to create a namespace', function() {
    expect(fw.namespace).to.be.a('function');
    expect(fw.namespace()).to.be.an('object');
  });

  it('has the ability to create a viewModel', function() {
    expect(fw.viewModel).to.be.a('function');
    expect(fw.viewModel()).to.be.a('function');
  });
});
