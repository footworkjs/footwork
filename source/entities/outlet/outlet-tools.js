var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };

function addAnimation () {
  var addAnimation = {};
  addAnimation[fw.animationClass.animateIn] = true;
  return addAnimation;
}

function removeAnimation () {
  var removeAnimation = {};
  removeAnimation[fw.animationClass.animateIn] = false;
  return removeAnimation;
}

module.exports = {
  addAnimation: addAnimation,
  removeAnimation: removeAnimation,
  visibleCSS: visibleCSS,
  hiddenCSS: hiddenCSS,
  stringifyCSS: function (cssConfig) {
    return _.reduce(cssConfig, function (cssString, cssProperty, cssField) {
      if (cssString) {
        cssString += '; ';
      }
      cssString += cssField + ': ' + cssProperty;
      return cssString;
    }, '');
  }
};
