/*! matches.js v1.0.3 - Nicolas Gallagher - MIT license */

;(function (global) {

'use strict';

/**
 * Vendor-specific implementations of `Element.prototype.matches()`.
 */

var proto = Element.prototype;
var vendorMatches = proto.matches ||
    proto.mozMatchesSelector ||
    proto.msMatchesSelector ||
    proto.oMatchesSelector ||
    proto.webkitMatchesSelector;

/**
 * Determine if the browser supports matching orphan elements. IE 9's
 * vendor-specific implementation doesn't work with orphans and neither does
 * the fallback for older browsers.
 */

var matchesOrphans = (function () {
    return vendorMatches ? vendorMatches.call(document.createElement('a'), 'a') : false;
}());

/**
 * Determine if a DOM element matches a CSS selector
 *
 * @param {Element} elem
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function matches(elem, selector) {
    var parentElem = elem.parentNode;
    var nodes;
    var i;

    // if the element is an orphan, and the browser doesn't support matching
    // orphans, append it to a documentFragment
    if (!parentElem && !matchesOrphans) {
        parentElem = document.createDocumentFragment();
        parentElem.appendChild(elem);
    }

    if (vendorMatches) {
        return vendorMatches.call(elem, selector);
    }

    // from the parent element's context, get all nodes that match the selector
    nodes = parentElem.querySelectorAll(selector);
    i = nodes.length;

    // since support for `matches()` is missing, we need to check to see if
    // any of the nodes returned by our query match the given element
    while (i--) {
        if (nodes[i] === elem) {
            return true;
        }
    }

    return false;
}

/**
 * Expose `matches`
 */

// common js export
if (typeof exports === 'object') {
    module.exports = matches;
}
// amd export
else if (typeof define === 'function' && define.amd) {
    define(function () {
        return matches;
    });
}
// browser global
else {
    global.matches = matches;
}

}(this));
