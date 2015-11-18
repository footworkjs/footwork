'use strict';

describe('sanity', function () {
  it('has a fw.viewModel property', function() {
    expect(fw.viewModel).to.be.an('object');
  });

  it('has a fw.dataModel property', function() {
    expect(fw.dataModel).to.be.an('object');
  });

  it('has a fw.router property', function() {
    expect(fw.router).to.be.an('object');
  });

  it('has a fw.components property', function() {
    expect(fw.components).to.be.an('object');
  });

  it('has a fw.outlet property', function() {
    expect(fw.outlet).to.be.an('object');
  });

  it('has the ability to create a namespace', function() {
    expect(fw.namespace).to.be.a('function');
    expect(fw.namespace()).to.be.an('object');
  });

  it('has the ability to create a viewModel', function() {
    expect(fw.viewModel.create).to.be.a('function');
    expect(fw.viewModel.create()).to.be.a('function');
  });
});
