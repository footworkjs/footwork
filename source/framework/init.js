// framework/init.js
// ------------------

// Record the footwork version as of this build.
fw.footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
fw.embed = embedded;

fw.viewModels = {};
fw.dataModels = {};
fw.routers = {};
fw.outlets = {};
fw.settings = {};

var hasHTML5History = false;
var assessHistoryState = noop;
var originalApplyBindings = noop;
var setupContextAndLifeCycle = noop;

var noComponentSelected = '_noComponentSelected';
var runPostInit = [];
var nativeComponents = [];
var entityDescriptors = [];
var entityMixins = [];
var $routerOutlet;

var $globalNamespace;
runPostInit.push(function() {
  $globalNamespace = fw.namespace();
});

var isEntityCtor;
var isEntity;
var isDataModel;
runPostInit.push(function() {
  var viewModel = entityDescriptors.getDescriptor('viewModel');
  var dataModel = entityDescriptors.getDescriptor('dataModel');

  isEntityCtor = function(thing) {
    return viewModel.isEntityCtor(thing) || dataModel.isEntityCtor(thing);
  };
  isEntity = function(thing) {
    return viewModel.isEntity(thing) || dataModel.isEntity(thing);
  };

  isDataModel = dataModel.isEntity;
});

var createResources;
runPostInit.push(function() {
  createResources(entityDescriptors);
});

var createFactories;
runPostInit.push(function() {
  createFactories(entityDescriptors);
});

var registerOutletComponents;
runPostInit.push(function() {
  registerOutletComponents();
});

// These are tags which are ignored by the custom component loader
// Sourced from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var nonComponentTags = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bgsound',
  'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
  'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element',
  'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'g', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label',
  'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'nobr',
  'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'polygon', 'path', 'pre',
  'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'spacer',
  'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea',
  'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'xmp', 'rect', 'image',
  'lineargradient', 'stop', 'line', 'binding-wrapper', 'font'
];
