var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var bindingElement = require('../../binding/binding-element');
var routerDefaults = require('../router/router-defaults');
var outletLoadedDisplay = routerDefaults.outletLoadedDisplay;
var outletLoadingDisplay = routerDefaults.outletLoadingDisplay;


function Outlet () {
  fw.outlet.boot(this, {
    namespace: _.uniqueId('outlet')
  });
}

/**
 * The outlet loader has two functions:
 * 1. provides the outlet viewModel constructor to bind against and control an outlets display
 * 2. provides the outlet template bound against the viewModel which is used to control display/output of its area via the component: display binding
 */
fw.components.loaders.unshift(fw.components.outletLoader = {
  getConfig: function (componentName, callback) {
    if (componentName === 'outlet') {
      callback({
        viewModel: Outlet,
        template: bindingElement.open.prefix + '$lifecycle, $outlet' + bindingElement.open.postfix +
          '<div class="' + outletLoadingDisplay + '" ' +
            'data-bind="style: loadingStyle, css: loadingClass, component: loadingDisplay"></div>' +
          '<div class="' + outletLoadedDisplay + '" ' +
            'data-bind="style: loadedStyle, css: loadedClass, component: display"></div>' +
        bindingElement.close,
        synchronous: true
      });
    } else {
      callback(null);
    }
  }
});
