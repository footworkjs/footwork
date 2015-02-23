/**
 * This is for creating a custom build of lodash which only includes the dependencies that footwork needs
 */
var isFunction = require('../../../node_modules/lodash/lang/isFunction');
var isObject = require('../../../node_modules/lodash/lang/isObject');
var isString = require('../../../node_modules/lodash/lang/isString');
var isBoolean = require('../../../node_modules/lodash/lang/isBoolean');
var isNumber = require('../../../node_modules/lodash/lang/isNumber');
var isUndefined = require('../../../node_modules/lodash/lang/isUndefined');
var isArray = require('../../../node_modules/lodash/lang/isArray');
var isNull = require('../../../node_modules/lodash/lang/isNull');
var contains = require('../../../node_modules/lodash/collection/contains');
var extend = require('../../../node_modules/lodash/object/extend');
var pick = require('../../../node_modules/lodash/object/pick');
var each = require('../../../node_modules/lodash/collection/each');
var filter = require('../../../node_modules/lodash/collection/filter');
var bind = require('../../../node_modules/lodash/function/bind');
var invoke = require('../../../node_modules/lodash/collection/invoke');
var clone = require('../../../node_modules/lodash/lang/clone');
var reduce = require('../../../node_modules/lodash/collection/reduce');
var has = require('../../../node_modules/lodash/object/has');
var where = require('../../../node_modules/lodash/collection/where');
var result = require('../../../node_modules/lodash/object/result');
var uniqueId = require('../../../node_modules/lodash/utility/uniqueId');
var map = require('../../../node_modules/lodash/collection/map');
var find = require('../../../node_modules/lodash/collection/find');
var omit = require('../../../node_modules/lodash/object/omit');
var indexOf = require('../../../node_modules/lodash/array/indexOf');
var values = require('../../../node_modules/lodash/object/values');
var reject = require('../../../node_modules/lodash/collection/reject');
var findWhere = require('../../../node_modules/lodash/collection/findWhere');
var once = require('../../../node_modules/lodash/function/once');
var last = require('../../../node_modules/lodash/array/last');
var isEqual = require('../../../node_modules/lodash/lang/isEqual');
var defaults = require('../../../node_modules/lodash/object/defaults');

root._ = {
  isFunction: isFunction,
  isObject: isObject,
  isString: isString,
  isBoolean: isBoolean,
  isNumber: isNumber,
  isUndefined: isUndefined,
  isArray: isArray,
  isNull: isNull,
  contains: contains,
  extend: extend,
  pick: pick,
  each: each,
  filter: filter,
  bind: bind,
  invoke: invoke,
  clone: clone,
  reduce: reduce,
  has: has,
  where: where,
  result: result,
  uniqueId: uniqueId,
  map: map,
  find: find,
  omit: omit,
  indexOf: indexOf,
  values: values,
  reject: reject,
  findWhere: findWhere,
  once: once,
  last: last,
  isEqual: isEqual,
  defaults: defaults
};
