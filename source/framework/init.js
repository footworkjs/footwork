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

var hasHTML5History = noop;
var assessHistoryState = noop;
var originalApplyBindings = noop;
var setupContextAndLifeCycle = noop;
var isBroadcastable = noop;
var isReceivable = noop;

var noComponentSelected = '_noComponentSelected';
var runPostInit = [];
var nativeComponents = [];
var specialTagDescriptors = [];
var modelMixins = [];
var componentIsTemplateOnly = [];
var $routerOutlet;

var $globalNamespace;
runPostInit.push(function() {
  $globalNamespace = fw.namespace();
});

var isModelCtor;
var isModel;
runPostInit.push(function() {
  var viewModelDescriptor = specialTagDescriptors.getDescriptor('viewModel');
  isModelCtor = viewModelDescriptor.isModelCtor;
  isModel = viewModelDescriptor.isModel;
});

var createResources;
runPostInit.push(function() {
  createResources(specialTagDescriptors);
});

var createFactories;
runPostInit.push(function() {
  createFactories(specialTagDescriptors);
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
