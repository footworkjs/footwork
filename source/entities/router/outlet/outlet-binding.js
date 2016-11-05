var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var privateDataSymbol = require('../../../misc/config').privateDataSymbol;
var nearestParentRouter = require('../router-tools').nearestParentRouter;

/**
 * This custom binding binds/registers the outlet on the router
 */
fw.virtualElements.allowedBindings.$outlet = true;
fw.bindingHandlers.$outlet = {
  init: function (element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var parentRouter = nearestParentRouter(bindingContext);

    /* istanbul ignore else */
    if (fw.isRouter(parentRouter)) {
      element = element.parentNode;
      var outletName = element.getAttribute('name') || /* istanbul ignore next */ element.getAttribute('data-name');

      // register the outlet with its parent router so it can manipulate it
      parentRouter[privateDataSymbol].registerOutlet(outletName, outletViewModel);
      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        parentRouter[privateDataSymbol].unregisterOutlet(outletName);
      });

      // attach the observable from the parentRouter that contains the component binding definition to display for this outlet
      outletViewModel.display = parentRouter.outlet(outletName);
    } else {
      throw Error('Outlet \"' + outletName + '\" declared but no parent router was found.');
    }
  }
};
