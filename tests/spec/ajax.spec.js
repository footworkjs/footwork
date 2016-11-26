define(['footwork', 'lodash', 'fetch-mock'],
  function(fw, _, fetchMock) {
    describe('ajax', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

      it('sync throws error when not passed a dataModel or collection', function() {
        expect(function() { fw.sync('get', null) }).toThrow();
      });

      it('sync throws error when passed an invalid action', function() {
        expect(function() { fw.sync('invalid-action', fw.collection()) }).toThrow();
      });

      it('sync throws error when attempting to request using an invalid URL', function() {
        var testDataModel = new (function () {
          fw.dataModel.boot(this, {
            url: null
          });
        });
        expect(function() { fw.sync('get', testDataModel) }).toThrow();
      });
    });
  }
);
