/**
 * footwork.js - A solid footing for web applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v2.0.0
 * Url: http://footworkjs.com
 * License(s): MIT
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.fw=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * conduitjs - Give any method a pre/post invocation pipeline....
 * Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 * Version: v0.3.3
 * Url: http://github.com/ifandelse/ConduitJS
 * License: MIT
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory(root));
    } else {
        // Browser globals
        root.Conduit = factory(root);
    }
}(this, function (global, undefined) {
    function Conduit(options) {
        if (typeof options.target !== "function") {
            throw new Error("You can only make functions into Conduits.");
        }
        var _steps = {
            pre: options.pre || [],
            post: options.post || [],
            all: []
        };
        var _defaultContext = options.context;
        var _target = options.target;
        var _targetStep = {
            isTarget: true,
            fn: options.sync ?
            function () {
                var args = Array.prototype.slice.call(arguments, 0);
                var result = _target.apply(_defaultContext, args);
                return result;
            } : function (next) {
                var args = Array.prototype.slice.call(arguments, 1);
                args.splice(1, 1, _target.apply(_defaultContext, args));
                next.apply(this, args);
            }
        };
        var _genPipeline = function () {
            _steps.all = _steps.pre.concat([_targetStep].concat(_steps.post));
        };
        _genPipeline();
        var conduit = function () {
            var idx = 0;
            var retval;
            var phase;
            var next = function next() {
                var args = Array.prototype.slice.call(arguments, 0);
                var thisIdx = idx;
                var step;
                var nextArgs;
                idx += 1;
                if (thisIdx < _steps.all.length) {
                    step = _steps.all[thisIdx];
                    phase = (phase === "target") ? "after" : (step.isTarget) ? "target" : "before";
                    if (options.sync) {
                        if (phase === "before") {
                            nextArgs = step.fn.apply(step.context || _defaultContext, args);
                            next.apply(this, nextArgs || args);
                        } else {
                            retval = step.fn.apply(step.context || _defaultContext, args) || retval;
                            next.apply(this, [retval].concat(args));
                        }
                    } else {
                        step.fn.apply(step.context || _defaultContext, [next].concat(args));
                    }
                }
            };
            next.apply(this, arguments);
            return retval;
        };
        conduit.steps = function () {
            return _steps.all;
        };
        conduit.context = function (ctx) {
            if (arguments.length === 0) {
                return _defaultContext;
            } else {
                _defaultContext = ctx;
            }
        };
        conduit.before = function (step, options) {
            step = typeof step === "function" ? {
                fn: step
            } : step;
            options = options || {};
            if (options.prepend) {
                _steps.pre.unshift(step);
            } else {
                _steps.pre.push(step);
            }
            _genPipeline();
        };
        conduit.after = function (step, options) {
            step = typeof step === "function" ? {
                fn: step
            } : step;
            options = options || {};
            if (options.prepend) {
                _steps.post.unshift(step);
            } else {
                _steps.post.push(step);
            }
            _genPipeline();
        };
        conduit.clear = function () {
            _steps = {
                pre: [],
                post: [],
                all: []
            };
            _genPipeline();
        };
        conduit.target = function (fn) {
            if (fn) {
                _target = fn;
            }
            return _target;
        };
        return conduit;
    };
    return {
        Sync: function (options) {
            options.sync = true;
            return Conduit.call(this, options)
        },
        Async: function (options) {
            return Conduit.call(this, options);
        }
    }
}));
},{}],2:[function(_dereq_,module,exports){
/*!
 * Knockout JavaScript library v3.4.0
 * (c) Steven Sanderson - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function() {(function(n){var x=this||(0,eval)("this"),u=x.document,M=x.navigator,v=x.jQuery,F=x.JSON;(function(n){"function"===typeof define&&define.amd?define(["exports","require"],n):"object"===typeof exports&&"object"===typeof module?n(module.exports||exports):n(x.ko={})})(function(N,O){function J(a,c){return null===a||typeof a in T?a===c:!1}function U(b,c){var d;return function(){d||(d=a.a.setTimeout(function(){d=n;b()},c))}}function V(b,c){var d;return function(){clearTimeout(d);d=a.a.setTimeout(b,c)}}function W(a,
c){c&&c!==I?"beforeChange"===c?this.Kb(a):this.Ha(a,c):this.Lb(a)}function X(a,c){null!==c&&c.k&&c.k()}function Y(a,c){var d=this.Hc,e=d[s];e.R||(this.lb&&this.Ma[c]?(d.Pb(c,a,this.Ma[c]),this.Ma[c]=null,--this.lb):e.r[c]||d.Pb(c,a,e.s?{ia:a}:d.uc(a)))}function K(b,c,d,e){a.d[b]={init:function(b,g,k,l,m){var h,r;a.m(function(){var q=a.a.c(g()),p=!d!==!q,A=!r;if(A||c||p!==h)A&&a.va.Aa()&&(r=a.a.ua(a.f.childNodes(b),!0)),p?(A||a.f.da(b,a.a.ua(r)),a.eb(e?e(m,q):m,b)):a.f.xa(b),h=p},null,{i:b});return{controlsDescendantBindings:!0}}};
a.h.ta[b]=!1;a.f.Z[b]=!0}var a="undefined"!==typeof N?N:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c};a.G=function(a,c,d){a[c]=d};a.version="3.4.0";a.b("version",a.version);a.options={deferUpdates:!1,useOnlyNativeEvents:!1};a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function c(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=b;return a}function e(b,c,d,e){var h=b[c].match(r)||
[];a.a.q(d.match(r),function(b){a.a.pa(h,b,e)});b[c]=h.join(" ")}var f={__proto__:[]}instanceof Array,g="function"===typeof Symbol,k={},l={};k[M&&/Firefox\/2/i.test(M.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];k.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(k,function(a,b){if(b.length)for(var c=0,d=b.length;c<d;c++)l[b[c]]=a});var m={propertychange:!0},h=u&&function(){for(var a=3,b=u.createElement("div"),c=
b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:n}(),r=/\S+/g;return{cc:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],q:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},o:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},Sb:function(a,b,c){for(var d=0,e=a.length;d<e;d++)if(b.call(c,a[d],d))return a[d];
return null},La:function(b,c){var d=a.a.o(b,c);0<d?b.splice(d,1):0===d&&b.shift()},Tb:function(b){b=b||[];for(var c=[],d=0,e=b.length;d<e;d++)0>a.a.o(c,b[d])&&c.push(b[d]);return c},fb:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)c.push(b(a[d],d));return c},Ka:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c},ra:function(a,b){if(b instanceof Array)a.push.apply(a,b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},pa:function(b,c,d){var e=
a.a.o(a.a.zb(b),c);0>e?d&&b.push(c):d||b.splice(e,1)},ka:f,extend:c,Xa:d,Ya:f?d:c,D:b,Ca:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},ob:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},jc:function(b){b=a.a.V(b);for(var c=(b[0]&&b[0].ownerDocument||u).createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.$(b[d]));return c},ua:function(b,c){for(var d=0,e=b.length,h=[];d<e;d++){var m=b[d].cloneNode(!0);h.push(c?a.$(m):m)}return h},
da:function(b,c){a.a.ob(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d])},qc:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],h=e.parentNode,m=0,l=c.length;m<l;m++)h.insertBefore(c[m],e);m=0;for(l=d.length;m<l;m++)a.removeNode(d[m])}},za:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.splice(0,1);for(;1<a.length&&a[a.length-1].parentNode!==b;)a.length--;if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=0;c!==d;)a.push(c),
c=c.nextSibling;a.push(d)}}return a},sc:function(a,b){7>h?a.setAttribute("selected",b):a.selected=b},$a:function(a){return null===a||a===n?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},nd:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},Mc:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=
b;)a=a.parentNode;return!!a},nb:function(b){return a.a.Mc(b,b.ownerDocument.documentElement)},Qb:function(b){return!!a.a.Sb(b,a.a.nb)},A:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},Wb:function(b){return a.onError?function(){try{return b.apply(this,arguments)}catch(c){throw a.onError&&a.onError(c),c;}}:b},setTimeout:function(b,c){return setTimeout(a.a.Wb(b),c)},$b:function(b){setTimeout(function(){a.onError&&a.onError(b);throw b;},0)},p:function(b,c,d){var e=a.a.Wb(d);d=h&&m[c];if(a.options.useOnlyNativeEvents||
d||!v)if(d||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var l=function(a){e.call(b,a)},f="on"+c;b.attachEvent(f,l);a.a.F.oa(b,function(){b.detachEvent(f,l)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,e,!1);else v(b).bind(c,e)},Da:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.A(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==
d||"radio"==d):d=!1;if(a.options.useOnlyNativeEvents||!v||d)if("function"==typeof u.createEvent)if("function"==typeof b.dispatchEvent)d=u.createEvent(l[c]||"HTMLEvents"),d.initEvent(c,!0,!0,x,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");else v(b).trigger(c)},c:function(b){return a.H(b)?
b():b},zb:function(b){return a.H(b)?b.t():b},bb:function(b,c,d){var h;c&&("object"===typeof b.classList?(h=b.classList[d?"add":"remove"],a.a.q(c.match(r),function(a){h.call(b.classList,a)})):"string"===typeof b.className.baseVal?e(b.className,"baseVal",c,d):e(b,"className",c,d))},Za:function(b,c){var d=a.a.c(c);if(null===d||d===n)d="";var e=a.f.firstChild(b);!e||3!=e.nodeType||a.f.nextSibling(e)?a.f.da(b,[b.ownerDocument.createTextNode(d)]):e.data=d;a.a.Rc(b)},rc:function(a,b){a.name=b;if(7>=h)try{a.mergeAttributes(u.createElement("<input name='"+
a.name+"'/>"),!1)}catch(c){}},Rc:function(a){9<=h&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Nc:function(a){if(h){var b=a.style.width;a.style.width=0;a.style.width=b}},hd:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=[],e=b;e<=c;e++)d.push(e);return d},V:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},Yb:function(a){return g?Symbol(a):a},rd:6===h,sd:7===h,C:h,ec:function(b,c){for(var d=a.a.V(b.getElementsByTagName("input")).concat(a.a.V(b.getElementsByTagName("textarea"))),
e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},h=[],m=d.length-1;0<=m;m--)e(d[m])&&h.push(d[m]);return h},ed:function(b){return"string"==typeof b&&(b=a.a.$a(b))?F&&F.parse?F.parse(b):(new Function("return "+b))():null},Eb:function(b,c,d){if(!F||!F.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
return F.stringify(a.a.c(b),c,d)},fd:function(c,d,e){e=e||{};var h=e.params||{},m=e.includeFields||this.cc,l=c;if("object"==typeof c&&"form"===a.a.A(c))for(var l=c.action,f=m.length-1;0<=f;f--)for(var g=a.a.ec(c,m[f]),k=g.length-1;0<=k;k--)h[g[k].name]=g[k].value;d=a.a.c(d);var r=u.createElement("form");r.style.display="none";r.action=l;r.method="post";for(var n in d)c=u.createElement("input"),c.type="hidden",c.name=n,c.value=a.a.Eb(a.a.c(d[n])),r.appendChild(c);b(h,function(a,b){var c=u.createElement("input");
c.type="hidden";c.name=a;c.value=b;r.appendChild(c)});u.body.appendChild(r);e.submitter?e.submitter(r):r.submit();setTimeout(function(){r.parentNode.removeChild(r)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.q);a.b("utils.arrayFirst",a.a.Sb);a.b("utils.arrayFilter",a.a.Ka);a.b("utils.arrayGetDistinctValues",a.a.Tb);a.b("utils.arrayIndexOf",a.a.o);a.b("utils.arrayMap",a.a.fb);a.b("utils.arrayPushAll",a.a.ra);a.b("utils.arrayRemoveItem",a.a.La);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",
a.a.cc);a.b("utils.getFormFields",a.a.ec);a.b("utils.peekObservable",a.a.zb);a.b("utils.postJson",a.a.fd);a.b("utils.parseJson",a.a.ed);a.b("utils.registerEventHandler",a.a.p);a.b("utils.stringifyJson",a.a.Eb);a.b("utils.range",a.a.hd);a.b("utils.toggleDomNodeCssClass",a.a.bb);a.b("utils.triggerEvent",a.a.Da);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.D);a.b("utils.addOrRemoveItem",a.a.pa);a.b("utils.setTextContent",a.a.Za);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=
function(a){var c=this;if(1===arguments.length)return function(){return c.apply(a,arguments)};var d=Array.prototype.slice.call(arguments,1);return function(){var e=d.slice(0);e.push.apply(e,arguments);return c.apply(a,e)}});a.a.e=new function(){function a(b,g){var k=b[d];if(!k||"null"===k||!e[k]){if(!g)return n;k=b[d]="ko"+c++;e[k]={}}return e[k]}var c=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===n?n:e[d]},set:function(c,d,e){if(e!==n||a(c,!1)!==n)a(c,!0)[d]=
e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},I:function(){return c++ +d}}};a.b("utils.domData",a.a.e);a.b("utils.domData.clear",a.a.e.clear);a.a.F=new function(){function b(b,c){var e=a.a.e.get(b,d);e===n&&c&&(e=[],a.a.e.set(b,d,e));return e}function c(d){var e=b(d,!1);if(e)for(var e=e.slice(0),l=0;l<e.length;l++)e[l](d);a.a.e.clear(d);a.a.F.cleanExternalData(d);if(f[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&c(d)}var d=a.a.e.I(),e={1:!0,8:!0,9:!0},
f={1:!0,9:!0};return{oa:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},pc:function(c,e){var l=b(c,!1);l&&(a.a.La(l,e),0==l.length&&a.a.e.set(c,d,n))},$:function(b){if(e[b.nodeType]&&(c(b),f[b.nodeType])){var d=[];a.a.ra(d,b.getElementsByTagName("*"));for(var l=0,m=d.length;l<m;l++)c(d[l])}return b},removeNode:function(b){a.$(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){v&&"function"==typeof v.cleanData&&v.cleanData([a])}}};
a.$=a.a.F.$;a.removeNode=a.a.F.removeNode;a.b("cleanNode",a.$);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.F);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.F.oa);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.F.pc);(function(){var b=[0,"",""],c=[1,"<table>","</table>"],d=[3,"<table><tbody><tr>","</tr></tbody></table>"],e=[1,"<select multiple='multiple'>","</select>"],f={thead:c,tbody:c,tfoot:c,tr:[2,"<table><tbody>","</tbody></table>"],td:d,th:d,option:e,optgroup:e},
g=8>=a.a.C;a.a.ma=function(c,d){var e;if(v)if(v.parseHTML)e=v.parseHTML(c,d)||[];else{if((e=v.clean([c],d))&&e[0]){for(var h=e[0];h.parentNode&&11!==h.parentNode.nodeType;)h=h.parentNode;h.parentNode&&h.parentNode.removeChild(h)}}else{(e=d)||(e=u);var h=e.parentWindow||e.defaultView||x,r=a.a.$a(c).toLowerCase(),q=e.createElement("div"),p;p=(r=r.match(/^<([a-z]+)[ >]/))&&f[r[1]]||b;r=p[0];p="ignored<div>"+p[1]+c+p[2]+"</div>";"function"==typeof h.innerShiv?q.appendChild(h.innerShiv(p)):(g&&e.appendChild(q),
q.innerHTML=p,g&&q.parentNode.removeChild(q));for(;r--;)q=q.lastChild;e=a.a.V(q.lastChild.childNodes)}return e};a.a.Cb=function(b,c){a.a.ob(b);c=a.a.c(c);if(null!==c&&c!==n)if("string"!=typeof c&&(c=c.toString()),v)v(b).html(c);else for(var d=a.a.ma(c,b.ownerDocument),e=0;e<d.length;e++)b.appendChild(d[e])}})();a.b("utils.parseHtmlFragment",a.a.ma);a.b("utils.setHtml",a.a.Cb);a.M=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.M.lc(c.nodeValue);null!=f&&e.push({Lc:c,cd:f})}else if(1==c.nodeType)for(var f=
0,g=c.childNodes,k=g.length;f<k;f++)b(g[f],e)}var c={};return{wb:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},xc:function(a,b){var f=c[a];if(f===n)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),
!0}finally{delete c[a]}},yc:function(c,e){var f=[];b(c,f);for(var g=0,k=f.length;g<k;g++){var l=f[g].Lc,m=[l];e&&a.a.ra(m,e);a.M.xc(f[g].cd,m);l.nodeValue="";l.parentNode&&l.parentNode.removeChild(l)}},lc:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.M);a.b("memoization.memoize",a.M.wb);a.b("memoization.unmemoize",a.M.xc);a.b("memoization.parseMemoText",a.M.lc);a.b("memoization.unmemoizeDomNodeAndDescendants",a.M.yc);a.Y=function(){function b(){if(e)for(var b=
e,c=0,m;g<e;)if(m=d[g++]){if(g>b){if(5E3<=++c){g=e;a.a.$b(Error("'Too much recursion' after processing "+c+" task groups."));break}b=e}try{m()}catch(h){a.a.$b(h)}}}function c(){b();g=e=d.length=0}var d=[],e=0,f=1,g=0;return{scheduler:x.MutationObserver?function(a){var b=u.createElement("div");(new MutationObserver(a)).observe(b,{attributes:!0});return function(){b.classList.toggle("foo")}}(c):u&&"onreadystatechange"in u.createElement("script")?function(a){var b=u.createElement("script");b.onreadystatechange=
function(){b.onreadystatechange=null;u.documentElement.removeChild(b);b=null;a()};u.documentElement.appendChild(b)}:function(a){setTimeout(a,0)},Wa:function(b){e||a.Y.scheduler(c);d[e++]=b;return f++},cancel:function(a){a-=f-e;a>=g&&a<e&&(d[a]=null)},resetForTesting:function(){var a=e-g;g=e=d.length=0;return a},md:b}}();a.b("tasks",a.Y);a.b("tasks.schedule",a.Y.Wa);a.b("tasks.runEarly",a.Y.md);a.ya={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.B({read:b,write:function(e){clearTimeout(d);
d=a.a.setTimeout(function(){b(e)},c)}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);a.cb=!1;f="notifyWhenChangesStop"==e?V:U;a.Ta(function(a){return f(a,d)})},deferred:function(b,c){if(!0!==c)throw Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.");b.cb||(b.cb=!0,b.Ta(function(c){var e;return function(){a.Y.cancel(e);e=a.Y.Wa(c);b.notifySubscribers(n,"dirty")}}))},notify:function(a,c){a.equalityComparer=
"always"==c?null:J}};var T={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.ya);a.vc=function(b,c,d){this.ia=b;this.gb=c;this.Kc=d;this.R=!1;a.G(this,"dispose",this.k)};a.vc.prototype.k=function(){this.R=!0;this.Kc()};a.J=function(){a.a.Ya(this,D);D.rb(this)};var I="change",D={rb:function(a){a.K={};a.Nb=1},X:function(b,c,d){var e=this;d=d||I;var f=new a.vc(e,c?b.bind(c):b,function(){a.a.La(e.K[d],f);e.Ia&&e.Ia(d)});e.sa&&e.sa(d);e.K[d]||(e.K[d]=[]);e.K[d].push(f);return f},notifySubscribers:function(b,
c){c=c||I;c===I&&this.zc();if(this.Pa(c))try{a.l.Ub();for(var d=this.K[c].slice(0),e=0,f;f=d[e];++e)f.R||f.gb(b)}finally{a.l.end()}},Na:function(){return this.Nb},Uc:function(a){return this.Na()!==a},zc:function(){++this.Nb},Ta:function(b){var c=this,d=a.H(c),e,f,g;c.Ha||(c.Ha=c.notifySubscribers,c.notifySubscribers=W);var k=b(function(){c.Mb=!1;d&&g===c&&(g=c());e=!1;c.tb(f,g)&&c.Ha(f=g)});c.Lb=function(a){c.Mb=e=!0;g=a;k()};c.Kb=function(a){e||(f=a,c.Ha(a,"beforeChange"))}},Pa:function(a){return this.K[a]&&
this.K[a].length},Sc:function(b){if(b)return this.K[b]&&this.K[b].length||0;var c=0;a.a.D(this.K,function(a,b){"dirty"!==a&&(c+=b.length)});return c},tb:function(a,c){return!this.equalityComparer||!this.equalityComparer(a,c)},extend:function(b){var c=this;b&&a.a.D(b,function(b,e){var f=a.ya[b];"function"==typeof f&&(c=f(c,e)||c)});return c}};a.G(D,"subscribe",D.X);a.G(D,"extend",D.extend);a.G(D,"getSubscriptionsCount",D.Sc);a.a.ka&&a.a.Xa(D,Function.prototype);a.J.fn=D;a.hc=function(a){return null!=
a&&"function"==typeof a.X&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.J);a.b("isSubscribable",a.hc);a.va=a.l=function(){function b(a){d.push(e);e=a}function c(){e=d.pop()}var d=[],e,f=0;return{Ub:b,end:c,oc:function(b){if(e){if(!a.hc(b))throw Error("Only subscribable things can act as dependencies");e.gb.call(e.Gc,b,b.Cc||(b.Cc=++f))}},w:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c()}},Aa:function(){if(e)return e.m.Aa()},Sa:function(){if(e)return e.Sa}}}();a.b("computedContext",
a.va);a.b("computedContext.getDependenciesCount",a.va.Aa);a.b("computedContext.isInitial",a.va.Sa);a.b("ignoreDependencies",a.qd=a.l.w);var E=a.a.Yb("_latestValue");a.N=function(b){function c(){if(0<arguments.length)return c.tb(c[E],arguments[0])&&(c.ga(),c[E]=arguments[0],c.fa()),this;a.l.oc(c);return c[E]}c[E]=b;a.a.ka||a.a.extend(c,a.J.fn);a.J.fn.rb(c);a.a.Ya(c,B);a.options.deferUpdates&&a.ya.deferred(c,!0);return c};var B={equalityComparer:J,t:function(){return this[E]},fa:function(){this.notifySubscribers(this[E])},
ga:function(){this.notifySubscribers(this[E],"beforeChange")}};a.a.ka&&a.a.Xa(B,a.J.fn);var H=a.N.gd="__ko_proto__";B[H]=a.N;a.Oa=function(b,c){return null===b||b===n||b[H]===n?!1:b[H]===c?!0:a.Oa(b[H],c)};a.H=function(b){return a.Oa(b,a.N)};a.Ba=function(b){return"function"==typeof b&&b[H]===a.N||"function"==typeof b&&b[H]===a.B&&b.Vc?!0:!1};a.b("observable",a.N);a.b("isObservable",a.H);a.b("isWriteableObservable",a.Ba);a.b("isWritableObservable",a.Ba);a.b("observable.fn",B);a.G(B,"peek",B.t);a.G(B,
"valueHasMutated",B.fa);a.G(B,"valueWillMutate",B.ga);a.la=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");b=a.N(b);a.a.Ya(b,a.la.fn);return b.extend({trackArrayChanges:!0})};a.la.fn={remove:function(b){for(var c=this.t(),d=[],e="function"!=typeof b||a.H(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var g=c[f];e(g)&&(0===d.length&&this.ga(),d.push(g),c.splice(f,1),f--)}d.length&&
this.fa();return d},removeAll:function(b){if(b===n){var c=this.t(),d=c.slice(0);this.ga();c.splice(0,c.length);this.fa();return d}return b?this.remove(function(c){return 0<=a.a.o(b,c)}):[]},destroy:function(b){var c=this.t(),d="function"!=typeof b||a.H(b)?function(a){return a===b}:b;this.ga();for(var e=c.length-1;0<=e;e--)d(c[e])&&(c[e]._destroy=!0);this.fa()},destroyAll:function(b){return b===n?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.o(b,c)}):[]},indexOf:function(b){var c=
this();return a.a.o(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.ga(),this.t()[d]=c,this.fa())}};a.a.ka&&a.a.Xa(a.la.fn,a.N.fn);a.a.q("pop push reverse shift sort splice unshift".split(" "),function(b){a.la.fn[b]=function(){var a=this.t();this.ga();this.Vb(a,b,arguments);var d=a[b].apply(a,arguments);this.fa();return d===a?this:d}});a.a.q(["slice"],function(b){a.la.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.b("observableArray",a.la);a.ya.trackArrayChanges=function(b,
c){function d(){if(!e){e=!0;var c=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==I||++k;return c.apply(this,arguments)};var d=[].concat(b.t()||[]);f=null;g=b.X(function(c){c=[].concat(c||[]);if(b.Pa("arrayChange")){var e;if(!f||1<k)f=a.a.ib(d,c,b.hb);e=f}d=c;f=null;k=0;e&&e.length&&b.notifySubscribers(e,"arrayChange")})}}b.hb={};c&&"object"==typeof c&&a.a.extend(b.hb,c);b.hb.sparse=!0;if(!b.Vb){var e=!1,f=null,g,k=0,l=b.sa,m=b.Ia;b.sa=function(a){l&&l.call(b,a);"arrayChange"===a&&d()};
b.Ia=function(a){m&&m.call(b,a);"arrayChange"!==a||b.Pa("arrayChange")||(g.k(),e=!1)};b.Vb=function(b,c,d){function m(a,b,c){return l[l.length]={status:a,value:b,index:c}}if(e&&!k){var l=[],g=b.length,t=d.length,G=0;switch(c){case "push":G=g;case "unshift":for(c=0;c<t;c++)m("added",d[c],G+c);break;case "pop":G=g-1;case "shift":g&&m("deleted",b[G],G);break;case "splice":c=Math.min(Math.max(0,0>d[0]?g+d[0]:d[0]),g);for(var g=1===t?g:Math.min(c+(d[1]||0),g),t=c+t-2,G=Math.max(g,t),P=[],n=[],Q=2;c<G;++c,
++Q)c<g&&n.push(m("deleted",b[c],c)),c<t&&P.push(m("added",d[Q],c));a.a.dc(n,P);break;default:return}f=l}}}};var s=a.a.Yb("_state");a.m=a.B=function(b,c,d){function e(){if(0<arguments.length){if("function"===typeof f)f.apply(g.pb,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");return this}a.l.oc(e);(g.S||g.s&&e.Qa())&&e.aa();return g.T}"object"===typeof b?d=b:(d=d||{},b&&(d.read=
b));if("function"!=typeof d.read)throw Error("Pass a function that returns the value of the ko.computed");var f=d.write,g={T:n,S:!0,Ra:!1,Fb:!1,R:!1,Va:!1,s:!1,jd:d.read,pb:c||d.owner,i:d.disposeWhenNodeIsRemoved||d.i||null,wa:d.disposeWhen||d.wa,mb:null,r:{},L:0,bc:null};e[s]=g;e.Vc="function"===typeof f;a.a.ka||a.a.extend(e,a.J.fn);a.J.fn.rb(e);a.a.Ya(e,z);d.pure?(g.Va=!0,g.s=!0,a.a.extend(e,$)):d.deferEvaluation&&a.a.extend(e,aa);a.options.deferUpdates&&a.ya.deferred(e,!0);g.i&&(g.Fb=!0,g.i.nodeType||
(g.i=null));g.s||d.deferEvaluation||e.aa();g.i&&e.ba()&&a.a.F.oa(g.i,g.mb=function(){e.k()});return e};var z={equalityComparer:J,Aa:function(){return this[s].L},Pb:function(a,c,d){if(this[s].Va&&c===this)throw Error("A 'pure' computed must not be called recursively");this[s].r[a]=d;d.Ga=this[s].L++;d.na=c.Na()},Qa:function(){var a,c,d=this[s].r;for(a in d)if(d.hasOwnProperty(a)&&(c=d[a],c.ia.Uc(c.na)))return!0},bd:function(){this.Fa&&!this[s].Ra&&this.Fa()},ba:function(){return this[s].S||0<this[s].L},
ld:function(){this.Mb||this.ac()},uc:function(a){if(a.cb&&!this[s].i){var c=a.X(this.bd,this,"dirty"),d=a.X(this.ld,this);return{ia:a,k:function(){c.k();d.k()}}}return a.X(this.ac,this)},ac:function(){var b=this,c=b.throttleEvaluation;c&&0<=c?(clearTimeout(this[s].bc),this[s].bc=a.a.setTimeout(function(){b.aa(!0)},c)):b.Fa?b.Fa():b.aa(!0)},aa:function(b){var c=this[s],d=c.wa;if(!c.Ra&&!c.R){if(c.i&&!a.a.nb(c.i)||d&&d()){if(!c.Fb){this.k();return}}else c.Fb=!1;c.Ra=!0;try{this.Qc(b)}finally{c.Ra=!1}c.L||
this.k()}},Qc:function(b){var c=this[s],d=c.Va?n:!c.L,e={Hc:this,Ma:c.r,lb:c.L};a.l.Ub({Gc:e,gb:Y,m:this,Sa:d});c.r={};c.L=0;e=this.Pc(c,e);this.tb(c.T,e)&&(c.s||this.notifySubscribers(c.T,"beforeChange"),c.T=e,c.s?this.zc():b&&this.notifySubscribers(c.T));d&&this.notifySubscribers(c.T,"awake")},Pc:function(b,c){try{var d=b.jd;return b.pb?d.call(b.pb):d()}finally{a.l.end(),c.lb&&!b.s&&a.a.D(c.Ma,X),b.S=!1}},t:function(){var a=this[s];(a.S&&!a.L||a.s&&this.Qa())&&this.aa();return a.T},Ta:function(b){a.J.fn.Ta.call(this,
b);this.Fa=function(){this.Kb(this[s].T);this[s].S=!0;this.Lb(this)}},k:function(){var b=this[s];!b.s&&b.r&&a.a.D(b.r,function(a,b){b.k&&b.k()});b.i&&b.mb&&a.a.F.pc(b.i,b.mb);b.r=null;b.L=0;b.R=!0;b.S=!1;b.s=!1;b.i=null}},$={sa:function(b){var c=this,d=c[s];if(!d.R&&d.s&&"change"==b){d.s=!1;if(d.S||c.Qa())d.r=null,d.L=0,d.S=!0,c.aa();else{var e=[];a.a.D(d.r,function(a,b){e[b.Ga]=a});a.a.q(e,function(a,b){var e=d.r[a],l=c.uc(e.ia);l.Ga=b;l.na=e.na;d.r[a]=l})}d.R||c.notifySubscribers(d.T,"awake")}},
Ia:function(b){var c=this[s];c.R||"change"!=b||this.Pa("change")||(a.a.D(c.r,function(a,b){b.k&&(c.r[a]={ia:b.ia,Ga:b.Ga,na:b.na},b.k())}),c.s=!0,this.notifySubscribers(n,"asleep"))},Na:function(){var b=this[s];b.s&&(b.S||this.Qa())&&this.aa();return a.J.fn.Na.call(this)}},aa={sa:function(a){"change"!=a&&"beforeChange"!=a||this.t()}};a.a.ka&&a.a.Xa(z,a.J.fn);var R=a.N.gd;a.m[R]=a.N;z[R]=a.m;a.Xc=function(b){return a.Oa(b,a.m)};a.Yc=function(b){return a.Oa(b,a.m)&&b[s]&&b[s].Va};a.b("computed",a.m);
a.b("dependentObservable",a.m);a.b("isComputed",a.Xc);a.b("isPureComputed",a.Yc);a.b("computed.fn",z);a.G(z,"peek",z.t);a.G(z,"dispose",z.k);a.G(z,"isActive",z.ba);a.G(z,"getDependenciesCount",z.Aa);a.nc=function(b,c){if("function"===typeof b)return a.m(b,c,{pure:!0});b=a.a.extend({},b);b.pure=!0;return a.m(b,c)};a.b("pureComputed",a.nc);(function(){function b(a,f,g){g=g||new d;a=f(a);if("object"!=typeof a||null===a||a===n||a instanceof RegExp||a instanceof Date||a instanceof String||a instanceof
Number||a instanceof Boolean)return a;var k=a instanceof Array?[]:{};g.save(a,k);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":k[c]=d;break;case "object":case "undefined":var h=g.get(d);k[c]=h!==n?h:b(d,f,g)}});return k}function c(a,b){if(a instanceof Array){for(var c=0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=[];this.Ib=[]}a.wc=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");
return b(c,function(b){for(var c=0;a.H(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.wc(b);return a.a.Eb(b,c,d)};d.prototype={save:function(b,c){var d=a.a.o(this.keys,b);0<=d?this.Ib[d]=c:(this.keys.push(b),this.Ib.push(c))},get:function(b){b=a.a.o(this.keys,b);return 0<=b?this.Ib[b]:n}}})();a.b("toJS",a.wc);a.b("toJSON",a.toJSON);(function(){a.j={u:function(b){switch(a.a.A(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?a.a.e.get(b,a.d.options.xb):7>=a.a.C?b.getAttributeNode("value")&&
b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.j.u(b.options[b.selectedIndex]):n;default:return b.value}},ha:function(b,c,d){switch(a.a.A(b)){case "option":switch(typeof c){case "string":a.a.e.set(b,a.d.options.xb,n);"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__;b.value=c;break;default:a.a.e.set(b,a.d.options.xb,c),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof c?c:""}break;case "select":if(""===c||
null===c)c=n;for(var e=-1,f=0,g=b.options.length,k;f<g;++f)if(k=a.j.u(b.options[f]),k==c||""==k&&c===n){e=f;break}if(d||0<=e||c===n&&1<b.size)b.selectedIndex=e;break;default:if(null===c||c===n)c="";b.value=c}}}})();a.b("selectExtensions",a.j);a.b("selectExtensions.readValue",a.j.u);a.b("selectExtensions.writeValue",a.j.ha);a.h=function(){function b(b){b=a.a.$a(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=[],d=b.match(e),r,k=[],p=0;if(d){d.push(",");for(var A=0,y;y=d[A];++A){var t=y.charCodeAt(0);
if(44===t){if(0>=p){c.push(r&&k.length?{key:r,value:k.join("")}:{unknown:r||k.join("")});r=p=0;k=[];continue}}else if(58===t){if(!p&&!r&&1===k.length){r=k.pop();continue}}else 47===t&&A&&1<y.length?(t=d[A-1].match(f))&&!g[t[0]]&&(b=b.substr(b.indexOf(y)+1),d=b.match(e),d.push(","),A=-1,y="/"):40===t||123===t||91===t?++p:41===t||125===t||93===t?--p:r||k.length||34!==t&&39!==t||(y=y.slice(1,-1));k.push(y)}}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,
e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,g={"in":1,"return":1,"typeof":1},k={};return{ta:[],ea:k,yb:b,Ua:function(e,m){function h(b,e){var m;if(!A){var l=a.getBindingHandler(b);if(l&&l.preprocess&&!(e=l.preprocess(e,b,h)))return;if(l=k[b])m=e,0<=a.a.o(c,m)?m=!1:(l=m.match(d),m=null===l?!1:l[1]?"Object("+l[1]+")"+l[2]:m),l=m;l&&g.push("'"+b+"':function(_z){"+m+"=_z}")}p&&(e=
"function(){return "+e+" }");f.push("'"+b+"':"+e)}m=m||{};var f=[],g=[],p=m.valueAccessors,A=m.bindingParams,y="string"===typeof e?b(e):e;a.a.q(y,function(a){h(a.key||a.unknown,a.value)});g.length&&h("_ko_property_writers","{"+g.join(",")+" }");return f.join(",")},ad:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;return!1},Ea:function(b,c,d,e,f){if(b&&a.H(b))!a.Ba(b)||f&&b.t()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.h);a.b("expressionRewriting.bindingRewriteValidators",
a.h.ta);a.b("expressionRewriting.parseObjectLiteral",a.h.yb);a.b("expressionRewriting.preProcessBindings",a.h.Ua);a.b("expressionRewriting._twoWayBindings",a.h.ea);a.b("jsonExpressionRewriting",a.h);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.h.Ua);(function(){function b(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&k.test(f?a.text:a.nodeValue)}function d(a,d){for(var e=a,f=1,l=[];e=e.nextSibling;){if(c(e)&&(f--,0===f))return l;l.push(e);
b(e)&&f++}if(!d)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var c=d(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var f=u&&"\x3c!--test--\x3e"===u.createComment("test").text,g=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,k=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,l={ul:!0,ol:!0};a.f={Z:{},childNodes:function(a){return b(a)?d(a):a.childNodes},xa:function(c){if(b(c)){c=a.f.childNodes(c);for(var d=
0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.ob(c)},da:function(c,d){if(b(c)){a.f.xa(c);for(var e=c.nextSibling,f=0,l=d.length;f<l;f++)e.parentNode.insertBefore(d[f],e)}else a.a.da(c,d)},mc:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},gc:function(c,d,e){e?b(c)?c.parentNode.insertBefore(d,e.nextSibling):e.nextSibling?c.insertBefore(d,e.nextSibling):c.appendChild(d):a.f.mc(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||
c(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&c(a.nextSibling)?null:a.nextSibling},Tc:b,pd:function(a){return(a=(f?a.text:a.nodeValue).match(g))?a[1]:null},kc:function(d){if(l[a.a.A(d)]){var h=d.firstChild;if(h){do if(1===h.nodeType){var f;f=h.firstChild;var g=null;if(f){do if(g)g.push(f);else if(b(f)){var k=e(f,!0);k?f=k:g=[f]}else c(f)&&(g=[f]);while(f=f.nextSibling)}if(f=g)for(g=h.nextSibling,k=0;k<f.length;k++)g?d.insertBefore(f[k],
g):d.appendChild(f[k])}while(h=h.nextSibling)}}}}})();a.b("virtualElements",a.f);a.b("virtualElements.allowedBindings",a.f.Z);a.b("virtualElements.emptyNode",a.f.xa);a.b("virtualElements.insertAfter",a.f.gc);a.b("virtualElements.prepend",a.f.mc);a.b("virtualElements.setDomNodeChildren",a.f.da);(function(){a.Q=function(){this.Fc={}};a.a.extend(a.Q.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=b.getAttribute("data-bind")||a.g.getComponentNameForNode(b);case 8:return a.f.Tc(b);
default:return!1}},getBindings:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b):null;return a.g.Ob(d,b,c,!1)},getBindingAccessors:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b,{valueAccessors:!0}):null;return a.g.Ob(d,b,c,!0)},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");case 8:return a.f.pd(b);default:return null}},parseBindingsString:function(b,c,d,e){try{var f=this.Fc,g=b+(e&&e.valueAccessors||
""),k;if(!(k=f[g])){var l,m="with($context){with($data||{}){return{"+a.h.Ua(b,e)+"}}}";l=new Function("$context","$element",m);k=f[g]=l}return k(c,d)}catch(h){throw h.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+h.message,h;}}});a.Q.instance=new a.Q})();a.b("bindingProvider",a.Q);(function(){function b(a){return function(){return a}}function c(a){return a()}function d(b){return a.a.Ca(a.l.w(b),function(a,c){return function(){return b()[c]}})}function e(c,e,h){return"function"===
typeof c?d(c.bind(null,e,h)):a.a.Ca(c,b)}function f(a,b){return d(this.getBindings.bind(this,a,b))}function g(b,c,d){var e,h=a.f.firstChild(c),f=a.Q.instance,m=f.preprocessNode;if(m){for(;e=h;)h=a.f.nextSibling(e),m.call(f,e);h=a.f.firstChild(c)}for(;e=h;)h=a.f.nextSibling(e),k(b,e,d)}function k(b,c,d){var e=!0,h=1===c.nodeType;h&&a.f.kc(c);if(h&&d||a.Q.instance.nodeHasBindings(c))e=m(c,null,b,d).shouldBindDescendants;e&&!r[a.a.A(c)]&&g(b,c,!h)}function l(b){var c=[],d={},e=[];a.a.D(b,function Z(h){if(!d[h]){var f=
a.getBindingHandler(h);f&&(f.after&&(e.push(h),a.a.q(f.after,function(c){if(b[c]){if(-1!==a.a.o(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));Z(c)}}),e.length--),c.push({key:h,fc:f}));d[h]=!0}});return c}function m(b,d,e,h){var m=a.a.e.get(b,q);if(!d){if(m)throw Error("You cannot apply bindings multiple times to the same element.");a.a.e.set(b,q,!0)}!m&&h&&a.tc(b,e);var g;if(d&&"function"!==typeof d)g=d;else{var k=a.Q.instance,r=k.getBindingAccessors||
f,p=a.B(function(){(g=d?d(e,b):r.call(k,b,e))&&e.P&&e.P();return g},null,{i:b});g&&p.ba()||(p=null)}var u;if(g){var v=p?function(a){return function(){return c(p()[a])}}:function(a){return g[a]},s=function(){return a.a.Ca(p?p():g,c)};s.get=function(a){return g[a]&&c(v(a))};s.has=function(a){return a in g};h=l(g);a.a.q(h,function(c){var d=c.fc.init,h=c.fc.update,f=c.key;if(8===b.nodeType&&!a.f.Z[f])throw Error("The binding '"+f+"' cannot be used with virtual elements");try{"function"==typeof d&&a.l.w(function(){var a=
d(b,v(f),s,e.$data,e);if(a&&a.controlsDescendantBindings){if(u!==n)throw Error("Multiple bindings ("+u+" and "+f+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");u=f}}),"function"==typeof h&&a.B(function(){h(b,v(f),s,e.$data,e)},null,{i:b})}catch(m){throw m.message='Unable to process binding "'+f+": "+g[f]+'"\nMessage: '+m.message,m;}})}return{shouldBindDescendants:u===n}}function h(b){return b&&b instanceof a.U?b:new a.U(b)}
a.d={};var r={script:!0,textarea:!0,template:!0};a.getBindingHandler=function(b){return a.d[b]};a.U=function(b,c,d,e){var h=this,f="function"==typeof b&&!a.H(b),m,g=a.B(function(){var m=f?b():b,l=a.a.c(m);c?(c.P&&c.P(),a.a.extend(h,c),g&&(h.P=g)):(h.$parents=[],h.$root=l,h.ko=a);h.$rawData=m;h.$data=l;d&&(h[d]=l);e&&e(h,c,l);return h.$data},null,{wa:function(){return m&&!a.a.Qb(m)},i:!0});g.ba()&&(h.P=g,g.equalityComparer=null,m=[],g.Ac=function(b){m.push(b);a.a.F.oa(b,function(b){a.a.La(m,b);m.length||
(g.k(),h.P=g=n)})})};a.U.prototype.createChildContext=function(b,c,d){return new a.U(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};a.U.prototype.extend=function(b){return new a.U(this.P||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?b():b)})};var q=a.a.e.I(),p=a.a.e.I();a.tc=function(b,c){if(2==arguments.length)a.a.e.set(b,p,c),c.P&&c.P.Ac(b);else return a.a.e.get(b,
p)};a.Ja=function(b,c,d){1===b.nodeType&&a.f.kc(b);return m(b,c,h(d),!0)};a.Dc=function(b,c,d){d=h(d);return a.Ja(b,e(c,d,b),d)};a.eb=function(a,b){1!==b.nodeType&&8!==b.nodeType||g(h(a),b,!0)};a.Rb=function(a,b){!v&&x.jQuery&&(v=x.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||x.document.body;k(h(a),b,!0)};a.kb=function(b){switch(b.nodeType){case 1:case 8:var c=a.tc(b);if(c)return c;
if(b.parentNode)return a.kb(b.parentNode)}return n};a.Jc=function(b){return(b=a.kb(b))?b.$data:n};a.b("bindingHandlers",a.d);a.b("applyBindings",a.Rb);a.b("applyBindingsToDescendants",a.eb);a.b("applyBindingAccessorsToNode",a.Ja);a.b("applyBindingsToNode",a.Dc);a.b("contextFor",a.kb);a.b("dataFor",a.Jc)})();(function(b){function c(c,e){var m=f.hasOwnProperty(c)?f[c]:b,h;m?m.X(e):(m=f[c]=new a.J,m.X(e),d(c,function(b,d){var e=!(!d||!d.synchronous);g[c]={definition:b,Zc:e};delete f[c];h||e?m.notifySubscribers(b):
a.Y.Wa(function(){m.notifySubscribers(b)})}),h=!0)}function d(a,b){e("getConfig",[a],function(c){c?e("loadComponent",[a,c],function(a){b(a,c)}):b(null,null)})}function e(c,d,f,h){h||(h=a.g.loaders.slice(0));var g=h.shift();if(g){var q=g[c];if(q){var p=!1;if(q.apply(g,d.concat(function(a){p?f(null):null!==a?f(a):e(c,d,f,h)}))!==b&&(p=!0,!g.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");}else e(c,d,f,h)}else f(null)}
var f={},g={};a.g={get:function(d,e){var f=g.hasOwnProperty(d)?g[d]:b;f?f.Zc?a.l.w(function(){e(f.definition)}):a.Y.Wa(function(){e(f.definition)}):c(d,e)},Xb:function(a){delete g[a]},Jb:e};a.g.loaders=[];a.b("components",a.g);a.b("components.get",a.g.get);a.b("components.clearCachedDefinition",a.g.Xb)})();(function(){function b(b,c,d,e){function g(){0===--y&&e(k)}var k={},y=2,t=d.template;d=d.viewModel;t?f(c,t,function(c){a.g.Jb("loadTemplate",[b,c],function(a){k.template=a;g()})}):g();d?f(c,d,function(c){a.g.Jb("loadViewModel",
[b,c],function(a){k[l]=a;g()})}):g()}function c(a,b,d){if("function"===typeof b)d(function(a){return new b(a)});else if("function"===typeof b[l])d(b[l]);else if("instance"in b){var e=b.instance;d(function(){return e})}else"viewModel"in b?c(a,b.viewModel,d):a("Unknown viewModel value: "+b)}function d(b){switch(a.a.A(b)){case "script":return a.a.ma(b.text);case "textarea":return a.a.ma(b.value);case "template":if(e(b.content))return a.a.ua(b.content.childNodes)}return a.a.ua(b.childNodes)}function e(a){return x.DocumentFragment?
a instanceof DocumentFragment:a&&11===a.nodeType}function f(a,b,c){"string"===typeof b.require?O||x.require?(O||x.require)([b.require],c):a("Uses require, but no AMD loader is present"):c(b)}function g(a){return function(b){throw Error("Component '"+a+"': "+b);}}var k={};a.g.register=function(b,c){if(!c)throw Error("Invalid configuration for "+b);if(a.g.ub(b))throw Error("Component "+b+" is already registered");k[b]=c};a.g.ub=function(a){return k.hasOwnProperty(a)};a.g.od=function(b){delete k[b];
a.g.Xb(b)};a.g.Zb={getConfig:function(a,b){b(k.hasOwnProperty(a)?k[a]:null)},loadComponent:function(a,c,d){var e=g(a);f(e,c,function(c){b(a,e,c,d)})},loadTemplate:function(b,c,f){b=g(b);if("string"===typeof c)f(a.a.ma(c));else if(c instanceof Array)f(c);else if(e(c))f(a.a.V(c.childNodes));else if(c.element)if(c=c.element,x.HTMLElement?c instanceof HTMLElement:c&&c.tagName&&1===c.nodeType)f(d(c));else if("string"===typeof c){var l=u.getElementById(c);l?f(d(l)):b("Cannot find element with ID "+c)}else b("Unknown element type: "+
c);else b("Unknown template value: "+c)},loadViewModel:function(a,b,d){c(g(a),b,d)}};var l="createViewModel";a.b("components.register",a.g.register);a.b("components.isRegistered",a.g.ub);a.b("components.unregister",a.g.od);a.b("components.defaultLoader",a.g.Zb);a.g.loaders.push(a.g.Zb);a.g.Bc=k})();(function(){function b(b,e){var f=b.getAttribute("params");if(f){var f=c.parseBindingsString(f,e,b,{valueAccessors:!0,bindingParams:!0}),f=a.a.Ca(f,function(c){return a.m(c,null,{i:b})}),g=a.a.Ca(f,function(c){var e=
c.t();return c.ba()?a.m({read:function(){return a.a.c(c())},write:a.Ba(e)&&function(a){c()(a)},i:b}):e});g.hasOwnProperty("$raw")||(g.$raw=f);return g}return{$raw:{}}}a.g.getComponentNameForNode=function(b){var c=a.a.A(b);if(a.g.ub(c)&&(-1!=c.indexOf("-")||"[object HTMLUnknownElement]"==""+b||8>=a.a.C&&b.tagName===c))return c};a.g.Ob=function(c,e,f,g){if(1===e.nodeType){var k=a.g.getComponentNameForNode(e);if(k){c=c||{};if(c.component)throw Error('Cannot use the "component" binding on a custom element matching a component');
var l={name:k,params:b(e,f)};c.component=g?function(){return l}:l}}return c};var c=new a.Q;9>a.a.C&&(a.g.register=function(a){return function(b){u.createElement(b);return a.apply(this,arguments)}}(a.g.register),u.createDocumentFragment=function(b){return function(){var c=b(),f=a.g.Bc,g;for(g in f)f.hasOwnProperty(g)&&c.createElement(g);return c}}(u.createDocumentFragment))})();(function(b){function c(b,c,d){c=c.template;if(!c)throw Error("Component '"+b+"' has no template");b=a.a.ua(c);a.f.da(d,b)}
function d(a,b,c,d){var e=a.createViewModel;return e?e.call(a,d,{element:b,templateNodes:c}):d}var e=0;a.d.component={init:function(f,g,k,l,m){function h(){var a=r&&r.dispose;"function"===typeof a&&a.call(r);q=r=null}var r,q,p=a.a.V(a.f.childNodes(f));a.a.F.oa(f,h);a.m(function(){var l=a.a.c(g()),k,t;"string"===typeof l?k=l:(k=a.a.c(l.name),t=a.a.c(l.params));if(!k)throw Error("No component name specified");var n=q=++e;a.g.get(k,function(e){if(q===n){h();if(!e)throw Error("Unknown component '"+k+
"'");c(k,e,f);var g=d(e,f,p,t);e=m.createChildContext(g,b,function(a){a.$component=g;a.$componentTemplateNodes=p});r=g;a.eb(e,f)}})},null,{i:f});return{controlsDescendantBindings:!0}}};a.f.Z.component=!0})();var S={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,c){var d=a.a.c(c())||{};a.a.D(d,function(c,d){d=a.a.c(d);var g=!1===d||null===d||d===n;g&&b.removeAttribute(c);8>=a.a.C&&c in S?(c=S[c],g?b.removeAttribute(c):b[c]=d):g||b.setAttribute(c,d.toString());"name"===c&&a.a.rc(b,
g?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,c,d){function e(){var e=b.checked,f=p?g():e;if(!a.va.Sa()&&(!l||e)){var m=a.l.w(c);if(h){var k=r?m.t():m;q!==f?(e&&(a.a.pa(k,f,!0),a.a.pa(k,q,!1)),q=f):a.a.pa(k,f,e);r&&a.Ba(m)&&m(k)}else a.h.Ea(m,d,"checked",f,!0)}}function f(){var d=a.a.c(c());b.checked=h?0<=a.a.o(d,g()):k?d:g()===d}var g=a.nc(function(){return d.has("checkedValue")?a.a.c(d.get("checkedValue")):d.has("value")?a.a.c(d.get("value")):b.value}),k=
"checkbox"==b.type,l="radio"==b.type;if(k||l){var m=c(),h=k&&a.a.c(m)instanceof Array,r=!(h&&m.push&&m.splice),q=h?g():n,p=l||h;l&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.m(e,null,{i:b});a.a.p(b,"click",e);a.m(f,null,{i:b});m=n}}};a.h.ea.checked=!0;a.d.checkedValue={update:function(b,c){b.value=a.a.c(c())}}})();a.d.css={update:function(b,c){var d=a.a.c(c());null!==d&&"object"==typeof d?a.a.D(d,function(c,d){d=a.a.c(d);a.a.bb(b,c,d)}):(d=a.a.$a(String(d||"")),a.a.bb(b,b.__ko__cssValue,
!1),b.__ko__cssValue=d,a.a.bb(b,d,!0))}};a.d.enable={update:function(b,c){var d=a.a.c(c());d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,c){a.d.enable.update(b,function(){return!a.a.c(c())})}};a.d.event={init:function(b,c,d,e,f){var g=c()||{};a.a.D(g,function(g){"string"==typeof g&&a.a.p(b,g,function(b){var m,h=c()[g];if(h){try{var r=a.a.V(arguments);e=f.$data;r.unshift(e);m=h.apply(e,r)}finally{!0!==m&&(b.preventDefault?b.preventDefault():
b.returnValue=!1)}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={ic:function(b){return function(){var c=b(),d=a.a.zb(c);if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.W.sb};a.a.c(c);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.W.sb}}},init:function(b,c){return a.d.template.init(b,
a.d.foreach.ic(c))},update:function(b,c,d,e,f){return a.d.template.update(b,a.d.foreach.ic(c),d,e,f)}};a.h.ta.foreach=!1;a.f.Z.foreach=!0;a.d.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var f=b.ownerDocument;if("activeElement"in f){var g;try{g=f.activeElement}catch(h){g=f.body}e=g===b}f=c();a.h.Ea(f,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),g=e.bind(null,!1);a.a.p(b,"focus",f);a.a.p(b,"focusin",f);a.a.p(b,"blur",g);a.a.p(b,
"focusout",g)},update:function(b,c){var d=!!a.a.c(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===d||(d?b.focus():b.blur(),!d&&b.__ko_hasfocusLastValue&&b.ownerDocument.body.focus(),a.l.w(a.a.Da,null,[b,d?"focusin":"focusout"]))}};a.h.ea.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.h.ea.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Cb(b,c())}};K("if");K("ifnot",!1,!0);K("with",!0,!1,function(a,c){return a.createChildContext(c)});var L={};
a.d.options={init:function(b){if("select"!==a.a.A(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.Ka(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function g(c,e){if(A&&h)a.j.ha(b,a.a.c(d.get("value")),!0);else if(p.length){var f=0<=a.a.o(p,a.j.u(e[0]));a.a.sc(e[0],f);A&&!f&&a.l.w(a.a.Da,null,[b,
"change"])}}var k=b.multiple,l=0!=b.length&&k?b.scrollTop:null,m=a.a.c(c()),h=d.get("valueAllowUnset")&&d.has("value"),r=d.get("optionsIncludeDestroyed");c={};var q,p=[];h||(k?p=a.a.fb(e(),a.j.u):0<=b.selectedIndex&&p.push(a.j.u(b.options[b.selectedIndex])));m&&("undefined"==typeof m.length&&(m=[m]),q=a.a.Ka(m,function(b){return r||b===n||null===b||!a.a.c(b._destroy)}),d.has("optionsCaption")&&(m=a.a.c(d.get("optionsCaption")),null!==m&&m!==n&&q.unshift(L)));var A=!1;c.beforeRemove=function(a){b.removeChild(a)};
m=g;d.has("optionsAfterRender")&&"function"==typeof d.get("optionsAfterRender")&&(m=function(b,c){g(0,c);a.l.w(d.get("optionsAfterRender"),null,[c[0],b!==L?b:n])});a.a.Bb(b,q,function(c,e,g){g.length&&(p=!h&&g[0].selected?[a.j.u(g[0])]:[],A=!0);e=b.ownerDocument.createElement("option");c===L?(a.a.Za(e,d.get("optionsCaption")),a.j.ha(e,n)):(g=f(c,d.get("optionsValue"),c),a.j.ha(e,a.a.c(g)),c=f(c,d.get("optionsText"),g),a.a.Za(e,c));return[e]},c,m);a.l.w(function(){h?a.j.ha(b,a.a.c(d.get("value")),
!0):(k?p.length&&e().length<p.length:p.length&&0<=b.selectedIndex?a.j.u(b.options[b.selectedIndex])!==p[0]:p.length||0<=b.selectedIndex)&&a.a.Da(b,"change")});a.a.Nc(b);l&&20<Math.abs(l-b.scrollTop)&&(b.scrollTop=l)}};a.d.options.xb=a.a.e.I();a.d.selectedOptions={after:["options","foreach"],init:function(b,c,d){a.a.p(b,"change",function(){var e=c(),f=[];a.a.q(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.j.u(b))});a.h.Ea(e,d,"selectedOptions",f)})},update:function(b,c){if("select"!=
a.a.A(b))throw Error("values binding applies only to SELECT elements");var d=a.a.c(c()),e=b.scrollTop;d&&"number"==typeof d.length&&a.a.q(b.getElementsByTagName("option"),function(b){var c=0<=a.a.o(d,a.j.u(b));b.selected!=c&&a.a.sc(b,c)});b.scrollTop=e}};a.h.ea.selectedOptions=!0;a.d.style={update:function(b,c){var d=a.a.c(c()||{});a.a.D(d,function(c,d){d=a.a.c(d);if(null===d||d===n||!1===d)d="";b.style[c]=d})}};a.d.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");
a.a.p(b,"submit",function(a){var d,e=c();try{d=e.call(f.$data,b)}finally{!0!==d&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Za(b,c())}};a.f.Z.text=!0;(function(){if(x&&x.navigator)var b=function(a){if(a)return parseFloat(a[1])},c=x.opera&&x.opera.version&&parseInt(x.opera.version()),d=x.navigator.userAgent,e=b(d.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),f=b(d.match(/Firefox\/([^ ]*)/));
if(10>a.a.C)var g=a.a.e.I(),k=a.a.e.I(),l=function(b){var c=this.activeElement;(c=c&&a.a.e.get(c,k))&&c(b)},m=function(b,c){var d=b.ownerDocument;a.a.e.get(d,g)||(a.a.e.set(d,g,!0),a.a.p(d,"selectionchange",l));a.a.e.set(b,k,c)};a.d.textInput={init:function(b,d,g){function l(c,d){a.a.p(b,c,d)}function k(){var c=a.a.c(d());if(null===c||c===n)c="";v!==n&&c===v?a.a.setTimeout(k,4):b.value!==c&&(u=c,b.value=c)}function y(){s||(v=b.value,s=a.a.setTimeout(t,4))}function t(){clearTimeout(s);v=s=n;var c=
b.value;u!==c&&(u=c,a.h.Ea(d(),g,"textInput",c))}var u=b.value,s,v,x=9==a.a.C?y:t;10>a.a.C?(l("propertychange",function(a){"value"===a.propertyName&&x(a)}),8==a.a.C&&(l("keyup",t),l("keydown",t)),8<=a.a.C&&(m(b,x),l("dragend",y))):(l("input",t),5>e&&"textarea"===a.a.A(b)?(l("keydown",y),l("paste",y),l("cut",y)):11>c?l("keydown",y):4>f&&(l("DOMAutoComplete",t),l("dragdrop",t),l("drop",t)));l("change",t);a.m(k,null,{i:b})}};a.h.ea.textInput=!0;a.d.textinput={preprocess:function(a,b,c){c("textInput",
a)}}})();a.d.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+ ++a.d.uniqueName.Ic;a.a.rc(b,d)}}};a.d.uniqueName.Ic=0;a.d.value={after:["options","foreach"],init:function(b,c,d){if("input"!=b.tagName.toLowerCase()||"checkbox"!=b.type&&"radio"!=b.type){var e=["change"],f=d.get("valueUpdate"),g=!1,k=null;f&&("string"==typeof f&&(f=[f]),a.a.ra(e,f),e=a.a.Tb(e));var l=function(){k=null;g=!1;var e=c(),f=a.j.u(b);a.h.Ea(e,d,"value",f)};!a.a.C||"input"!=b.tagName.toLowerCase()||"text"!=b.type||
"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||-1!=a.a.o(e,"propertychange")||(a.a.p(b,"propertychange",function(){g=!0}),a.a.p(b,"focus",function(){g=!1}),a.a.p(b,"blur",function(){g&&l()}));a.a.q(e,function(c){var d=l;a.a.nd(c,"after")&&(d=function(){k=a.j.u(b);a.a.setTimeout(l,0)},c=c.substring(5));a.a.p(b,c,d)});var m=function(){var e=a.a.c(c()),f=a.j.u(b);if(null!==k&&e===k)a.a.setTimeout(m,0);else if(e!==f)if("select"===a.a.A(b)){var g=d.get("valueAllowUnset"),f=function(){a.j.ha(b,
e,g)};f();g||e===a.j.u(b)?a.a.setTimeout(f,0):a.l.w(a.a.Da,null,[b,"change"])}else a.j.ha(b,e)};a.m(m,null,{i:b})}else a.Ja(b,{checkedValue:c})},update:function(){}};a.h.ea.value=!0;a.d.visible={update:function(b,c){var d=a.a.c(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(c,d,e,f,g){return a.d.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,g)}}})("click");a.O=function(){};a.O.prototype.renderTemplateSource=
function(){throw Error("Override renderTemplateSource");};a.O.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.O.prototype.makeTemplateSource=function(b,c){if("string"==typeof b){c=c||u;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.v.n(d)}if(1==b.nodeType||8==b.nodeType)return new a.v.qa(b);throw Error("Unknown template type: "+b);};a.O.prototype.renderTemplate=function(a,c,d,e){a=this.makeTemplateSource(a,
e);return this.renderTemplateSource(a,c,d,e)};a.O.prototype.isTemplateRewritten=function(a,c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.O.prototype.rewriteTemplate=function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.O);a.Gb=function(){function b(b,c,d,k){b=a.h.yb(b);for(var l=a.h.ta,m=0;m<b.length;m++){var h=b[m].key;if(l.hasOwnProperty(h)){var r=l[h];if("function"===typeof r){if(h=
r(b[m].value))throw Error(h);}else if(!r)throw Error("This template engine does not support the '"+h+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.h.Ua(b,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return k.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Oc:function(b,
c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.Gb.dd(b,c)},d)},dd:function(a,f){return a.replace(c,function(a,c,d,e,h){return b(h,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e","#comment",f)})},Ec:function(b,c){return a.M.wb(function(d,k){var l=d.nextSibling;l&&l.nodeName.toLowerCase()===c&&a.Ja(l,b,k)})}}}();a.b("__tr_ambtns",a.Gb.Ec);(function(){a.v={};a.v.n=function(b){if(this.n=b){var c=a.a.A(b);this.ab="script"===c?1:"textarea"===c?2:"template"==c&&
b.content&&11===b.content.nodeType?3:4}};a.v.n.prototype.text=function(){var b=1===this.ab?"text":2===this.ab?"value":"innerHTML";if(0==arguments.length)return this.n[b];var c=arguments[0];"innerHTML"===b?a.a.Cb(this.n,c):this.n[b]=c};var b=a.a.e.I()+"_";a.v.n.prototype.data=function(c){if(1===arguments.length)return a.a.e.get(this.n,b+c);a.a.e.set(this.n,b+c,arguments[1])};var c=a.a.e.I();a.v.n.prototype.nodes=function(){var b=this.n;if(0==arguments.length)return(a.a.e.get(b,c)||{}).jb||(3===this.ab?
b.content:4===this.ab?b:n);a.a.e.set(b,c,{jb:arguments[0]})};a.v.qa=function(a){this.n=a};a.v.qa.prototype=new a.v.n;a.v.qa.prototype.text=function(){if(0==arguments.length){var b=a.a.e.get(this.n,c)||{};b.Hb===n&&b.jb&&(b.Hb=b.jb.innerHTML);return b.Hb}a.a.e.set(this.n,c,{Hb:arguments[0]})};a.b("templateSources",a.v);a.b("templateSources.domElement",a.v.n);a.b("templateSources.anonymousTemplate",a.v.qa)})();(function(){function b(b,c,d){var e;for(c=a.f.nextSibling(c);b&&(e=b)!==c;)b=a.f.nextSibling(e),
d(e,b)}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],g=e.parentNode,k=a.Q.instance,n=k.preprocessNode;if(n){b(e,f,function(a,b){var c=a.previousSibling,d=n.call(k,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c))});c.length=0;if(!e)return;e===f?c.push(e):(c.push(e,f),a.a.za(c,g))}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.Rb(d,b)});b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.M.yc(b,[d])});a.a.za(c,g)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,
e,f,k,q){q=q||{};var p=(b&&d(b)||f||{}).ownerDocument,n=q.templateEngine||g;a.Gb.Oc(f,n,p);f=n.renderTemplate(f,k,q,p);if("number"!=typeof f.length||0<f.length&&"number"!=typeof f[0].nodeType)throw Error("Template engine must return an array of DOM nodes");p=!1;switch(e){case "replaceChildren":a.f.da(b,f);p=!0;break;case "replaceNode":a.a.qc(b,f);p=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+e);}p&&(c(f,k),q.afterRender&&a.l.w(q.afterRender,null,[f,k.$data]));
return f}function f(b,c,d){return a.H(b)?b():"function"===typeof b?b(c,d):b}var g;a.Db=function(b){if(b!=n&&!(b instanceof a.O))throw Error("templateEngine must inherit from ko.templateEngine");g=b};a.Ab=function(b,c,h,k,q){h=h||{};if((h.templateEngine||g)==n)throw Error("Set a template engine before calling renderTemplate");q=q||"replaceChildren";if(k){var p=d(k);return a.B(function(){var g=c&&c instanceof a.U?c:new a.U(a.a.c(c)),n=f(b,g.$data,g),g=e(k,q,n,g,h);"replaceNode"==q&&(k=g,p=d(k))},null,
{wa:function(){return!p||!a.a.nb(p)},i:p&&"replaceNode"==q?p.parentNode:p})}return a.M.wb(function(d){a.Ab(b,c,h,d,"replaceNode")})};a.kd=function(b,d,g,k,q){function p(a,b){c(b,s);g.afterRender&&g.afterRender(b,a);s=null}function u(a,c){s=q.createChildContext(a,g.as,function(a){a.$index=c});var d=f(b,a,s);return e(null,"ignoreTargetNode",d,s,g)}var s;return a.B(function(){var b=a.a.c(d)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.Ka(b,function(b){return g.includeDestroyed||b===n||null===b||!a.a.c(b._destroy)});
a.l.w(a.a.Bb,null,[k,b,u,g,p])},null,{i:k})};var k=a.a.e.I();a.d.template={init:function(b,c){var d=a.a.c(c());if("string"==typeof d||d.name)a.f.xa(b);else{if("nodes"in d){if(d=d.nodes||[],a.H(d))throw Error('The "nodes" option must be a plain, non-observable array.');}else d=a.f.childNodes(b);d=a.a.jc(d);(new a.v.qa(b)).nodes(d)}return{controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var g=c(),s;c=a.a.c(g);d=!0;e=null;"string"==typeof c?c={}:(g=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in
c&&(d=!a.a.c(c.ifnot)),s=a.a.c(c.data));"foreach"in c?e=a.kd(g||b,d&&c.foreach||[],c,b,f):d?(f="data"in c?f.createChildContext(s,c.as):f,e=a.Ab(g||b,f,c,b)):a.f.xa(b);f=e;(s=a.a.e.get(b,k))&&"function"==typeof s.k&&s.k();a.a.e.set(b,k,f&&f.ba()?f:n)}};a.h.ta.template=function(b){b=a.h.yb(b);return 1==b.length&&b[0].unknown||a.h.ad(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.f.Z.template=!0})();a.b("setTemplateEngine",a.Db);a.b("renderTemplate",
a.Ab);a.a.dc=function(a,c,d){if(a.length&&c.length){var e,f,g,k,l;for(e=f=0;(!d||e<d)&&(k=a[f]);++f){for(g=0;l=c[g];++g)if(k.value===l.value){k.moved=l.index;l.moved=k.index;c.splice(g,1);e=g=0;break}e+=g}}};a.a.ib=function(){function b(b,d,e,f,g){var k=Math.min,l=Math.max,m=[],h,n=b.length,q,p=d.length,s=p-n||1,u=n+p+1,t,v,x;for(h=0;h<=n;h++)for(v=t,m.push(t=[]),x=k(p,h+s),q=l(0,h-1);q<=x;q++)t[q]=q?h?b[h-1]===d[q-1]?v[q-1]:k(v[q]||u,t[q-1]||u)+1:q+1:h+1;k=[];l=[];s=[];h=n;for(q=p;h||q;)p=m[h][q]-
1,q&&p===m[h][q-1]?l.push(k[k.length]={status:e,value:d[--q],index:q}):h&&p===m[h-1][q]?s.push(k[k.length]={status:f,value:b[--h],index:h}):(--q,--h,g.sparse||k.push({status:"retained",value:d[q]}));a.a.dc(s,l,!g.dontLimitMoves&&10*n);return k.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.ib);(function(){function b(b,c,d,k,l){var m=[],
h=a.B(function(){var h=c(d,l,a.a.za(m,b))||[];0<m.length&&(a.a.qc(m,h),k&&a.l.w(k,null,[d,h,l]));m.length=0;a.a.ra(m,h)},null,{i:b,wa:function(){return!a.a.Qb(m)}});return{ca:m,B:h.ba()?h:n}}var c=a.a.e.I(),d=a.a.e.I();a.a.Bb=function(e,f,g,k,l){function m(b,c){w=q[c];v!==c&&(D[b]=w);w.qb(v++);a.a.za(w.ca,e);u.push(w);z.push(w)}function h(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.q(c[d].ca,function(a){b(a,d,c[d].ja)})}f=f||[];k=k||{};var r=a.a.e.get(e,c)===n,q=a.a.e.get(e,c)||[],p=a.a.fb(q,
function(a){return a.ja}),s=a.a.ib(p,f,k.dontLimitMoves),u=[],t=0,v=0,x=[],z=[];f=[];for(var D=[],p=[],w,C=0,B,E;B=s[C];C++)switch(E=B.moved,B.status){case "deleted":E===n&&(w=q[t],w.B&&(w.B.k(),w.B=n),a.a.za(w.ca,e).length&&(k.beforeRemove&&(u.push(w),z.push(w),w.ja===d?w=null:f[C]=w),w&&x.push.apply(x,w.ca)));t++;break;case "retained":m(C,t++);break;case "added":E!==n?m(C,E):(w={ja:B.value,qb:a.N(v++)},u.push(w),z.push(w),r||(p[C]=w))}a.a.e.set(e,c,u);h(k.beforeMove,D);a.a.q(x,k.beforeRemove?a.$:
a.removeNode);for(var C=0,r=a.f.firstChild(e),F;w=z[C];C++){w.ca||a.a.extend(w,b(e,g,w.ja,l,w.qb));for(t=0;s=w.ca[t];r=s.nextSibling,F=s,t++)s!==r&&a.f.gc(e,s,F);!w.Wc&&l&&(l(w.ja,w.ca,w.qb),w.Wc=!0)}h(k.beforeRemove,f);for(C=0;C<f.length;++C)f[C]&&(f[C].ja=d);h(k.afterMove,D);h(k.afterAdd,p)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Bb);a.W=function(){this.allowTemplateRewriting=!1};a.W.prototype=new a.O;a.W.prototype.renderTemplateSource=function(b,c,d,e){if(c=(9>a.a.C?0:b.nodes)?
b.nodes():null)return a.a.V(c.cloneNode(!0).childNodes);b=b.text();return a.a.ma(b,e)};a.W.sb=new a.W;a.Db(a.W.sb);a.b("nativeTemplateEngine",a.W);(function(){a.vb=function(){var a=this.$c=function(){if(!v||!v.tmpl)return 0;try{if(0<=v.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,f,g){g=g||u;f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var k=b.data("precompiled");
k||(k=b.text()||"",k=v.template(null,"{{ko_with $item.koBindingContext}}"+k+"{{/ko_with}}"),b.data("precompiled",k));b=[e.$data];e=v.extend({koBindingContext:e},f.templateOptions);e=v.tmpl(k,b,e);e.appendTo(g.createElement("div"));v.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){u.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(v.tmpl.tag.ko_code={open:"__.push($1 || '');"},
v.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.vb.prototype=new a.O;var b=new a.vb;0<b.$c&&a.Db(b);a.b("jqueryTmplTemplateEngine",a.vb)})()})})();})();

},{}],3:[function(_dereq_,module,exports){
/**
 * postal - Pub/Sub library providing wildcard subscriptions, complex message handling, etc.  Works server and client-side.
 * Author: Jim Cowart (http://ifandelse.com)
 * Version: v2.0.4
 * Url: http://github.com/postaljs/postal.js
 * License(s): MIT
 */

( function( root, factory ) {
	module.exports = factory( _dereq_( "../../../source/misc/lodash" ), this );
}( this, function( _, global, undefined ) {
	var prevPostal = global && global.postal;
	var prevLodash = global && global._;
	if ( prevLodash && prevLodash !== _ ) {
		_ = _.noConflict();
	}
	var _defaultConfig = {
		DEFAULT_CHANNEL: "/",
		SYSTEM_CHANNEL: "postal",
		enableSystemMessages: true,
		cacheKeyDelimiter: "|",
		autoCompactResolver: false
	};
	var postal = {
		configuration: _.extend( {}, _defaultConfig )
	};
	var _config = postal.configuration;

	

var ChannelDefinition = function( channelName, bus ) {
	this.bus = bus;
	this.channel = channelName || _config.DEFAULT_CHANNEL;
};

ChannelDefinition.prototype.subscribe = function() {
	return this.bus.subscribe( {
		channel: this.channel,
		topic: ( arguments.length === 1 ? arguments[ 0 ].topic : arguments[ 0 ] ),
		callback: ( arguments.length === 1 ? arguments[ 0 ].callback : arguments[ 1 ] )
	} );
};

/*
    publish( envelope [, callback ] );
    publish( topic, data [, callback ] );
*/
ChannelDefinition.prototype.publish = function() {
	var envelope = {};
	var callback;
	if ( typeof arguments[ 0 ] === "string" ) {
		envelope.topic = arguments[ 0 ];
		envelope.data = arguments[ 1 ];
		callback = arguments[ 2 ];
	} else {
		envelope = arguments[ 0 ];
		callback = arguments[ 1 ];
	}
	if ( typeof envelope !== "object" ) {
		throw new Error( "The first argument to ChannelDefinition.publish should be either an envelope object or a string topic." );
	}
	envelope.channel = this.channel;
	this.bus.publish( envelope, callback );
};

	
var SubscriptionDefinition = function( channel, topic, callback ) {
	if ( arguments.length !== 3 ) {
		throw new Error( "You must provide a channel, topic and callback when creating a SubscriptionDefinition instance." );
	}
	if ( topic.length === 0 ) {
		throw new Error( "Topics cannot be empty" );
	}
	this.channel = channel;
	this.topic = topic;
	this.callback = callback;
	this.pipeline = [];
	this.cacheKeys = [];
	this._context = undefined;
};

var ConsecutiveDistinctPredicate = function() {
	var previous;
	return function( data ) {
		var eq = false;
		if ( typeof data === "string" ) {
			eq = data === previous;
			previous = data;
		} else {
			eq = _.isEqual( data, previous );
			previous = _.extend( {}, data );
		}
		return !eq;
	};
};

var DistinctPredicate = function DistinctPredicateFactory() {
	var previous = [];
	return function DistinctPredicate( data ) {
		var isDistinct = !_.some( previous, function( p ) {
			return _.isEqual( data, p );
		} );
		if ( isDistinct ) {
			previous.push( data );
		}
		return isDistinct;
	};
};

SubscriptionDefinition.prototype = {

	"catch": function( errorHandler ) {
		var original = this.callback;
		var safeCallback = function() {
			try {
				original.apply( this, arguments );
			} catch ( err ) {
				errorHandler( err, arguments[ 0 ] );
			}
		};
		this.callback = safeCallback;
		return this;
	},

	defer: function defer() {
		return this.delay( 0 );
	},

	disposeAfter: function disposeAfter( maxCalls ) {
		if ( typeof maxCalls !== "number" || maxCalls <= 0 ) {
			throw new Error( "The value provided to disposeAfter (maxCalls) must be a number greater than zero." );
		}
		var dispose = _.after( maxCalls, this.unsubscribe.bind( this ) );
		this.pipeline.push( function( data, env, next ) {
			next( data, env );
			dispose();
		} );
		return this;
	},

	distinct: function distinct() {
		return this.constraint( new DistinctPredicate() );
	},

	distinctUntilChanged: function distinctUntilChanged() {
		return this.constraint( new ConsecutiveDistinctPredicate() );
	},

	invokeSubscriber: function invokeSubscriber( data, env ) {
		if ( !this.inactive ) {
			var self = this;
			var pipeline = self.pipeline;
			var len = pipeline.length;
			var context = self._context;
			var idx = -1;
			var invoked = false;
			if ( !len ) {
				self.callback.call( context, data, env );
				invoked = true;
			} else {
				pipeline = pipeline.concat( [ self.callback ] );
				var step = function step( d, e ) {
					idx += 1;
					if ( idx < len ) {
						pipeline[ idx ].call( context, d, e, step );
					} else {
						self.callback.call( context, d, e );
						invoked = true;
					}
				};
				step( data, env, 0 );
			}
			return invoked;
		}
	},

	logError: function logError() {
		
		if ( console ) {
			var report;
			if ( console.warn ) {
				report = console.warn;
			} else {
				report = console.log;
			}
			this.catch( report );
		}
		return this;
	},

	once: function once() {
		return this.disposeAfter( 1 );
	},

	subscribe: function subscribe( callback ) {
		this.callback = callback;
		return this;
	},

	unsubscribe: function unsubscribe() {
		
		if ( !this.inactive ) {
			postal.unsubscribe( this );
		}
	},

	constraint: function constraint( predicate ) {
		if ( typeof predicate !== "function" ) {
			throw new Error( "Predicate constraint must be a function" );
		}
		this.pipeline.push( function( data, env, next ) {
			if ( predicate.call( this, data, env ) ) {
				next( data, env );
			}
		} );
		return this;
	},

	constraints: function constraints( predicates ) {
		var self = this;
		
		_.each( predicates, function( predicate ) {
			self.constraint( predicate );
		} );
		return self;
	},

	context: function contextSetter( context ) {
		this._context = context;
		return this;
	},

	debounce: function debounce( milliseconds, immediate ) {
		if ( typeof milliseconds !== "number" ) {
			throw new Error( "Milliseconds must be a number" );
		}

		var options = {};

		if ( !!immediate === true ) { 
			options.leading = true;
			options.trailing = false;
		}

		this.pipeline.push(
			_.debounce( function( data, env, next ) {
				next( data, env );
			},
				milliseconds,
				options
			)
		);
		return this;
	},

	delay: function delay( milliseconds ) {
		if ( typeof milliseconds !== "number" ) {
			throw new Error( "Milliseconds must be a number" );
		}
		var self = this;
		self.pipeline.push( function( data, env, next ) {
			setTimeout( function() {
				next( data, env );
			}, milliseconds );
		} );
		return this;
	},

	throttle: function throttle( milliseconds ) {
		if ( typeof milliseconds !== "number" ) {
			throw new Error( "Milliseconds must be a number" );
		}
		var fn = function( data, env, next ) {
			next( data, env );
		};
		this.pipeline.push( _.throttle( fn, milliseconds ) );
		return this;
	}
};

	


var bindingsResolver = _config.resolver = {
	cache: {},
	regex: {},
	enableCache: true,

	compare: function compare( binding, topic, headerOptions ) {
		var pattern;
		var rgx;
		var prevSegment;
		var cacheKey = topic + _config.cacheKeyDelimiter + binding;
		var result = ( this.cache[ cacheKey ] );
		var opt = headerOptions || {};
		var saveToCache = this.enableCache && !opt.resolverNoCache;
		// result is cached?
		if ( result === true ) {
			return result;
		}
		// plain string matching?
		if ( binding.indexOf( "#" ) === -1 && binding.indexOf( "*" ) === -1 ) {
			result = ( topic === binding );
			if ( saveToCache ) {
				this.cache[ cacheKey ] = result;
			}
			return result;
		}
		// ah, regex matching, then
		if ( !( rgx = this.regex[ binding ] ) ) {
			pattern = "^" + _.map( binding.split( "." ), function mapTopicBinding( segment ) {
					var res = "";
					if ( !!prevSegment ) {
						res = prevSegment !== "#" ? "\\.\\b" : "\\b";
					}
					if ( segment === "#" ) {
						res += "[\\s\\S]*";
					} else if ( segment === "*" ) {
						res += "[^.]+";
					} else {
						res += segment;
					}
					prevSegment = segment;
					return res;
				} ).join( "" ) + "$";
			rgx = this.regex[ binding ] = new RegExp( pattern );
		}
		result = rgx.test( topic );
		if ( saveToCache ) {
			this.cache[ cacheKey ] = result;
		}
		return result;
	},

	reset: function reset() {
		this.cache = {};
		this.regex = {};
	},

	purge: function( options ) {
		var self = this;
		var keyDelimiter = _config.cacheKeyDelimiter;
		var matchPredicate = function( val, key ) {
			var split = key.split( keyDelimiter );
			var topic = split[ 0 ];
			var binding = split[ 1 ];
			if ( ( typeof options.topic === "undefined" || options.topic === topic ) &&
					( typeof options.binding === "undefined" || options.binding === binding ) ) {
				delete self.cache[ key ];
			}
		};

		var compactPredicate = function( val, key ) {
			var split = key.split( keyDelimiter );
			if ( postal.getSubscribersFor( { topic: split[ 0 ] } ).length === 0 ) {
				delete self.cache[ key ];
			}
		};

		if ( typeof options === "undefined" ) {
			this.reset();
		} else {
			var handler = options.compact === true ? compactPredicate : matchPredicate;
			_.each( this.cache, handler );
		}
	}
};

	


var pubInProgress = 0;
var unSubQueue = [];
var autoCompactIndex = 0;

function clearUnSubQueue() {
	while ( unSubQueue.length ) {
		postal.unsubscribe( unSubQueue.shift() );
	}
}

function getCachePurger( subDef, key, cache ) {
	return function( sub, i, list ) {
		if ( sub === subDef ) {
			list.splice( i, 1 );
		}
		if ( list.length === 0 ) {
			delete cache[ key ];
		}
	};
}

function getCacher( topic, pubCache, cacheKey, done, envelope ) {
	var headers = envelope && envelope.headers || {};
	return function( subDef ) {
		var cache;
		if ( _config.resolver.compare( subDef.topic, topic, headers ) ) {
			if ( !headers.resolverNoCache ) {
				cache = pubCache[ cacheKey ] = ( pubCache[ cacheKey ] || [] );
				cache.push( subDef );
			}
			subDef.cacheKeys.push( cacheKey );
			if ( done ) {
				done( subDef );
			}
		}
	};
}

function getSystemMessage( kind, subDef ) {
	return {
		channel: _config.SYSTEM_CHANNEL,
		topic: "subscription." + kind,
		data: {
			event: "subscription." + kind,
			channel: subDef.channel,
			topic: subDef.topic
		}
	};
}

var sysCreatedMessage = getSystemMessage.bind( undefined, "created" );
var sysRemovedMessage = getSystemMessage.bind( undefined, "removed" );

function getPredicate( options, resolver ) {
	if ( typeof options === "function" ) {
		return options;
	} else if ( !options ) {
		return function() {
			return true;
		};
	} else {
		return function( sub ) {
			var compared = 0;
			var matched = 0;
			_.each( options, function( val, prop ) {
				compared += 1;
				if (
				// We use the bindings resolver to compare the options.topic to subDef.topic
				( prop === "topic" && resolver.compare( sub.topic, options.topic, { resolverNoCache: true } ) ) ||
						( prop === "context" && options.context === sub._context ) ||
						// Any other potential prop/value matching outside topic & context...
						( sub[ prop ] === options[ prop ] ) ) {
					matched += 1;
				}
			} );
			return compared === matched;
		};
	}
}

_.extend( postal, {
	cache: {},
	subscriptions: {},
	wireTaps: [],

	ChannelDefinition: ChannelDefinition,
	SubscriptionDefinition: SubscriptionDefinition,

	channel: function channel( channelName ) {
		return new ChannelDefinition( channelName, this );
	},

	addWireTap: function addWireTap( callback ) {
		var self = this;
		self.wireTaps.push( callback );
		return function() {
			var idx = self.wireTaps.indexOf( callback );
			if ( idx !== -1 ) {
				self.wireTaps.splice( idx, 1 );
			}
		};
	},

	noConflict: function noConflict() {
		
		if ( typeof window === "undefined" || ( typeof window !== "undefined" && typeof define === "function" && define.amd ) ) {
			throw new Error( "noConflict can only be used in browser clients which aren't using AMD modules" );
		}
		global.postal = prevPostal;
		return this;
	},

	getSubscribersFor: function getSubscribersFor( options ) {
		var result = [];
		var self = this;
		_.each( self.subscriptions, function( channel ) {
			_.each( channel, function( subList ) {
				result = result.concat( _.filter( subList, getPredicate( options, _config.resolver ) ) );
			} );
		} );
		return result;
	},

	publish: function publish( envelope, cb ) {
		++pubInProgress;
		var channel = envelope.channel = envelope.channel || _config.DEFAULT_CHANNEL;
		var topic = envelope.topic;
		envelope.timeStamp = new Date();
		if ( this.wireTaps.length ) {
			_.each( this.wireTaps, function( tap ) {
				tap( envelope.data, envelope, pubInProgress );
			} );
		}
		var cacheKey = channel + _config.cacheKeyDelimiter + topic;
		var cache = this.cache[ cacheKey ];
		var skipped = 0;
		var activated = 0;
		if ( !cache ) {
			var cacherFn = getCacher(
				topic,
				this.cache,
				cacheKey,
				function( candidate ) {
					if ( candidate.invokeSubscriber( envelope.data, envelope ) ) {
						activated++;
					} else {
						skipped++;
					}
				},
				envelope
			);
			_.each( this.subscriptions[ channel ], function( candidates ) {
				_.each( candidates, cacherFn );
			} );
		} else {
			_.each( cache, function( subDef ) {
				if ( subDef.invokeSubscriber( envelope.data, envelope ) ) {
					activated++;
				} else {
					skipped++;
				}
			} );
		}
		if ( --pubInProgress === 0 ) {
			clearUnSubQueue();
		}
		if ( cb ) {
			cb( {
				activated: activated,
				skipped: skipped
			} );
		}
	},

	reset: function reset() {
		this.unsubscribeFor();
		_config.resolver.reset();
		this.subscriptions = {};
		this.cache = {};
	},

	subscribe: function subscribe( options ) {
		var subscriptions = this.subscriptions;
		var subDef = new SubscriptionDefinition( options.channel || _config.DEFAULT_CHANNEL, options.topic, options.callback );
		var channel = subscriptions[ subDef.channel ];
		var channelLen = subDef.channel.length;
		var subs;
		if ( !channel ) {
			channel = subscriptions[ subDef.channel ] = {};
		}
		subs = subscriptions[ subDef.channel ][ subDef.topic ];
		if ( !subs ) {
			subs = subscriptions[ subDef.channel ][ subDef.topic ] = [];
		}
		// First, add the SubscriptionDefinition to the channel list
		subs.push( subDef );
		// Next, add the SubscriptionDefinition to any relevant existing cache(s)
		var cache = this.cache;
		_.each( _.keys( cache ), function( cacheKey ) {
			if ( cacheKey.substr( 0, channelLen ) === subDef.channel ) {
				getCacher(
					cacheKey.split( _config.cacheKeyDelimiter )[1],
					cache,
					cacheKey )( subDef );
			}
		} );
		
		if ( _config.enableSystemMessages ) {
			this.publish( sysCreatedMessage( subDef ) );
		}
		return subDef;
	},

	unsubscribe: function unsubscribe() {
		var unSubLen = arguments.length;
		var unSubIdx = 0;
		var subDef;
		var channelSubs;
		var topicSubs;
		var idx;
		for ( ; unSubIdx < unSubLen; unSubIdx++ ) {
			subDef = arguments[ unSubIdx ];
			subDef.inactive = true;
			if ( pubInProgress ) {
				unSubQueue.push( subDef );
				return;
			}
			channelSubs = this.subscriptions[ subDef.channel ];
			topicSubs = channelSubs && channelSubs[ subDef.topic ];
			
			if ( topicSubs ) {
				var len = topicSubs.length;
				idx = 0;
				// remove SubscriptionDefinition from channel list
				while ( idx < len ) {
					
					if ( topicSubs[ idx ] === subDef ) {
						topicSubs.splice( idx, 1 );
						break;
					}
					idx += 1;
				}
				if ( topicSubs.length === 0 ) {
					delete channelSubs[ subDef.topic ];
					if ( !_.keys( channelSubs ).length ) {
						delete this.subscriptions[ subDef.channel ];
					}
				}
				// remove SubscriptionDefinition from postal cache
				if ( subDef.cacheKeys && subDef.cacheKeys.length ) {
					var key;
					while ( key = subDef.cacheKeys.pop() ) {
						_.each( this.cache[ key ], getCachePurger( subDef, key, this.cache ) );
					}
				}
				if ( typeof _config.resolver.purge === "function" ) {
					// check to see if relevant resolver cache entries can be purged
					var autoCompact = _config.autoCompactResolver === true ?
						0 : typeof _config.autoCompactResolver === "number" ?
							( _config.autoCompactResolver - 1 ) : false;
					if ( autoCompact >= 0 && autoCompactIndex === autoCompact ) {
						_config.resolver.purge( { compact: true } );
						autoCompactIndex = 0;
					} else if ( autoCompact >= 0 && autoCompactIndex < autoCompact ) {
						autoCompactIndex += 1;
					}
				}
			}
			if ( _config.enableSystemMessages ) {
				this.publish( sysRemovedMessage( subDef ) );
			}
		}
	},

	unsubscribeFor: function unsubscribeFor( options ) {
		var toDispose = [];
		
		if ( this.subscriptions ) {
			toDispose = this.getSubscribersFor( options );
			this.unsubscribe.apply( this, toDispose );
		}
	}
} );


	
	if ( global && Object.prototype.hasOwnProperty.call( global, "__postalReady__" ) && _.isArray( global.__postalReady__ ) ) {
		while ( global.__postalReady__.length ) {
			global.__postalReady__.shift().onReady( postal );
		}
	}
	

	return postal;
} ) );

},{"../../../source/misc/lodash":311}],4:[function(_dereq_,module,exports){
/**
 * riveter - Mix-in, inheritance and constructor extend behavior for your JavaScript enjoyment.
 * © 2012 - Copyright appendTo, LLC 
 * Author(s): Jim Cowart, Nicholas Cloud, Doug Neiner
 * Version: v0.1.2
 * Url: https://github.com/a2labs/riveter
 * License(s): MIT, GPL
 */
(function (root, factory) {
    module.exports = factory(_dereq_("../../../source/misc/lodash"), this);
}(this, function (_, global, undefined) {
    var slice = Array.prototype.slice;
    var riveter = function () {
        var args = slice.call(arguments, 0);
        while (args.length) {
            riveter.rivet(args.shift());
        }
    };
    riveter.rivet = function (fn) {
        if (!fn.hasOwnProperty("extend")) {
            fn.extend = function (props, ctorProps) {
                return riveter.extend(fn, props, ctorProps);
            };
        }
        if (!fn.hasOwnProperty("compose")) {
            fn.compose = function () {
                return riveter.compose.apply(this, [fn].concat(slice.call(arguments, 0)));
            };
        }
        if (!fn.hasOwnProperty("inherits")) {
            fn.inherits = function (parent, ctorProps) {
                riveter.inherits(fn, parent, ctorProps);
            };
        }
        if (!fn.hasOwnProperty("mixin")) {
            fn.mixin = function () {
                riveter.mixin.apply(this, ([fn].concat(slice.call(arguments, 0))));
            };
        }
    };
    riveter.inherits = function (child, parent, ctorProps) {
        var childProto;
        var TmpCtor = function () {};
        var Child = function () {
            parent.apply(this, arguments);
        };
        if (typeof child === "object") {
            if (child.hasOwnProperty("constructor")) {
                Child = child.constructor;
            }
            childProto = child;
        } else {
            Child = child;
            childProto = child.prototype;
        }
        riveter.rivet(Child);
        _.defaults(Child, parent, ctorProps);
        TmpCtor.prototype = parent.prototype;
        Child.prototype = new TmpCtor();
        _.extend(Child.prototype, childProto, {
            constructor: Child
        });
        Child.__super = parent;
        // Next line is all about Backbone compatibility
        Child.__super__ = parent.prototype;
        return Child;
    };
    riveter.extend = function (ctor, props, ctorProps) {
        return riveter.inherits(props, ctor, ctorProps);
    };
    riveter.compose = function () {
        var args = slice.call(arguments, 0);
        var ctor = args.shift();
        riveter.rivet(ctor);
        var mixin = _.reduce(args, function (memo, val) {
            if (val.hasOwnProperty("_preInit")) {
                memo.preInit.push(val._preInit);
            }
            if (val.hasOwnProperty("_postInit")) {
                memo.postInit.push(val._postInit);
            }
            val = val.mixin || val;
            memo.items.push(val);
            return memo;
        }, {
            items: [],
            preInit: [],
            postInit: []
        });
        var res = ctor.extend({
            constructor: function ( /* options */ ) {
                var args = slice.call(arguments, 0);
                var self = this;
                _.each(mixin.preInit, function (initializer) {
                    initializer.apply(self, args);
                });
                ctor.prototype.constructor.apply(this, args);
                _.each(mixin.postInit, function (initializer) {
                    initializer.apply(self, args);
                });
            }
        });
        riveter.rivet(res);
        _.defaults(res.prototype, _.extend.apply(null, [{}].concat(mixin.items)));
        return res;
    };
    riveter.mixin = function () {
        var args = slice.call(arguments, 0);
        var ctor = args.shift();
        riveter.rivet(ctor);
        _.defaults(ctor.prototype, _.extend.apply(null, [{}].concat(args)));
    };
    return riveter;
}));
},{"../../../source/misc/lodash":311}],5:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":128,"./_root":178}],6:[function(_dereq_,module,exports){
var hashClear = _dereq_('./_hashClear'),
    hashDelete = _dereq_('./_hashDelete'),
    hashGet = _dereq_('./_hashGet'),
    hashHas = _dereq_('./_hashHas'),
    hashSet = _dereq_('./_hashSet');

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

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":136,"./_hashDelete":137,"./_hashGet":138,"./_hashHas":139,"./_hashSet":140}],7:[function(_dereq_,module,exports){
var baseCreate = _dereq_('./_baseCreate'),
    baseLodash = _dereq_('./_baseLodash');

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

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

module.exports = LazyWrapper;

},{"./_baseCreate":38,"./_baseLodash":65}],8:[function(_dereq_,module,exports){
var listCacheClear = _dereq_('./_listCacheClear'),
    listCacheDelete = _dereq_('./_listCacheDelete'),
    listCacheGet = _dereq_('./_listCacheGet'),
    listCacheHas = _dereq_('./_listCacheHas'),
    listCacheSet = _dereq_('./_listCacheSet');

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

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":155,"./_listCacheDelete":156,"./_listCacheGet":157,"./_listCacheHas":158,"./_listCacheSet":159}],9:[function(_dereq_,module,exports){
var baseCreate = _dereq_('./_baseCreate'),
    baseLodash = _dereq_('./_baseLodash');

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

module.exports = LodashWrapper;

},{"./_baseCreate":38,"./_baseLodash":65}],10:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":128,"./_root":178}],11:[function(_dereq_,module,exports){
var mapCacheClear = _dereq_('./_mapCacheClear'),
    mapCacheDelete = _dereq_('./_mapCacheDelete'),
    mapCacheGet = _dereq_('./_mapCacheGet'),
    mapCacheHas = _dereq_('./_mapCacheHas'),
    mapCacheSet = _dereq_('./_mapCacheSet');

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

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":160,"./_mapCacheDelete":161,"./_mapCacheGet":162,"./_mapCacheHas":163,"./_mapCacheSet":164}],12:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":128,"./_root":178}],13:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":128,"./_root":178}],14:[function(_dereq_,module,exports){
var MapCache = _dereq_('./_MapCache'),
    setCacheAdd = _dereq_('./_setCacheAdd'),
    setCacheHas = _dereq_('./_setCacheHas');

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

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":11,"./_setCacheAdd":179,"./_setCacheHas":180}],15:[function(_dereq_,module,exports){
var ListCache = _dereq_('./_ListCache'),
    stackClear = _dereq_('./_stackClear'),
    stackDelete = _dereq_('./_stackDelete'),
    stackGet = _dereq_('./_stackGet'),
    stackHas = _dereq_('./_stackHas'),
    stackSet = _dereq_('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":8,"./_stackClear":184,"./_stackDelete":185,"./_stackGet":186,"./_stackHas":187,"./_stackSet":188}],16:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":178}],17:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":178}],18:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative'),
    root = _dereq_('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":128,"./_root":178}],19:[function(_dereq_,module,exports){
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

module.exports = addMapEntry;

},{}],20:[function(_dereq_,module,exports){
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

module.exports = addSetEntry;

},{}],21:[function(_dereq_,module,exports){
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

module.exports = apply;

},{}],22:[function(_dereq_,module,exports){
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

module.exports = arrayEach;

},{}],23:[function(_dereq_,module,exports){
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

module.exports = arrayEvery;

},{}],24:[function(_dereq_,module,exports){
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

module.exports = arrayFilter;

},{}],25:[function(_dereq_,module,exports){
var baseIndexOf = _dereq_('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

},{"./_baseIndexOf":52}],26:[function(_dereq_,module,exports){
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to search.
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

module.exports = arrayIncludesWith;

},{}],27:[function(_dereq_,module,exports){
var baseTimes = _dereq_('./_baseTimes'),
    isArguments = _dereq_('./isArguments'),
    isArray = _dereq_('./isArray'),
    isIndex = _dereq_('./_isIndex'),
    isString = _dereq_('./isString');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var result = (isArray(value) || isString(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":81,"./_isIndex":147,"./isArguments":223,"./isArray":224,"./isString":238}],28:[function(_dereq_,module,exports){
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

module.exports = arrayMap;

},{}],29:[function(_dereq_,module,exports){
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

module.exports = arrayPush;

},{}],30:[function(_dereq_,module,exports){
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

module.exports = arrayReduce;

},{}],31:[function(_dereq_,module,exports){
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

module.exports = arraySome;

},{}],32:[function(_dereq_,module,exports){
var eq = _dereq_('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = assignInDefaults;

},{"./eq":204}],33:[function(_dereq_,module,exports){
var eq = _dereq_('./eq');

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
      (typeof key == 'number' && value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignMergeValue;

},{"./eq":204}],34:[function(_dereq_,module,exports){
var eq = _dereq_('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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
    object[key] = value;
  }
}

module.exports = assignValue;

},{"./eq":204}],35:[function(_dereq_,module,exports){
var eq = _dereq_('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
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

module.exports = assocIndexOf;

},{"./eq":204}],36:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    keys = _dereq_('./keys');

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

module.exports = baseAssign;

},{"./_copyObject":101,"./keys":242}],37:[function(_dereq_,module,exports){
var Stack = _dereq_('./_Stack'),
    arrayEach = _dereq_('./_arrayEach'),
    assignValue = _dereq_('./_assignValue'),
    baseAssign = _dereq_('./_baseAssign'),
    cloneBuffer = _dereq_('./_cloneBuffer'),
    copyArray = _dereq_('./_copyArray'),
    copySymbols = _dereq_('./_copySymbols'),
    getAllKeys = _dereq_('./_getAllKeys'),
    getTag = _dereq_('./_getTag'),
    initCloneArray = _dereq_('./_initCloneArray'),
    initCloneByTag = _dereq_('./_initCloneByTag'),
    initCloneObject = _dereq_('./_initCloneObject'),
    isArray = _dereq_('./isArray'),
    isBuffer = _dereq_('./isBuffer'),
    isHostObject = _dereq_('./_isHostObject'),
    isObject = _dereq_('./isObject'),
    keys = _dereq_('./keys');

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
      if (isHostObject(value)) {
        return object ? value : {};
      }
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

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
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

module.exports = baseClone;

},{"./_Stack":15,"./_arrayEach":22,"./_assignValue":34,"./_baseAssign":36,"./_cloneBuffer":89,"./_copyArray":100,"./_copySymbols":102,"./_getAllKeys":121,"./_getTag":132,"./_initCloneArray":141,"./_initCloneByTag":142,"./_initCloneObject":143,"./_isHostObject":146,"./isArray":224,"./isBuffer":228,"./isObject":234,"./keys":242}],38:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

module.exports = baseCreate;

},{"./isObject":234}],39:[function(_dereq_,module,exports){
var baseForOwn = _dereq_('./_baseForOwn'),
    createBaseEach = _dereq_('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":45,"./_createBaseEach":106}],40:[function(_dereq_,module,exports){
var baseEach = _dereq_('./_baseEach');

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

module.exports = baseEvery;

},{"./_baseEach":39}],41:[function(_dereq_,module,exports){
var baseEach = _dereq_('./_baseEach');

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

module.exports = baseFilter;

},{"./_baseEach":39}],42:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to search.
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

module.exports = baseFindIndex;

},{}],43:[function(_dereq_,module,exports){
var arrayPush = _dereq_('./_arrayPush'),
    isFlattenable = _dereq_('./_isFlattenable');

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

module.exports = baseFlatten;

},{"./_arrayPush":29,"./_isFlattenable":145}],44:[function(_dereq_,module,exports){
var createBaseFor = _dereq_('./_createBaseFor');

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

module.exports = baseFor;

},{"./_createBaseFor":107}],45:[function(_dereq_,module,exports){
var baseFor = _dereq_('./_baseFor'),
    keys = _dereq_('./keys');

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

module.exports = baseForOwn;

},{"./_baseFor":44,"./keys":242}],46:[function(_dereq_,module,exports){
var castPath = _dereq_('./_castPath'),
    isKey = _dereq_('./_isKey'),
    toKey = _dereq_('./_toKey');

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

module.exports = baseGet;

},{"./_castPath":87,"./_isKey":149,"./_toKey":190}],47:[function(_dereq_,module,exports){
var arrayPush = _dereq_('./_arrayPush'),
    isArray = _dereq_('./isArray');

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

module.exports = baseGetAllKeys;

},{"./_arrayPush":29,"./isArray":224}],48:[function(_dereq_,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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

module.exports = baseGetTag;

},{}],49:[function(_dereq_,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;

},{}],50:[function(_dereq_,module,exports){
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

module.exports = baseHasIn;

},{}],51:[function(_dereq_,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * The base implementation of `_.inRange` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}

module.exports = baseInRange;

},{}],52:[function(_dereq_,module,exports){
var baseFindIndex = _dereq_('./_baseFindIndex'),
    baseIsNaN = _dereq_('./_baseIsNaN');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./_baseFindIndex":42,"./_baseIsNaN":58}],53:[function(_dereq_,module,exports){
var SetCache = _dereq_('./_SetCache'),
    arrayIncludes = _dereq_('./_arrayIncludes'),
    arrayIncludesWith = _dereq_('./_arrayIncludesWith'),
    arrayMap = _dereq_('./_arrayMap'),
    baseUnary = _dereq_('./_baseUnary'),
    cacheHas = _dereq_('./_cacheHas');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

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

module.exports = baseIntersection;

},{"./_SetCache":14,"./_arrayIncludes":25,"./_arrayIncludesWith":26,"./_arrayMap":28,"./_baseUnary":83,"./_cacheHas":85}],54:[function(_dereq_,module,exports){
var apply = _dereq_('./_apply'),
    castPath = _dereq_('./_castPath'),
    isKey = _dereq_('./_isKey'),
    last = _dereq_('./last'),
    parent = _dereq_('./_parent'),
    toKey = _dereq_('./_toKey');

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

module.exports = baseInvoke;

},{"./_apply":21,"./_castPath":87,"./_isKey":149,"./_parent":174,"./_toKey":190,"./last":244}],55:[function(_dereq_,module,exports){
var baseIsEqualDeep = _dereq_('./_baseIsEqualDeep'),
    isObject = _dereq_('./isObject'),
    isObjectLike = _dereq_('./isObjectLike');

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

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":56,"./isObject":234,"./isObjectLike":235}],56:[function(_dereq_,module,exports){
var Stack = _dereq_('./_Stack'),
    equalArrays = _dereq_('./_equalArrays'),
    equalByTag = _dereq_('./_equalByTag'),
    equalObjects = _dereq_('./_equalObjects'),
    getTag = _dereq_('./_getTag'),
    isArray = _dereq_('./isArray'),
    isHostObject = _dereq_('./_isHostObject'),
    isTypedArray = _dereq_('./isTypedArray');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

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

module.exports = baseIsEqualDeep;

},{"./_Stack":15,"./_equalArrays":117,"./_equalByTag":118,"./_equalObjects":119,"./_getTag":132,"./_isHostObject":146,"./isArray":224,"./isTypedArray":240}],57:[function(_dereq_,module,exports){
var Stack = _dereq_('./_Stack'),
    baseIsEqual = _dereq_('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

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

module.exports = baseIsMatch;

},{"./_Stack":15,"./_baseIsEqual":55}],58:[function(_dereq_,module,exports){
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

module.exports = baseIsNaN;

},{}],59:[function(_dereq_,module,exports){
var isFunction = _dereq_('./isFunction'),
    isHostObject = _dereq_('./_isHostObject'),
    isMasked = _dereq_('./_isMasked'),
    isObject = _dereq_('./isObject'),
    toSource = _dereq_('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

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
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isHostObject":146,"./_isMasked":152,"./_toSource":191,"./isFunction":230,"./isObject":234}],60:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject');

/** `Object#toString` result references. */
var regexpTag = '[object RegExp]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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

module.exports = baseIsRegExp;

},{"./isObject":234}],61:[function(_dereq_,module,exports){
var isLength = _dereq_('./isLength'),
    isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
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

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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

module.exports = baseIsTypedArray;

},{"./isLength":231,"./isObjectLike":235}],62:[function(_dereq_,module,exports){
var baseMatches = _dereq_('./_baseMatches'),
    baseMatchesProperty = _dereq_('./_baseMatchesProperty'),
    identity = _dereq_('./identity'),
    isArray = _dereq_('./isArray'),
    property = _dereq_('./property');

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

module.exports = baseIteratee;

},{"./_baseMatches":67,"./_baseMatchesProperty":68,"./identity":216,"./isArray":224,"./property":256}],63:[function(_dereq_,module,exports){
var isPrototype = _dereq_('./_isPrototype'),
    nativeKeys = _dereq_('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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

module.exports = baseKeys;

},{"./_isPrototype":153,"./_nativeKeys":170}],64:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject'),
    isPrototype = _dereq_('./_isPrototype'),
    nativeKeysIn = _dereq_('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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

module.exports = baseKeysIn;

},{"./_isPrototype":153,"./_nativeKeysIn":171,"./isObject":234}],65:[function(_dereq_,module,exports){
/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;

},{}],66:[function(_dereq_,module,exports){
var baseEach = _dereq_('./_baseEach'),
    isArrayLike = _dereq_('./isArrayLike');

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

module.exports = baseMap;

},{"./_baseEach":39,"./isArrayLike":225}],67:[function(_dereq_,module,exports){
var baseIsMatch = _dereq_('./_baseIsMatch'),
    getMatchData = _dereq_('./_getMatchData'),
    matchesStrictComparable = _dereq_('./_matchesStrictComparable');

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

module.exports = baseMatches;

},{"./_baseIsMatch":57,"./_getMatchData":127,"./_matchesStrictComparable":166}],68:[function(_dereq_,module,exports){
var baseIsEqual = _dereq_('./_baseIsEqual'),
    get = _dereq_('./get'),
    hasIn = _dereq_('./hasIn'),
    isKey = _dereq_('./_isKey'),
    isStrictComparable = _dereq_('./_isStrictComparable'),
    matchesStrictComparable = _dereq_('./_matchesStrictComparable'),
    toKey = _dereq_('./_toKey');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

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

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":55,"./_isKey":149,"./_isStrictComparable":154,"./_matchesStrictComparable":166,"./_toKey":190,"./get":212,"./hasIn":214}],69:[function(_dereq_,module,exports){
var Stack = _dereq_('./_Stack'),
    arrayEach = _dereq_('./_arrayEach'),
    assignMergeValue = _dereq_('./_assignMergeValue'),
    baseKeysIn = _dereq_('./_baseKeysIn'),
    baseMergeDeep = _dereq_('./_baseMergeDeep'),
    isArray = _dereq_('./isArray'),
    isObject = _dereq_('./isObject'),
    isTypedArray = _dereq_('./isTypedArray');

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
  if (!(isArray(source) || isTypedArray(source))) {
    var props = baseKeysIn(source);
  }
  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
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
  });
}

module.exports = baseMerge;

},{"./_Stack":15,"./_arrayEach":22,"./_assignMergeValue":33,"./_baseKeysIn":64,"./_baseMergeDeep":70,"./isArray":224,"./isObject":234,"./isTypedArray":240}],70:[function(_dereq_,module,exports){
var assignMergeValue = _dereq_('./_assignMergeValue'),
    baseClone = _dereq_('./_baseClone'),
    copyArray = _dereq_('./_copyArray'),
    isArguments = _dereq_('./isArguments'),
    isArray = _dereq_('./isArray'),
    isArrayLikeObject = _dereq_('./isArrayLikeObject'),
    isFunction = _dereq_('./isFunction'),
    isObject = _dereq_('./isObject'),
    isPlainObject = _dereq_('./isPlainObject'),
    isTypedArray = _dereq_('./isTypedArray'),
    toPlainObject = _dereq_('./toPlainObject');

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
    newValue = srcValue;
    if (isArray(srcValue) || isTypedArray(srcValue)) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
      else {
        newValue = objValue;
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

module.exports = baseMergeDeep;

},{"./_assignMergeValue":33,"./_baseClone":37,"./_copyArray":100,"./isArguments":223,"./isArray":224,"./isArrayLikeObject":226,"./isFunction":230,"./isObject":234,"./isPlainObject":236,"./isTypedArray":240,"./toPlainObject":267}],71:[function(_dereq_,module,exports){
var arrayMap = _dereq_('./_arrayMap'),
    baseIteratee = _dereq_('./_baseIteratee'),
    baseMap = _dereq_('./_baseMap'),
    baseSortBy = _dereq_('./_baseSortBy'),
    baseUnary = _dereq_('./_baseUnary'),
    compareMultiple = _dereq_('./_compareMultiple'),
    identity = _dereq_('./identity');

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;

},{"./_arrayMap":28,"./_baseIteratee":62,"./_baseMap":66,"./_baseSortBy":80,"./_baseUnary":83,"./_compareMultiple":97,"./identity":216}],72:[function(_dereq_,module,exports){
var basePickBy = _dereq_('./_basePickBy');

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

module.exports = basePick;

},{"./_basePickBy":73}],73:[function(_dereq_,module,exports){
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
      result[key] = value;
    }
  }
  return result;
}

module.exports = basePickBy;

},{}],74:[function(_dereq_,module,exports){
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

module.exports = baseProperty;

},{}],75:[function(_dereq_,module,exports){
var baseGet = _dereq_('./_baseGet');

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

module.exports = basePropertyDeep;

},{"./_baseGet":46}],76:[function(_dereq_,module,exports){
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

module.exports = baseReduce;

},{}],77:[function(_dereq_,module,exports){
var apply = _dereq_('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
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
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

module.exports = baseRest;

},{"./_apply":21}],78:[function(_dereq_,module,exports){
var identity = _dereq_('./identity'),
    metaMap = _dereq_('./_metaMap');

/**
 * The base implementation of `setData` without support for hot loop detection.
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

module.exports = baseSetData;

},{"./_metaMap":168,"./identity":216}],79:[function(_dereq_,module,exports){
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

module.exports = baseSlice;

},{}],80:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;

},{}],81:[function(_dereq_,module,exports){
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

module.exports = baseTimes;

},{}],82:[function(_dereq_,module,exports){
var Symbol = _dereq_('./_Symbol'),
    isSymbol = _dereq_('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

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
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":16,"./isSymbol":239}],83:[function(_dereq_,module,exports){
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

module.exports = baseUnary;

},{}],84:[function(_dereq_,module,exports){
var arrayMap = _dereq_('./_arrayMap');

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

module.exports = baseValues;

},{"./_arrayMap":28}],85:[function(_dereq_,module,exports){
/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],86:[function(_dereq_,module,exports){
var isArrayLikeObject = _dereq_('./isArrayLikeObject');

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

module.exports = castArrayLikeObject;

},{"./isArrayLikeObject":226}],87:[function(_dereq_,module,exports){
var isArray = _dereq_('./isArray'),
    stringToPath = _dereq_('./_stringToPath');

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

module.exports = castPath;

},{"./_stringToPath":189,"./isArray":224}],88:[function(_dereq_,module,exports){
var Uint8Array = _dereq_('./_Uint8Array');

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

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":17}],89:[function(_dereq_,module,exports){
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
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{}],90:[function(_dereq_,module,exports){
var cloneArrayBuffer = _dereq_('./_cloneArrayBuffer');

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

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":88}],91:[function(_dereq_,module,exports){
var addMapEntry = _dereq_('./_addMapEntry'),
    arrayReduce = _dereq_('./_arrayReduce'),
    mapToArray = _dereq_('./_mapToArray');

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

module.exports = cloneMap;

},{"./_addMapEntry":19,"./_arrayReduce":30,"./_mapToArray":165}],92:[function(_dereq_,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

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

module.exports = cloneRegExp;

},{}],93:[function(_dereq_,module,exports){
var addSetEntry = _dereq_('./_addSetEntry'),
    arrayReduce = _dereq_('./_arrayReduce'),
    setToArray = _dereq_('./_setToArray');

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

module.exports = cloneSet;

},{"./_addSetEntry":20,"./_arrayReduce":30,"./_setToArray":182}],94:[function(_dereq_,module,exports){
var Symbol = _dereq_('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

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

module.exports = cloneSymbol;

},{"./_Symbol":16}],95:[function(_dereq_,module,exports){
var cloneArrayBuffer = _dereq_('./_cloneArrayBuffer');

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

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":88}],96:[function(_dereq_,module,exports){
var isSymbol = _dereq_('./isSymbol');

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;

},{"./isSymbol":239}],97:[function(_dereq_,module,exports){
var compareAscending = _dereq_('./_compareAscending');

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;

},{"./_compareAscending":96}],98:[function(_dereq_,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

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

module.exports = composeArgs;

},{}],99:[function(_dereq_,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

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

module.exports = composeArgsRight;

},{}],100:[function(_dereq_,module,exports){
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

module.exports = copyArray;

},{}],101:[function(_dereq_,module,exports){
var assignValue = _dereq_('./_assignValue');

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
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":34}],102:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    getSymbols = _dereq_('./_getSymbols');

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

module.exports = copySymbols;

},{"./_copyObject":101,"./_getSymbols":130}],103:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":178}],104:[function(_dereq_,module,exports){
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
      result++;
    }
  }
  return result;
}

module.exports = countHolders;

},{}],105:[function(_dereq_,module,exports){
var baseRest = _dereq_('./_baseRest'),
    isIterateeCall = _dereq_('./_isIterateeCall');

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

module.exports = createAssigner;

},{"./_baseRest":77,"./_isIterateeCall":148}],106:[function(_dereq_,module,exports){
var isArrayLike = _dereq_('./isArrayLike');

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

module.exports = createBaseEach;

},{"./isArrayLike":225}],107:[function(_dereq_,module,exports){
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

module.exports = createBaseFor;

},{}],108:[function(_dereq_,module,exports){
var createCtor = _dereq_('./_createCtor'),
    root = _dereq_('./_root');

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1;

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

module.exports = createBind;

},{"./_createCtor":109,"./_root":178}],109:[function(_dereq_,module,exports){
var baseCreate = _dereq_('./_baseCreate'),
    isObject = _dereq_('./isObject');

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

module.exports = createCtor;

},{"./_baseCreate":38,"./isObject":234}],110:[function(_dereq_,module,exports){
var apply = _dereq_('./_apply'),
    createCtor = _dereq_('./_createCtor'),
    createHybrid = _dereq_('./_createHybrid'),
    createRecurry = _dereq_('./_createRecurry'),
    getHolder = _dereq_('./_getHolder'),
    replaceHolders = _dereq_('./_replaceHolders'),
    root = _dereq_('./_root');

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

module.exports = createCurry;

},{"./_apply":21,"./_createCtor":109,"./_createHybrid":112,"./_createRecurry":114,"./_getHolder":125,"./_replaceHolders":177,"./_root":178}],111:[function(_dereq_,module,exports){
var baseIteratee = _dereq_('./_baseIteratee'),
    isArrayLike = _dereq_('./isArrayLike'),
    keys = _dereq_('./keys');

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
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;

},{"./_baseIteratee":62,"./isArrayLike":225,"./keys":242}],112:[function(_dereq_,module,exports){
var composeArgs = _dereq_('./_composeArgs'),
    composeArgsRight = _dereq_('./_composeArgsRight'),
    countHolders = _dereq_('./_countHolders'),
    createCtor = _dereq_('./_createCtor'),
    createRecurry = _dereq_('./_createRecurry'),
    getHolder = _dereq_('./_getHolder'),
    reorder = _dereq_('./_reorder'),
    replaceHolders = _dereq_('./_replaceHolders'),
    root = _dereq_('./_root');

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    ARY_FLAG = 128,
    FLIP_FLAG = 512;

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

module.exports = createHybrid;

},{"./_composeArgs":98,"./_composeArgsRight":99,"./_countHolders":104,"./_createCtor":109,"./_createRecurry":114,"./_getHolder":125,"./_reorder":176,"./_replaceHolders":177,"./_root":178}],113:[function(_dereq_,module,exports){
var apply = _dereq_('./_apply'),
    createCtor = _dereq_('./_createCtor'),
    root = _dereq_('./_root');

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1;

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

module.exports = createPartial;

},{"./_apply":21,"./_createCtor":109,"./_root":178}],114:[function(_dereq_,module,exports){
var isLaziable = _dereq_('./_isLaziable'),
    setData = _dereq_('./_setData'),
    setWrapToString = _dereq_('./_setWrapToString');

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64;

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

module.exports = createRecurry;

},{"./_isLaziable":151,"./_setData":181,"./_setWrapToString":183}],115:[function(_dereq_,module,exports){
var baseSetData = _dereq_('./_baseSetData'),
    createBind = _dereq_('./_createBind'),
    createCurry = _dereq_('./_createCurry'),
    createHybrid = _dereq_('./_createHybrid'),
    createPartial = _dereq_('./_createPartial'),
    getData = _dereq_('./_getData'),
    mergeData = _dereq_('./_mergeData'),
    setData = _dereq_('./_setData'),
    setWrapToString = _dereq_('./_setWrapToString'),
    toInteger = _dereq_('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

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

module.exports = createWrap;

},{"./_baseSetData":78,"./_createBind":108,"./_createCurry":110,"./_createHybrid":112,"./_createPartial":113,"./_getData":123,"./_mergeData":167,"./_setData":181,"./_setWrapToString":183,"./toInteger":265}],116:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative');

/* Used to set `toString` methods. */
var defineProperty = (function() {
  var func = getNative(Object, 'defineProperty'),
      name = getNative.name;

  return (name && name.length > 2) ? func : undefined;
}());

module.exports = defineProperty;

},{"./_getNative":128}],117:[function(_dereq_,module,exports){
var SetCache = _dereq_('./_SetCache'),
    arraySome = _dereq_('./_arraySome');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

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
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
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

module.exports = equalArrays;

},{"./_SetCache":14,"./_arraySome":31}],118:[function(_dereq_,module,exports){
var Symbol = _dereq_('./_Symbol'),
    Uint8Array = _dereq_('./_Uint8Array'),
    eq = _dereq_('./eq'),
    equalArrays = _dereq_('./_equalArrays'),
    mapToArray = _dereq_('./_mapToArray'),
    setToArray = _dereq_('./_setToArray');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

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

module.exports = equalByTag;

},{"./_Symbol":16,"./_Uint8Array":17,"./_equalArrays":117,"./_mapToArray":165,"./_setToArray":182,"./eq":204}],119:[function(_dereq_,module,exports){
var keys = _dereq_('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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

module.exports = equalObjects;

},{"./keys":242}],120:[function(_dereq_,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],121:[function(_dereq_,module,exports){
var baseGetAllKeys = _dereq_('./_baseGetAllKeys'),
    getSymbols = _dereq_('./_getSymbols'),
    keys = _dereq_('./keys');

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

module.exports = getAllKeys;

},{"./_baseGetAllKeys":47,"./_getSymbols":130,"./keys":242}],122:[function(_dereq_,module,exports){
var baseGetAllKeys = _dereq_('./_baseGetAllKeys'),
    getSymbolsIn = _dereq_('./_getSymbolsIn'),
    keysIn = _dereq_('./keysIn');

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

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":47,"./_getSymbolsIn":131,"./keysIn":243}],123:[function(_dereq_,module,exports){
var metaMap = _dereq_('./_metaMap'),
    noop = _dereq_('./noop');

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

module.exports = getData;

},{"./_metaMap":168,"./noop":249}],124:[function(_dereq_,module,exports){
var realNames = _dereq_('./_realNames');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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

module.exports = getFuncName;

},{"./_realNames":175}],125:[function(_dereq_,module,exports){
/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder(func) {
  var object = func;
  return object.placeholder;
}

module.exports = getHolder;

},{}],126:[function(_dereq_,module,exports){
var isKeyable = _dereq_('./_isKeyable');

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

module.exports = getMapData;

},{"./_isKeyable":150}],127:[function(_dereq_,module,exports){
var isStrictComparable = _dereq_('./_isStrictComparable'),
    keys = _dereq_('./keys');

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

module.exports = getMatchData;

},{"./_isStrictComparable":154,"./keys":242}],128:[function(_dereq_,module,exports){
var baseIsNative = _dereq_('./_baseIsNative'),
    getValue = _dereq_('./_getValue');

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

module.exports = getNative;

},{"./_baseIsNative":59,"./_getValue":133}],129:[function(_dereq_,module,exports){
var overArg = _dereq_('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":173}],130:[function(_dereq_,module,exports){
var overArg = _dereq_('./_overArg'),
    stubArray = _dereq_('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

module.exports = getSymbols;

},{"./_overArg":173,"./stubArray":261}],131:[function(_dereq_,module,exports){
var arrayPush = _dereq_('./_arrayPush'),
    getPrototype = _dereq_('./_getPrototype'),
    getSymbols = _dereq_('./_getSymbols'),
    stubArray = _dereq_('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

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

module.exports = getSymbolsIn;

},{"./_arrayPush":29,"./_getPrototype":129,"./_getSymbols":130,"./stubArray":261}],132:[function(_dereq_,module,exports){
var DataView = _dereq_('./_DataView'),
    Map = _dereq_('./_Map'),
    Promise = _dereq_('./_Promise'),
    Set = _dereq_('./_Set'),
    WeakMap = _dereq_('./_WeakMap'),
    baseGetTag = _dereq_('./_baseGetTag'),
    toSource = _dereq_('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge, and promises in Node.js.
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

module.exports = getTag;

},{"./_DataView":5,"./_Map":10,"./_Promise":12,"./_Set":13,"./_WeakMap":18,"./_baseGetTag":48,"./_toSource":191}],133:[function(_dereq_,module,exports){
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

module.exports = getValue;

},{}],134:[function(_dereq_,module,exports){
/** Used to match wrap detail comments. */
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

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

module.exports = getWrapDetails;

},{}],135:[function(_dereq_,module,exports){
var castPath = _dereq_('./_castPath'),
    isArguments = _dereq_('./isArguments'),
    isArray = _dereq_('./isArray'),
    isIndex = _dereq_('./_isIndex'),
    isKey = _dereq_('./_isKey'),
    isLength = _dereq_('./isLength'),
    isString = _dereq_('./isString'),
    toKey = _dereq_('./_toKey');

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

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isString(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":87,"./_isIndex":147,"./_isKey":149,"./_toKey":190,"./isArguments":223,"./isArray":224,"./isLength":231,"./isString":238}],136:[function(_dereq_,module,exports){
var nativeCreate = _dereq_('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

module.exports = hashClear;

},{"./_nativeCreate":169}],137:[function(_dereq_,module,exports){
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
  return this.has(key) && delete this.__data__[key];
}

module.exports = hashDelete;

},{}],138:[function(_dereq_,module,exports){
var nativeCreate = _dereq_('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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

module.exports = hashGet;

},{"./_nativeCreate":169}],139:[function(_dereq_,module,exports){
var nativeCreate = _dereq_('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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

module.exports = hashHas;

},{"./_nativeCreate":169}],140:[function(_dereq_,module,exports){
var nativeCreate = _dereq_('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

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
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":169}],141:[function(_dereq_,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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

module.exports = initCloneArray;

},{}],142:[function(_dereq_,module,exports){
var cloneArrayBuffer = _dereq_('./_cloneArrayBuffer'),
    cloneDataView = _dereq_('./_cloneDataView'),
    cloneMap = _dereq_('./_cloneMap'),
    cloneRegExp = _dereq_('./_cloneRegExp'),
    cloneSet = _dereq_('./_cloneSet'),
    cloneSymbol = _dereq_('./_cloneSymbol'),
    cloneTypedArray = _dereq_('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

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

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":88,"./_cloneDataView":90,"./_cloneMap":91,"./_cloneRegExp":92,"./_cloneSet":93,"./_cloneSymbol":94,"./_cloneTypedArray":95}],143:[function(_dereq_,module,exports){
var baseCreate = _dereq_('./_baseCreate'),
    getPrototype = _dereq_('./_getPrototype'),
    isPrototype = _dereq_('./_isPrototype');

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

module.exports = initCloneObject;

},{"./_baseCreate":38,"./_getPrototype":129,"./_isPrototype":153}],144:[function(_dereq_,module,exports){
/** Used to match wrap detail comments. */
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails(source, details) {
  var length = details.length,
      lastIndex = length - 1;

  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}

module.exports = insertWrapDetails;

},{}],145:[function(_dereq_,module,exports){
var Symbol = _dereq_('./_Symbol'),
    isArguments = _dereq_('./isArguments'),
    isArray = _dereq_('./isArray');

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

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

module.exports = isFlattenable;

},{"./_Symbol":16,"./isArguments":223,"./isArray":224}],146:[function(_dereq_,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],147:[function(_dereq_,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

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

module.exports = isIndex;

},{}],148:[function(_dereq_,module,exports){
var eq = _dereq_('./eq'),
    isArrayLike = _dereq_('./isArrayLike'),
    isIndex = _dereq_('./_isIndex'),
    isObject = _dereq_('./isObject');

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

module.exports = isIterateeCall;

},{"./_isIndex":147,"./eq":204,"./isArrayLike":225,"./isObject":234}],149:[function(_dereq_,module,exports){
var isArray = _dereq_('./isArray'),
    isSymbol = _dereq_('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

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

module.exports = isKey;

},{"./isArray":224,"./isSymbol":239}],150:[function(_dereq_,module,exports){
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

module.exports = isKeyable;

},{}],151:[function(_dereq_,module,exports){
var LazyWrapper = _dereq_('./_LazyWrapper'),
    getData = _dereq_('./_getData'),
    getFuncName = _dereq_('./_getFuncName'),
    lodash = _dereq_('./wrapperLodash');

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

module.exports = isLaziable;

},{"./_LazyWrapper":7,"./_getData":123,"./_getFuncName":124,"./wrapperLodash":271}],152:[function(_dereq_,module,exports){
var coreJsData = _dereq_('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

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

module.exports = isMasked;

},{"./_coreJsData":103}],153:[function(_dereq_,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

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

module.exports = isPrototype;

},{}],154:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject');

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

module.exports = isStrictComparable;

},{"./isObject":234}],155:[function(_dereq_,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

module.exports = listCacheClear;

},{}],156:[function(_dereq_,module,exports){
var assocIndexOf = _dereq_('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

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
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":35}],157:[function(_dereq_,module,exports){
var assocIndexOf = _dereq_('./_assocIndexOf');

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

module.exports = listCacheGet;

},{"./_assocIndexOf":35}],158:[function(_dereq_,module,exports){
var assocIndexOf = _dereq_('./_assocIndexOf');

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

module.exports = listCacheHas;

},{"./_assocIndexOf":35}],159:[function(_dereq_,module,exports){
var assocIndexOf = _dereq_('./_assocIndexOf');

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
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":35}],160:[function(_dereq_,module,exports){
var Hash = _dereq_('./_Hash'),
    ListCache = _dereq_('./_ListCache'),
    Map = _dereq_('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":6,"./_ListCache":8,"./_Map":10}],161:[function(_dereq_,module,exports){
var getMapData = _dereq_('./_getMapData');

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
  return getMapData(this, key)['delete'](key);
}

module.exports = mapCacheDelete;

},{"./_getMapData":126}],162:[function(_dereq_,module,exports){
var getMapData = _dereq_('./_getMapData');

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

module.exports = mapCacheGet;

},{"./_getMapData":126}],163:[function(_dereq_,module,exports){
var getMapData = _dereq_('./_getMapData');

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

module.exports = mapCacheHas;

},{"./_getMapData":126}],164:[function(_dereq_,module,exports){
var getMapData = _dereq_('./_getMapData');

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
  getMapData(this, key).set(key, value);
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":126}],165:[function(_dereq_,module,exports){
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

module.exports = mapToArray;

},{}],166:[function(_dereq_,module,exports){
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

module.exports = matchesStrictComparable;

},{}],167:[function(_dereq_,module,exports){
var composeArgs = _dereq_('./_composeArgs'),
    composeArgsRight = _dereq_('./_composeArgsRight'),
    replaceHolders = _dereq_('./_replaceHolders');

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    ARY_FLAG = 128,
    REARG_FLAG = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

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

module.exports = mergeData;

},{"./_composeArgs":98,"./_composeArgsRight":99,"./_replaceHolders":177}],168:[function(_dereq_,module,exports){
var WeakMap = _dereq_('./_WeakMap');

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;

},{"./_WeakMap":18}],169:[function(_dereq_,module,exports){
var getNative = _dereq_('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":128}],170:[function(_dereq_,module,exports){
var overArg = _dereq_('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":173}],171:[function(_dereq_,module,exports){
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

module.exports = nativeKeysIn;

},{}],172:[function(_dereq_,module,exports){
var freeGlobal = _dereq_('./_freeGlobal');

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

module.exports = nodeUtil;

},{"./_freeGlobal":120}],173:[function(_dereq_,module,exports){
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

module.exports = overArg;

},{}],174:[function(_dereq_,module,exports){
var baseGet = _dereq_('./_baseGet'),
    baseSlice = _dereq_('./_baseSlice');

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

module.exports = parent;

},{"./_baseGet":46,"./_baseSlice":79}],175:[function(_dereq_,module,exports){
/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;

},{}],176:[function(_dereq_,module,exports){
var copyArray = _dereq_('./_copyArray'),
    isIndex = _dereq_('./_isIndex');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

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

module.exports = reorder;

},{"./_copyArray":100,"./_isIndex":147}],177:[function(_dereq_,module,exports){
/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

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

module.exports = replaceHolders;

},{}],178:[function(_dereq_,module,exports){
var freeGlobal = _dereq_('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":120}],179:[function(_dereq_,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

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

module.exports = setCacheAdd;

},{}],180:[function(_dereq_,module,exports){
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

module.exports = setCacheHas;

},{}],181:[function(_dereq_,module,exports){
var baseSetData = _dereq_('./_baseSetData'),
    now = _dereq_('./now');

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 150,
    HOT_SPAN = 16;

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
var setData = (function() {
  var count = 0,
      lastCalled = 0;

  return function(key, value) {
    var stamp = now(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return key;
      }
    } else {
      count = 0;
    }
    return baseSetData(key, value);
  };
}());

module.exports = setData;

},{"./_baseSetData":78,"./now":250}],182:[function(_dereq_,module,exports){
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

module.exports = setToArray;

},{}],183:[function(_dereq_,module,exports){
var constant = _dereq_('./constant'),
    defineProperty = _dereq_('./_defineProperty'),
    getWrapDetails = _dereq_('./_getWrapDetails'),
    identity = _dereq_('./identity'),
    insertWrapDetails = _dereq_('./_insertWrapDetails'),
    updateWrapDetails = _dereq_('./_updateWrapDetails');

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
var setWrapToString = !defineProperty ? identity : function(wrapper, reference, bitmask) {
  var source = (reference + '');
  return defineProperty(wrapper, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)))
  });
};

module.exports = setWrapToString;

},{"./_defineProperty":116,"./_getWrapDetails":134,"./_insertWrapDetails":144,"./_updateWrapDetails":192,"./constant":200,"./identity":216}],184:[function(_dereq_,module,exports){
var ListCache = _dereq_('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

module.exports = stackClear;

},{"./_ListCache":8}],185:[function(_dereq_,module,exports){
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
  return this.__data__['delete'](key);
}

module.exports = stackDelete;

},{}],186:[function(_dereq_,module,exports){
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

module.exports = stackGet;

},{}],187:[function(_dereq_,module,exports){
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

module.exports = stackHas;

},{}],188:[function(_dereq_,module,exports){
var ListCache = _dereq_('./_ListCache'),
    Map = _dereq_('./_Map'),
    MapCache = _dereq_('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

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
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

module.exports = stackSet;

},{"./_ListCache":8,"./_Map":10,"./_MapCache":11}],189:[function(_dereq_,module,exports){
var memoize = _dereq_('./memoize'),
    toString = _dereq_('./toString');

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
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

module.exports = stringToPath;

},{"./memoize":246,"./toString":268}],190:[function(_dereq_,module,exports){
var isSymbol = _dereq_('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

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

module.exports = toKey;

},{"./isSymbol":239}],191:[function(_dereq_,module,exports){
/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

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

module.exports = toSource;

},{}],192:[function(_dereq_,module,exports){
var arrayEach = _dereq_('./_arrayEach'),
    arrayIncludes = _dereq_('./_arrayIncludes');

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128,
    REARG_FLAG = 256,
    FLIP_FLAG = 512;

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

module.exports = updateWrapDetails;

},{"./_arrayEach":22,"./_arrayIncludes":25}],193:[function(_dereq_,module,exports){
var LazyWrapper = _dereq_('./_LazyWrapper'),
    LodashWrapper = _dereq_('./_LodashWrapper'),
    copyArray = _dereq_('./_copyArray');

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

module.exports = wrapperClone;

},{"./_LazyWrapper":7,"./_LodashWrapper":9,"./_copyArray":100}],194:[function(_dereq_,module,exports){
var toInteger = _dereq_('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * The opposite of `_.before`; this method creates a function that invokes
 * `func` once it's called `n` or more times.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {number} n The number of calls before `func` is invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var saves = ['profile', 'settings'];
 *
 * var done = _.after(saves.length, function() {
 *   console.log('done saving!');
 * });
 *
 * _.forEach(saves, function(type) {
 *   asyncSave({ 'type': type, 'complete': done });
 * });
 * // => Logs 'done saving!' after the two async saves have completed.
 */
function after(n, func) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  n = toInteger(n);
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
}

module.exports = after;

},{"./toInteger":265}],195:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    createAssigner = _dereq_('./_createAssigner'),
    keysIn = _dereq_('./keysIn');

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

module.exports = assignIn;

},{"./_copyObject":101,"./_createAssigner":105,"./keysIn":243}],196:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    createAssigner = _dereq_('./_createAssigner'),
    keysIn = _dereq_('./keysIn');

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;

},{"./_copyObject":101,"./_createAssigner":105,"./keysIn":243}],197:[function(_dereq_,module,exports){
var toInteger = _dereq_('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  n = toInteger(n);
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

module.exports = before;

},{"./toInteger":265}],198:[function(_dereq_,module,exports){
var baseRest = _dereq_('./_baseRest'),
    createWrap = _dereq_('./_createWrap'),
    getHolder = _dereq_('./_getHolder'),
    replaceHolders = _dereq_('./_replaceHolders');

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    PARTIAL_FLAG = 32;

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

// Assign default placeholders.
bind.placeholder = {};

module.exports = bind;

},{"./_baseRest":77,"./_createWrap":115,"./_getHolder":125,"./_replaceHolders":177}],199:[function(_dereq_,module,exports){
var baseClone = _dereq_('./_baseClone');

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

module.exports = clone;

},{"./_baseClone":37}],200:[function(_dereq_,module,exports){
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

module.exports = constant;

},{}],201:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject'),
    now = _dereq_('./now'),
    toNumber = _dereq_('./toNumber');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":234,"./now":250,"./toNumber":266}],202:[function(_dereq_,module,exports){
var apply = _dereq_('./_apply'),
    assignInDefaults = _dereq_('./_assignInDefaults'),
    assignInWith = _dereq_('./assignInWith'),
    baseRest = _dereq_('./_baseRest');

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(args) {
  args.push(undefined, assignInDefaults);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;

},{"./_apply":21,"./_assignInDefaults":32,"./_baseRest":77,"./assignInWith":196}],203:[function(_dereq_,module,exports){
module.exports = _dereq_('./forEach');

},{"./forEach":211}],204:[function(_dereq_,module,exports){
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

module.exports = eq;

},{}],205:[function(_dereq_,module,exports){
var arrayEvery = _dereq_('./_arrayEvery'),
    baseEvery = _dereq_('./_baseEvery'),
    baseIteratee = _dereq_('./_baseIteratee'),
    isArray = _dereq_('./isArray'),
    isIterateeCall = _dereq_('./_isIterateeCall');

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
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = every;

},{"./_arrayEvery":23,"./_baseEvery":40,"./_baseIteratee":62,"./_isIterateeCall":148,"./isArray":224}],206:[function(_dereq_,module,exports){
module.exports = _dereq_('./assignIn');

},{"./assignIn":195}],207:[function(_dereq_,module,exports){
var arrayFilter = _dereq_('./_arrayFilter'),
    baseFilter = _dereq_('./_baseFilter'),
    baseIteratee = _dereq_('./_baseIteratee'),
    isArray = _dereq_('./isArray');

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
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;

},{"./_arrayFilter":24,"./_baseFilter":41,"./_baseIteratee":62,"./isArray":224}],208:[function(_dereq_,module,exports){
var createFind = _dereq_('./_createFind'),
    findIndex = _dereq_('./findIndex');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to search.
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

module.exports = find;

},{"./_createFind":111,"./findIndex":209}],209:[function(_dereq_,module,exports){
var baseFindIndex = _dereq_('./_baseFindIndex'),
    baseIteratee = _dereq_('./_baseIteratee'),
    toInteger = _dereq_('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to search.
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
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

},{"./_baseFindIndex":42,"./_baseIteratee":62,"./toInteger":265}],210:[function(_dereq_,module,exports){
module.exports = _dereq_('./head');

},{"./head":215}],211:[function(_dereq_,module,exports){
var arrayEach = _dereq_('./_arrayEach'),
    baseEach = _dereq_('./_baseEach'),
    baseIteratee = _dereq_('./_baseIteratee'),
    isArray = _dereq_('./isArray');

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
 * _([1, 2]).forEach(function(value) {
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
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEach;

},{"./_arrayEach":22,"./_baseEach":39,"./_baseIteratee":62,"./isArray":224}],212:[function(_dereq_,module,exports){
var baseGet = _dereq_('./_baseGet');

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

module.exports = get;

},{"./_baseGet":46}],213:[function(_dereq_,module,exports){
var baseHas = _dereq_('./_baseHas'),
    hasPath = _dereq_('./_hasPath');

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

},{"./_baseHas":49,"./_hasPath":135}],214:[function(_dereq_,module,exports){
var baseHasIn = _dereq_('./_baseHasIn'),
    hasPath = _dereq_('./_hasPath');

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

module.exports = hasIn;

},{"./_baseHasIn":50,"./_hasPath":135}],215:[function(_dereq_,module,exports){
/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return (array && array.length) ? array[0] : undefined;
}

module.exports = head;

},{}],216:[function(_dereq_,module,exports){
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

module.exports = identity;

},{}],217:[function(_dereq_,module,exports){
var baseInRange = _dereq_('./_baseInRange'),
    toFinite = _dereq_('./toFinite'),
    toNumber = _dereq_('./toNumber');

/**
 * Checks if `n` is between `start` and up to, but not including, `end`. If
 * `end` is not specified, it's set to `start` with `start` then set to `0`.
 * If `start` is greater than `end` the params are swapped to support
 * negative ranges.
 *
 * @static
 * @memberOf _
 * @since 3.3.0
 * @category Number
 * @param {number} number The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 * @see _.range, _.rangeRight
 * @example
 *
 * _.inRange(3, 2, 4);
 * // => true
 *
 * _.inRange(4, 8);
 * // => true
 *
 * _.inRange(4, 2);
 * // => false
 *
 * _.inRange(2, 2);
 * // => false
 *
 * _.inRange(1.2, 2);
 * // => true
 *
 * _.inRange(5.2, 4);
 * // => false
 *
 * _.inRange(-3, -2, -6);
 * // => true
 */
function inRange(number, start, end) {
  start = toFinite(start);
  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toFinite(end);
  }
  number = toNumber(number);
  return baseInRange(number, start, end);
}

module.exports = inRange;

},{"./_baseInRange":51,"./toFinite":264,"./toNumber":266}],218:[function(_dereq_,module,exports){
var baseIndexOf = _dereq_('./_baseIndexOf'),
    isArrayLike = _dereq_('./isArrayLike'),
    isString = _dereq_('./isString'),
    toInteger = _dereq_('./toInteger'),
    values = _dereq_('./values');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

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
 * @param {Array|Object|string} collection The collection to search.
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

module.exports = includes;

},{"./_baseIndexOf":52,"./isArrayLike":225,"./isString":238,"./toInteger":265,"./values":270}],219:[function(_dereq_,module,exports){
var baseIndexOf = _dereq_('./_baseIndexOf'),
    toInteger = _dereq_('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

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
 * @param {Array} array The array to search.
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

module.exports = indexOf;

},{"./_baseIndexOf":52,"./toInteger":265}],220:[function(_dereq_,module,exports){
var arrayMap = _dereq_('./_arrayMap'),
    baseIntersection = _dereq_('./_baseIntersection'),
    baseRest = _dereq_('./_baseRest'),
    castArrayLikeObject = _dereq_('./_castArrayLikeObject');

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
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

module.exports = intersection;

},{"./_arrayMap":28,"./_baseIntersection":53,"./_baseRest":77,"./_castArrayLikeObject":86}],221:[function(_dereq_,module,exports){
var baseInvoke = _dereq_('./_baseInvoke'),
    baseRest = _dereq_('./_baseRest');

/**
 * Invokes the method at `path` of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
 *
 * _.invoke(object, 'a[0].b.c.slice', 1, 3);
 * // => [2, 3]
 */
var invoke = baseRest(baseInvoke);

module.exports = invoke;

},{"./_baseInvoke":54,"./_baseRest":77}],222:[function(_dereq_,module,exports){
var apply = _dereq_('./_apply'),
    baseEach = _dereq_('./_baseEach'),
    baseInvoke = _dereq_('./_baseInvoke'),
    baseRest = _dereq_('./_baseRest'),
    isArrayLike = _dereq_('./isArrayLike'),
    isKey = _dereq_('./_isKey');

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

module.exports = invokeMap;

},{"./_apply":21,"./_baseEach":39,"./_baseInvoke":54,"./_baseRest":77,"./_isKey":149,"./isArrayLike":225}],223:[function(_dereq_,module,exports){
var isArrayLikeObject = _dereq_('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

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
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

},{"./isArrayLikeObject":226}],224:[function(_dereq_,module,exports){
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

module.exports = isArray;

},{}],225:[function(_dereq_,module,exports){
var isFunction = _dereq_('./isFunction'),
    isLength = _dereq_('./isLength');

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

module.exports = isArrayLike;

},{"./isFunction":230,"./isLength":231}],226:[function(_dereq_,module,exports){
var isArrayLike = _dereq_('./isArrayLike'),
    isObjectLike = _dereq_('./isObjectLike');

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

module.exports = isArrayLikeObject;

},{"./isArrayLike":225,"./isObjectLike":235}],227:[function(_dereq_,module,exports){
var isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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

module.exports = isBoolean;

},{"./isObjectLike":235}],228:[function(_dereq_,module,exports){
var root = _dereq_('./_root'),
    stubFalse = _dereq_('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

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

module.exports = isBuffer;

},{"./_root":178,"./stubFalse":262}],229:[function(_dereq_,module,exports){
var baseIsEqual = _dereq_('./_baseIsEqual');

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

module.exports = isEqual;

},{"./_baseIsEqual":55}],230:[function(_dereq_,module,exports){
var isObject = _dereq_('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

},{"./isObject":234}],231:[function(_dereq_,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

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

module.exports = isLength;

},{}],232:[function(_dereq_,module,exports){
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

module.exports = isNull;

},{}],233:[function(_dereq_,module,exports){
var isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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

module.exports = isNumber;

},{"./isObjectLike":235}],234:[function(_dereq_,module,exports){
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
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],235:[function(_dereq_,module,exports){
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
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],236:[function(_dereq_,module,exports){
var getPrototype = _dereq_('./_getPrototype'),
    isHostObject = _dereq_('./_isHostObject'),
    isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

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
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
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

module.exports = isPlainObject;

},{"./_getPrototype":129,"./_isHostObject":146,"./isObjectLike":235}],237:[function(_dereq_,module,exports){
var baseIsRegExp = _dereq_('./_baseIsRegExp'),
    baseUnary = _dereq_('./_baseUnary'),
    nodeUtil = _dereq_('./_nodeUtil');

/* Node.js helper references. */
var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;

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

module.exports = isRegExp;

},{"./_baseIsRegExp":60,"./_baseUnary":83,"./_nodeUtil":172}],238:[function(_dereq_,module,exports){
var isArray = _dereq_('./isArray'),
    isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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

module.exports = isString;

},{"./isArray":224,"./isObjectLike":235}],239:[function(_dereq_,module,exports){
var isObjectLike = _dereq_('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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

module.exports = isSymbol;

},{"./isObjectLike":235}],240:[function(_dereq_,module,exports){
var baseIsTypedArray = _dereq_('./_baseIsTypedArray'),
    baseUnary = _dereq_('./_baseUnary'),
    nodeUtil = _dereq_('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

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

module.exports = isTypedArray;

},{"./_baseIsTypedArray":61,"./_baseUnary":83,"./_nodeUtil":172}],241:[function(_dereq_,module,exports){
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

module.exports = isUndefined;

},{}],242:[function(_dereq_,module,exports){
var arrayLikeKeys = _dereq_('./_arrayLikeKeys'),
    baseKeys = _dereq_('./_baseKeys'),
    isArrayLike = _dereq_('./isArrayLike');

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

module.exports = keys;

},{"./_arrayLikeKeys":27,"./_baseKeys":63,"./isArrayLike":225}],243:[function(_dereq_,module,exports){
var arrayLikeKeys = _dereq_('./_arrayLikeKeys'),
    baseKeysIn = _dereq_('./_baseKeysIn'),
    isArrayLike = _dereq_('./isArrayLike');

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

module.exports = keysIn;

},{"./_arrayLikeKeys":27,"./_baseKeysIn":64,"./isArrayLike":225}],244:[function(_dereq_,module,exports){
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

module.exports = last;

},{}],245:[function(_dereq_,module,exports){
var arrayMap = _dereq_('./_arrayMap'),
    baseIteratee = _dereq_('./_baseIteratee'),
    baseMap = _dereq_('./_baseMap'),
    isArray = _dereq_('./isArray');

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
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

},{"./_arrayMap":28,"./_baseIteratee":62,"./_baseMap":66,"./isArray":224}],246:[function(_dereq_,module,exports){
var MapCache = _dereq_('./_MapCache');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

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
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":11}],247:[function(_dereq_,module,exports){
var baseMerge = _dereq_('./_baseMerge'),
    createAssigner = _dereq_('./_createAssigner');

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

module.exports = merge;

},{"./_baseMerge":69,"./_createAssigner":105}],248:[function(_dereq_,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

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

module.exports = negate;

},{}],249:[function(_dereq_,module,exports){
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

module.exports = noop;

},{}],250:[function(_dereq_,module,exports){
var root = _dereq_('./_root');

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;

},{"./_root":178}],251:[function(_dereq_,module,exports){
var baseIteratee = _dereq_('./_baseIteratee'),
    negate = _dereq_('./negate'),
    pickBy = _dereq_('./pickBy');

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
  return pickBy(object, negate(baseIteratee(predicate)));
}

module.exports = omitBy;

},{"./_baseIteratee":62,"./negate":248,"./pickBy":255}],252:[function(_dereq_,module,exports){
var before = _dereq_('./before');

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */
function once(func) {
  return before(2, func);
}

module.exports = once;

},{"./before":197}],253:[function(_dereq_,module,exports){
var baseRest = _dereq_('./_baseRest'),
    createWrap = _dereq_('./_createWrap'),
    getHolder = _dereq_('./_getHolder'),
    replaceHolders = _dereq_('./_replaceHolders');

/** Used to compose bitmasks for function metadata. */
var PARTIAL_FLAG = 32;

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

// Assign default placeholders.
partial.placeholder = {};

module.exports = partial;

},{"./_baseRest":77,"./_createWrap":115,"./_getHolder":125,"./_replaceHolders":177}],254:[function(_dereq_,module,exports){
var arrayMap = _dereq_('./_arrayMap'),
    baseFlatten = _dereq_('./_baseFlatten'),
    basePick = _dereq_('./_basePick'),
    baseRest = _dereq_('./_baseRest'),
    toKey = _dereq_('./_toKey');

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
var pick = baseRest(function(object, props) {
  return object == null ? {} : basePick(object, arrayMap(baseFlatten(props, 1), toKey));
});

module.exports = pick;

},{"./_arrayMap":28,"./_baseFlatten":43,"./_basePick":72,"./_baseRest":77,"./_toKey":190}],255:[function(_dereq_,module,exports){
var baseIteratee = _dereq_('./_baseIteratee'),
    basePickBy = _dereq_('./_basePickBy'),
    getAllKeysIn = _dereq_('./_getAllKeysIn');

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
  return object == null ? {} : basePickBy(object, getAllKeysIn(object), baseIteratee(predicate));
}

module.exports = pickBy;

},{"./_baseIteratee":62,"./_basePickBy":73,"./_getAllKeysIn":122}],256:[function(_dereq_,module,exports){
var baseProperty = _dereq_('./_baseProperty'),
    basePropertyDeep = _dereq_('./_basePropertyDeep'),
    isKey = _dereq_('./_isKey'),
    toKey = _dereq_('./_toKey');

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

module.exports = property;

},{"./_baseProperty":74,"./_basePropertyDeep":75,"./_isKey":149,"./_toKey":190}],257:[function(_dereq_,module,exports){
var arrayReduce = _dereq_('./_arrayReduce'),
    baseEach = _dereq_('./_baseEach'),
    baseIteratee = _dereq_('./_baseIteratee'),
    baseReduce = _dereq_('./_baseReduce'),
    isArray = _dereq_('./isArray');

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

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;

},{"./_arrayReduce":30,"./_baseEach":39,"./_baseIteratee":62,"./_baseReduce":76,"./isArray":224}],258:[function(_dereq_,module,exports){
var arrayFilter = _dereq_('./_arrayFilter'),
    baseFilter = _dereq_('./_baseFilter'),
    baseIteratee = _dereq_('./_baseIteratee'),
    isArray = _dereq_('./isArray'),
    negate = _dereq_('./negate');

/**
 * The opposite of `_.filter`; this method returns the elements of `collection`
 * that `predicate` does **not** return truthy for.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.filter
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': true }
 * ];
 *
 * _.reject(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.reject(users, { 'age': 40, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.reject(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.reject(users, 'active');
 * // => objects for ['barney']
 */
function reject(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, negate(baseIteratee(predicate, 3)));
}

module.exports = reject;

},{"./_arrayFilter":24,"./_baseFilter":41,"./_baseIteratee":62,"./isArray":224,"./negate":248}],259:[function(_dereq_,module,exports){
var castPath = _dereq_('./_castPath'),
    isFunction = _dereq_('./isFunction'),
    isKey = _dereq_('./_isKey'),
    toKey = _dereq_('./_toKey');

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

module.exports = result;

},{"./_castPath":87,"./_isKey":149,"./_toKey":190,"./isFunction":230}],260:[function(_dereq_,module,exports){
var baseFlatten = _dereq_('./_baseFlatten'),
    baseOrderBy = _dereq_('./_baseOrderBy'),
    baseRest = _dereq_('./_baseRest'),
    isIterateeCall = _dereq_('./_isIterateeCall');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, function(o) { return o.user; });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 *
 * _.sortBy(users, 'user', function(o) {
 *   return Math.floor(o.age / 10);
 * });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

module.exports = sortBy;

},{"./_baseFlatten":43,"./_baseOrderBy":71,"./_baseRest":77,"./_isIterateeCall":148}],261:[function(_dereq_,module,exports){
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

module.exports = stubArray;

},{}],262:[function(_dereq_,module,exports){
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

module.exports = stubFalse;

},{}],263:[function(_dereq_,module,exports){
var debounce = _dereq_('./debounce'),
    isObject = _dereq_('./isObject');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;

},{"./debounce":201,"./isObject":234}],264:[function(_dereq_,module,exports){
var toNumber = _dereq_('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

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

module.exports = toFinite;

},{"./toNumber":266}],265:[function(_dereq_,module,exports){
var toFinite = _dereq_('./toFinite');

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

module.exports = toInteger;

},{"./toFinite":264}],266:[function(_dereq_,module,exports){
var isFunction = _dereq_('./isFunction'),
    isObject = _dereq_('./isObject'),
    isSymbol = _dereq_('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

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
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
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

module.exports = toNumber;

},{"./isFunction":230,"./isObject":234,"./isSymbol":239}],267:[function(_dereq_,module,exports){
var copyObject = _dereq_('./_copyObject'),
    keysIn = _dereq_('./keysIn');

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

module.exports = toPlainObject;

},{"./_copyObject":101,"./keysIn":243}],268:[function(_dereq_,module,exports){
var baseToString = _dereq_('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
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

module.exports = toString;

},{"./_baseToString":82}],269:[function(_dereq_,module,exports){
var toString = _dereq_('./toString');

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;

},{"./toString":268}],270:[function(_dereq_,module,exports){
var baseValues = _dereq_('./_baseValues'),
    keys = _dereq_('./keys');

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

module.exports = values;

},{"./_baseValues":84,"./keys":242}],271:[function(_dereq_,module,exports){
var LazyWrapper = _dereq_('./_LazyWrapper'),
    LodashWrapper = _dereq_('./_LodashWrapper'),
    baseLodash = _dereq_('./_baseLodash'),
    isArray = _dereq_('./isArray'),
    isObjectLike = _dereq_('./isObjectLike'),
    wrapperClone = _dereq_('./_wrapperClone');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

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
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

module.exports = lodash;

},{"./_LazyWrapper":7,"./_LodashWrapper":9,"./_baseLodash":65,"./_wrapperClone":193,"./isArray":224,"./isObjectLike":235}],272:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout.js');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var entityLifecycle = _dereq_('../entities/entity-lifecycle');

// Override the original applyBindings method to assess history API state and provide viewModel/dataModel/router life-cycle
var originalApplyBindings = fw.applyBindings;
var callRequire = 'require';
fw.applyBindings = function(viewModelOrBindingContext, rootNode) {
  if (_.isFunction(window.require)) {
    // must initialize default require context (https://github.com/jrburke/requirejs/issues/1305#issuecomment-87924865)
    window.require([]);
  }

  originalApplyBindings(viewModelOrBindingContext, rootNode);
  entityLifecycle(viewModelOrBindingContext, rootNode);
};

},{"../../bower_components/knockoutjs/dist/knockout.js":2,"../entities/entity-lifecycle":293,"../misc/lodash":311}],273:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout.js');

// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  targetElement = targetElement || window.document.body;
  fw.applyBindings({}, targetElement);
};

},{"../../bower_components/knockoutjs/dist/knockout.js":2}],274:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../bower_components/knockoutjs/dist/knockout.js');
/* istanbul ignore next */
var postal = _dereq_('../bower_components/postal.js/lib/postal.js');
/* istanbul ignore next */
var _ = _dereq_('./misc/lodash.js');

var util = _dereq_('./misc/util.js');
var isNamespace = _dereq_('./namespace/namespace').isNamespace;

fw.isBroadcastable = function(thing) {
  return _.isObject(thing) && !!thing.__isBroadcastable;
};

fw.isReceivable = function(thing) {
  return _.isObject(thing) && !!thing.__isReceivable;
};

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcastAs = function(varName, option) {
  var broadcastable = this;
  var namespace;
  var subscriptions = [];
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;

  if (_.isObject(varName)) {
    option = varName;
  } else {
    if (_.isBoolean(option)) {
      option = {
        name: varName,
        writable: option
      };
    } else if (_.isObject(option)) {
      option = _.extend({
        name: varName
      }, option);
    } else if (_.isString(option)) {
      option = _.extend({
        name: varName,
        namespace: option
      }, option);
    } else {
      option = {
        name: varName
      };
    }
  }

  namespace = option.namespace || fw.utils.currentNamespace();
  if (_.isString(namespace)) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if (!isNamespace(namespace)) {
    throw new Error('Invalid namespace provided for broadcastAs() observable.');
  }

  if ( option.writable ) {
    namespaceSubscriptions.push(namespace.subscribe('__change.' + option.name, function(newValue) {
      broadcastable(newValue);
    }));
  }

  broadcastable.broadcast = function() {
    namespace.publish(option.name, broadcastable());
    return this;
  };

  namespaceSubscriptions.push(namespace.subscribe('__refresh.' + option.name, function() {
    namespace.publish(option.name, broadcastable());
  }));
  subscriptions.push(broadcastable.subscribe(function(newValue) {
    namespace.publish(option.name, newValue);
  }));

  broadcastable.dispose = function() {
    _.invokeMap(namespaceSubscriptions, 'unsubscribe');
    _.invokeMap(subscriptions, 'dispose');
    if (isLocalNamespace) {
      namespace.dispose();
    }
  };

  broadcastable.__isBroadcastable = true;
  return broadcastable.broadcast();
};

// factory method which turns an observable into a receivable
fw.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var receivable = this;
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;
  var when = util.alwaysPassPredicate;

  if (_.isString(namespace)) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if (!isNamespace(namespace)) {
    throw new Error('Invalid namespace provided for receiveFrom() observable.');
  }

  receivable = fw.computed({
    read: target,
    write: function(value) {
      namespace.publish('__change.' + variable, value);
    }
  });

  receivable.refresh = function() {
    namespace.publish('__refresh.' + variable);
    return this;
  };

  namespaceSubscriptions.push(namespace.subscribe( variable, function(newValue) {
    if (when(newValue)) {
      target(newValue);
    } else {
      target(undefined);
    }
  }));

  var observableDispose = receivable.dispose;
  receivable.dispose = function() {
    _.invokeMap(namespaceSubscriptions, 'unsubscribe');
    if (isLocalNamespace) {
      namespace.dispose();
    }
    observableDispose.call(receivable);
  };

  receivable.when = function(predicate) {
    if (_.isFunction(predicate)) {
      when = predicate;
    } else {
      when = function(updatedValue) {
        return _.isEqual(updatedValue, predicate);
      };
    }
    return this;
  };

  receivable.__isReceivable = true;
  return receivable.refresh();
};

module.exports = fw;

},{"../bower_components/knockoutjs/dist/knockout.js":2,"../bower_components/postal.js/lib/postal.js":3,"./misc/lodash.js":311,"./misc/util.js":313,"./namespace/namespace":316}],275:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var objectTools = _dereq_('./object-tools');
var regExpIsEqual = objectTools.regExpIsEqual;
var commonKeysEqual = objectTools.commonKeysEqual;
var sortOfEqual = objectTools.sortOfEqual;

var entityTools = _dereq_('../entities/entity-tools');
var isDataModelCtor = entityTools.isDataModelCtor;
var isDataModel = entityTools.isDataModel;

var makeOrGetRequest = _dereq_('../misc/ajax').makeOrGetRequest;

function sync() {
  return fw.sync.apply(this, arguments);
}

function get(id) {
  var collection = this;
  return _.find(collection(), function findModelWithId(model) {
    return _.result(model, collection.__private('getIdAttribute')()) === id || _.result(model, '$id') === id || _.result(model, '$cid') === id;
  });
}

function getData() {
  var collection = this;
  var castAsModelData = collection.__private('castAs').modelData;
  return _.reduce(collection(), function(models, model) {
    models.push(castAsModelData(model));
    return models;
  }, []);
}

function toJSON() {
  return JSON.stringify(this.getData());
}

function pluck(attribute) {
  var collection = this;
  var castAsModelData = collection.__private('castAs').modelData;
  return _.reduce(collection(), function(pluckedValues, model) {
    pluckedValues.push(castAsModelData(model, attribute));
    return pluckedValues;
  }, []);
}

function set(newCollection, options) {
  if (!_.isArray(newCollection)) {
    throw new Error('collection.set() must be passed an array of data/dataModels');
  }

  var collection = this;
  var collectionStore = collection();
  var castAsDataModel = collection.__private('castAs').dataModel;
  var castAsModelData = collection.__private('castAs').modelData;
  var idAttribute = collection.__private('getIdAttribute')();
  var affectedModels = [];
  var absentModels = [];
  var addedModels = [];
  options = options || {};

  _.each(newCollection, function checkModelPresence(modelData) {
    var modelPresent = false;
    modelData = castAsModelData(modelData);

    if (!_.isUndefined(modelData)) {
      _.each(collectionStore, function lookForModel(model, indexOfModel) {
        var collectionModelData = castAsModelData(model);

        if (!_.isUndefined(modelData[idAttribute]) && !_.isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
          modelPresent = true;
          if (options.merge !== false && !sortOfEqual(collectionModelData, modelData)) {
            // found model, but needs an update
            if (_.isFunction(model.set)) {
              model.set.call(model, modelData);
            } else {
              collectionStore[indexOfModel] = modelData;
            }
            collection.$namespace.publish('_.change', model);
            affectedModels.push(model);
          }
        }
      });

      if (!modelPresent && options.add !== false) {
        // not found in collection, we have to add this model
        var newModel = castAsDataModel(modelData);
        collectionStore.push(newModel);
        affectedModels.push(newModel);
        addedModels.push(newModel);
        collection.$namespace.publish('_.add', newModel);
      }
    }
  });

  if (options.remove !== false) {
    _.each(collectionStore, function checkForRemovals(model, indexOfModel) {
      var collectionModelData = castAsModelData(model);
      var modelPresent = false;

      if (collectionModelData) {
        modelPresent = _.reduce(newCollection, function(isPresent, modelData) {
          return isPresent || _.result(modelData, idAttribute) === collectionModelData[idAttribute];
        }, false);
      }

      if (!modelPresent) {
        // model currently in collection not found in the supplied newCollection so we need to mark it for removal
        absentModels.push(model);
        affectedModels.push(model);
      }
    });

    if (absentModels.length) {
      _.each(absentModels, function(modelToRemove) {
        var indexOfModelToRemove = collectionStore.indexOf(modelToRemove);
        if (indexOfModelToRemove > -1) {
          collectionStore.splice(indexOfModelToRemove, 1);
        }
      });
      collection.$namespace.publish('_.remove', absentModels);
    }
  }

  // re-sort based on the newCollection
  var reSorted = [];
  var wasResorted = false;
  _.each(newCollection, function(newModelData, modelIndex) {
    newModelData = castAsModelData(newModelData);
    var foundAtIndex = null;
    var currentModel = _.find(collectionStore, function(model, theIndex) {
      if (sortOfEqual(castAsModelData(model), newModelData)) {
        foundAtIndex = theIndex;
        return true;
      }
    });
    reSorted.push(currentModel);
    wasResorted = wasResorted || foundAtIndex !== modelIndex;
  });

  wasResorted = (wasResorted && reSorted.length && _.every(reSorted));

  if (wasResorted) {
    Array.prototype.splice.apply(collectionStore, [0, reSorted.length].concat(reSorted));
  }

  if (wasResorted || addedModels.length || absentModels.length || affectedModels.length) {
    collection.notifySubscribers();
  }

  return affectedModels;
}

function reset(newCollection) {
  var collection = this;
  var oldModels = collection.removeAll();
  var castAsDataModel = collection.__private('castAs').dataModel;

  collection(_.reduce(newCollection, function(newModels, modelData) {
    newModels.push(castAsDataModel(modelData));
    return newModels;
  }, []));

  collection.$namespace.publish('_.reset', { newModels: collection(), oldModels: oldModels });

  return collection();
}

function fetch(options) {
  var ajax = _dereq_('../misc/ajax');
  var collection = this;
  var configParams = collection.__private('configParams');
  options = options ? _.clone(options) : {};

  var requestInfo = {
    requestRunning: collection.isFetching,
    requestLull: configParams.requestLull,
    entity: collection,
    createRequest: function() {
      if (_.isUndefined(options.parse)) {
        options.parse = true;
      }

      var xhr = collection.sync('read', collection, options);

      ajax.handleJsonResponse(xhr)
        .then(function handleResponseData(data) {
          var method = options.reset ? 'reset' : 'set';
          data = configParams.parse(data);
          var touchedModels = collection[method](data, options);

          collection.$namespace.publish('_.change', {
            touched: touchedModels,
            serverResponse: data,
            options: options
          });
        });

      return xhr;
    }
  };

  return makeOrGetRequest('fetch', requestInfo);
}

function where(modelData, options) {
  var collection = this;
  var castAsModelData = collection.__private('castAs').modelData;
  options = options || {};
  modelData = castAsModelData(modelData);

  return _.reduce(collection(), function findModel(foundModels, model) {
    var thisModelData = castAsModelData(model);
    if (regExpIsEqual(modelData, thisModelData, options.isEqual)) {
      foundModels.push(options.getData ? thisModelData : model);
    }
    return foundModels;
  }, []);
}

function findWhere(modelData, options) {
  var collection = this;
  var castAsModelData = collection.__private('castAs').modelData;
  options = options || {};
  modelData = castAsModelData(modelData);

  return _.reduce(collection(), function findModel(foundModel, model) {
    var thisModelData = castAsModelData(model);
    if (_.isNull(foundModel) && regExpIsEqual(modelData, thisModelData, options.isEqual)) {
      return options.getData ? thisModelData : model;
    }
    return foundModel;
  }, null);
}

function addModel(models, options) {
  var collection = this;
  var affectedModels = [];
  options = options || {};

  if (_.isObject(models)) {
    models = [models];
  }
  if (!_.isArray(models)) {
    models = !_.isUndefined(models) && !_.isNull(models) ? [models] : [];
  }

  if (models.length) {
    var collectionData = collection();
    var castAsDataModel = collection.__private('castAs').dataModel;
    var castAsModelData = collection.__private('castAs').modelData;
    var idAttribute = collection.__private('getIdAttribute')();

    if (_.isNumber(options.at)) {
      var newModels = _.map(models, castAsDataModel);

      collectionData.splice.apply(collectionData, [options.at, 0].concat(newModels));
      affectedModels.concat(newModels);
      collection.$namespace.publish('_.add', newModels);

      collection.valueHasMutated();
    } else {
      _.each(models, function checkModelPresence(modelData) {
        var modelPresent = false;
        var theModelData = castAsModelData(modelData);

        _.each(collectionData, function lookForModel(model) {
          var collectionModelData = castAsModelData(model);

          if (!_.isUndefined(theModelData[idAttribute]) && !_.isNull(theModelData[idAttribute]) && theModelData[idAttribute] === collectionModelData[idAttribute]) {
            modelPresent = true;
            if (options.merge && !sortOfEqual(theModelData, collectionModelData)) {
              // found model, but needs an update
              (model.set || noop).call(model, theModelData);
              collection.$namespace.publish('_.change', model);
              affectedModels.push(model);
            }
          }
        });

        if (!modelPresent) {
          // not found in collection, we have to add this model
          var newModel = castAsDataModel(modelData);
          collection.push(newModel);
          affectedModels.push(newModel);
        }
      });
    }
  }

  return affectedModels;
}

function create(model, options) {
  var ajax = _dereq_('../misc/ajax');
  var collection = this;
  var castAsDataModel = collection.__private('castAs').dataModel;
  var configParams = collection.__private('configParams');
  options = options ? _.clone(options) : {};

  var requestInfo = {
    requestRunning: collection.isCreating,
    requestLull: configParams.requestLull,
    entity: collection,
    allowConcurrent: true,
    createRequest: function() {
      var newModel = castAsDataModel(model);
      var xhr;

      if (isDataModel(newModel)) {
        xhr = newModel.save();

        if (options.wait) {
          ajax.handleJsonResponse(xhr)
            .then(function(responseData) {
              responseData && collection.addModel(newModel);
            });
        } else {
          collection.addModel(newModel)
        }
      } else {
        return newModel;
      }

      return xhr;
    }
  };

  if (!isDataModelCtor(configParams.dataModel)) {
    throw new Error('No dataModel specified, cannot create() a new collection item');
  }

  return makeOrGetRequest('create', requestInfo);
}

function removeModel(models) {
  var collection = this;
  var affectedModels = [];

  if (_.isObject(models)) {
    models = [models];
  }
  if (!_.isArray(models)) {
    models = !_.isUndefined(models) && !_.isNull(models) ? [models] : [];
  }

  return _.reduce(models, function(removedModels, model) {
    var removed = null;
    if (isDataModel(model)) {
      removed = collection.remove(model);
    } else {
      var modelsToRemove = collection.where(model);
      if (!_.isNull(modelsToRemove)) {
        removed = collection.removeAll(modelsToRemove);
      }
    }

    if (!_.isNull(removed)) {
      return removedModels.concat(removed);
    }
    return removedModels;
  }, []);
}

module.exports = {
  sync: sync,
  get: get,
  getData: getData,
  toJSON: toJSON,
  pluck: pluck,
  set: set,
  reset: reset,
  fetch: fetch,
  where: where,
  findWhere: findWhere,
  addModel: addModel,
  create: create,
  removeModel: removeModel
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../entities/entity-tools":295,"../misc/ajax":307,"../misc/lodash":311,"./object-tools":278}],276:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

function isCollection(thing) {
  return _.isObject(thing) && !!thing.__isCollection;
}

module.exports = {
  isCollection: isCollection
};

},{"../misc/lodash":311}],277:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var privateData = _dereq_('../misc/privateData');
var collectionMethods = _dereq_('./collection-methods');

var entityTools = _dereq_('../entities/entity-tools');
var isDataModel = entityTools.isDataModel;
var isDataModelCtor = entityTools.isDataModelCtor;

var defaultCollectionConfig = {
  namespace: null,
  url: null,
  dataModel: null,
  idAttribute: null,
  disposeOnRemove: true,
  parse: _.identity,
  ajaxOptions: {}
};

function removeDisposeAndNotify(originalFunction) {
  var removedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  this.__private('configParams').disposeOnRemove && _.invokeMap(removedItems, 'dispose');
  this.$namespace.publish('_.remove', removedItems);
  return removedItems;
}

function addAndNotify(originalFunction) {
  var addItems = _.map(Array.prototype.slice.call(arguments).splice(1), this.__private('castAs').dataModel);
  var originalResult = originalFunction.apply(this, addItems);
  this.$namespace.publish('_.add', addItems);
  return originalResult;
}

var PlainCollectionConstructor;

fw.collection = _.extend(function(collectionData) {
  collectionData = collectionData || [];

  if (_.isUndefined(PlainCollectionConstructor)) {
    PlainCollectionConstructor = fw.collection.create();
  }
  return PlainCollectionConstructor(collectionData);
}, collectionMethods);

fw.collection.create = function(configParams) {
  configParams = configParams || {};

  return function CollectionConstructor(collectionData) {
    configParams = _.extend({}, defaultCollectionConfig, configParams);
    var DataModelCtor = configParams.dataModel;
    var collection = fw.observableArray();
    var privateStuff = {
      castAs: {
        modelData: function(modelData, attribute) {
          if (isDataModel(modelData)) {
            return modelData.getData(attribute);
          }
          if (_.isUndefined(attribute)) {
            return modelData;
          }
          return _.result(modelData, attribute);
        },
        dataModel: function(modelData) {
          return isDataModelCtor(DataModelCtor) && !isDataModel(modelData) ? (new DataModelCtor(modelData)) : modelData;
        }
      },
      getIdAttribute: function(options) {
        var idAttribute = configParams.idAttribute || (options || {}).idAttribute;
        if (_.isUndefined(idAttribute) || _.isNull(idAttribute)) {
          if (isDataModelCtor(DataModelCtor)) {
            return DataModelCtor.__private('configParams').idAttribute;
          }
        }
        return idAttribute || 'id';
      }
    };

    _.extend(collection, collectionMethods, {
      $namespace: fw.namespace(configParams.namespace || _.uniqueId('collection')),
      __originalData: collectionData,
      __isCollection: true,
      __private: privateData.bind(this, privateStuff, configParams),
      remove: removeDisposeAndNotify.bind(collection, collection.remove),
      pop: removeDisposeAndNotify.bind(collection, collection.pop),
      shift: removeDisposeAndNotify.bind(collection, collection.shift),
      splice: removeDisposeAndNotify.bind(collection, collection.splice),
      push: addAndNotify.bind(collection, collection.push),
      unshift: addAndNotify.bind(collection, collection.unshift),
      isFetching: fw.observable(false),
      isCreating: fw.observable(false),
      dispose: function() {
        if (!collection.isDisposed) {
          collection.isDisposed = true;
          collection.$namespace.dispose();
          _.invokeMap(collection(), 'dispose');
        }
      }
    });

    collection.requestInProgress = fw.pureComputed(function() {
      return this.isFetching() || this.isCreating();
    }, collection);

    if (collectionData) {
      collection.set(collectionData);
    }

    return collection;
  };
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../entities/entity-tools":295,"../misc/lodash":311,"../misc/privateData":312,"./collection-methods":275}],278:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * Note: object 'a' can provide a regex value for a property and have it searched matching on the regex value
 * @param  {object} a Object to compare (which can contain regex values for properties)
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function regExpIsEqual(a, b, isEq) {
  isEq = isEq || regExpIsEqual;

  if (_.isObject(a) && _.isObject(b)) {
    return _.every(_.reduce(a, function(comparison, paramValue, paramName) {
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

/**
 * Performs an equality comparison between two objects ensuring only the common key values match (and that there is a non-0 number of them)
 * @param  {object} a Object to compare
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function commonKeysEqual(a, b, isEq) {
  isEq = isEq || _.isEqual;

  if (_.isObject(a) && _.isObject(b)) {
    var commonKeys = _.intersection(_.keys(a), _.keys(b));
    return commonKeys.length > 0 && isEq(_.pick(a, commonKeys), _.pick(b, commonKeys));
  } else {
    return a === b;
  }
}

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * In other words: A == B, but B does not necessarily == A
 * @param  {object} a Object to compare
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function sortOfEqual(a, b, isEq) {
  isEq = isEq || _.isEqual;

  if (_.isObject(a) && _.isObject(b)) {
    var AKeys = _.keys(a);
    var BKeys = _.keys(b);
    var commonKeys = _.intersection(AKeys, BKeys);
    var hasAllAKeys = _.every(AKeys, function(Akey) {
      return BKeys.indexOf(Akey) !== -1;
    })
    return commonKeys.length > 0 && hasAllAKeys && isEq(_.pick(a, commonKeys), _.pick(b, commonKeys));
  } else {
    return a === b;
  }
}

module.exports = {
  regExpIsEqual: regExpIsEqual,
  commonKeysEqual: commonKeysEqual,
  sortOfEqual: sortOfEqual
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../misc/lodash":311}],279:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');

_dereq_('./sequencing');
_dereq_('./lifecycle-loader');
_dereq_('./lifecycle-binding');
_dereq_('./resource-loader');

var entityDescriptors = _dereq_('../entities/entity-descriptors');

fw.components.getComponentNameForNode = function(node) {
  var tagName = _.isString(node.tagName) && node.tagName.toLowerCase();

  if(fw.components.isRegistered(tagName)
     || fw.components.locationIsRegistered(tagName)
     || entityDescriptors.tagNameIsPresent(tagName)) {
    return tagName;
  }

  return null;
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../entities/entity-descriptors":292,"../misc/lodash":311,"./lifecycle-binding":281,"./lifecycle-loader":282,"./resource-loader":283,"./sequencing":284}],280:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

module.exports = _.extend([
  /* filled in by various modules */
], {
  isInternalComponent: function (componentName) {
    return _.indexOf(this, componentName) !== -1;
  }
});

},{"../misc/lodash":311}],281:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var sequencing = _dereq_('./sequencing');
var addToAndFetchQueue = sequencing.addToAndFetchQueue;
var runAnimationClassSequenceQueue = sequencing.runAnimationClassSequenceQueue;

var entityTools = _dereq_('../entities/entity-tools');
var nearestEntity = entityTools.nearestEntity;
var isEntity = entityTools.isEntity;

var routerDefaults = _dereq_('../entities/router/router-defaults');
var outletLoadedDisplay = routerDefaults.outletLoadedDisplay;
var outletLoadingDisplay = routerDefaults.outletLoadingDisplay;
var isOutletViewModel = _dereq_('../entities/router/router-tools').isOutletViewModel;

var addClass = _dereq_('../misc/util').addClass;
var entityClass = _dereq_('../misc/config').entityClass;

function componentTriggerAfterRender(element, viewModel, $context) {
  if (isEntity(viewModel) && !viewModel.__private('afterRenderWasTriggered')) {
    viewModel.__private('afterRenderWasTriggered', true);

    function addAnimationClass() {
      var classList = element.className.split(" ");
      if (!_.includes(classList, outletLoadingDisplay) && !_.includes(classList, outletLoadedDisplay)) {
        var queue = addToAndFetchQueue(element, viewModel);
        var nearestOutlet = nearestEntity($context, isOutletViewModel);

        if (nearestOutlet) {
          // the parent outlet will run the callback that initiates the animation
          // sequence (once the rest of its dependencies finish loading as well)
          nearestOutlet.addResolvedCallbackOrExecute(function() {
            runAnimationClassSequenceQueue(queue);
          });
        } else {
          // no parent outlet found, lets go ahead and run the queue
          runAnimationClassSequenceQueue(queue);
        }
      }
    }

    // trigger the user-specified afterRender callback
    viewModel.__private('configParams').afterRender.call(viewModel, element);

    // resolve the flight tracker and trigger the addAnimationClass callback when appropriate
    (viewModel.__private('resolveFlightTracker') || _.noop)(addAnimationClass);
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    var classList = element.className.split(" ");
    if (!_.includes(classList, outletLoadingDisplay) && !_.includes(classList, outletLoadedDisplay)) {
      // the outlet viewModel and template binding handles its animation state
      addClass(element, entityClass);
    }

    if (isEntity(viewModel) && !viewModel.__private('element')) {
      viewModel.__private('element', element);
    }

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if (isEntity(viewModel)) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    // if this element is not the 'loading' component of an outlet, then we need to
    // trigger the onComplete callback
    var $parent = bindingContext.$parent;
    if (_.isObject($parent) && fw.isObservable($parent.route) && $parent.__isOutlet) {
      var parentRoute = $parent.route.peek();
      var classList = element.className.split(" ");
      if (!_.includes(classList, outletLoadingDisplay) && _.isFunction(parentRoute.getOnCompleteCallback)) {
        parentRoute.getOnCompleteCallback(element)();
      }
    }

    componentTriggerAfterRender(element, bindingContext.$data, bindingContext);
  }
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../entities/entity-tools":295,"../entities/router/router-defaults":302,"../entities/router/router-tools":303,"../misc/config":308,"../misc/lodash":311,"../misc/util":313,"./sequencing":284}],282:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var internalComponents = _dereq_('./internal-components');

var util = _dereq_('../misc/util');
var isDocumentFragment = util.isDocumentFragment;
var isDomElement = util.isDomElement;

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift(fw.components.lifecycleLoader = {
  loadTemplate: function(componentName, templateConfig, callback) {
    if (!internalComponents.isInternalComponent(componentName)) {
      if (typeof templateConfig === 'string') {
        // Markup - parse it
        callback(wrapWithLifeCycle(templateConfig));
      } else if (templateConfig instanceof Array) {
        // Assume already an array of DOM nodes
        callback(wrapWithLifeCycle(templateConfig));
      } else if (isDocumentFragment(templateConfig)) {
        // Document fragment - use its child nodes
        callback(wrapWithLifeCycle(fw.utils.makeArray(templateConfig.childNodes)));
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
        throw new Error('Unhandled config type: ' + typeof templateConfig + '.');
      }
    } else {
      callback(null);
    }
  }
});

function cloneNodesFromTemplateSourceElement(elemInstance) {
  switch (fw.utils.tagNameLower(elemInstance)) {
    case 'script':
      return fw.utils.parseHtmlFragment(elemInstance.text);
    case 'textarea':
      return fw.utils.parseHtmlFragment(elemInstance.value);
    case 'template':
      // For browsers with proper <template> element support (i.e., where the .content property
      // gives a document fragment), use that document fragment.
      if (isDocumentFragment(elemInstance.content)) {
        return fw.utils.cloneNodes(elemInstance.content.childNodes);
      }
  }

  // Regular elements such as <div>, and <template> elements on old browsers that don't really
  // understand <template> and just treat it as a regular container
  return fw.utils.cloneNodes(elemInstance.childNodes);
}

function wrapWithLifeCycle(template) {
  var templateString = _.isString(template) ? template : '';
  var wrapper = fw.utils.parseHtmlFragment('<!-- ko $life -->' + templateString + '<!-- /ko -->');

  if (templateString.length) {
    return wrapper;
  }

  return [].concat(wrapper[0], template, wrapper[1]);
}

},{"../../bower_components/knockoutjs/dist/knockout":2,"../misc/lodash":311,"../misc/util":313,"./internal-components":280}],283:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var Conduit = _dereq_('../../bower_components/conduitjs/lib/conduit');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var util = _dereq_('../misc/util');
var isPath = util.isPath;
var getFilenameExtension = util.getFilenameExtension;
var isDocumentFragment = util.isDocumentFragment;
var isDomElement = util.isDomElement;

var entityTools = _dereq_('../entities/entity-tools');
var nearestEntity = entityTools.nearestEntity;
var isEntity = entityTools.isEntity;

var getComponentExtension = _dereq_('../resource/component-resource').getComponentExtension;
var isOutletViewModel = _dereq_('../entities/router/router-tools').isOutletViewModel;
var activeOutlets = _dereq_('../entities/router/router-defaults').activeOutlets;

fw.components.loaders.push(fw.components.requireLoader = {
  getConfig: function(componentName, callback) {
    var combinedFile = fw.components.getFileName(componentName, 'combined');
    var viewModelFile = fw.components.getFileName(componentName, 'viewModel');
    var templateFile = fw.components.getFileName(componentName, 'template');
    var componentLocation = fw.components.getLocation(componentName);
    var folderOffset = componentLocation.folderOffset || '';
    var configOptions = null;
    var viewModelPath;
    var templatePath;
    var combinedPath;
    var viewModelConfig;

    if (folderOffset !== '') {
      folderOffset = componentName + '/';
    }

    if (_.isFunction(window.require)) {
      // load component using knockouts native support for requirejs
      if (window.require.specified(componentName)) {
        // component already cached, lets use it
        configOptions = {
          require: componentName
        };
      } else if (_.isString(componentLocation.combined)) {
        combinedPath = componentLocation.combined;

        if (isPath(combinedPath)) {
          combinedPath = combinedPath + folderOffset + combinedFile;
        }

        configOptions = {
          require: window.require.toUrl(combinedPath)
        };
      } else {
        // check to see if the requested component is template only and should not request a viewModel (we supply a dummy object in its place)
        if (!_.isString(componentLocation.viewModel)) {
          // template-only component, substitute with 'blank' viewModel
          viewModelConfig = _dereq_('../misc/config').DefaultViewModel;
        } else {
          viewModelPath = componentLocation.viewModel;

          if (isPath(viewModelPath)) {
            viewModelPath = viewModelPath + folderOffset + viewModelFile;
          }

          if (getFilenameExtension(viewModelPath) !== getComponentExtension(componentName, 'viewModel')) {
            viewModelPath += '.' + getComponentExtension(componentName, 'viewModel');
          }

          viewModelConfig = { require: window.require.toUrl(viewModelPath) };
        }

        templatePath = componentLocation.template;
        if (isPath(templatePath)) {
          templatePath = templatePath + folderOffset + templateFile;
        }

        if (getFilenameExtension(templatePath) !== getComponentExtension(componentName, 'template')) {
          templatePath += '.' + getComponentExtension(componentName, 'template');
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

fw.components.loaders.unshift(fw.components.requireResolver = {
  loadComponent: function(componentName, config, callback) {
    possiblyGetConfigFromAmd(config, function(loadedConfig) {
      // TODO: Provide upstream patch which clears out loadingSubscribablesCache when load fails so that
      // subsequent requests will re-run require

      var origCallback = callback;
      callback = new Conduit.Sync({ target: callback });
      callback.before(function(config) {
        config.createViewModel = new Conduit.Sync({ target: config.createViewModel });
        config.createViewModel.after(function(viewModel, params, componentInfo) {
          var $flightTracker = componentInfo.element.$flightTracker;
          var $context = fw.contextFor(componentInfo.element);
          var $nearestOutlet = nearestEntity($context, isOutletViewModel);
          var $nearestEntity = nearestEntity($context);
          var $parentsInFlightChildren;
          var $outletsInFlightChildren;

          if ($nearestEntity) {
            $parentsInFlightChildren = $nearestEntity.__private('inFlightChildren');
          }
          if ($nearestOutlet) {
            $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
          }

          if (isEntity(viewModel)) {
            var resolveFlightTracker =  _.noop;

            if ($flightTracker) {
              resolveFlightTracker = function(addAnimationClass) {
                var wasResolved = false;
                function resolveThisEntityNow(isResolved) {
                  function finishResolution() {
                    addAnimationClass();
                    if (fw.isObservable($parentsInFlightChildren) && _.isFunction($parentsInFlightChildren.remove)) {
                      $parentsInFlightChildren.remove($flightTracker);
                    }
                    if (fw.isObservable($outletsInFlightChildren) && _.isFunction($outletsInFlightChildren.remove)) {
                      $outletsInFlightChildren.remove($flightTracker);
                    }
                  }

                  if (!wasResolved) {
                    wasResolved = true;
                    if (isResolved === true) {
                      finishResolution();
                    } else if (isPromise(isResolved) || (_.isArray(isResolved) && _.every(isResolved, isPromise))) {
                      var promises = [].concat(isResolved);
                      var checkPromise = function(promise) {
                        (promise.done || promise.then).call(promise, function() {
                          if (_.every(promises, promiseIsFulfilled)) {
                            finishResolution();
                          }
                        });
                      };

                      _.each(promises, checkPromise);
                    }
                  }
                }

                function maybeResolve() {
                  viewModel.__private('configParams').afterResolving.call(viewModel, resolveThisEntityNow);
                }

                var $inFlightChildren = viewModel.__private('inFlightChildren');
                // if no children then resolve now, otherwise subscribe and wait till its 0
                if ($inFlightChildren().length === 0) {
                  maybeResolve();
                } else {
                  viewModel.disposeWithInstance($inFlightChildren.subscribe(function(inFlightChildren) {
                    inFlightChildren.length === 0 && maybeResolve();
                  }));
                }
              };
            }

            viewModel.__private('resolveFlightTracker', resolveFlightTracker);
          }
        });
      });

      resolveConfig(componentName, loadedConfig, callback);
    });
  }
});

function possiblyGetConfigFromAmd(config, callback) {
  if (_.isString(config['require'])) {
    if (_.isFunction(window.require)) {
      window.require([config['require']], callback, function() {
        _.each(activeOutlets(), function(outlet) {
          (outlet().onFailure || noop)();
        });
      });
    } else {
      throw new Error('Uses require, but no AMD loader is present');
    }
  } else {
    callback(config);
  }
}

function resolveConfig(componentName, config, callback) {
  var result = {};
  var makeCallBackWhenZero = 2;
  var tryIssueCallback = function() {
    if (--makeCallBackWhenZero === 0) {
      callback(result);
    }
  };
  var templateConfig = config['template'];
  var viewModelConfig = config['viewModel'];

  if (templateConfig) {
    possiblyGetConfigFromAmd(templateConfig, function(loadedConfig) {
      getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
        result['template'] = resolvedTemplate;
        tryIssueCallback();
      });
    });
  } else {
    tryIssueCallback();
  }

  if (viewModelConfig) {
    possiblyGetConfigFromAmd(viewModelConfig, function(loadedConfig) {
      getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
        result['createViewModel'] = resolvedViewModel;
        tryIssueCallback();
      });
    });
  } else {
    tryIssueCallback();
  }
}

function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
  // On the first call in the stack, start with the full set of loaders
  if (!candidateLoaders) {
    candidateLoaders = fw.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
  }

  // Try the next candidate
  var currentCandidateLoader = candidateLoaders.shift();
  if (currentCandidateLoader) {
    var methodInstance = currentCandidateLoader[methodName];
    if (methodInstance) {
      var wasAborted = false;
      var synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
        if (wasAborted) {
          callback(null);
        } else if (result !== null) {
          // This candidate returned a value. Use it.
          callback(result);
        } else {
          // Try the next candidate
          getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
        }
      }));

      // Currently, loaders may not return anything synchronously. This leaves open the possibility
      // that we'll extend the API to support synchronous return values in the future. It won't be
      // a breaking change, because currently no loader is allowed to return anything except undefined.
      if (synchronousReturnValue !== undefined) {
        wasAborted = true;

        // Method to suppress exceptions will remain undocumented. This is only to keep
        // KO's specs running tidily, since we can observe the loading got aborted without
        // having exceptions cluttering up the console too.
        if (!currentCandidateLoader['suppressLoaderExceptions']) {
          throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
        }
      }
    } else {
      // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
      getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
    }
  } else {
    // No candidates returned a value
    callback(null);
  }
}

function resolveTemplate(templateConfig, callback) {
  if (typeof templateConfig === 'string') {
    // Markup - parse it
    callback(fw.utils.parseHtmlFragment(templateConfig));
  } else if (templateConfig instanceof Array) {
    // Assume already an array of DOM nodes - pass through unchanged
    callback(templateConfig);
  } else if (isDocumentFragment(templateConfig)) {
    // Document fragment - use its child nodes
    callback(fw.utils.makeArray(templateConfig.childNodes));
  } else if (templateConfig['element']) {
    var element = templateConfig['element'];
    if (isDomElement(element)) {
      // Element instance - copy its child nodes
      callback(cloneNodesFromTemplateSourceElement(element));
    } else if (typeof element === 'string') {
      // Element ID - find it, then copy its child nodes
      var elemInstance = document.getElementById(element);
      if (elemInstance) {
        callback(cloneNodesFromTemplateSourceElement(elemInstance));
      } else {
        throw new Error('Cannot find element with ID ' + element);
      }
    } else {
      throw new Error('Unknown element type: ' + element);
    }
  } else {
    throw new Error('Unknown template value: ' + templateConfig);
  }
}

function cloneNodesFromTemplateSourceElement(elemInstance) {
  switch (fw.utils.tagNameLower(elemInstance)) {
    case 'script':
      return fw.utils.parseHtmlFragment(elemInstance.text);
    case 'textarea':
      return fw.utils.parseHtmlFragment(elemInstance.value);
    case 'template':
      // For browsers with proper <template> element support (i.e., where the .content property
      // gives a document fragment), use that document fragment.
      if (isDocumentFragment(elemInstance.content)) {
        return fw.utils.cloneNodes(elemInstance.content.childNodes);
      }
  }

  // Regular elements such as <div>, and <template> elements on old browsers that don't really
  // understand <template> and just treat it as a regular container
  return fw.utils.cloneNodes(elemInstance.childNodes);
}

},{"../../bower_components/conduitjs/lib/conduit":1,"../../bower_components/knockoutjs/dist/knockout":2,"../entities/entity-tools":295,"../entities/router/router-defaults":302,"../entities/router/router-tools":303,"../misc/config":308,"../misc/lodash":311,"../misc/util":313,"../resource/component-resource":317}],284:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var entityAnimateClass = _dereq_('../misc/config').entityAnimateClass;

var util = _dereq_('../misc/util');
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
  var configParams = viewModel.__private('configParams');
  var sequenceTimeout = resultBound(configParams, 'sequenceAnimations', viewModel) || 0;
  var animationSequenceQueue = sequenceQueue[configParams.namespace] = (sequenceQueue[configParams.namespace] || []);
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

},{"../../bower_components/knockoutjs/dist/knockout":2,"../misc/config":308,"../misc/lodash":311,"../misc/util":313}],285:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

var entityBinder = _dereq_('./entity-binder');
var nearestEntity = _dereq_('../entity-tools').nearestEntity;
var isOutletViewModel = _dereq_('../router/router-tools').isOutletViewModel;
var isPath = _dereq_('../../misc/util').isPath;

var entityDescriptors = _dereq_('./../entity-descriptors');

function getResourceLocation(moduleName) {
  var resource = this;
  var resourceLocation = null;

  if (resource.isRegistered(moduleName)) {
    // viewModel was manually registered, we preferentially use it
    resourceLocation = resource.getRegistered(moduleName);
  } else if (_.isFunction(window.require) && _.isFunction(window.require.specified) && window.require.specified(moduleName)) {
    // we have found a matching resource that is already cached by require, lets use it
    resourceLocation = moduleName;
  } else {
    resourceLocation = resource.getLocation(moduleName);
  }

  return resourceLocation;
}

// Monkey patch enables the entity to initialize a viewModel and bind to the html as intended (with lifecycle events)
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = fw.bindingHandlers.component.init;

function initEntityTag(tagName, element, valueAccessor, allBindings, viewModel, bindingContext) {
  var theValueAccessor = valueAccessor;
  if (tagName === '__elementBased') {
    tagName = element.tagName;
  }

  var $flightTracker = { name: tagName, type: 'component' };

  if (element.nodeType !== 8 && (!_.isString(tagName) || tagName.toLowerCase() !== 'outlet')) {
    var $nearestEntity = nearestEntity(bindingContext);
    if ($nearestEntity) {
      var $inFlightChildren = $nearestEntity.__private('inFlightChildren');
      if (fw.isObservable($inFlightChildren) && _.isFunction($inFlightChildren.push)) {
        $inFlightChildren.push($flightTracker);
      }
    }

    var $nearestOutlet = nearestEntity(bindingContext, isOutletViewModel);
    if ($nearestOutlet) {
      var $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
      if (fw.isObservable($outletsInFlightChildren) && _.isFunction($outletsInFlightChildren.push)) {
        $outletsInFlightChildren.push($flightTracker);
      }
    }
  }

  if (_.isString(tagName)) {
    tagName = tagName.toLowerCase();
    if (entityDescriptors.tagNameIsPresent(tagName)) {
      var values = valueAccessor();
      var moduleName = (!_.isUndefined(values.params) ? fw.unwrap(values.params.name) : undefined) || element.getAttribute('module') || element.getAttribute('data-module');
      var bindModel = entityBinder.bind(null, element, values.params, bindingContext);
      var resource = entityDescriptors.resourceFor(tagName);
      var getResourceLocationFor = getResourceLocation.bind(resource);

      $flightTracker.name = moduleName;
      $flightTracker.type = tagName;

      if (_.isNull(moduleName) && _.isString(values)) {
        moduleName = values;
      }

      if (!_.isUndefined(moduleName) && !_.isNull(resource)) {
        var resourceLocation = getResourceLocationFor(moduleName);

        if (_.isString(resourceLocation)) {
          if (_.isFunction(window.require)) {
            if (!window.require.specified(resourceLocation)) {
              if (isPath(resourceLocation)) {
                resourceLocation = resourceLocation + resource.getFileName(moduleName);
              }
              resourceLocation = window.require.toUrl(resourceLocation);
            }

            window.require([resourceLocation], function(resource) {
              bindModel(resource, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
            });
          } else {
            throw new Error('Uses require, but no AMD loader is present');
          }
        } else if (_.isFunction(resourceLocation)) {
          bindModel(resourceLocation, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
        } else if (_.isObject(resourceLocation)) {
          var createInstance = resourceLocation.createViewModel || resourceLocation.createDataModel;
          if (_.isObject(resourceLocation.instance)) {
            bindModel(resourceLocation.instance, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          } else if (_.isFunction(createInstance)) {
            bindModel(createInstance(values.params, { element: element }), $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          }
        }
      }

      return { 'controlsDescendantBindings': true };
    } else if (tagName === 'outlet') {
      // we patch in the 'name' of the outlet into the params valueAccessor on the component definition (if necessary and available)
      var outletName = element.getAttribute('name') || element.getAttribute('data-name');
      if (outletName) {
        theValueAccessor = function valueAccessorMask() {
          var valueAccessorResult = valueAccessor();
          if (!_.isUndefined(valueAccessorResult.params) && _.isUndefined(valueAccessorResult.params.name)) {
            valueAccessorResult.params.name = outletName;
          }
          return valueAccessorResult;
        };
      }
    }
  }

  element.$flightTracker = $flightTracker;
  return originalComponentInit(element, theValueAccessor, allBindings, viewModel, bindingContext);
};

fw.bindingHandlers.component.init = initEntityTag.bind(null, '__elementBased');

},{"../../../bower_components/knockoutjs/dist/knockout":2,"../../misc/lodash":311,"../../misc/util":313,"../entity-tools":295,"../router/router-tools":303,"./../entity-descriptors":292,"./entity-binder":286}],286:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

var util = _dereq_('../../misc/util');
var isPromise = util.isPromise;
var isPath = util.isPath;
var promiseIsFulfilled = util.promiseIsFulfilled;

var entityWrapperElement = _dereq_('../../misc/config').entityWrapperElement;
var isEntity = _dereq_('../entity-tools').isEntity;

module.exports = function entityBinder(element, params, $parentContext, Entity, $flightTracker, $parentsInFlightChildren, $outletsInFlightChildren) {
  var entityObj;
  if (_.isFunction(Entity)) {
    entityObj = new Entity(params);
  } else {
    entityObj = Entity;
  }
  entityObj.$parentContext = $parentContext;

  if (isEntity(entityObj)) {
    var resolveFlightTracker =  _.noop;

    if ($flightTracker) {
      resolveFlightTracker = function(addAnimationClass) {
        var wasResolved = false;
        function resolveThisEntityNow(isResolved) {
          function finishResolution() {
            addAnimationClass();
            if (fw.isObservable($parentsInFlightChildren) && _.isFunction($parentsInFlightChildren.remove)) {
              $parentsInFlightChildren.remove($flightTracker);
            }
            if (fw.isObservable($outletsInFlightChildren) && _.isFunction($outletsInFlightChildren.remove)) {
              $outletsInFlightChildren.remove($flightTracker);
            }
          }

          if (!wasResolved) {
            wasResolved = true;
            if (isResolved === true) {
              finishResolution();
            } else if (isPromise(isResolved) || (_.isArray(isResolved) && _.every(isResolved, isPromise))) {
              var promises = [].concat(isResolved);
              var checkPromise = function(promise) {
                (promise.done || promise.then).call(promise, function() {
                  if (_.every(promises, promiseIsFulfilled)) {
                    finishResolution();
                  }
                });
              };

              _.each(promises, checkPromise);
            }
          }
        }

        function maybeResolve() {
          entityObj.__private('configParams').afterResolving.call(entityObj, resolveThisEntityNow);
        }

        var $inFlightChildren = entityObj.__private('inFlightChildren');
        // if no children then resolve now, otherwise subscribe and wait till its 0
        if ($inFlightChildren().length === 0) {
          maybeResolve();
        } else {
          entityObj.disposeWithInstance($inFlightChildren.subscribe(function(inFlightChildren) {
            inFlightChildren.length === 0 && maybeResolve();
          }));
        }
      };
    }

    entityObj.__private('resolveFlightTracker', resolveFlightTracker);
  }

  var childrenToInsert = [];
  _.each(element.childNodes, function(child) {
    if (!_.isUndefined(child)) {
      childrenToInsert.push(child);
    }
  });

  // Have to create a wrapper element for the contents of the element. Cannot bind to
  // existing element as it has already been bound against.
  var wrapperNode = document.createElement(entityWrapperElement);
  element.insertBefore(wrapperNode, element.firstChild);

  _.each(childrenToInsert, function(child) {
    wrapperNode.appendChild(child);
  });

  fw.applyBindings(entityObj, wrapperNode);
};

},{"../../../bower_components/knockoutjs/dist/knockout":2,"../../misc/config":308,"../../misc/lodash":311,"../../misc/util":313,"../entity-tools":295}],287:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

function insertValueIntoObject(rootObject, fieldMap, fieldValue) {
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

function getNestedReference(rootObject, fieldMap) {
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

/**
 * Given the dataModel as the context, it will return whether or not it is 'new' (has been read from or saved to the server)
 *
 * @returns {boolean} true if it is new, false if not
 */
function dataModelIsNew() {
  var id = this.$id();
  return _.isUndefined(id) || _.isNull(id);
}

module.exports = {
  insertValueIntoObject: insertValueIntoObject,
  getNestedReference: getNestedReference,
  dataModelIsNew: dataModelIsNew
};

},{"../../misc/lodash":311}],288:[function(_dereq_,module,exports){
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

},{}],289:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

var entityDescriptors = _dereq_('../entity-descriptors');
var entityTools = _dereq_('../entity-tools');
var ViewModel = _dereq_('../viewModel/viewModel');

var dataModelContext = _dereq_('./dataModel-context');

var dataTools = _dereq_('./data-tools');
var getNestedReference = dataTools.getNestedReference;
var insertValueIntoObject = dataTools.insertValueIntoObject;
var dataModelIsNew = dataTools.dataModelIsNew;

function isNode(thing) {
  var thingIsObject = _.isObject(thing);
  return (
    thingIsObject ? thing instanceof Node :
    thingIsObject && _.isNumber(thing.nodeType) === "number" && _.isString(thing.nodeName)
  );
}

var DataModel = module.exports = function DataModel(descriptor, configParams) {
  return {
    runBeforeInit: true,
    _preInit: function(params) {
      params = params || {};
      dataModelContext.enter(this);
      var pkField = configParams.idAttribute;
      this.__private('mappings', fw.observable({}));

      this.isCreating = fw.observable(false);
      this.isSaving = fw.observable(false);
      this.isFetching = fw.observable(false);
      this.isDestroying = fw.observable(false);
      this.requestInProgress = fw.pureComputed(function() {
        return this.isCreating() || this.isSaving() || this.isFetching() || this.isDestroying();
      }, this);

      this.$cid = fw.utils.guid();
      this[pkField] = this.$id = fw.observable(params[pkField]).mapTo(pkField);

      this.isNew = fw.pureComputed(dataModelIsNew, this);
    },
    mixin: {
      // GET from server and set in model
      fetch: function(options) {
        var ajax = _dereq_('../../misc/ajax');
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isFetching,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            var id = dataModel[configParams.idAttribute]();
            if (id) {
              // retrieve data dataModel the from server using the id
              var xhr = dataModel.sync('read', dataModel, options);

              ajax.handleJsonResponse(xhr)
                .then(function handleResponseData(data) {
                  var parsedData = configParams.parse ? configParams.parse(data) : data;
                  if (!_.isUndefined(parsedData[configParams.idAttribute])) {
                    dataModel.set(parsedData);
                  }
                });

              return xhr;
            }

            return false;
          }
        };

        return ajax.makeOrGetRequest('fetch', requestInfo);
      },

      // PUT / POST / PATCH to server
      save: function(key, val, options) {
        var ajax = _dereq_('../../misc/ajax');
        var dataModel = this;
        var attrs = null;

        if (_.isObject(key) && !isNode(key)) {
          attrs = key;
          options = val;
        } else if (_.isString(key) && arguments.length > 1) {
          (attrs = {})[key] = val;
        }

        if (_.isObject(options) && _.isFunction(options.stopPropagation)) {
          // method called as a result of an event binding, ignore its 'options'
          options = {};
        }

        options = _.extend({
          parse: true,
          wait: false,
          patch: false
        }, options);

        if (method === 'patch' && !options.attrs) {
          options.attrs = attrs;
        }

        var method = _.isUndefined(dataModel.$id()) ? 'create' : (options.patch ? 'patch' : 'update');
        var requestInfo = {
          requestRunning: (method === 'create' ? dataModel.isCreating : dataModel.isSaving),
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            if (!options.wait && !_.isNull(attrs)) {
              dataModel.set(attrs);
            }

            // retrieve data dataModel the from server using the id
            var xhr = dataModel.sync(method, dataModel, options);

            ajax.handleJsonResponse(xhr)
              .then(function handleResponseData(data) {
                var parsedData = configParams.parse ? configParams.parse(data) : data;

                if (options.wait && !_.isNull(attrs)) {
                  parsedData = _.extend({}, attrs, parsedData);
                }

                if (_.isObject(parsedData)) {
                  dataModel.set(parsedData);
                }
              });

            return xhr;
          }
        };

        return ajax.makeOrGetRequest('save', requestInfo);
      },

      // DELETE
      destroy: function(options) {
        var ajax = _dereq_('../../misc/ajax');
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isDestroying,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            if (dataModel.isNew()) {
              return false;
            }

            options = options ? _.clone(options) : {};
            var success = options.success;
            var wait = options.wait;

            var sendDestroyEvent = function() {
              dataModel.$namespace.publish('destroy', options);
            };

            if (!options.wait) {
              sendDestroyEvent();
            }

            var xhr = dataModel.sync('delete', dataModel, options);

            ajax.handleJsonResponse(xhr)
              .then(function handleResponseData(data) {
                dataModel.$id(undefined);
                if (options.wait) {
                  sendDestroyEvent();
                }
              });

            return xhr;
          }
        };

        return ajax.makeOrGetRequest('destroy', requestInfo);
      },

      // set attributes in model (clears isDirty on observables/fields it saves to by default)
      set: function(key, value, options) {
        var attributes = {};

        if (_.isString(key)) {
          attributes = insertValueIntoObject(attributes, key, value);
        } else if (_.isObject(key)) {
          attributes = key;
          options = value;
        }

        options = _.extend({
          clearDirty: true
        }, options);

        var mappingsChanged = false;
        var model = this;
        _.each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          var fieldValue = getNestedReference(attributes, fieldMap);
          if (!_.isUndefined(fieldValue)) {
            fw.isWriteableObservable(fieldObservable) && fieldObservable(fieldValue);
            mappingsChanged = true;
            options.clearDirty && fieldObservable.isDirty(false);
            model.$namespace.publish('_.change.' + fieldMap, fieldValue);
          }
        });

        if (mappingsChanged && options.clearDirty) {
          // we updated the dirty state of a/some field(s), lets tell the dataModel $dirty computed to (re)run its evaluator function
          this.__private('mappings').valueHasMutated();
        }
      },

      get: function(referenceField, includeRoot) {
        var dataModel = this;
        if (_.isArray(referenceField)) {
          return _.reduce(referenceField, function(jsObject, fieldMap) {
            return _.merge(jsObject, dataModel.get(fieldMap, true));
          }, {});
        } else if (!_.isUndefined(referenceField) && !_.isString(referenceField)) {
          throw new Error(dataModel.$namespace.getName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.get().');
        }

        var mappedObject = _.reduce(this.__private('mappings')(), function reduceModelToObject(jsObject, fieldObservable, fieldMap) {
          if (_.isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
            insertValueIntoObject(jsObject, fieldMap, fieldObservable());
          }
          return jsObject;
        }, {});

        return includeRoot ? mappedObject : getNestedReference(mappedObject, referenceField);
      },

      getData: function() {
        return this.get();
      },

      toJSON: function() {
        return JSON.stringify(this.getData());
      },

      clean: function(field) {
        if (!_.isUndefined(field)) {
          var fieldMatch = new RegExp('^' + field + '$|^' + field + '\..*');
        }
        _.each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          if (_.isUndefined(field) || fieldMap.match(fieldMatch)) {
            fieldObservable.isDirty(false);
          }
        });
      },

      sync: function() {
        return fw.sync.apply(this, arguments);
      },

      hasMappedField: function(referenceField) {
        return !!this.__private('mappings')()[referenceField];
      },

      dirtyMap: function() {
        var tree = {};
        _.each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          tree[fieldMap] = fieldObservable.isDirty();
        });
        return tree;
      }
    },
    _postInit: function() {
      if (configParams.autoIncrement) {
        this.$rootNamespace.request.handler('get', function() { return this.get(); }.bind(this));
      }
      this.$namespace.request.handler('get', function() { return this.get(); }.bind(this));

      this.isDirty = fw.computed(function() {
        return _.reduce(this.__private('mappings')(), function(isDirty, mappedField) {
          return isDirty || mappedField.isDirty();
        }, false);
      }, this);

      dataModelContext.exit();
    }
  };
};

fw.dataModel = {};

var methodName = 'dataModel';
var isEntityCtorDuckTag = '__is' + methodName + 'Ctor';
var isEntityDuckTag = '__is' + methodName;
function isDataModelCtor(thing) {
  return _.isFunction(thing) && !!thing[ isEntityCtorDuckTag ];
}
function isDataModel(thing) {
  return _.isObject(thing) && !!thing[ isEntityDuckTag ];
}

var descriptor;
entityDescriptors.push(descriptor = entityTools.prepareDescriptor({
  tagName: methodName.toLowerCase(),
  methodName: methodName,
  resource: fw.dataModel,
  behavior: [ ViewModel, DataModel ],
  isEntityCtorDuckTag: isEntityCtorDuckTag,
  isEntityDuckTag: isEntityDuckTag,
  isEntityCtor: isDataModelCtor,
  isEntity: isDataModel,
  defaultConfig: {
    idAttribute: 'id',
    url: null,
    useKeyInUrl: true,
    parse: false,
    ajaxOptions: {},
    namespace: undefined,
    autoRegister: false,
    autoIncrement: false,
    extend: {},
    mixins: undefined,
    requestLull: undefined,
    afterRender: _.noop,
    afterResolving: function resolveEntityImmediately(resolveNow) {
      resolveNow(true);
    },
    sequenceAnimations: false,
    onDispose: _.noop
  }
}));

fw.dataModel.create = entityTools.entityClassFactory.bind(null, descriptor);

_.extend(entityTools, {
  isDataModelCtor: isDataModelCtor,
  isDataModel: isDataModel
});

_dereq_('./mapTo');

},{"../../../bower_components/knockoutjs/dist/knockout":2,"../../misc/ajax":307,"../../misc/lodash":311,"../entity-descriptors":292,"../entity-tools":295,"../viewModel/viewModel":305,"./data-tools":287,"./dataModel-context":288,"./mapTo":290}],290:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

var dataModelContext = _dereq_('./dataModel-context');
var dataModelIsNew = _dereq_('./data-tools').dataModelIsNew;

var isDataModel = _dereq_('../entity-tools').isDataModel;

function getPrimaryKey(dataModel) {
  return dataModel.__private('configParams').idAttribute;
}

fw.subscribable.fn.mapTo = function(option) {
  var mappedObservable = this;
  var mapPath;
  var dataModel;

  if (_.isString(option)) {
    mapPath = option;
    dataModel = dataModelContext.getCurrent();
  } else if (_.isObject(option)) {
    mapPath = option.path;
    dataModel = option.dataModel;
  } else {
    throw new Error('Invalid options supplied to mapTo');
  }

  if (!isDataModel(dataModel)) {
    throw new Error('No dataModel context found/supplied for mapTo observable');
  }

  var mappings = dataModel.__private('mappings')();
  var primaryKey = getPrimaryKey(dataModel);

  if (!_.isUndefined(mappings[mapPath]) && _.isFunction(mappings[mapPath].dispose)) {
    // remapping a path, we need to dispose of the old one first
    mappings[mapPath].dispose();
  }

  // add/set the registry entry for the mapped observable
  mappings[mapPath] = mappedObservable;

  if (mapPath === primaryKey) {
    // mapping primary key, update/set the $id property on the dataModel
    dataModel.$id = mappings[mapPath];
    if (fw.isObservable(dataModel.isNew) && _.isFunction(dataModel.isNew.dispose)) {
      dataModel.isNew.dispose();
    }
    dataModel.isNew = fw.pureComputed(dataModelIsNew, dataModel);
  }

  mappedObservable.isDirty = fw.observable(false);
  var changeSubscription = mappedObservable.subscribe(function(value) {
    dataModel.$namespace.publish('_.change', { param: mapPath, value: value });
    mappedObservable.isDirty(true);
  });

  var disposeObservable = mappedObservable.dispose || _.noop;
  if (_.isFunction(mappedObservable.dispose)) {
    mappedObservable.dispose = function() {
      changeSubscription.dispose();
      disposeObservable.call(mappedObservable);
    };
  }

  dataModel.__private('mappings').valueHasMutated();

  return mappedObservable;
};

},{"../../../bower_components/knockoutjs/dist/knockout":2,"../../misc/lodash":311,"../entity-tools":295,"./data-tools":287,"./dataModel-context":288}],291:[function(_dereq_,module,exports){
// component-resource overwrites fw.components.register, needed by router entity
_dereq_('../resource/component-resource');

_dereq_('./viewModel/viewModel');
_dereq_('./dataModel/dataModel');
_dereq_('./router/router');

_dereq_('./binding/component-init');

},{"../resource/component-resource":317,"./binding/component-init":285,"./dataModel/dataModel":289,"./router/router":304,"./viewModel/viewModel":305}],292:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

module.exports = _.extend([
  /* filled in by viewModel/dataModel/router modules */
], {
  getTags: function() {
    return _.map(this, function(descriptor) {
      return descriptor.tagName;
    });
  },
  tagNameIsPresent: function isEntityTagNameDescriptorPresent(tagName) {
    return _.filter(this, function matchingTagNames(descriptor) {
      return descriptor.tagName === tagName;
    }).length > 0;
  },
  resourceFor: function getResourceForEntityTagName(tagName) {
    return _.reduce(this, function(resource, descriptor) {
      if (descriptor.tagName === tagName) {
        resource = descriptor.resource;
      }
      return resource;
    }, null);
  },
  getDescriptor: function getDescriptor(methodName) {
    return _.reduce(this, function reduceDescriptor(foundDescriptor, descriptor) {
      return descriptor.methodName === methodName ? descriptor : foundDescriptor;
    }, null);
  }
});

},{"../misc/lodash":311}],293:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');

var entityTools = _dereq_('./entity-tools');
var isEntity = entityTools.isEntity;
var isRouter = entityTools.isRouter;

var config = _dereq_('../misc/config');
var entityAnimateClass = config.entityAnimateClass;
var entityClass = config.entityClass;
var entityWrapperElement = config.entityWrapperElement;

var addClass = _dereq_('../misc/util').addClass;

/**
 * This method is used by applyBindings to bootstrap the lifecycle of an entity (if that is what was bound).
 *
 * @param {viewModel} entity
 * @param {DOMElement} element
 */
function entityLifecycle(entity, element) {
  if (isEntity(entity) && !entity.__private('afterRenderWasTriggered')) {
    entity.__private('afterRenderWasTriggered', true);
    element = element || document.body;

    var context;
    var entityContext;
    var $configParams = entity.__private('configParams');
    if (element.tagName.toLowerCase() === entityWrapperElement) {
      element = element.parentElement || element.parentNode;
    }

    entity.__private('element', element);
    entity.$context = entityContext = fw.contextFor(element);

    var afterRender = _.noop;
    if (_.isFunction($configParams.afterRender)) {
      afterRender = $configParams.afterRender;
    }

    var resolveFlightTracker = entity.__private('resolveFlightTracker') || _.noop;
    $configParams.afterRender = function (containerElement) {
      afterRender.call(this, containerElement);
      addClass(containerElement, entityClass);
      resolveFlightTracker(function addAnimationClass() {
        addClass(containerElement, entityAnimateClass);
      });
    };
    $configParams.afterRender.call(entity, element);

    if (isRouter(entity)) {
      entity.__private('context')(entityContext);
    }

    if (!_.isUndefined(element)) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        entity.dispose();
      });
    }
  }
}

module.exports = entityLifecycle;

},{"../../bower_components/knockoutjs/dist/knockout":2,"../misc/config":308,"../misc/lodash":311,"../misc/util":313,"./entity-tools":295}],294:[function(_dereq_,module,exports){
module.exports = [
  /* filled in by various modules */
];

},{}],295:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var riveter = _dereq_('../../bower_components/riveter/lib/riveter');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var entityMixins = _dereq_('./entity-mixins');
var entityDescriptors = _dereq_('./entity-descriptors');
var privateData = _dereq_('../misc/privateData');

function prepareDescriptor(descriptor) {
  var methodName = descriptor.methodName.charAt(0).toUpperCase() + descriptor.methodName.slice(1);

  return _.extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    referenceNamespace: (_.isString(descriptor.methodName) ? ('__' + descriptor.methodName + 'Reference') : undefined)
  }, descriptor);
}

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function entityMixinOrNothingFrom(thing) {
  return ((_.isArray(thing) && thing.length) || _.isObject(thing) ? thing : {});
}

function entityClassFactory(descriptor, configParams) {
  var entityCtor = null;
  var privateDataMixin = {
    _preInit: function() {
      this.__private = privateData.bind(this, {
        inFlightChildren: fw.observableArray()
      }, configParams);
    }
  };

  configParams = _.extend({}, descriptor.defaultConfig, configParams || {});

  var descriptorBehavior = [];
  _.map(descriptor.behavior, function(behavior, index) {
    descriptorBehavior.push(_.isFunction(behavior) ? behavior(descriptor, configParams) : behavior);
  });

  var ctor = configParams.initialize || _.noop;
  var userExtendProps = { mixin: configParams.extend || {} };
  if (!descriptor.isEntityCtor(ctor)) {
    var isEntityDuckTagMixin = {};
    isEntityDuckTagMixin[descriptor.isEntityDuckTag] = true;
    isEntityDuckTagMixin = { mixin: isEntityDuckTagMixin };

    var newInstanceCheckMixin = {
      _preInit: function() {
        if (this === window) {
          throw new Error('Must use the new operator when instantiating a ' + descriptor.methodName + '.');
        }
      }
    };
    var afterInitMixins = _.reject(entityMixins, isBeforeInitMixin);
    var beforeInitMixins = _.map(_.filter(entityMixins, isBeforeInitMixin), function(mixin) {
      delete mixin.runBeforeInit;
      return mixin;
    });

    var composure = [ctor].concat(
      entityMixinOrNothingFrom(privateDataMixin),
      entityMixinOrNothingFrom(userExtendProps),
      entityMixinOrNothingFrom(newInstanceCheckMixin),
      entityMixinOrNothingFrom(isEntityDuckTagMixin),
      entityMixinOrNothingFrom(afterInitMixins),
      entityMixinOrNothingFrom(beforeInitMixins),
      entityMixinOrNothingFrom(configParams.mixins),
      entityMixinOrNothingFrom(descriptorBehavior)
    );

    entityCtor = riveter.compose.apply(undefined, composure);
    entityCtor[descriptor.isEntityCtorDuckTag] = true;
    entityCtor.__private = privateData.bind(this, {}, configParams);
  } else {
    // user has specified another entity constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
    entityCtor = ctor;
  }

  if (!_.isNull(entityCtor) && _.isFunction(configParams.parent)) {
    entityCtor.inherits(configParams.parent);
  }

  if (configParams.autoRegister) {
    descriptor.resource.register(configParams.namespace, entityCtor);
  }

  return entityCtor;
}

function isEntityCtor(thing) {
  return _.reduce(_.map(entityDescriptors, 'isEntityCtor'), function(isThing, comparator) {
    return isThing || comparator(thing);
  }, false);
};

function isEntity(thing) {
  return _.reduce(_.map(entityDescriptors, 'isEntity'), function(isThing, comparator) {
    return isThing || comparator(thing);
  }, false);
};

function nearestEntity($context, predicate) {
  var foundEntity = null;

  predicate = predicate || isEntity;
  var predicates = [].concat(predicate);
  function isTheThing(thing) {
    return _.reduce(predicates, function(isThing, predicate) {
      return isThing || predicate(thing);
    }, false);
  }

  if (_.isObject($context)) {
    if (isTheThing($context.$data)) {
      // found $data that matches the predicate(s) in this context
      foundEntity = $context.$data;
    } else if (_.isObject($context.$parentContext) || (_.isObject($context.$data) && _.isObject($context.$data.$parentContext))) {
      // search through next parent up the chain
      foundEntity = nearestEntity($context.$parentContext || $context.$data.$parentContext, predicate);
    }
  }
  return foundEntity;
}

module.exports = {
  prepareDescriptor: prepareDescriptor,
  entityClassFactory: entityClassFactory,
  isEntityCtor: isEntityCtor,
  isEntity: isEntity,
  nearestEntity: nearestEntity
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../../bower_components/riveter/lib/riveter":4,"../misc/lodash":311,"../misc/privateData":312,"./entity-descriptors":292,"./entity-mixins":294}],296:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../../bower_components/knockoutjs/dist/knockout');

var defaultLoadingComponent = _dereq_('../router-defaults').defaultLoadingComponent;

fw.components.register(defaultLoadingComponent, {
  template: '<div class="sk-wave fade-in">\
              <div class="sk-rect sk-rect1"></div>\
              <div class="sk-rect sk-rect2"></div>\
              <div class="sk-rect sk-rect3"></div>\
              <div class="sk-rect sk-rect4"></div>\
              <div class="sk-rect sk-rect5"></div>\
            </div>'
});

},{"../../../../bower_components/knockoutjs/dist/knockout":2,"../router-defaults":302}],297:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../../misc/lodash');

var nearestParentRouter = _dereq_('../router-tools').nearestParentRouter;
var noParentViewModelError = { $namespace: { getName: function() { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };

// This custom binding binds the outlet element to the $outlet on the router, changes on its 'route' (component definition observable) will be applied to the UI and load in various views
fw.virtualElements.allowedBindings.$outletBinder = true;
fw.bindingHandlers.$outletBinder = {
  init: function(element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var $parentViewModel = (_.isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var $parentRouter = nearestParentRouter(bindingContext);
    var outletName = outletViewModel.outletName;
    var isRouter = _dereq_('../../entity-tools').isRouter;

    if (isRouter($parentRouter)) {
      // register the viewModel with the outlet for future use when its route is changed
      $parentRouter.__private('registerViewModelForOutlet')(outletName, outletViewModel);
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        // tell the router to clean up its reference to the outletViewModel
        $parentRouter.__private('unregisterViewModelForOutlet')(outletName);
        outletViewModel.dispose();
      });

      // register this outlet with its $parentRouter
      outletViewModel.route = $parentRouter.outlet(outletName);
    } else {
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + $parentViewModel.$namespace.getName() + '] but no router was defined.');
    }
  }
};

},{"../../../../bower_components/knockoutjs/dist/knockout":2,"../../../misc/lodash":311,"../../entity-tools":295,"../router-tools":303}],298:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../../misc/lodash');

var internalComponents = _dereq_('../../../component/internal-components');
var nextFrame = _dereq_('../../../misc/util').nextFrame;

var config = _dereq_('../../../misc/config');
var entityAnimateClass = config.entityAnimateClass;
var entityClass = config.entityClass;

var routerDefaults = _dereq_('../router-defaults');
var noComponentSelected = routerDefaults.noComponentSelected;
var nullComponent = routerDefaults.nullComponent;
var outletLoadingDisplay = routerDefaults.outletLoadingDisplay;
var outletLoadedDisplay = routerDefaults.outletLoadedDisplay;

var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };
var removeAnimation = {};
removeAnimation[entityAnimateClass] = false;
var addAnimation = {};
addAnimation[entityAnimateClass] = true;

internalComponents.push('outlet');
fw.components.register('outlet', {
  viewModel: function(params) {
    var outlet = this;

    this.outletName = fw.unwrap(params.name);
    this.__isOutlet = true;

    this.loadingDisplay = fw.observable(nullComponent);
    this.inFlightChildren = fw.observableArray();
    this.routeIsLoading = fw.observable(true);
    this.routeIsResolving = fw.observable(true);

    var resolvedCallbacks = [];
    this.addResolvedCallbackOrExecute = function(callback) {
      if (outlet.routeIsResolving()) {
        resolvedCallbacks.push(callback);
      } else {
        callback();
      }
    };

    this.routeIsLoadingSub = this.routeIsLoading.subscribe(function(routeIsLoading) {
      if (routeIsLoading) {
        outlet.routeIsResolving(true);
      } else {
        if (outlet.flightWatch && _.isFunction(outlet.flightWatch.dispose)) {
          outlet.flightWatch.dispose();
        }

        // must allow binding to begin on any subcomponents/etc
        nextFrame(function() {
          if (outlet.inFlightChildren().length) {
            outlet.flightWatch = outlet.inFlightChildren.subscribe(function(inFlightChildren) {
              if (!inFlightChildren.length) {
                outlet.routeIsResolving(false);
                _.isFunction(outlet.routeOnComplete) && outlet.routeOnComplete();
              }
            });
          } else {
            outlet.routeIsResolving(false);
            _.isFunction(outlet.routeOnComplete) && outlet.routeOnComplete();
          }
        });
      }
    });

    this.loadingStyle = fw.observable();
    this.loadedStyle = fw.observable();
    this.loadingClass = fw.observable();
    this.loadedClass = fw.observable();

    function showLoader() {
      outlet.loadingClass(removeAnimation);
      outlet.loadedClass(removeAnimation);
      outlet.loadedStyle(hiddenCSS);
      outlet.loadingStyle(visibleCSS);

      nextFrame(function() {
        outlet.loadingClass(addAnimation);
      });
    }

    function showLoadedAfterMinimumTransition() {
      outlet.loadingClass(removeAnimation);
      outlet.loadedStyle(visibleCSS);
      outlet.loadingStyle(hiddenCSS);
      outlet.loadedClass(addAnimation);

      if (resolvedCallbacks.length) {
        _.each(resolvedCallbacks, function(callback) {
          callback();
        });
        resolvedCallbacks = [];
      }
    }

    var transitionTriggerTimeout;
    function showLoaded() {
      clearTimeout(transitionTriggerTimeout);
      var minTransitionPeriod = outlet.route.peek().minTransitionPeriod;
      if (minTransitionPeriod) {
        transitionTriggerTimeout = setTimeout(showLoadedAfterMinimumTransition, minTransitionPeriod);
      } else {
        showLoadedAfterMinimumTransition();
      }
    }

    this.transitionTrigger = fw.computed(function() {
      var routeIsResolving = this.routeIsResolving();
      if (routeIsResolving) {
        showLoader();
      } else {
        showLoaded();
      }
    }, this);

    this.dispose = function() {
      _.each(outlet, function(outletProperty) {
        if (outletProperty && _.isFunction(outletProperty.dispose)) {
          outletProperty.dispose();
        }
      });
    };
  },
  template: '<!-- ko $outletBinder -->' +
              '<div class="' + outletLoadingDisplay + ' ' + entityClass + '" data-bind="style: loadingStyle, css: loadingClass">' +
                '<!-- ko component: loadingDisplay --><!-- /ko -->' +
              '</div>' +
              '<div class="' + outletLoadedDisplay + ' ' + entityClass + '" data-bind="style: loadedStyle, css: loadedClass">' +
                '<!-- ko component: route --><!-- /ko -->' +
              '</div>' +
            '<!-- /ko -->'
});

internalComponents.push(noComponentSelected);
fw.components.register(noComponentSelected, {
  template: '<div class="no-component-selected"></div>'
});
fw.components.register(nullComponent, {
  template: '<div class="null-component"></div>'
});

},{"../../../../bower_components/knockoutjs/dist/knockout":2,"../../../component/internal-components":280,"../../../misc/config":308,"../../../misc/lodash":311,"../../../misc/util":313,"../router-defaults":302}],299:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../../bower_components/knockoutjs/dist/knockout');

fw.outlet = {
  registerView: function(viewName, templateHTML) {
    fw.components.register(viewName, { template: templateHTML });
  },
  registerViewLocation: function(viewName, viewLocation) {
    fw.components.registerLocation(viewName, { template: viewLocation });
  }
};

_dereq_('./outlet-binder');
_dereq_('./outlet-component');
_dereq_('./loading-component');

module.exports = _dereq_('./router-outlet');

},{"../../../../bower_components/knockoutjs/dist/knockout":2,"./loading-component":296,"./outlet-binder":297,"./outlet-component":298,"./router-outlet":300}],300:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../../misc/lodash');

var resultBound = _dereq_('../../../misc/util').resultBound;
var clearSequenceQueue = _dereq_('../../../component/sequencing').clearSequenceQueue;

var routerDefaults = _dereq_('../router-defaults');
var noComponentSelected = routerDefaults.noComponentSelected;
var nullComponent = routerDefaults.nullComponent;
var defaultLoadingComponent = routerDefaults.defaultLoadingComponent;
var activeOutlets = routerDefaults.activeOutlets;

module.exports = function routerOutlet(outletName, componentToDisplay, options) {
  options = options || {};
  if (_.isFunction(options)) {
    options = { onComplete: options, onFailure: _.noop };
  }

  var router = this;
  var viewModelParameters = options.params;
  var onComplete = options.onComplete || _.noop;
  var onFailure = options.onFailure || _.noop;
  var configParams = router.__private('configParams');
  var outlets = router.outlets;
  var outletProperties = outlets[outletName] || {};
  var outlet = outletProperties.routeObservable;
  var outletViewModel = outletProperties.outletViewModel;

  if (!fw.isObservable(outlet)) {
    // router outlet observable not found, we must create a new one
    outlet = fw.observable({
      name: noComponentSelected,
      params: {},
      getOnCompleteCallback: function() { return _.noop; },
      onFailure: onFailure.bind(router)
    });

    // register the new outlet under its outletName
    outlets[outletName] = {
      outletViewModel: outletProperties.outletViewModel || null,
      routeObservable: outlet
    };
  }

  var currentOutletDef = outlet();
  var valueHasMutated = false;

  if (arguments.length > 1 && !componentToDisplay) {
    componentToDisplay = nullComponent;
  }

  if (!_.isUndefined(componentToDisplay)) {
    if (currentOutletDef.name !== componentToDisplay) {
      currentOutletDef.name = componentToDisplay;
      valueHasMutated = true;
    }

    if (_.isObject(viewModelParameters)) {
      currentOutletDef.params = viewModelParameters;
      valueHasMutated = true;
    }
  }

  if (outletViewModel) {
    // Show the loading component (if one is defined)
    var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay || currentOutletDef.name]);

    if (showDuringLoadComponent === true || (!showDuringLoadComponent &&  resultBound(fw.router, 'showDefaultLoader', router, [outletName, componentToDisplay || currentOutletDef.name]))) {
      showDuringLoadComponent = defaultLoadingComponent;
    }

    if (showDuringLoadComponent) {
      outletViewModel.loadingDisplay(showDuringLoadComponent);
    }
  }

  if (valueHasMutated) {
    clearSequenceQueue();

    currentOutletDef.minTransitionPeriod = resultBound(configParams, 'minTransitionPeriod', router, [outletName, componentToDisplay]);
    if (outletViewModel) {
      outletViewModel.inFlightChildren([]);
      outletViewModel.routeIsLoading(true);
    }

    currentOutletDef.getOnCompleteCallback = function(element) {
      var outletElement = element.parentNode;

      activeOutlets.remove(outlet);
      outletElement.setAttribute('rendered', (componentToDisplay === nullComponent ? '' : componentToDisplay));

      return function addBindingOnComplete() {
        var outletViewModel = router.outlets[outletName].outletViewModel;
        if (outletViewModel) {
          outletViewModel.routeIsLoading(false);
          outletViewModel.routeOnComplete = function() {
            onComplete.call(router, outletElement);
          };
        } else {
          onComplete.call(router, outletElement);
        }
      };
    };

    if (activeOutlets().indexOf(outlet) === -1) {
      activeOutlets.push(outlet);
    }

    outlet.valueHasMutated();
  }

  return outlet;
};

},{"../../../../bower_components/knockoutjs/dist/knockout":2,"../../../component/sequencing":284,"../../../misc/lodash":311,"../../../misc/util":313,"../router-defaults":302}],301:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

var util = _dereq_('../../misc/util');
var hasPathStart = util.hasPathStart;
var hasHashStart = util.hasHashStart;
var resultBound  = util.resultBound;
var startingHashRegex = util.startingHashRegex;
var removeClass = util.removeClass;
var addClass = util.addClass;
var hasClass = util.hasClass;

var routerTools = _dereq_('./router-tools');
var nearestParentRouter = routerTools.nearestParentRouter;
var isNullRouter = routerTools.isNullRouter;

function findParentNode(element, selector) {
  if (selector === true) {
    return element.parentNode;
  }

  if (element.parentNode && _.isFunction(element.parentNode.querySelectorAll)) {
    var parentNode = element.parentNode;
    var matches = parentNode.querySelectorAll(selector);
    if (matches.length && _.includes(matches, element)) {
      return element;
    }
    return findParentNode(parentNode, selector);
  }

  return undefined;
}

var isFullURLRegex = /(^[a-z]+:\/\/|^\/\/)/i;
var isFullURL = fw.utils.isFullURL = function(thing) {
  return _.isString(thing) && isFullURLRegex.test(thing);
};

fw.bindingHandlers.$route = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var $myRouter = nearestParentRouter(bindingContext);
    var routeParams = valueAccessor();
    var elementIsSetup = false;
    var stateTracker = null;
    var hashOnly = null;

    var routeHandlerDescription = {
      on: 'click',
      url: function defaultURLForRoute() { return element.getAttribute('href'); },
      addActiveClass: true,
      activeClass: null,
      parentHasState: false,
      handler: function defaultHandlerForRouteBinding(event, url) {
        if (hashOnly) {
          return false;
        }

        if (!isFullURL(url) && event.which !== 2) {
          event.preventDefault();
          return true;
        }
        return false;
      }
    };

    if (_.isFunction(routeParams) || _.isString(routeParams)) {
      routeHandlerDescription.url = routeParams;
    } else if (_.isObject(routeParams)) {
      _.extend(routeHandlerDescription, routeParams);
    }

    var routeHandlerDescriptionURL = routeHandlerDescription.url;
    if (!_.isFunction(routeHandlerDescriptionURL)) {
      routeHandlerDescription.url = function() { return routeHandlerDescriptionURL; };
    }

    function getRouteURL(includeParentPath) {
      var parentRoutePath = '';
      var routeURL = routeHandlerDescription.url();
      var myLinkPath = routeURL || '';

      if (!_.isNull(routeURL)) {
        if (_.isUndefined(routeURL)) {
          routeURL = myLinkPath;
        }

        if (!isFullURL(myLinkPath)) {
          if (!hasPathStart(myLinkPath)) {
            var currentRoute = $myRouter.currentRoute();
            if (hasHashStart(myLinkPath)) {
              if (!_.isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + myLinkPath;
              }
              hashOnly = true;
            } else {
              // relative url, prepend current segment
              if (!_.isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + '/' + myLinkPath;
              }
            }
          }

          if (includeParentPath && !isNullRouter($myRouter)) {
            myLinkPath = $myRouter.__private('parentRouter')().path() + myLinkPath;
          }
        }

        return myLinkPath;
      }

      return null;
    };
    var routeURLWithParentPath = getRouteURL.bind(null, true);
    var routeURLWithoutParentPath = getRouteURL.bind(null, false);

    function checkForMatchingSegment(mySegment, newRoute) {
      if (_.isString(mySegment)) {
        var currentRoute = $myRouter.currentRoute();
        var elementWithState = routeHandlerDescription.parentHasState ? findParentNode(element, routeHandlerDescription.parentHasState) : element;
        var activeRouteClassName = resultBound(routeHandlerDescription, 'activeClass', $myRouter) || fw.router.activeRouteClassName();
        mySegment = mySegment.replace(startingHashRegex, '/');

        if (_.isObject(currentRoute)) {
          if (resultBound(routeHandlerDescription, 'addActiveClass', $myRouter)) {
            if (mySegment === '/') {
              mySegment = '';
            }

            if (!_.isNull(newRoute) && newRoute.segment === mySegment && _.isString(activeRouteClassName) && activeRouteClassName.length) {
              // newRoute.segment is the same as this routers segment...add the activeRouteClassName to the element to indicate it is active
              addClass(elementWithState, activeRouteClassName);
            } else if (hasClass(elementWithState, activeRouteClassName)) {
              removeClass(elementWithState, activeRouteClassName);
            }
          }
        }
      }

      if (_.isNull(newRoute)) {
        // No route currently selected, remove the activeRouteClassName from the elementWithState
        removeClass(elementWithState, activeRouteClassName);
      }
    };

    function setUpElement() {
      if (!isNullRouter($myRouter)) {
        var myCurrentSegment = routeURLWithoutParentPath();
        var routerConfig = $myRouter.__private('configParams');
        if (element.tagName.toLowerCase() === 'a') {
          element.href = routerConfig.baseRoute + routeURLWithParentPath();
        }

        if (_.isObject(stateTracker) && _.isFunction(stateTracker.dispose)) {
          stateTracker.dispose();
        }
        stateTracker = $myRouter.currentRoute.subscribe(checkForMatchingSegment.bind(null, myCurrentSegment));

        if (elementIsSetup === false) {
          elementIsSetup = true;
          checkForMatchingSegment(myCurrentSegment, $myRouter.currentRoute());

          $myRouter.__private('parentRouter').subscribe(setUpElement);
          fw.utils.registerEventHandler(element, resultBound(routeHandlerDescription, 'on', $myRouter), function(event) {
            var currentRouteURL = routeURLWithoutParentPath();
            var handlerResult = routeHandlerDescription.handler.call(viewModel, event, currentRouteURL);
            if (handlerResult) {
              if (_.isString(handlerResult)) {
                currentRouteURL = handlerResult;
              }
              if (_.isString(currentRouteURL) && !isFullURL(currentRouteURL)) {
                $myRouter.setState(currentRouteURL);
              }
            }
            return true;
          });
        }
      }
    }

    if (fw.isObservable(routeHandlerDescription.url)) {
      $myRouter.__private('subscriptions').push(routeHandlerDescription.url.subscribe(setUpElement));
    }
    setUpElement();

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if (_.isObject(stateTracker)) {
        stateTracker.dispose();
      }
    });
  }
};

},{"../../../bower_components/knockoutjs/dist/knockout":2,"../../misc/lodash":311,"../../misc/util":313,"./router-tools":303}],302:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');
/* istanbul ignore next */
var fw = _dereq_('../../../bower_components/knockoutjs/dist/knockout');

var util = _dereq_('../../misc/util');
var entityAnimateClass = _dereq_('../../misc/config').entityAnimateClass;

var alwaysPassPredicate = util.alwaysPassPredicate;
var noComponentSelected = '_noComponentSelected';
var nullComponent = '_nullComponent';
var invalidRoutePathIdentifier = '___invalid-route';

var routesAreCaseSensitive = true;

var nullRouterData = {
  context: _.noop,
  childRouters: _.extend( _.noop.bind(), { push: _.noop } ),
  isRelative: function() { return false; }
};

var $nullRouter = {
  __private: function(propName) {
    if (arguments.length) {
      return nullRouterData[propName];
    }
    return nullRouterData;
  },
  path: function() { return ''; },
  __isNullRouter: true
};

var baseRoute = {
  controller: _.noop,
  indexedParams: [],
  namedParams: {},
  __isRoute: true
};

var baseRouteDescription = {
  filter: alwaysPassPredicate,
  __isRouteDesc: true
};

module.exports = {
  defaultLoadingComponent: 'default-loading-display',
  noComponentSelected: noComponentSelected,
  nullComponent: nullComponent,
  invalidRoutePathIdentifier: invalidRoutePathIdentifier,
  routesAreCaseSensitive: routesAreCaseSensitive,
  nullRouterData: nullRouterData,
  $nullRouter: $nullRouter,
  baseRoute: baseRoute,
  baseRouteDescription: baseRouteDescription,
  outletLoadingDisplay: 'fw-loading-display',
  outletLoadedDisplay: 'fw-loaded-display',
  activeOutlets: fw.observableArray()
};

},{"../../../bower_components/knockoutjs/dist/knockout":2,"../../misc/config":308,"../../misc/lodash":311,"../../misc/util":313}],303:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

var nearestEntity = _dereq_('../entity-tools').nearestEntity;

var routerDefaults = _dereq_('./router-defaults');
var $nullRouter = routerDefaults.$nullRouter;
var baseRouteDescription = routerDefaults.baseRouteDescription;
var routesAreCaseSensitive = routerDefaults.routesAreCaseSensitive;

var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatchRegex = /(^\/#)/;

function transformRouteConfigToDesc(routeDesc) {
  return _.extend({ id: _.uniqueId('route') }, baseRouteDescription, routeDesc );
}

function sameRouteDescription(desc1, desc2) {
  return desc1.id === desc2.id && _.isEqual(desc1.indexedParams, desc2.indexedParams) && _.isEqual(desc1.namedParams, desc2.namedParams);
}

// Convert a route string to a regular expression which is then used to match a uri against it and determine
// whether that uri matches the described route as well as parse and retrieve its tokens
function routeStringToRegExp(routeString) {
  routeString = routeString
    .replace(escapeRegex, "\\$&")
    .replace(optionalParamRegex, "(?:$1)?")
    .replace(namedParamRegex, function(match, optional) {
      return optional ? match : "([^\/]+)";
    })
    .replace(splatParamRegex, "(.*?)");

  return new RegExp('^' + routeString + (routeString !== '/' ? '(\\/.*)*$' : '$'), routesAreCaseSensitive ? undefined : 'i');
}

function isNullRouter(thing) {
  return _.isObject(thing) && !!thing.__isNullRouter;
}

function isRoute(thing) {
  return _.isObject(thing) && !!thing.__isRoute;
}

function isOutletViewModel(thing) {
  return _.isObject(thing) && thing.__isOutlet;
}

/**
 * Locate the nearest $router from a given ko $context
 * (travels up through $parentContext chain to find the router if not found on the
 * immediate $context). Returns $nullRouter if none is found.
 *
 * @param {object} $context
 * @returns {object} router instance or $nullRouter if none found
 */
function nearestParentRouter($context) {
  return nearestEntity($context, _dereq_('../entity-tools').isRouter) || $nullRouter;
}

module.exports = {
  namedParamRegex: namedParamRegex,
  hashMatchRegex: hashMatchRegex,
  transformRouteConfigToDesc: transformRouteConfigToDesc,
  sameRouteDescription: sameRouteDescription,
  routeStringToRegExp: routeStringToRegExp,
  isNullRouter: isNullRouter,
  isRoute: isRoute,
  isOutletViewModel: isOutletViewModel,
  nearestParentRouter: nearestParentRouter
};

},{"../../misc/lodash":311,"../entity-tools":295,"./router-defaults":302}],304:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

var entityDescriptors = _dereq_('../entity-descriptors');
var ViewModel = _dereq_('../viewModel/viewModel');
var routerOutlet = _dereq_('./outlet/outlet');

var privateData = _dereq_('../../misc/privateData');

var entityTools = _dereq_('../entity-tools');
var isEntity = entityTools.isEntity;

var util = _dereq_('../../misc/util');
var resultBound = util.resultBound;
var parseUri = util.parseUri;
var startingHashRegex = util.startingHashRegex;
var propertyDispose = util.propertyDispose;
var alwaysPassPredicate = util.alwaysPassPredicate;

_dereq_('./route-binding');

var routerTools = _dereq_('./router-tools');
var hashMatchRegex = routerTools.hashMatchRegex;
var namedParamRegex = routerTools.namedParamRegex;
var isNullRouter = routerTools.isNullRouter;
var transformRouteConfigToDesc = routerTools.transformRouteConfigToDesc;
var sameRouteDescription = routerTools.sameRouteDescription;
var routeStringToRegExp = routerTools.routeStringToRegExp;
var isRoute = routerTools.isRoute;
var nearestParentRouter = routerTools.nearestParentRouter;

var routerDefaults = _dereq_('./router-defaults');
var noComponentSelected = routerDefaults.noComponentSelected;
var $nullRouter = routerDefaults.$nullRouter;
var baseRoute = routerDefaults.baseRoute;

function registerViewModelForOutlet(outletName, outletViewModel) {
  var outletProperties = this.outlets[outletName] || {};
  outletProperties.outletViewModel = outletViewModel;
}

function unregisterViewModelForOutlet(outletName) {
  var outletProperties = this.outlets[outletName] || {};
  delete outletProperties.outletViewModel;
}

var Router = module.exports = function Router(descriptor, configParams) {
  return {
    _preInit: function(params) {
      var $router = this;
      var routerConfigParams = _.extend({ routes: [] }, configParams);

      var router = this.__private();
      this.__private = privateData.bind(this, router, routerConfigParams);
      this.__private('registerViewModelForOutlet', registerViewModelForOutlet.bind(this));
      this.__private('unregisterViewModelForOutlet', unregisterViewModelForOutlet.bind(this));

      routerConfigParams.baseRoute = fw.router.baseRoute() + (resultBound(routerConfigParams, 'baseRoute', router) || '');

      var subscriptions = router.subscriptions = fw.observableArray();
      router.urlParts = fw.observable();
      router.childRouters = fw.observableArray();
      router.parentRouter = fw.observable($nullRouter);
      router.context = fw.observable();
      router.historyPopstateListener = fw.observable();
      router.currentState = fw.observable('').broadcastAs('currentState');

      function trimBaseRoute(url) {
        var routerConfig = $router.__private('configParams');
        if (!_.isNull(routerConfig.baseRoute) && url.indexOf(routerConfig.baseRoute) === 0) {
          url = url.substr(routerConfig.baseRoute.length);
          if (url.length > 1) {
            url = url.replace(hashMatchRegex, '/');
          }
        }
        return url;
      }

      function normalizeURL(url) {
        var urlParts = parseUri(url);
        router.urlParts(urlParts);
        return trimBaseRoute(urlParts.path);
      }
      router.normalizeURL = normalizeURL;

      function getUnknownRoute() {
        var unknownRoute = _.find(($router.routeDescriptions || []).reverse(), { unknown: true }) || null;

        if (!_.isNull(unknownRoute)) {
          unknownRoute = _.extend({}, baseRoute, {
            id: unknownRoute.id,
            controller: unknownRoute.controller,
            title: unknownRoute.title,
            segment: ''
          });
        }

        return unknownRoute;
      }

      function getRouteForURL(url) {
        var route = null;
        var parentRoutePath = router.parentRouter().path() || '';
        var unknownRoute = getUnknownRoute();

        // If this is a relative router we need to remove the leading parentRoutePath section of the URL
        if (router.isRelative() && parentRoutePath.length > 0 && (routeIndex = url.indexOf(parentRoutePath + '/')) === 0) {
          url = url.substr(parentRoutePath.length);
        }

        // find all routes with a matching routeString
        var matchedRoutes = _.reduce($router.routeDescriptions, function (matches, routeDescription) {
          var routeDescRoute = [].concat(routeDescription.route);
          _.each(routeDescRoute, function (routeString) {
            var routeParams = [];

            if (_.isString(routeString) && _.isString(url)) {
              routeParams = url.match(routeStringToRegExp(routeString));
              if (!_.isNull(routeParams) && routeDescription.filter.call($router, routeParams, router.urlParts.peek())) {
                matches.push({
                  routeString: routeString,
                  specificity: routeString.replace(namedParamRegex, "*").length,
                  routeDescription: routeDescription,
                  routeParams: routeParams
                });
              }
            }
          });
          return matches;
        }, []);

        // If there are matchedRoutes, find the one with the highest 'specificity' (longest normalized matching routeString)
        // and convert it into the actual route
        if (matchedRoutes.length) {
          var matchedRoute = _.reduce(matchedRoutes, function(matchedRoute, foundRoute) {
            if (_.isNull(matchedRoute) || foundRoute.specificity > matchedRoute.specificity) {
              matchedRoute = foundRoute;
            }
            return matchedRoute;
          }, null);
          var routeDescription = matchedRoute.routeDescription;
          var routeString = matchedRoute.routeString;
          var routeParams = _.clone(matchedRoute.routeParams);
          var splatSegment = routeParams.pop() || '';
          var routeParamNames = _.map(routeString.match(namedParamRegex), function(param) {
            return param.replace(':', '');
          });
          var namedParams = _.reduce(routeParamNames, function(parameterNames, parameterName, index) {
            parameterNames[parameterName] = routeParams[index + 1];
            return parameterNames;
          }, {});

          route = _.extend({}, baseRoute, {
            id: routeDescription.id,
            controller: routeDescription.controller,
            title: routeDescription.title,
            name: routeDescription.name,
            url: url,
            segment: url.substr(0, url.length - splatSegment.length),
            indexedParams: routeParams,
            namedParams: namedParams
          });
        }

        return route || unknownRoute;
      }

      function RoutedAction(routeDescription) {
        if (!_.isUndefined(routeDescription.title)) {
          document.title = _.isFunction(routeDescription.title) ? routeDescription.title.apply($router, _.values(routeDescription.namedParams)) : routeDescription.title;
        }

        if (_.isUndefined(router.currentRouteDescription) || !sameRouteDescription(router.currentRouteDescription, routeDescription)) {
          (routeDescription.controller || _.noop).apply($router, _.values(routeDescription.namedParams) );
          router.currentRouteDescription = routeDescription;
        }
      }

      function getActionForRoute(routeDescription) {
        var Action = function DefaultAction() {
          delete router.currentRouteDescription;
          $router.outlet.reset();
        };

        if (isRoute(routeDescription)) {
          Action = RoutedAction.bind($router, routeDescription);
        }

        return Action;
      }

      router.isRelative = fw.computed(function() {
        return routerConfigParams.isRelative && !isNullRouter( this.parentRouter() );
      }, router);

      this.currentRoute = router.currentRoute = fw.computed(function() {
        return getRouteForURL(normalizeURL(this.currentState()));
      }, router);

      this.path = router.path = fw.computed(function() {
        var currentRoute = this.currentRoute();
        var routeSegment = '/';

        if (isRoute(currentRoute)) {
          routeSegment = (currentRoute.segment === '' ? '/' : currentRoute.segment);
        }

        return (this.isRelative() ? this.parentRouter().path() : '') + routeSegment;
      }, router);

      this.$namespace.command.handler('setState', function(state) {
        var route = state;
        var params = state.params;

        if (_.isObject(state)) {
          route = state.name;
          params = params || {};
        }

        $router.setState(route, params);
      });
      this.$namespace.request.handler('currentRoute', function() { return $router.__private('currentRoute')(); });
      this.$namespace.request.handler('urlParts', function() { return $router.__private('urlParts')(); });
      this.$namespace.command.handler('activate', function() { $router.activate(); });

      var parentPathSubscription;
      var $previousParent = $nullRouter;
      subscriptions.push(router.parentRouter.subscribe(function ($parentRouter) {
        if (!isNullRouter($previousParent) && $previousParent !== $parentRouter) {
          $previousParent.router.childRouters.remove(this);

          if (parentPathSubscription) {
            subscriptions.remove(parentPathSubscription);
            parentPathSubscription.dispose();
          }
          subscriptions.push(parentPathSubscription = $parentRouter.path.subscribe(function triggerRouteRecompute() {
            $router.router.currentState.notifySubscribers();
          }));
        }
        $parentRouter.__private('childRouters').push(this);
        $previousParent = $parentRouter;
      }, this));

      // Automatically trigger the new Action() whenever the currentRoute() updates
      subscriptions.push(router.currentRoute.subscribe(function getActionForRouteAndTrigger(newRoute) {
        if (router.currentState().length) {
          getActionForRoute(newRoute)( /* get and call the action for the newRoute */ );
        }
      }, this));

      this.outlets = {};
      this.outlet = routerOutlet.bind(this);
      this.outlet.reset = function() {
        _.each( this.outlets, function(outlet) {
          outlet({ name: noComponentSelected, params: {} });
        });
      }.bind(this);

      if (!_.isUndefined(routerConfigParams.unknownRoute)) {
        if (_.isFunction(routerConfigParams.unknownRoute)) {
          routerConfigParams.unknownRoute = { controller: routerConfigParams.unknownRoute };
        }
        routerConfigParams.routes.push(_.extend(routerConfigParams.unknownRoute, { unknown: true }));
      }
      this.setRoutes(routerConfigParams.routes);

      if (routerConfigParams.activate === true) {
        subscriptions.push(router.context.subscribe(function activateRouterAfterNewContext( $context ) {
          if (_.isObject($context)) {
            this.activate($context);
          }
        }, this));
      }

      this.matchesRoute = function(routeName, path) {
        var route = getRouteForURL(path);
        routeName = [].concat(routeName);
        if (!_.isNull(route)) {
          return routeName.indexOf(route.name) !== -1;
        }
        return false;
      };
    },
    mixin: {
      setRoutes: function(routeDesc) {
        this.routeDescriptions = [];
        this.addRoutes(routeDesc);
        return this;
      },
      addRoutes: function(routeConfig) {
        this.routeDescriptions = this.routeDescriptions.concat(_.map(_.isArray(routeConfig) ? routeConfig : [routeConfig], transformRouteConfigToDesc));
        return this;
      },
      activate: function($context, $parentRouter) {
        var self = this;
        $context = $context || self.__private('context')();
        $parentRouter = $parentRouter || nearestParentRouter($context);

        if (!isNullRouter($parentRouter)) {
          self.__private('parentRouter')($parentRouter);
        } else if (_.isObject($context)) {
          $parentRouter = nearestParentRouter($context);
          if ($parentRouter !== self) {
            self.__private('parentRouter')($parentRouter);
          }
        }

        if (!self.__private('historyPopstateListener')()) {
          var popstateEvent = function() {
            var location = window.history.location || window.location;
            self.__private('currentState')(self.__private('normalizeURL')(location.pathname + location.hash));
          };

          (function(eventInfo) {
            window[eventInfo[0]](eventInfo[1] + 'popstate', popstateEvent, false);
          })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);

          self.__private('historyPopstateListener')(popstateEvent);
        }

        if (self.__private('currentState')() === '') {
          self.setState();
        }

        self.$namespace.trigger('activated', { context: $context, parentRouter: $parentRouter });
        return self;
      },
      setState: function(url, routeParams) {
        var self = this;
        var namedRoute = _.isObject(routeParams) ? url : null;
        var configParams = this.__private('configParams');
        var useHistory = this.__private('historyPopstateListener')() && !fw.router.disableHistory();
        var location = window.history.location || window.location;

        if (!_.isNull(namedRoute)) {
          // must convert namedRoute into its URL form
          var routeDescription = _.find(this.routeDescriptions, function (route) {
            return route.name === namedRoute;
          });

          if (!_.isUndefined(routeDescription)) {
            url = _.first([].concat(routeDescription.route));
            _.each(routeParams, function (value, fieldName) {
              url = url.replace(':' + fieldName, routeParams[fieldName]);
            });
          } else {
            throw new Error('Could not locate named route: ' + namedRoute);
          }
        }

        if (!_.isString(url)) {
          url = useHistory ? location.pathname : '/';
        }

        var isExternalURL = fw.utils.isFullURL(url);
        if (!isExternalURL) {
          url = this.__private('normalizeURL')(url);
        }

        var shouldContinueToRoute = resultBound(configParams, 'beforeRoute', this, [url || '/']);
        if (shouldContinueToRoute && !isExternalURL) {
          if (useHistory) {
            var destination = configParams.baseRoute + this.__private('parentRouter')().path() + url.replace(startingHashRegex, '/');
            history.pushState(null, '', destination);
          }
          this.__private('currentState')(url);

          var routePath = this.path();
          _.each(this.__private('childRouters')(), function (childRouter) {
            childRouter.__private('currentState')(routePath);
          });
        }

        return this;
      },
      dispose: function() {
        if (!this._isDisposed) {
          this._isDisposed = true;

          var $parentRouter = this.__private('parentRouter')();
          if (!isNullRouter($parentRouter)) {
            $parentRouter.__private('childRouters').remove(this);
          }

          var historyPopstateListener = this.__private('historyPopstateListener')();
          if (historyPopstateListener) {
            (function(eventInfo) {
              window[eventInfo[0]](eventInfo[1] + 'popstate', historyPopstateListener);
            })(window.removeEventListener ? ['removeEventListener', ''] : ['detachEvent', 'on']);
          }

          this.$namespace.dispose();
          this.$globalNamespace.dispose();
          _.invokeMap(this.__private('subscriptions'), 'dispose');

          _.each(_.omitBy(this, function (property) {
            return isEntity(property);
          }), propertyDispose);

          _.each(_.omitBy(this.__private(), function (property) {
            return isEntity(property);
          }), propertyDispose);

          if (configParams.onDispose !== _.noop) {
            configParams.onDispose.call(this, this.__private('element'));
          }

          return this;
        }
      }
    }
  };
};

fw.router = {
  baseRoute: fw.observable(''),
  activeRouteClassName: fw.observable('active'),
  disableHistory: fw.observable(false),
  getNearestParent: function($context) {
    var $parentRouter = nearestParentRouter($context);
    return (!isNullRouter($parentRouter) ? $parentRouter : null);
  }
};

var methodName = 'router';
var isEntityCtorDuckTag = '__is' + methodName + 'Ctor';
var isEntityDuckTag = '__is' + methodName;
function isRouterCtor(thing) {
  return _.isFunction(thing) && !!thing[ isEntityCtorDuckTag ];
}
function isRouter(thing) {
  return _.isObject(thing) && !!thing[ isEntityDuckTag ];
}

var descriptor;
entityDescriptors.push(descriptor = entityTools.prepareDescriptor({
  tagName: methodName.toLowerCase(),
  methodName: methodName,
  resource: fw.router,
  behavior: [ ViewModel, Router ],
  isEntityCtorDuckTag: isEntityCtorDuckTag,
  isEntityDuckTag: isEntityDuckTag,
  isEntityCtor: isRouterCtor,
  isEntity: isRouter,
  defaultConfig: {
    namespace: '$router',
    autoRegister: false,
    autoIncrement: false,
    showDuringLoad: noComponentSelected,
    extend: {},
    mixins: undefined,
    afterRender: _.noop,
    afterResolving: function resolveEntityImmediately(resolveNow) {
      resolveNow(true);
    },
    sequenceAnimations: false,
    onDispose: _.noop,
    baseRoute: null,
    isRelative: true,
    activate: true,
    beforeRoute: alwaysPassPredicate,
    minTransitionPeriod: 0
  }
}));

_.extend(entityTools, {
  isRouter: isRouter
});

fw.router.create = entityTools.entityClassFactory.bind(null, descriptor);

},{"../../../bower_components/knockoutjs/dist/knockout":2,"../../misc/lodash":311,"../../misc/privateData":312,"../../misc/util":313,"../entity-descriptors":292,"../entity-tools":295,"../viewModel/viewModel":305,"./outlet/outlet":299,"./route-binding":301,"./router-defaults":302,"./router-tools":303}],305:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../../misc/lodash');

var entityDescriptors = _dereq_('../entity-descriptors');
var entityTools = _dereq_('../entity-tools');
var entityClassFactory = entityTools.entityClassFactory;
var propertyDispose = _dereq_('../../misc/util').propertyDispose;

var ViewModel = module.exports = function ViewModel(descriptor, configParams) {
  return {
    mixin: {
      disposeWithInstance: function(subscription) {
        if (_.isArray(subscription)) {
          var self = this;
          _.each(subscription, function(sub) {
            self.disposeWithInstance(sub);
          });
        } else {
          var subscriptions = this.__private('subscriptions');
          if (!_.isArray(subscriptions)) {
            subscriptions = [];
          }

          subscription && subscriptions.push(subscription);
          this.__private('subscriptions', subscriptions);
        }
      },
      dispose: function() {
        if (!this._isDisposed) {
          this._isDisposed = true;
          if (configParams.onDispose !== _.noop) {
            configParams.onDispose.call(this, this.__private('element'));
          }
          _.each(this, propertyDispose);
          _.each(this.__private('subscriptions') || [], propertyDispose);
        }
        return this;
      }
    },
    _postInit: function() {
      this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
        if (_.isString(options.namespaceName) || _.isArray(options.namespaceName)) {
          var myNamespaceName = this.$namespace.getName();
          if (_.isArray(options.namespaceName) && _.indexOf(options.namespaceName, myNamespaceName) !== -1) {
            return this;
          } else if (_.isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
            return this;
          }
        } else {
          return this;
        }
      }.bind(this));
    }
  };
};

fw.viewModel = {};

var methodName = 'viewModel';
var isEntityCtorDuckTag = '__is' + methodName + 'Ctor';
var isEntityDuckTag = '__is' + methodName;
function isViewModelCtor(thing) {
  return _.isFunction(thing) && !!thing[ isEntityCtorDuckTag ];
}
function isViewModel(thing) {
  return _.isObject(thing) && !!thing[ isEntityDuckTag ];
}

var descriptor;
entityDescriptors.push(descriptor = entityTools.prepareDescriptor({
  tagName: methodName.toLowerCase(),
  methodName: methodName,
  resource: fw.viewModel,
  behavior: [ ViewModel ],
  isEntityCtorDuckTag: isEntityCtorDuckTag,
  isEntityDuckTag: isEntityDuckTag,
  isEntityCtor: isViewModelCtor,
  isEntity: isViewModel,
  defaultConfig: {
    namespace: undefined,
    autoRegister: false,
    autoIncrement: false,
    extend: {},
    mixins: undefined,
    afterRender: _.noop,
    afterResolving: function resolveEntityImmediately(resolveNow) {
      resolveNow(true);
    },
    sequenceAnimations: false,
    onDispose: _.noop
  }
}));

fw.viewModel.create = entityTools.entityClassFactory.bind(null, descriptor);

_dereq_('../../misc/config').DefaultViewModel = fw.viewModel.create({
  namespace: '_DefaultViewModelNamespace',
  autoIncrement: true,
  initialize: function(params) {
    if (_.isObject(params) && _.isObject(params.$viewModel)) {
      _.extend(this, params.$viewModel);
    }
  }
});

},{"../../../bower_components/knockoutjs/dist/knockout":2,"../../misc/config":308,"../../misc/lodash":311,"../../misc/util":313,"../entity-descriptors":292,"../entity-tools":295}],306:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../bower_components/knockoutjs/dist/knockout');

_dereq_('./misc/init');

fw.namespace = _dereq_('./namespace/namespace');

_dereq_('./broadcastable-receivable');
_dereq_('./entities/entities');
_dereq_('./resource/resource');
_dereq_('./component/component');
_dereq_('./collection/collection');

_dereq_('./binding/applyBindings');
_dereq_('./binding/start');

fw.sync = _dereq_('./misc/ajax').sync;
fw.embed = _dereq_('./misc/embed-exports');

module.exports = fw;

},{"../bower_components/knockoutjs/dist/knockout":2,"./binding/applyBindings":272,"./binding/start":273,"./broadcastable-receivable":274,"./collection/collection":277,"./component/component":279,"./entities/entities":291,"./misc/ajax":307,"./misc/embed-exports":309,"./misc/init":310,"./namespace/namespace":316,"./resource/resource":319}],307:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('./lodash');
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');

var util = _dereq_('./util');
var resultBound = util.resultBound;
var promiseIsFulfilled = util.promiseIsFulfilled;
var isPromise = util.isPromise;

// Map from CRUD to HTTP for our default `fw.sync` implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch':  'PATCH',
  'delete': 'DELETE',
  'read':   'GET'
};

var parseURLRegex = /^(http[s]*:\/\/[a-zA-Z0-9:\.]*)*([\/]{0,1}[\w\.:\/-]*)$/;
var parseParamsRegex = /(:[\w\.]+)/g;
var trailingSlashRegex = /\/$/;

function noURLError() {
  throw new Error('A "url" property or function must be specified');
};

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
function makeOrGetRequest(operationType, requestInfo) {
  var requestRunning = requestInfo.requestRunning;
  var requestLull = requestInfo.requestLull;
  var entity = requestInfo.entity;
  var createRequest = requestInfo.createRequest;
  var promiseName = operationType + 'Promise';
  var allowConcurrent = requestInfo.allowConcurrent;
  var requests = entity.__private(promiseName) || [];
  var theRequest = _.last(requests);

  if ((allowConcurrent || !fw.isObservable(requestRunning) || !requestRunning()) || !requests.length) {
    theRequest = createRequest();

    if (!isPromise(theRequest)) {
      // returned value from createRequest() is a value not a promise, lets return the value in a promise
      theRequest = Promise().resolve(theRequest);
    }

    requests.push(theRequest);
    entity.__private(promiseName, requests);

    requestRunning(true);

    var lullFinished = fw.observable(false);
    var requestFinished = fw.observable(false);
    var requestWatcher = fw.computed(function() {
      if (lullFinished() && requestFinished()) {
        requestRunning(false);
        requestWatcher.dispose();
      }
    });

    requestLull = (_.isFunction(requestLull) ? requestLull(operationType) : requestLull);
    if (requestLull) {
      setTimeout(function() {
        lullFinished(true);
      }, requestLull);
    } else {
      lullFinished(true);
    }

    if (isPromise(theRequest)) {
      theRequest.then(function() {
        if (_.every(requests, promiseIsFulfilled)) {
          requestFinished(true);
          entity.__private(promiseName, []);
        }
      });
    }
  }

  return theRequest;
}

/**
 * Create an xmlhttprequest based on the desired action (read/write/etc), concern (dataModel/collection), and optional params.
 *
 * @param {string} action
 * @param {object} concern
 * @param {object} params
 * @returns {object} htr
 */
function sync(action, concern, params) {
  var isDataModel = _dereq_('../entities/entity-tools').isDataModel;
  var isCollection = _dereq_('../collection/collection-tools').isCollection;

  params = params || {};
  action = action || 'noAction';

  if (!isDataModel(concern) && !isCollection(concern)) {
    throw new Error('Must supply a dataModel or collection to fw.sync()');
  }

  if (!_.isString(methodMap[action])) {
    throw new Error('Invalid action (' + action + ') specified for sync operation');
  }

  var configParams = concern.__private('configParams');
  var options = _.extend({
    method: methodMap[action].toUpperCase(),
    url: null,
    body: null,
    headers: {}
  }, resultBound(configParams, 'ajaxOptions', concern, [params]) || {}, params);

  if (!_.isString(options.method)) {
    throw new Error('Invalid action (' + action + ') specified for sync operation');
  }

  var url = options.url;
  if (_.isNull(url)) {
    url = configParams.url;
    if (_.isFunction(url)) {
      url = url.call(concern, action);
    } else if (!_.isString(url)) {
      var thing = (isDataModel(concern) && 'dataModel') || (isCollection(concern) && 'collection') || 'UNKNOWN';
      throw new Error('Must provide a URL for/on a ' + thing + ' configuration in order to call .sync() on it');
    }

    if (isDataModel(concern)) {
      var pkIsSpecifiedByUser = !_.isNull(url.match(':' + configParams.idAttribute));
      var hasQueryString = !_.isNull(url.match(/\?/));
      if (_.includes(['read', 'update', 'patch', 'delete'], action) && configParams.useKeyInUrl && !pkIsSpecifiedByUser && !hasQueryString) {
        // need to append /:id to url
        url = url.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute;
      }
    }
  }

  var urlPieces = (url || noURLError()).match(parseURLRegex);
  if (!_.isNull(urlPieces)) {
    var baseURL = urlPieces[1] || '';
    url = baseURL + _.last(urlPieces);
  }

  if (isDataModel(concern)) {
    // replace any interpolated parameters
    var urlParams = url.match(parseParamsRegex);
    if (urlParams) {
      _.each(urlParams, function(param) {
        url = url.replace(param, concern.get(param.substr(1)));
      });
    }
  }

  if (_.isNull(options.body) && concern && _.includes(['create', 'update', 'patch'], action)) {
    options.contentType = 'application/json';
    options.body = JSON.stringify(options.attrs || concern.get());
  }

  var xhr = options.xhr = makePromiseQueryable(fetch(url, options));
  concern.$namespace.publish('_.request', { dataModel: concern, xhr: xhr, options: options });
  return xhr;
};

function makePromiseQueryable(promise) {
  if (promise.isResolved) {
    return promise;
  }

  var isResolved = false;
  var isRejected = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
    function(v) { isResolved = true; return v; },
    function(e) { isRejected = true; throw e; });
  result.isFulfilled = function() { return isResolved || isRejected; };
  result.isResolved = function() { return isResolved; }
  result.isRejected = function() { return isRejected; }
  return result;
}

/**
 * Take a fetch'd xmlhttprequest and handle the response. Takes into account valid 200-299 response codes.
 * Also handles parse errors in the response which is supposed to be valid JSON.
 *
 * @param {object} xhr
 * @returns {object} xhr with parsed JSON response result
 */
function handleJsonResponse(xhr) {
  return xhr.then(function(response) {
      return _.inRange(response.status, 200, 300) ? response.clone().json() : false;
    })
    .catch(function(parseError) {
      console.error(parseError);
      return false;
    });
}

module.exports = {
  sync: sync,
  makeOrGetRequest: makeOrGetRequest,
  handleJsonResponse: handleJsonResponse
}

},{"../../bower_components/knockoutjs/dist/knockout":2,"../collection/collection-tools":276,"../entities/entity-tools":295,"./lodash":311,"./util":313}],308:[function(_dereq_,module,exports){
module.exports = {
  entityClass: 'fw-entity',
  entityAnimateClass: 'fw-entity-animate',
  entityWrapperElement: 'binding-wrapper'
};

},{}],309:[function(_dereq_,module,exports){
module.exports = {
  postal: _dereq_('../../bower_components/postal.js/lib/postal'),
  riveter: _dereq_('../../bower_components/riveter/lib/riveter'),
  Conduit: _dereq_('../../bower_components/conduitjs/lib/conduit')
};

},{"../../bower_components/conduitjs/lib/conduit":1,"../../bower_components/postal.js/lib/postal":3,"../../bower_components/riveter/lib/riveter":4}],310:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');

// Record the footwork version as of this build.
fw.footworkVersion = '2.0.0';

fw.utils.guid = _dereq_('./util').guid;

},{"../../bower_components/knockoutjs/dist/knockout":2,"./util":313}],311:[function(_dereq_,module,exports){
/**
 * Custom build of lodash which only includes the dependencies that footwork needs
 */

/* istanbul ignore next */
module.exports = {
  isFunction: _dereq_('../../node_modules/lodash/isFunction'),
  isObject: _dereq_('../../node_modules/lodash/isObject'),
  isString: _dereq_('../../node_modules/lodash/isString'),
  isBoolean: _dereq_('../../node_modules/lodash/isBoolean'),
  isNumber: _dereq_('../../node_modules/lodash/isNumber'),
  isUndefined: _dereq_('../../node_modules/lodash/isUndefined'),
  isArray: _dereq_('../../node_modules/lodash/isArray'),
  isNull: _dereq_('../../node_modules/lodash/isNull'),
  extend: _dereq_('../../node_modules/lodash/extend'),
  pick: _dereq_('../../node_modules/lodash/pick'),
  each: _dereq_('../../node_modules/lodash/each'),
  filter: _dereq_('../../node_modules/lodash/filter'),
  bind: _dereq_('../../node_modules/lodash/bind'),
  invoke: _dereq_('../../node_modules/lodash/invoke'),
  invokeMap: _dereq_('../../node_modules/lodash/invokeMap'),
  clone: _dereq_('../../node_modules/lodash/clone'),
  reduce: _dereq_('../../node_modules/lodash/reduce'),
  has: _dereq_('../../node_modules/lodash/has'),
  result: _dereq_('../../node_modules/lodash/result'),
  uniqueId: _dereq_('../../node_modules/lodash/uniqueId'),
  map: _dereq_('../../node_modules/lodash/map'),
  find: _dereq_('../../node_modules/lodash/find'),
  omitBy: _dereq_('../../node_modules/lodash/omitBy'),
  indexOf: _dereq_('../../node_modules/lodash/indexOf'),
  first: _dereq_('../../node_modules/lodash/first'),
  values: _dereq_('../../node_modules/lodash/values'),
  reject: _dereq_('../../node_modules/lodash/reject'),
  once: _dereq_('../../node_modules/lodash/once'),
  last: _dereq_('../../node_modules/lodash/last'),
  isEqual: _dereq_('../../node_modules/lodash/isEqual'),
  defaults: _dereq_('../../node_modules/lodash/defaults'),
  noop: _dereq_('../../node_modules/lodash/noop'),
  keys: _dereq_('../../node_modules/lodash/keys'),
  merge: _dereq_('../../node_modules/lodash/merge'),
  after: _dereq_('../../node_modules/lodash/after'),
  debounce: _dereq_('../../node_modules/lodash/debounce'),
  throttle: _dereq_('../../node_modules/lodash/throttle'),
  intersection: _dereq_('../../node_modules/lodash/intersection'),
  every: _dereq_('../../node_modules/lodash/every'),
  isRegExp: _dereq_('../../node_modules/lodash/isRegExp'),
  identity: _dereq_('../../node_modules/lodash/identity'),
  includes: _dereq_('../../node_modules/lodash/includes'),
  partial: _dereq_('../../node_modules/lodash/partial'),
  sortBy: _dereq_('../../node_modules/lodash/sortBy'),
  inRange: _dereq_('../../node_modules/lodash/inRange'),
  noConflict: function noConflict() { return this; }
};

},{"../../node_modules/lodash/after":194,"../../node_modules/lodash/bind":198,"../../node_modules/lodash/clone":199,"../../node_modules/lodash/debounce":201,"../../node_modules/lodash/defaults":202,"../../node_modules/lodash/each":203,"../../node_modules/lodash/every":205,"../../node_modules/lodash/extend":206,"../../node_modules/lodash/filter":207,"../../node_modules/lodash/find":208,"../../node_modules/lodash/first":210,"../../node_modules/lodash/has":213,"../../node_modules/lodash/identity":216,"../../node_modules/lodash/inRange":217,"../../node_modules/lodash/includes":218,"../../node_modules/lodash/indexOf":219,"../../node_modules/lodash/intersection":220,"../../node_modules/lodash/invoke":221,"../../node_modules/lodash/invokeMap":222,"../../node_modules/lodash/isArray":224,"../../node_modules/lodash/isBoolean":227,"../../node_modules/lodash/isEqual":229,"../../node_modules/lodash/isFunction":230,"../../node_modules/lodash/isNull":232,"../../node_modules/lodash/isNumber":233,"../../node_modules/lodash/isObject":234,"../../node_modules/lodash/isRegExp":237,"../../node_modules/lodash/isString":238,"../../node_modules/lodash/isUndefined":241,"../../node_modules/lodash/keys":242,"../../node_modules/lodash/last":244,"../../node_modules/lodash/map":245,"../../node_modules/lodash/merge":247,"../../node_modules/lodash/noop":249,"../../node_modules/lodash/omitBy":251,"../../node_modules/lodash/once":252,"../../node_modules/lodash/partial":253,"../../node_modules/lodash/pick":254,"../../node_modules/lodash/reduce":257,"../../node_modules/lodash/reject":258,"../../node_modules/lodash/result":259,"../../node_modules/lodash/sortBy":260,"../../node_modules/lodash/throttle":263,"../../node_modules/lodash/uniqueId":269,"../../node_modules/lodash/values":270}],312:[function(_dereq_,module,exports){
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

},{}],313:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('./lodash');

function alwaysPassPredicate() {
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
 * @return {mixed}          The result of the property on the object
 */
function resultBound(object, path, context, params) {
  params = params || [];
  context = context || object;

  if (_.isFunction(object[path])) {
    return object[path].apply(context, params);
  }
  return object[path];
}

function isPromise(thing) {
  return _.isObject(thing) && _.isFunction(thing.then);
}

function promiseIsFulfilled(promise) {
  return !isPromise(promise) || promise.isFulfilled();
}

function hasClassName(element) {
  return _.isObject(element) && _.isString(element.className);
}

function hasClass(element, className) {
  return element.className.match( new RegExp('(\\s|^)' + className + '(\\s|$)') );
}

function addClass(element, className) {
  if (hasClassName(element) && !hasClass(element, className)) {
    element.className += (element.className.length && _.isNull(element.className.match(/ $/)) ? ' ' : '') + className;
  }
}

function removeClass(element, className) {
  if (hasClassName(element) && hasClass(element, className)) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

function nextFrame(callback) {
  setTimeout(callback, 1000 / 30);
};

var trailingSlashRegex = /\/$/;
function isPath(pathOrFile) {
  return _.isString(pathOrFile) && trailingSlashRegex.test(pathOrFile);
}

var startingSlashRegex = /^\//;
function hasPathStart(path) {
  return _.isString(path) && startingSlashRegex.test(path);
}

var startingHashRegex = /^#/;
function hasHashStart(string) {
  return _.isString(string) && startingHashRegex.test(string);
}

/**
 * Return the trailing file extension from a given string.
 *
 * @param {string} fileName
 * @returns {string} The extension at the end of the file (ie: txt)
 */
function getFilenameExtension(fileName) {
  var extension = '';
  if (fileName.indexOf('.') !== -1) {
    extension = _.last(fileName.split('.'));
  }
  return extension;
}

/**
 * Generate a random pseudo-GUID
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @returns {string} The GUID
 */
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

/**
 * parseUri() originally sourced from: http://blog.stevenlevithan.com/archives/parseuri
 *
 * @param {string} url
 * @returns {object} The parsed url data
 */
function parseUri(str) {
  var options = parseUri.options;
  var matchParts = options.parser[ options.strictMode ? "strict" : "loose" ].exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    uri[ options.key[i] ] = matchParts[i] || "";
  }

  uri[ options.q.name ] = {};
  uri[ options.key[12] ].replace(options.q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[options.q.name][$1] = $2;
    }
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
  q: {
    name:   "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

function propertyDispose(property) {
  if (_.isObject(property) && _.isFunction(property.dispose)) {
    property.dispose();
  }
}

function isDocumentFragment(obj) {
  if (window['DocumentFragment']) {
    return obj instanceof DocumentFragment;
  } else {
    return obj && obj.nodeType === 11;
  }
}

function isDomElement(obj) {
  if (window['HTMLElement']) {
    return obj instanceof HTMLElement;
  } else {
    return obj && obj.tagName && obj.nodeType === 1;
  }
}

module.exports = {
  alwaysPassPredicate: alwaysPassPredicate,
  resultBound: resultBound,
  isPromise: isPromise,
  promiseIsFulfilled: promiseIsFulfilled,
  addClass: addClass,
  hasClass: hasClass,
  removeClass: removeClass,
  nextFrame: nextFrame,
  isPath: isPath,
  hasPathStart: hasPathStart,
  hasHashStart: hasHashStart,
  getFilenameExtension: getFilenameExtension,
  guid: guid,
  parseUri: parseUri,
  propertyDispose: propertyDispose,
  isDocumentFragment: isDocumentFragment,
  isDomElement: isDomElement,
  startingHashRegex: startingHashRegex
};

},{"./lodash":311}],314:[function(_dereq_,module,exports){
var _ = _dereq_('../misc/lodash');

/**
 * Create postal message envelope using a given topic, data, and expiration
 *
 * @param {any} topic
 * @param {any} data
 * @param {any} expires
 * @returns {object} postal.js envelope
 */
function createEnvelope(topic, data) {
  var envelope = {
    topic: topic,
    data: data
  };

  return envelope;
}

// Method used to trigger an event on a namespace
function triggerEventOnNamespace(eventKey, params) {
  this.publish(createEnvelope('event.' + eventKey, params));
  return this;
}

// Method used to register an event handler on a namespace
function registerNamespaceEventHandler(eventKey, callback, context) {
  if (!_.isUndefined(context)) {
    callback = callback.bind(context);
  }

  var handlerSubscription = this._subscribe('event.' + eventKey, callback);
  this.eventHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to unregister an event handler on a namespace
function unregisterNamespaceHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

// Method used to send a command to a namespace
function sendCommandToNamespace(commandKey, params) {
  this.publish(createEnvelope('command.' + commandKey, params));
  return this;
}

// Method used to register a command handler on a namespace
function registerNamespaceCommandHandler(commandKey, callback, context) {
  if (!_.isUndefined(context)) {
    callback = callback.bind(context);
  }

  var handlerSubscription = this._subscribe('command.' + commandKey, callback);
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to issue a request for data from a namespace, returning the response (or undefined if no response)
// This method will return an array of responses if more than one is received.
function requestResponseFromNamespace(requestKey, params, allowMultipleResponses) {
  var response = undefined;
  var responseSubscription;

  responseSubscription = this._subscribe('request.' + requestKey + '.response', function(reqResponse) {
    if (_.isUndefined(response)) {
      response = allowMultipleResponses ? [reqResponse] : reqResponse;
    } else if (allowMultipleResponses) {
      response.push(reqResponse);
    }
  });

  this.publish(createEnvelope('request.' + requestKey, params));
  responseSubscription.unsubscribe();

  return response;
}

// Method used to register a request handler on a namespace.
// Requests sent using the specified requestKey will be called and passed in any params specified, the return value is passed back to the issuer
function registerNamespaceRequestHandler(requestKey, callback, context) {
  if (!_.isUndefined(context)) {
    callback = callback.bind(context);
  }

  var requestHandler = function(params) {
    var callbackResponse = callback(params);
    this.publish(createEnvelope('request.' + requestKey + '.response', callbackResponse));
  }.bind(this);

  var handlerSubscription = this._subscribe('request.' + requestKey, requestHandler);
  this.requestHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// This effectively shuts down all requests, commands, events, and subscriptions by unsubscribing all handlers on a discreet namespace object
var handlerRepos = [ 'requestHandlers', 'commandHandlers', 'eventHandlers', 'subscriptions' ];
function disconnectNamespaceHandlers() {
  var namespace = this;
  _.each(handlerRepos, function(handlerRepo) {
    _.invokeMap(namespace[handlerRepo], 'unsubscribe');
  });
  return this;
}

function getNamespaceName() {
  return this.channel;
}

module.exports = {
  createEnvelope: createEnvelope,
  triggerEventOnNamespace: triggerEventOnNamespace,
  registerNamespaceEventHandler: registerNamespaceEventHandler,
  unregisterNamespaceHandler: unregisterNamespaceHandler,
  sendCommandToNamespace: sendCommandToNamespace,
  registerNamespaceCommandHandler: registerNamespaceCommandHandler,
  requestResponseFromNamespace: requestResponseFromNamespace,
  registerNamespaceRequestHandler: registerNamespaceRequestHandler,
  disconnectNamespaceHandlers: disconnectNamespaceHandlers,
  getNamespaceName: getNamespaceName
};

},{"../misc/lodash":311}],315:[function(_dereq_,module,exports){
var _ = _dereq_('../misc/lodash');
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');

// Prepare an empty namespace stack.
// This is where footwork registers its current working namespace name. Each new namespace is
// 'unshifted' and 'shifted' as they are entered and exited, keeping the most current at
// index 0.
var namespaceStack = [];

// This counter is used when model options { autoIncrement: true } and more than one model
// having the same namespace is instantiated. This is used in the event you do not want
// multiple copies of the same model to share the same namespace (if they do share a
// namespace, they receive all of the same events/messages/commands/etc).
var namespaceNameCounter = {};

/**
 * Returns a normalized namespace name based off of 'name'. It will register the name counter
 * if not present and increment it if it is, then return the name (with the counter appended
 * if autoIncrement === true and the counter is > 0).
 *
 * @param {string} name namespace name
 * @param {boolean} autoIncrement flag indicating whether or not to autoincrement the namespace
 * @returns {string} indexed namespace name
 */
function indexedNamespaceName(name, autoIncrement) {
  if (_.isUndefined(namespaceNameCounter[name])) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + (autoIncrement === true ? namespaceNameCounter[name] : '');
}

/**
 * Enter a namespace context using the given namespaceName. This makes it so that any
 * broadcastable/receivable made can have a 'default' namespace which is the one lexically
 * local to it.
 *
 * @param {string} namespaceName
 * @returns {object} namespace
 */
function enterNamespaceName(namespaceName) {
  namespaceStack.unshift(namespaceName);
  return fw.namespace(currentNamespaceName());
}

/**
 * Enter a namespace context using the given namespace instance. This makes it so that any
 * broadcastable/receivable made can have a 'default' namespace which is the one lexically
 * local to it.
 *
 * @param {any} ns
 * @returns {object} namespace
 */
function enterNamespace(ns) {
  namespaceStack.unshift(ns.getName());
  return ns;
}

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack

/**
 * Exit the current namespace context (leaving you in the context above that, if there is one)
 *
 * @returns {object} namespace
 */
function exitNamespace() {
  namespaceStack.shift();
  return currentNamespace();
}


/**
 * Return the current namespace channel name.
 *
 * @returns {string} namespaceName
 */
function currentNamespaceName() {
  return namespaceStack[0];
};

/**
 * Return instance of the current namespace channel.
 *
 * @returns {object} namespace
 */
function currentNamespace() {
  return fw.namespace(currentNamespaceName());
};

_.extend(fw.utils, {
  currentNamespaceName: currentNamespaceName,
  currentNamespace: currentNamespace
});

module.exports = {
  indexedNamespaceName: indexedNamespaceName,
  enterNamespace: enterNamespace,
  enterNamespaceName: enterNamespaceName,
  exitNamespace: exitNamespace,
  currentNamespace: currentNamespace,
  currentNamespaceName: currentNamespaceName
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../misc/lodash":311}],316:[function(_dereq_,module,exports){
/* istanbul ignore next */
var postal = _dereq_('../../bower_components/postal.js/lib/postal');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var namespaceMethods = _dereq_('./namespace-methods');
var disconnectNamespaceHandlers = namespaceMethods.disconnectNamespaceHandlers;
var sendCommandToNamespace = namespaceMethods.sendCommandToNamespace;
var registerNamespaceCommandHandler = namespaceMethods.registerNamespaceCommandHandler;
var unregisterNamespaceHandler = namespaceMethods.unregisterNamespaceHandler;
var getNamespaceName = namespaceMethods.getNamespaceName;
var triggerEventOnNamespace = namespaceMethods.triggerEventOnNamespace;
var requestResponseFromNamespace = namespaceMethods.requestResponseFromNamespace;
var registerNamespaceRequestHandler = namespaceMethods.registerNamespaceRequestHandler;
var registerNamespaceEventHandler = namespaceMethods.registerNamespaceEventHandler;

var namespaceTools = _dereq_('./namespace-tools');
var enterNamespace = namespaceTools.enterNamespace;
var enterNamespaceName = namespaceTools.enterNamespaceName;
var currentNamespaceName = namespaceTools.currentNamespaceName;
var exitNamespace = namespaceTools.exitNamespace;
var indexedNamespaceName = namespaceTools.indexedNamespaceName;

// Creates and returns a new namespace instance
var Namespace = function Namespace(namespaceName, $parentNamespace) {
  if (!_.isUndefined($parentNamespace)) {
    if (_.isString($parentNamespace)) {
      namespaceName = $parentNamespace + '.' + namespaceName;
    } else if (!_.isUndefined($parentNamespace.channel)) {
      namespaceName = $parentNamespace.channel + '.' + namespaceName;
    }
  }
  var ns = postal.channel(namespaceName);

  var subscriptions = ns.subscriptions = [];
  ns._subscribe = ns.subscribe;
  ns.subscribe = function(topic, callback, context) {
    if (arguments.length > 2) {
      callback = callback.bind(context);
    }
    var subscription = ns._subscribe.call(ns, topic, callback);
    subscriptions.push(subscription);
    return subscription;
  };
  ns.unsubscribe = unregisterNamespaceHandler;

  ns._publish = ns.publish;
  ns.publish = function(envelope, callback, context) {
    if (arguments.length > 2) {
      callback = callback.bind(context);
    }
    ns._publish.call(ns, envelope, callback);
  };

  ns.__isNamespace = true;
  ns.dispose = disconnectNamespaceHandlers.bind(ns);

  ns.commandHandlers = [];
  ns.command = sendCommandToNamespace.bind(ns);
  ns.command.handler = registerNamespaceCommandHandler.bind(ns);
  ns.command.unregister = unregisterNamespaceHandler;

  ns.requestHandlers = [];
  ns.request = requestResponseFromNamespace.bind(ns);
  ns.request.handler = registerNamespaceRequestHandler.bind(ns);
  ns.request.unregister = unregisterNamespaceHandler;

  ns.eventHandlers = [];
  ns.event = ns.trigger = triggerEventOnNamespace.bind(ns);
  ns.event.handler = registerNamespaceEventHandler.bind(ns);
  ns.event.unregister = unregisterNamespaceHandler;

  ns.getName = getNamespaceName.bind(ns);
  ns.enter = function() {
    return enterNamespace(this);
  };
  ns.exit = function() {
    if (currentNamespaceName() === this.getName()) {
      return exitNamespace();
    }
  };

  return ns;
};

Namespace.isNamespace = function isNamespace(thing) {
  return _.isObject(thing) && !!thing.__isNamespace;
};

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
_dereq_('../entities/entity-mixins').push({
  runBeforeInit: true,
  _preInit: function(options) {
    var $configParams = this.__private('configParams');
    var namespaceName = $configParams.namespace || $configParams.name || _.uniqueId('namespace');
    this.$namespace = enterNamespaceName(indexedNamespaceName(namespaceName, $configParams.autoIncrement));
    this.$rootNamespace = Namespace(namespaceName);
    this.$globalNamespace = Namespace();
  },
  mixin: {
    getNamespaceName: function() {
      return this.$namespace.getName();
    }
  },
  _postInit: function(options) {
    exitNamespace();
  }
});

module.exports = Namespace;

},{"../../bower_components/postal.js/lib/postal":3,"../entities/entity-mixins":294,"../misc/lodash":311,"./namespace-methods":314,"./namespace-tools":315}],317:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var util = _dereq_('../misc/util');
var isPath = util.isPath;
var getFilenameExtension = util.getFilenameExtension;
var regExpMatch = /^\/|\/$/g;

fw.components.resourceLocations = {};

fw.components.fileExtensions = fw.observable({
  combined: '.js',
  viewModel: '.js',
  template: '.html'
});

var originalComponentRegisterFunc = fw.components.register;
fw.components.register = function(componentName, options) {
  var viewModel = options.viewModel || options.dataModel || options.router;

  if (!_.isString(componentName)) {
    throw new Error('Components must be provided a componentName.');
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || _dereq_('../misc/config').DefaultViewModel,
    template: options.template
  });
};

/**
 * Return the file name extension for the given componentName and fileType.
 *
 * @param {string} componentName
 * @param {string} fileType (combined/viewModel/template)
 * @returns {string} the file extension (ie: 'js')
 */
function getComponentExtension(componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions();
  var fileExtension = '';

  if (_.isFunction(componentExtensions)) {
    fileExtension = componentExtensions(componentName)[fileType];
  } else if (_.isObject(componentExtensions)) {
    if (_.isFunction(componentExtensions[fileType])) {
      fileExtension = componentExtensions[fileType](componentName);
    } else {
      fileExtension = componentExtensions[fileType] || '';
    }
  }

  return fileExtension.replace(/^\./, '') || '';
}

function forceViewModelComponentConvention(componentLocation) {
  if (_.isObject(componentLocation) && _.isUndefined(componentLocation.viewModel) && _.isUndefined(componentLocation.combined)) {
    return {
      viewModel: componentLocation.dataModel || componentLocation.router,
      template: componentLocation.template
    };
  }
  return componentLocation;
}

fw.components.getFileName = function(componentName, fileType) {
  var fileName = componentName;
  var fileExtension = getComponentExtension(componentName, fileType);

  if (fw.components.isRegistered(componentName)) {
    return null;
  }

  if (fw.components.locationIsRegistered(componentName)) {
    var registeredLocation = fw.components.getLocation(componentName);
    if (!_.isUndefined(registeredLocation[fileType]) && !isPath(registeredLocation[fileType])) {
      if (_.isString(registeredLocation[fileType])) {
        // full filename was supplied, lets return that
        fileName = _.last(registeredLocation[fileType].split('/'));
      } else {
        return null;
      }
    }
  }

  return fileName + (fileExtension !== getFilenameExtension(fileName) ? ('.' + fileExtension) : '');
};

var baseComponentLocation = {
  combined: null,
  viewModel: null,
  template: null
};

fw.components.registerLocation = function(componentName, componentLocation, folderOffset) {
  if (_.isArray(componentName)) {
    _.each(componentName, function(name) {
      fw.components.registerLocation(name, componentLocation, folderOffset);
    });
  }

  if (_.isString(componentLocation)) {
    componentLocation = _.extend({}, baseComponentLocation, {
      viewModel: componentLocation,
      template: componentLocation,
      folderOffset: !!folderOffset
    });
  } else if (_.isObject(componentLocation)) {
    componentLocation.folderOffset = !!folderOffset;
  }

  fw.components.resourceLocations[componentName] = _.extend({}, baseComponentLocation, forceViewModelComponentConvention(componentLocation));
};

fw.components.getRegisteredLocation = function(componentName) {
  return _.reduce(fw.components.resourceLocations, function(registeredLocation, location, registeredComponentName) {
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

fw.components.locationIsRegistered = function(componentName) {
  return !!fw.components.getRegisteredLocation(componentName);
};

// Return the component resource definition for the supplied componentName
fw.components.getLocation = function(componentName) {
  if (_.isUndefined(componentName)) {
    return fw.components.resourceLocations;
  }
  return _.omitBy(fw.components.getRegisteredLocation(componentName), _.isNull);
};

module.exports = {
  getComponentExtension: getComponentExtension
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../misc/config":308,"../misc/lodash":311,"../misc/util":313}],318:[function(_dereq_,module,exports){
/* istanbul ignore next */
var fw = _dereq_('../../bower_components/knockoutjs/dist/knockout');
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var isNamespace = _dereq_('../namespace/namespace').isNamespace;
var isPath = _dereq_('../misc/util').isPath;
var regExpMatch = /^\/|\/$/g;

function isRegistered(descriptor, resourceName) {
  return !_.isUndefined(descriptor.registered[resourceName]);
};

function getRegistered(descriptor, resourceName) {
  return descriptor.registered[resourceName];
};

function register(descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
};

function getModelExtension(dataModelExtensions, modelName) {
  var fileExtension = '';

  if (_.isFunction(dataModelExtensions)) {
    fileExtension = dataModelExtensions(modelName);
  } else if (_.isString(dataModelExtensions)) {
    fileExtension = dataModelExtensions;
  }

  return fileExtension.replace(/^\./, '') || '';
}

function getModelFileName(descriptor, modelName) {
  var modelResourceLocations = descriptor.resourceLocations;
  var fileName = modelName + '.' + getModelExtension(descriptor.fileExtensions(), modelName);

  if (!_.isUndefined(modelResourceLocations[modelName])) {
    var registeredLocation = modelResourceLocations[modelName];
    if (_.isString(registeredLocation) && !isPath(registeredLocation)) {
      // full filename was supplied, lets return that
      fileName = _.last(registeredLocation.split('/'));
    }
  }

  return fileName;
}

function registerModelLocation(descriptor, modelName, location) {
  if (_.isArray(modelName)) {
    _.each(modelName, function(name) {
      registerModelLocation(descriptor, name, location);
    });
  }
  descriptor.resourceLocations[ modelName ] = location;
}

function modelResourceLocation(descriptor, modelName) {
  return _.reduce(descriptor.resourceLocations, function(registeredLocation, location, registeredName) {
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

function modelLocationIsRegistered(descriptor, modelName) {
  return !!modelResourceLocation(descriptor, modelName);
}

function getModelResourceLocation(descriptor, modelName) {
  if (_.isUndefined(modelName)) {
    return descriptor.resourceLocations;
  }

  return modelResourceLocation(descriptor, modelName);
}

var $globalNamespace = fw.namespace();
function getModelReferences(descriptor, namespaceName, options) {
  options = options || {};
  if (_.isString(namespaceName) || _.isArray(namespaceName)) {
    options.namespaceName = namespaceName;
  }

  var references = _.reduce($globalNamespace.request(descriptor.referenceNamespace, _.extend({ includeOutlets: false }, options), true), function(models, model) {
    if (!_.isUndefined(model)) {
      var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if (!_.isNull(namespaceName)) {
        if (_.isUndefined(models[namespaceName])) {
          models[namespaceName] = [model];
        } else {
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});

  var referenceKeys = _.keys(references);
  if (_.isString(namespaceName)) {
    if (referenceKeys.length === 1) {
      return references[referenceKeys[0]] || [];
    }
    return [];
  }
  return references;
}

module.exports = {
  isRegistered: isRegistered,
  getRegistered: getRegistered,
  register: register,
  getModelFileName: getModelFileName,
  registerModelLocation: registerModelLocation,
  modelResourceLocation: modelResourceLocation,
  modelLocationIsRegistered: modelLocationIsRegistered,
  getModelResourceLocation: getModelResourceLocation,
  getModelReferences: getModelReferences
};

},{"../../bower_components/knockoutjs/dist/knockout":2,"../misc/lodash":311,"../misc/util":313,"../namespace/namespace":316}],319:[function(_dereq_,module,exports){
/* istanbul ignore next */
var _ = _dereq_('../misc/lodash');

var resourceMethods = _dereq_('./resource-methods');
var getModelFileName = resourceMethods.getModelFileName;
var register = resourceMethods.register;
var isRegistered = resourceMethods.isRegistered;
var getRegistered = resourceMethods.getRegistered;
var registerModelLocation = resourceMethods.registerModelLocation;
var modelLocationIsRegistered = resourceMethods.modelLocationIsRegistered;
var getModelResourceLocation = resourceMethods.getModelResourceLocation;
var getModelReferences = resourceMethods.getModelReferences;

/**
 * Hydrates each entity resource with the necessary utility methods.
 *
 * @param {object} descriptor (as defined in each entity and extended onto the entity-descriptors)
 * @returns
 */
function resourceHelperFactory(descriptor) {
  var resourceMethods = {
    getFileName: getModelFileName.bind(null, descriptor),
    register: register.bind(null, descriptor),
    isRegistered: isRegistered.bind(null, descriptor),
    getRegistered: getRegistered.bind(null, descriptor),
    registerLocation: registerModelLocation.bind(null, descriptor),
    locationIsRegistered: modelLocationIsRegistered.bind(null, descriptor),
    getLocation: getModelResourceLocation.bind(null, descriptor),
    fileExtensions: descriptor.fileExtensions,
    resourceLocations: descriptor.resourceLocations
  };

  if (!_.isUndefined(descriptor.referenceNamespace)) {
    // Returns a reference to the specified models.
    // If no name is supplied, a reference to an array containing all viewModel references is returned.
    resourceMethods.getAll = getModelReferences.bind(null, descriptor);
  }

  return resourceMethods;
}

_.each(_dereq_('../entities/entity-descriptors'), function(descriptor) {
  if (!_.isUndefined(descriptor.resource)) {
    _.extend(descriptor.resource, resourceHelperFactory(descriptor));
  }
});

},{"../entities/entity-descriptors":292,"../misc/lodash":311,"./resource-methods":318}]},{},[306])(306)
});