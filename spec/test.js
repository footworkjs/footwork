'use strict';

var expect = expect || require('../bower_components/expect/expect');
var ko = ko || require('../dist/footwork');

describe('knockout', function () {
  it('object exists', function () {
    expect(ko.observable).not.to.be(undefined);
  });
});