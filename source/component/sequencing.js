var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityAnimateClass = require('../misc/config').entityAnimateClass;

var util = require('../misc/util');
var resultBound = util.resultBound;
var addClass = util.addClass;
var nextFrame = util.nextFrame;

var sequenceQueue = {};

function clearSequenceQueue() {
  _.each(sequenceQueue, function(sequence, queueNamespace) {
    _.each(sequence, function(sequenceIteration) {
      sequenceIteration.addAnimationClass();
    });
    delete sequenceQueue[queueNamespace];
  });
}

function runAnimationClassSequenceQueue(queue, isRunner) {
  if (!queue.running || isRunner) {
    var sequenceIteration = queue.shift();

    if (sequenceIteration) {
      sequenceIteration.addAnimationClass();

      if (sequenceIteration.nextIteration || queue.length) {
        queue.running = true;
        setTimeout(function() {
          runAnimationClassSequenceQueue(queue, true);
        }, sequenceIteration.nextIteration);
      } else {
        queue.running = false;
      }
    } else {
      queue.running = false;
    }
  }
}

function addToAndFetchQueue(element, viewModel) {
  var configParams = (viewModel.__private || {}).configParams || {};
  var sequenceTimeout = resultBound(configParams, 'sequenceAnimations', viewModel) || 0;
  var namespaceName = configParams.namespace || _.uniqueId('instance');
  var animationSequenceQueue = sequenceQueue[namespaceName] = (sequenceQueue[namespaceName] || []);
  var newSequenceIteration = {
    addAnimationClass: function addBindingFromQueue() {
      nextFrame(function() {
        addClass(element, entityAnimateClass);
      });
    },
    nextIteration: sequenceTimeout
  };

  animationSequenceQueue.push(newSequenceIteration);

  return animationSequenceQueue;
}

module.exports = {
  clearSequenceQueue: clearSequenceQueue,
  runAnimationClassSequenceQueue: runAnimationClassSequenceQueue,
  addToAndFetchQueue: addToAndFetchQueue
};
