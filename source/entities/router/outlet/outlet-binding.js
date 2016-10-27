var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var privateDataSymbol = require('../../../misc/config').privateDataSymbol;
var nearestParentRouter = require('../router-tools').nearestParentRouter;
var noParentViewModelError = { $namespace: { getName: function () { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };

/**
 * This custom binding binds/registers the outlet on the router
 */
fw.virtualElements.allowedBindings.$outlet = true;
fw.bindingHandlers.$outlet = {
  init: function (element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var parentViewModel = (_.isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var parentRouter = nearestParentRouter(bindingContext);

    element = element.parentNode;
    var outletName = element.getAttribute('name') || element.getAttribute('data-name');

    if (fw.isRouter(parentRouter)) {
      // register the outlet with its parent router so it can manipulate it
      parentRouter[privateDataSymbol].registerOutlet(outletName, outletViewModel);
      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        parentRouter[privateDataSymbol].unregisterOutlet(outletName);
      });

      // attach the observable from the parentRouter that contains the component binding definition to display for this outlet
      outletViewModel.display = parentRouter.outlet(outletName);
    } else {
      throw new Error('Outlet \"' + outletName + '\" defined but no parent router was found.');
    }
  }
};
