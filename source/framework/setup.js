// framework/setup.js
// ----------------

function isModelCtor(thing) {
  return isFunction(thing) && !!thing.__isModelCtor;
}

function isModel(thing) {
  return isObject(thing) && !!thing.__isModel;
}
