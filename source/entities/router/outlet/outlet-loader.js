var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../../../misc/util');
var isAmdResolved = util.isAmdResolved;
var isPath = util.isPath;

var bindingElement = require('../../../binding/binding-element');
var getLoadingTracker = require('../../../misc/loading-tracker').get;

var routerDefaults = require('../router-defaults');
var outletLoadedDisplay = routerDefaults.outletLoadedDisplay;
var outletLoadingDisplay = routerDefaults.outletLoadingDisplay;

var entityClass = require('../../../misc/config').entityClass;

function Outlet() {
  fw.outlet.boot(this);
}

/**
 * This outlet loader has two functions:
 * 1. provides the outlet template used to programmatically control display/output of its area via the component: binding
 * 2. provides the outlet viewModel to bind against and control an outlets display
 */
fw.components.loaders.unshift(fw.components.outletLoader = {
  getConfig: function (componentName, callback) {
    if (componentName === 'outlet') {
      callback({
        viewModel: Outlet,
        template: bindingElement.open.prefix + '$lifecycle, $outlet' + bindingElement.open.postfix +
          '<div class="' + outletLoadingDisplay + ' ' + entityClass + '" ' +
            'data-bind="style: loadingStyle, css: loadingClass, component: loadingDisplay"></div>' +
          '<div class="' + outletLoadedDisplay + ' ' + entityClass + '" ' +
            'data-bind="style: loadedStyle, css: loadedClass, component: route"></div>' +
        bindingElement.close
      });
    } else {
      callback(null);
    }
  }
});
