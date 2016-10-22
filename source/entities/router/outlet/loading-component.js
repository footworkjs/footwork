var fw = require('knockout/build/output/knockout-latest');

var defaultLoadingComponent = require('../router-defaults').defaultLoadingComponent;

fw.components.register(defaultLoadingComponent, {
  template: '<div class="sk-wave fade-in">\
              <div class="sk-rect sk-rect1"></div>\
              <div class="sk-rect sk-rect2"></div>\
              <div class="sk-rect sk-rect3"></div>\
              <div class="sk-rect sk-rect4"></div>\
              <div class="sk-rect sk-rect5"></div>\
            </div>'
});
