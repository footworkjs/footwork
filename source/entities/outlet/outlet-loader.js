var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var bindingElement = require('../../binding/binding-element');
var routerConfig = require('../router/router-config');
var outletBootstrap = require('./outlet-bootstrap');

var outletTools = require('./outlet-tools');
var stringifyCSS = outletTools.stringifyCSS;
var visibleCSS = outletTools.visibleCSS;
var hiddenCSS = outletTools.hiddenCSS;

var outletCount = 0;

/**
 * The outlet loader has two functions:
 * 1. provides the outlet viewModel constructor to bind against and control an outlets display
 * 2. provides the outlet template bound against the viewModel which is used to control display/output of its area via the component: display binding
 */
fw.components.loaders.unshift(fw.components.outletLoader = {
  getConfig: function (componentName, callback) {
    if (componentName === 'outlet') {
      callback({
        viewModel: function Outlet () {
          outletBootstrap(this, {
            namespace: '$outlet' + outletCount++
          });
        },
        template: bindingElement.open.prefix + '$lifecycle, $outlet: $componentTemplateNodes' + bindingElement.open.postfix +
          '<div style="' + stringifyCSS(visibleCSS) + '" class="' + routerConfig.outletLoadingDisplay + '" ' +
            'data-bind="style: loadingStyle, css: loadingClass, component: loading"></div>' +
          '<div style="' + stringifyCSS(hiddenCSS) + '" class="' + routerConfig.outletLoadedDisplay + '" ' +
            'data-bind="style: displayStyle, css: displayClass, component: display"></div>' +
        bindingElement.close,
        synchronous: true
      });
    } else {
      callback(null);
    }
  }
});
