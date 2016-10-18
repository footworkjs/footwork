var fw = require('knockout/build/output/knockout-latest');

fw.outlet = {
  registerView: function(viewName, templateHTML) {
    fw.components.register(viewName, { template: templateHTML });
  },
  registerViewLocation: function(viewName, viewLocation) {
    fw.components.registerLocation(viewName, { template: viewLocation });
  }
};

require('./outlet-binder');
require('./outlet-component');
require('./loading-component');

module.exports = require('./router-outlet');
