function privateData(privateStore, configParams, propName, propValue) {
  var isGetBaseObjOp = arguments.length === 2;
  var isReadOp = arguments.length === 3;
  var isWriteOp = arguments.length === 4;

  if (isGetBaseObjOp) {
    return privateStore;
  } else if (isReadOp) {
     return propName === 'configParams' ? configParams : privateStore[propName];
  } else if (isWriteOp) {
    privateStore[propName] = propValue;
    return privateStore[propName];
  }
}

module.exports = privateData;
