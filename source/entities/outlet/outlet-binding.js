var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var nearestParentRouter = require('../router/router-tools').nearestParentRouter;

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

      outletViewModel[privateDataSymbol].originalDisplay = '$outlet-' + outletName;
      fw.components.register(outletViewModel[privateDataSymbol].originalDisplay, {
        template: valueAccessor()
      });

      // register the outlet with its parent router so it can manipulate it
      parentRouter[privateDataSymbol].registerOutlet(outletName, outletViewModel);
      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        fw.components.unregister(outletViewModel[privateDataSymbol].originalDisplay);
        parentRouter[privateDataSymbol].unregisterOutlet(outletName);
      });

      // attach the observable from the parentRouter that contains the component binding definition to display for this outlet
      outletViewModel.display = parentRouter.outlet(outletName);
    } else {
      throw Error('Outlet \"' + outletName + '\" declared but no parent router was found.');
    }
  }
};
