define(['footwork', 'lodash', 'tools'],
  function(fw, _, tools) {
    describe('viewModel core', function() {
      beforeEach(tools.prepareTestEnv);
      afterEach(tools.cleanTestEnv);

      it('has the ability to create a viewModel', function() {
        var BadViewModel = function ViewModel() {
          var self = fw.viewModel.boot();
        };
        expect(function() { new BadViewModel() }).toThrow();

        var ViewModel = function ViewModel() {
          var self = fw.viewModel.boot(this);
          expect(self).toBe(this);
        };

        var vm = new ViewModel();

        expect(vm).toBeA('viewModel');
        expect(vm).toBeInstanceOf(ViewModel);
      });

      it('has the ability to create a viewModel with a correctly defined namespace whos name we can retrieve', function() {
        var namespaceName = tools.generateNamespaceName();
        var Model = function () {
          var self = fw.viewModel.boot(this, {
            namespace: namespaceName
          });
        };

        var modelA = new Model();

        expect(modelA.$namespace).toBeAn('object');
        expect(modelA.$namespace.getName()).toBe(namespaceName);
      });
    });
  }
);
