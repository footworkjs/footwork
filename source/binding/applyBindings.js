var fw = require('../../bower_components/knockoutjs/dist/knockout.js');
var _ = require('../misc/lodash');

var entityTools = require('../entities/entity-tools');
var isEntity = entityTools.isEntity;
var isRouter = entityTools.isRouter;

var config = require('../misc/config');
var entityAnimateClass = config.entityAnimateClass;
var entityClass = config.entityClass;

var addClass = require('../misc/util').addClass;

// Override the original applyBindings method to assess history API state and provide viewModel/dataModel/router life-cycle
var originalApplyBindings = fw.applyBindings;
var requireContextInitialized = _.isFunction(require) ? false : true;
fw.applyBindings = function(viewModelOrBindingContext, rootNode) {
  // must initialize default require context (https://github.com/jrburke/requirejs/issues/1305#issuecomment-87924865)
  if (!requireContextInitialized && _.isFunction(require)) {
    requireContextInitialized = true;
    require([]);
  }

  originalApplyBindings(viewModelOrBindingContext, rootNode);
  setupContextAndLifeCycle(viewModelOrBindingContext, rootNode);
};

// Provides lifecycle functionality and $context for a given entity and element
function setupContextAndLifeCycle(entity, element) {
  if (isEntity(entity) && !entity.__private('afterRenderWasTriggered')) {
    entity.__private('afterRenderWasTriggered', true);
    element = element || document.body;

    var context;
    var entityContext;
    var $configParams = entity.__private('configParams');
    if (element.tagName.toLowerCase() === entityWrapperElement) {
      element = element.parentElement || element.parentNode;
    }

    entity.__private('element', element);
    entity.$context = entityContext = fw.contextFor(element);

    var afterRender = _.noop;
    if (_.isFunction($configParams.afterRender)) {
      afterRender = $configParams.afterRender;
    }

    var resolveFlightTracker = entity.__private('resolveFlightTracker') || _.noop;
    $configParams.afterRender = function (containerElement) {
      afterRender.call(this, containerElement);
      addClass(containerElement, entityClass);
      resolveFlightTracker(function addAnimationClass() {
        addClass(containerElement, entityAnimateClass);
      });
    };
    $configParams.afterRender.call(entity, element);

    if (isRouter(entity)) {
      entity.__private('context')(entityContext);
    }

    if (!_.isUndefined(element)) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        entity.dispose();
      });
    }
  }
}
