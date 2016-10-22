define(['footwork', 'lodash', 'jquery', 'tools', 'fetch-mock'],
  function(fw, _, $, tools, fetchMock) {
    describe('viewModel', function() {
      beforeEach(tools.prepareTestEnv);
      afterEach(tools.cleanTestEnv);

      it('has the ability to create a viewModel', function() {
        var BadViewModel = function ViewModel() {
          var self = fw.viewModel.boot();
        };
        expect(function() { new BadViewModel() }).toThrow();

        var ViewModel = function ViewModel() {
          var self = fw.viewModel.boot(this);
        };

        var vm = new ViewModel();

        expect(vm).toBeA('viewModel');
        expect(vm).toBeInstanceOf(ViewModel);
      });
    });
  }
);
