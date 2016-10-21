module.exports = {
  entityClass: 'fw-entity',
  entityAnimateClass: 'fw-entity-animate',
  entityWrapperElement: 'binding-wrapper',
  privateDataSymbol: typeof Symbol === 'function' ? Symbol('__private') : '__private'
};
