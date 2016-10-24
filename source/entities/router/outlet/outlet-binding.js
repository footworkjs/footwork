var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var privateDataSymbol = require('../../../misc/config').privateDataSymbol;
var nearestParentRouter = require('../router-tools').nearestParentRouter;
var noParentViewModelError = { $namespace: { getName: function () { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };

/**
 * This custom binding:
 * 1. binds the outlet element to the $outlet on the router
 * 2. enables changes on the outlet 'route' (component definition observable) to be applied to the UI and load in various views
 */
fw.virtualElements.allowedBindings.$outlet = true;
fw.bindingHandlers.$outlet = {
  init: function (element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var parentViewModel = (_.isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var parentRouter = nearestParentRouter(bindingContext);

    element = element.parentNode;
    var outletName = element.getAttribute('name') || element.getAttribute('data-name');

    if (fw.isRouter(parentRouter)) {
      // register the viewModel with the outlet for future use when its route is changed
      parentRouter[privateDataSymbol].registerViewModelForOutlet(outletName, outletViewModel);

      // register this outlet and get the component binding route observable with its parentRouter
      outletViewModel.route = parentRouter.outlet(outletName);
    } else {
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + parentViewModel.$namespace.getName() + '] but no router was defined.');
    }
  }
};
