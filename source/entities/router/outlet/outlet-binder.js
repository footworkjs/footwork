var fw = require('../../../../bower_components/knockoutjs/dist/knockout');
var _ = require('../../../misc/lodash');

var nearestParentRouter = require('../router-tools').nearestParentRouter;
var noParentViewModelError = { $namespace: { getName: function() { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };

// This custom binding binds the outlet element to the $outlet on the router, changes on its 'route' (component definition observable) will be applied to the UI and load in various views
fw.virtualElements.allowedBindings.$outletBinder = true;
fw.bindingHandlers.$outletBinder = {
  init: function(element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var $parentViewModel = (_.isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var $parentRouter = nearestParentRouter(bindingContext);
    var outletName = outletViewModel.outletName;
    var isRouter = require('../../entity-tools').isRouter;

    if (isRouter($parentRouter)) {
      // register the viewModel with the outlet for future use when its route is changed
      $parentRouter.__private('registerViewModelForOutlet')(outletName, outletViewModel);
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        // tell the router to clean up its reference to the outletViewModel
        $parentRouter.__private('unregisterViewModelForOutlet')(outletName);
        outletViewModel.dispose();
      });

      // register this outlet with its $parentRouter
      outletViewModel.route = $parentRouter.outlet(outletName);
    } else {
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + $parentViewModel.$namespace.getName() + '] but no router was defined.');
    }
  }
};
