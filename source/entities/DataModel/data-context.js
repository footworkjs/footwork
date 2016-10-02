var dataModelContext = [];
function enterDataModelContext(dataModel) {
  dataModelContext.unshift(dataModel);
}
function exitDataModelContext() {
  dataModelContext.shift();
}

function currentDataModelContext() {
  return dataModelContext.length ? dataModelContext[0] : null;
}

module.exports = {
  enter: enterDataModelContext,
  exit: exitDataModelContext,
  getCurrent: currentDataModelContext
};
