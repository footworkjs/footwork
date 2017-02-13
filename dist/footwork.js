/**
 * footwork - A solid footing for web applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v2.0.0-beta2
 * Url: http://footworkjs.com
 * License: MIT
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.fw=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');

fw.version = {
  knockout: fw.version,
  footwork: '2.0.0-beta2'
};

require('./namespace/namespace');
require('./broadcastable-receivable/broadcastable');
require('./broadcastable-receivable/receivable');

require('./entities/entities');
require('./component/component');
require('./collection/collection');

require('./binding/lifecycle-binding');
require('./binding/applyBindings');
require('./binding/start');

module.exports = fw;

},{"./binding/applyBindings":5,"./binding/lifecycle-binding":7,"./binding/start":9,"./broadcastable-receivable/broadcastable":10,"./broadcastable-receivable/receivable":11,"./collection/collection":13,"./component/component":17,"./entities/entities":23,"./namespace/namespace":44,"knockout/build/output/knockout-latest":3}],2:[function(require,module,exports){
(function (global){
/**
 * @license
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash -d -o lodash.js exports="node" include="isFunction,isObject,isString,isBoolean,isNumber,isUndefined,isArray,isNull,extend,pick,each,filter,invokeMap,clone,reduce,result,map,find,omitBy,indexOf,values,last,isEqual,noop,keys,merge,intersection,every,isRegExp,identity,includes,partial,noConflict,remove,bind"`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.16.4';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for function metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256,
      FLIP_FLAG = 512;

  /** Used to compose bitmasks for comparison styles. */
  var UNORDERED_COMPARE_FLAG = 1,
      PARTIAL_COMPARE_FLAG = 2;

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 500,
      HOT_SPAN = 16;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', ARY_FLAG],
    ['bind', BIND_FLAG],
    ['bindKey', BIND_KEY_FLAG],
    ['curry', CURRY_FLAG],
    ['curryRight', CURRY_RIGHT_FLAG],
    ['flip', FLIP_FLAG],
    ['partial', PARTIAL_FLAG],
    ['partialRight', PARTIAL_RIGHT_FLAG],
    ['rearg', REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      reLeadingDot = /^\./,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      return freeProcess && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */
  function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }

  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */
  function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array ? array.length : 0,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array ? array.length : 0;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array ? array.length : 0;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /*--------------------------------------------------------------------------*/

  /** Used for built-in method references. */
  var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString.call(Object);

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Used to restore the original `_` reference in `_.noConflict`. */
  var oldDash = root._;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Built-in value references. */
  var Buffer = moduleExports ? root.Buffer : undefined,
      Symbol = root.Symbol,
      Uint8Array = root.Uint8Array,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
      getPrototype = overArg(Object.getPrototypeOf, Object),
      objectCreate = Object.create,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice,
      spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

  var defineProperty = (function() {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols,
      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeKeys = overArg(Object.keys, Object),
      nativeMax = Math.max,
      nativeMin = Math.min,
      nativeNow = Date.now;

  /* Built-in method references that are verified to be native. */
  var DataView = getNative(root, 'DataView'),
      Map = getNative(root, 'Map'),
      Promise = getNative(root, 'Promise'),
      Set = getNative(root, 'Set'),
      WeakMap = getNative(root, 'WeakMap'),
      nativeCreate = getNative(Object, 'create');

  /** Used to store function metadata. */
  var metaMap = WeakMap && new WeakMap;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit method
   * chain sequences. Methods that operate on and return arrays, collections,
   * and functions can be chained together. Methods that retrieve a single value
   * or may return a primitive value will automatically end the chain sequence
   * and return the unwrapped value. Otherwise, the value must be unwrapped
   * with `_#value`.
   *
   * Explicit chain sequences, which must be unwrapped with `_#value`, may be
   * enabled using `_.chain`.
   *
   * The execution of chained methods is lazy, that is, it's deferred until
   * `_#value` is implicitly or explicitly called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion.
   * Shortcut fusion is an optimization to merge iteratee calls; this avoids
   * the creation of intermediate arrays and can greatly reduce the number of
   * iteratee executions. Sections of a chain sequence qualify for shortcut
   * fusion if the section is applied to an array of at least `200` elements
   * and any iteratees accept only one argument. The heuristic for whether a
   * section qualifies for shortcut fusion is subject to change.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers have `Array` and `String` methods.
   *
   * The wrapper `Array` methods are:
   * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
   *
   * The wrapper `String` methods are:
   * `replace` and `split`
   *
   * The wrapper methods that support shortcut fusion are:
   * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
   * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
   * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
   * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
   * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
   * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
   * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
   * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
   * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
   * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
   * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
   * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
   * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
   * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
   * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
   * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
   * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
   * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
   * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
   * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
   * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
   * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
   * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
   * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
   * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
   * `zipObject`, `zipObjectDeep`, and `zipWith`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
   * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
   * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
   * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
   * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
   * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
   * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
   * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
   * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
   * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
   * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
   * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
   * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
   * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
   * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
   * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
   * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
   * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
   * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
   * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
   * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
   * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
   * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
   * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
   * `upperFirst`, `value`, and `words`
   *
   * @name _
   * @constructor
   * @category Seq
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // Returns an unwrapped value.
   * wrapped.reduce(_.add);
   * // => 6
   *
   * // Returns a wrapped value.
   * var squares = wrapped.map(square);
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // No operation performed.
  }

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }());

  /**
   * The function whose prototype chain sequence wrappers inherit from.
   *
   * @private
   */
  function baseLodash() {
    // No operation performed.
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
   *
   * @private
   * @constructor
   * @param {*} value The value to wrap.
   */
  function LazyWrapper(value) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__dir__ = 1;
    this.__filtered__ = false;
    this.__iteratees__ = [];
    this.__takeCount__ = MAX_ARRAY_LENGTH;
    this.__views__ = [];
  }

  // Ensure `LazyWrapper` is an instance of `baseLodash`.
  LazyWrapper.prototype = baseCreate(baseLodash.prototype);
  LazyWrapper.prototype.constructor = LazyWrapper;

  /*------------------------------------------------------------------------*/

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /*------------------------------------------------------------------------*/

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /*------------------------------------------------------------------------*/

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /*------------------------------------------------------------------------*/

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
        length = values ? values.length : 0;

    this.__data__ = new MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  }

  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;

  /*------------------------------------------------------------------------*/

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * This function is like `assignValue` except that it doesn't assign
   * `undefined` values.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignMergeValue(object, key, value) {
    if ((value !== undefined && !eq(object[key], value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.assign` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty) {
      defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  /**
   * The base implementation of `_.clone` and `_.cloneDeep` which tracks
   * traversed objects.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {boolean} [isFull] Specify a clone including symbols.
   * @param {Function} [customizer] The function to customize cloning.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The parent object of `value`.
   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value),
          isFunc = tag == funcTag || tag == genTag;

      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
        result = initCloneObject(isFunc ? {} : value);
        if (!isDeep) {
          return copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, baseClone, isDeep);
      }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new Stack);
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);

    var props = isArr ? undefined : (isFull ? getAllKeys : keys)(value);
    arrayEach(props || value, function(subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      }
      // Recursively populate clone (susceptible to call stack limits).
      assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
    });
    return result;
  }

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEach = createBaseEach(baseForOwn);

  /**
   * The base implementation of `_.every` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`
   */
  function baseEvery(collection, predicate) {
    var result = true;
    baseEach(collection, function(value, index, collection) {
      result = !!predicate(value, index, collection);
      return result;
    });
    return result;
  }

  /**
   * The base implementation of `_.filter` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function baseFilter(collection, predicate) {
    var result = [];
    baseEach(collection, function(value, index, collection) {
      if (predicate(value, index, collection)) {
        result.push(value);
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;

    predicate || (predicate = isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = isKey(path, object) ? [path] : castPath(path);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }

  /**
   * The base implementation of `getTag`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    return objectToString.call(value);
  }

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  /**
   * The base implementation of methods like `_.intersection`, without support
   * for iteratee shorthands, that accepts an array of arrays to inspect.
   *
   * @private
   * @param {Array} arrays The arrays to inspect.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of shared values.
   */
  function baseIntersection(arrays, iteratee, comparator) {
    var includes = comparator ? arrayIncludesWith : arrayIncludes,
        length = arrays[0].length,
        othLength = arrays.length,
        othIndex = othLength,
        caches = Array(othLength),
        maxLength = Infinity,
        result = [];

    while (othIndex--) {
      var array = arrays[othIndex];
      if (othIndex && iteratee) {
        array = arrayMap(array, baseUnary(iteratee));
      }
      maxLength = nativeMin(array.length, maxLength);
      caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
        ? new SetCache(othIndex && array)
        : undefined;
    }
    array = arrays[0];

    var index = -1,
        seen = caches[0];

    outer:
    while (++index < length && result.length < maxLength) {
      var value = array[index],
          computed = iteratee ? iteratee(value) : value;

      value = (comparator || value !== 0) ? value : 0;
      if (!(seen
            ? cacheHas(seen, computed)
            : includes(result, computed, comparator)
          )) {
        othIndex = othLength;
        while (--othIndex) {
          var cache = caches[othIndex];
          if (!(cache
                ? cacheHas(cache, computed)
                : includes(arrays[othIndex], computed, comparator))
              ) {
            continue outer;
          }
        }
        if (seen) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.invoke` without support for individual
   * method arguments.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the method to invoke.
   * @param {Array} args The arguments to invoke the method with.
   * @returns {*} Returns the result of the invoked method.
   */
  function baseInvoke(object, path, args) {
    if (!isKey(path, object)) {
      path = castPath(path);
      object = parent(object, path);
      path = last(path);
    }
    var func = object == null ? object : object[toKey(path)];
    return func == null ? undefined : apply(func, object, args);
  }

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && objectToString.call(value) == argsTag;
  }

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {boolean} [bitmask] The bitmask of comparison flags.
   *  The bitmask may be composed of the following flags:
   *     1 - Unordered comparison
   *     2 - Partial comparison
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, customizer, bitmask, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
  }

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
   *  for more details.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = arrayTag,
        othTag = arrayTag;

    if (!objIsArr) {
      objTag = getTag(object);
      objTag = objTag == argsTag ? objectTag : objTag;
    }
    if (!othIsArr) {
      othTag = getTag(other);
      othTag = othTag == argsTag ? objectTag : othTag;
    }
    var objIsObj = objTag == objectTag,
        othIsObj = othTag == objectTag,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack);
      return (objIsArr || isTypedArray(object))
        ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
        : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
    }
    if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

        stack || (stack = new Stack);
        return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack);
    return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
  }

  /**
   * The base implementation of `_.isMatch` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Array} matchData The property names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length,
        length = index,
        noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if ((noCustomizer && data[2])
            ? data[1] !== object[data[0]]
            : !(data[0] in object)
          ) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
          objValue = object[key],
          srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack;
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === undefined
              ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
              : result
            )) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * The base implementation of `_.isRegExp` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   */
  function baseIsRegExp(value) {
    return isObject(value) && objectToString.call(value) == regexpTag;
  }

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike(value) &&
      isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
  }

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == 'object') {
      return isArray(value)
        ? baseMatchesProperty(value[0], value[1])
        : baseMatches(value);
    }
    return property(value);
  }

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.map` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var index = -1,
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function(value, key, collection) {
      result[++index] = iteratee(value, key, collection);
    });
    return result;
  }

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }

  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return (objValue === undefined && objValue === srcValue)
        ? hasIn(object, path)
        : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
    };
  }

  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor(source, function(srcValue, key) {
      if (isObject(srcValue)) {
        stack || (stack = new Stack);
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      }
      else {
        var newValue = customizer
          ? customizer(object[key], srcValue, (key + ''), object, source, stack)
          : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = object[key],
        srcValue = source[key],
        stacked = stack.get(srcValue);

    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer
      ? customizer(objValue, srcValue, (key + ''), object, source, stack)
      : undefined;

    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = isArray(srcValue),
          isBuff = !isArr && isBuffer(srcValue),
          isTyped = !isArr && !isBuff && isTypedArray(srcValue);

      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        }
        else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        }
        else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        }
        else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        }
        else {
          newValue = [];
        }
      }
      else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        }
        else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
          newValue = initCloneObject(srcValue);
        }
      }
      else {
        isCommon = false;
      }
    }
    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }

  /**
   * The base implementation of `_.pick` without support for individual
   * property identifiers.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} props The property identifiers to pick.
   * @returns {Object} Returns the new object.
   */
  function basePick(object, props) {
    object = Object(object);
    return basePickBy(object, props, function(value, key) {
      return key in object;
    });
  }

  /**
   * The base implementation of  `_.pickBy` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} props The property identifiers to pick from.
   * @param {Function} predicate The function invoked per property.
   * @returns {Object} Returns the new object.
   */
  function basePickBy(object, props, predicate) {
    var index = -1,
        length = props.length,
        result = {};

    while (++index < length) {
      var key = props[index],
          value = object[key];

      if (predicate(value, key)) {
        baseAssignValue(result, key, value);
      }
    }
    return result;
  }

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }

  /**
   * The base implementation of `_.pullAt` without support for individual
   * indexes or capturing the removed elements.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {number[]} indexes The indexes of elements to remove.
   * @returns {Array} Returns `array`.
   */
  function basePullAt(array, indexes) {
    var length = array ? indexes.length : 0,
        lastIndex = length - 1;

    while (length--) {
      var index = indexes[length];
      if (length == lastIndex || index !== previous) {
        var previous = index;
        if (isIndex(index)) {
          splice.call(array, index, 1);
        }
        else if (!isKey(index, array)) {
          var path = castPath(index),
              object = parent(array, path);

          if (object != null) {
            delete object[toKey(last(path))];
          }
        }
        else {
          delete array[toKey(index)];
        }
      }
    }
    return array;
  }

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }

  /**
   * The base implementation of `setData` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var baseSetData = !metaMap ? identity : function(func, data) {
    metaMap.set(func, data);
    return func;
  };

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };

  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */
  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Casts `value` to an empty array if it's not an array like object.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Array|Object} Returns the cast array-like object.
   */
  function castArrayLikeObject(value) {
    return isArrayLikeObject(value) ? value : [];
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value) {
    return isArray(value) ? value : stringToPath(value);
  }

  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }

  /**
   * Creates a clone of `dataView`.
   *
   * @private
   * @param {Object} dataView The data view to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned data view.
   */
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }

  /**
   * Creates a clone of `map`.
   *
   * @private
   * @param {Object} map The map to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned map.
   */
  function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor);
  }

  /**
   * Creates a clone of `regexp`.
   *
   * @private
   * @param {Object} regexp The regexp to clone.
   * @returns {Object} Returns the cloned regexp.
   */
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }

  /**
   * Creates a clone of `set`.
   *
   * @private
   * @param {Object} set The set to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned set.
   */
  function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor);
  }

  /**
   * Creates a clone of the `symbol` object.
   *
   * @private
   * @param {Object} symbol The symbol object to clone.
   * @returns {Object} Returns the cloned symbol object.
   */
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  /**
   * Creates an array that is the composition of partially applied arguments,
   * placeholders, and provided arguments into a single array of arguments.
   *
   * @private
   * @param {Array} args The provided arguments.
   * @param {Array} partials The arguments to prepend to those provided.
   * @param {Array} holders The `partials` placeholder indexes.
   * @params {boolean} [isCurried] Specify composing for a curried function.
   * @returns {Array} Returns the new array of composed arguments.
   */
  function composeArgs(args, partials, holders, isCurried) {
    var argsIndex = -1,
        argsLength = args.length,
        holdersLength = holders.length,
        leftIndex = -1,
        leftLength = partials.length,
        rangeLength = nativeMax(argsLength - holdersLength, 0),
        result = Array(leftLength + rangeLength),
        isUncurried = !isCurried;

    while (++leftIndex < leftLength) {
      result[leftIndex] = partials[leftIndex];
    }
    while (++argsIndex < holdersLength) {
      if (isUncurried || argsIndex < argsLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
    }
    while (rangeLength--) {
      result[leftIndex++] = args[argsIndex++];
    }
    return result;
  }

  /**
   * This function is like `composeArgs` except that the arguments composition
   * is tailored for `_.partialRight`.
   *
   * @private
   * @param {Array} args The provided arguments.
   * @param {Array} partials The arguments to append to those provided.
   * @param {Array} holders The `partials` placeholder indexes.
   * @params {boolean} [isCurried] Specify composing for a curried function.
   * @returns {Array} Returns the new array of composed arguments.
   */
  function composeArgsRight(args, partials, holders, isCurried) {
    var argsIndex = -1,
        argsLength = args.length,
        holdersIndex = -1,
        holdersLength = holders.length,
        rightIndex = -1,
        rightLength = partials.length,
        rangeLength = nativeMax(argsLength - holdersLength, 0),
        result = Array(rangeLength + rightLength),
        isUncurried = !isCurried;

    while (++argsIndex < rangeLength) {
      result[argsIndex] = args[argsIndex];
    }
    var offset = argsIndex;
    while (++rightIndex < rightLength) {
      result[offset + rightIndex] = partials[rightIndex];
    }
    while (++holdersIndex < holdersLength) {
      if (isUncurried || argsIndex < argsLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
    }
    return result;
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }

  /**
   * Copies own symbol properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */
  function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
  }

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * Creates a function that wraps `func` to invoke it with the optional `this`
   * binding of `thisArg`.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createBind(func, bitmask, thisArg) {
    var isBind = bitmask & BIND_FLAG,
        Ctor = createCtor(func);

    function wrapper() {
      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
      return fn.apply(isBind ? thisArg : this, arguments);
    }
    return wrapper;
  }

  /**
   * Creates a function that produces an instance of `Ctor` regardless of
   * whether it was invoked as part of a `new` expression or by `call` or `apply`.
   *
   * @private
   * @param {Function} Ctor The constructor to wrap.
   * @returns {Function} Returns the new wrapped function.
   */
  function createCtor(Ctor) {
    return function() {
      // Use a `switch` statement to work with class constructors. See
      // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
      // for more details.
      var args = arguments;
      switch (args.length) {
        case 0: return new Ctor;
        case 1: return new Ctor(args[0]);
        case 2: return new Ctor(args[0], args[1]);
        case 3: return new Ctor(args[0], args[1], args[2]);
        case 4: return new Ctor(args[0], args[1], args[2], args[3]);
        case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
        case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      }
      var thisBinding = baseCreate(Ctor.prototype),
          result = Ctor.apply(thisBinding, args);

      // Mimic the constructor's `return` behavior.
      // See https://es5.github.io/#x13.2.2 for more details.
      return isObject(result) ? result : thisBinding;
    };
  }

  /**
   * Creates a function that wraps `func` to enable currying.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {number} arity The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createCurry(func, bitmask, arity) {
    var Ctor = createCtor(func);

    function wrapper() {
      var length = arguments.length,
          args = Array(length),
          index = length,
          placeholder = getHolder(wrapper);

      while (index--) {
        args[index] = arguments[index];
      }
      var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
        ? []
        : replaceHolders(args, placeholder);

      length -= holders.length;
      if (length < arity) {
        return createRecurry(
          func, bitmask, createHybrid, wrapper.placeholder, undefined,
          args, holders, undefined, undefined, arity - length);
      }
      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
      return apply(fn, this, args);
    }
    return wrapper;
  }

  /**
   * Creates a `_.find` or `_.findLast` function.
   *
   * @private
   * @param {Function} findIndexFunc The function to find the collection index.
   * @returns {Function} Returns the new find function.
   */
  function createFind(findIndexFunc) {
    return function(collection, predicate, fromIndex) {
      var iterable = Object(collection);
      if (!isArrayLike(collection)) {
        var iteratee = getIteratee(predicate, 3);
        collection = keys(collection);
        predicate = function(key) { return iteratee(iterable[key], key, iterable); };
      }
      var index = findIndexFunc(collection, predicate, fromIndex);
      return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
    };
  }

  /**
   * Creates a function that wraps `func` to invoke it with optional `this`
   * binding of `thisArg`, partial application, and currying.
   *
   * @private
   * @param {Function|string} func The function or method name to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to prepend to those provided to
   *  the new function.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [partialsRight] The arguments to append to those provided
   *  to the new function.
   * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
    var isAry = bitmask & ARY_FLAG,
        isBind = bitmask & BIND_FLAG,
        isBindKey = bitmask & BIND_KEY_FLAG,
        isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
        isFlip = bitmask & FLIP_FLAG,
        Ctor = isBindKey ? undefined : createCtor(func);

    function wrapper() {
      var length = arguments.length,
          args = Array(length),
          index = length;

      while (index--) {
        args[index] = arguments[index];
      }
      if (isCurried) {
        var placeholder = getHolder(wrapper),
            holdersCount = countHolders(args, placeholder);
      }
      if (partials) {
        args = composeArgs(args, partials, holders, isCurried);
      }
      if (partialsRight) {
        args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
      }
      length -= holdersCount;
      if (isCurried && length < arity) {
        var newHolders = replaceHolders(args, placeholder);
        return createRecurry(
          func, bitmask, createHybrid, wrapper.placeholder, thisArg,
          args, newHolders, argPos, ary, arity - length
        );
      }
      var thisBinding = isBind ? thisArg : this,
          fn = isBindKey ? thisBinding[func] : func;

      length = args.length;
      if (argPos) {
        args = reorder(args, argPos);
      } else if (isFlip && length > 1) {
        args.reverse();
      }
      if (isAry && ary < length) {
        args.length = ary;
      }
      if (this && this !== root && this instanceof wrapper) {
        fn = Ctor || createCtor(fn);
      }
      return fn.apply(thisBinding, args);
    }
    return wrapper;
  }

  /**
   * Creates a function that wraps `func` to invoke it with the `this` binding
   * of `thisArg` and `partials` prepended to the arguments it receives.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} partials The arguments to prepend to those provided to
   *  the new function.
   * @returns {Function} Returns the new wrapped function.
   */
  function createPartial(func, bitmask, thisArg, partials) {
    var isBind = bitmask & BIND_FLAG,
        Ctor = createCtor(func);

    function wrapper() {
      var argsIndex = -1,
          argsLength = arguments.length,
          leftIndex = -1,
          leftLength = partials.length,
          args = Array(leftLength + argsLength),
          fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

      while (++leftIndex < leftLength) {
        args[leftIndex] = partials[leftIndex];
      }
      while (argsLength--) {
        args[leftIndex++] = arguments[++argsIndex];
      }
      return apply(fn, isBind ? thisArg : this, args);
    }
    return wrapper;
  }

  /**
   * Creates a function that wraps `func` to continue currying.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {Function} wrapFunc The function to create the `func` wrapper.
   * @param {*} placeholder The placeholder value.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to prepend to those provided to
   *  the new function.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
    var isCurry = bitmask & CURRY_FLAG,
        newHolders = isCurry ? holders : undefined,
        newHoldersRight = isCurry ? undefined : holders,
        newPartials = isCurry ? partials : undefined,
        newPartialsRight = isCurry ? undefined : partials;

    bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
    bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

    if (!(bitmask & CURRY_BOUND_FLAG)) {
      bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
    }
    var newData = [
      func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
      newHoldersRight, argPos, ary, arity
    ];

    var result = wrapFunc.apply(undefined, newData);
    if (isLaziable(func)) {
      setData(result, newData);
    }
    result.placeholder = placeholder;
    return setWrapToString(result, func, bitmask);
  }

  /**
   * Creates a function that either curries or invokes `func` with optional
   * `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to wrap.
   * @param {number} bitmask The bitmask flags.
   *  The bitmask may be composed of the following flags:
   *     1 - `_.bind`
   *     2 - `_.bindKey`
   *     4 - `_.curry` or `_.curryRight` of a bound function
   *     8 - `_.curry`
   *    16 - `_.curryRight`
   *    32 - `_.partial`
   *    64 - `_.partialRight`
   *   128 - `_.rearg`
   *   256 - `_.ary`
   *   512 - `_.flip`
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to be partially applied.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
    var isBindKey = bitmask & BIND_KEY_FLAG;
    if (!isBindKey && typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var length = partials ? partials.length : 0;
    if (!length) {
      bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
      partials = holders = undefined;
    }
    ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
    arity = arity === undefined ? arity : toInteger(arity);
    length -= holders ? holders.length : 0;

    if (bitmask & PARTIAL_RIGHT_FLAG) {
      var partialsRight = partials,
          holdersRight = holders;

      partials = holders = undefined;
    }
    var data = isBindKey ? undefined : getData(func);

    var newData = [
      func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
      argPos, ary, arity
    ];

    if (data) {
      mergeData(newData, data);
    }
    func = newData[0];
    bitmask = newData[1];
    thisArg = newData[2];
    partials = newData[3];
    holders = newData[4];
    arity = newData[9] = newData[9] == null
      ? (isBindKey ? 0 : func.length)
      : nativeMax(newData[9] - length, 0);

    if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
      bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
    }
    if (!bitmask || bitmask == BIND_FLAG) {
      var result = createBind(func, bitmask, thisArg);
    } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
      result = createCurry(func, bitmask, arity);
    } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
      result = createPartial(func, bitmask, thisArg, partials);
    } else {
      result = createHybrid.apply(undefined, newData);
    }
    var setter = data ? baseSetData : setData;
    return setWrapToString(setter(result, newData), func, bitmask);
  }

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} customizer The function to customize comparisons.
   * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
   *  for more details.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
    var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1,
        result = true,
        seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

    stack.set(array, other);
    stack.set(other, array);

    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, arrValue, index, other, array, stack)
          : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (seen) {
        if (!arraySome(other, function(othValue, othIndex) {
              if (!cacheHas(seen, othIndex) &&
                  (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
                return seen.push(othIndex);
              }
            })) {
          result = false;
          break;
        }
      } else if (!(
            arrValue === othValue ||
              equalFunc(arrValue, othValue, customizer, bitmask, stack)
          )) {
        result = false;
        break;
      }
    }
    stack['delete'](array);
    stack['delete'](other);
    return result;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} customizer The function to customize comparisons.
   * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
   *  for more details.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
    switch (tag) {
      case dataViewTag:
        if ((object.byteLength != other.byteLength) ||
            (object.byteOffset != other.byteOffset)) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag:
        if ((object.byteLength != other.byteLength) ||
            !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }
        return true;

      case boolTag:
      case dateTag:
      case numberTag:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq(+object, +other);

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == (other + '');

      case mapTag:
        var convert = mapToArray;

      case setTag:
        var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
        convert || (convert = setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= UNORDERED_COMPARE_FLAG;

        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
        stack['delete'](object);
        return result;

      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} customizer The function to customize comparisons.
   * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
   *  for more details.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
    var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
        objProps = keys(object),
        objLength = objProps.length,
        othProps = keys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
        return false;
      }
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);

    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, objValue, key, other, object, stack)
          : customizer(objValue, othValue, key, object, other, stack);
      }
      // Recursively compare objects (susceptible to call stack limits).
      if (!(compared === undefined
            ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
            : compared
          )) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack['delete'](object);
    stack['delete'](other);
    return result;
  }

  /**
   * A specialized version of `baseRest` which flattens the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @returns {Function} Returns the new function.
   */
  function flatRest(func) {
    return setToString(overRest(func, undefined, flatten), func + '');
  }

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }

  /**
   * Creates an array of own and inherited enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeysIn(object) {
    return baseGetAllKeys(object, keysIn, getSymbolsIn);
  }

  /**
   * Gets metadata for `func`.
   *
   * @private
   * @param {Function} func The function to query.
   * @returns {*} Returns the metadata for `func`.
   */
  var getData = !metaMap ? noop : function(func) {
    return metaMap.get(func);
  };

  /**
   * Gets the name of `func`.
   *
   * @private
   * @param {Function} func The function to query.
   * @returns {string} Returns the function name.
   */
  function getFuncName(func) {
    var result = (func.name + ''),
        array = realNames[result],
        length = hasOwnProperty.call(realNames, result) ? array.length : 0;

    while (length--) {
      var data = array[length],
          otherFunc = data.func;
      if (otherFunc == null || otherFunc == func) {
        return data.name;
      }
    }
    return result;
  }

  /**
   * Gets the argument placeholder value for `func`.
   *
   * @private
   * @param {Function} func The function to inspect.
   * @returns {*} Returns the placeholder value.
   */
  function getHolder(func) {
    var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
    return object.placeholder;
  }

  /**
   * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
   * this function returns the custom method, otherwise it returns `baseIteratee`.
   * If arguments are provided, the chosen function is invoked with them and
   * its result is returned.
   *
   * @private
   * @param {*} [value] The value to convert to an iteratee.
   * @param {number} [arity] The arity of the created iteratee.
   * @returns {Function} Returns the chosen function or its result.
   */
  function getIteratee() {
    var result = lodash.iteratee || iteratee;
    result = result === iteratee ? baseIteratee : result;
    return arguments.length ? result(arguments[0], arguments[1]) : result;
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = keys(object),
        length = result.length;

    while (length--) {
      var key = result[length],
          value = object[key];

      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /**
   * Creates an array of the own enumerable symbol properties of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

  /**
   * Creates an array of the own and inherited enumerable symbol properties
   * of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
    var result = [];
    while (object) {
      arrayPush(result, getSymbols(object));
      object = getPrototype(object);
    }
    return result;
  };

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
      (Map && getTag(new Map) != mapTag) ||
      (Promise && getTag(Promise.resolve()) != promiseTag) ||
      (Set && getTag(new Set) != setTag) ||
      (WeakMap && getTag(new WeakMap) != weakMapTag)) {
    getTag = function(value) {
      var result = objectToString.call(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : undefined;

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag;
          case mapCtorString: return mapTag;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag;
          case weakMapCtorString: return weakMapTag;
        }
      }
      return result;
    };
  }

  /**
   * Extracts wrapper details from the `source` body comment.
   *
   * @private
   * @param {string} source The source to inspect.
   * @returns {Array} Returns the wrapper details.
   */
  function getWrapDetails(source) {
    var match = source.match(reWrapDetails);
    return match ? match[1].split(reSplitDetails) : [];
  }

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = isKey(path, object) ? [path] : castPath(path);

    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object ? object.length : 0;
    return !!length && isLength(length) && isIndex(key, length) &&
      (isArray(object) || isArguments(object));
  }

  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */
  function initCloneArray(array) {
    var length = array.length,
        result = array.constructor(length);

    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !isPrototype(object))
      ? baseCreate(getPrototype(object))
      : {};
  }

  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return cloneArrayBuffer(object);

      case boolTag:
      case dateTag:
        return new Ctor(+object);

      case dataViewTag:
        return cloneDataView(object, isDeep);

      case float32Tag: case float64Tag:
      case int8Tag: case int16Tag: case int32Tag:
      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
        return cloneTypedArray(object, isDeep);

      case mapTag:
        return cloneMap(object, isDeep, cloneFunc);

      case numberTag:
      case stringTag:
        return new Ctor(object);

      case regexpTag:
        return cloneRegExp(object);

      case setTag:
        return cloneSet(object, isDeep, cloneFunc);

      case symbolTag:
        return cloneSymbol(object);
    }
  }

  /**
   * Inserts wrapper `details` in a comment at the top of the `source` body.
   *
   * @private
   * @param {string} source The source to modify.
   * @returns {Array} details The details to insert.
   * @returns {string} Returns the modified source.
   */
  function insertWrapDetails(source, details) {
    var length = details.length;
    if (!length) {
      return source;
    }
    var lastIndex = length - 1;
    details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
    details = details.join(length > 2 ? ', ' : ' ');
    return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
  }

  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) ||
      !!(spreadableSymbol && value && value[spreadableSymbol]);
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length &&
      (typeof value == 'number' || reIsUint.test(value)) &&
      (value > -1 && value % 1 == 0 && value < length);
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq(object[index], value);
    }
    return false;
  }

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Checks if `func` has a lazy counterpart.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
   *  else `false`.
   */
  function isLaziable(func) {
    var funcName = getFuncName(func),
        other = lodash[funcName];

    if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
      return false;
    }
    if (func === other) {
      return true;
    }
    var data = getData(other);
    return !!data && func === data[0];
  }

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

    return value === proto;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue &&
        (srcValue !== undefined || (key in Object(object)));
    };
  }

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  /**
   * Merges the function metadata of `source` into `data`.
   *
   * Merging metadata reduces the number of wrappers used to invoke a function.
   * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
   * may be applied regardless of execution order. Methods like `_.ary` and
   * `_.rearg` modify function arguments, making the order in which they are
   * executed important, preventing the merging of metadata. However, we make
   * an exception for a safe combined case where curried functions have `_.ary`
   * and or `_.rearg` applied.
   *
   * @private
   * @param {Array} data The destination metadata.
   * @param {Array} source The source metadata.
   * @returns {Array} Returns `data`.
   */
  function mergeData(data, source) {
    var bitmask = data[1],
        srcBitmask = source[1],
        newBitmask = bitmask | srcBitmask,
        isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);

    var isCombo =
      ((srcBitmask == ARY_FLAG) && (bitmask == CURRY_FLAG)) ||
      ((srcBitmask == ARY_FLAG) && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
      ((srcBitmask == (ARY_FLAG | REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));

    // Exit early if metadata can't be merged.
    if (!(isCommon || isCombo)) {
      return data;
    }
    // Use source `thisArg` if available.
    if (srcBitmask & BIND_FLAG) {
      data[2] = source[2];
      // Set when currying a bound function.
      newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
    }
    // Compose partial arguments.
    var value = source[3];
    if (value) {
      var partials = data[3];
      data[3] = partials ? composeArgs(partials, value, source[4]) : value;
      data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
    }
    // Compose partial right arguments.
    value = source[5];
    if (value) {
      partials = data[5];
      data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
      data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
    }
    // Use source `argPos` if available.
    value = source[7];
    if (value) {
      data[7] = value;
    }
    // Use source `ary` if it's smaller.
    if (srcBitmask & ARY_FLAG) {
      data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
    }
    // Use source `arity` if one is not provided.
    if (data[9] == null) {
      data[9] = source[9];
    }
    // Use source `func` and merge bitmasks.
    data[0] = source[0];
    data[1] = newBitmask;

    return data;
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * Gets the parent value at `path` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} path The path to get the parent value of.
   * @returns {*} Returns the parent value.
   */
  function parent(object, path) {
    return path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
  }

  /**
   * Reorder `array` according to the specified indexes where the element at
   * the first index is assigned as the first element, the element at
   * the second index is assigned as the second element, and so on.
   *
   * @private
   * @param {Array} array The array to reorder.
   * @param {Array} indexes The arranged array indexes.
   * @returns {Array} Returns `array`.
   */
  function reorder(array, indexes) {
    var arrLength = array.length,
        length = nativeMin(indexes.length, arrLength),
        oldArray = copyArray(array);

    while (length--) {
      var index = indexes[length];
      array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
    }
    return array;
  }

  /**
   * Sets metadata for `func`.
   *
   * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
   * period of time, it will trip its breaker and transition to an identity
   * function to avoid garbage collection pauses in V8. See
   * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
   * for more details.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var setData = shortOut(baseSetData);

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = shortOut(baseSetToString);

  /**
   * Sets the `toString` method of `wrapper` to mimic the source of `reference`
   * with wrapper details in a comment at the top of the source body.
   *
   * @private
   * @param {Function} wrapper The function to modify.
   * @param {Function} reference The reference function.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @returns {Function} Returns `wrapper`.
   */
  function setWrapToString(wrapper, reference, bitmask) {
    var source = (reference + '');
    return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
  }

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;

    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoizeCapped(function(string) {
    string = toString(string);

    var result = [];
    if (reLeadingDot.test(string)) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Updates wrapper `details` based on `bitmask` flags.
   *
   * @private
   * @returns {Array} details The details to modify.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @returns {Array} Returns `details`.
   */
  function updateWrapDetails(details, bitmask) {
    arrayEach(wrapFlags, function(pair) {
      var value = '_.' + pair[0];
      if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
        details.push(value);
      }
    });
    return details.sort();
  }

  /*------------------------------------------------------------------------*/

  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [predicate=_.identity]
   *  The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * _.findIndex(users, function(o) { return o.user == 'barney'; });
   * // => 0
   *
   * // The `_.matches` iteratee shorthand.
   * _.findIndex(users, { 'user': 'fred', 'active': false });
   * // => 1
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.findIndex(users, ['active', false]);
   * // => 0
   *
   * // The `_.property` iteratee shorthand.
   * _.findIndex(users, 'active');
   * // => 2
   */
  function findIndex(array, predicate, fromIndex) {
    var length = array ? array.length : 0;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax(length + index, 0);
    }
    return baseFindIndex(array, getIteratee(predicate, 3), index);
  }

  /**
   * Flattens `array` a single level deep.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flatten([1, [2, [3, [4]], 5]]);
   * // => [1, 2, [3, [4]], 5]
   */
  function flatten(array) {
    var length = array ? array.length : 0;
    return length ? baseFlatten(array, 1) : [];
  }

  /**
   * Gets the index at which the first occurrence of `value` is found in `array`
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. If `fromIndex` is negative, it's used as the
   * offset from the end of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   * @example
   *
   * _.indexOf([1, 2, 1, 2], 2);
   * // => 1
   *
   * // Search from the `fromIndex`.
   * _.indexOf([1, 2, 1, 2], 2, 2);
   * // => 3
   */
  function indexOf(array, value, fromIndex) {
    var length = array ? array.length : 0;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax(length + index, 0);
    }
    return baseIndexOf(array, value, index);
  }

  /**
   * Creates an array of unique values that are included in all given arrays
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. The order and references of result values are
   * determined by the first array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of intersecting values.
   * @example
   *
   * _.intersection([2, 1], [2, 3]);
   * // => [2]
   */
  var intersection = baseRest(function(arrays) {
    var mapped = arrayMap(arrays, castArrayLikeObject);
    return (mapped.length && mapped[0] === arrays[0])
      ? baseIntersection(mapped)
      : [];
  });

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */
  function last(array) {
    var length = array ? array.length : 0;
    return length ? array[length - 1] : undefined;
  }

  /**
   * Removes all elements from `array` that `predicate` returns truthy for
   * and returns an array of the removed elements. The predicate is invoked
   * with three arguments: (value, index, array).
   *
   * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
   * to pull elements from an array by value.
   *
   * @static
   * @memberOf _
   * @since 2.0.0
   * @category Array
   * @param {Array} array The array to modify.
   * @param {Function} [predicate=_.identity]
   *  The function invoked per iteration.
   * @returns {Array} Returns the new array of removed elements.
   * @example
   *
   * var array = [1, 2, 3, 4];
   * var evens = _.remove(array, function(n) {
   *   return n % 2 == 0;
   * });
   *
   * console.log(array);
   * // => [1, 3]
   *
   * console.log(evens);
   * // => [2, 4]
   */
  function remove(array, predicate) {
    var result = [];
    if (!(array && array.length)) {
      return result;
    }
    var index = -1,
        indexes = [],
        length = array.length;

    predicate = getIteratee(predicate, 3);
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result.push(value);
        indexes.push(index);
      }
    }
    basePullAt(array, indexes);
    return result;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `predicate` returns truthy for **all** elements of `collection`.
   * Iteration is stopped once `predicate` returns falsey. The predicate is
   * invoked with three arguments: (value, index|key, collection).
   *
   * **Note:** This method returns `true` for
   * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
   * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
   * elements of empty collections.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [predicate=_.identity]
   *  The function invoked per iteration.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   * @example
   *
   * _.every([true, 1, null, 'yes'], Boolean);
   * // => false
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': false },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.every(users, { 'user': 'barney', 'active': false });
   * // => false
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.every(users, ['active', false]);
   * // => true
   *
   * // The `_.property` iteratee shorthand.
   * _.every(users, 'active');
   * // => false
   */
  function every(collection, predicate, guard) {
    var func = isArray(collection) ? arrayEvery : baseEvery;
    if (guard && isIterateeCall(collection, predicate, guard)) {
      predicate = undefined;
    }
    return func(collection, getIteratee(predicate, 3));
  }

  /**
   * Iterates over elements of `collection`, returning an array of all elements
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * **Note:** Unlike `_.remove`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [predicate=_.identity]
   *  The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   * @see _.reject
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, function(o) { return !o.active; });
   * // => objects for ['fred']
   *
   * // The `_.matches` iteratee shorthand.
   * _.filter(users, { 'age': 36, 'active': true });
   * // => objects for ['barney']
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.filter(users, ['active', false]);
   * // => objects for ['fred']
   *
   * // The `_.property` iteratee shorthand.
   * _.filter(users, 'active');
   * // => objects for ['barney']
   */
  function filter(collection, predicate) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    return func(collection, getIteratee(predicate, 3));
  }

  /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} [predicate=_.identity]
   *  The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.find(users, function(o) { return o.age < 40; });
   * // => object for 'barney'
   *
   * // The `_.matches` iteratee shorthand.
   * _.find(users, { 'age': 1, 'active': true });
   * // => object for 'pebbles'
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.find(users, ['active', false]);
   * // => object for 'fred'
   *
   * // The `_.property` iteratee shorthand.
   * _.find(users, 'active');
   * // => object for 'barney'
   */
  var find = createFind(findIndex);

  /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _.forEach([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */
  function forEach(collection, iteratee) {
    var func = isArray(collection) ? arrayEach : baseEach;
    return func(collection, getIteratee(iteratee, 3));
  }

  /**
   * Checks if `value` is in `collection`. If `collection` is a string, it's
   * checked for a substring of `value`, otherwise
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * is used for equality comparisons. If `fromIndex` is negative, it's used as
   * the offset from the end of `collection`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object|string} collection The collection to inspect.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
   * @returns {boolean} Returns `true` if `value` is found, else `false`.
   * @example
   *
   * _.includes([1, 2, 3], 1);
   * // => true
   *
   * _.includes([1, 2, 3], 1, 2);
   * // => false
   *
   * _.includes({ 'a': 1, 'b': 2 }, 1);
   * // => true
   *
   * _.includes('abcd', 'bc');
   * // => true
   */
  function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

    var length = collection.length;
    if (fromIndex < 0) {
      fromIndex = nativeMax(length + fromIndex, 0);
    }
    return isString(collection)
      ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
      : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
  }

  /**
   * Invokes the method at `path` of each element in `collection`, returning
   * an array of the results of each invoked method. Any additional arguments
   * are provided to each invoked method. If `path` is a function, it's invoked
   * for, and `this` bound to, each element in `collection`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Array|Function|string} path The path of the method to invoke or
   *  the function invoked per iteration.
   * @param {...*} [args] The arguments to invoke each method with.
   * @returns {Array} Returns the array of results.
   * @example
   *
   * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
   * // => [[1, 5, 7], [1, 2, 3]]
   *
   * _.invokeMap([123, 456], String.prototype.split, '');
   * // => [['1', '2', '3'], ['4', '5', '6']]
   */
  var invokeMap = baseRest(function(collection, path, args) {
    var index = -1,
        isFunc = typeof path == 'function',
        isProp = isKey(path),
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function(value) {
      var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
      result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
    });
    return result;
  });

  /**
   * Creates an array of values by running each element in `collection` thru
   * `iteratee`. The iteratee is invoked with three arguments:
   * (value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
   * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
   * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
   * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * _.map([4, 8], square);
   * // => [16, 64]
   *
   * _.map({ 'a': 4, 'b': 8 }, square);
   * // => [16, 64] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // The `_.property` iteratee shorthand.
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */
  function map(collection, iteratee) {
    var func = isArray(collection) ? arrayMap : baseMap;
    return func(collection, getIteratee(iteratee, 3));
  }

  /**
   * Reduces `collection` to a value which is the accumulated result of running
   * each element in `collection` thru `iteratee`, where each successive
   * invocation is supplied the return value of the previous. If `accumulator`
   * is not given, the first element of `collection` is used as the initial
   * value. The iteratee is invoked with four arguments:
   * (accumulator, value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.reduce`, `_.reduceRight`, and `_.transform`.
   *
   * The guarded methods are:
   * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
   * and `sortBy`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @returns {*} Returns the accumulated value.
   * @see _.reduceRight
   * @example
   *
   * _.reduce([1, 2], function(sum, n) {
   *   return sum + n;
   * }, 0);
   * // => 3
   *
   * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
   *   (result[value] || (result[value] = [])).push(key);
   *   return result;
   * }, {});
   * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
   */
  function reduce(collection, iteratee, accumulator) {
    var func = isArray(collection) ? arrayReduce : baseReduce,
        initAccum = arguments.length < 3;

    return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a function that invokes `func` with the `this` binding of `thisArg`
   * and `partials` prepended to the arguments it receives.
   *
   * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
   * may be used as a placeholder for partially applied arguments.
   *
   * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
   * property of bound functions.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * function greet(greeting, punctuation) {
   *   return greeting + ' ' + this.user + punctuation;
   * }
   *
   * var object = { 'user': 'fred' };
   *
   * var bound = _.bind(greet, object, 'hi');
   * bound('!');
   * // => 'hi fred!'
   *
   * // Bound with placeholders.
   * var bound = _.bind(greet, object, _, '!');
   * bound('hi');
   * // => 'hi fred!'
   */
  var bind = baseRest(function(func, thisArg, partials) {
    var bitmask = BIND_FLAG;
    if (partials.length) {
      var holders = replaceHolders(partials, getHolder(bind));
      bitmask |= PARTIAL_FLAG;
    }
    return createWrap(func, bitmask, thisArg, partials, holders);
  });

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = MapCache;

  /**
   * Creates a function that negates the result of the predicate `func`. The
   * `func` predicate is invoked with the `this` binding and arguments of the
   * created function.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Function
   * @param {Function} predicate The predicate to negate.
   * @returns {Function} Returns the new negated function.
   * @example
   *
   * function isEven(n) {
   *   return n % 2 == 0;
   * }
   *
   * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
   * // => [1, 3, 5]
   */
  function negate(predicate) {
    if (typeof predicate != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return function() {
      var args = arguments;
      switch (args.length) {
        case 0: return !predicate.call(this);
        case 1: return !predicate.call(this, args[0]);
        case 2: return !predicate.call(this, args[0], args[1]);
        case 3: return !predicate.call(this, args[0], args[1], args[2]);
      }
      return !predicate.apply(this, args);
    };
  }

  /**
   * Creates a function that invokes `func` with `partials` prepended to the
   * arguments it receives. This method is like `_.bind` except it does **not**
   * alter the `this` binding.
   *
   * The `_.partial.placeholder` value, which defaults to `_` in monolithic
   * builds, may be used as a placeholder for partially applied arguments.
   *
   * **Note:** This method doesn't set the "length" property of partially
   * applied functions.
   *
   * @static
   * @memberOf _
   * @since 0.2.0
   * @category Function
   * @param {Function} func The function to partially apply arguments to.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * function greet(greeting, name) {
   *   return greeting + ' ' + name;
   * }
   *
   * var sayHelloTo = _.partial(greet, 'hello');
   * sayHelloTo('fred');
   * // => 'hello fred'
   *
   * // Partially applied with placeholders.
   * var greetFred = _.partial(greet, _, 'fred');
   * greetFred('hi');
   * // => 'hi fred'
   */
  var partial = baseRest(function(func, partials) {
    var holders = replaceHolders(partials, getHolder(partial));
    return createWrap(func, PARTIAL_FLAG, undefined, partials, holders);
  });

  /*------------------------------------------------------------------------*/

  /**
   * Creates a shallow clone of `value`.
   *
   * **Note:** This method is loosely based on the
   * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
   * and supports cloning arrays, array buffers, booleans, date objects, maps,
   * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
   * arrays. The own enumerable properties of `arguments` objects are cloned
   * as plain objects. An empty object is returned for uncloneable values such
   * as error objects, functions, DOM nodes, and WeakMaps.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to clone.
   * @returns {*} Returns the cloned value.
   * @see _.cloneDeep
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var shallow = _.clone(objects);
   * console.log(shallow[0] === objects[0]);
   * // => true
   */
  function clone(value) {
    return baseClone(value, false, true);
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * Checks if `value` is classified as a boolean primitive or object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
   * @example
   *
   * _.isBoolean(false);
   * // => true
   *
   * _.isBoolean(null);
   * // => false
   */
  function isBoolean(value) {
    return value === true || value === false ||
      (isObjectLike(value) && objectToString.call(value) == boolTag);
  }

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent.
   *
   * **Note:** This method supports comparing arrays, array buffers, booleans,
   * date objects, error objects, maps, numbers, `Object` objects, regexes,
   * sets, strings, symbols, and typed arrays. `Object` objects are compared
   * by their own, not inherited, enumerable properties. Functions and DOM
   * nodes are **not** supported.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.isEqual(object, other);
   * // => true
   *
   * object === other;
   * // => false
   */
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag || tag == proxyTag;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /**
   * Checks if `value` is `null`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
   * @example
   *
   * _.isNull(null);
   * // => true
   *
   * _.isNull(void 0);
   * // => false
   */
  function isNull(value) {
    return value === null;
  }

  /**
   * Checks if `value` is classified as a `Number` primitive or object.
   *
   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
   * classified as numbers, use the `_.isFinite` method.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a number, else `false`.
   * @example
   *
   * _.isNumber(3);
   * // => true
   *
   * _.isNumber(Number.MIN_VALUE);
   * // => true
   *
   * _.isNumber(Infinity);
   * // => true
   *
   * _.isNumber('3');
   * // => false
   */
  function isNumber(value) {
    return typeof value == 'number' ||
      (isObjectLike(value) && objectToString.call(value) == numberTag);
  }

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike(value) || objectToString.call(value) != objectTag) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return (typeof Ctor == 'function' &&
      Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
  }

  /**
   * Checks if `value` is classified as a `RegExp` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   * @example
   *
   * _.isRegExp(/abc/);
   * // => true
   *
   * _.isRegExp('/abc/');
   * // => false
   */
  var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a string, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' ||
      (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag);
  }

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   *
   * _.isUndefined(null);
   * // => false
   */
  function isUndefined(value) {
    return value === undefined;
  }

  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */
  function toInteger(value) {
    var result = toFinite(value),
        remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
  }

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable string
   * keyed properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * This method is like `_.assign` except that it iterates over own and
   * inherited source properties.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @alias extend
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.assign
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * function Bar() {
   *   this.c = 3;
   * }
   *
   * Foo.prototype.b = 2;
   * Bar.prototype.d = 4;
   *
   * _.assignIn({ 'a': 0 }, new Foo, new Bar);
   * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
   */
  var assignIn = createAssigner(function(object, source) {
    copyObject(source, keysIn(source), object);
  });

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.hasIn(object, 'a');
   * // => true
   *
   * _.hasIn(object, 'a.b');
   * // => true
   *
   * _.hasIn(object, ['a', 'b']);
   * // => true
   *
   * _.hasIn(object, 'b');
   * // => false
   */
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }

  /**
   * This method is like `_.assign` except that it recursively merges own and
   * inherited enumerable string keyed properties of source objects into the
   * destination object. Source properties that resolve to `undefined` are
   * skipped if a destination value exists. Array and plain object properties
   * are merged recursively. Other objects and value types are overridden by
   * assignment. Source objects are applied from left to right. Subsequent
   * sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 0.5.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = {
   *   'a': [{ 'b': 2 }, { 'd': 4 }]
   * };
   *
   * var other = {
   *   'a': [{ 'c': 3 }, { 'e': 5 }]
   * };
   *
   * _.merge(object, other);
   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
   */
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });

  /**
   * The opposite of `_.pickBy`; this method creates an object composed of
   * the own and inherited enumerable string keyed properties of `object` that
   * `predicate` doesn't return truthy for. The predicate is invoked with two
   * arguments: (value, key).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The source object.
   * @param {Function} [predicate=_.identity] The function invoked per property.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.omitBy(object, _.isNumber);
   * // => { 'b': '2' }
   */
  function omitBy(object, predicate) {
    return pickBy(object, negate(getIteratee(predicate)));
  }

  /**
   * Creates an object composed of the picked `object` properties.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The source object.
   * @param {...(string|string[])} [props] The property identifiers to pick.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.pick(object, ['a', 'c']);
   * // => { 'a': 1, 'c': 3 }
   */
  var pick = flatRest(function(object, props) {
    return object == null ? {} : basePick(object, arrayMap(props, toKey));
  });

  /**
   * Creates an object composed of the `object` properties `predicate` returns
   * truthy for. The predicate is invoked with two arguments: (value, key).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The source object.
   * @param {Function} [predicate=_.identity] The function invoked per property.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.pickBy(object, _.isNumber);
   * // => { 'a': 1, 'c': 3 }
   */
  function pickBy(object, predicate) {
    return object == null ? {} : basePickBy(object, getAllKeysIn(object), getIteratee(predicate));
  }

  /**
   * This method is like `_.get` except that if the resolved value is a
   * function it's invoked with the `this` binding of its parent object and
   * its result is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to resolve.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
   *
   * _.result(object, 'a[0].b.c1');
   * // => 3
   *
   * _.result(object, 'a[0].b.c2');
   * // => 4
   *
   * _.result(object, 'a[0].b.c3', 'default');
   * // => 'default'
   *
   * _.result(object, 'a[0].b.c3', _.constant('default'));
   * // => 'default'
   */
  function result(object, path, defaultValue) {
    path = isKey(path, object) ? [path] : castPath(path);

    var index = -1,
        length = path.length;

    // Ensure the loop is entered when path is empty.
    if (!length) {
      object = undefined;
      length = 1;
    }
    while (++index < length) {
      var value = object == null ? undefined : object[toKey(path[index])];
      if (value === undefined) {
        index = length;
        value = defaultValue;
      }
      object = isFunction(value) ? value.call(object) : value;
    }
    return object;
  }

  /**
   * Creates an array of the own enumerable string keyed property values of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property values.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.values(new Foo);
   * // => [1, 2] (iteration order is not guaranteed)
   *
   * _.values('hi');
   * // => ['h', 'i']
   */
  function values(object) {
    return object ? baseValues(object, keys(object)) : [];
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Creates a function that invokes `func` with the arguments of the created
   * function. If `func` is a property name, the created function returns the
   * property value for a given element. If `func` is an array or object, the
   * created function returns `true` for elements that contain the equivalent
   * source properties, otherwise it returns `false`.
   *
   * @static
   * @since 4.0.0
   * @memberOf _
   * @category Util
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @returns {Function} Returns the callback.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * // The `_.matches` iteratee shorthand.
   * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
   * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.filter(users, _.iteratee(['user', 'fred']));
   * // => [{ 'user': 'fred', 'age': 40 }]
   *
   * // The `_.property` iteratee shorthand.
   * _.map(users, _.iteratee('user'));
   * // => ['barney', 'fred']
   *
   * // Create custom iteratee shorthands.
   * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
   *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
   *     return func.test(string);
   *   };
   * });
   *
   * _.filter(['abc', 'def'], /ef/);
   * // => ['def']
   */
  function iteratee(func) {
    return baseIteratee(typeof func == 'function' ? func : baseClone(func, true));
  }

  /**
   * Reverts the `_` variable to its previous value and returns a reference to
   * the `lodash` function.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @returns {Function} Returns the `lodash` function.
   * @example
   *
   * var lodash = _.noConflict();
   */
  function noConflict() {
    if (root._ === this) {
      root._ = oldDash;
    }
    return this;
  }

  /**
   * This method returns `undefined`.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Util
   * @example
   *
   * _.times(2, _.noop);
   * // => [undefined, undefined]
   */
  function noop() {
    // No operation performed.
  }

  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  /*------------------------------------------------------------------------*/

  // Add methods that return wrapped values in chain sequences.
  lodash.assignIn = assignIn;
  lodash.bind = bind;
  lodash.constant = constant;
  lodash.filter = filter;
  lodash.flatten = flatten;
  lodash.intersection = intersection;
  lodash.invokeMap = invokeMap;
  lodash.iteratee = iteratee;
  lodash.keys = keys;
  lodash.keysIn = keysIn;
  lodash.map = map;
  lodash.memoize = memoize;
  lodash.merge = merge;
  lodash.negate = negate;
  lodash.omitBy = omitBy;
  lodash.partial = partial;
  lodash.pick = pick;
  lodash.pickBy = pickBy;
  lodash.property = property;
  lodash.remove = remove;
  lodash.toPlainObject = toPlainObject;
  lodash.values = values;

  // Add aliases.
  lodash.extend = assignIn;

  /*------------------------------------------------------------------------*/

  // Add methods that return unwrapped values in chain sequences.
  lodash.clone = clone;
  lodash.eq = eq;
  lodash.every = every;
  lodash.find = find;
  lodash.findIndex = findIndex;
  lodash.forEach = forEach;
  lodash.get = get;
  lodash.hasIn = hasIn;
  lodash.identity = identity;
  lodash.includes = includes;
  lodash.indexOf = indexOf;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isArrayLike = isArrayLike;
  lodash.isArrayLikeObject = isArrayLikeObject;
  lodash.isBoolean = isBoolean;
  lodash.isBuffer = isBuffer;
  lodash.isEqual = isEqual;
  lodash.isFunction = isFunction;
  lodash.isLength = isLength;
  lodash.isNull = isNull;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isObjectLike = isObjectLike;
  lodash.isPlainObject = isPlainObject;
  lodash.isRegExp = isRegExp;
  lodash.isString = isString;
  lodash.isSymbol = isSymbol;
  lodash.isTypedArray = isTypedArray;
  lodash.isUndefined = isUndefined;
  lodash.last = last;
  lodash.stubArray = stubArray;
  lodash.stubFalse = stubFalse;
  lodash.noConflict = noConflict;
  lodash.noop = noop;
  lodash.reduce = reduce;
  lodash.result = result;
  lodash.toFinite = toFinite;
  lodash.toInteger = toInteger;
  lodash.toNumber = toNumber;
  lodash.toString = toString;

  // Add aliases.
  lodash.each = forEach;

  /*------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type {string}
   */
  lodash.VERSION = VERSION;

  // Assign default placeholders.
  arrayEach(['bind', 'partial'], function(methodName) {
    lodash[methodName].placeholder = lodash;
  });

  /*--------------------------------------------------------------------------*/

  if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = lodash)._ = lodash;
    // Export for CommonJS support.
    freeExports._ = lodash;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
/*!
 * Knockout JavaScript library v3.4.1
 * (c) The Knockout.js team - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function() {(function(n){var x=this||(0,eval)("this"),s=x.document,M=x.navigator,u=x.jQuery,F=x.JSON;(function(n){"function"===typeof define&&define.amd?define(["exports","require"],n):"object"===typeof exports&&"object"===typeof module?n(module.exports||exports):n(x.ko={})})(function(N,O){function J(a,c){return null===a||typeof a in R?a===c:!1}function S(b,c){var d;return function(){d||(d=a.a.setTimeout(function(){d=n;b()},c))}}function T(b,c){var d;return function(){clearTimeout(d);d=a.a.setTimeout(b,c)}}function U(a,
c){c&&c!==I?"beforeChange"===c?this.Lb(a):this.Ha(a,c):this.Mb(a)}function V(a,c){null!==c&&c.k&&c.k()}function W(a,c){var d=this.Ic,e=d[t];e.S||(this.lb&&this.Ma[c]?(d.Qb(c,a,this.Ma[c]),this.Ma[c]=null,--this.lb):e.r[c]||d.Qb(c,a,e.s?{ia:a}:d.wc(a)))}function K(b,c,d,e){a.d[b]={init:function(b,g,h,l,m){var k,r;a.m(function(){var q=g(),p=a.a.c(q),p=!d!==!p,A=!r;if(A||c||p!==k)A&&a.va.Aa()&&(r=a.a.ua(a.f.childNodes(b),!0)),p?(A||a.f.da(b,a.a.ua(r)),a.eb(e?e(m,q):m,b)):a.f.xa(b),k=p},null,{i:b});return{controlsDescendantBindings:!0}}};
a.h.ta[b]=!1;a.f.Z[b]=!0}var a="undefined"!==typeof N?N:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c};a.G=function(a,c,d){a[c]=d};a.version="3.4.1";a.b("version",a.version);a.options={deferUpdates:!1,useOnlyNativeEvents:!1};a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function c(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=b;return a}function e(b,c,d,e){var k=b[c].match(r)||
[];a.a.q(d.match(r),function(b){a.a.pa(k,b,e)});b[c]=k.join(" ")}var f={__proto__:[]}instanceof Array,g="function"===typeof Symbol,h={},l={};h[M&&/Firefox\/2/i.test(M.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];h.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(h,function(a,b){if(b.length)for(var c=0,d=b.length;c<d;c++)l[b[c]]=a});var m={propertychange:!0},k=s&&function(){for(var a=3,b=s.createElement("div"),c=
b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:n}(),r=/\S+/g;return{ec:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],q:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},o:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},Tb:function(a,b,c){for(var d=0,e=a.length;d<e;d++)if(b.call(c,a[d],d))return a[d];
return null},La:function(b,c){var d=a.a.o(b,c);0<d?b.splice(d,1):0===d&&b.shift()},Ub:function(b){b=b||[];for(var c=[],d=0,e=b.length;d<e;d++)0>a.a.o(c,b[d])&&c.push(b[d]);return c},fb:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)c.push(b(a[d],d));return c},Ka:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c},ra:function(a,b){if(b instanceof Array)a.push.apply(a,b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},pa:function(b,c,d){var e=
a.a.o(a.a.zb(b),c);0>e?d&&b.push(c):d||b.splice(e,1)},ka:f,extend:c,Xa:d,Ya:f?d:c,D:b,Ca:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},ob:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},lc:function(b){b=a.a.V(b);for(var c=(b[0]&&b[0].ownerDocument||s).createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.$(b[d]));return c},ua:function(b,c){for(var d=0,e=b.length,k=[];d<e;d++){var m=b[d].cloneNode(!0);k.push(c?a.$(m):m)}return k},
da:function(b,c){a.a.ob(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d])},sc:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],k=e.parentNode,m=0,f=c.length;m<f;m++)k.insertBefore(c[m],e);m=0;for(f=d.length;m<f;m++)a.removeNode(d[m])}},za:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.splice(0,1);for(;1<a.length&&a[a.length-1].parentNode!==b;)a.length--;if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=0;c!==d;)a.push(c),
c=c.nextSibling;a.push(d)}}return a},uc:function(a,b){7>k?a.setAttribute("selected",b):a.selected=b},$a:function(a){return null===a||a===n?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},od:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},Nc:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=
b;)a=a.parentNode;return!!a},nb:function(b){return a.a.Nc(b,b.ownerDocument.documentElement)},Rb:function(b){return!!a.a.Tb(b,a.a.nb)},A:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},Xb:function(b){return a.onError?function(){try{return b.apply(this,arguments)}catch(c){throw a.onError&&a.onError(c),c;}}:b},setTimeout:function(b,c){return setTimeout(a.a.Xb(b),c)},bc:function(b){setTimeout(function(){a.onError&&a.onError(b);throw b;},0)},p:function(b,c,d){var e=a.a.Xb(d);d=k&&m[c];if(a.options.useOnlyNativeEvents||
d||!u)if(d||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var f=function(a){e.call(b,a)},l="on"+c;b.attachEvent(l,f);a.a.F.oa(b,function(){b.detachEvent(l,f)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,e,!1);else u(b).bind(c,e)},Da:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.A(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==
d||"radio"==d):d=!1;if(a.options.useOnlyNativeEvents||!u||d)if("function"==typeof s.createEvent)if("function"==typeof b.dispatchEvent)d=s.createEvent(l[c]||"HTMLEvents"),d.initEvent(c,!0,!0,x,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");else u(b).trigger(c)},c:function(b){return a.H(b)?
b():b},zb:function(b){return a.H(b)?b.t():b},bb:function(b,c,d){var k;c&&("object"===typeof b.classList?(k=b.classList[d?"add":"remove"],a.a.q(c.match(r),function(a){k.call(b.classList,a)})):"string"===typeof b.className.baseVal?e(b.className,"baseVal",c,d):e(b,"className",c,d))},Za:function(b,c){var d=a.a.c(c);if(null===d||d===n)d="";var e=a.f.firstChild(b);!e||3!=e.nodeType||a.f.nextSibling(e)?a.f.da(b,[b.ownerDocument.createTextNode(d)]):e.data=d;a.a.Sc(b)},tc:function(a,b){a.name=b;if(7>=k)try{a.mergeAttributes(s.createElement("<input name='"+
a.name+"'/>"),!1)}catch(c){}},Sc:function(a){9<=k&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Oc:function(a){if(k){var b=a.style.width;a.style.width=0;a.style.width=b}},jd:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=[],e=b;e<=c;e++)d.push(e);return d},V:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},$b:function(a){return g?Symbol(a):a},sd:6===k,ud:7===k,C:k,gc:function(b,c){for(var d=a.a.V(b.getElementsByTagName("input")).concat(a.a.V(b.getElementsByTagName("textarea"))),
e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},k=[],m=d.length-1;0<=m;m--)e(d[m])&&k.push(d[m]);return k},fd:function(b){return"string"==typeof b&&(b=a.a.$a(b))?F&&F.parse?F.parse(b):(new Function("return "+b))():null},Eb:function(b,c,d){if(!F||!F.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
return F.stringify(a.a.c(b),c,d)},gd:function(c,d,e){e=e||{};var k=e.params||{},m=e.includeFields||this.ec,f=c;if("object"==typeof c&&"form"===a.a.A(c))for(var f=c.action,l=m.length-1;0<=l;l--)for(var g=a.a.gc(c,m[l]),h=g.length-1;0<=h;h--)k[g[h].name]=g[h].value;d=a.a.c(d);var r=s.createElement("form");r.style.display="none";r.action=f;r.method="post";for(var n in d)c=s.createElement("input"),c.type="hidden",c.name=n,c.value=a.a.Eb(a.a.c(d[n])),r.appendChild(c);b(k,function(a,b){var c=s.createElement("input");
c.type="hidden";c.name=a;c.value=b;r.appendChild(c)});s.body.appendChild(r);e.submitter?e.submitter(r):r.submit();setTimeout(function(){r.parentNode.removeChild(r)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.q);a.b("utils.arrayFirst",a.a.Tb);a.b("utils.arrayFilter",a.a.Ka);a.b("utils.arrayGetDistinctValues",a.a.Ub);a.b("utils.arrayIndexOf",a.a.o);a.b("utils.arrayMap",a.a.fb);a.b("utils.arrayPushAll",a.a.ra);a.b("utils.arrayRemoveItem",a.a.La);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",
a.a.ec);a.b("utils.getFormFields",a.a.gc);a.b("utils.peekObservable",a.a.zb);a.b("utils.postJson",a.a.gd);a.b("utils.parseJson",a.a.fd);a.b("utils.registerEventHandler",a.a.p);a.b("utils.stringifyJson",a.a.Eb);a.b("utils.range",a.a.jd);a.b("utils.toggleDomNodeCssClass",a.a.bb);a.b("utils.triggerEvent",a.a.Da);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.D);a.b("utils.addOrRemoveItem",a.a.pa);a.b("utils.setTextContent",a.a.Za);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=
function(a){var c=this;if(1===arguments.length)return function(){return c.apply(a,arguments)};var d=Array.prototype.slice.call(arguments,1);return function(){var e=d.slice(0);e.push.apply(e,arguments);return c.apply(a,e)}});a.a.e=new function(){function a(b,g){var h=b[d];if(!h||"null"===h||!e[h]){if(!g)return n;h=b[d]="ko"+c++;e[h]={}}return e[h]}var c=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===n?n:e[d]},set:function(c,d,e){if(e!==n||a(c,!1)!==n)a(c,!0)[d]=
e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},I:function(){return c++ +d}}};a.b("utils.domData",a.a.e);a.b("utils.domData.clear",a.a.e.clear);a.a.F=new function(){function b(b,c){var e=a.a.e.get(b,d);e===n&&c&&(e=[],a.a.e.set(b,d,e));return e}function c(d){var e=b(d,!1);if(e)for(var e=e.slice(0),l=0;l<e.length;l++)e[l](d);a.a.e.clear(d);a.a.F.cleanExternalData(d);if(f[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&c(d)}var d=a.a.e.I(),e={1:!0,8:!0,9:!0},
f={1:!0,9:!0};return{oa:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},rc:function(c,e){var l=b(c,!1);l&&(a.a.La(l,e),0==l.length&&a.a.e.set(c,d,n))},$:function(b){if(e[b.nodeType]&&(c(b),f[b.nodeType])){var d=[];a.a.ra(d,b.getElementsByTagName("*"));for(var l=0,m=d.length;l<m;l++)c(d[l])}return b},removeNode:function(b){a.$(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){u&&"function"==typeof u.cleanData&&u.cleanData([a])}}};
a.$=a.a.F.$;a.removeNode=a.a.F.removeNode;a.b("cleanNode",a.$);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.F);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.F.oa);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.F.rc);(function(){var b=[0,"",""],c=[1,"<table>","</table>"],d=[3,"<table><tbody><tr>","</tr></tbody></table>"],e=[1,"<select multiple='multiple'>","</select>"],f={thead:c,tbody:c,tfoot:c,tr:[2,"<table><tbody>","</tbody></table>"],td:d,th:d,option:e,optgroup:e},
g=8>=a.a.C;a.a.ma=function(c,d){var e;if(u)if(u.parseHTML)e=u.parseHTML(c,d)||[];else{if((e=u.clean([c],d))&&e[0]){for(var k=e[0];k.parentNode&&11!==k.parentNode.nodeType;)k=k.parentNode;k.parentNode&&k.parentNode.removeChild(k)}}else{(e=d)||(e=s);var k=e.parentWindow||e.defaultView||x,r=a.a.$a(c).toLowerCase(),q=e.createElement("div"),p;p=(r=r.match(/^<([a-z]+)[ >]/))&&f[r[1]]||b;r=p[0];p="ignored<div>"+p[1]+c+p[2]+"</div>";"function"==typeof k.innerShiv?q.appendChild(k.innerShiv(p)):(g&&e.appendChild(q),
q.innerHTML=p,g&&q.parentNode.removeChild(q));for(;r--;)q=q.lastChild;e=a.a.V(q.lastChild.childNodes)}return e};a.a.Cb=function(b,c){a.a.ob(b);c=a.a.c(c);if(null!==c&&c!==n)if("string"!=typeof c&&(c=c.toString()),u)u(b).html(c);else for(var d=a.a.ma(c,b.ownerDocument),e=0;e<d.length;e++)b.appendChild(d[e])}})();a.b("utils.parseHtmlFragment",a.a.ma);a.b("utils.setHtml",a.a.Cb);a.M=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.M.nc(c.nodeValue);null!=f&&e.push({Mc:c,dd:f})}else if(1==c.nodeType)for(var f=
0,g=c.childNodes,h=g.length;f<h;f++)b(g[f],e)}var c={};return{wb:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},zc:function(a,b){var f=c[a];if(f===n)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),
!0}finally{delete c[a]}},Ac:function(c,e){var f=[];b(c,f);for(var g=0,h=f.length;g<h;g++){var l=f[g].Mc,m=[l];e&&a.a.ra(m,e);a.M.zc(f[g].dd,m);l.nodeValue="";l.parentNode&&l.parentNode.removeChild(l)}},nc:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.M);a.b("memoization.memoize",a.M.wb);a.b("memoization.unmemoize",a.M.zc);a.b("memoization.parseMemoText",a.M.nc);a.b("memoization.unmemoizeDomNodeAndDescendants",a.M.Ac);a.Y=function(){function b(){if(e)for(var b=
e,c=0,m;g<e;)if(m=d[g++]){if(g>b){if(5E3<=++c){g=e;a.a.bc(Error("'Too much recursion' after processing "+c+" task groups."));break}b=e}try{m()}catch(k){a.a.bc(k)}}}function c(){b();g=e=d.length=0}var d=[],e=0,f=1,g=0;return{scheduler:x.MutationObserver?function(a){var b=s.createElement("div");(new MutationObserver(a)).observe(b,{attributes:!0});return function(){b.classList.toggle("foo")}}(c):s&&"onreadystatechange"in s.createElement("script")?function(a){var b=s.createElement("script");b.onreadystatechange=
function(){b.onreadystatechange=null;s.documentElement.removeChild(b);b=null;a()};s.documentElement.appendChild(b)}:function(a){setTimeout(a,0)},Wa:function(b){e||a.Y.scheduler(c);d[e++]=b;return f++},cancel:function(a){a-=f-e;a>=g&&a<e&&(d[a]=null)},resetForTesting:function(){var a=e-g;g=e=d.length=0;return a},nd:b}}();a.b("tasks",a.Y);a.b("tasks.schedule",a.Y.Wa);a.b("tasks.runEarly",a.Y.nd);a.ya={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.B({read:b,write:function(e){clearTimeout(d);
d=a.a.setTimeout(function(){b(e)},c)}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);a.cb=!1;f="notifyWhenChangesStop"==e?T:S;a.Ta(function(a){return f(a,d)})},deferred:function(b,c){if(!0!==c)throw Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.");b.cb||(b.cb=!0,b.Ta(function(c){var e;return function(){a.Y.cancel(e);e=a.Y.Wa(c);b.notifySubscribers(n,"dirty")}}))},notify:function(a,c){a.equalityComparer=
"always"==c?null:J}};var R={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.ya);a.xc=function(b,c,d){this.ia=b;this.gb=c;this.Lc=d;this.S=!1;a.G(this,"dispose",this.k)};a.xc.prototype.k=function(){this.S=!0;this.Lc()};a.J=function(){a.a.Ya(this,D);D.rb(this)};var I="change",D={rb:function(a){a.K={};a.Ob=1},X:function(b,c,d){var e=this;d=d||I;var f=new a.xc(e,c?b.bind(c):b,function(){a.a.La(e.K[d],f);e.Ia&&e.Ia(d)});e.sa&&e.sa(d);e.K[d]||(e.K[d]=[]);e.K[d].push(f);return f},notifySubscribers:function(b,
c){c=c||I;c===I&&this.Ib();if(this.Pa(c))try{a.l.Vb();for(var d=this.K[c].slice(0),e=0,f;f=d[e];++e)f.S||f.gb(b)}finally{a.l.end()}},Na:function(){return this.Ob},Vc:function(a){return this.Na()!==a},Ib:function(){++this.Ob},Ta:function(b){var c=this,d=a.H(c),e,f,g;c.Ha||(c.Ha=c.notifySubscribers,c.notifySubscribers=U);var h=b(function(){c.Nb=!1;d&&g===c&&(g=c());e=!1;c.tb(f,g)&&c.Ha(f=g)});c.Mb=function(a){c.Nb=e=!0;g=a;h()};c.Lb=function(a){e||(f=a,c.Ha(a,"beforeChange"))}},Pa:function(a){return this.K[a]&&
this.K[a].length},Tc:function(b){if(b)return this.K[b]&&this.K[b].length||0;var c=0;a.a.D(this.K,function(a,b){"dirty"!==a&&(c+=b.length)});return c},tb:function(a,c){return!this.equalityComparer||!this.equalityComparer(a,c)},extend:function(b){var c=this;b&&a.a.D(b,function(b,e){var f=a.ya[b];"function"==typeof f&&(c=f(c,e)||c)});return c}};a.G(D,"subscribe",D.X);a.G(D,"extend",D.extend);a.G(D,"getSubscriptionsCount",D.Tc);a.a.ka&&a.a.Xa(D,Function.prototype);a.J.fn=D;a.jc=function(a){return null!=
a&&"function"==typeof a.X&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.J);a.b("isSubscribable",a.jc);a.va=a.l=function(){function b(a){d.push(e);e=a}function c(){e=d.pop()}var d=[],e,f=0;return{Vb:b,end:c,qc:function(b){if(e){if(!a.jc(b))throw Error("Only subscribable things can act as dependencies");e.gb.call(e.Hc,b,b.Dc||(b.Dc=++f))}},w:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c()}},Aa:function(){if(e)return e.m.Aa()},Sa:function(){if(e)return e.Sa}}}();a.b("computedContext",
a.va);a.b("computedContext.getDependenciesCount",a.va.Aa);a.b("computedContext.isInitial",a.va.Sa);a.b("ignoreDependencies",a.rd=a.l.w);var E=a.a.$b("_latestValue");a.N=function(b){function c(){if(0<arguments.length)return c.tb(c[E],arguments[0])&&(c.ga(),c[E]=arguments[0],c.fa()),this;a.l.qc(c);return c[E]}c[E]=b;a.a.ka||a.a.extend(c,a.J.fn);a.J.fn.rb(c);a.a.Ya(c,B);a.options.deferUpdates&&a.ya.deferred(c,!0);return c};var B={equalityComparer:J,t:function(){return this[E]},fa:function(){this.notifySubscribers(this[E])},
ga:function(){this.notifySubscribers(this[E],"beforeChange")}};a.a.ka&&a.a.Xa(B,a.J.fn);var H=a.N.hd="__ko_proto__";B[H]=a.N;a.Oa=function(b,c){return null===b||b===n||b[H]===n?!1:b[H]===c?!0:a.Oa(b[H],c)};a.H=function(b){return a.Oa(b,a.N)};a.Ba=function(b){return"function"==typeof b&&b[H]===a.N||"function"==typeof b&&b[H]===a.B&&b.Wc?!0:!1};a.b("observable",a.N);a.b("isObservable",a.H);a.b("isWriteableObservable",a.Ba);a.b("isWritableObservable",a.Ba);a.b("observable.fn",B);a.G(B,"peek",B.t);a.G(B,
"valueHasMutated",B.fa);a.G(B,"valueWillMutate",B.ga);a.la=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");b=a.N(b);a.a.Ya(b,a.la.fn);return b.extend({trackArrayChanges:!0})};a.la.fn={remove:function(b){for(var c=this.t(),d=[],e="function"!=typeof b||a.H(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var g=c[f];e(g)&&(0===d.length&&this.ga(),d.push(g),c.splice(f,1),f--)}d.length&&
this.fa();return d},removeAll:function(b){if(b===n){var c=this.t(),d=c.slice(0);this.ga();c.splice(0,c.length);this.fa();return d}return b?this.remove(function(c){return 0<=a.a.o(b,c)}):[]},destroy:function(b){var c=this.t(),d="function"!=typeof b||a.H(b)?function(a){return a===b}:b;this.ga();for(var e=c.length-1;0<=e;e--)d(c[e])&&(c[e]._destroy=!0);this.fa()},destroyAll:function(b){return b===n?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.o(b,c)}):[]},indexOf:function(b){var c=
this();return a.a.o(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.ga(),this.t()[d]=c,this.fa())}};a.a.ka&&a.a.Xa(a.la.fn,a.N.fn);a.a.q("pop push reverse shift sort splice unshift".split(" "),function(b){a.la.fn[b]=function(){var a=this.t();this.ga();this.Wb(a,b,arguments);var d=a[b].apply(a,arguments);this.fa();return d===a?this:d}});a.a.q(["slice"],function(b){a.la.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.b("observableArray",a.la);a.ya.trackArrayChanges=function(b,
c){function d(){if(!e){e=!0;l=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==I||++h;return l.apply(this,arguments)};var c=[].concat(b.t()||[]);f=null;g=b.X(function(d){d=[].concat(d||[]);if(b.Pa("arrayChange")){var e;if(!f||1<h)f=a.a.ib(c,d,b.hb);e=f}c=d;f=null;h=0;e&&e.length&&b.notifySubscribers(e,"arrayChange")})}}b.hb={};c&&"object"==typeof c&&a.a.extend(b.hb,c);b.hb.sparse=!0;if(!b.Wb){var e=!1,f=null,g,h=0,l,m=b.sa,k=b.Ia;b.sa=function(a){m&&m.call(b,a);"arrayChange"===a&&d()};
b.Ia=function(a){k&&k.call(b,a);"arrayChange"!==a||b.Pa("arrayChange")||(l&&(b.notifySubscribers=l,l=n),g.k(),e=!1)};b.Wb=function(b,c,d){function k(a,b,c){return m[m.length]={status:a,value:b,index:c}}if(e&&!h){var m=[],l=b.length,g=d.length,G=0;switch(c){case "push":G=l;case "unshift":for(c=0;c<g;c++)k("added",d[c],G+c);break;case "pop":G=l-1;case "shift":l&&k("deleted",b[G],G);break;case "splice":c=Math.min(Math.max(0,0>d[0]?l+d[0]:d[0]),l);for(var l=1===g?l:Math.min(c+(d[1]||0),l),g=c+g-2,G=Math.max(l,
g),n=[],s=[],w=2;c<G;++c,++w)c<l&&s.push(k("deleted",b[c],c)),c<g&&n.push(k("added",d[w],c));a.a.fc(s,n);break;default:return}f=m}}}};var t=a.a.$b("_state");a.m=a.B=function(b,c,d){function e(){if(0<arguments.length){if("function"===typeof f)f.apply(g.pb,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");return this}a.l.qc(e);(g.T||g.s&&e.Qa())&&e.aa();return g.U}"object"===typeof b?
d=b:(d=d||{},b&&(d.read=b));if("function"!=typeof d.read)throw Error("Pass a function that returns the value of the ko.computed");var f=d.write,g={U:n,T:!0,Ra:!1,Fb:!1,S:!1,Va:!1,s:!1,kd:d.read,pb:c||d.owner,i:d.disposeWhenNodeIsRemoved||d.i||null,wa:d.disposeWhen||d.wa,mb:null,r:{},L:0,dc:null};e[t]=g;e.Wc="function"===typeof f;a.a.ka||a.a.extend(e,a.J.fn);a.J.fn.rb(e);a.a.Ya(e,z);d.pure?(g.Va=!0,g.s=!0,a.a.extend(e,Y)):d.deferEvaluation&&a.a.extend(e,Z);a.options.deferUpdates&&a.ya.deferred(e,!0);
g.i&&(g.Fb=!0,g.i.nodeType||(g.i=null));g.s||d.deferEvaluation||e.aa();g.i&&e.ba()&&a.a.F.oa(g.i,g.mb=function(){e.k()});return e};var z={equalityComparer:J,Aa:function(){return this[t].L},Qb:function(a,c,d){if(this[t].Va&&c===this)throw Error("A 'pure' computed must not be called recursively");this[t].r[a]=d;d.Ga=this[t].L++;d.na=c.Na()},Qa:function(){var a,c,d=this[t].r;for(a in d)if(d.hasOwnProperty(a)&&(c=d[a],c.ia.Vc(c.na)))return!0},cd:function(){this.Fa&&!this[t].Ra&&this.Fa()},ba:function(){return this[t].T||
0<this[t].L},md:function(){this.Nb||this.cc()},wc:function(a){if(a.cb&&!this[t].i){var c=a.X(this.cd,this,"dirty"),d=a.X(this.md,this);return{ia:a,k:function(){c.k();d.k()}}}return a.X(this.cc,this)},cc:function(){var b=this,c=b.throttleEvaluation;c&&0<=c?(clearTimeout(this[t].dc),this[t].dc=a.a.setTimeout(function(){b.aa(!0)},c)):b.Fa?b.Fa():b.aa(!0)},aa:function(b){var c=this[t],d=c.wa,e=!1;if(!c.Ra&&!c.S){if(c.i&&!a.a.nb(c.i)||d&&d()){if(!c.Fb){this.k();return}}else c.Fb=!1;c.Ra=!0;try{e=this.Rc(b)}finally{c.Ra=
!1}c.L||this.k();return e}},Rc:function(b){var c=this[t],d=!1,e=c.Va?n:!c.L,f={Ic:this,Ma:c.r,lb:c.L};a.l.Vb({Hc:f,gb:W,m:this,Sa:e});c.r={};c.L=0;f=this.Qc(c,f);this.tb(c.U,f)&&(c.s||this.notifySubscribers(c.U,"beforeChange"),c.U=f,c.s?this.Ib():b&&this.notifySubscribers(c.U),d=!0);e&&this.notifySubscribers(c.U,"awake");return d},Qc:function(b,c){try{var d=b.kd;return b.pb?d.call(b.pb):d()}finally{a.l.end(),c.lb&&!b.s&&a.a.D(c.Ma,V),b.T=!1}},t:function(){var a=this[t];(a.T&&!a.L||a.s&&this.Qa())&&
this.aa();return a.U},Ta:function(b){a.J.fn.Ta.call(this,b);this.Fa=function(){this.Lb(this[t].U);this[t].T=!0;this.Mb(this)}},k:function(){var b=this[t];!b.s&&b.r&&a.a.D(b.r,function(a,b){b.k&&b.k()});b.i&&b.mb&&a.a.F.rc(b.i,b.mb);b.r=null;b.L=0;b.S=!0;b.T=!1;b.s=!1;b.i=null}},Y={sa:function(b){var c=this,d=c[t];if(!d.S&&d.s&&"change"==b){d.s=!1;if(d.T||c.Qa())d.r=null,d.L=0,d.T=!0,c.aa()&&c.Ib();else{var e=[];a.a.D(d.r,function(a,b){e[b.Ga]=a});a.a.q(e,function(a,b){var e=d.r[a],l=c.wc(e.ia);l.Ga=
b;l.na=e.na;d.r[a]=l})}d.S||c.notifySubscribers(d.U,"awake")}},Ia:function(b){var c=this[t];c.S||"change"!=b||this.Pa("change")||(a.a.D(c.r,function(a,b){b.k&&(c.r[a]={ia:b.ia,Ga:b.Ga,na:b.na},b.k())}),c.s=!0,this.notifySubscribers(n,"asleep"))},Na:function(){var b=this[t];b.s&&(b.T||this.Qa())&&this.aa();return a.J.fn.Na.call(this)}},Z={sa:function(a){"change"!=a&&"beforeChange"!=a||this.t()}};a.a.ka&&a.a.Xa(z,a.J.fn);var P=a.N.hd;a.m[P]=a.N;z[P]=a.m;a.Yc=function(b){return a.Oa(b,a.m)};a.Zc=function(b){return a.Oa(b,
a.m)&&b[t]&&b[t].Va};a.b("computed",a.m);a.b("dependentObservable",a.m);a.b("isComputed",a.Yc);a.b("isPureComputed",a.Zc);a.b("computed.fn",z);a.G(z,"peek",z.t);a.G(z,"dispose",z.k);a.G(z,"isActive",z.ba);a.G(z,"getDependenciesCount",z.Aa);a.pc=function(b,c){if("function"===typeof b)return a.m(b,c,{pure:!0});b=a.a.extend({},b);b.pure=!0;return a.m(b,c)};a.b("pureComputed",a.pc);(function(){function b(a,f,g){g=g||new d;a=f(a);if("object"!=typeof a||null===a||a===n||a instanceof RegExp||a instanceof
Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var h=a instanceof Array?[]:{};g.save(a,h);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":h[c]=d;break;case "object":case "undefined":var k=g.get(d);h[c]=k!==n?k:b(d,f,g)}});return h}function c(a,b){if(a instanceof Array){for(var c=0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=[];this.Jb=[]}a.yc=function(c){if(0==
arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.H(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.yc(b);return a.a.Eb(b,c,d)};d.prototype={save:function(b,c){var d=a.a.o(this.keys,b);0<=d?this.Jb[d]=c:(this.keys.push(b),this.Jb.push(c))},get:function(b){b=a.a.o(this.keys,b);return 0<=b?this.Jb[b]:n}}})();a.b("toJS",a.yc);a.b("toJSON",a.toJSON);(function(){a.j={u:function(b){switch(a.a.A(b)){case "option":return!0===
b.__ko__hasDomDataOptionValue__?a.a.e.get(b,a.d.options.xb):7>=a.a.C?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.j.u(b.options[b.selectedIndex]):n;default:return b.value}},ha:function(b,c,d){switch(a.a.A(b)){case "option":switch(typeof c){case "string":a.a.e.set(b,a.d.options.xb,n);"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__;b.value=c;break;default:a.a.e.set(b,a.d.options.xb,c),
b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof c?c:""}break;case "select":if(""===c||null===c)c=n;for(var e=-1,f=0,g=b.options.length,h;f<g;++f)if(h=a.j.u(b.options[f]),h==c||""==h&&c===n){e=f;break}if(d||0<=e||c===n&&1<b.size)b.selectedIndex=e;break;default:if(null===c||c===n)c="";b.value=c}}}})();a.b("selectExtensions",a.j);a.b("selectExtensions.readValue",a.j.u);a.b("selectExtensions.writeValue",a.j.ha);a.h=function(){function b(b){b=a.a.$a(b);123===b.charCodeAt(0)&&(b=b.slice(1,
-1));var c=[],d=b.match(e),r,h=[],p=0;if(d){d.push(",");for(var A=0,y;y=d[A];++A){var v=y.charCodeAt(0);if(44===v){if(0>=p){c.push(r&&h.length?{key:r,value:h.join("")}:{unknown:r||h.join("")});r=p=0;h=[];continue}}else if(58===v){if(!p&&!r&&1===h.length){r=h.pop();continue}}else 47===v&&A&&1<y.length?(v=d[A-1].match(f))&&!g[v[0]]&&(b=b.substr(b.indexOf(y)+1),d=b.match(e),d.push(","),A=-1,y="/"):40===v||123===v||91===v?++p:41===v||125===v||93===v?--p:r||h.length||34!==v&&39!==v||(y=y.slice(1,-1));
h.push(y)}}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,g={"in":1,"return":1,"typeof":1},h={};return{ta:[],ea:h,yb:b,Ua:function(e,m){function k(b,e){var m;if(!A){var l=a.getBindingHandler(b);if(l&&l.preprocess&&!(e=l.preprocess(e,b,k)))return;if(l=h[b])m=e,0<=a.a.o(c,m)?
m=!1:(l=m.match(d),m=null===l?!1:l[1]?"Object("+l[1]+")"+l[2]:m),l=m;l&&g.push("'"+b+"':function(_z){"+m+"=_z}")}p&&(e="function(){return "+e+" }");f.push("'"+b+"':"+e)}m=m||{};var f=[],g=[],p=m.valueAccessors,A=m.bindingParams,y="string"===typeof e?b(e):e;a.a.q(y,function(a){k(a.key||a.unknown,a.value)});g.length&&k("_ko_property_writers","{"+g.join(",")+" }");return f.join(",")},bd:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;return!1},Ea:function(b,c,d,e,f){if(b&&a.H(b))!a.Ba(b)||
f&&b.t()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.h);a.b("expressionRewriting.bindingRewriteValidators",a.h.ta);a.b("expressionRewriting.parseObjectLiteral",a.h.yb);a.b("expressionRewriting.preProcessBindings",a.h.Ua);a.b("expressionRewriting._twoWayBindings",a.h.ea);a.b("jsonExpressionRewriting",a.h);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.h.Ua);(function(){function b(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}
function c(a){return 8==a.nodeType&&h.test(f?a.text:a.nodeValue)}function d(a,d){for(var e=a,f=1,l=[];e=e.nextSibling;){if(c(e)&&(f--,0===f))return l;l.push(e);b(e)&&f++}if(!d)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var c=d(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var f=s&&"\x3c!--test--\x3e"===s.createComment("test").text,g=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,h=f?/^\x3c!--\s*\/ko\s*--\x3e$/:
/^\s*\/ko\s*$/,l={ul:!0,ol:!0};a.f={Z:{},childNodes:function(a){return b(a)?d(a):a.childNodes},xa:function(c){if(b(c)){c=a.f.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.ob(c)},da:function(c,d){if(b(c)){a.f.xa(c);for(var e=c.nextSibling,f=0,l=d.length;f<l;f++)e.parentNode.insertBefore(d[f],e)}else a.a.da(c,d)},oc:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},ic:function(c,d,e){e?b(c)?c.parentNode.insertBefore(d,
e.nextSibling):e.nextSibling?c.insertBefore(d,e.nextSibling):c.appendChild(d):a.f.oc(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||c(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&c(a.nextSibling)?null:a.nextSibling},Uc:b,qd:function(a){return(a=(f?a.text:a.nodeValue).match(g))?a[1]:null},mc:function(d){if(l[a.a.A(d)]){var k=d.firstChild;if(k){do if(1===k.nodeType){var f;f=k.firstChild;var g=null;if(f){do if(g)g.push(f);else if(b(f)){var h=
e(f,!0);h?f=h:g=[f]}else c(f)&&(g=[f]);while(f=f.nextSibling)}if(f=g)for(g=k.nextSibling,h=0;h<f.length;h++)g?d.insertBefore(f[h],g):d.appendChild(f[h])}while(k=k.nextSibling)}}}}})();a.b("virtualElements",a.f);a.b("virtualElements.allowedBindings",a.f.Z);a.b("virtualElements.emptyNode",a.f.xa);a.b("virtualElements.insertAfter",a.f.ic);a.b("virtualElements.prepend",a.f.oc);a.b("virtualElements.setDomNodeChildren",a.f.da);(function(){a.R=function(){this.Gc={}};a.a.extend(a.R.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=
b.getAttribute("data-bind")||a.g.getComponentNameForNode(b);case 8:return a.f.Uc(b);default:return!1}},getBindings:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b):null;return a.g.Pb(d,b,c,!1)},getBindingAccessors:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b,{valueAccessors:!0}):null;return a.g.Pb(d,b,c,!0)},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");case 8:return a.f.qd(b);default:return null}},
parseBindingsString:function(b,c,d,e){try{var f=this.Gc,g=b+(e&&e.valueAccessors||""),h;if(!(h=f[g])){var l,m="with($context){with($data||{}){return{"+a.h.Ua(b,e)+"}}}";l=new Function("$context","$element",m);h=f[g]=l}return h(c,d)}catch(k){throw k.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+k.message,k;}}});a.R.instance=new a.R})();a.b("bindingProvider",a.R);(function(){function b(a){return function(){return a}}function c(a){return a()}function d(b){return a.a.Ca(a.l.w(b),
function(a,c){return function(){return b()[c]}})}function e(c,e,k){return"function"===typeof c?d(c.bind(null,e,k)):a.a.Ca(c,b)}function f(a,b){return d(this.getBindings.bind(this,a,b))}function g(b,c,d){var e,k=a.f.firstChild(c),f=a.R.instance,m=f.preprocessNode;if(m){for(;e=k;)k=a.f.nextSibling(e),m.call(f,e);k=a.f.firstChild(c)}for(;e=k;)k=a.f.nextSibling(e),h(b,e,d)}function h(b,c,d){var e=!0,k=1===c.nodeType;k&&a.f.mc(c);if(k&&d||a.R.instance.nodeHasBindings(c))e=m(c,null,b,d).shouldBindDescendants;
e&&!r[a.a.A(c)]&&g(b,c,!k)}function l(b){var c=[],d={},e=[];a.a.D(b,function X(k){if(!d[k]){var f=a.getBindingHandler(k);f&&(f.after&&(e.push(k),a.a.q(f.after,function(c){if(b[c]){if(-1!==a.a.o(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));X(c)}}),e.length--),c.push({key:k,hc:f}));d[k]=!0}});return c}function m(b,d,e,k){var m=a.a.e.get(b,q);if(!d){if(m)throw Error("You cannot apply bindings multiple times to the same element.");a.a.e.set(b,
q,!0)}!m&&k&&a.vc(b,e);var g;if(d&&"function"!==typeof d)g=d;else{var h=a.R.instance,r=h.getBindingAccessors||f,p=a.B(function(){(g=d?d(e,b):r.call(h,b,e))&&e.P&&e.P();return g},null,{i:b});g&&p.ba()||(p=null)}var s;if(g){var u=p?function(a){return function(){return c(p()[a])}}:function(a){return g[a]},t=function(){return a.a.Ca(p?p():g,c)};t.get=function(a){return g[a]&&c(u(a))};t.has=function(a){return a in g};k=l(g);a.a.q(k,function(c){var d=c.hc.init,k=c.hc.update,f=c.key;if(8===b.nodeType&&!a.f.Z[f])throw Error("The binding '"+
f+"' cannot be used with virtual elements");try{"function"==typeof d&&a.l.w(function(){var a=d(b,u(f),t,e.$data,e);if(a&&a.controlsDescendantBindings){if(s!==n)throw Error("Multiple bindings ("+s+" and "+f+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");s=f}}),"function"==typeof k&&a.B(function(){k(b,u(f),t,e.$data,e)},null,{i:b})}catch(m){throw m.message='Unable to process binding "'+f+": "+g[f]+'"\nMessage: '+m.message,
m;}})}return{shouldBindDescendants:s===n}}function k(b){return b&&b instanceof a.Q?b:new a.Q(b)}a.d={};var r={script:!0,textarea:!0,template:!0};a.getBindingHandler=function(b){return a.d[b]};a.Q=function(b,c,d,e,k){function f(){var k=g?b():b,m=a.a.c(k);c?(c.P&&c.P(),a.a.extend(l,c),l.P=r):(l.$parents=[],l.$root=m,l.ko=a);l.$rawData=k;l.$data=m;d&&(l[d]=m);e&&e(l,c,m);return l.$data}function m(){return h&&!a.a.Rb(h)}var l=this,g="function"==typeof b&&!a.H(b),h,r;k&&k.exportDependencies?f():(r=a.B(f,
null,{wa:m,i:!0}),r.ba()&&(l.P=r,r.equalityComparer=null,h=[],r.Bc=function(b){h.push(b);a.a.F.oa(b,function(b){a.a.La(h,b);h.length||(r.k(),l.P=r=n)})}))};a.Q.prototype.createChildContext=function(b,c,d,e){return new a.Q(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)},e)};a.Q.prototype.extend=function(b){return new a.Q(this.P||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?
b():b)})};a.Q.prototype.Zb=function(a,b){return this.createChildContext(a,b,null,{exportDependencies:!0})};var q=a.a.e.I(),p=a.a.e.I();a.vc=function(b,c){if(2==arguments.length)a.a.e.set(b,p,c),c.P&&c.P.Bc(b);else return a.a.e.get(b,p)};a.Ja=function(b,c,d){1===b.nodeType&&a.f.mc(b);return m(b,c,k(d),!0)};a.Ec=function(b,c,d){d=k(d);return a.Ja(b,e(c,d,b),d)};a.eb=function(a,b){1!==b.nodeType&&8!==b.nodeType||g(k(a),b,!0)};a.Sb=function(a,b){!u&&x.jQuery&&(u=x.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
b=b||x.document.body;h(k(a),b,!0)};a.kb=function(b){switch(b.nodeType){case 1:case 8:var c=a.vc(b);if(c)return c;if(b.parentNode)return a.kb(b.parentNode)}return n};a.Kc=function(b){return(b=a.kb(b))?b.$data:n};a.b("bindingHandlers",a.d);a.b("applyBindings",a.Sb);a.b("applyBindingsToDescendants",a.eb);a.b("applyBindingAccessorsToNode",a.Ja);a.b("applyBindingsToNode",a.Ec);a.b("contextFor",a.kb);a.b("dataFor",a.Kc)})();(function(b){function c(c,e){var m=f.hasOwnProperty(c)?f[c]:b,k;m?m.X(e):(m=f[c]=
new a.J,m.X(e),d(c,function(b,d){var e=!(!d||!d.synchronous);g[c]={definition:b,$c:e};delete f[c];k||e?m.notifySubscribers(b):a.Y.Wa(function(){m.notifySubscribers(b)})}),k=!0)}function d(a,b){e("getConfig",[a],function(c){c?e("loadComponent",[a,c],function(a){b(a,c)}):b(null,null)})}function e(c,d,f,k){k||(k=a.g.loaders.slice(0));var g=k.shift();if(g){var q=g[c];if(q){var p=!1;if(q.apply(g,d.concat(function(a){p?f(null):null!==a?f(a):e(c,d,f,k)}))!==b&&(p=!0,!g.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");
}else e(c,d,f,k)}else f(null)}var f={},g={};a.g={get:function(d,e){var f=g.hasOwnProperty(d)?g[d]:b;f?f.$c?a.l.w(function(){e(f.definition)}):a.Y.Wa(function(){e(f.definition)}):c(d,e)},Yb:function(a){delete g[a]},Kb:e};a.g.loaders=[];a.b("components",a.g);a.b("components.get",a.g.get);a.b("components.clearCachedDefinition",a.g.Yb)})();(function(){function b(b,c,d,e){function g(){0===--y&&e(h)}var h={},y=2,v=d.template;d=d.viewModel;v?f(c,v,function(c){a.g.Kb("loadTemplate",[b,c],function(a){h.template=
a;g()})}):g();d?f(c,d,function(c){a.g.Kb("loadViewModel",[b,c],function(a){h[l]=a;g()})}):g()}function c(a,b,d){if("function"===typeof b)d(function(a){return new b(a)});else if("function"===typeof b[l])d(b[l]);else if("instance"in b){var e=b.instance;d(function(){return e})}else"viewModel"in b?c(a,b.viewModel,d):a("Unknown viewModel value: "+b)}function d(b){switch(a.a.A(b)){case "script":return a.a.ma(b.text);case "textarea":return a.a.ma(b.value);case "template":if(e(b.content))return a.a.ua(b.content.childNodes)}return a.a.ua(b.childNodes)}
function e(a){return x.DocumentFragment?a instanceof DocumentFragment:a&&11===a.nodeType}function f(a,b,c){"string"===typeof b.require?O||x.require?(O||x.require)([b.require],c):a("Uses require, but no AMD loader is present"):c(b)}function g(a){return function(b){throw Error("Component '"+a+"': "+b);}}var h={};a.g.register=function(b,c){if(!c)throw Error("Invalid configuration for "+b);if(a.g.ub(b))throw Error("Component "+b+" is already registered");h[b]=c};a.g.ub=function(a){return h.hasOwnProperty(a)};
a.g.pd=function(b){delete h[b];a.g.Yb(b)};a.g.ac={getConfig:function(a,b){b(h.hasOwnProperty(a)?h[a]:null)},loadComponent:function(a,c,d){var e=g(a);f(e,c,function(c){b(a,e,c,d)})},loadTemplate:function(b,c,f){b=g(b);if("string"===typeof c)f(a.a.ma(c));else if(c instanceof Array)f(c);else if(e(c))f(a.a.V(c.childNodes));else if(c.element)if(c=c.element,x.HTMLElement?c instanceof HTMLElement:c&&c.tagName&&1===c.nodeType)f(d(c));else if("string"===typeof c){var l=s.getElementById(c);l?f(d(l)):b("Cannot find element with ID "+
c)}else b("Unknown element type: "+c);else b("Unknown template value: "+c)},loadViewModel:function(a,b,d){c(g(a),b,d)}};var l="createViewModel";a.b("components.register",a.g.register);a.b("components.isRegistered",a.g.ub);a.b("components.unregister",a.g.pd);a.b("components.defaultLoader",a.g.ac);a.g.loaders.push(a.g.ac);a.g.Cc=h})();(function(){function b(b,e){var f=b.getAttribute("params");if(f){var f=c.parseBindingsString(f,e,b,{valueAccessors:!0,bindingParams:!0}),f=a.a.Ca(f,function(c){return a.m(c,
null,{i:b})}),g=a.a.Ca(f,function(c){var e=c.t();return c.ba()?a.m({read:function(){return a.a.c(c())},write:a.Ba(e)&&function(a){c()(a)},i:b}):e});g.hasOwnProperty("$raw")||(g.$raw=f);return g}return{$raw:{}}}a.g.getComponentNameForNode=function(b){var c=a.a.A(b);if(a.g.ub(c)&&(-1!=c.indexOf("-")||"[object HTMLUnknownElement]"==""+b||8>=a.a.C&&b.tagName===c))return c};a.g.Pb=function(c,e,f,g){if(1===e.nodeType){var h=a.g.getComponentNameForNode(e);if(h){c=c||{};if(c.component)throw Error('Cannot use the "component" binding on a custom element matching a component');
var l={name:h,params:b(e,f)};c.component=g?function(){return l}:l}}return c};var c=new a.R;9>a.a.C&&(a.g.register=function(a){return function(b){s.createElement(b);return a.apply(this,arguments)}}(a.g.register),s.createDocumentFragment=function(b){return function(){var c=b(),f=a.g.Cc,g;for(g in f)f.hasOwnProperty(g)&&c.createElement(g);return c}}(s.createDocumentFragment))})();(function(b){function c(b,c,d){c=c.template;if(!c)throw Error("Component '"+b+"' has no template");b=a.a.ua(c);a.f.da(d,b)}
function d(a,b,c,d){var e=a.createViewModel;return e?e.call(a,d,{element:b,templateNodes:c}):d}var e=0;a.d.component={init:function(f,g,h,l,m){function k(){var a=r&&r.dispose;"function"===typeof a&&a.call(r);q=r=null}var r,q,p=a.a.V(a.f.childNodes(f));a.a.F.oa(f,k);a.m(function(){var l=a.a.c(g()),h,v;"string"===typeof l?h=l:(h=a.a.c(l.name),v=a.a.c(l.params));if(!h)throw Error("No component name specified");var n=q=++e;a.g.get(h,function(e){if(q===n){k();if(!e)throw Error("Unknown component '"+h+
"'");c(h,e,f);var l=d(e,f,p,v);e=m.createChildContext(l,b,function(a){a.$component=l;a.$componentTemplateNodes=p});r=l;a.eb(e,f)}})},null,{i:f});return{controlsDescendantBindings:!0}}};a.f.Z.component=!0})();var Q={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,c){var d=a.a.c(c())||{};a.a.D(d,function(c,d){d=a.a.c(d);var g=!1===d||null===d||d===n;g&&b.removeAttribute(c);8>=a.a.C&&c in Q?(c=Q[c],g?b.removeAttribute(c):b[c]=d):g||b.setAttribute(c,d.toString());"name"===c&&a.a.tc(b,
g?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,c,d){function e(){var e=b.checked,f=p?g():e;if(!a.va.Sa()&&(!l||e)){var h=a.l.w(c);if(k){var m=r?h.t():h;q!==f?(e&&(a.a.pa(m,f,!0),a.a.pa(m,q,!1)),q=f):a.a.pa(m,f,e);r&&a.Ba(h)&&h(m)}else a.h.Ea(h,d,"checked",f,!0)}}function f(){var d=a.a.c(c());b.checked=k?0<=a.a.o(d,g()):h?d:g()===d}var g=a.pc(function(){return d.has("checkedValue")?a.a.c(d.get("checkedValue")):d.has("value")?a.a.c(d.get("value")):b.value}),h=
"checkbox"==b.type,l="radio"==b.type;if(h||l){var m=c(),k=h&&a.a.c(m)instanceof Array,r=!(k&&m.push&&m.splice),q=k?g():n,p=l||k;l&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.m(e,null,{i:b});a.a.p(b,"click",e);a.m(f,null,{i:b});m=n}}};a.h.ea.checked=!0;a.d.checkedValue={update:function(b,c){b.value=a.a.c(c())}}})();a.d.css={update:function(b,c){var d=a.a.c(c());null!==d&&"object"==typeof d?a.a.D(d,function(c,d){d=a.a.c(d);a.a.bb(b,c,d)}):(d=a.a.$a(String(d||"")),a.a.bb(b,b.__ko__cssValue,
!1),b.__ko__cssValue=d,a.a.bb(b,d,!0))}};a.d.enable={update:function(b,c){var d=a.a.c(c());d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,c){a.d.enable.update(b,function(){return!a.a.c(c())})}};a.d.event={init:function(b,c,d,e,f){var g=c()||{};a.a.D(g,function(g){"string"==typeof g&&a.a.p(b,g,function(b){var m,k=c()[g];if(k){try{var r=a.a.V(arguments);e=f.$data;r.unshift(e);m=k.apply(e,r)}finally{!0!==m&&(b.preventDefault?b.preventDefault():
b.returnValue=!1)}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={kc:function(b){return function(){var c=b(),d=a.a.zb(c);if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.W.sb};a.a.c(c);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.W.sb}}},init:function(b,c){return a.d.template.init(b,
a.d.foreach.kc(c))},update:function(b,c,d,e,f){return a.d.template.update(b,a.d.foreach.kc(c),d,e,f)}};a.h.ta.foreach=!1;a.f.Z.foreach=!0;a.d.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var f=b.ownerDocument;if("activeElement"in f){var g;try{g=f.activeElement}catch(k){g=f.body}e=g===b}f=c();a.h.Ea(f,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),g=e.bind(null,!1);a.a.p(b,"focus",f);a.a.p(b,"focusin",f);a.a.p(b,"blur",g);a.a.p(b,
"focusout",g)},update:function(b,c){var d=!!a.a.c(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===d||(d?b.focus():b.blur(),!d&&b.__ko_hasfocusLastValue&&b.ownerDocument.body.focus(),a.l.w(a.a.Da,null,[b,d?"focusin":"focusout"]))}};a.h.ea.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.h.ea.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Cb(b,c())}};K("if");K("ifnot",!1,!0);K("with",!0,!1,function(a,c){return a.Zb(c)});var L={};a.d.options={init:function(b){if("select"!==
a.a.A(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.Ka(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function g(c,e){if(A&&k)a.j.ha(b,a.a.c(d.get("value")),!0);else if(p.length){var f=0<=a.a.o(p,a.j.u(e[0]));a.a.uc(e[0],f);A&&!f&&a.l.w(a.a.Da,null,[b,"change"])}}var h=b.multiple,l=0!=b.length&&
h?b.scrollTop:null,m=a.a.c(c()),k=d.get("valueAllowUnset")&&d.has("value"),r=d.get("optionsIncludeDestroyed");c={};var q,p=[];k||(h?p=a.a.fb(e(),a.j.u):0<=b.selectedIndex&&p.push(a.j.u(b.options[b.selectedIndex])));m&&("undefined"==typeof m.length&&(m=[m]),q=a.a.Ka(m,function(b){return r||b===n||null===b||!a.a.c(b._destroy)}),d.has("optionsCaption")&&(m=a.a.c(d.get("optionsCaption")),null!==m&&m!==n&&q.unshift(L)));var A=!1;c.beforeRemove=function(a){b.removeChild(a)};m=g;d.has("optionsAfterRender")&&
"function"==typeof d.get("optionsAfterRender")&&(m=function(b,c){g(0,c);a.l.w(d.get("optionsAfterRender"),null,[c[0],b!==L?b:n])});a.a.Bb(b,q,function(c,e,g){g.length&&(p=!k&&g[0].selected?[a.j.u(g[0])]:[],A=!0);e=b.ownerDocument.createElement("option");c===L?(a.a.Za(e,d.get("optionsCaption")),a.j.ha(e,n)):(g=f(c,d.get("optionsValue"),c),a.j.ha(e,a.a.c(g)),c=f(c,d.get("optionsText"),g),a.a.Za(e,c));return[e]},c,m);a.l.w(function(){k?a.j.ha(b,a.a.c(d.get("value")),!0):(h?p.length&&e().length<p.length:
p.length&&0<=b.selectedIndex?a.j.u(b.options[b.selectedIndex])!==p[0]:p.length||0<=b.selectedIndex)&&a.a.Da(b,"change")});a.a.Oc(b);l&&20<Math.abs(l-b.scrollTop)&&(b.scrollTop=l)}};a.d.options.xb=a.a.e.I();a.d.selectedOptions={after:["options","foreach"],init:function(b,c,d){a.a.p(b,"change",function(){var e=c(),f=[];a.a.q(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.j.u(b))});a.h.Ea(e,d,"selectedOptions",f)})},update:function(b,c){if("select"!=a.a.A(b))throw Error("values binding applies only to SELECT elements");
var d=a.a.c(c()),e=b.scrollTop;d&&"number"==typeof d.length&&a.a.q(b.getElementsByTagName("option"),function(b){var c=0<=a.a.o(d,a.j.u(b));b.selected!=c&&a.a.uc(b,c)});b.scrollTop=e}};a.h.ea.selectedOptions=!0;a.d.style={update:function(b,c){var d=a.a.c(c()||{});a.a.D(d,function(c,d){d=a.a.c(d);if(null===d||d===n||!1===d)d="";b.style[c]=d})}};a.d.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");a.a.p(b,"submit",function(a){var d,
e=c();try{d=e.call(f.$data,b)}finally{!0!==d&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Za(b,c())}};a.f.Z.text=!0;(function(){if(x&&x.navigator)var b=function(a){if(a)return parseFloat(a[1])},c=x.opera&&x.opera.version&&parseInt(x.opera.version()),d=x.navigator.userAgent,e=b(d.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),f=b(d.match(/Firefox\/([^ ]*)/));if(10>a.a.C)var g=a.a.e.I(),h=
a.a.e.I(),l=function(b){var c=this.activeElement;(c=c&&a.a.e.get(c,h))&&c(b)},m=function(b,c){var d=b.ownerDocument;a.a.e.get(d,g)||(a.a.e.set(d,g,!0),a.a.p(d,"selectionchange",l));a.a.e.set(b,h,c)};a.d.textInput={init:function(b,d,g){function l(c,d){a.a.p(b,c,d)}function h(){var c=a.a.c(d());if(null===c||c===n)c="";u!==n&&c===u?a.a.setTimeout(h,4):b.value!==c&&(s=c,b.value=c)}function y(){t||(u=b.value,t=a.a.setTimeout(v,4))}function v(){clearTimeout(t);u=t=n;var c=b.value;s!==c&&(s=c,a.h.Ea(d(),
g,"textInput",c))}var s=b.value,t,u,x=9==a.a.C?y:v;10>a.a.C?(l("propertychange",function(a){"value"===a.propertyName&&x(a)}),8==a.a.C&&(l("keyup",v),l("keydown",v)),8<=a.a.C&&(m(b,x),l("dragend",y))):(l("input",v),5>e&&"textarea"===a.a.A(b)?(l("keydown",y),l("paste",y),l("cut",y)):11>c?l("keydown",y):4>f&&(l("DOMAutoComplete",v),l("dragdrop",v),l("drop",v)));l("change",v);a.m(h,null,{i:b})}};a.h.ea.textInput=!0;a.d.textinput={preprocess:function(a,b,c){c("textInput",a)}}})();a.d.uniqueName={init:function(b,
c){if(c()){var d="ko_unique_"+ ++a.d.uniqueName.Jc;a.a.tc(b,d)}}};a.d.uniqueName.Jc=0;a.d.value={after:["options","foreach"],init:function(b,c,d){if("input"!=b.tagName.toLowerCase()||"checkbox"!=b.type&&"radio"!=b.type){var e=["change"],f=d.get("valueUpdate"),g=!1,h=null;f&&("string"==typeof f&&(f=[f]),a.a.ra(e,f),e=a.a.Ub(e));var l=function(){h=null;g=!1;var e=c(),f=a.j.u(b);a.h.Ea(e,d,"value",f)};!a.a.C||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||
-1!=a.a.o(e,"propertychange")||(a.a.p(b,"propertychange",function(){g=!0}),a.a.p(b,"focus",function(){g=!1}),a.a.p(b,"blur",function(){g&&l()}));a.a.q(e,function(c){var d=l;a.a.od(c,"after")&&(d=function(){h=a.j.u(b);a.a.setTimeout(l,0)},c=c.substring(5));a.a.p(b,c,d)});var m=function(){var e=a.a.c(c()),f=a.j.u(b);if(null!==h&&e===h)a.a.setTimeout(m,0);else if(e!==f)if("select"===a.a.A(b)){var g=d.get("valueAllowUnset"),f=function(){a.j.ha(b,e,g)};f();g||e===a.j.u(b)?a.a.setTimeout(f,0):a.l.w(a.a.Da,
null,[b,"change"])}else a.j.ha(b,e)};a.m(m,null,{i:b})}else a.Ja(b,{checkedValue:c})},update:function(){}};a.h.ea.value=!0;a.d.visible={update:function(b,c){var d=a.a.c(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(c,d,e,f,g){return a.d.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,g)}}})("click");a.O=function(){};a.O.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");
};a.O.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.O.prototype.makeTemplateSource=function(b,c){if("string"==typeof b){c=c||s;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.v.n(d)}if(1==b.nodeType||8==b.nodeType)return new a.v.qa(b);throw Error("Unknown template type: "+b);};a.O.prototype.renderTemplate=function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,
d,e)};a.O.prototype.isTemplateRewritten=function(a,c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.O.prototype.rewriteTemplate=function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.O);a.Gb=function(){function b(b,c,d,h){b=a.h.yb(b);for(var l=a.h.ta,m=0;m<b.length;m++){var k=b[m].key;if(l.hasOwnProperty(k)){var r=l[k];if("function"===typeof r){if(k=r(b[m].value))throw Error(k);}else if(!r)throw Error("This template engine does not support the '"+
k+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.h.Ua(b,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return h.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Pc:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.Gb.ed(b,
c)},d)},ed:function(a,f){return a.replace(c,function(a,c,d,e,k){return b(k,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e","#comment",f)})},Fc:function(b,c){return a.M.wb(function(d,h){var l=d.nextSibling;l&&l.nodeName.toLowerCase()===c&&a.Ja(l,b,h)})}}}();a.b("__tr_ambtns",a.Gb.Fc);(function(){a.v={};a.v.n=function(b){if(this.n=b){var c=a.a.A(b);this.ab="script"===c?1:"textarea"===c?2:"template"==c&&b.content&&11===b.content.nodeType?3:4}};a.v.n.prototype.text=function(){var b=1===
this.ab?"text":2===this.ab?"value":"innerHTML";if(0==arguments.length)return this.n[b];var c=arguments[0];"innerHTML"===b?a.a.Cb(this.n,c):this.n[b]=c};var b=a.a.e.I()+"_";a.v.n.prototype.data=function(c){if(1===arguments.length)return a.a.e.get(this.n,b+c);a.a.e.set(this.n,b+c,arguments[1])};var c=a.a.e.I();a.v.n.prototype.nodes=function(){var b=this.n;if(0==arguments.length)return(a.a.e.get(b,c)||{}).jb||(3===this.ab?b.content:4===this.ab?b:n);a.a.e.set(b,c,{jb:arguments[0]})};a.v.qa=function(a){this.n=
a};a.v.qa.prototype=new a.v.n;a.v.qa.prototype.text=function(){if(0==arguments.length){var b=a.a.e.get(this.n,c)||{};b.Hb===n&&b.jb&&(b.Hb=b.jb.innerHTML);return b.Hb}a.a.e.set(this.n,c,{Hb:arguments[0]})};a.b("templateSources",a.v);a.b("templateSources.domElement",a.v.n);a.b("templateSources.anonymousTemplate",a.v.qa)})();(function(){function b(b,c,d){var e;for(c=a.f.nextSibling(c);b&&(e=b)!==c;)b=a.f.nextSibling(e),d(e,b)}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],g=e.parentNode,h=
a.R.instance,n=h.preprocessNode;if(n){b(e,f,function(a,b){var c=a.previousSibling,d=n.call(h,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c))});c.length=0;if(!e)return;e===f?c.push(e):(c.push(e,f),a.a.za(c,g))}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.Sb(d,b)});b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.M.Ac(b,[d])});a.a.za(c,g)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,f,h,q){q=q||{};var p=(b&&d(b)||f||{}).ownerDocument,n=q.templateEngine||g;
a.Gb.Pc(f,n,p);f=n.renderTemplate(f,h,q,p);if("number"!=typeof f.length||0<f.length&&"number"!=typeof f[0].nodeType)throw Error("Template engine must return an array of DOM nodes");p=!1;switch(e){case "replaceChildren":a.f.da(b,f);p=!0;break;case "replaceNode":a.a.sc(b,f);p=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+e);}p&&(c(f,h),q.afterRender&&a.l.w(q.afterRender,null,[f,h.$data]));return f}function f(b,c,d){return a.H(b)?b():"function"===typeof b?b(c,d):b}
var g;a.Db=function(b){if(b!=n&&!(b instanceof a.O))throw Error("templateEngine must inherit from ko.templateEngine");g=b};a.Ab=function(b,c,k,h,q){k=k||{};if((k.templateEngine||g)==n)throw Error("Set a template engine before calling renderTemplate");q=q||"replaceChildren";if(h){var p=d(h);return a.B(function(){var g=c&&c instanceof a.Q?c:new a.Q(c,null,null,null,{exportDependencies:!0}),n=f(b,g.$data,g),g=e(h,q,n,g,k);"replaceNode"==q&&(h=g,p=d(h))},null,{wa:function(){return!p||!a.a.nb(p)},i:p&&
"replaceNode"==q?p.parentNode:p})}return a.M.wb(function(d){a.Ab(b,c,k,d,"replaceNode")})};a.ld=function(b,d,g,h,q){function p(a,b){c(b,t);g.afterRender&&g.afterRender(b,a);t=null}function s(a,c){t=q.createChildContext(a,g.as,function(a){a.$index=c});var d=f(b,a,t);return e(null,"ignoreTargetNode",d,t,g)}var t;return a.B(function(){var b=a.a.c(d)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.Ka(b,function(b){return g.includeDestroyed||b===n||null===b||!a.a.c(b._destroy)});a.l.w(a.a.Bb,null,[h,b,
s,g,p])},null,{i:h})};var h=a.a.e.I();a.d.template={init:function(b,c){var d=a.a.c(c());if("string"==typeof d||d.name)a.f.xa(b);else{if("nodes"in d){if(d=d.nodes||[],a.H(d))throw Error('The "nodes" option must be a plain, non-observable array.');}else d=a.f.childNodes(b);d=a.a.lc(d);(new a.v.qa(b)).nodes(d)}return{controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var g=c();c=a.a.c(g);d=!0;e=null;"string"==typeof c?c={}:(g=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in c&&(d=!a.a.c(c.ifnot)));
"foreach"in c?e=a.ld(g||b,d&&c.foreach||[],c,b,f):d?(f="data"in c?f.Zb(c.data,c.as):f,e=a.Ab(g||b,f,c,b)):a.f.xa(b);f=e;(c=a.a.e.get(b,h))&&"function"==typeof c.k&&c.k();a.a.e.set(b,h,f&&f.ba()?f:n)}};a.h.ta.template=function(b){b=a.h.yb(b);return 1==b.length&&b[0].unknown||a.h.bd(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.f.Z.template=!0})();a.b("setTemplateEngine",a.Db);a.b("renderTemplate",a.Ab);a.a.fc=function(a,c,d){if(a.length&&
c.length){var e,f,g,h,l;for(e=f=0;(!d||e<d)&&(h=a[f]);++f){for(g=0;l=c[g];++g)if(h.value===l.value){h.moved=l.index;l.moved=h.index;c.splice(g,1);e=g=0;break}e+=g}}};a.a.ib=function(){function b(b,d,e,f,g){var h=Math.min,l=Math.max,m=[],k,n=b.length,q,p=d.length,s=p-n||1,t=n+p+1,v,u,x;for(k=0;k<=n;k++)for(u=v,m.push(v=[]),x=h(p,k+s),q=l(0,k-1);q<=x;q++)v[q]=q?k?b[k-1]===d[q-1]?u[q-1]:h(u[q]||t,v[q-1]||t)+1:q+1:k+1;h=[];l=[];s=[];k=n;for(q=p;k||q;)p=m[k][q]-1,q&&p===m[k][q-1]?l.push(h[h.length]={status:e,
value:d[--q],index:q}):k&&p===m[k-1][q]?s.push(h[h.length]={status:f,value:b[--k],index:k}):(--q,--k,g.sparse||h.push({status:"retained",value:d[q]}));a.a.fc(s,l,!g.dontLimitMoves&&10*n);return h.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.ib);(function(){function b(b,c,d,h,l){var m=[],k=a.B(function(){var k=c(d,l,a.a.za(m,b))||[];0<
m.length&&(a.a.sc(m,k),h&&a.l.w(h,null,[d,k,l]));m.length=0;a.a.ra(m,k)},null,{i:b,wa:function(){return!a.a.Rb(m)}});return{ca:m,B:k.ba()?k:n}}var c=a.a.e.I(),d=a.a.e.I();a.a.Bb=function(e,f,g,h,l){function m(b,c){w=q[c];u!==c&&(D[b]=w);w.qb(u++);a.a.za(w.ca,e);t.push(w);z.push(w)}function k(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.q(c[d].ca,function(a){b(a,d,c[d].ja)})}f=f||[];h=h||{};var r=a.a.e.get(e,c)===n,q=a.a.e.get(e,c)||[],p=a.a.fb(q,function(a){return a.ja}),s=a.a.ib(p,f,h.dontLimitMoves),
t=[],v=0,u=0,x=[],z=[];f=[];for(var D=[],p=[],w,C=0,B,E;B=s[C];C++)switch(E=B.moved,B.status){case "deleted":E===n&&(w=q[v],w.B&&(w.B.k(),w.B=n),a.a.za(w.ca,e).length&&(h.beforeRemove&&(t.push(w),z.push(w),w.ja===d?w=null:f[C]=w),w&&x.push.apply(x,w.ca)));v++;break;case "retained":m(C,v++);break;case "added":E!==n?m(C,E):(w={ja:B.value,qb:a.N(u++)},t.push(w),z.push(w),r||(p[C]=w))}a.a.e.set(e,c,t);k(h.beforeMove,D);a.a.q(x,h.beforeRemove?a.$:a.removeNode);for(var C=0,r=a.f.firstChild(e),F;w=z[C];C++){w.ca||
a.a.extend(w,b(e,g,w.ja,l,w.qb));for(v=0;s=w.ca[v];r=s.nextSibling,F=s,v++)s!==r&&a.f.ic(e,s,F);!w.Xc&&l&&(l(w.ja,w.ca,w.qb),w.Xc=!0)}k(h.beforeRemove,f);for(C=0;C<f.length;++C)f[C]&&(f[C].ja=d);k(h.afterMove,D);k(h.afterAdd,p)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Bb);a.W=function(){this.allowTemplateRewriting=!1};a.W.prototype=new a.O;a.W.prototype.renderTemplateSource=function(b,c,d,e){if(c=(9>a.a.C?0:b.nodes)?b.nodes():null)return a.a.V(c.cloneNode(!0).childNodes);b=b.text();
return a.a.ma(b,e)};a.W.sb=new a.W;a.Db(a.W.sb);a.b("nativeTemplateEngine",a.W);(function(){a.vb=function(){var a=this.ad=function(){if(!u||!u.tmpl)return 0;try{if(0<=u.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,f,g){g=g||s;f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=u.template(null,"{{ko_with $item.koBindingContext}}"+
h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=u.extend({koBindingContext:e},f.templateOptions);e=u.tmpl(h,b,e);e.appendTo(g.createElement("div"));u.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){s.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(u.tmpl.tag.ko_code={open:"__.push($1 || '');"},u.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.vb.prototype=
new a.O;var b=new a.vb;0<b.ad&&a.Db(b);a.b("jqueryTmplTemplateEngine",a.vb)})()})})();})();

},{}],4:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../misc/util');
var resultBound = util.resultBound;
var addClass = util.addClass;
var privateDataSymbol = util.getSymbol('footwork');

var sequenceQueue = {};

fw.animationClass = {
  animateIn: 'animateIn'
};

/**
 * Clear (run all of) the animation sequence queues immediately.
 */
function clearSequenceQueue () {
  _.each(sequenceQueue, function (sequence, queueNamespace) {
    _.each(sequence, function (sequenceIteration) {
      sequenceIteration.addAnimationClass();
    });
    delete sequenceQueue[queueNamespace];
  });
}

/**
 * Run the specified queue if it is not already running.
 * This method takes a list of callbacks and runs each in sequence using the stored nextIteration as the next offset.
 *
 * @param {any} queue The queue to run
 * @param {any} runNextStepNow (used for recursion) this flag tells the method to run the next step in the queue
 */
function runAnimationSequenceQueue (queue, runNextStepNow) {
  if (_.isUndefined(queue.running) || queue.running === false || runNextStepNow) {
    var sequenceIteration = queue.shift();

    if (sequenceIteration) {
      sequenceIteration.addAnimationClass();

      if (sequenceIteration.nextIteration || queue.length) {
        queue.running = setTimeout(function () {
          runAnimationSequenceQueue(queue, true);
        }, sequenceIteration.nextIteration);
      } else {
        queue.running = false;
      }
    } else {
      queue.running = false;
    }
  }
}

/**
 * Add an element to be displayed into a queue. Either add to an existing one or insert into and return a new queue.
 * New queues are created based on the namespace of the viewModel and whether or not the viewModel is configured for/with a sequence property
 *
 * @param {any} element The element that needs the animation class added
 * @param {any} viewModel The viewModel that contains a sequence configuration option
 * @returns {object} queue The animation sequence queue
 */
function addToAndFetchQueue (element, viewModel) {
  var configParams = (viewModel[privateDataSymbol] || {}).configParams || {};
  var namespaceName = configParams.namespace;
  var animationSequenceQueue = sequenceQueue[namespaceName] = (sequenceQueue[namespaceName] || []);
  var newSequenceIteration = {
    addAnimationClass: function addBindingFromQueue () {
      addClass(element, fw.animationClass.animateIn);
    },
    nextIteration: configParams.sequence
  };

  fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
    clearTimeout(newSequenceIteration.running);
    _.remove(animationSequenceQueue, newSequenceIteration);
  });

  animationSequenceQueue.push(newSequenceIteration);

  return animationSequenceQueue;
}

module.exports = {
  clearSequenceQueue: clearSequenceQueue,
  runAnimationSequenceQueue: runAnimationSequenceQueue,
  addToAndFetchQueue: addToAndFetchQueue
};

},{"../misc/util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],5:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var bindingElement = require('../binding/binding-element');
var isEntity = require('../entities/entity-tools').isEntity;
var makeArray = require('../misc/util').makeArray;

// Override the original applyBindings method to provide viewModel/dataModel/router life-cycle events
var originalApplyBindings = fw.applyBindings;
fw.applyBindings = function (viewModelOrBindingContext, rootNode) {
  rootNode = rootNode || window.document.body;

  if (isEntity(viewModelOrBindingContext)) {
    originalApplyBindings(viewModelOrBindingContext, wrapWithLifeCycle(rootNode));
  } else {
    originalApplyBindings(viewModelOrBindingContext, rootNode);
  }
};

/**
 * Wrap the supplied rootNode with the lifecycle binding. This enables footwork to track when
 * the instance is bound to or removed from the dom, triggering its various lifecycle events.
 *
 * @param {string|[DOMNodes]} template
 * @returns {[DOMNodes]} The wrapped component
 */
function wrapWithLifeCycle (rootNode) {
  var wrapper = fw.utils.parseHtmlFragment(bindingElement.open.prefix + '$lifecycle' + bindingElement.open.postfix + bindingElement.close);

  wrapper = [].concat(wrapper[0], makeArray(rootNode.childNodes), wrapper[1]);
  _.each(wrapper, function (node) {
    rootNode.appendChild(node);
  });

  return rootNode;
}

},{"../binding/binding-element":6,"../entities/entity-tools":26,"../misc/util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],6:[function(require,module,exports){
var oldExploderVersion = 8;
var bindingElement = {
  oldExploderTagName: 'div',
  oldExploderClassName: 'fw-old-browser',
  open: {
    prefix: '<!-- ko ',
    postfix: ' -->'
  },
  close: '<!-- /ko -->'
};

/* istanbul ignore next */
(function checkForOldIE () {
  if (typeof navigator !== 'undefined') {
    var clientNavigator = navigator.userAgent.toLowerCase();
    var exploderVersion = (clientNavigator.indexOf('msie') != -1) ? parseInt(clientNavigator.split('msie')[1]) : (oldExploderVersion + 1);

    if (exploderVersion <= oldExploderVersion) {
      // client is using an older IE, we have to initialize the wrapper with a normal element (ie < 9 doesn't support virtual elements)
      bindingElement.open = {
        prefix: '<' + bindingElement.oldExploderTagName + ' class="' + bindingElement.oldExploderClassName + '" data-bind="',
        postfix: '">'
      };
      bindingElement.close = '</' + bindingElement.oldExploderTagName + '>';
    }
  }
})();

module.exports = bindingElement;

},{}],7:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var animationSequencing = require('./animation-sequencing');
var addToAndFetchQueue = animationSequencing.addToAndFetchQueue;
var runAnimationSequenceQueue = animationSequencing.runAnimationSequenceQueue;

var entityTools = require('../entities/entity-tools');
var nearestEntity = entityTools.nearestEntity;
var isEntity = entityTools.isEntity;

var routerConfig = require('../entities/router/router-config');
var outletLoadedDisplay = routerConfig.outletLoadedDisplay;
var outletLoadingDisplay = routerConfig.outletLoadingDisplay;

var util = require('../misc/util');
var hasClass = util.hasClass;
var isPromise = util.isPromise;
var promiseIsFulfilled = util.promiseIsFulfilled;

var privateDataSymbol = util.getSymbol('footwork');
var loadingTrackerSymbol = util.getSymbol('loadingTracker');

var makePromiseQueryable = require('../misc/ajax').makePromiseQueryable;

/**
 * The $lifecycle binding provides lifecycle events for components/viewModels/dataModels/routers
 */
fw.virtualElements.allowedBindings.$lifecycle = true;
fw.bindingHandlers.$lifecycle = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentNode;

    // if this is a router and its configured to do so, activate it now that its being bound
    if (fw.isRouter(viewModel) && viewModel[privateDataSymbol].configParams.activate) {
      viewModel.activated(true);
    }

    if (fw.isViewModel(viewModel)) {
      // provide the element for when onDispose is called
      viewModel[privateDataSymbol].element = element;

      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        viewModel.dispose();
      });
    }
  },
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentNode;

    // if this is the lifecycle update on an outlets display we need to run its callback
    if (hasClass(element, outletLoadedDisplay)) {
      var outletDisplay = bindingContext.$parent.display.peek();
      if (!hasClass(element, outletLoadingDisplay) && _.isFunction(outletDisplay.getOnCompleteCallback)) {
        var outletLoadingIsCompleted = outletDisplay.getOnCompleteCallback(element);
        outletLoadingIsCompleted();
      }
    }

    // trigger the user-specified afterRender callback
    if (isEntity(viewModel) && !viewModel[privateDataSymbol].afterRenderWasTriggered) {
      viewModel[privateDataSymbol].afterRenderWasTriggered = true;
      viewModel[privateDataSymbol].configParams.afterRender.call(viewModel, element);
    }

    // resolve the loadingTracker and trigger the addAnimationClass callback when appropriate
    resolveTrackerAndAnimate(element, viewModel, bindingContext, function addAnimationClass () {
      if (document.body.contains(element) && !hasClass(element, outletLoadingDisplay) && !hasClass(element, outletLoadedDisplay)) {
        var queue = addToAndFetchQueue(element, viewModel);
        var nearestOutlet = nearestEntity(bindingContext, fw.isOutlet);

        if (fw.animationClass.animateIn) {
          if (nearestOutlet) {
            // the parent outlet will run the callback that initiates the animation
            // sequence (once the rest of its dependencies finish loading as well)
            nearestOutlet.addResolvedCallbackOrExecute(function () {
              runAnimationSequenceQueue(queue);
            });
          } else {
            // no parent outlet found, lets go ahead and run the queue
            runAnimationSequenceQueue(queue);
          }
        }
      }
    });
  }
};

/**
 * Mark the element/tracker as resolved on the parent entity (if it exists) and supply the resolveInstanceNow callback to afterResolve which
 * takes the user supplied isResolved value and adds the animation class via addAnimationClass when it has resolved.
 *
 * @param {DOMElement} element
 * @param {object} viewModel
 * @param {object} $context
 * @param {function} addAnimationClass
 */
function resolveTrackerAndAnimate (element, viewModel, $context, addAnimationClass) {
  var loadingTracker = element[loadingTrackerSymbol];
  var loadingParentChildren;

  var parentEntity = nearestEntity($context.$parentContext);
  if (parentEntity) {
    loadingParentChildren = parentEntity[privateDataSymbol].loadingChildren;
  }

 function finishResolution () {
    addAnimationClass();
    if (fw.isObservable(loadingParentChildren) && _.isFunction(loadingParentChildren.remove)) {
      loadingParentChildren.remove(loadingTracker);
    }
  }

  if (isEntity(viewModel)) {
    function resolveInstanceNow (promisesToWaitFor) {
      if (_.isUndefined(promisesToWaitFor)) {
        finishResolution();
        return Promise.resolve();
      } else if (isPromise(promisesToWaitFor) || _.isArray(promisesToWaitFor) && _.every([].concat(promisesToWaitFor), isPromise)) {
        return new Promise(function (resolve) {
          var promises = _.map([].concat(promisesToWaitFor), makePromiseQueryable);
          _.each(promises, function waitForPromise (promise) {
            promise.then(function checkAllPromises () {
              if (_.every(promises, promiseIsFulfilled)) {
                resolve();
                finishResolution();
              }
            });
          });
        });
      } else {
        throw Error('Can only pass promises to resolve callback');
      }
    }

    function maybeResolve () {
      if (!viewModel[privateDataSymbol].wasResolved) {
        viewModel[privateDataSymbol].wasResolved = true;
        viewModel[privateDataSymbol].configParams.afterResolve.call(viewModel, resolveInstanceNow);
      }
    }

    /**
     * Have to delay child check for one tick to let its children begin binding.
     * By doing this they have a chance to add/register themselves to/with loadingChildren()
     * before we check its length and determine if we need to wait for any children to resolve.
     */
    setTimeout(function () {
      var loadingChildren = viewModel[privateDataSymbol].loadingChildren;

      // if there are no children then resolve now, otherwise subscribe and wait till its 0 (all children resolved)
      if (loadingChildren().length === 0) {
        maybeResolve();
      } else {
        viewModel.disposeWithInstance(loadingChildren.subscribe(function (loadingChildren) {
          loadingChildren.length === 0 && maybeResolve();
        }));
      }
    }, 0);
  } else {
    finishResolution();
  }
}

},{"../entities/entity-tools":26,"../entities/router/router-config":34,"../misc/ajax":41,"../misc/util":42,"./animation-sequencing":4,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],8:[function(require,module,exports){
/**
 * Registry which stores component information as it is loaded.
 * This information is used by footwork to bootstrap the component/entity.
 */
var currentlyLoading;

module.exports = {
  set: function (loadingTracker) {
    currentlyLoading = loadingTracker;
  },
  get: function () {
    return currentlyLoading;
  }
};

},{}],9:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');

// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function (targetElement) {
  targetElement = targetElement || window.document.body;
  fw.applyBindings({}, targetElement);
};

},{"knockout/build/output/knockout-latest":3}],10:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var isBroadcastableSymbol = require('../misc/util').getSymbol('isBroadcastable');

fw.isBroadcastable = function (thing) {
  return _.isObject(thing) && !!thing[isBroadcastableSymbol];
};

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcast = function (varName, instanceOrNamespaceName, isWritable) {
  var target = this;
  var namespace;
  var subscriptions = [];
  var isLocalNamespace = false;

  if (fw.isViewModel(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName.$namespace;
  } else if (fw.isNamespace(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName;
  } else if (_.isString(instanceOrNamespaceName)) {
    namespace = fw.namespace(instanceOrNamespaceName);
    isLocalNamespace = true;
  } else {
    throw Error('Invalid namespace provided for broadcastAs() observable.');
  }

  if (isWritable) {
    subscriptions.push(namespace.subscribe('__change.' + varName, function (newValue) {
      target(newValue);
    }));
  }

  target.broadcast = function () {
    namespace.publish(varName, target());
    return this;
  };

  subscriptions.push(namespace.subscribe('__refresh.' + varName, function () {
    namespace.publish(varName, target());
  }));
  subscriptions.push(target.subscribe(function (newValue) {
    namespace.publish(varName, newValue);
  }));

  var targetDispose = target.dispose || _.noop;
  target.dispose = function () {
    _.invokeMap(subscriptions, 'dispose');
    if (isLocalNamespace) {
      namespace.dispose();
    }

    targetDispose.call(target);
  };

  target[isBroadcastableSymbol] = true;
  return target.broadcast();
};

},{"../misc/util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],11:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var alwaysPassPredicate = require('../misc/util').alwaysPassPredicate;
var isReceivableSymbol = require('../misc/util').getSymbol('isReceivable');

fw.isReceivable = function (thing) {
  return _.isObject(thing) && !!thing[isReceivableSymbol];
};

// factory method which turns an observable into a receivable
fw.subscribable.fn.receive = function (variable, instanceOrNamespaceName) {
  var target = this;
  var subscriptions = [];
  var isLocalNamespace = false;
  var namespace;

  if (_.isString(instanceOrNamespaceName)) {
    namespace = fw.namespace(instanceOrNamespaceName);
    isLocalNamespace = true;
  } else if (fw.isNamespace(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName;
  } else {
    throw Error('Invalid namespace provided for receiveFrom() observable.');
  }

  var receivable = fw.computed({
    read: target,
    write: function (value) {
      namespace.publish('__change.' + variable, value);
    }
  });

  receivable.refresh = function () {
    namespace.publish('__refresh.' + variable);
    return this;
  };

  subscriptions.push(namespace.subscribe(variable, function (newValue) {
    target(newValue);
  }));

  var targetDispose = target.dispose || _.noop;
  var receivableDispose = receivable.dispose;
  receivable.dispose = function () {
    _.invokeMap(subscriptions, 'dispose');
    if (isLocalNamespace) {
      namespace.dispose();
    }

    receivableDispose.call(receivable);
    targetDispose.call(target);
  };

  receivable[isReceivableSymbol] = true;
  return receivable.refresh();
};

},{"../misc/util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],12:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var ajax = require('../misc/ajax');

var util = require('../misc/util');
var privateDataSymbol = util.getSymbol('footwork');
var isNode = util.isNode;
var isEvent = util.isEvent;

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * Note: object 'a' can provide a regex value for a property and have it searched matching on the regex value
 * @param  {object} a Object to compare (which can contain regex values for properties)
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function regExpIsEqual (a, b, isEq) {
  isEq = isEq || regExpIsEqual;

  if (_.isObject(a) && _.isObject(b)) {
    return _.every(_.reduce(a, function (comparison, paramValue, paramName) {
      var isCongruent = false;
      var bParamValue = b[paramName];
      if (bParamValue) {
        if (_.isRegExp(paramValue)) {
          isCongruent = !_.isNull(bParamValue.match(paramValue));
        } else {
          isCongruent = isEq(paramValue, bParamValue);
        }
      }

      comparison.push(isCongruent);
      return comparison;
    }, []));
  } else {
    return a === b;
  }
}

function collectionSync () {
  return fw.sync.apply(this, arguments);
}

/**
 * Convert the collection to its plain object form for toJSON support.
 *
 * @returns {array} The collection of data
 */
function toJSON () {
  return this();
}

/**
 * Get list of items that match modelData
 *
 * @param {object} modelData object to compare against
 * @param {function} comparator callback function used to compare the values
 * @returns {any} the found results (if any)
 */
function where (modelData, comparator) {
  return _.reduce(this(), function findModel (foundModels, model) {
    if (regExpIsEqual(modelData, model, comparator)) {
      foundModels.push(model);
    }
    return foundModels;
  }, []);
}

function fetchCollection (options) {
  var collection = this;
  var configParams = collection[privateDataSymbol].configParams;
  options = _.extend({ parse: true }, isNode(options) || fw.isCollection(options) || isEvent(options) ? {} : options);

  var requestInfo = {
    requestRunning: collection.isReading,
    requestLull: configParams.requestLull,
    entity: collection,
    createRequest: function () {
      var xhr = collection.sync('read', collection, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          var parsedData = configParams.parse(data);
          _.isArray(parsedData) && collection(parsedData);
        });

      return xhr;
    }
  };

  return ajax.makeOrGetRequest('fetch', requestInfo);
}

module.exports = {
  sync: collectionSync,
  toJSON: toJSON,
  fetch: fetchCollection,
  where: where
};

},{"../misc/ajax":41,"../misc/util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],13:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../misc/util').getSymbol('footwork');
var getSymbol = require('../misc/util').getSymbol;

fw.isCollection = function (thing) {
  return _.isObject(thing) && !!thing[getSymbol('isCollection')];
};

var defaultCollectionConfig = {
  url: null,
  parse: _.identity,
  fetchOptions: {}
};

var collectionCount = 0;
fw.collection = function createCollection (configParamsOrData) {
  var configParams = {};
  var collectionData = [];

  if (_.isArray(configParamsOrData)) {
    collectionData = configParamsOrData;
  } else if (_.isObject(configParamsOrData)) {
    configParams = configParamsOrData;
    collectionData = configParams.data || [];
  }

  configParams = _.extend({}, defaultCollectionConfig, configParams);

  var collection = fw.observableArray();

  _.extend(collection, require('./collection-methods'), {
    isReading: fw.observable(false)
  });

  collection[getSymbol('isCollection')] = true;
  collection[privateDataSymbol] = {
    configParams: configParams
  };

  collection.requestInProgress = fw.pureComputed(function () {
    return collection.isReading();
  });

  if (collectionData) {
    collection(collectionData);
  }

  return collection;
};

},{"../misc/util":42,"./collection-methods":12,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],14:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var setLoadingTracker = require('../binding/loading-tracker').set;
var nearestEntity = require('../entities/entity-tools').nearestEntity;
var getSymbol = require('../misc/util').getSymbol;
var entityDescriptors = require('../entities/entity-descriptors');
var privateDataSymbol = getSymbol('footwork');
var originalComponentBindingInit = fw.bindingHandlers.component.init;

/**
 * Monkey patch to bootstrap a component, tagging it with the loadingTracker.
 *
 * @param {any} element
 * @param {any} valueAccessor
 * @param {any} allBindings
 * @param {any} viewModel
 * @param {any} bindingContext
 * @returns
 */
function componentBindingInit (element, valueAccessor, allBindings, viewModel, bindingContext) {
  var tagName = (element.tagName || '').toLowerCase();
  var loadingTracker = element[getSymbol('loadingTracker')] = {
    tagName: tagName,
    moduleName: element.getAttribute('module') || element.getAttribute('data-module')
  };

  /**
   * If this is not an outlet we need to add ourselves to the parent loadingChildren observableArray.
   * Once this component is loaded the $lifecycle binding then removes the loadingTracker from the loadingChildren observableArray.
   * The loadingTracker observableArray is used to trigger when an instance and all its children are fully 'resolved' (bound and rendered).
   */
  if (tagName !== 'outlet') {
    var closestEntity = nearestEntity(bindingContext);
    if (closestEntity) {
      closestEntity[privateDataSymbol].loadingChildren.push(loadingTracker);

      // ensure that if the element is removed before its other resources are resolved that the loadingTracker is removed/cleared
      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        closestEntity[privateDataSymbol].loadingChildren.remove(loadingTracker);
      });
    }
  }

  if (entityDescriptors.getDescriptor(tagName)) {
    // save the tracker so that the (../entities/entity-loader) loader can find out what module was requested (the element is not available to it so we save it here for reference later)
    setLoadingTracker(loadingTracker);

    // ensure that the (../entities/entity-loader) getConfig callback is run every time a viewModel/dataModel/router/outlet declaration is encountered
    fw.components.clearCachedDefinition(tagName);
  }

  return originalComponentBindingInit(element, valueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = componentBindingInit;

},{"../binding/loading-tracker":8,"../entities/entity-descriptors":24,"../entities/entity-tools":26,"../misc/util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],15:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('../entities/entity-descriptors');
var bindingElement = require('../binding/binding-element');

var util = require('../misc/util');
var isDocumentFragment = util.isDocumentFragment;
var isDomElement = util.isDomElement;
var makeArray = util.makeArray;

/**
 * The component lifecycle loader wraps all non-viewModel/dataModel/router custom component
 * contents with the $lifecycle binding which enables the lifecycle hooks (afterBinding/afterRender/onDispose).
 */
fw.components.loaders.unshift(fw.components.componentLifecycleLoader = {
  loadTemplate: function (componentName, templateConfig, callback) {
    /**
     * This loader is only for non-viewModel/dataModel/router components.
     * viewModels/dataModels/routers have their own loader which handles them (../entities/entity-loader)
     */
    if (!entityDescriptors.getDescriptor(componentName)) {
      // This is a regular component (not an entity) we need to wrap it with the $lifecycle binding
      if (typeof templateConfig === 'string') {
        // Markup - parse it
        callback(wrapWithLifeCycle(templateConfig));
      } else if (templateConfig instanceof Array) {
        // Assume already an array of DOM nodes
        callback(wrapWithLifeCycle(templateConfig));
      } else if (isDocumentFragment(templateConfig)) {
        // Document fragment - use its child nodes
        callback(wrapWithLifeCycle(makeArray(templateConfig.childNodes)));
      } else if (templateConfig['element']) {
        var element = templateConfig['element'];
        if (isDomElement(element)) {
          // Element instance - copy its child nodes
          callback(wrapWithLifeCycle(cloneNodesFromTemplateSourceElement(element)));
        } else if (typeof element === 'string') {
          // Element ID - find it, then copy its child nodes
          var elemInstance = document.getElementById(element);
          if (elemInstance) {
            callback(wrapWithLifeCycle(cloneNodesFromTemplateSourceElement(elemInstance)));
          } else {
            errorCallback('Cannot find element with ID ' + element);
          }
        } else {
          errorCallback('Unknown element type: ' + element);
        }
      } else {
        throw Error('Unhandled config type: ' + typeof templateConfig + '.');
      }
    } else {
      // This is an entity, leave it to the entity lifecycle loader
      callback(null);
    }
  }
});

/**
 * Clone and return the supplied DOM nodes in the nodesArray
 *
 * @param {any} nodesArray
 * @returns {array} New array of DOM nodes
 */
function cloneNodes (nodesArray) {
  for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
    var clonedNode = nodesArray[i].cloneNode(true);
    newNodesArray.push(clonedNode);
  }
  return newNodesArray;
}

/**
 * Clone and return the nodes from the elemInstance.
 *
 * @param {DOMNode} elemInstance
 * @returns {[DOMNodes]} The cloned DOM nodes
 */
function cloneNodesFromTemplateSourceElement (elemInstance) {
  switch (elemInstance.tagName.toLowerCase()) {
    case 'script':
      return fw.utils.parseHtmlFragment(elemInstance.text);
    case 'textarea':
      return fw.utils.parseHtmlFragment(elemInstance.value);
    case 'template':
      /* istanbul ignore if */
      // For browsers with proper <template> element support (i.e., where the .content property
      // gives a document fragment), use that document fragment.
      if (isDocumentFragment(elemInstance.content)) {
        return cloneNodes(elemInstance.content.childNodes);
      }
  }

  // Regular elements such as <div>, and <template> elements on old browsers that don't really
  // understand <template> and just treat it as a regular container
  return cloneNodes(elemInstance.childNodes);
}

/**
 * Wrap the supplied template with the $lifecycle binding. This enables footwork to track when
 * the instance is bound to or removed from the dom, triggering its various lifecycle events.
 *
 * @param {string|[DOMNodes]} template
 * @returns {[DOMNodes]} The wrapped component
 */
function wrapWithLifeCycle (template) {
  var templateString = _.isString(template) ? template : '';
  var wrapper = fw.utils.parseHtmlFragment(bindingElement.open.prefix + '$lifecycle' + bindingElement.open.postfix + templateString + bindingElement.close);

  if (templateString.length) {
    return wrapper;
  }

  return [].concat(wrapper[0], template, wrapper[1]);
}

},{"../binding/binding-element":6,"../entities/entity-descriptors":24,"../misc/util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],16:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../misc/util');
var isPath = util.isPath;
var privateDataSymbol = util.getSymbol('footwork');

/**
 * The component resource loader tells footwork where to load the components assets from. It uses the supplied configuration to use AMD to download
 * them (the viewModel/template) if possible. After downloading these resources its template is then wrapped by the component lifecycle
 * loader and then bootstrapped.
 */
fw.components.loaders.push(fw.components.locationLoader = {
  getConfig: function (componentName, callback) {
    var configOptions = null;
    var componentLocation;

    if (_.isFunction(window.require) && (componentLocation = fw.components.getLocation(componentName))) {
      var folderOffset = componentLocation.folderOffset || '';

      if (folderOffset !== '') {
        folderOffset = componentName + '/';
      }

      if (_.isString(componentLocation.combined)) {
        // combined viewModel + component module
        var combinedPath = componentLocation.combined;

        if (isPath(combinedPath)) {
          combinedPath = combinedPath + folderOffset + fw.components.getFileName(componentName, 'combined');
        }

        configOptions = {
          require: window.require.toUrl(combinedPath)
        };
      } else {
        var viewModelConfig;

        if (!_.isString(componentLocation.viewModel)) {
          // template-only component, substitute with 'blank' viewModel
          viewModelConfig = _.noop;
        } else {
          // user has supplied the location of the viewModel, specify require config to download
          var viewModelPath = componentLocation.viewModel;

          if (isPath(viewModelPath)) {
            viewModelPath = viewModelPath + folderOffset + fw.components.getFileName(componentName, 'viewModel');
          }

          viewModelConfig = { require: window.require.toUrl(viewModelPath) };
        }

        var templatePath = componentLocation.template;
        if (isPath(templatePath)) {
          templatePath = templatePath + folderOffset + fw.components.getFileName(componentName, 'template');
        }

        templatePath = 'text!' + window.require.toUrl(templatePath);

        configOptions = {
          viewModel: viewModelConfig,
          template: { require: templatePath }
        };
      }
    }

    callback(configOptions);
  }
});

},{"../misc/util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],17:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var regExpMatch = /^\/|\/$/g;

require('./component-binding-init');

// Custom loader used to locate or load component resources (viewModel/template)
require('./component-resource-loader');

// Custom loader used to wrap components with the $lifecycle binding
require('./component-lifecycle-loader');

fw.components.registeredLocations = {};

fw.components.fileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

function forceViewModelComponentConvention (componentLocation) {
  if (_.isObject(componentLocation) && _.isUndefined(componentLocation.viewModel) && _.isUndefined(componentLocation.combined)) {
    return {
      viewModel: componentLocation.dataModel || componentLocation.router,
      template: componentLocation.template
    };
  }
  return componentLocation;
}

fw.components.getFileName = function (componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions;
  var fileExtension = '';

  if (_.isFunction(componentExtensions[fileType])) {
    fileExtension = componentExtensions[fileType](componentName);
  } else {
    fileExtension = componentExtensions[fileType] || '';
  }

  return componentName + '.' + (fileExtension.replace(/^\./, '') || '');
};

fw.components.registerLocation = function (componentName, componentLocation, folderOffset) {
  if (_.isArray(componentName)) {
    _.each(componentName, function (name) {
      fw.components.registerLocation(name, componentLocation, folderOffset);
    });
  }

  if (_.isString(componentLocation)) {
    componentLocation = {
      viewModel: componentLocation,
      template: componentLocation,
      folderOffset: folderOffset
    };
  } else if (_.isObject(componentLocation)) {
    componentLocation.folderOffset = folderOffset;
  }

  fw.components.registeredLocations[componentName] = _.extend({}, forceViewModelComponentConvention(componentLocation));
};

fw.components.getRegisteredLocation = function (componentName) {
  return _.reduce(fw.components.registeredLocations, function (registeredLocation, location, registeredComponentName) {
    if (!registeredLocation) {
      if (!_.isNull(registeredComponentName.match(regExpMatch)) && !_.isNull(componentName.match(registeredComponentName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if (componentName === registeredComponentName) {
        registeredLocation = location;
      }
    }
    return registeredLocation;
  }, undefined);
};

fw.components.locationIsRegistered = function (componentName) {
  return !!fw.components.getRegisteredLocation(componentName);
};

// Return the component resource definition for the supplied componentName
fw.components.getLocation = function (componentName) {
  if (_.isUndefined(componentName)) {
    return fw.components.registeredLocations;
  }
  return _.omitBy(fw.components.getRegisteredLocation(componentName), _.isNull);
};


var entityDescriptors = require('../entities/entity-descriptors');

fw.components.getComponentNameForNode = function (node) {
  var tagName = _.isString(node.tagName) && node.tagName.toLowerCase();

  if (fw.components.isRegistered(tagName)
     || fw.components.locationIsRegistered(tagName)
     || entityDescriptors.getDescriptor(tagName)) {
    return tagName;
  }

  return null;
};

},{"../entities/entity-descriptors":24,"./component-binding-init":14,"./component-lifecycle-loader":15,"./component-resource-loader":16,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],18:[function(require,module,exports){
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');

function insertValueIntoObject (rootObject, fieldMap, fieldValue) {
  if (_.isString(fieldMap)) {
    return insertValueIntoObject(rootObject, fieldMap.split('.'), fieldValue);
  }

  var propName = fieldMap.shift();
  if (fieldMap.length) {
    if (_.isUndefined(rootObject[propName])) {
      // nested property, lets add the container object
      rootObject[propName] = {};
    }
    // recurse into the next layer
    insertValueIntoObject(rootObject[propName], fieldMap, fieldValue);
  } else {
    rootObject[propName] = fieldValue;
  }

  return rootObject;
}

function getNestedReference (rootObject, fieldMap) {
  var propName = fieldMap;

  if (!_.isUndefined(fieldMap)) {
    if (_.isString(fieldMap)) {
      // initial call with string based fieldMap, recurse into main loop
      return getNestedReference(rootObject, fieldMap.split('.'));
    }

    propName = fieldMap.shift();
    if (fieldMap.length) {
      // recurse into the next layer
      return getNestedReference((rootObject || {})[propName], fieldMap);
    }
  }

  return !_.isString(propName) ? rootObject : _.result(rootObject || {}, propName);
}

function evalDirtyState (dataModel) {
  return _.reduce(dataModel[privateDataSymbol].mappings, function (dirty, mappedObservable, path) {
    return dirty || mappedObservable.isDirty();
  }, false);
}

module.exports = {
  insertValueIntoObject: insertValueIntoObject,
  getNestedReference: getNestedReference,
  evalDirtyState: evalDirtyState
};

},{"../../misc/util":42,"footwork-lodash":2}],19:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');
var evalDirtyState = require('./data-tools').evalDirtyState;

/**
 * Bootstrap an instance with dataModel capabilities (fetch/save/map/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function dataModelBootstrap (instance, configParams) {
  if (!instance) {
    throw Error('Must supply the instance to boot()');
  }

  var descriptor = entityDescriptors.getDescriptor('dataModel');

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, descriptor);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    var privateData = instance[privateDataSymbol];
    instance[descriptor.isEntityDuckTag] = true;

    _.extend(privateData, {
      idAttributeObservable: _.noop,
      mappings: {},
      configParams: _.extend(privateData.configParams, descriptor.resource.defaultConfig, configParams || {})
    });

    _.extend(instance, require('./dataModel-methods'), {
      isCreating: fw.observable(false),
      isReading: fw.observable(false),
      isUpdating: fw.observable(false),
      isDeleting: fw.observable(false),
      isNew: fw.observable(true),
      isDirty: fw.observable(false)
    });

    _.extend(instance, {
      isSaving: fw.computed(function computeRequestInProgress () {
        return instance.isCreating() || instance.isUpdating();
      }),
      requestInProgress: fw.computed(function computeRequestInProgress () {
        return instance.isCreating() || instance.isReading() || instance.isUpdating() || instance.isDeleting();
      })
    });

    instance.$removeMap = function (path) {
      if (privateData.mappings[path]) {
        privateData.mappings[path].dispose();
        delete privateData.mappings[path];
        instance.isDirty(evalDirtyState(instance));
      }
    };
  } else {
    throw Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = dataModelBootstrap;

},{"../../misc/util":42,"../entity-descriptors":24,"../viewModel/viewModel-bootstrap":38,"./data-tools":18,"./dataModel-methods":20,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],20:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var privateDataSymbol = util.getSymbol('footwork');
var isNode = util.isNode;
var isEvent = util.isEvent;

var ajax = require('../../misc/ajax');
var dataTools = require('./data-tools');
var insertValueIntoObject = dataTools.insertValueIntoObject;
var getNestedReference = dataTools.getNestedReference;
var evalDirtyState = dataTools.evalDirtyState;

/**
 * GET from server and set in model
 *
 * @param {object} options (optional) Options passed to sync()
 * @returns {object} Promise Promise for the HTTP Request
 */
function fetchModel (options) {
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;

  options = isNode(options) || fw.isDataModel(options) || isEvent(options) ? {} : options;

  var requestInfo = {
    requestRunning: dataModel.isReading,
    requestLull: configParams.requestLull,
    entity: dataModel,
    createRequest: function () {
      if (!dataModel.isNew()) {
        // retrieve data dataModel the from server using the id
        var xhr = dataModel.sync('read', dataModel, options);

        ajax.handleJsonResponse(xhr)
          .then(function handleResponseData (data) {
            dataModel.set(configParams.parse.call(dataModel, data, 'read'));
          });

        return xhr;
      } else {
        return Promise.reject("Must have ID provided to a dataModel in order to fetch its data");
      }
    }
  };

  return ajax.makeOrGetRequest('fetch', requestInfo);
}

/**
 * PUT / POST to server
 *
 * @param {object} options (optional) Options passed to sync()
 * @returns {object} Promise Promise for the HTTP Request
 */
function save (options) {
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;

  options = _.extend({
    writeResponse: true
  }, isNode(options) || fw.isDataModel(options) || isEvent(options) ? {} : options);

  var method = dataModel.isNew() ? 'create' : 'update';

  var requestInfo = {
    requestRunning: (method === 'create' ? dataModel.isCreating : dataModel.isUpdating),
    requestLull: configParams.requestLull,
    entity: dataModel,
    createRequest: function () {
      // retrieve data dataModel the from server using the id
      var xhr = dataModel.sync(method, dataModel, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          var parsedData = configParams.parse.call(dataModel, data, method);

          // if an object was returned lets attempt to write its values back to the dataModel
          if (options.writeResponse && _.isObject(parsedData)) {
            dataModel.set(parsedData);
          }

          // clear all dirty flags for mapped observables
          _.each(dataModel[privateDataSymbol].mappings, function (mappedObservable) {
            mappedObservable.isDirty(false);
          });
        });

      return xhr;
    }
  };

  return ajax.makeOrGetRequest('save', requestInfo);
}

/**
 * Delete/destroy the data on the server.
 *
 * @param {boolean} wait Flag telling footwork to wait for the request to finish before sending the destroy event
 * @returns {object} Promise for the HTTP Request
 */
function destroy (options) {
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;

  options = isNode(options) || fw.isDataModel(options) || isEvent(options) ? {} : options;

  var requestInfo = {
    requestRunning: dataModel.isDeleting,
    requestLull: configParams.requestLull,
    entity: dataModel,
    createRequest: function () {
      if (dataModel.isNew()) {
        return false;
      }

      var xhr = dataModel.sync('delete', dataModel, options);
      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData (data) {
          dataModel[privateDataSymbol].idAttributeObservable(undefined);
        });

      return xhr;
    }
  };

  return ajax.makeOrGetRequest('destroy', requestInfo);
}

/**
 * set attributes in model (clears isDirty on observables/fields it saves to by default)
 *
 * @param {object} attributes The attributes you want to set (only mapped values will be written)
 * @param {object} clearDirty flag indicating whether or not to clear the isDirty flag on any set observables
 * @returns {object} The dataModel instance for chaining
 */
function set (attributes, clearDirty) {
  var dataModel = this;
  var configParams = dataModel[privateDataSymbol].configParams;

  clearDirty = clearDirty || arguments.length === 1;

  var mappingsChanged = false;
  _.each(this[privateDataSymbol].mappings, function (fieldObservable, fieldMap) {
    var fieldValue = getNestedReference(attributes, fieldMap);
    if (!_.isUndefined(fieldValue)) {
      fw.isWriteableObservable(fieldObservable) && fieldObservable(fieldValue);
      mappingsChanged = true;
      clearDirty && fieldObservable.isDirty(false);
    }
  });

  if (mappingsChanged && clearDirty) {
    dataModel.isDirty(evalDirtyState(dataModel));
  }

  return this;
}

/**
 * Convert the dataModel values into its corresponding POJO and return the result.
 *
 * @param {string} referenceField (optional) if included it will only get the referenceField (mapped)
 * @param {boolean} includeRoot (optional) if true it will include the root object in the result
 * @returns {object} The POJO representation of the dataModel
 */
function get (referenceField, includeRoot) {
  var dataModel = this;
  if (_.isArray(referenceField)) {
    return _.reduce(referenceField, function (jsObject, fieldMap) {
      return _.merge(jsObject, dataModel.get(fieldMap, true));
    }, {});
  } else if (!_.isUndefined(referenceField) && !_.isString(referenceField)) {
    throw Error(dataModel.$namespace.getName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.get().');
  }

  var mappedObject = _.reduce(this[privateDataSymbol].mappings, function reduceModelToObject (jsObject, fieldObservable, fieldMap) {
    if (_.isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
      insertValueIntoObject(jsObject, fieldMap, fieldObservable());
    }
    return jsObject;
  }, {});

  return includeRoot ? mappedObject : getNestedReference(mappedObject, referenceField);
}

/**
 * Convert the dataModel into a serialized JSON string
 *
 * @returns {string} The stringified result of the data
 */
function toJSON () {
  return this.get();
}

/**
 * Clear the dataModel of any dirty flags (if field is specified it will only clear that mapped field)
 *
 * @param {string} field (optional) If supplied the method will only clear the specified field
 */
function clean (field) {
  if (!_.isUndefined(field)) {
    var fieldMatch = new RegExp('^' + field + '$|^' + field + '\..*');
  }
  _.each(this[privateDataSymbol].mappings, function (fieldObservable, fieldMap) {
    if (_.isUndefined(field) || fieldMap.match(fieldMatch)) {
      fieldObservable.isDirty(false);
    }
  });

  return this;
}

/**
 * Locally overridable proxy method for main sync() call
 *
 * @returns Promise The sync request promise
 */
function dataModelSync () {
  return fw.sync.apply(this, arguments);
}

/**
 * Determines whether or not the passed in field has been mapped on the dataModel
 *
 * @param {string} referenceField The path/mapped field you wish to check for
 * @returns {boolean} true if the field has been mapped, false if not
 */
function hasMappedField (referenceField) {
  return !!this[privateDataSymbol].mappings[referenceField];
}

/**
 * Returns all of the mapped fields which are dirty.
 *
 * @returns {array} The list of dirty field mappings
 */
function dirtyMap () {
  return _.reduce(this[privateDataSymbol].mappings, function (map, mappedObservable, path) {
    map[path] = mappedObservable.isDirty();
    return map;
  }, {});
}

module.exports = {
  fetch: fetchModel,
  save: save,
  destroy: destroy,
  set: set,
  get: get,
  toJSON: toJSON,
  clean: clean,
  sync: dataModelSync,
  hasMappedField: hasMappedField,
  dirtyMap: dirtyMap
};



},{"../../misc/ajax":41,"../../misc/util":42,"./data-tools":18,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],21:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

var entityName = 'dataModel';

fw[entityName] = {
  boot: require('./dataModel-bootstrap'),
  fileExtensions: '.js',
  defaultConfig: {
    idAttribute: 'id',
    url: null,
    parse: _.identity,
    fetchOptions: {},
    requestLull: 0
  }
};

var descriptor = {
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: getSymbol('is' + capitalizeFirstLetter(entityName)),
  isEntity: function (thing) {
    return _.isObject(thing) && thing[descriptor.isEntityDuckTag];
  },
  registeredLocations: {},
  registered: {},
  referenceNamespace: getSymbol(entityName)
};

require('./map');
require('../resource-tools')(descriptor);
require('../entity-descriptors').push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

},{"../../misc/util":42,"../entity-descriptors":24,"../resource-tools":31,"./dataModel-bootstrap":19,"./map":22,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],22:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var evalDirtyState = require('./data-tools').evalDirtyState;

function idAttributePath (dataModel) {
  return dataModel[privateDataSymbol].configParams.idAttribute;
}

/**
 * Take the desired mapPath and wire it into the dataModel. This enables footwork to hook into
 * your observables and map their values back to its POJO form and for communication with the server.
 *
 * @param {string} mapPath The path you wish to map
 * @param {object} dataModel The dataModel instance you are mapping the observable/path to
 * @returns {observable} The mapped observable
 */
function map (mapPath, dataModel) {
  var mappedObservable = this;

  if (!fw.isDataModel(dataModel)) {
    throw Error('No dataModel context supplied for map observable');
  }

  if (mapPath === idAttributePath(dataModel)) {
    dataModel[privateDataSymbol].idAttributeObservable = mappedObservable;
    dataModel.isNew(!mappedObservable());

    // dispose of the old primary key subscription and create subscription to new primary key observable
    dataModel[privateDataSymbol].idAttributeSubscription && dataModel[privateDataSymbol].idAttributeSubscription.dispose();
    dataModel[privateDataSymbol].idAttributeSubscription = mappedObservable.subscribe(function determineIfModelIsNew (idAttributeValue) {
      dataModel.isNew(!idAttributeValue);
    });
  }

  mappedObservable.isDirty = fw.observable(false);
  var changeSubscription = mappedObservable.subscribe(function (value) {
    dataModel.$namespace.publish('_.change', { param: mapPath, value: value });
    mappedObservable.isDirty(true);
  });
  var isDirtySubscription = mappedObservable.isDirty.subscribe(function (isDirty) {
    dataModel.isDirty(evalDirtyState(dataModel));
  });

  var disposeObservable = mappedObservable.dispose || _.noop;
  mappedObservable.dispose = function () {
    dataModel[privateDataSymbol].idAttributeSubscription && dataModel[privateDataSymbol].idAttributeSubscription.dispose();
    changeSubscription.dispose();
    isDirtySubscription.dispose();
    disposeObservable.call(mappedObservable);
  };

  dataModel[privateDataSymbol].mappings[mapPath] = mappedObservable;

  return mappedObservable;
}

fw.subscribable.fn.map = map;

},{"../../misc/util":42,"./data-tools":18,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],23:[function(require,module,exports){
/**
 * This loader wraps the elements with the $lifecycle as well as sources the viewModel/router/dataModel
 */
require('./entity-loader');

/**
 * These are the 'entities' (footwork-ized view models with lifecycle/etc hooks) that are bootstrapped by the above entity-loader
 */
require('./viewModel/viewModel');
require('./dataModel/dataModel');
require('./router/router');
require('./outlet/outlet');

},{"./dataModel/dataModel":21,"./entity-loader":25,"./outlet/outlet":30,"./router/router":37,"./viewModel/viewModel":40}],24:[function(require,module,exports){
var _ = require('footwork-lodash');

module.exports = _.extend([
  /* filled in by viewModel/dataModel/router/outlet modules */
], {
  getDescriptor: function getDescriptor (tagName) {
    tagName = tagName.toLowerCase();
    return _.reduce(this, function reduceDescriptor (foundDescriptor, descriptor) {
      return descriptor.entityName.toLowerCase() === tagName ? descriptor : foundDescriptor;
    }, null);
  }
});

},{"footwork-lodash":2}],25:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var isPath = require('../misc/util').isPath;
var bindingElement = require('../binding/binding-element');
var getLoadingTracker = require('../binding/loading-tracker').get;

/**
 * This component loader has two functions:
 * 1. wraps viewModel/dataModel/router declarative element contents with the $lifecycle binding which enables the lifecycle hooks (afterBinding/afterRender/onDispose).
 * 2. provides either the entity constructor itself or the require path to get the entity
 */
fw.components.loaders.unshift(fw.components.entityLoader = {
  getConfig: function (componentName, callback) {
    var descriptor;

    /**
     * This loader is for all entity-descriptors that are not outlets.
     * Outlets are loaded/bootstrapped by the 'router/outlet/outlet-loader'.
     */
    if (componentName !== 'outlet' && (descriptor = require('./entity-descriptors').getDescriptor(componentName))) {
      // this component is a viewModel/dataModel/router entity
      var moduleName = getLoadingTracker().moduleName;
      var viewModelOrLocation = descriptor.resource.getResourceOrLocation(moduleName);

      if (_.isString(viewModelOrLocation)) {
        // assume string is a location/path, append the filename to it and set it as a require dependency
        if (isPath(viewModelOrLocation)) {
          viewModelOrLocation = viewModelOrLocation + descriptor.resource.getFileName(moduleName);
        }

        viewModelOrLocation = {
          require: window.require.toUrl(viewModelOrLocation)
        };
      }

      /* istanbul ignore if */
      if (_.isUndefined(viewModelOrLocation)) {
        throw Error('The \'' + moduleName + '\' ' + descriptor.entityName + ' module must be registered before it can be used.');
      }

      callback({
        viewModel: viewModelOrLocation,
        template: bindingElement.open.prefix + '$lifecycle, template: { nodes: $componentTemplateNodes, data: $data }' + bindingElement.open.postfix + bindingElement.close
      });
    } else {
      callback(null);
    }
  }
});

},{"../binding/binding-element":6,"../binding/loading-tracker":8,"../misc/util":42,"./entity-descriptors":24,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],26:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('./entity-descriptors');
var capitalizeFirstLetter = require('../misc/util').capitalizeFirstLetter;

/**
 * Determines whether or not the passed in instance is an 'entity' (a viewModel/dataModel/router/outlet view model instance)
 *
 * @param {any} thing
 * @returns {boolean} true if the instance is an entity, false if not
 */
function isEntity (thing) {
  return _.reduce(_.map(entityDescriptors, 'isEntity'), function (isThing, comparator) {
    return isThing || comparator(thing);
  }, false);
};

/**
 * Determine whether or not theThing passes one of the callback predicate functions listed in predicates
 *
 * @param {any} theThing The thing to check for
 * @param {[function]} predicates Array of callback predicate functions used to determine whether or not theThing passes validation
 * @returns {boolean} true if theThing passes one of the listed predicate functions
 */
function isTheThing (theThing, predicates) {
  return _.reduce(predicates, function (isThing, predicate) {
    return isThing || predicate(theThing);
  }, false);
}

/**
 * Returns reference to the nearest parent 'entity' (viewModel/dataModel/router/outlet view model instance) to the knockout $context.
 * You can optionally pass in a predicate function which adds in an extra validation check for the instance
 *
 * @param {any} $context the knockout context to start searching from
 * @param {any} predicate (optional) callback which is passed the instance and return value is computed into the final result
 * @returns {any} the nearest parent instance or null if none was found
 */
function nearestEntity ($context, predicate) {
  predicate = predicate || isEntity;

  var predicates = [].concat(predicate);
  var foundEntity = null;

  if (_.isObject($context)) {
    if (isTheThing($context.$data, predicates)) {
      // found $data that matches the predicate(s) in this context
      foundEntity = $context.$data;
    } else if (_.isObject($context.$parentContext)) {
      // search through next parent up the chain
      foundEntity = nearestEntity($context.$parentContext, predicate);
    }
  }
  return foundEntity;
}

module.exports = {
  isEntity: isEntity,
  nearestEntity: nearestEntity
};

},{"../misc/util":42,"./entity-descriptors":24,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],27:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var nearestParentRouter = require('../router/router-tools').nearestParentRouter;

/**
 * This custom binding binds/registers the outlet on the router
 */
fw.virtualElements.allowedBindings.$outlet = true;
fw.bindingHandlers.$outlet = {
  init: function (element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var parentRouter = nearestParentRouter(bindingContext);

    /* istanbul ignore else */
    if (fw.isRouter(parentRouter)) {
      outletViewModel.originalDisplay = outletViewModel.$namespace.getName();
      fw.components.register(outletViewModel.originalDisplay, {
        template: valueAccessor()
      });

      element = element.parentNode;
      var outletName = element.getAttribute('name') || /* istanbul ignore next */ element.getAttribute('data-name');

      // register the outlet with its parent router so it can manipulate it
      parentRouter[privateDataSymbol].registerOutlet(outletName, outletViewModel);
      fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
        fw.components.unregister(outletViewModel.originalDisplay);
        parentRouter[privateDataSymbol].unregisterOutlet(outletName);
      });

      // attach the observable from the parentRouter that contains the component binding definition to display for this outlet
      outletViewModel.display = parentRouter.outlet(outletName);
    } else {
      throw Error('Outlet \"' + outletName + '\" declared but no parent router was found.');
    }
  }
};

},{"../../misc/util":42,"../router/router-tools":36,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],28:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

var util = require('../../misc/util');
var nextFrame = util.nextFrame;
var privateDataSymbol = util.getSymbol('footwork');

var routerConfig = require('../router/router-config');
var noComponentSelected = routerConfig.noComponentSelected;

var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };

function addAnimation () {
  var addAnimation = {};
  addAnimation[fw.animationClass.animateIn] = true;
  return addAnimation;
}

function removeAnimation () {
  var removeAnimation = {};
  removeAnimation[fw.animationClass.animateIn] = false;
  return removeAnimation;
}

/**
 * Bootstrap an instance with outlet capabilities.
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function outletBootstrap (instance, configParams) {
  var descriptor = entityDescriptors.getDescriptor('outlet');

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, descriptor);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true; // mark as hasBeenBootstrapped

    var resolvedCallbacks = [];
    _.extend(instance, {
      loading: fw.observable(noComponentSelected),
      routeIsLoading: fw.observable(true),
      routeIsResolving: fw.observable(true),
      addResolvedCallbackOrExecute: function (callback) {
        /* istanbul ignore else */
        if (instance.routeIsResolving()) {
          resolvedCallbacks.push(callback);
        } else {
          callback();
        }
      }
    });

    function showLoader () {
      var removeAnim = removeAnimation();

      instance.loadingClass(removeAnim);
      instance.loadedClass(removeAnim);
      instance.loadedStyle(hiddenCSS);
      instance.loadingStyle(visibleCSS);

      nextFrame(function () {
        instance.loadingClass(addAnimation());
      });
    }

    function showLoadedAfterMinimumTransition () {
      instance.loadingClass(removeAnimation());
      instance.loadedStyle(visibleCSS);
      instance.loadingStyle(hiddenCSS);
      instance.loadedClass(addAnimation());

      if (resolvedCallbacks.length) {
        _.each(resolvedCallbacks, function (callback) {
          callback();
        });
        resolvedCallbacks = [];
      }
    }

    var transitionTriggerTimeout;
    function showLoaded () {
      clearTimeout(transitionTriggerTimeout);
      var transition = instance.display.peek().transition;
      if (transition) {
        transitionTriggerTimeout = setTimeout(showLoadedAfterMinimumTransition, transition);
      } else {
        showLoadedAfterMinimumTransition();
      }
    }

    _.extend(instance, {
      loadingStyle: fw.observable(),
      loadedStyle: fw.observable(),
      loadingClass: fw.observable(),
      loadedClass: fw.observable(),
      showLoader: showLoader,
      showLoaded: showLoaded
    });

    instance.transitionTrigger = fw.computed(function () {
      var routeIsResolving = instance.routeIsResolving();
      if (routeIsResolving) {
        showLoader();
      } else {
        showLoaded();
      }
    });

    instance.disposeWithInstance(instance.routeIsLoading.subscribe(function disposeWithInstanceCallback (routeIsLoading) {
      if (routeIsLoading) {
        instance.routeIsResolving(true);
      } else {
        /* istanbul ignore next */
        if (instance.loadingChildrenWatch && _.isFunction(instance.loadingChildrenWatch.dispose)) {
          instance.loadingChildrenWatch.dispose();
        }

        // must allow binding to begin on any subcomponents/etc
        nextFrame(function () {
          if (instance[privateDataSymbol].loadingChildren().length) {
            /* istanbul ignore next */
            instance.loadingChildrenWatch = instance[privateDataSymbol].loadingChildren.subscribe(function (loadingChildren) {
              if (!loadingChildren.length) {
                instance.routeIsResolving(false);
                _.isFunction(instance.routeOnComplete) && instance.routeOnComplete();
              }
            });
          } else {
            instance.routeIsResolving(false);
            _.isFunction(instance.routeOnComplete) && instance.routeOnComplete();
          }
        });
      }
    }));
  }

  return instance;
}

module.exports = outletBootstrap;

},{"../../misc/util":42,"../entity-descriptors":24,"../router/router-config":34,"../viewModel/viewModel-bootstrap":38,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],29:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var bindingElement = require('../../binding/binding-element');
var routerConfig = require('../router/router-config');
var outletBootstrap = require('./outlet-bootstrap');

var outletCount = 0;

/**
 * The outlet loader has two functions:
 * 1. provides the outlet viewModel constructor to bind against and control an outlets display
 * 2. provides the outlet template bound against the viewModel which is used to control display/output of its area via the component: display binding
 */
fw.components.loaders.unshift(fw.components.outletLoader = {
  getConfig: function (componentName, callback) {
    if (componentName === 'outlet') {
      callback({
        viewModel: function Outlet () {
          outletBootstrap(this, {
            namespace: '$outlet' + outletCount++
          });
        },
        template: bindingElement.open.prefix + '$lifecycle, $outlet: $componentTemplateNodes' + bindingElement.open.postfix +
          '<div class="' + routerConfig.outletLoadingDisplay + '" ' +
            'data-bind="style: loadingStyle, css: loadingClass, component: loading"></div>' +
          '<div class="' + routerConfig.outletLoadedDisplay + '" ' +
            'data-bind="style: loadedStyle, css: loadedClass, component: display"></div>' +
        bindingElement.close,
        synchronous: true
      });
    } else {
      callback(null);
    }
  }
});

},{"../../binding/binding-element":6,"../router/router-config":34,"./outlet-bootstrap":28,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],30:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

require('./outlet-loader');
require('./outlet-binding');

var entityName = 'outlet';

var descriptor = {
  entityName: entityName,
  resource: fw[entityName] = {},
  isEntityDuckTag: getSymbol('is' + capitalizeFirstLetter(entityName)),
  isEntity: function (thing) {
    return _.isObject(thing) && thing[descriptor.isEntityDuckTag];
  },
  referenceNamespace: getSymbol(entityName)
};

require('../resource-tools')(descriptor, ['get']);
require('../entity-descriptors').push(descriptor);

fw.components.register(require('../router/router-config').noComponentSelected, {
  template: ' ',
  synchronus: true
});

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;


},{"../../misc/util":42,"../entity-descriptors":24,"../resource-tools":31,"../router/router-config":34,"./outlet-binding":27,"./outlet-loader":29,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],31:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var regExpMatch = /^\/|\/$/g;

/**
 * Determines whether or not the supplied resourceName has been registered on the entity descriptor.
 *
 * @param {object} descriptor The entity descriptor
 * @param {string} resourceName The name of the resource to look for
 * @returns {boolean} True if the resource is registered
 */
function isRegistered (descriptor, resourceName) {
  return !_.isUndefined(descriptor.registered[resourceName]);
}

/**
 * Return the resource registered on the descriptor using the specified resourceName.
 *
 * @param {object} descriptor The entity descriptor
 * @param {string} resourceName The name of the resource to look for
 * @returns {object} The descriptor or undefined if not found
 */
function getRegistered (descriptor, resourceName) {
  return descriptor.registered[resourceName];
}

/**
 * Register a resource using a given resourceName on a descriptor.
 *
 * @param {object} descriptor The entity descriptor
 * @param {string} resourceName The name of the resource to register with
 * @param {any} resource The item to register
 */
function register (descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
}

function getFileName (descriptor, modelName) {
  return modelName + '.' + descriptor.resource.fileExtensions.replace(/^\./, '') || '';
}

function registerLocation (descriptor, modelName, location) {
  if (_.isArray(modelName)) {
    _.each(modelName, function (name) {
      registerLocation(descriptor, name, location);
    });
  }
  descriptor.registeredLocations[ modelName ] = location;
}

function getLocation (descriptor, modelName) {
  return _.reduce(descriptor.registeredLocations, function (registeredLocation, location, registeredName) {
    if (!registeredLocation) {
      if (!_.isNull(registeredName.match(regExpMatch)) && !_.isNull(modelName.match(registeredName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if (modelName === registeredName) {
        registeredLocation = location;
      }
    }
    return registeredLocation;
  }, undefined);
}

function getModelReferences (descriptor, namespaceName) {
  var references = _.reduce(fw.namespace(descriptor.referenceNamespace).request('ref', namespaceName, true), function (models, model) {
    if (!_.isUndefined(model)) {
      var namespaceName = fw.isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if (!_.isNull(namespaceName)) {
        if (_.isUndefined(models[namespaceName])) {
          models[namespaceName] = model;
        } else {
          if (!_.isArray(models[namespaceName])) {
            models[namespaceName] = [models[namespaceName]];
          }
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});

  if (_.isString(namespaceName)) {
    return references[namespaceName];
  }
  return references;
}


function getResourceOrLocation (descriptor, moduleName) {
  var resource = descriptor.resource;
  var resourceOrLocation = null;

  if (resource.isRegistered(moduleName)) {
    // viewModel was manually registered
    resourceOrLocation = resource.getRegistered(moduleName);
  } else {
    resourceOrLocation = resource.getLocation(moduleName);
  }

  return resourceOrLocation;
}


/**
 * Hydrates a entity descriptors resource with the necessary utility methods.
 *
 * @param {object} descriptor (as defined in each entity and extended onto the entity-descriptors)
 * @returns
 */
function resourceTools (descriptor, included) {
  var methods = {
    getFileName: _.partial(getFileName, descriptor),
    register: _.partial(register, descriptor),
    isRegistered: _.partial(isRegistered, descriptor),
    getRegistered: _.partial(getRegistered, descriptor),
    registerLocation: _.partial(registerLocation, descriptor),
    getLocation: _.partial(getLocation, descriptor),
    getResourceOrLocation: _.partial(getResourceOrLocation, descriptor),
    get: _.partial(getModelReferences, descriptor)
  };

  _.extend(descriptor.resource, included ? _.pick(methods, included) : methods);

  return descriptor;
}

module.exports = resourceTools;

},{"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],32:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var resultBound  = util.resultBound;
var removeClass = util.removeClass;
var addClass = util.addClass;
var privateDataSymbol = util.getSymbol('footwork');

var routerTools = require('./router-tools');
var nearestParentRouter = routerTools.nearestParentRouter;
var stripQueryStringAndFragment = routerTools.stripQueryStringAndFragment;
var startingHashRegex = /^#/;

fw.bindingHandlers.route = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    var router = nearestParentRouter(bindingContext);
    var routeParams = valueAccessor();
    var elementIsSetup = false;
    var stateTracker = null;
    var hashOnly = null;

    var routeHandlerDescription = {
      on: 'click',
      state: function defaultStateForRoute () { return element.getAttribute('href'); },
      activeClass: fw.router.activeClass,
      history: 'push',
      handler: function defaultHandlerForRouteBinding (event, url) {
        /* istanbul ignore else */
        if (!hashOnly && !fw.utils.isFullURL(url) && event.which !== 2) {
          event.preventDefault();
          return true;
        } else {
          return false;
        }
      }
    };

    if (_.isFunction(routeParams) || _.isString(routeParams)) {
      routeHandlerDescription.state = routeParams;
    } else if (_.isObject(routeParams)) {
      _.extend(routeHandlerDescription, routeParams);
    }

    var routeHandlerDescriptionState = routeHandlerDescription.state;
    if (!_.isFunction(routeHandlerDescriptionState)) {
      routeHandlerDescription.state = function () { return routeHandlerDescriptionState; };
    }

    function checkForMatchingRoute (myRoute) {
      var currentState = stripQueryStringAndFragment(router.currentState());
      var activeRouteClassName = resultBound(routeHandlerDescription, 'activeClass', router);

      if (activeRouteClassName) {
        if (myRoute === currentState) {
          addClass(element, activeRouteClassName);
        } else {
          removeClass(element, activeRouteClassName);
        }
      }
    }

    function setUpElement () {
      var routeState = routeHandlerDescription.state();
      var configParams = router[privateDataSymbol].configParams;

      hashOnly = !!routeState.match(startingHashRegex);

      if (element.tagName.toLowerCase() === 'a') {
        element.href = configParams.baseRoute + routeState;
      }

      if (_.isObject(stateTracker) && _.isFunction(stateTracker.dispose)) {
        stateTracker.dispose();
      }
      stateTracker = router.currentRoute.subscribe(_.partial(checkForMatchingRoute, routeState));

      if (elementIsSetup === false) {
        elementIsSetup = true;
        checkForMatchingRoute(routeState);

        fw.utils.registerEventHandler(element, resultBound(routeHandlerDescription, 'on', router), function (event) {
          var currentRouteState = routeHandlerDescription.state();
          var handlerResult = routeHandlerDescription.handler.call(viewModel, event, currentRouteState);
          if (handlerResult) {
            if (_.isString(handlerResult)) {
              currentRouteState = handlerResult;
            }

            if (_.isString(currentRouteState) && !fw.utils.isFullURL(currentRouteState)) {
              router[resultBound(routeHandlerDescription, 'history', router) + 'State'](currentRouteState);
            }
          }
          return true;
        });
      }
    }

    if (fw.isObservable(routeHandlerDescription.state)) {
      router.disposeWithInstance(routeHandlerDescription.state.subscribe(setUpElement));
    }
    setUpElement();

    /* istanbul ignore next */
    fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
      if (_.isObject(stateTracker)) {
        stateTracker.dispose();
      }
    });
  }
};

},{"../../misc/util":42,"./router-tools":36,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],33:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var entityDescriptors = require('../entity-descriptors');
var viewModelBootstrap = require('../viewModel/viewModel-bootstrap');

var routerTools = require('./router-tools');
var registerOutlet = routerTools.registerOutlet;
var unregisterOutlet = routerTools.unregisterOutlet;
var getLocation = routerTools.getLocation;

/**
 * Bootstrap an instance with router capabilities (state management, outlet control, etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function routerBootstrap (instance, configParams) {
  if (!instance) {
    throw Error('Must supply the instance to boot()');
  }

  var descriptor = entityDescriptors.getDescriptor('router');

  // bootstrap/mixin viewModel functionality
  viewModelBootstrap(instance, configParams, descriptor);

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    var privateData = instance[privateDataSymbol];
    instance[descriptor.isEntityDuckTag] = true;

    var previousRoute;

    _.extend(privateData, {
      registerOutlet: _.partial(registerOutlet, instance),
      unregisterOutlet: _.partial(unregisterOutlet, instance),
      outlets: {},
      configParams: _.extend(privateData.configParams, descriptor.resource.defaultConfig, configParams || {})
    });

    _.extend(instance, require('./router-methods'), {
      currentState: fw.observable(),
      currentRoute: fw.observable(),
      activated: fw.observable(false),
      routes: fw.observableArray(privateData.configParams.routes)
    });

    instance.disposeWithInstance(
      instance.activated.subscribe(function routerActivation (activated) {
        // activate/deactivate the router when the activated flag is set
        if (activated) {
          var currentState = instance.currentState();
          if (currentState) {
            // user set the state explicitly prior to activation, lets execute it now
            instance.currentRoute(instance.getRouteForState(currentState));
          } else {
            // get the current state/route as of activation from the browser url/location
            instance.currentState(getLocation());
          }

          /* istanbul ignore if */
          if (!fw.router.disableHistory) {
            (function setupPopStateListener (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', privateData.historyPopstateHandler = function popstateEventHandler (event) {
                instance.currentState(event.state);
              }, false);
            })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);
          }
        } else {
          /* istanbul ignore if */
          if (privateData.historyPopstateHandler) {
            (function removePopStateListener (eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', privateData.historyPopstateHandler);
            })(window.removeEventListener ? ['removeEventListener', ''] : ['detachEvent', 'on']);
          }
        }
      }),
      instance.currentState.subscribe(function evalRoute (currentState) {
        instance.currentRoute(instance.getRouteForState(currentState));
      }),
      instance.currentRoute.subscribe(function execRoute (currentRoute) {
        // Trigger the currentRoute controller whenever the currentRoute() updates
        if (currentRoute && instance.activated() && !_.isEqual(previousRoute, currentRoute)) {
          previousRoute = currentRoute;

          var state = instance.currentState();
          var route = currentRoute.route;
          var params = currentRoute.params;

          // register the callback for any defined fragment identifier found in the currentState if needed (after the route loads we need to trigger scrolling to the fragment)
          privateData.scrollToFragment = _.noop;
          if (_.isString(state) && state.indexOf('#') !== -1) {
            var fragmentIdentifier = state.split('#')[1];
            privateData.scrollToFragment = function () {
              var elementToScrollTo = document.getElementById(fragmentIdentifier);
              elementToScrollTo && _.isFunction(elementToScrollTo.scrollIntoView) && elementToScrollTo.scrollIntoView();
            };
          }

          if (currentRoute.title) {
            window.document.title = currentRoute.title;
          }

          /* istanbul ignore if */
          if (privateData.alterStateMethod && !fw.router.disableHistory) {
            privateData.alterStateMethod.call(history, state, null, (currentRoute.url ? privateData.configParams.baseRoute + currentRoute.url : null));
            privateData.alterStateMethod = null;
          }

          _.isFunction(currentRoute.controller) && currentRoute.controller.call(instance, params);
        }
      })
    );
  } else {
    throw Error('Cannot bootstrap a ' + descriptor.entityName + ' more than once.');
  }

  return instance;
}

module.exports = routerBootstrap;

},{"../../misc/util":42,"../entity-descriptors":24,"../viewModel/viewModel-bootstrap":38,"./router-methods":35,"./router-tools":36,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],34:[function(require,module,exports){
module.exports = {
  noComponentSelected: '_noComponentSelected',
  outletLoadingDisplay: 'fw-loading-display',
  outletLoadedDisplay: 'fw-loaded-display'
};

},{}],35:[function(require,module,exports){
var _ = require('footwork-lodash');
var fw = require('knockout/build/output/knockout-latest');

var isEntity = require('../entity-tools').isEntity;

var routerTools = require('./router-tools');
var getNamedRoute = routerTools.getNamedRoute;
var getMatchedRoute = routerTools.getMatchedRoute;

var util = require('../../misc/util');
var propertyDispose = util.propertyDispose;
var privateDataSymbol = util.getSymbol('footwork');
var resultBound = util.resultBound;

var viewModelMethodDispose = require('../viewModel/viewModel-methods').dispose;
var clearSequenceQueue = require('../../binding/animation-sequencing').clearSequenceQueue;
var noComponentSelected = require('./router-config').noComponentSelected;

var activeOutlets = fw.observableArray();

module.exports = {
  outlet: function (outletName, options) {
    if (!_.isObject(options)) {
      options = { display: arguments.length > 1 ? options || noComponentSelected : undefined };
    }

    var router = this;
    var outlets = router[privateDataSymbol].outlets;
    var outletProperties = outlets[outletName] || {};
    var outlet = outletProperties.routeObservable;
    var outletViewModel = outletProperties.outletViewModel;
    var routerOutletOptions = router[privateDataSymbol].configParams.outlet || {};

    if (!fw.isObservable(outlet)) {
      // router outlet observable not found, we must create a new one
      outlet = fw.observable({
        name: noComponentSelected,
        params: {},
        getOnCompleteCallback: function () { return _.noop; },
        loading: options.loading || routerOutletOptions.loading
      });

      // register the new outlet under its outletName
      outlets[outletName] = {
        outletViewModel: outletProperties.outletViewModel || null,
        routeObservable: outlet
      };
    }

    // grab and set the loading display if needed
    if (outletViewModel) {
      outletViewModel.loading(options.loading || resultBound(routerOutletOptions, 'loading', router, [outletName]) || outletViewModel.originalDisplay);
    }

    var outletHasMutated = false;
    if (!_.isUndefined(options.display)) {
      var currentOutletDef = outlet();

      if (currentOutletDef.name !== options.display) {
        currentOutletDef.name = options.display;
        outletHasMutated = true;
      }
      if (_.isObject(options.params)) {
        currentOutletDef.params = options.params;
        outletHasMutated = true;
      }

      if (outletHasMutated) {
        clearSequenceQueue();

        currentOutletDef.transition = options.transition || routerOutletOptions.transition || 0;
        if (outletViewModel) {
          outletViewModel[privateDataSymbol].loadingChildren.removeAll();
          outletViewModel.routeIsLoading(true);
        }

        currentOutletDef.getOnCompleteCallback = function (element) {
          var outletElement = element.parentNode;

          activeOutlets.remove(outlet);
          outletElement.setAttribute('data-rendered', currentOutletDef.name);

          return function addBindingOnComplete () {
            var outletViewModel = outlets[outletName].outletViewModel;
            outletViewModel.routeIsLoading(false);
            outletViewModel.routeOnComplete = function () {
              router[privateDataSymbol].scrollToFragment();
              [routerOutletOptions.onComplete, options.onComplete].forEach(function callOnCompleteFunctions (onComplete) {
                (onComplete || _.noop).call(router, outletElement);
              });
            };
          };
        };

        if (activeOutlets().indexOf(outlet) === -1) {
          activeOutlets.push(outlet);
        }

        outlet.valueHasMutated();
      }
    }

    return outlet;
  },
  getRouteForState: function (currentState) {
    var route;

    if (_.isObject(currentState)) {
      route = getNamedRoute(this, currentState);
    } else {
      route = getMatchedRoute(this, currentState);
    }

    if (!route && (route = _.find(this.routes(), { unknown: true }))) {
      route = {
        controller: route.controller,
        title: route.title,
        url: _.isString(currentState) ? currentState : null
      };
    }

    return route;
  },
  replaceState: function (newState) {
    if (this.activated()) {
      this[privateDataSymbol].alterStateMethod = history.replaceState;
      this.currentState(newState);
    }

    return this;
  },
  pushState: function (newState) {
    if (this.activated()) {
      this[privateDataSymbol].alterStateMethod = history.pushState;
      this.currentState(newState);
    }

    return this;
  },
  dispose: function () {
    if (!this[privateDataSymbol].isDisposed) {
      // first run all of the standard viewModel disposal logic
      viewModelMethodDispose.call(this);

      // deactivate the router (unbinds the history event listener)
      this.activated(false);

      // dispose of all privately stored properties
      _.each(this[privateDataSymbol], propertyDispose);

      return this;
    }
  }
};



},{"../../binding/animation-sequencing":4,"../../misc/util":42,"../entity-tools":26,"../viewModel/viewModel-methods":39,"./router-config":34,"./router-tools":36,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],36:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var nearestEntity = require('../entity-tools').nearestEntity;

var util = require('../../misc/util');
var getSymbol = util.getSymbol;
var resultBound = util.resultBound;
var alwaysPassPredicate = util.alwaysPassPredicate;
var privateDataSymbol = util.getSymbol('footwork');

var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;

// Convert a route string to a regular expression which is then used to match a uri against it and determine
// whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp (routeString) {
  routeString = routeString
    .replace(escapeRegex, "\\$&")
    .replace(optionalParamRegex, "(?:$1)?")
    .replace(namedParamRegex, function (match, optional) {
      return optional ? match : "([^\/]+)";
    })
    .replace(splatParamRegex, "(.*?)");

  return new RegExp('^' + routeString + (routeString !== '/' ? '(\\/.*)*$' : '$'));
}

/**
 * Locate the nearest router from a given ko $context
 * (travels up through $parentContext chain to find the router if not found on the
 * immediate $context). Returns null if none is found.
 *
 * @param {object} $context
 * @returns {object} router instance or null if none found
 */
function nearestParentRouter ($context) {
  return nearestEntity($context.$parentContext, fw.isRouter);
}

/**
 * Register an outlets viewModel with its parent router.
 *
 * @param {object} router the router to register with
 * @param {string} outletName the name (property) of the outlet
 * @param {object} outletViewModel the outlets viewModel to register with the router
 */
function registerOutlet (router, outletName, outletViewModel) {
  var outletProperties = router[privateDataSymbol].outlets[outletName] = router[privateDataSymbol].outlets[outletName] || {};
  outletProperties.outletViewModel = outletViewModel;
}

/**
 * Unregister an outlets viewModel from its associated router.
 *
 * @param {object} router the router to unregister from
 * @param {string} outletName the name (property) of the outlet
 */
function unregisterOutlet (router, outletName) {
  delete router[privateDataSymbol].outlets[outletName];
}

/**
 * Remove the begging portion of a url so that when matching routes we do not need to specify it in each one
 *
 * @param {object} router the router
 * @param {string} url portion of url to ignore
 */
function trimBaseRoute (router, url) {
  var baseRoute = router[privateDataSymbol].configParams.baseRoute;
  if (baseRoute && url && url.indexOf(baseRoute) === 0) {
    url = url.substr(baseRoute.length);
  }
  return url;
}

/**
 * Remove the query string and hash from a url
 *
 * @param {string} url The url to remove the query string and hash from
 * @returns {string} the stripped url
 */
function stripQueryStringAndFragment (url) {
  if (url) {
    url = url.split("?")[0].split("#")[0];
  }
  return url;
}

function getRouteParams (route, routeUrl, destinationUrl) {
  var paramNames = _.map(routeUrl.match(namedParamRegex), function (param) {
    return param.replace(':', '');
  });
  var paramValues = destinationUrl.match(routeStringToRegExp(routeUrl));

  return _.reduce(paramNames, function (routeParams, parameterName, index) {
    routeParams[parameterName] = paramValues[index + 1];
    return routeParams;
  }, {});
}

function getNamedRoute (router, namedRoute) {
  return _.reduce(router.routes(), function (matchedRoute, routeConfig) {
    if (routeConfig.name === namedRoute.name && (routeConfig.predicate || alwaysPassPredicate).call(router, namedRoute) && router[privateDataSymbol].configParams.predicate.call(router, namedRoute)) {
      matchedRoute = {
        routeConfig: routeConfig,
        params: namedRoute.params,
        title: resultBound(routeConfig, 'title', router, [namedRoute]),
        controller: routeConfig.controller
      };
    }
    return matchedRoute;
  }, null);
}

function getMatchedRoute (router, destinationUrl) {
  var strippedDestinationUrl = trimBaseRoute(router, stripQueryStringAndFragment(destinationUrl));

  return _.reduce(router.routes(), function (matchedRoute, routeConfig) {
    var path = routeConfig.path;
    if (_.isString(path) || _.isArray(path)) {
      _.each([].concat(path), function (routePath) {
        if (_.isString(routePath) && _.isString(strippedDestinationUrl) && strippedDestinationUrl.match(routeStringToRegExp(routePath)) && (routeConfig.predicate || alwaysPassPredicate).call(router, strippedDestinationUrl) && router[privateDataSymbol].configParams.predicate.call(router, strippedDestinationUrl)) {
          matchedRoute = {
            routeConfig: routeConfig,
            url: destinationUrl,
            params: getRouteParams(routeConfig, routePath, strippedDestinationUrl),
            title: resultBound(routeConfig, 'title', router, [destinationUrl]),
            controller: routeConfig.controller
          };
        }
      });
    }
    return matchedRoute;
  }, null);
}

/**
 * Returns the current location of the browser, including the query string and hash portions
 *
 * @returns {string} the current location url
 */
function getLocation () {
  var location = window.history.location || window.location;
  return location.pathname + location.search + location.hash;
}

module.exports = {
  nearestParentRouter: nearestParentRouter,
  registerOutlet: registerOutlet,
  unregisterOutlet: unregisterOutlet,
  getNamedRoute: getNamedRoute,
  getMatchedRoute: getMatchedRoute,
  getLocation: getLocation,
  stripQueryStringAndFragment: stripQueryStringAndFragment
};

},{"../../misc/util":42,"../entity-tools":26,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],37:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;
var alwaysPassPredicate = util.alwaysPassPredicate;

var entityName = 'router';

require('./route-binding');

fw[entityName] = {
  boot: require('./router-bootstrap'),
  activeClass: 'active',
  disableHistory: false,
  fileExtensions: '.js',
  defaultConfig: {
    onDispose: _.noop,
    baseRoute: '',
    activate: true,
    predicate: alwaysPassPredicate
  }
};

var descriptor = {
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: getSymbol('is' + capitalizeFirstLetter(entityName)),
  isEntity: function (thing) {
    return _.isObject(thing) && thing[descriptor.isEntityDuckTag];
  },
  registeredLocations: {},
  registered: {},
  referenceNamespace: getSymbol(entityName)
};

require('../resource-tools')(descriptor);
require('../entity-descriptors').push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

},{"../../misc/util":42,"../entity-descriptors":24,"../resource-tools":31,"./route-binding":32,"./router-bootstrap":33,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],38:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var entityDescriptors = require('../entity-descriptors');
var privateDataSymbol = require('../../misc/util').getSymbol('footwork');
var resultBound = require('../../misc/util').resultBound;

var entityCount = {};
function getNextEntity(entityName) {
  entityCount[entityName] = entityCount[entityName] || 0;
  return entityCount[entityName]++;
}

/**
 * Bootstrap an instance with viewModel capabilities (lifecycle/etc).
 *
 * @param {any} instance
 * @param {any} configParams
 * @returns {object} The instance that was passed in
 */
function viewModelBootstrap (instance, configParams, requestHandlerDescriptor) {
  if (!instance) {
    throw Error('Must supply the instance to boot()');
  }

  var descriptor = entityDescriptors.getDescriptor('viewModel');
  requestHandlerDescriptor = requestHandlerDescriptor || descriptor;

  var hasBeenBootstrapped = !_.isUndefined(instance[descriptor.isEntityDuckTag]);
  if (!hasBeenBootstrapped) {
    instance[descriptor.isEntityDuckTag] = true;

    configParams = _.extend({}, descriptor.resource.defaultConfig, {
      namespace: (configParams || {}).namespace ? null : getNextEntity(requestHandlerDescriptor.entityName)
    }, configParams);

    instance[privateDataSymbol] = {
      configParams: configParams,
      disposableItems: [],
      loadingChildren: fw.observableArray()
    };

    _.extend(instance, require('./viewModel-methods'), {
      $namespace: fw.namespace(resultBound(configParams, 'namespace', instance))
    });

    // Setup the request handler which returns the instance
    instance.disposeWithInstance(fw.namespace(requestHandlerDescriptor.referenceNamespace).requestHandler('ref', function (namespaceName) {
      if (_.isString(namespaceName) || _.isArray(namespaceName)) {
        if (_.isArray(namespaceName) && _.indexOf(namespaceName, configParams.namespace) !== -1) {
          return instance;
        } else if (_.isString(namespaceName) && namespaceName === configParams.namespace) {
          return instance;
        }
      } else {
        return instance;
      }
    }));
  }

  return instance;
}

module.exports = viewModelBootstrap;

},{"../../misc/util":42,"../entity-descriptors":24,"./viewModel-methods":39,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],39:[function(require,module,exports){
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var privateDataSymbol = util.getSymbol('footwork');
var propertyDispose = util.propertyDispose;

module.exports = {
  dispose: function dispose () {
    var self = this;

    if (!self[privateDataSymbol].isDisposed) {
      self[privateDataSymbol].isDisposed = true;
      var configParams = self[privateDataSymbol].configParams;

      if (configParams.onDispose !== _.noop) {
        configParams.onDispose.call(self, self[privateDataSymbol].element);
      }

      _.each(self, propertyDispose);
      _.each(self[privateDataSymbol].disposableItems, propertyDispose);
    }

    return self;
  },
  disposeWithInstance: function disposeWithInstance (disposableItem) {
    var self = this;

    if (arguments.length > 1) {
      disposableItem = Array.prototype.slice.call(arguments);
    }

    if (_.isArray(disposableItem)) {
      _.each(disposableItem, function (item) {
        self.disposeWithInstance(item);
      });
    } else if (disposableItem) {
      self[privateDataSymbol].disposableItems.push(disposableItem);
    }
  }
};



},{"../../misc/util":42,"footwork-lodash":2}],40:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

var entityName = 'viewModel';

fw[entityName] = {
  boot: require('./viewModel-bootstrap'),
  fileExtensions: '.js',
  defaultConfig: {
    namespace: undefined,
    afterRender: _.noop,
    afterResolve: function resolveImmediately (resolveNow) {
      resolveNow();
    },
    sequence: false,
    onDispose: _.noop
  }
};

var descriptor = {
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: getSymbol('is' + capitalizeFirstLetter(entityName)),
  isEntity: function (thing) {
    return _.isObject(thing) && thing[descriptor.isEntityDuckTag];
  },
  registeredLocations: {},
  registered: {},
  referenceNamespace: getSymbol(entityName)
};

require('../resource-tools')(descriptor);
require('../entity-descriptors').push(descriptor);

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;



},{"../../misc/util":42,"../entity-descriptors":24,"../resource-tools":31,"./viewModel-bootstrap":38,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],41:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('./util');
var resultBound = util.resultBound;
var promiseIsFulfilled = util.promiseIsFulfilled;
var isPromise = util.isPromise;
var privateDataSymbol = util.getSymbol('footwork');

// Map from CRUD to REST for our default implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'delete': 'DELETE',
  'read':   'GET'
};

var parseURLRegex = /^(http[s]*:\/\/[a-zA-Z0-9:\.]*)*([\/]{0,1}[\w\.:\/-]*)$/;
var parseParamsRegex = /(:[\w\.]+)/g;
var trailingSlashRegex = /\/$/;

/**
 * Creates or returns a promise based on the request specified in requestInfo.
 * This function also manages a requestRunning observable on the entity which indicates when the request finishes.
 * Note that there is an optional requestLull which will make the requestRunning observable stay 'true' for
 * atleast the specified duration. If multiple requests are in progress, then it will wait for all to finish.
 *
 * @param  {string} operationType The type of operation being made, used as key to cache running requests
 * @param  {object} requestInfo   Description of the request to make including a createRequest callback to make a new request
 * @return {Promise}              Ajax Promise
 */
function makeOrGetRequest (operationType, requestInfo) {
  var requestRunning = requestInfo.requestRunning;
  var requestLull = requestInfo.requestLull;
  var entity = requestInfo.entity;
  var theRequest = requestInfo.createRequest();

  if (!isPromise(theRequest)) {
    // returned value from createRequest() is a value not a promise, lets return the value in a promise
    theRequest = Promise.resolve(theRequest);
  }
  theRequest = makePromiseQueryable(theRequest);

  requestRunning(true);

  var lullFinished = fw.observable(false);
  var requestFinished = fw.observable(false);
  var requestWatcher = fw.computed(function () {
    if (lullFinished() && requestFinished()) {
      requestRunning(false);
      requestWatcher.dispose();
    }
  });

  requestLull = (_.isFunction(requestLull) ? requestLull.call(entity, operationType) : requestLull);
  if (requestLull) {
    setTimeout(function () {
      lullFinished(true);
    }, requestLull);
  } else {
    lullFinished(true);
  }

  theRequest.then(function () {
    requestFinished(true);
  });

  return theRequest;
}

/**
 * Create an fetch request based on the desired CRUD action, concern (dataModel/collection), and optional params to pass to fetch.
 *
 * @param {string} action
 * @param {object} concern
 * @param {object} options
 * @returns {Promise} Promise created from the request
 */
function sync (action, concern, options) {
  if (!fw.isDataModel(concern) && !fw.isCollection(concern)) {
    throw Error('Must supply a dataModel or collection to sync');
  }

  if (concern[privateDataSymbol][action]) {
    concern[privateDataSymbol][action].replaced = true;
  }

  var configParams = concern[privateDataSymbol].configParams;
  var url = resultBound(configParams, 'url', concern);

  if (_.isObject(url) && !_.isFunction(url)) {
    // user is explicitly defining the individual request url or method+url
    url = resultBound(url, action, concern, [options]);
  } else if (_.isString(url) || _.isFunction(url)) {
    url = _.isFunction(url) ? url.call(concern, action, options) : url;

    // add the :id to the url if needed
    if (fw.isDataModel(concern) && _.includes(['read', 'update', 'delete'], action) && url) {
      var urlPieces = url.split('?');
      var urlRoute = urlPieces.shift();
      var queryString = urlPieces.length ? '?' + urlPieces.join('?') : '';
      url = urlRoute.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute + queryString;
    }
  }

  var method;
  if (_.isString(url) && url.indexOf(' ') !== -1) {
    // address in form of: 'method url'
    url = url.split(' ');
    method = url[0];
    url = url[1];
  } else {
    method = methodMap[action];
  }

  if (!_.isString(method)) {
    throw Error('Invalid method resolved for ' + action + ' sync operation');
  }

  if (!_.isString(url)) {
    throw Error('A url must be specified for ' + action + ' sync operation');
  }

  // replace any interpolated parameters
  if (fw.isDataModel(concern)) {
    var urlParams = url.match(parseParamsRegex);
    if (urlParams) {
      _.each(urlParams, function (param) {
        url = url.replace(param, concern.get(param.substr(1)));
      });
    }
  }

  // construct the fetch options object
  options = _.extend({
      method: method.toUpperCase(),
      body: null,
      headers: {}
    },
    resultBound(fw.options, 'fetchOptions', concern, [action, concern, options]) || {},
    resultBound(configParams, 'fetchOptions', concern, [action, concern, options]) || {},
    options || {});

  if (_.isNull(options.body) && _.includes(['create', 'update'], action)) {
    options.headers['content-type'] = 'application/json';
    options.body = JSON.stringify(options.attrs || concern.get());
  }

  concern[privateDataSymbol][action] = makePromiseQueryable(fetch(url, options));
  return concern[privateDataSymbol][action];
};

/**
 * Place isFulfilled hook onto a promise which can be used to syncronously determine a promises state.
 *
 * @param {promise} promise
 * @returns {promise} the instrumented promise
 */
function makePromiseQueryable (promise) {
  if (promise.isFulfilled) {
    return promise;
  }

  var isResolved = false;
  var isRejected = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
    function (v) { isResolved = true; return v; },
    function (e) { isRejected = true; throw e; });
  result.isFulfilled = function () { return isResolved || isRejected; };
  return result;
}

/**
 * Take a fetch'd xmlhttprequest and handle the response. Takes into account valid 200-299 response codes.
 * Also handles parse errors in the response which is supposed to be valid JSON.
 *
 * @param {object} xhr
 * @returns {object} xhr with parsed JSON response result
 */
function handleJsonResponse (xhr) {
  return xhr.then(function (response) {
      if (response.ok && !xhr.replaced) {
        var json;
        try {
          json = response.clone().json();
        } catch(e) {}
        return json;
      }
    });
}

fw.options.fetchOptions = {};
fw.sync = sync;

module.exports = {
  makeOrGetRequest: makeOrGetRequest,
  handleJsonResponse: handleJsonResponse,
  makePromiseQueryable: makePromiseQueryable
}

},{"./util":42,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],42:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

/**
 * Function which always returns true (a predicate function that always passes as 'true')
 *
 * @returns true
 */
function alwaysPassPredicate () {
  return true;
}

/**
 * Return the 'result' of a property on an object, either via calling it (using the supplied context and params) or the raw value if it is a non-function value.
 * Note: This is similar to underscore/lodash _.result() but allows you to provide the context and parameters to potential callbacks
 *
 * @param  {object} object  Object to read property from
 * @param  {string} path    Property name
 * @param  {mixed}  context Context to call the (if existant) function with
 * @param  {array}  params  Parameters to call the callback (object properties) with
 * @returns {mixed}          The result of the property on the object
 */
function resultBound (object, path, context, params) {
  object = object || {};
  params = params || [];
  context = context || object;

  if (_.isFunction(object[path])) {
    return object[path].apply(context, params);
  }
  return object[path];
}

/**
 * Determine whether or not the supplied thing is a promise or not
 *
 * @param {any} thing
 * @returns {boolean} true if it is a promise, false if not
 */
function isPromise (thing) {
  return _.isObject(thing) && _.isFunction(thing.then);
}

/**
 * Determines whether or not a promise has been fulfilled.
 *
 * @param {any} promise
 * @returns {boolean} true if fulfilled, false if not
 */
function promiseIsFulfilled (promise) {
  return !isPromise(promise) || promise.isFulfilled();
}
/**
 * Determines whether or not an element has a className property
 *
 * @param {any} element
 * @returns {boolean} true if it has the property, false if not
 */
function hasClassName (element) {
  return _.isObject(element) && _.isString(element.className);
}

/**
 * Determines whether or not the supplied element has the given className.
 *
 * @param {any} element
 * @param {any} className
 * @returns {boolean} true if it has the class, false if not
 */
function hasClass (element, className) {
  return element.className.match( new RegExp('(\\s|^)' + className + '(\\s|$)') );
}

/**
 * Add the specified className to the given element if it is not already there.
 *
 * @param {any} element
 * @param {any} className
 */
function addClass (element, className) {
  if (hasClassName(element) && !hasClass(element, className)) {
    element.className += (element.className.length && _.isNull(element.className.match(/ $/)) ? ' ' : '') + className;
  }
}

/**
 * Remove the specified className from the given element if it exists.
 *
 * @param {any} element
 * @param {any} className
 */
function removeClass (element, className) {
  if (hasClassName(element) && hasClass(element, className)) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

/**
 * Call the supplied callback after the minimum transition time (the next frame).
 *
 * @param {any} callback
 */
function nextFrame (callback) {
  setTimeout(callback, 1000 / 30);
};

var trailingSlashRegex = /\/$/;

/**
 * Determines whether or not the supplied pathOrFile is a path.
 *
 * @param {any} pathOrFile
 * @returns {boolean} true if the supplied pathOrFile is a path, false if not
 */
function isPath (pathOrFile) {
  return _.isString(pathOrFile) && trailingSlashRegex.test(pathOrFile);
}

/**
 * Calls dispose() on the supplied property if it exists and can be dispose()'d.
 *
 * @param {any} property
 */
function propertyDispose (property) {
  if (property && _.isFunction(property.dispose)) {
    property.dispose();
  }
}

/**
 * Determine if the supplied object is a DocumentFragment instance.
 *
 * @param {any} obj
 * @returns {boolean} True if it is a DocumentFragment, false if not
 */
function isDocumentFragment (obj) {
  /* istanbul ignore else */
  if (window['DocumentFragment']) {
    return obj instanceof DocumentFragment;
  } else {
    return obj && obj.nodeType === 11;
  }
}

/**
 * Determine if the supplied object is a HTMLElement instance.
 *
 * @param {any} obj
 * @returns {boolean} True if it is a HTMLElement, false if not
 */
function isDomElement (obj) {
  /* istanbul ignore else */
  if (window['HTMLElement']) {
    return obj instanceof HTMLElement;
  } else {
    return obj && obj.tagName && obj.nodeType === 1;
  }
}

/**
 * Capitalize the first letter of the supplied string.
 *
 * @param {string} str
 * @returns {string} The original string with the first character upper-cased
 */
function capitalizeFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Return either the supplied string key (if Symbol() capability not present) or return a symbol based on that same key.
 *
 * @param {any} str
 * @returns {Symbol|string} The identifier
 */
function getSymbol (str) {
  return typeof Symbol === 'function' && typeof Symbol['for'] === 'function' ? Symbol['for'](str) : /* istanbul ignore next */ ('__' + str);
}

var privateDataSymbol = getSymbol('footwork');

/**
 * Return the private data of a viewModel if it exists
 *
 * @param {any} instance
 * @returns {object} The private data on the instance (if found)
 */
function getPrivateData (instance) {
  return instance && instance[privateDataSymbol];
}

/**
 * Convert the supplied arrayLikeObject into an array of its elements
 *
 * @param {any} arrayLikeObject
 * @returns {array} New array of original children
 */
function makeArray (arrayLikeObject) {
  for (var i = 0, j = arrayLikeObject.length, convertedArray = []; i < j; i++) {
    convertedArray.push(arrayLikeObject[i]);
  }
  return convertedArray;
}

function isNode (thing) {
  var thingIsObject = _.isObject(thing);
  return (
    thingIsObject ? thing instanceof Node :
    thingIsObject && _.isNumber(thing.nodeType) === "number" && _.isString(thing.nodeName)
  );
}

function isEvent (thing) {
  return thing && (thing instanceof Event || _.isFunction(thing.preventDefault));
}

fw.utils.getPrivateData = getPrivateData;

var isFullURLRegex = /(^[a-z]+:\/\/|^\/\/)/i;
fw.utils.isFullURL = function (thing) {
  return _.isString(thing) && isFullURLRegex.test(thing);
};

module.exports = {
  alwaysPassPredicate: alwaysPassPredicate,
  resultBound: resultBound,
  isPromise: isPromise,
  promiseIsFulfilled: promiseIsFulfilled,
  addClass: addClass,
  hasClass: hasClass,
  isNode: isNode,
  isEvent: isEvent,
  removeClass: removeClass,
  nextFrame: nextFrame,
  isPath: isPath,
  propertyDispose: propertyDispose,
  isDocumentFragment: isDocumentFragment,
  isDomElement: isDomElement,
  capitalizeFirstLetter: capitalizeFirstLetter,
  getPrivateData: getPrivateData,
  getSymbol: getSymbol,
  makeArray: makeArray
};

},{"footwork-lodash":2,"knockout/build/output/knockout-latest":3}],43:[function(require,module,exports){
var _ = require('footwork-lodash');

var privateDataSymbol = require('../misc/util').getSymbol('footwork');

/**
 * Publish data on a topic of a namespace.
 *
 * @param {any} topic
 * @param {any} data
 * @returns {object} the namespace instance
 */
function publish (topic, data) {
  this[privateDataSymbol].postbox.notifySubscribers(data, topic);
  return this;
}

/**
 * Subscribe to a topic on a namespace.
 *
 * @param {string} topic the topic string, or thing/message that you want to subscribe to
 * @param {function} callback the callback triggered with the data
 * @param {any} context the context given to the callback
 * @returns {object} the subscription that was created
 */
function subscribe (topic, callback, context) {
  if (arguments.length > 2) {
    callback = _.bind(callback, context);
  }
  var subscription = this[privateDataSymbol].postbox.subscribe(callback, null, topic);
  this[privateDataSymbol].subscriptions.push(subscription);
  return subscription;
}

/**
 * Unsubscribe a namespace subscription.
 *
 * @param {object} subscription the subscription to unsubscribe
 * @returns {object} the namespace instance
 */
function unsubscribe (subscription) {
  subscription && _.isFunction(subscription.dispose) && subscription.dispose();
  return this;
}

/**
 * Issue a request for data using the supplied topic and params and return the response.
 *
 * @param {string} topic the topic/data you are requesting
 * @param {any} requestParams any data to pass along to the handler on the other side
 * @param {boolean} allowMultipleResponses if true then all the responses will be returned in an array, if false (or not defined) only the first response will be returned
 * @returns {any} the returned data (or undefined)
 */
function request (topic, requestParams, allowMultipleResponses) {
  var response = undefined;

  var responseSubscription = this[privateDataSymbol].postbox.subscribe(function (reqResponse) {
    if (_.isUndefined(response)) {
      response = allowMultipleResponses ? [reqResponse] : reqResponse;
    } else if (allowMultipleResponses) {
      response.push(reqResponse);
    }
  }, null, 'req.' + topic + '.resp');

  this[privateDataSymbol].postbox.notifySubscribers(requestParams, 'req.' + topic);
  responseSubscription.dispose();

  return response;
}

/**
 * Create a request handler to respond to the requested topic using the specified callback.
 *
 * @param {string} topic
 * @param {function} callback the callback which is passed the topic data and whos return result is send to back to the requester
 * @param {any} context the context given to the callback
 * @returns {object} the request subscription that was created
 */
function requestHandler (topic, callback, context) {
  var self = this;

  if (!_.isUndefined(context)) {
    callback = _.bind(callback, context);
  }

  var subscription = self[privateDataSymbol].postbox.subscribe(function (reqResponse) {
    self[privateDataSymbol].postbox.notifySubscribers(callback(reqResponse), 'req.' + topic + '.resp');
  }, null, 'req.' + topic);

  self[privateDataSymbol].subscriptions.push(subscription);

  return subscription;
}

/**
 * Dispose of the namespace (clear all subscriptions/handlers)
 *
 * @returns {object} the namespace instance
 */
function dispose () {
  _.invokeMap(this[privateDataSymbol].subscriptions, 'dispose');
  return this;
}

/**
 * Return the name of the namespace
 * @returns {string} the namespace name
 */
function getName () {
  return this[privateDataSymbol].namespaceName;
}

module.exports = {
  publish: publish,
  subscribe: subscribe,
  unsubscribe: unsubscribe,
  request: request,
  requestHandler: requestHandler,
  dispose: dispose,
  getName: getName
};

},{"../misc/util":42,"footwork-lodash":2}],44:[function(require,module,exports){
var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../misc/util').getSymbol('footwork');

/**
 * Namespace postbox-based communication based on: http://www.knockmeout.net/2012/05/using-ko-native-pubsub.html
 */
var postboxes = {};

/**
 * Construct a new namespace instance. The generator also creates or returns an instance of the namespace subscribable.
 *
 * @param {string} namespaceName
 * @returns {object} the namespace (this)
 */
function Namespace (namespaceName) {
  if (!(this instanceof Namespace)) {
    return new Namespace(namespaceName);
  }

  this[privateDataSymbol] = {
    namespaceName: namespaceName || '__footwork',
    postbox: postboxes[namespaceName] = postboxes[namespaceName] || new fw.subscribable(),
    subscriptions: []
  };
}

_.extend(Namespace.prototype, require('./namespace-methods'));

fw.namespace = Namespace;

fw.isNamespace = function (thing) {
  return thing instanceof fw.namespace;
};

},{"../misc/util":42,"./namespace-methods":43,"footwork-lodash":2,"knockout/build/output/knockout-latest":3}]},{},[1])(1)
});