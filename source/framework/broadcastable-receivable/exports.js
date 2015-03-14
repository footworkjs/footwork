// framework/broadcastable-receivable/broacastable.js
// ------------------

fw.isBroadcastable = function(thing) {
  return isObject(thing) && !!thing.__isBroadcastable;
};

fw.isReceivable = function(thing) {
  return isObject(thing) && !!thing.__isReceivable;
};
