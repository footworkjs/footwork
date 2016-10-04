var dataModelContext = [];

module.exports = {
  enter: function enterDataModelContext(dataModel) {
    dataModelContext.unshift(dataModel);
  },
  exit: function exitDataModelContext() {
    dataModelContext.shift();
  },
  getCurrent: function currentDataModelContext() {
    return dataModelContext.length ? dataModelContext[0] : null;
  }
};
