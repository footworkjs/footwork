'use strict';

describe('Sanity', function () {
  it('has ability to create a namespace', function() {
    expect(ko.namespace).to.be.a('function');
    expect(ko.namespace()).to.be.an('object');
  });

  it('has ability to create a model', function() {
    expect(ko.model).to.be.a('function');
    expect(ko.model()).to.be.a('function');
  });
});