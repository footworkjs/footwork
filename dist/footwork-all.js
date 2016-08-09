/**
 * footwork.js - A solid footing for web applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v1.3.0-all
 * Url: http://footworkjs.com
 * License(s): MIT
 */

(function (root, factory) {
  /**
   * Knockout uses a non-standard UMD wrapping that makes it impossible (I think) to embed it like the
   * other dependencies, the -all build uses a forked version which removes the wrappings.
   *
   * Also have to give it normal access to the window object, otherwise strange things happen with
   * _some_ bindings. (ie: strange behavior I could not track a cause to, fixed here by 'brute force')
   */
  var koExports = {};
  var amdRequire;
  /*!
 * Knockout JavaScript library v3.4.0
 * (c) Steven Sanderson - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function() {var c=window.jQuery,w="undefined"!==typeof koExports?koExports:{};w.b=function(a,b){for(var d=a.split("."),e=w,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=b};w.O=function(a,b,d){a[b]=d};w.version="3.4.0";w.b("version",w.version);w.options={deferUpdates:!1,useOnlyNativeEvents:!1};
w.a=function(){function a(a,b){for(var d in a)a.hasOwnProperty(d)&&b(d,a[d])}function b(a,b){if(b)for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);return a}function d(a,b){a.__proto__=b;return a}function e(a,b,d,e){var k=a[b].match(p)||[];w.a.C(d.match(p),function(a){w.a.za(k,a,e)});a[b]=k.join(" ")}var f={__proto__:[]}instanceof Array,h="function"===typeof Symbol,g={},m={};g[navigator&&/Firefox\/2/i.test(navigator.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];g.MouseEvents=
"click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");a(g,function(a,b){if(b.length)for(var d=0,e=b.length;d<e;d++)m[b[d]]=a});var l={propertychange:!0},k=document&&function(){for(var a=3,b=document.createElement("div"),d=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",d[0];);return 4<a?a:void 0}(),p=/\S+/g;return{ic:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],C:function(a,b){for(var d=0,e=a.length;d<
e;d++)b(a[d],d)},A:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var d=0,e=a.length;d<e;d++)if(a[d]===b)return d;return-1},Yb:function(a,b,d){for(var e=0,k=a.length;e<k;e++)if(b.call(d,a[e],e))return a[e];return null},Va:function(a,b){var d=w.a.A(a,b);0<d?a.splice(d,1):0===d&&a.shift()},Zb:function(a){a=a||[];for(var b=[],d=0,e=a.length;d<e;d++)0>w.a.A(b,a[d])&&b.push(a[d]);return b},ob:function(a,d){a=a||[];for(var b=[],e=0,k=a.length;e<
k;e++)b.push(d(a[e],e));return b},Ua:function(a,b){a=a||[];for(var d=[],e=0,k=a.length;e<k;e++)b(a[e],e)&&d.push(a[e]);return d},Aa:function(a,d){if(d instanceof Array)a.push.apply(a,d);else for(var b=0,e=d.length;b<e;b++)a.push(d[b]);return a},za:function(a,d,b){var e=w.a.A(w.a.Gb(a),d);0>e?b&&a.push(d):b||a.splice(e,1)},ta:f,extend:b,setPrototypeOf:d,hb:f?d:b,M:a,Ma:function(a,d){if(!a)return a;var b={},e;for(e in a)a.hasOwnProperty(e)&&(b[e]=d(a[e],e,a));return b},xb:function(a){for(;a.firstChild;)w.removeNode(a.firstChild)},
pc:function(a){a=w.a.ea(a);for(var d=(a[0]&&a[0].ownerDocument||document).createElement("div"),b=0,e=a.length;b<e;b++)d.appendChild(w.ia(a[b]));return d},Da:function(a,b){for(var d=0,e=a.length,k=[];d<e;d++){var l=a[d].cloneNode(!0);k.push(b?w.ia(l):l)}return k},ma:function(a,d){w.a.xb(a);if(d)for(var b=0,e=d.length;b<e;b++)a.appendChild(d[b])},wc:function(a,d){var b=a.nodeType?[a]:a;if(0<b.length){for(var e=b[0],k=e.parentNode,l=0,f=d.length;l<f;l++)k.insertBefore(d[l],e);l=0;for(f=b.length;l<f;l++)w.removeNode(b[l])}},
Ia:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.splice(0,1);for(;1<a.length&&a[a.length-1].parentNode!==b;)a.length--;if(1<a.length){var d=a[0],e=a[a.length-1];for(a.length=0;d!==e;)a.push(d),d=d.nextSibling;a.push(e)}}return a},yc:function(a,b){7>k?a.setAttribute("selected",b):a.selected=b},jb:function(a){return null===a||void 0===a?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},sd:function(a,b){a=a||"";return b.length>a.length?
!1:a.substring(0,b.length)===b},Sc:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;return!!a},wb:function(a){return w.a.Sc(a,a.ownerDocument.documentElement)},Wb:function(a){return!!w.a.Yb(a,w.a.wb)},J:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},bc:function(a){return w.onError?function(){try{return a.apply(this,
arguments)}catch(b){throw w.onError&&w.onError(b),b;}}:a},setTimeout:function(a,b){return setTimeout(w.a.bc(a),b)},fc:function(a){setTimeout(function(){w.onError&&w.onError(a);throw a;},0)},B:function(a,b,d){var e=w.a.bc(d);d=k&&l[b];if(w.options.useOnlyNativeEvents||d||!c)if(d||"function"!=typeof a.addEventListener)if("undefined"!=typeof a.attachEvent){var f=function(b){e.call(a,b)},m="on"+b;a.attachEvent(m,f);w.a.N.ya(a,function(){a.detachEvent(m,f)})}else throw Error("Browser doesn't support addEventListener or attachEvent");
else a.addEventListener(b,e,!1);else c(a).bind(b,e)},Na:function(a,b){if(!a||!a.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===w.a.J(a)&&a.type&&"click"==b.toLowerCase()?(d=a.type,d="checkbox"==d||"radio"==d):d=!1;if(w.options.useOnlyNativeEvents||!c||d)if("function"==typeof document.createEvent)if("function"==typeof a.dispatchEvent)d=document.createEvent(m[b]||"HTMLEvents"),d.initEvent(b,!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,a),a.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");
else if(d&&a.click)a.click();else if("undefined"!=typeof a.fireEvent)a.fireEvent("on"+b);else throw Error("Browser doesn't support triggering events");else c(a).trigger(b)},c:function(a){return w.P(a)?a():a},Gb:function(a){return w.P(a)?a.G():a},lb:function(a,b,d){var k;b&&("object"===typeof a.classList?(k=a.classList[d?"add":"remove"],w.a.C(b.match(p),function(b){k.call(a.classList,b)})):"string"===typeof a.className.baseVal?e(a.className,"baseVal",b,d):e(a,"className",b,d))},ib:function(a,b){var d=
w.a.c(b);if(null===d||void 0===d)d="";var e=w.h.firstChild(a);!e||3!=e.nodeType||w.h.nextSibling(e)?w.h.ma(a,[a.ownerDocument.createTextNode(d)]):e.data=d;w.a.Xc(a)},xc:function(a,b){a.name=b;if(7>=k)try{a.mergeAttributes(document.createElement("<input name='"+a.name+"'/>"),!1)}catch(d){}},Xc:function(a){9<=k&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Tc:function(a){if(k){var b=a.style.width;a.style.width=0;a.style.width=b}},nd:function(a,b){a=w.a.c(a);b=w.a.c(b);for(var d=
[],e=a;e<=b;e++)d.push(e);return d},ea:function(a){for(var b=[],d=0,e=a.length;d<e;d++)b.push(a[d]);return b},dc:function(a){return h?Symbol(a):a},wd:6===k,xd:7===k,L:k,kc:function(a,b){for(var d=w.a.ea(a.getElementsByTagName("input")).concat(w.a.ea(a.getElementsByTagName("textarea"))),e="string"==typeof b?function(a){return a.name===b}:function(a){return b.test(a.name)},k=[],l=d.length-1;0<=l;l--)e(d[l])&&k.push(d[l]);return k},ld:function(a){return"string"==typeof a&&(a=w.a.jb(a))?JSON&&JSON.parse?
JSON.parse(a):(new Function("return "+a))():null},Lb:function(a,b,d){if(!JSON||!JSON.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");return JSON.stringify(w.a.c(a),b,d)},md:function(b,d,e){e=e||{};var k=e.params||{},l=e.includeFields||this.ic,f=b;if("object"==typeof b&&"form"===w.a.J(b))for(var f=b.action,m=l.length-1;0<=
m;m--)for(var h=w.a.kc(b,l[m]),g=h.length-1;0<=g;g--)k[h[g].name]=h[g].value;d=w.a.c(d);var p=document.createElement("form");p.style.display="none";p.action=f;p.method="post";for(var z in d)b=document.createElement("input"),b.type="hidden",b.name=z,b.value=w.a.Lb(w.a.c(d[z])),p.appendChild(b);a(k,function(a,b){var d=document.createElement("input");d.type="hidden";d.name=a;d.value=b;p.appendChild(d)});document.body.appendChild(p);e.submitter?e.submitter(p):p.submit();setTimeout(function(){p.parentNode.removeChild(p)},
0)}}}();w.b("utils",w.a);w.b("utils.arrayForEach",w.a.C);w.b("utils.arrayFirst",w.a.Yb);w.b("utils.arrayFilter",w.a.Ua);w.b("utils.arrayGetDistinctValues",w.a.Zb);w.b("utils.arrayIndexOf",w.a.A);w.b("utils.arrayMap",w.a.ob);w.b("utils.arrayPushAll",w.a.Aa);w.b("utils.arrayRemoveItem",w.a.Va);w.b("utils.extend",w.a.extend);w.b("utils.fieldsIncludedWithJsonPost",w.a.ic);w.b("utils.getFormFields",w.a.kc);w.b("utils.peekObservable",w.a.Gb);w.b("utils.postJson",w.a.md);w.b("utils.parseJson",w.a.ld);
w.b("utils.registerEventHandler",w.a.B);w.b("utils.stringifyJson",w.a.Lb);w.b("utils.range",w.a.nd);w.b("utils.toggleDomNodeCssClass",w.a.lb);w.b("utils.triggerEvent",w.a.Na);w.b("utils.unwrapObservable",w.a.c);w.b("utils.objectForEach",w.a.M);w.b("utils.addOrRemoveItem",w.a.za);w.b("utils.setTextContent",w.a.ib);w.b("unwrap",w.a.c);
Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if(1===arguments.length)return function(){return b.apply(a,arguments)};var d=Array.prototype.slice.call(arguments,1);return function(){var e=d.slice(0);e.push.apply(e,arguments);return b.apply(a,e)}});
w.a.g=new function(){function a(a,h){var g=a[d];if(!g||"null"===g||!e[g]){if(!h)return;g=a[d]="ko"+b++;e[g]={}}return e[g]}var b=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(b,d){var e=a(b,!1);return void 0===e?void 0:e[d]},set:function(b,d,e){if(void 0!==e||void 0!==a(b,!1))a(b,!0)[d]=e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},R:function(){return b++ +d}}};w.b("utils.domData",w.a.g);w.b("utils.domData.clear",w.a.g.clear);
w.a.N=new function(){function a(a,b){var e=w.a.g.get(a,d);void 0===e&&b&&(e=[],w.a.g.set(a,d,e));return e}function b(d){var e=a(d,!1);if(e)for(var e=e.slice(0),m=0;m<e.length;m++)e[m](d);w.a.g.clear(d);w.a.N.cleanExternalData(d);if(f[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&b(d)}var d=w.a.g.R(),e={1:!0,8:!0,9:!0},f={1:!0,9:!0};return{ya:function(b,d){if("function"!=typeof d)throw Error("Callback must be a function");a(b,!0).push(d)},vc:function(b,e){var f=a(b,!1);f&&(w.a.Va(f,
e),0==f.length&&w.a.g.set(b,d,void 0))},ia:function(a){if(e[a.nodeType]&&(b(a),f[a.nodeType])){var d=[];w.a.Aa(d,a.getElementsByTagName("*"));for(var m=0,l=d.length;m<l;m++)b(d[m])}return a},removeNode:function(a){w.ia(a);a.parentNode&&a.parentNode.removeChild(a)},cleanExternalData:function(a){c&&"function"==typeof c.cleanData&&c.cleanData([a])}}};w.ia=w.a.N.ia;w.removeNode=w.a.N.removeNode;w.b("cleanNode",w.ia);w.b("removeNode",w.removeNode);w.b("utils.domNodeDisposal",w.a.N);
w.b("utils.domNodeDisposal.addDisposeCallback",w.a.N.ya);w.b("utils.domNodeDisposal.removeDisposeCallback",w.a.N.vc);
(function(){var a=[0,"",""],b=[1,"<table>","</table>"],d=[3,"<table><tbody><tr>","</tr></tbody></table>"],e=[1,"<select multiple='multiple'>","</select>"],f={thead:b,tbody:b,tfoot:b,tr:[2,"<table><tbody>","</tbody></table>"],td:d,th:d,option:e,optgroup:e},h=8>=w.a.L;w.a.va=function(b,d){var e;if(c)if(c.parseHTML)e=c.parseHTML(b,d)||[];else{if((e=c.clean([b],d))&&e[0]){for(var k=e[0];k.parentNode&&11!==k.parentNode.nodeType;)k=k.parentNode;k.parentNode&&k.parentNode.removeChild(k)}}else{(e=d)||(e=
document);var k=e.parentWindow||e.defaultView||window,p=w.a.jb(b).toLowerCase(),q=e.createElement("div"),n;n=(p=p.match(/^<([a-z]+)[ >]/))&&f[p[1]]||a;p=n[0];n="ignored<div>"+n[1]+b+n[2]+"</div>";"function"==typeof k.innerShiv?q.appendChild(k.innerShiv(n)):(h&&e.appendChild(q),q.innerHTML=n,h&&q.parentNode.removeChild(q));for(;p--;)q=q.lastChild;e=w.a.ea(q.lastChild.childNodes)}return e};w.a.Jb=function(a,b){w.a.xb(a);b=w.a.c(b);if(null!==b&&void 0!==b)if("string"!=typeof b&&(b=b.toString()),c)c(a).html(b);
else for(var d=w.a.va(b,a.ownerDocument),e=0;e<d.length;e++)a.appendChild(d[e])}})();w.b("utils.parseHtmlFragment",w.a.va);w.b("utils.setHtml",w.a.Jb);
w.V=function(){function a(b,e){if(b)if(8==b.nodeType){var f=w.V.rc(b.nodeValue);null!=f&&e.push({Rc:b,jd:f})}else if(1==b.nodeType)for(var f=0,h=b.childNodes,g=h.length;f<g;f++)a(h[f],e)}var b={};return{Db:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var e=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);b[e]=a;return"\x3c!--[ko_memo:"+e+"]--\x3e"},Dc:function(a,e){var f=
b[a];if(void 0===f)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,e||[]),!0}finally{delete b[a]}},Ec:function(b,e){var f=[];a(b,f);for(var h=0,g=f.length;h<g;h++){var m=f[h].Rc,l=[m];e&&w.a.Aa(l,e);w.V.Dc(f[h].jd,l);m.nodeValue="";m.parentNode&&m.parentNode.removeChild(m)}},rc:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();w.b("memoization",w.V);w.b("memoization.memoize",w.V.Db);w.b("memoization.unmemoize",w.V.Dc);
w.b("memoization.parseMemoText",w.V.rc);w.b("memoization.unmemoizeDomNodeAndDescendants",w.V.Ec);
w.fa=function(){function a(){if(f)for(var a=f,b=0,d;g<f;)if(d=e[g++]){if(g>a){if(5E3<=++b){g=f;w.a.fc(Error("'Too much recursion' after processing "+b+" task groups."));break}a=f}try{d()}catch(p){w.a.fc(p)}}}function b(){a();g=f=e.length=0}var d,e=[],f=0,h=1,g=0;window.MutationObserver?d=function(a){var b=document.createElement("div");(new MutationObserver(a)).observe(b,{attributes:!0});return function(){b.classList.toggle("foo")}}(b):d=document&&"onreadystatechange"in document.createElement("script")?
function(a){var b=document.createElement("script");b.onreadystatechange=function(){b.onreadystatechange=null;document.documentElement.removeChild(b);b=null;a()};document.documentElement.appendChild(b)}:function(a){setTimeout(a,0)};return{scheduler:d,gb:function(a){f||w.fa.scheduler(b);e[f++]=a;return h++},cancel:function(a){a=a-(h-f);a>=g&&a<f&&(e[a]=null)},resetForTesting:function(){var a=f-g;g=f=e.length=0;return a},rd:a}}();w.b("tasks",w.fa);w.b("tasks.schedule",w.fa.gb);w.b("tasks.runEarly",w.fa.rd);
w.Ha={throttle:function(a,b){a.throttleEvaluation=b;var d=null;return w.K({read:a,write:function(e){clearTimeout(d);d=w.a.setTimeout(function(){a(e)},b)}})},rateLimit:function(a,b){var d,e,f;"number"==typeof b?d=b:(d=b.timeout,e=b.method);a.mb=!1;f="notifyWhenChangesStop"==e?x:C;a.cb(function(a){return f(a,d)})},deferred:function(a,b){if(!0!==b)throw Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.");a.mb||(a.mb=!0,a.cb(function(b){var e;
return function(){w.fa.cancel(e);e=w.fa.gb(b);a.notifySubscribers(void 0,"dirty")}}))},notify:function(a,b){a.equalityComparer="always"==b?null:D}};var E={undefined:1,"boolean":1,number:1,string:1};function D(a,b){return null===a||typeof a in E?a===b:!1}function C(a,b){var d;return function(){d||(d=w.a.setTimeout(function(){d=void 0;a()},b))}}function x(a,b){var d;return function(){clearTimeout(d);d=w.a.setTimeout(a,b)}}w.b("extenders",w.Ha);
w.Bc=function(a,b,d){this.ra=a;this.pb=b;this.Qc=d;this.aa=!1;w.O(this,"dispose",this.o)};w.Bc.prototype.o=function(){this.aa=!0;this.Qc()};w.S=function(){w.a.hb(this,I);I.Ab(this)};function K(a,b){b&&"change"!==b?"beforeChange"===b?this.Qb(a):this.Ra(a,b):this.Rb(a)}
var I={Ab:function(a){a.T={};a.Tb=1},subscribe:function(a,b,d){var e=this;d=d||"change";var f=new w.Bc(e,b?a.bind(b):a,function(){w.a.Va(e.T[d],f);e.Sa&&e.Sa(d)});e.Ba&&e.Ba(d);e.T[d]||(e.T[d]=[]);e.T[d].push(f);return f},notifySubscribers:function(a,b){b=b||"change";"change"===b&&this.Fc();if(this.Za(b))try{w.s.$b();for(var d=this.T[b].slice(0),e=0,f;f=d[e];++e)f.aa||f.pb(a)}finally{w.s.end()}},Xa:function(){return this.Tb},$c:function(a){return this.Xa()!==a},Fc:function(){++this.Tb},cb:function(a){var b=
this,d=w.P(b),e,f,h;b.Ra||(b.Ra=b.notifySubscribers,b.notifySubscribers=K);var g=a(function(){b.Sb=!1;d&&h===b&&(h=b());e=!1;b.Bb(f,h)&&b.Ra(f=h)});b.Rb=function(a){b.Sb=e=!0;h=a;g()};b.Qb=function(a){e||(f=a,b.Ra(a,"beforeChange"))}},Za:function(a){return this.T[a]&&this.T[a].length},Yc:function(a){if(a)return this.T[a]&&this.T[a].length||0;var b=0;w.a.M(this.T,function(a,e){"dirty"!==a&&(b+=e.length)});return b},Bb:function(a,b){return!this.equalityComparer||!this.equalityComparer(a,b)},extend:function(a){var b=
this;a&&w.a.M(a,function(a,e){var f=w.Ha[a];"function"==typeof f&&(b=f(b,e)||b)});return b}};w.O(I,"subscribe",I.subscribe);w.O(I,"extend",I.extend);w.O(I,"getSubscriptionsCount",I.Yc);w.a.ta&&w.a.setPrototypeOf(I,Function.prototype);w.S.fn=I;w.nc=function(a){return null!=a&&"function"==typeof a.subscribe&&"function"==typeof a.notifySubscribers};w.b("subscribable",w.S);w.b("isSubscribable",w.nc);
w.Ea=w.s=function(){function a(a){d.push(e);e=a}function b(){e=d.pop()}var d=[],e,f=0;return{$b:a,end:b,uc:function(a){if(e){if(!w.nc(a))throw Error("Only subscribable things can act as dependencies");e.pb.call(e.Mc,a,a.Ic||(a.Ic=++f))}},I:function(d,e,f){try{return a(),d.apply(e,f||[])}finally{b()}},Ja:function(){if(e)return e.u.Ja()},bb:function(){if(e)return e.bb}}}();w.b("computedContext",w.Ea);w.b("computedContext.getDependenciesCount",w.Ea.Ja);w.b("computedContext.isInitial",w.Ea.bb);
w.b("ignoreDependencies",w.vd=w.s.I);var L=w.a.dc("_latestValue");w.X=function(a){function b(){if(0<arguments.length)return b.Bb(b[L],arguments[0])&&(b.pa(),b[L]=arguments[0],b.oa()),this;w.s.uc(b);return b[L]}b[L]=a;w.a.ta||w.a.extend(b,w.S.fn);w.S.fn.Ab(b);w.a.hb(b,M);w.options.deferUpdates&&w.Ha.deferred(b,!0);return b};var M={equalityComparer:D,G:function(){return this[L]},oa:function(){this.notifySubscribers(this[L])},pa:function(){this.notifySubscribers(this[L],"beforeChange")}};
w.a.ta&&w.a.setPrototypeOf(M,w.S.fn);var N=w.X.xa="__ko_proto__";M[N]=w.X;w.Ya=function(a,b){return null===a||void 0===a||void 0===a[N]?!1:a[N]===b?!0:w.Ya(a[N],b)};w.P=function(a){return w.Ya(a,w.X)};w.Ka=function(a){return"function"==typeof a&&a[N]===w.X||"function"==typeof a&&a[N]===w.K&&a.ad?!0:!1};w.b("observable",w.X);w.b("isObservable",w.P);w.b("isWriteableObservable",w.Ka);w.b("isWritableObservable",w.Ka);w.b("observable.fn",M);w.O(M,"peek",M.G);w.O(M,"valueHasMutated",M.oa);
w.O(M,"valueWillMutate",M.pa);w.ua=function(a){a=a||[];if("object"!=typeof a||!("length"in a))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");a=w.X(a);w.a.hb(a,w.ua.fn);return a.extend({trackArrayChanges:!0})};
w.ua.fn={remove:function(a){for(var b=this.G(),d=[],e="function"!=typeof a||w.P(a)?function(b){return b===a}:a,f=0;f<b.length;f++){var h=b[f];e(h)&&(0===d.length&&this.pa(),d.push(h),b.splice(f,1),f--)}d.length&&this.oa();return d},removeAll:function(a){if(void 0===a){var b=this.G(),d=b.slice(0);this.pa();b.splice(0,b.length);this.oa();return d}return a?this.remove(function(b){return 0<=w.a.A(a,b)}):[]},destroy:function(a){var b=this.G(),d="function"!=typeof a||w.P(a)?function(b){return b===a}:a;
this.pa();for(var e=b.length-1;0<=e;e--)d(b[e])&&(b[e]._destroy=!0);this.oa()},destroyAll:function(a){return void 0===a?this.destroy(function(){return!0}):a?this.destroy(function(b){return 0<=w.a.A(a,b)}):[]},indexOf:function(a){var b=this();return w.a.A(b,a)},replace:function(a,b){var d=this.indexOf(a);0<=d&&(this.pa(),this.G()[d]=b,this.oa())}};w.a.ta&&w.a.setPrototypeOf(w.ua.fn,w.X.fn);
w.a.C("pop push reverse shift sort splice unshift".split(" "),function(a){w.ua.fn[a]=function(){var b=this.G();this.pa();this.ac(b,a,arguments);var d=b[a].apply(b,arguments);this.oa();return d===b?this:d}});w.a.C(["slice"],function(a){w.ua.fn[a]=function(){var b=this();return b[a].apply(b,arguments)}});w.b("observableArray",w.ua);
w.Ha.trackArrayChanges=function(a,b){function d(){if(!e){e=!0;var b=a.notifySubscribers;a.notifySubscribers=function(a,d){d&&"change"!==d||++g;return b.apply(this,arguments)};var d=[].concat(a.G()||[]);f=null;h=a.subscribe(function(b){b=[].concat(b||[]);if(a.Za("arrayChange")){var e;if(!f||1<g)f=w.a.rb(d,b,a.qb);e=f}d=b;f=null;g=0;e&&e.length&&a.notifySubscribers(e,"arrayChange")})}}a.qb={};b&&"object"==typeof b&&w.a.extend(a.qb,b);a.qb.sparse=!0;if(!a.ac){var e=!1,f=null,h,g=0,m=a.Ba,l=a.Sa;a.Ba=
function(b){m&&m.call(a,b);"arrayChange"===b&&d()};a.Sa=function(b){l&&l.call(a,b);"arrayChange"!==b||a.Za("arrayChange")||(h.o(),e=!1)};a.ac=function(a,b,d){function l(a,b,d){return m[m.length]={status:a,value:b,index:d}}if(e&&!g){var m=[],h=a.length,r=d.length,y=0;switch(b){case "push":y=h;case "unshift":for(b=0;b<r;b++)l("added",d[b],y+b);break;case "pop":y=h-1;case "shift":h&&l("deleted",a[y],y);break;case "splice":b=Math.min(Math.max(0,0>d[0]?h+d[0]:d[0]),h);for(var h=1===r?h:Math.min(b+(d[1]||
0),h),r=b+r-2,y=Math.max(h,r),A=[],B=[],F=2;b<y;++b,++F)b<h&&B.push(l("deleted",a[b],b)),b<r&&A.push(l("added",d[F],b));w.a.jc(B,A);break;default:return}f=m}}}};var O=w.a.dc("_state");
w.u=w.K=function(a,b,d){function e(){if(0<arguments.length){if("function"===typeof f)f.apply(h.yb,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");return this}w.s.uc(e);(h.ba||h.F&&e.$a())&&e.ja();return h.ca}"object"===typeof a?d=a:(d=d||{},a&&(d.read=a));if("function"!=typeof d.read)throw Error("Pass a function that returns the value of the ko.computed");var f=d.write,h={ca:void 0,
ba:!0,ab:!1,Mb:!1,aa:!1,fb:!1,F:!1,od:d.read,yb:b||d.owner,l:d.disposeWhenNodeIsRemoved||d.l||null,Fa:d.disposeWhen||d.Fa,vb:null,D:{},U:0,hc:null};e[O]=h;e.ad="function"===typeof f;w.a.ta||w.a.extend(e,w.S.fn);w.S.fn.Ab(e);w.a.hb(e,P);d.pure?(h.fb=!0,h.F=!0,w.a.extend(e,Q)):d.deferEvaluation&&w.a.extend(e,R);w.options.deferUpdates&&w.Ha.deferred(e,!0);h.l&&(h.Mb=!0,h.l.nodeType||(h.l=null));h.F||d.deferEvaluation||e.ja();h.l&&e.ka()&&w.a.N.ya(h.l,h.vb=function(){e.o()});return e};
function S(a,b){null!==b&&b.o&&b.o()}function T(a,b){var d=this.Nc,e=d[O];e.aa||(this.ub&&this.Wa[b]?(d.Vb(b,a,this.Wa[b]),this.Wa[b]=null,--this.ub):e.D[b]||d.Vb(b,a,e.F?{ra:a}:d.Ac(a)))}
var P={equalityComparer:D,Ja:function(){return this[O].U},Vb:function(a,b,d){if(this[O].fb&&b===this)throw Error("A 'pure' computed must not be called recursively");this[O].D[a]=d;d.Qa=this[O].U++;d.wa=b.Xa()},$a:function(){var a,b,d=this[O].D;for(a in d)if(d.hasOwnProperty(a)&&(b=d[a],b.ra.$c(b.wa)))return!0},hd:function(){this.Pa&&!this[O].ab&&this.Pa()},ka:function(){return this[O].ba||0<this[O].U},qd:function(){this.Sb||this.gc()},Ac:function(a){if(a.mb&&!this[O].l){var b=a.subscribe(this.hd,
this,"dirty"),d=a.subscribe(this.qd,this);return{ra:a,o:function(){b.o();d.o()}}}return a.subscribe(this.gc,this)},gc:function(){var a=this,b=a.throttleEvaluation;b&&0<=b?(clearTimeout(this[O].hc),this[O].hc=w.a.setTimeout(function(){a.ja(!0)},b)):a.Pa?a.Pa():a.ja(!0)},ja:function(a){var b=this[O],d=b.Fa;if(!b.ab&&!b.aa){if(b.l&&!w.a.wb(b.l)||d&&d()){if(!b.Mb){this.o();return}}else b.Mb=!1;b.ab=!0;try{this.Wc(a)}finally{b.ab=!1}b.U||this.o()}},Wc:function(a){var b=this[O],d=b.fb?void 0:!b.U,e={Nc:this,
Wa:b.D,ub:b.U};w.s.$b({Mc:e,pb:T,u:this,bb:d});b.D={};b.U=0;e=this.Vc(b,e);this.Bb(b.ca,e)&&(b.F||this.notifySubscribers(b.ca,"beforeChange"),b.ca=e,b.F?this.Fc():a&&this.notifySubscribers(b.ca));d&&this.notifySubscribers(b.ca,"awake")},Vc:function(a,b){try{var d=a.od;return a.yb?d.call(a.yb):d()}finally{w.s.end(),b.ub&&!a.F&&w.a.M(b.Wa,S),a.ba=!1}},G:function(){var a=this[O];(a.ba&&!a.U||a.F&&this.$a())&&this.ja();return a.ca},cb:function(a){w.S.fn.cb.call(this,a);this.Pa=function(){this.Qb(this[O].ca);
this[O].ba=!0;this.Rb(this)}},o:function(){var a=this[O];!a.F&&a.D&&w.a.M(a.D,function(a,d){d.o&&d.o()});a.l&&a.vb&&w.a.N.vc(a.l,a.vb);a.D=null;a.U=0;a.aa=!0;a.ba=!1;a.F=!1;a.l=null}},Q={Ba:function(a){var b=this,d=b[O];if(!d.aa&&d.F&&"change"==a){d.F=!1;if(d.ba||b.$a())d.D=null,d.U=0,d.ba=!0,b.ja();else{var e=[];w.a.M(d.D,function(a,b){e[b.Qa]=a});w.a.C(e,function(a,e){var g=d.D[a],m=b.Ac(g.ra);m.Qa=e;m.wa=g.wa;d.D[a]=m})}d.aa||b.notifySubscribers(d.ca,"awake")}},Sa:function(a){var b=this[O];b.aa||
"change"!=a||this.Za("change")||(w.a.M(b.D,function(a,e){e.o&&(b.D[a]={ra:e.ra,Qa:e.Qa,wa:e.wa},e.o())}),b.F=!0,this.notifySubscribers(void 0,"asleep"))},Xa:function(){var a=this[O];a.F&&(a.ba||this.$a())&&this.ja();return w.S.fn.Xa.call(this)}},R={Ba:function(a){"change"!=a&&"beforeChange"!=a||this.G()}};w.a.ta&&w.a.setPrototypeOf(P,w.S.fn);var U=w.X.xa;w.u[U]=w.X;P[U]=w.u;w.cd=function(a){return w.Ya(a,w.u)};w.dd=function(a){return w.Ya(a,w.u)&&a[O]&&a[O].fb};w.b("computed",w.u);
w.b("dependentObservable",w.u);w.b("isComputed",w.cd);w.b("isPureComputed",w.dd);w.b("computed.fn",P);w.O(P,"peek",P.G);w.O(P,"dispose",P.o);w.O(P,"isActive",P.ka);w.O(P,"getDependenciesCount",P.Ja);w.tc=function(a,b){if("function"===typeof a)return w.u(a,b,{pure:!0});a=w.a.extend({},a);a.pure=!0;return w.u(a,b)};w.b("pureComputed",w.tc);
(function(){function a(e,f,h){h=h||new d;e=f(e);if("object"!=typeof e||null===e||void 0===e||e instanceof RegExp||e instanceof Date||e instanceof String||e instanceof Number||e instanceof Boolean)return e;var g=e instanceof Array?[]:{};h.save(e,g);b(e,function(b){var d=f(e[b]);switch(typeof d){case "boolean":case "number":case "string":case "function":g[b]=d;break;case "object":case "undefined":var k=h.get(d);g[b]=void 0!==k?k:a(d,f,h)}});return g}function b(a,b){if(a instanceof Array){for(var d=
0;d<a.length;d++)b(d);"function"==typeof a.toJSON&&b("toJSON")}else for(d in a)b(d)}function d(){this.keys=[];this.values=[]}w.Cc=function(b){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return a(b,function(a){for(var b=0;w.P(a)&&10>b;b++)a=a();return a})};w.toJSON=function(a,b,d){a=w.Cc(a);return w.a.Lb(a,b,d)};d.prototype={constructor:d,save:function(a,b){var d=w.a.A(this.keys,a);0<=d?this.values[d]=b:(this.keys.push(a),this.values.push(b))},get:function(a){a=
w.a.A(this.keys,a);return 0<=a?this.values[a]:void 0}}})();w.b("toJS",w.Cc);w.b("toJSON",w.toJSON);
w.m={H:function(a){switch(w.a.J(a)){case "option":return!0===a.__ko__hasDomDataOptionValue__?w.a.g.get(a,w.f.options.Eb):7>=w.a.L?a.getAttributeNode("value")&&a.getAttributeNode("value").specified?a.value:a.text:a.value;case "select":return 0<=a.selectedIndex?w.m.H(a.options[a.selectedIndex]):void 0;default:return a.value}},qa:function(a,b,d){switch(w.a.J(a)){case "option":switch(typeof b){case "string":w.a.g.set(a,w.f.options.Eb,void 0);"__ko__hasDomDataOptionValue__"in a&&delete a.__ko__hasDomDataOptionValue__;
a.value=b;break;default:w.a.g.set(a,w.f.options.Eb,b),a.__ko__hasDomDataOptionValue__=!0,a.value="number"===typeof b?b:""}break;case "select":if(""===b||null===b)b=void 0;for(var e=-1,f=0,h=a.options.length,g;f<h;++f)if(g=w.m.H(a.options[f]),g==b||""==g&&void 0===b){e=f;break}if(d||0<=e||void 0===b&&1<a.size)a.selectedIndex=e;break;default:if(null===b||void 0===b)b="";a.value=b}}};w.b("selectExtensions",w.m);w.b("selectExtensions.readValue",w.m.H);w.b("selectExtensions.writeValue",w.m.qa);
w.j=function(){function a(a){a=w.a.jb(a);123===a.charCodeAt(0)&&(a=a.slice(1,-1));var b=[],d=a.match(e),p,g=[],n=0;if(d){d.push(",");for(var t=0,u;u=d[t];++t){var r=u.charCodeAt(0);if(44===r){if(0>=n){b.push(p&&g.length?{key:p,value:g.join("")}:{unknown:p||g.join("")});p=n=0;g=[];continue}}else if(58===r){if(!n&&!p&&1===g.length){p=g.pop();continue}}else 47===r&&t&&1<u.length?(r=d[t-1].match(f))&&!h[r[0]]&&(a=a.substr(a.indexOf(u)+1),d=a.match(e),d.push(","),t=-1,u="/"):40===r||123===r||91===r?++n:
41===r||125===r||93===r?--n:p||g.length||34!==r&&39!==r||(u=u.slice(1,-1));g.push(u)}}return b}var b=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,h={"in":1,"return":1,"typeof":1},g={};return{Ca:[],na:g,Fb:a,eb:function(e,l){function k(a,e){var l;if(!t){var m=w.getBindingHandler(a);if(m&&
m.preprocess&&!(e=m.preprocess(e,a,k)))return;if(m=g[a])l=e,0<=w.a.A(b,l)?l=!1:(m=l.match(d),l=null===m?!1:m[1]?"Object("+m[1]+")"+m[2]:l),m=l;m&&h.push("'"+a+"':function(_z){"+l+"=_z}")}n&&(e="function(){return "+e+" }");f.push("'"+a+"':"+e)}l=l||{};var f=[],h=[],n=l.valueAccessors,t=l.bindingParams,u="string"===typeof e?a(e):e;w.a.C(u,function(a){k(a.key||a.unknown,a.value)});h.length&&k("_ko_property_writers","{"+h.join(",")+" }");return f.join(",")},gd:function(a,b){for(var d=0;d<a.length;d++)if(a[d].key==
b)return!0;return!1},Oa:function(a,b,d,e,f){if(a&&w.P(a))!w.Ka(a)||f&&a.G()===e||a(e);else if((a=b.get("_ko_property_writers"))&&a[d])a[d](e)}}}();w.b("expressionRewriting",w.j);w.b("expressionRewriting.bindingRewriteValidators",w.j.Ca);w.b("expressionRewriting.parseObjectLiteral",w.j.Fb);w.b("expressionRewriting.preProcessBindings",w.j.eb);w.b("expressionRewriting._twoWayBindings",w.j.na);w.b("jsonExpressionRewriting",w.j);w.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",w.j.eb);
(function(){function a(a){return 8==a.nodeType&&h.test(f?a.text:a.nodeValue)}function b(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function d(d,e){for(var f=d,m=1,g=[];f=f.nextSibling;){if(b(f)&&(m--,0===m))return g;g.push(f);a(f)&&m++}if(!e)throw Error("Cannot find closing comment tag to match: "+d.nodeValue);return null}function e(a,b){var e=d(a,b);return e?0<e.length?e[e.length-1].nextSibling:a.nextSibling:null}var f=document&&"\x3c!--test--\x3e"===document.createComment("test").text,
h=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,g=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,m={ul:!0,ol:!0};w.h={ga:{},childNodes:function(b){return a(b)?d(b):b.childNodes},Ga:function(b){if(a(b)){b=w.h.childNodes(b);for(var d=0,e=b.length;d<e;d++)w.removeNode(b[d])}else w.a.xb(b)},ma:function(b,d){if(a(b)){w.h.Ga(b);for(var e=b.nextSibling,f=0,m=d.length;f<m;f++)e.parentNode.insertBefore(d[f],e)}else w.a.ma(b,d)},sc:function(b,d){a(b)?b.parentNode.insertBefore(d,b.nextSibling):
b.firstChild?b.insertBefore(d,b.firstChild):b.appendChild(d)},mc:function(b,d,e){e?a(b)?b.parentNode.insertBefore(d,e.nextSibling):e.nextSibling?b.insertBefore(d,e.nextSibling):b.appendChild(d):w.h.sc(b,d)},firstChild:function(d){return a(d)?!d.nextSibling||b(d.nextSibling)?null:d.nextSibling:d.firstChild},nextSibling:function(d){a(d)&&(d=e(d));return d.nextSibling&&b(d.nextSibling)?null:d.nextSibling},Zc:a,ud:function(a){return(a=(f?a.text:a.nodeValue).match(h))?a[1]:null},qc:function(d){if(m[w.a.J(d)]){var k=
d.firstChild;if(k){do if(1===k.nodeType){var f;f=k.firstChild;var g=null;if(f){do if(g)g.push(f);else if(a(f)){var h=e(f,!0);h?f=h:g=[f]}else b(f)&&(g=[f]);while(f=f.nextSibling)}if(f=g)for(g=k.nextSibling,h=0;h<f.length;h++)g?d.insertBefore(f[h],g):d.appendChild(f[h])}while(k=k.nextSibling)}}}}})();w.b("virtualElements",w.h);w.b("virtualElements.allowedBindings",w.h.ga);w.b("virtualElements.emptyNode",w.h.Ga);w.b("virtualElements.insertAfter",w.h.mc);w.b("virtualElements.prepend",w.h.sc);
w.b("virtualElements.setDomNodeChildren",w.h.ma);w.$=function(){this.Lc={}};
w.a.extend(w.$.prototype,{nodeHasBindings:function(a){switch(a.nodeType){case 1:return null!=a.getAttribute("data-bind")||w.i.getComponentNameForNode(a);case 8:return w.h.Zc(a);default:return!1}},getBindings:function(a,b){var d=this.getBindingsString(a,b),d=d?this.parseBindingsString(d,b,a):null;return w.i.Ub(d,a,b,!1)},getBindingAccessors:function(a,b){var d=this.getBindingsString(a,b),d=d?this.parseBindingsString(d,b,a,{valueAccessors:!0}):null;return w.i.Ub(d,a,b,!0)},getBindingsString:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind");
case 8:return w.h.ud(a);default:return null}},parseBindingsString:function(a,b,d,e){try{var f=this.Lc,h=a+(e&&e.valueAccessors||""),g;if(!(g=f[h])){var m,l="with($context){with($data||{}){return{"+w.j.eb(a,e)+"}}}";m=new Function("$context","$element",l);g=f[h]=m}return g(b,d)}catch(k){throw k.message="Unable to parse bindings.\nBindings value: "+a+"\nMessage: "+k.message,k;}}});w.$.instance=new w.$;w.b("bindingProvider",w.$);
(function(){function a(a){return function(){return a}}function b(a){return a()}function d(a){return w.a.Ma(w.s.I(a),function(b,d){return function(){return a()[d]}})}function e(b,e,f){return"function"===typeof b?d(b.bind(null,e,f)):w.a.Ma(b,a)}function f(a,b){return d(this.getBindings.bind(this,a,b))}function h(a,b,d){var e,f=w.h.firstChild(b),k=w.$.instance,l=k.preprocessNode;if(l){for(;e=f;)f=w.h.nextSibling(e),l.call(k,e);f=w.h.firstChild(b)}for(;e=f;)f=w.h.nextSibling(e),g(a,e,d)}function g(a,
b,d){var e=!0,f=1===b.nodeType;f&&w.h.qc(b);if(f&&d||w.$.instance.nodeHasBindings(b))e=l(b,null,a,d).shouldBindDescendants;e&&!p[w.a.J(b)]&&h(a,b,!f)}function m(a){var b=[],d={},e=[];w.a.M(a,function B(f){if(!d[f]){var k=w.getBindingHandler(f);k&&(k.after&&(e.push(f),w.a.C(k.after,function(b){if(a[b]){if(-1!==w.a.A(e,b))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));B(b)}}),e.length--),b.push({key:f,lc:k}));d[f]=!0}});return b}function l(a,
d,e,k){var l=w.a.g.get(a,q);if(!d){if(l)throw Error("You cannot apply bindings multiple times to the same element.");w.a.g.set(a,q,!0)}!l&&k&&w.zc(a,e);var g;if(d&&"function"!==typeof d)g=d;else{var h=w.$.instance,p=h.getBindingAccessors||f,n=w.K(function(){(g=d?d(e,a):p.call(h,a,e))&&e.Z&&e.Z();return g},null,{l:a});g&&n.ka()||(n=null)}var G;if(g){var H=function(){return w.a.Ma(n?n():g,b)},J=n?function(a){return function(){return b(n()[a])}}:function(a){return g[a]};H.get=function(a){return g[a]&&
b(J(a))};H.has=function(a){return a in g};k=m(g);w.a.C(k,function(b){var d=b.lc.init,f=b.lc.update,k=b.key;if(8===a.nodeType&&!w.h.ga[k])throw Error("The binding '"+k+"' cannot be used with virtual elements");try{"function"==typeof d&&w.s.I(function(){var b=d(a,J(k),H,e.$data,e);if(b&&b.controlsDescendantBindings){if(void 0!==G)throw Error("Multiple bindings ("+G+" and "+k+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
G=k}}),"function"==typeof f&&w.K(function(){f(a,J(k),H,e.$data,e)},null,{l:a})}catch(l){throw l.message='Unable to process binding "'+k+": "+g[k]+'"\nMessage: '+l.message,l;}})}return{shouldBindDescendants:void 0===G}}function k(a){return a&&a instanceof w.da?a:new w.da(a)}w.f={};var p={script:!0,textarea:!0,template:!0};w.getBindingHandler=function(a){return w.f[a]};w.da=function(a,b,d,e){var f=this,k="function"==typeof a&&!w.P(a),l,g=w.K(function(){var l=k?a():a,m=w.a.c(l);b?(b.Z&&b.Z(),w.a.extend(f,
b),g&&(f.Z=g)):(f.$parents=[],f.$root=m,f.ko=w);f.$rawData=l;f.$data=m;d&&(f[d]=m);e&&e(f,b,m);return f.$data},null,{Fa:function(){return l&&!w.a.Wb(l)},l:!0});g.ka()&&(f.Z=g,g.equalityComparer=null,l=[],g.Gc=function(a){l.push(a);w.a.N.ya(a,function(a){w.a.Va(l,a);l.length||(g.o(),f.Z=g=void 0)})})};w.da.prototype.createChildContext=function(a,b,d){return new w.da(a,this,b,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};
w.da.prototype.extend=function(a){return new w.da(this.Z||this.$data,this,null,function(b,d){b.$rawData=d.$rawData;w.a.extend(b,"function"==typeof a?a():a)})};var q=w.a.g.R(),n=w.a.g.R();w.zc=function(a,b){if(2==arguments.length)w.a.g.set(a,n,b),b.Z&&b.Z.Gc(a);else return w.a.g.get(a,n)};w.Ta=function(a,b,d){1===a.nodeType&&w.h.qc(a);return l(a,b,k(d),!0)};w.Jc=function(a,b,d){d=k(d);return w.Ta(a,e(b,d,a),d)};w.nb=function(a,b){1!==b.nodeType&&8!==b.nodeType||h(k(a),b,!0)};w.Xb=function(a,b){!c&&
window.jQuery&&(c=window.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||window.document.body;g(k(a),b,!0)};w.tb=function(a){switch(a.nodeType){case 1:case 8:var b=w.zc(a);if(b)return b;if(a.parentNode)return w.tb(a.parentNode)}};w.Pc=function(a){return(a=w.tb(a))?a.$data:void 0};w.b("bindingHandlers",w.f);w.b("applyBindings",w.Xb);w.b("applyBindingsToDescendants",w.nb);w.b("applyBindingAccessorsToNode",
w.Ta);w.b("applyBindingsToNode",w.Jc);w.b("contextFor",w.tb);w.b("dataFor",w.Pc)})();
(function(a){function b(b,e){var l=f.hasOwnProperty(b)?f[b]:a,k;l?l.subscribe(e):(l=f[b]=new w.S,l.subscribe(e),d(b,function(a,d){var e=!(!d||!d.synchronous);h[b]={definition:a,ed:e};delete f[b];k||e?l.notifySubscribers(a):w.fa.gb(function(){l.notifySubscribers(a)})}),k=!0)}function d(a,b){e("getConfig",[a],function(d){d?e("loadComponent",[a,d],function(a){b(a,d)}):b(null,null)})}function e(b,d,f,k){k||(k=w.i.loaders.slice(0));var h=k.shift();if(h){var q=h[b];if(q){var n=!1;if(q.apply(h,d.concat(function(a){n?
f(null):null!==a?f(a):e(b,d,f,k)}))!==a&&(n=!0,!h.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");}else e(b,d,f,k)}else f(null)}var f={},h={};w.i={get:function(d,e){var f=h.hasOwnProperty(d)?h[d]:a;f?f.ed?w.s.I(function(){e(f.definition)}):w.fa.gb(function(){e(f.definition)}):b(d,e)},cc:function(a){delete h[a]},Pb:e};w.i.loaders=[];w.b("components",w.i);w.b("components.get",w.i.get);w.b("components.clearCachedDefinition",
w.i.cc)})();
(function(){function a(a,b,d,e){function g(){0===--u&&e(h)}var h={},u=2,r=d.template;d=d.viewModel;r?f(b,r,function(b){w.i.Pb("loadTemplate",[a,b],function(a){h.template=a;g()})}):g();d?f(b,d,function(b){w.i.Pb("loadViewModel",[a,b],function(a){h[m]=a;g()})}):g()}function b(a,d,e){if("function"===typeof d)e(function(a){return new d(a)});else if("function"===typeof d[m])e(d[m]);else if("instance"in d){var f=d.instance;e(function(){return f})}else"viewModel"in d?b(a,d.viewModel,e):a("Unknown viewModel value: "+d)}
function d(a){switch(w.a.J(a)){case "script":return w.a.va(a.text);case "textarea":return w.a.va(a.value);case "template":if(e(a.content))return w.a.Da(a.content.childNodes)}return w.a.Da(a.childNodes)}function e(a){return window.DocumentFragment?a instanceof DocumentFragment:a&&11===a.nodeType}function f(a,b,d){"string"===typeof b.require?amdRequire||window.require?(amdRequire||window.require)([b.require],d):a("Uses require, but no AMD loader is present"):d(b)}function h(a){return function(b){throw Error("Component '"+
a+"': "+b);}}var g={};w.i.register=function(a,b){if(!b)throw Error("Invalid configuration for "+a);if(w.i.Cb(a))throw Error("Component "+a+" is already registered");g[a]=b};w.i.Cb=function(a){return g.hasOwnProperty(a)};w.i.unregister=function(a){delete g[a];w.i.cc(a)};w.i.ec={getConfig:function(a,b){b(g.hasOwnProperty(a)?g[a]:null)},loadComponent:function(b,d,e){var g=h(b);f(g,d,function(d){a(b,g,d,e)})},loadTemplate:function(a,b,f){a=h(a);if("string"===typeof b)f(w.a.va(b));else if(b instanceof
Array)f(b);else if(e(b))f(w.a.ea(b.childNodes));else if(b.element)if(b=b.element,window.HTMLElement?b instanceof HTMLElement:b&&b.tagName&&1===b.nodeType)f(d(b));else if("string"===typeof b){var g=document.getElementById(b);g?f(d(g)):a("Cannot find element with ID "+b)}else a("Unknown element type: "+b);else a("Unknown template value: "+b)},loadViewModel:function(a,d,e){b(h(a),d,e)}};var m="createViewModel";w.b("components.register",w.i.register);w.b("components.isRegistered",w.i.Cb);w.b("components.unregister",
w.i.unregister);w.b("components.defaultLoader",w.i.ec);w.i.loaders.push(w.i.ec);w.i.Hc=g})();
(function(){function a(a,e){var f=a.getAttribute("params");if(f){var f=b.parseBindingsString(f,e,a,{valueAccessors:!0,bindingParams:!0}),f=w.a.Ma(f,function(b){return w.u(b,null,{l:a})}),h=w.a.Ma(f,function(b){var e=b.G();return b.ka()?w.u({read:function(){return w.a.c(b())},write:w.Ka(e)&&function(a){b()(a)},l:a}):e});h.hasOwnProperty("$raw")||(h.$raw=f);return h}return{$raw:{}}}w.i.getComponentNameForNode=function(a){var b=w.a.J(a);if(w.i.Cb(b)&&(-1!=b.indexOf("-")||"[object HTMLUnknownElement]"==
""+a||8>=w.a.L&&a.tagName===b))return b};w.i.Ub=function(b,e,f,h){if(1===e.nodeType){var g=w.i.getComponentNameForNode(e);if(g){b=b||{};if(b.component)throw Error('Cannot use the "component" binding on a custom element matching a component');var m={name:g,params:a(e,f)};b.component=h?function(){return m}:m}}return b};var b=new w.$;9>w.a.L&&(w.i.register=function(a){return function(b){return a.apply(this,arguments)}}(w.i.register),document.createDocumentFragment=function(a){return function(){var b=
a(),f=w.i.Hc,h;for(h in f);return b}}(document.createDocumentFragment))})();
(function(a){function b(a,b,d){b=b.template;if(!b)throw Error("Component '"+a+"' has no template");a=w.a.Da(b);w.h.ma(d,a)}function d(a,b,d,e){var l=a.createViewModel;return l?l.call(a,e,{element:b,templateNodes:d}):e}var e=0;w.f.component={init:function(f,h,g,m,l){function k(){var a=p&&p.dispose;"function"===typeof a&&a.call(p);q=p=null}var p,q,n=w.a.ea(w.h.childNodes(f));w.a.N.ya(f,k);w.u(function(){var g=w.a.c(h()),m,r;"string"===typeof g?m=g:(m=w.a.c(g.name),r=w.a.c(g.params));if(!m)throw Error("No component name specified");
var y=q=++e;w.i.get(m,function(e){if(q===y){k();if(!e)throw Error("Unknown component '"+m+"'");b(m,e,f);var g=d(e,f,n,r);e=l.createChildContext(g,a,function(a){a.$component=g;a.$componentTemplateNodes=n});p=g;w.nb(e,f)}})},null,{l:f});return{controlsDescendantBindings:!0}}};w.h.ga.component=!0})();var V={"class":"className","for":"htmlFor"};
w.f.attr={update:function(a,b){var d=w.a.c(b())||{};w.a.M(d,function(b,d){d=w.a.c(d);var h=!1===d||null===d||void 0===d;h&&a.removeAttribute(b);8>=w.a.L&&b in V?(b=V[b],h?a.removeAttribute(b):a[b]=d):h||a.setAttribute(b,d.toString());"name"===b&&w.a.xc(a,h?"":d.toString())})}};
w.f.checked={after:["value","attr"],init:function(a,b,d){function e(){var e=a.checked,f=n?h():e;if(!w.Ea.bb()&&(!m||e)){var g=w.s.I(b);if(k){var l=p?g.G():g;q!==f?(e&&(w.a.za(l,f,!0),w.a.za(l,q,!1)),q=f):w.a.za(l,f,e);p&&w.Ka(g)&&g(l)}else w.j.Oa(g,d,"checked",f,!0)}}function f(){var d=w.a.c(b());k?a.checked=0<=w.a.A(d,h()):g?a.checked=d:a.checked=h()===d}var h=w.tc(function(){return d.has("checkedValue")?w.a.c(d.get("checkedValue")):d.has("value")?w.a.c(d.get("value")):a.value}),g="checkbox"==a.type,
m="radio"==a.type;if(g||m){var l=b(),k=g&&w.a.c(l)instanceof Array,p=!(k&&l.push&&l.splice),q=k?h():void 0,n=m||k;m&&!a.name&&w.f.uniqueName.init(a,function(){return!0});w.u(e,null,{l:a});w.a.B(a,"click",e);w.u(f,null,{l:a});l=void 0}}};w.j.na.checked=!0;w.f.checkedValue={update:function(a,b){a.value=w.a.c(b())}};
w.f.css={update:function(a,b){var d=w.a.c(b());null!==d&&"object"==typeof d?w.a.M(d,function(b,d){d=w.a.c(d);w.a.lb(a,b,d)}):(d=w.a.jb(String(d||"")),w.a.lb(a,a.__ko__cssValue,!1),a.__ko__cssValue=d,w.a.lb(a,d,!0))}};w.f.enable={update:function(a,b){var d=w.a.c(b());d&&a.disabled?a.removeAttribute("disabled"):d||a.disabled||(a.disabled=!0)}};w.f.disable={update:function(a,b){w.f.enable.update(a,function(){return!w.a.c(b())})}};
w.f.event={init:function(a,b,d,e,f){var h=b()||{};w.a.M(h,function(g){"string"==typeof g&&w.a.B(a,g,function(a){var h,k=b()[g];if(k){try{var p=w.a.ea(arguments);e=f.$data;p.unshift(e);h=k.apply(e,p)}finally{!0!==h&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}!1===d.get(g+"Bubble")&&(a.cancelBubble=!0,a.stopPropagation&&a.stopPropagation())}})})}};
w.f.foreach={oc:function(a){return function(){var b=a(),d=w.a.Gb(b);if(!d||"number"==typeof d.length)return{foreach:b,templateEngine:w.W.xa};w.a.c(b);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:w.W.xa}}},init:function(a,b){return w.f.template.init(a,w.f.foreach.oc(b))},update:function(a,b,d,e,f){return w.f.template.update(a,w.f.foreach.oc(b),
d,e,f)}};w.j.Ca.foreach=!1;w.h.ga.foreach=!0;
w.f.hasfocus={init:function(a,b,d){function e(e){a.__ko_hasfocusUpdating=!0;var f=a.ownerDocument;if("activeElement"in f){var h;try{h=f.activeElement}catch(k){h=f.body}e=h===a}f=b();w.j.Oa(f,d,"hasfocus",e,!0);a.__ko_hasfocusLastValue=e;a.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),h=e.bind(null,!1);w.a.B(a,"focus",f);w.a.B(a,"focusin",f);w.a.B(a,"blur",h);w.a.B(a,"focusout",h)},update:function(a,b){var d=!!w.a.c(b());a.__ko_hasfocusUpdating||a.__ko_hasfocusLastValue===d||(d?a.focus():a.blur(),
!d&&a.__ko_hasfocusLastValue&&a.ownerDocument.body.focus(),w.s.I(w.a.Na,null,[a,d?"focusin":"focusout"]))}};w.j.na.hasfocus=!0;w.f.hasFocus=w.f.hasfocus;w.j.na.hasFocus=!0;w.f.html={init:function(){return{controlsDescendantBindings:!0}},update:function(a,b){w.a.Jb(a,b())}};
function W(a,b,d,e){w.f[a]={init:function(a,h,g,m,l){var k,p;w.u(function(){var g=w.a.c(h()),m=!d!==!g,t=!p;if(t||b||m!==k)t&&w.Ea.Ja()&&(p=w.a.Da(w.h.childNodes(a),!0)),m?(t||w.h.ma(a,w.a.Da(p)),w.nb(e?e(l,g):l,a)):w.h.Ga(a),k=m},null,{l:a});return{controlsDescendantBindings:!0}}};w.j.Ca[a]=!1;w.h.ga[a]=!0}W("if");W("ifnot",!1,!0);W("with",!0,!1,function(a,b){return a.createChildContext(b)});var X={};
w.f.options={init:function(a){if("select"!==w.a.J(a))throw Error("options binding applies only to SELECT elements");for(;0<a.length;)a.remove(0);return{controlsDescendantBindings:!0}},update:function(a,b,d){function e(){return w.a.Ua(a.options,function(a){return a.selected})}function f(a,b,d){var e=typeof b;return"function"==e?b(a):"string"==e?a[b]:d}function h(b,e){if(t&&k)w.m.qa(a,w.a.c(d.get("value")),!0);else if(n.length){var f=0<=w.a.A(n,w.m.H(e[0]));w.a.yc(e[0],f);t&&!f&&w.s.I(w.a.Na,null,[a,
"change"])}}var g=a.multiple,m=0!=a.length&&g?a.scrollTop:null,l=w.a.c(b()),k=d.get("valueAllowUnset")&&d.has("value"),p=d.get("optionsIncludeDestroyed");b={};var q,n=[];k||(g?n=w.a.ob(e(),w.m.H):0<=a.selectedIndex&&n.push(w.m.H(a.options[a.selectedIndex])));l&&("undefined"==typeof l.length&&(l=[l]),q=w.a.Ua(l,function(a){return p||void 0===a||null===a||!w.a.c(a._destroy)}),d.has("optionsCaption")&&(l=w.a.c(d.get("optionsCaption")),null!==l&&void 0!==l&&q.unshift(X)));var t=!1;b.beforeRemove=function(b){a.removeChild(b)};
l=h;d.has("optionsAfterRender")&&"function"==typeof d.get("optionsAfterRender")&&(l=function(a,b){h(0,b);w.s.I(d.get("optionsAfterRender"),null,[b[0],a!==X?a:void 0])});w.a.Ib(a,q,function(b,e,g){g.length&&(n=!k&&g[0].selected?[w.m.H(g[0])]:[],t=!0);e=a.ownerDocument.createElement("option");b===X?(w.a.ib(e,d.get("optionsCaption")),w.m.qa(e,void 0)):(g=f(b,d.get("optionsValue"),b),w.m.qa(e,w.a.c(g)),b=f(b,d.get("optionsText"),g),w.a.ib(e,b));return[e]},b,l);w.s.I(function(){if(k)w.m.qa(a,w.a.c(d.get("value")),
!0);else{var b;g?b=n.length&&e().length<n.length:b=n.length&&0<=a.selectedIndex?w.m.H(a.options[a.selectedIndex])!==n[0]:n.length||0<=a.selectedIndex;b&&w.a.Na(a,"change")}});w.a.Tc(a);m&&20<Math.abs(m-a.scrollTop)&&(a.scrollTop=m)}};w.f.options.Eb=w.a.g.R();
w.f.selectedOptions={after:["options","foreach"],init:function(a,b,d){w.a.B(a,"change",function(){var e=b(),f=[];w.a.C(a.getElementsByTagName("option"),function(a){a.selected&&f.push(w.m.H(a))});w.j.Oa(e,d,"selectedOptions",f)})},update:function(a,b){if("select"!=w.a.J(a))throw Error("values binding applies only to SELECT elements");var d=w.a.c(b()),e=a.scrollTop;d&&"number"==typeof d.length&&w.a.C(a.getElementsByTagName("option"),function(a){var b=0<=w.a.A(d,w.m.H(a));a.selected!=b&&w.a.yc(a,b)});
a.scrollTop=e}};w.j.na.selectedOptions=!0;w.f.style={update:function(a,b){var d=w.a.c(b()||{});w.a.M(d,function(b,d){d=w.a.c(d);if(null===d||void 0===d||!1===d)d="";a.style[b]=d})}};w.f.submit={init:function(a,b,d,e,f){if("function"!=typeof b())throw Error("The value for a submit binding must be a function");w.a.B(a,"submit",function(d){var e,m=b();try{e=m.call(f.$data,a)}finally{!0!==e&&(d.preventDefault?d.preventDefault():d.returnValue=!1)}})}};
w.f.text={init:function(){return{controlsDescendantBindings:!0}},update:function(a,b){w.a.ib(a,b())}};w.h.ga.text=!0;
(function(){if(window&&window.navigator)var a=function(a){if(a)return parseFloat(a[1])},b=window.opera&&window.opera.version&&parseInt(window.opera.version()),d=window.navigator.userAgent,e=a(d.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),f=a(d.match(/Firefox\/([^ ]*)/));if(10>w.a.L)var h=w.a.g.R(),g=w.a.g.R(),m=function(a){var b=this.activeElement;(b=b&&w.a.g.get(b,g))&&b(a)},l=function(a,b){var d=a.ownerDocument;w.a.g.get(d,h)||(w.a.g.set(d,h,!0),w.a.B(d,"selectionchange",m));w.a.g.set(a,
g,b)};w.f.textInput={init:function(a,d,g){function h(b,d){w.a.B(a,b,d)}function m(){var b=w.a.c(d());if(null===b||void 0===b)b="";void 0!==B&&b===B?w.a.setTimeout(m,4):a.value!==b&&(y=b,a.value=b)}function u(){A||(B=a.value,A=w.a.setTimeout(r,4))}function r(){clearTimeout(A);B=A=void 0;var b=a.value;y!==b&&(y=b,w.j.Oa(d(),g,"textInput",b))}var y=a.value,A,B,F=9==w.a.L?u:r;10>w.a.L?(h("propertychange",function(a){"value"===a.propertyName&&F(a)}),8==w.a.L&&(h("keyup",r),h("keydown",r)),8<=w.a.L&&(l(a,
F),h("dragend",u))):(h("input",r),5>e&&"textarea"===w.a.J(a)?(h("keydown",u),h("paste",u),h("cut",u)):11>b?h("keydown",u):4>f&&(h("DOMAutoComplete",r),h("dragdrop",r),h("drop",r)));h("change",r);w.u(m,null,{l:a})}};w.j.na.textInput=!0;w.f.textinput={preprocess:function(a,b,d){d("textInput",a)}}})();w.f.uniqueName={init:function(a,b){if(b()){var d="ko_unique_"+ ++w.f.uniqueName.Oc;w.a.xc(a,d)}}};w.f.uniqueName.Oc=0;
w.f.value={after:["options","foreach"],init:function(a,b,d){if("input"!=a.tagName.toLowerCase()||"checkbox"!=a.type&&"radio"!=a.type){var e=["change"],f=d.get("valueUpdate"),h=!1,g=null;f&&("string"==typeof f&&(f=[f]),w.a.Aa(e,f),e=w.a.Zb(e));var m=function(){g=null;h=!1;var e=b(),f=w.m.H(a);w.j.Oa(e,d,"value",f)};!w.a.L||"input"!=a.tagName.toLowerCase()||"text"!=a.type||"off"==a.autocomplete||a.form&&"off"==a.form.autocomplete||-1!=w.a.A(e,"propertychange")||(w.a.B(a,"propertychange",function(){h=
!0}),w.a.B(a,"focus",function(){h=!1}),w.a.B(a,"blur",function(){h&&m()}));w.a.C(e,function(b){var d=m;w.a.sd(b,"after")&&(d=function(){g=w.m.H(a);w.a.setTimeout(m,0)},b=b.substring(5));w.a.B(a,b,d)});var l=function(){var e=w.a.c(b()),f=w.m.H(a);if(null!==g&&e===g)w.a.setTimeout(l,0);else if(e!==f)if("select"===w.a.J(a)){var h=d.get("valueAllowUnset"),f=function(){w.m.qa(a,e,h)};f();h||e===w.m.H(a)?w.a.setTimeout(f,0):w.s.I(w.a.Na,null,[a,"change"])}else w.m.qa(a,e)};w.u(l,null,{l:a})}else w.Ta(a,
{checkedValue:b})},update:function(){}};w.j.na.value=!0;w.f.visible={update:function(a,b){var d=w.a.c(b()),e="none"!=a.style.display;d&&!e?a.style.display="":!d&&e&&(a.style.display="none")}};(function(a){w.f[a]={init:function(b,d,e,f,h){return w.f.event.init.call(this,b,function(){var b={};b[a]=d();return b},e,f,h)}}})("click");w.Y=function(){};w.Y.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};
w.Y.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};w.Y.prototype.makeTemplateSource=function(a,b){if("string"==typeof a){b=b||document;var d=b.getElementById(a);if(!d)throw Error("Cannot find template with ID "+a);return new w.w.v(d)}if(1==a.nodeType||8==a.nodeType)return new w.w.ha(a);throw Error("Unknown template type: "+a);};
w.Y.prototype.renderTemplate=function(a,b,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,b,d,e)};w.Y.prototype.isTemplateRewritten=function(a,b){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,b).data("isRewritten")};w.Y.prototype.rewriteTemplate=function(a,b,d){a=this.makeTemplateSource(a,d);b=b(a.text());a.text(b);a.data("isRewritten",!0)};w.b("templateEngine",w.Y);
w.Nb=function(){function a(a,b,d,g){a=w.j.Fb(a);for(var m=w.j.Ca,l=0;l<a.length;l++){var k=a[l].key;if(m.hasOwnProperty(k)){var p=m[k];if("function"===typeof p){if(k=p(a[l].value))throw Error(k);}else if(!p)throw Error("This template engine does not support the '"+k+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+w.j.eb(a,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return g.createJavaScriptEvaluatorBlock(d)+b}var b=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,
d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Uc:function(a,b,d){b.isTemplateRewritten(a,d)||b.rewriteTemplate(a,function(a){return w.Nb.kd(a,b)},d)},kd:function(e,f){return e.replace(b,function(b,d,e,l,k){return a(k,d,e,f)}).replace(d,function(b,d){return a(d,"\x3c!-- ko --\x3e","#comment",f)})},Kc:function(a,b){return w.V.Db(function(d,g){var m=d.nextSibling;m&&m.nodeName.toLowerCase()===b&&w.Ta(m,a,g)})}}}();w.b("__tr_ambtns",w.Nb.Kc);
(function(){w.w={};w.w.v=function(a){if(this.v=a){var b=w.a.J(a);this.kb="script"===b?1:"textarea"===b?2:"template"==b&&a.content&&11===a.content.nodeType?3:4}};w.w.v.prototype.text=function(){var a=1===this.kb?"text":2===this.kb?"value":"innerHTML";if(0==arguments.length)return this.v[a];var b=arguments[0];"innerHTML"===a?w.a.Jb(this.v,b):this.v[a]=b};var a=w.a.g.R()+"_";w.w.v.prototype.data=function(b){if(1===arguments.length)return w.a.g.get(this.v,a+b);w.a.g.set(this.v,a+b,arguments[1])};var b=
w.a.g.R();w.w.v.prototype.nodes=function(){var a=this.v;if(0==arguments.length)return(w.a.g.get(a,b)||{}).sb||(3===this.kb?a.content:4===this.kb?a:void 0);w.a.g.set(a,b,{sb:arguments[0]})};w.w.ha=function(a){this.v=a};w.w.ha.prototype=new w.w.v;w.w.ha.prototype.constructor=w.w.ha;w.w.ha.prototype.text=function(){if(0==arguments.length){var a=w.a.g.get(this.v,b)||{};void 0===a.Ob&&a.sb&&(a.Ob=a.sb.innerHTML);return a.Ob}w.a.g.set(this.v,b,{Ob:arguments[0]})};w.b("templateSources",w.w);w.b("templateSources.domElement",
w.w.v);w.b("templateSources.anonymousTemplate",w.w.ha)})();
(function(){function a(a,b,d){var e;for(b=w.h.nextSibling(b);a&&(e=a)!==b;)a=w.h.nextSibling(e),d(e,a)}function b(b,d){if(b.length){var e=b[0],f=b[b.length-1],g=e.parentNode,h=w.$.instance,t=h.preprocessNode;if(t){a(e,f,function(a,b){var d=a.previousSibling,g=t.call(h,a);g&&(a===e&&(e=g[0]||b),a===f&&(f=g[g.length-1]||d))});b.length=0;if(!e)return;e===f?b.push(e):(b.push(e,f),w.a.Ia(b,g))}a(e,f,function(a){1!==a.nodeType&&8!==a.nodeType||w.Xb(d,a)});a(e,f,function(a){1!==a.nodeType&&8!==a.nodeType||
w.V.Ec(a,[d])});w.a.Ia(b,g)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(a,e,f,g,q){q=q||{};var n=(a&&d(a)||f||{}).ownerDocument,t=q.templateEngine||h;w.Nb.Uc(f,t,n);f=t.renderTemplate(f,g,q,n);if("number"!=typeof f.length||0<f.length&&"number"!=typeof f[0].nodeType)throw Error("Template engine must return an array of DOM nodes");n=!1;switch(e){case "replaceChildren":w.h.ma(a,f);n=!0;break;case "replaceNode":w.a.wc(a,f);n=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+
e);}n&&(b(f,g),q.afterRender&&w.s.I(q.afterRender,null,[f,g.$data]));return f}function f(a,b,d){return w.P(a)?a():"function"===typeof a?a(b,d):a}var h;w.Kb=function(a){if(void 0!=a&&!(a instanceof w.Y))throw Error("templateEngine must inherit from ko.templateEngine");h=a};w.Hb=function(a,b,g,p,q){g=g||{};if(void 0==(g.templateEngine||h))throw Error("Set a template engine before calling renderTemplate");q=q||"replaceChildren";if(p){var n=d(p);return w.K(function(){var h=b&&b instanceof w.da?b:new w.da(w.a.c(b)),
u=f(a,h.$data,h),h=e(p,q,u,h,g);"replaceNode"==q&&(p=h,n=d(p))},null,{Fa:function(){return!n||!w.a.wb(n)},l:n&&"replaceNode"==q?n.parentNode:n})}return w.V.Db(function(d){w.Hb(a,b,g,d,"replaceNode")})};w.pd=function(a,d,g,h,q){function n(a,d){b(d,u);g.afterRender&&g.afterRender(d,a);u=null}function t(b,d){u=q.createChildContext(b,g.as,function(a){a.$index=d});var h=f(a,b,u);return e(null,"ignoreTargetNode",h,u,g)}var u;return w.K(function(){var a=w.a.c(d)||[];"undefined"==typeof a.length&&(a=[a]);
a=w.a.Ua(a,function(a){return g.includeDestroyed||void 0===a||null===a||!w.a.c(a._destroy)});w.s.I(w.a.Ib,null,[h,a,t,g,n])},null,{l:h})};var g=w.a.g.R();w.f.template={init:function(a,b){var d=w.a.c(b());if("string"==typeof d||d.name)w.h.Ga(a);else{if("nodes"in d){if(d=d.nodes||[],w.P(d))throw Error('The "nodes" option must be a plain, non-observable array.');}else d=w.h.childNodes(a);d=w.a.pc(d);(new w.w.ha(a)).nodes(d)}return{controlsDescendantBindings:!0}},update:function(a,b,d,e,f){var h=b(),
t;b=w.a.c(h);d=!0;e=null;"string"==typeof b?b={}:(h=b.name,"if"in b&&(d=w.a.c(b["if"])),d&&"ifnot"in b&&(d=!w.a.c(b.ifnot)),t=w.a.c(b.data));"foreach"in b?e=w.pd(h||a,d&&b.foreach||[],b,a,f):d?(f="data"in b?f.createChildContext(t,b.as):f,e=w.Hb(h||a,f,b,a)):w.h.Ga(a);f=e;(t=w.a.g.get(a,g))&&"function"==typeof t.o&&t.o();w.a.g.set(a,g,f&&f.ka()?f:void 0)}};w.j.Ca.template=function(a){a=w.j.Fb(a);return 1==a.length&&a[0].unknown||w.j.gd(a,"name")?null:"This template engine does not support anonymous templates nested within its templates"};
w.h.ga.template=!0})();w.b("setTemplateEngine",w.Kb);w.b("renderTemplate",w.Hb);w.a.jc=function(a,b,d){if(a.length&&b.length){var e,f,h,g,m;for(e=f=0;(!d||e<d)&&(g=a[f]);++f){for(h=0;m=b[h];++h)if(g.value===m.value){g.moved=m.index;m.moved=g.index;b.splice(h,1);e=h=0;break}e+=h}}};
w.a.rb=function(){function a(a,d,e,f,h){var g=Math.min,m=Math.max,l=[],k,p=a.length,q,n=d.length,t=n-p||1,u=p+n+1,r,y,A;for(k=0;k<=p;k++)for(y=r,l.push(r=[]),A=g(n,k+t),q=m(0,k-1);q<=A;q++)r[q]=q?k?a[k-1]===d[q-1]?y[q-1]:g(y[q]||u,r[q-1]||u)+1:q+1:k+1;g=[];m=[];t=[];k=p;for(q=n;k||q;)n=l[k][q]-1,q&&n===l[k][q-1]?m.push(g[g.length]={status:e,value:d[--q],index:q}):k&&n===l[k-1][q]?t.push(g[g.length]={status:f,value:a[--k],index:k}):(--q,--k,h.sparse||g.push({status:"retained",value:d[q]}));w.a.jc(t,
m,!h.dontLimitMoves&&10*p);return g.reverse()}return function(b,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};b=b||[];d=d||[];return b.length<d.length?a(b,d,"added","deleted",e):a(d,b,"deleted","added",e)}}();w.b("utils.compareArrays",w.a.rb);
(function(){function a(a,b,d,g,m){var l=[],k=w.K(function(){var k=b(d,m,w.a.Ia(l,a))||[];0<l.length&&(w.a.wc(l,k),g&&w.s.I(g,null,[d,k,m]));l.length=0;w.a.Aa(l,k)},null,{l:a,Fa:function(){return!w.a.Wb(l)}});return{la:l,K:k.ka()?k:void 0}}var b=w.a.g.R(),d=w.a.g.R();w.a.Ib=function(e,f,h,g,m){function l(a,b){v=q[b];y!==b&&(F[a]=v);v.zb(y++);w.a.Ia(v.la,e);u.push(v);B.push(v)}function k(a,b){if(a)for(var d=0,e=b.length;d<e;d++)b[d]&&w.a.C(b[d].la,function(e){a(e,d,b[d].sa)})}f=f||[];g=g||{};var p=
void 0===w.a.g.get(e,b),q=w.a.g.get(e,b)||[],n=w.a.ob(q,function(a){return a.sa}),t=w.a.rb(n,f,g.dontLimitMoves),u=[],r=0,y=0,A=[],B=[];f=[];for(var F=[],n=[],v,z=0,G,H;G=t[z];z++)switch(H=G.moved,G.status){case "deleted":void 0===H&&(v=q[r],v.K&&(v.K.o(),v.K=void 0),w.a.Ia(v.la,e).length&&(g.beforeRemove&&(u.push(v),B.push(v),v.sa===d?v=null:f[z]=v),v&&A.push.apply(A,v.la)));r++;break;case "retained":l(z,r++);break;case "added":void 0!==H?l(z,H):(v={sa:G.value,zb:w.X(y++)},u.push(v),B.push(v),p||
(n[z]=v))}w.a.g.set(e,b,u);k(g.beforeMove,F);w.a.C(A,g.beforeRemove?w.ia:w.removeNode);for(var z=0,p=w.h.firstChild(e),J;v=B[z];z++){v.la||w.a.extend(v,a(e,h,v.sa,m,v.zb));for(r=0;t=v.la[r];p=t.nextSibling,J=t,r++)t!==p&&w.h.mc(e,t,J);!v.bd&&m&&(m(v.sa,v.la,v.zb),v.bd=!0)}k(g.beforeRemove,f);for(z=0;z<f.length;++z)f[z]&&(f[z].sa=d);k(g.afterMove,F);k(g.afterAdd,n)}})();w.b("utils.setDomNodeChildrenFromArrayMapping",w.a.Ib);w.W=function(){this.allowTemplateRewriting=!1};w.W.prototype=new w.Y;
w.W.prototype.constructor=w.W;w.W.prototype.renderTemplateSource=function(a,b,d,e){if(b=(9>w.a.L?0:a.nodes)?a.nodes():null)return w.a.ea(b.cloneNode(!0).childNodes);a=a.text();return w.a.va(a,e)};w.W.xa=new w.W;w.Kb(w.W.xa);w.b("nativeTemplateEngine",w.W);
(function(){w.La=function(){var a=this.fd=function(){if(!c||!c.tmpl)return 0;try{if(0<=c.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(d,e,f,h){h=h||document;f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var g=d.data("precompiled");g||(g=d.text()||"",g=c.template(null,"{{ko_with $item.koBindingContext}}"+g+"{{/ko_with}}"),d.data("precompiled",g));d=[e.$data];e=c.extend({koBindingContext:e},
f.templateOptions);e=c.tmpl(g,d,e);e.appendTo(h.createElement("div"));c.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){document.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(c.tmpl.tag.ko_code={open:"__.push($1 || '');"},c.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};w.La.prototype=new w.Y;w.La.prototype.constructor=w.La;var a=new w.La;0<a.fd&&w.Kb(a);w.b("jqueryTmplTemplateEngine",
w.La)})();})();


  if (typeof define === 'function' && define.amd) {
    amdRequire = require;
    define('knockout', [], function() { return koExports; });
    define(['knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(koExports);
  } else {
    root.fw = factory(koExports);
  }
}(this, function (ko) {
  var windowObject = window;

  window.require = typeof require !== 'undefined' ? require : undefined;
  window.define = typeof define !== 'undefined' ? define : undefined;

  return (function() {
    // define our own root object to supply to the modules as an attachment point
var root = {};

// supply our root for modules that directly check for the window object
var window = root;

// hide requirejs from the modules (AMD environment)
var define = undefined;

// hide node.js or browserified from the modules (CommonJS environment)
var module = undefined,
    exports = undefined,
    global = undefined;

    root.ko = ko;

    (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":123,"./_root":173}],2:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

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

},{"./_hashClear":131,"./_hashDelete":132,"./_hashGet":133,"./_hashHas":134,"./_hashSet":135}],3:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    baseLodash = require('./_baseLodash');

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

},{"./_baseCreate":34,"./_baseLodash":60}],4:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

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

},{"./_listCacheClear":150,"./_listCacheDelete":151,"./_listCacheGet":152,"./_listCacheHas":153,"./_listCacheSet":154}],5:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    baseLodash = require('./_baseLodash');

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

},{"./_baseCreate":34,"./_baseLodash":60}],6:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":123,"./_root":173}],7:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

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

},{"./_mapCacheClear":155,"./_mapCacheDelete":156,"./_mapCacheGet":157,"./_mapCacheHas":158,"./_mapCacheSet":159}],8:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":123,"./_root":173}],9:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":123,"./_root":173}],10:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

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

},{"./_MapCache":7,"./_setCacheAdd":174,"./_setCacheHas":175}],11:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

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

},{"./_ListCache":4,"./_stackClear":179,"./_stackDelete":180,"./_stackGet":181,"./_stackHas":182,"./_stackSet":183}],12:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":173}],13:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":173}],14:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":123,"./_root":173}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

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

},{"./_baseIndexOf":47}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isString = require('./isString');

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

},{"./_baseTimes":76,"./_isIndex":142,"./isArguments":217,"./isArray":218,"./isString":232}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
var eq = require('./eq');

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

},{"./eq":199}],29:[function(require,module,exports){
var eq = require('./eq');

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

},{"./eq":199}],30:[function(require,module,exports){
var eq = require('./eq');

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

},{"./eq":199}],31:[function(require,module,exports){
var eq = require('./eq');

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

},{"./eq":199}],32:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

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

},{"./_copyObject":96,"./keys":236}],33:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getAllKeys = require('./_getAllKeys'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    keys = require('./keys');

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

},{"./_Stack":11,"./_arrayEach":18,"./_assignValue":30,"./_baseAssign":32,"./_cloneBuffer":84,"./_copyArray":95,"./_copySymbols":97,"./_getAllKeys":116,"./_getTag":127,"./_initCloneArray":136,"./_initCloneByTag":137,"./_initCloneObject":138,"./_isHostObject":141,"./isArray":218,"./isBuffer":222,"./isObject":228,"./keys":236}],34:[function(require,module,exports){
var isObject = require('./isObject');

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

},{"./isObject":228}],35:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

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

},{"./_baseForOwn":41,"./_createBaseEach":101}],36:[function(require,module,exports){
var baseEach = require('./_baseEach');

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

},{"./_baseEach":35}],37:[function(require,module,exports){
var baseEach = require('./_baseEach');

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

},{"./_baseEach":35}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

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

},{"./_arrayPush":25,"./_isFlattenable":140}],40:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

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

},{"./_createBaseFor":102}],41:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

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

},{"./_baseFor":40,"./keys":236}],42:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

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

},{"./_castPath":82,"./_isKey":144,"./_toKey":185}],43:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

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

},{"./_arrayPush":25,"./isArray":218}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIsNaN = require('./_baseIsNaN');

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

},{"./_baseFindIndex":38,"./_baseIsNaN":53}],48:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

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

},{"./_SetCache":10,"./_arrayIncludes":21,"./_arrayIncludesWith":22,"./_arrayMap":24,"./_baseUnary":78,"./_cacheHas":80}],49:[function(require,module,exports){
var apply = require('./_apply'),
    castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    last = require('./last'),
    parent = require('./_parent'),
    toKey = require('./_toKey');

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

},{"./_apply":17,"./_castPath":82,"./_isKey":144,"./_parent":169,"./_toKey":185,"./last":238}],50:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

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

},{"./_baseIsEqualDeep":51,"./isObject":228,"./isObjectLike":229}],51:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isHostObject = require('./_isHostObject'),
    isTypedArray = require('./isTypedArray');

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

},{"./_Stack":11,"./_equalArrays":112,"./_equalByTag":113,"./_equalObjects":114,"./_getTag":127,"./_isHostObject":141,"./isArray":218,"./isTypedArray":234}],52:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

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

},{"./_Stack":11,"./_baseIsEqual":50}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

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

},{"./_isHostObject":141,"./_isMasked":147,"./_toSource":186,"./isFunction":224,"./isObject":228}],55:[function(require,module,exports){
var isObject = require('./isObject');

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

},{"./isObject":228}],56:[function(require,module,exports){
var isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

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

},{"./isLength":225,"./isObjectLike":229}],57:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

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

},{"./_baseMatches":62,"./_baseMatchesProperty":63,"./identity":211,"./isArray":218,"./property":250}],58:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

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

},{"./_isPrototype":148,"./_nativeKeys":165}],59:[function(require,module,exports){
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

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

},{"./_isPrototype":148,"./_nativeKeysIn":166,"./isObject":228}],60:[function(require,module,exports){
/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;

},{}],61:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

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

},{"./_baseEach":35,"./isArrayLike":219}],62:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

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

},{"./_baseIsMatch":52,"./_getMatchData":122,"./_matchesStrictComparable":161}],63:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

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

},{"./_baseIsEqual":50,"./_isKey":144,"./_isStrictComparable":149,"./_matchesStrictComparable":161,"./_toKey":185,"./get":207,"./hasIn":209}],64:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignMergeValue = require('./_assignMergeValue'),
    baseKeysIn = require('./_baseKeysIn'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isArray = require('./isArray'),
    isObject = require('./isObject'),
    isTypedArray = require('./isTypedArray');

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

},{"./_Stack":11,"./_arrayEach":18,"./_assignMergeValue":29,"./_baseKeysIn":59,"./_baseMergeDeep":65,"./isArray":218,"./isObject":228,"./isTypedArray":234}],65:[function(require,module,exports){
var assignMergeValue = require('./_assignMergeValue'),
    baseClone = require('./_baseClone'),
    copyArray = require('./_copyArray'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    toPlainObject = require('./toPlainObject');

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

},{"./_assignMergeValue":29,"./_baseClone":33,"./_copyArray":95,"./isArguments":217,"./isArray":218,"./isArrayLikeObject":220,"./isFunction":224,"./isObject":228,"./isPlainObject":230,"./isTypedArray":234,"./toPlainObject":261}],66:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    baseSortBy = require('./_baseSortBy'),
    baseUnary = require('./_baseUnary'),
    compareMultiple = require('./_compareMultiple'),
    identity = require('./identity');

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

},{"./_arrayMap":24,"./_baseIteratee":57,"./_baseMap":61,"./_baseSortBy":75,"./_baseUnary":78,"./_compareMultiple":92,"./identity":211}],67:[function(require,module,exports){
var basePickBy = require('./_basePickBy');

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

},{"./_basePickBy":68}],68:[function(require,module,exports){
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

},{}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
var baseGet = require('./_baseGet');

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

},{"./_baseGet":42}],71:[function(require,module,exports){
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

},{}],72:[function(require,module,exports){
var apply = require('./_apply');

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

},{"./_apply":17}],73:[function(require,module,exports){
var identity = require('./identity'),
    metaMap = require('./_metaMap');

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

},{"./_metaMap":163,"./identity":211}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

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

},{"./_Symbol":12,"./isSymbol":233}],78:[function(require,module,exports){
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

},{}],79:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

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

},{"./_arrayMap":24}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

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

},{"./isArrayLikeObject":220}],82:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

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

},{"./_stringToPath":184,"./isArray":218}],83:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

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

},{"./_Uint8Array":13}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

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

},{"./_cloneArrayBuffer":83}],86:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

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

},{"./_addMapEntry":15,"./_arrayReduce":26,"./_mapToArray":160}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

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

},{"./_addSetEntry":16,"./_arrayReduce":26,"./_setToArray":177}],89:[function(require,module,exports){
var Symbol = require('./_Symbol');

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

},{"./_Symbol":12}],90:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

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

},{"./_cloneArrayBuffer":83}],91:[function(require,module,exports){
var isSymbol = require('./isSymbol');

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

},{"./isSymbol":233}],92:[function(require,module,exports){
var compareAscending = require('./_compareAscending');

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

},{"./_compareAscending":91}],93:[function(require,module,exports){
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

},{}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
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

},{}],96:[function(require,module,exports){
var assignValue = require('./_assignValue');

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

},{"./_assignValue":30}],97:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

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

},{"./_copyObject":96,"./_getSymbols":125}],98:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":173}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
var baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

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

},{"./_baseRest":72,"./_isIterateeCall":143}],101:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

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

},{"./isArrayLike":219}],102:[function(require,module,exports){
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

},{}],103:[function(require,module,exports){
var createCtor = require('./_createCtor'),
    root = require('./_root');

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

},{"./_createCtor":104,"./_root":173}],104:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    isObject = require('./isObject');

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

},{"./_baseCreate":34,"./isObject":228}],105:[function(require,module,exports){
var apply = require('./_apply'),
    createCtor = require('./_createCtor'),
    createHybrid = require('./_createHybrid'),
    createRecurry = require('./_createRecurry'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders'),
    root = require('./_root');

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

},{"./_apply":17,"./_createCtor":104,"./_createHybrid":107,"./_createRecurry":109,"./_getHolder":120,"./_replaceHolders":172,"./_root":173}],106:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

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

},{"./_baseIteratee":57,"./isArrayLike":219,"./keys":236}],107:[function(require,module,exports){
var composeArgs = require('./_composeArgs'),
    composeArgsRight = require('./_composeArgsRight'),
    countHolders = require('./_countHolders'),
    createCtor = require('./_createCtor'),
    createRecurry = require('./_createRecurry'),
    getHolder = require('./_getHolder'),
    reorder = require('./_reorder'),
    replaceHolders = require('./_replaceHolders'),
    root = require('./_root');

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

},{"./_composeArgs":93,"./_composeArgsRight":94,"./_countHolders":99,"./_createCtor":104,"./_createRecurry":109,"./_getHolder":120,"./_reorder":171,"./_replaceHolders":172,"./_root":173}],108:[function(require,module,exports){
var apply = require('./_apply'),
    createCtor = require('./_createCtor'),
    root = require('./_root');

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

},{"./_apply":17,"./_createCtor":104,"./_root":173}],109:[function(require,module,exports){
var isLaziable = require('./_isLaziable'),
    setData = require('./_setData'),
    setWrapToString = require('./_setWrapToString');

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

},{"./_isLaziable":146,"./_setData":176,"./_setWrapToString":178}],110:[function(require,module,exports){
var baseSetData = require('./_baseSetData'),
    createBind = require('./_createBind'),
    createCurry = require('./_createCurry'),
    createHybrid = require('./_createHybrid'),
    createPartial = require('./_createPartial'),
    getData = require('./_getData'),
    mergeData = require('./_mergeData'),
    setData = require('./_setData'),
    setWrapToString = require('./_setWrapToString'),
    toInteger = require('./toInteger');

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

},{"./_baseSetData":73,"./_createBind":103,"./_createCurry":105,"./_createHybrid":107,"./_createPartial":108,"./_getData":118,"./_mergeData":162,"./_setData":176,"./_setWrapToString":178,"./toInteger":259}],111:[function(require,module,exports){
var getNative = require('./_getNative');

/* Used to set `toString` methods. */
var defineProperty = (function() {
  var func = getNative(Object, 'defineProperty'),
      name = getNative.name;

  return (name && name.length > 2) ? func : undefined;
}());

module.exports = defineProperty;

},{"./_getNative":123}],112:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome');

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

},{"./_SetCache":10,"./_arraySome":27}],113:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

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

},{"./_Symbol":12,"./_Uint8Array":13,"./_equalArrays":112,"./_mapToArray":160,"./_setToArray":177,"./eq":199}],114:[function(require,module,exports){
var keys = require('./keys');

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

},{"./keys":236}],115:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],116:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

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

},{"./_baseGetAllKeys":43,"./_getSymbols":125,"./keys":236}],117:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

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

},{"./_baseGetAllKeys":43,"./_getSymbolsIn":126,"./keysIn":237}],118:[function(require,module,exports){
var metaMap = require('./_metaMap'),
    noop = require('./noop');

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

},{"./_metaMap":163,"./noop":243}],119:[function(require,module,exports){
var realNames = require('./_realNames');

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

},{"./_realNames":170}],120:[function(require,module,exports){
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

},{}],121:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

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

},{"./_isKeyable":145}],122:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

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

},{"./_isStrictComparable":149,"./keys":236}],123:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

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

},{"./_baseIsNative":54,"./_getValue":128}],124:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":168}],125:[function(require,module,exports){
var overArg = require('./_overArg'),
    stubArray = require('./stubArray');

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

},{"./_overArg":168,"./stubArray":255}],126:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

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

},{"./_arrayPush":25,"./_getPrototype":124,"./_getSymbols":125,"./stubArray":255}],127:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

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

},{"./_DataView":1,"./_Map":6,"./_Promise":8,"./_Set":9,"./_WeakMap":14,"./_baseGetTag":44,"./_toSource":186}],128:[function(require,module,exports){
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

},{}],129:[function(require,module,exports){
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

},{}],130:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    isString = require('./isString'),
    toKey = require('./_toKey');

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

},{"./_castPath":82,"./_isIndex":142,"./_isKey":144,"./_toKey":185,"./isArguments":217,"./isArray":218,"./isLength":225,"./isString":232}],131:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

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

},{"./_nativeCreate":164}],132:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

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

},{"./_nativeCreate":164}],134:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

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

},{"./_nativeCreate":164}],135:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

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

},{"./_nativeCreate":164}],136:[function(require,module,exports){
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

},{}],137:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

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

},{"./_cloneArrayBuffer":83,"./_cloneDataView":85,"./_cloneMap":86,"./_cloneRegExp":87,"./_cloneSet":88,"./_cloneSymbol":89,"./_cloneTypedArray":90}],138:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

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

},{"./_baseCreate":34,"./_getPrototype":124,"./_isPrototype":148}],139:[function(require,module,exports){
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

},{}],140:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray');

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

},{"./_Symbol":12,"./isArguments":217,"./isArray":218}],141:[function(require,module,exports){
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

},{}],142:[function(require,module,exports){
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

},{}],143:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

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

},{"./_isIndex":142,"./eq":199,"./isArrayLike":219,"./isObject":228}],144:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

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

},{"./isArray":218,"./isSymbol":233}],145:[function(require,module,exports){
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

},{}],146:[function(require,module,exports){
var LazyWrapper = require('./_LazyWrapper'),
    getData = require('./_getData'),
    getFuncName = require('./_getFuncName'),
    lodash = require('./wrapperLodash');

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

},{"./_LazyWrapper":3,"./_getData":118,"./_getFuncName":119,"./wrapperLodash":265}],147:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

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

},{"./_coreJsData":98}],148:[function(require,module,exports){
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

},{}],149:[function(require,module,exports){
var isObject = require('./isObject');

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

},{"./isObject":228}],150:[function(require,module,exports){
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

},{}],151:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

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

},{"./_assocIndexOf":31}],152:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

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

},{"./_assocIndexOf":31}],153:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

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

},{"./_assocIndexOf":31}],154:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

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

},{"./_assocIndexOf":31}],155:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

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

},{"./_Hash":2,"./_ListCache":4,"./_Map":6}],156:[function(require,module,exports){
var getMapData = require('./_getMapData');

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

},{"./_getMapData":121}],157:[function(require,module,exports){
var getMapData = require('./_getMapData');

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

},{"./_getMapData":121}],158:[function(require,module,exports){
var getMapData = require('./_getMapData');

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

},{"./_getMapData":121}],159:[function(require,module,exports){
var getMapData = require('./_getMapData');

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

},{"./_getMapData":121}],160:[function(require,module,exports){
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

},{}],161:[function(require,module,exports){
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

},{}],162:[function(require,module,exports){
var composeArgs = require('./_composeArgs'),
    composeArgsRight = require('./_composeArgsRight'),
    replaceHolders = require('./_replaceHolders');

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

},{"./_composeArgs":93,"./_composeArgsRight":94,"./_replaceHolders":172}],163:[function(require,module,exports){
var WeakMap = require('./_WeakMap');

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;

},{"./_WeakMap":14}],164:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":123}],165:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":168}],166:[function(require,module,exports){
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

},{}],167:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

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

},{"./_freeGlobal":115}],168:[function(require,module,exports){
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

},{}],169:[function(require,module,exports){
var baseGet = require('./_baseGet'),
    baseSlice = require('./_baseSlice');

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

},{"./_baseGet":42,"./_baseSlice":74}],170:[function(require,module,exports){
/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;

},{}],171:[function(require,module,exports){
var copyArray = require('./_copyArray'),
    isIndex = require('./_isIndex');

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

},{"./_copyArray":95,"./_isIndex":142}],172:[function(require,module,exports){
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

},{}],173:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":115}],174:[function(require,module,exports){
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

},{}],175:[function(require,module,exports){
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

},{}],176:[function(require,module,exports){
var baseSetData = require('./_baseSetData'),
    now = require('./now');

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

},{"./_baseSetData":73,"./now":244}],177:[function(require,module,exports){
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

},{}],178:[function(require,module,exports){
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    getWrapDetails = require('./_getWrapDetails'),
    identity = require('./identity'),
    insertWrapDetails = require('./_insertWrapDetails'),
    updateWrapDetails = require('./_updateWrapDetails');

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

},{"./_defineProperty":111,"./_getWrapDetails":129,"./_insertWrapDetails":139,"./_updateWrapDetails":187,"./constant":195,"./identity":211}],179:[function(require,module,exports){
var ListCache = require('./_ListCache');

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

},{"./_ListCache":4}],180:[function(require,module,exports){
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

},{}],181:[function(require,module,exports){
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

},{}],182:[function(require,module,exports){
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

},{}],183:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

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

},{"./_ListCache":4,"./_Map":6,"./_MapCache":7}],184:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

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

},{"./memoize":240,"./toString":262}],185:[function(require,module,exports){
var isSymbol = require('./isSymbol');

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

},{"./isSymbol":233}],186:[function(require,module,exports){
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

},{}],187:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    arrayIncludes = require('./_arrayIncludes');

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

},{"./_arrayEach":18,"./_arrayIncludes":21}],188:[function(require,module,exports){
var LazyWrapper = require('./_LazyWrapper'),
    LodashWrapper = require('./_LodashWrapper'),
    copyArray = require('./_copyArray');

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

},{"./_LazyWrapper":3,"./_LodashWrapper":5,"./_copyArray":95}],189:[function(require,module,exports){
var toInteger = require('./toInteger');

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

},{"./toInteger":259}],190:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

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

},{"./_copyObject":96,"./_createAssigner":100,"./keysIn":237}],191:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

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

},{"./_copyObject":96,"./_createAssigner":100,"./keysIn":237}],192:[function(require,module,exports){
var toInteger = require('./toInteger');

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

},{"./toInteger":259}],193:[function(require,module,exports){
var baseRest = require('./_baseRest'),
    createWrap = require('./_createWrap'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders');

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

},{"./_baseRest":72,"./_createWrap":110,"./_getHolder":120,"./_replaceHolders":172}],194:[function(require,module,exports){
var baseClone = require('./_baseClone');

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

},{"./_baseClone":33}],195:[function(require,module,exports){
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

},{}],196:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

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

},{"./isObject":228,"./now":244,"./toNumber":260}],197:[function(require,module,exports){
var apply = require('./_apply'),
    assignInDefaults = require('./_assignInDefaults'),
    assignInWith = require('./assignInWith'),
    baseRest = require('./_baseRest');

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

},{"./_apply":17,"./_assignInDefaults":28,"./_baseRest":72,"./assignInWith":191}],198:[function(require,module,exports){
module.exports = require('./forEach');

},{"./forEach":206}],199:[function(require,module,exports){
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

},{}],200:[function(require,module,exports){
var arrayEvery = require('./_arrayEvery'),
    baseEvery = require('./_baseEvery'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray'),
    isIterateeCall = require('./_isIterateeCall');

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

},{"./_arrayEvery":19,"./_baseEvery":36,"./_baseIteratee":57,"./_isIterateeCall":143,"./isArray":218}],201:[function(require,module,exports){
module.exports = require('./assignIn');

},{"./assignIn":190}],202:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

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

},{"./_arrayFilter":20,"./_baseFilter":37,"./_baseIteratee":57,"./isArray":218}],203:[function(require,module,exports){
var createFind = require('./_createFind'),
    findIndex = require('./findIndex');

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

},{"./_createFind":106,"./findIndex":204}],204:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

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

},{"./_baseFindIndex":38,"./_baseIteratee":57,"./toInteger":259}],205:[function(require,module,exports){
module.exports = require('./head');

},{"./head":210}],206:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

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

},{"./_arrayEach":18,"./_baseEach":35,"./_baseIteratee":57,"./isArray":218}],207:[function(require,module,exports){
var baseGet = require('./_baseGet');

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

},{"./_baseGet":42}],208:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

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

},{"./_baseHas":45,"./_hasPath":130}],209:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

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

},{"./_baseHasIn":46,"./_hasPath":130}],210:[function(require,module,exports){
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

},{}],211:[function(require,module,exports){
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

},{}],212:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

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

},{"./_baseIndexOf":47,"./isArrayLike":219,"./isString":232,"./toInteger":259,"./values":264}],213:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    toInteger = require('./toInteger');

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

},{"./_baseIndexOf":47,"./toInteger":259}],214:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIntersection = require('./_baseIntersection'),
    baseRest = require('./_baseRest'),
    castArrayLikeObject = require('./_castArrayLikeObject');

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

},{"./_arrayMap":24,"./_baseIntersection":48,"./_baseRest":72,"./_castArrayLikeObject":81}],215:[function(require,module,exports){
var baseInvoke = require('./_baseInvoke'),
    baseRest = require('./_baseRest');

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

},{"./_baseInvoke":49,"./_baseRest":72}],216:[function(require,module,exports){
var apply = require('./_apply'),
    baseEach = require('./_baseEach'),
    baseInvoke = require('./_baseInvoke'),
    baseRest = require('./_baseRest'),
    isArrayLike = require('./isArrayLike'),
    isKey = require('./_isKey');

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

},{"./_apply":17,"./_baseEach":35,"./_baseInvoke":49,"./_baseRest":72,"./_isKey":144,"./isArrayLike":219}],217:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

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

},{"./isArrayLikeObject":220}],218:[function(require,module,exports){
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

},{}],219:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

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

},{"./isFunction":224,"./isLength":225}],220:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

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

},{"./isArrayLike":219,"./isObjectLike":229}],221:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

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

},{"./isObjectLike":229}],222:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

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

},{"./_root":173,"./stubFalse":256}],223:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual');

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

},{"./_baseIsEqual":50}],224:[function(require,module,exports){
var isObject = require('./isObject');

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

},{"./isObject":228}],225:[function(require,module,exports){
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

},{}],226:[function(require,module,exports){
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

},{}],227:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

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

},{"./isObjectLike":229}],228:[function(require,module,exports){
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

},{}],229:[function(require,module,exports){
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

},{}],230:[function(require,module,exports){
var getPrototype = require('./_getPrototype'),
    isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

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

},{"./_getPrototype":124,"./_isHostObject":141,"./isObjectLike":229}],231:[function(require,module,exports){
var baseIsRegExp = require('./_baseIsRegExp'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

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

},{"./_baseIsRegExp":55,"./_baseUnary":78,"./_nodeUtil":167}],232:[function(require,module,exports){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

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

},{"./isArray":218,"./isObjectLike":229}],233:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

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

},{"./isObjectLike":229}],234:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

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

},{"./_baseIsTypedArray":56,"./_baseUnary":78,"./_nodeUtil":167}],235:[function(require,module,exports){
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

},{}],236:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

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

},{"./_arrayLikeKeys":23,"./_baseKeys":58,"./isArrayLike":219}],237:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

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

},{"./_arrayLikeKeys":23,"./_baseKeysIn":59,"./isArrayLike":219}],238:[function(require,module,exports){
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

},{}],239:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

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

},{"./_arrayMap":24,"./_baseIteratee":57,"./_baseMap":61,"./isArray":218}],240:[function(require,module,exports){
var MapCache = require('./_MapCache');

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

},{"./_MapCache":7}],241:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

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

},{"./_baseMerge":64,"./_createAssigner":100}],242:[function(require,module,exports){
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

},{}],243:[function(require,module,exports){
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

},{}],244:[function(require,module,exports){
var root = require('./_root');

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

},{"./_root":173}],245:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    negate = require('./negate'),
    pickBy = require('./pickBy');

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

},{"./_baseIteratee":57,"./negate":242,"./pickBy":249}],246:[function(require,module,exports){
var before = require('./before');

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

},{"./before":192}],247:[function(require,module,exports){
var baseRest = require('./_baseRest'),
    createWrap = require('./_createWrap'),
    getHolder = require('./_getHolder'),
    replaceHolders = require('./_replaceHolders');

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

},{"./_baseRest":72,"./_createWrap":110,"./_getHolder":120,"./_replaceHolders":172}],248:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseFlatten = require('./_baseFlatten'),
    basePick = require('./_basePick'),
    baseRest = require('./_baseRest'),
    toKey = require('./_toKey');

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

},{"./_arrayMap":24,"./_baseFlatten":39,"./_basePick":67,"./_baseRest":72,"./_toKey":185}],249:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    basePickBy = require('./_basePickBy'),
    getAllKeysIn = require('./_getAllKeysIn');

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

},{"./_baseIteratee":57,"./_basePickBy":68,"./_getAllKeysIn":117}],250:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

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

},{"./_baseProperty":69,"./_basePropertyDeep":70,"./_isKey":144,"./_toKey":185}],251:[function(require,module,exports){
var arrayReduce = require('./_arrayReduce'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    baseReduce = require('./_baseReduce'),
    isArray = require('./isArray');

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

},{"./_arrayReduce":26,"./_baseEach":35,"./_baseIteratee":57,"./_baseReduce":71,"./isArray":218}],252:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray'),
    negate = require('./negate');

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

},{"./_arrayFilter":20,"./_baseFilter":37,"./_baseIteratee":57,"./isArray":218,"./negate":242}],253:[function(require,module,exports){
var castPath = require('./_castPath'),
    isFunction = require('./isFunction'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

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

},{"./_castPath":82,"./_isKey":144,"./_toKey":185,"./isFunction":224}],254:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    baseOrderBy = require('./_baseOrderBy'),
    baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

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

},{"./_baseFlatten":39,"./_baseOrderBy":66,"./_baseRest":72,"./_isIterateeCall":143}],255:[function(require,module,exports){
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

},{}],256:[function(require,module,exports){
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

},{}],257:[function(require,module,exports){
var debounce = require('./debounce'),
    isObject = require('./isObject');

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

},{"./debounce":196,"./isObject":228}],258:[function(require,module,exports){
var toNumber = require('./toNumber');

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

},{"./toNumber":260}],259:[function(require,module,exports){
var toFinite = require('./toFinite');

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

},{"./toFinite":258}],260:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

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

},{"./isFunction":224,"./isObject":228,"./isSymbol":233}],261:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

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

},{"./_copyObject":96,"./keysIn":237}],262:[function(require,module,exports){
var baseToString = require('./_baseToString');

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

},{"./_baseToString":77}],263:[function(require,module,exports){
var toString = require('./toString');

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

},{"./toString":262}],264:[function(require,module,exports){
var baseValues = require('./_baseValues'),
    keys = require('./keys');

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

},{"./_baseValues":79,"./keys":236}],265:[function(require,module,exports){
var LazyWrapper = require('./_LazyWrapper'),
    LodashWrapper = require('./_LodashWrapper'),
    baseLodash = require('./_baseLodash'),
    isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike'),
    wrapperClone = require('./_wrapperClone');

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

},{"./_LazyWrapper":3,"./_LodashWrapper":5,"./_baseLodash":60,"./_wrapperClone":188,"./isArray":218,"./isObjectLike":229}],266:[function(require,module,exports){
/**
 * This is for creating a custom build of lodash which only includes the dependencies that footwork needs
 */
root._ = {
  isFunction: require('../../../node_modules/lodash/isFunction'),
  isObject: require('../../../node_modules/lodash/isObject'),
  isString: require('../../../node_modules/lodash/isString'),
  isBoolean: require('../../../node_modules/lodash/isBoolean'),
  isNumber: require('../../../node_modules/lodash/isNumber'),
  isUndefined: require('../../../node_modules/lodash/isUndefined'),
  isArray: require('../../../node_modules/lodash/isArray'),
  isNull: require('../../../node_modules/lodash/isNull'),
  extend: require('../../../node_modules/lodash/extend'),
  pick: require('../../../node_modules/lodash/pick'),
  each: require('../../../node_modules/lodash/each'),
  filter: require('../../../node_modules/lodash/filter'),
  bind: require('../../../node_modules/lodash/bind'),
  invoke: require('../../../node_modules/lodash/invoke'),
  invokeMap: require('../../../node_modules/lodash/invokeMap'),
  clone: require('../../../node_modules/lodash/clone'),
  reduce: require('../../../node_modules/lodash/reduce'),
  has: require('../../../node_modules/lodash/has'),
  result: require('../../../node_modules/lodash/result'),
  uniqueId: require('../../../node_modules/lodash/uniqueId'),
  map: require('../../../node_modules/lodash/map'),
  find: require('../../../node_modules/lodash/find'),
  omitBy: require('../../../node_modules/lodash/omitBy'),
  indexOf: require('../../../node_modules/lodash/indexOf'),
  first: require('../../../node_modules/lodash/first'),
  values: require('../../../node_modules/lodash/values'),
  reject: require('../../../node_modules/lodash/reject'),
  once: require('../../../node_modules/lodash/once'),
  last: require('../../../node_modules/lodash/last'),
  isEqual: require('../../../node_modules/lodash/isEqual'),
  defaults: require('../../../node_modules/lodash/defaults'),
  noop: require('../../../node_modules/lodash/noop'),
  keys: require('../../../node_modules/lodash/keys'),
  merge: require('../../../node_modules/lodash/merge'),
  after: require('../../../node_modules/lodash/after'),
  debounce: require('../../../node_modules/lodash/debounce'),
  throttle: require('../../../node_modules/lodash/throttle'),
  intersection: require('../../../node_modules/lodash/intersection'),
  every: require('../../../node_modules/lodash/every'),
  isRegExp: require('../../../node_modules/lodash/isRegExp'),
  identity: require('../../../node_modules/lodash/identity'),
  includes: require('../../../node_modules/lodash/includes'),
  partial: require('../../../node_modules/lodash/partial'),
  sortBy: require('../../../node_modules/lodash/sortBy')
};

},{"../../../node_modules/lodash/after":189,"../../../node_modules/lodash/bind":193,"../../../node_modules/lodash/clone":194,"../../../node_modules/lodash/debounce":196,"../../../node_modules/lodash/defaults":197,"../../../node_modules/lodash/each":198,"../../../node_modules/lodash/every":200,"../../../node_modules/lodash/extend":201,"../../../node_modules/lodash/filter":202,"../../../node_modules/lodash/find":203,"../../../node_modules/lodash/first":205,"../../../node_modules/lodash/has":208,"../../../node_modules/lodash/identity":211,"../../../node_modules/lodash/includes":212,"../../../node_modules/lodash/indexOf":213,"../../../node_modules/lodash/intersection":214,"../../../node_modules/lodash/invoke":215,"../../../node_modules/lodash/invokeMap":216,"../../../node_modules/lodash/isArray":218,"../../../node_modules/lodash/isBoolean":221,"../../../node_modules/lodash/isEqual":223,"../../../node_modules/lodash/isFunction":224,"../../../node_modules/lodash/isNull":226,"../../../node_modules/lodash/isNumber":227,"../../../node_modules/lodash/isObject":228,"../../../node_modules/lodash/isRegExp":231,"../../../node_modules/lodash/isString":232,"../../../node_modules/lodash/isUndefined":235,"../../../node_modules/lodash/keys":236,"../../../node_modules/lodash/last":238,"../../../node_modules/lodash/map":239,"../../../node_modules/lodash/merge":241,"../../../node_modules/lodash/noop":243,"../../../node_modules/lodash/omitBy":245,"../../../node_modules/lodash/once":246,"../../../node_modules/lodash/partial":247,"../../../node_modules/lodash/pick":248,"../../../node_modules/lodash/reduce":251,"../../../node_modules/lodash/reject":252,"../../../node_modules/lodash/result":253,"../../../node_modules/lodash/sortBy":254,"../../../node_modules/lodash/throttle":257,"../../../node_modules/lodash/uniqueId":263,"../../../node_modules/lodash/values":264}]},{},[266]);


    (function() {
      /*!
  * Reqwest! A general purpose XHR connection manager
  * license MIT (c) Dustin Diaz 2014
  * https://github.com/ded/reqwest
  */

!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , httpsRe = /^http/
    , protocolRe = /(^\w+):\/\//
    , twoHundo = /^(20\d|1223)$/ //http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          'contentType': 'application/x-www-form-urlencoded'
        , 'requestedWith': xmlHttpRequest
        , 'accept': {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , 'xml':  'application/xml, text/xml'
            , 'html': 'text/html'
            , 'text': 'text/plain'
            , 'json': 'application/json, text/javascript'
            , 'js':   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o['crossOrigin'] === true) {
          var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (win[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (win[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function succeed(r) {
    var protocol = protocolRe.exec(r.url);
    protocol = (protocol && protocol[1]) || window.location.protocol;
    return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response;
  }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r._timedOut) return error(r.request, 'Request is aborted: timeout')
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (succeed(r)) success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o['headers'] || {}
      , h

    headers['Accept'] = headers['Accept']
      || defaultHeaders['accept'][o['type']]
      || defaultHeaders['accept']['*']

    var isAFormData = typeof FormData === 'function' && (o['data'] instanceof FormData);
    // breaks cross-origin requests with legacy browsers
    if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith']
    if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType']
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o['withCredentials'] !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o['withCredentials']
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o['jsonpCallback'] || 'callback' // the 'callback' key
      , cbval = o['jsonpCallbackName'] || reqwest.getcallbackPrefix(reqId)
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o['method'] || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o['url']
      // convert non-string objects to query-string form unless o['processData'] is false
      , data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string')
        ? reqwest.toQueryString(o['data'])
        : (o['data'] || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o['type'] == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url)

    // get the xhr from the factory if passed
    // if the factory returns null, fall-back to ours
    http = (o.xhr && o.xhr(o)) || xhr(o)

    http.open(method, url, o['async'] === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o['before'] && o['before'](http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(header) {
    // json, javascript, text/plain, text/html, xml
    if (header.match('json')) return 'json'
    if (header.match('javascript')) return 'js'
    if (header.match('text')) return 'html'
    if (header.match('xml')) return 'xml'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o['url']
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this

    fn = fn || function () {}

    if (o['timeout']) {
      this.timeout = setTimeout(function () {
        timedOut()
      }, o['timeout'])
    }

    if (o['success']) {
      this._successHandler = function () {
        o['success'].apply(o, arguments)
      }
    }

    if (o['error']) {
      this._errorHandlers.push(function () {
        o['error'].apply(o, arguments)
      })
    }

    if (o['complete']) {
      this._completeHandlers.push(function () {
        o['complete'].apply(o, arguments)
      })
    }

    function complete (resp) {
      o['timeout'] && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')) // resp can be undefined in IE
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function timedOut() {
      self._timedOut = true
      self.request.abort()      
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  , 'catch': function (fn) {
      return this.fail(fn)
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o['disabled'])
            cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value'])
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o['type'] && (o['method'] = o['type']) && delete o['type']
      o['dataType'] && (o['type'] = o['dataType'])
      o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback']
      o['jsonp'] && (o['jsonpCallback'] = o['jsonp'])
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

    }).call(root);

    (function() {
      /**
* attempt of a simple defer/promise library for mobile development
* @author Jonathan Gotti < jgotti at jgotti dot net>
* @since 2012-10
* @version 0.7.3
*/
(function(undef){
	"use strict";

	var nextTick
		, isFunc = function(f){ return ( typeof f === 'function' ); }
		, isArray = function(a){ return Array.isArray ? Array.isArray(a) : (a instanceof Array); }
		, isObjOrFunc = function(o){ return !!(o && (typeof o).match(/function|object/)); }
		, isNotVal = function(v){ return (v === false || v === undef || v === null); }
		, slice = function(a, offset){ return [].slice.call(a, offset); }
		, undefStr = 'undefined'
		, tErr = typeof TypeError === undefStr ? Error : TypeError
	;
	if ( (typeof process !== undefStr) && process.nextTick ) {
		nextTick = process.nextTick;
	} else if ( typeof MessageChannel !== undefStr ) {
		var ntickChannel = new MessageChannel(), queue = [];
		ntickChannel.port1.onmessage = function(){ queue.length && (queue.shift())(); };
		nextTick = function(cb){
			queue.push(cb);
			ntickChannel.port2.postMessage(0);
		};
	} else {
		nextTick = function(cb){ setTimeout(cb, 0); };
	}
	function rethrow(e){ nextTick(function(){ throw e;}); }

	/**
	 * @typedef deferred
	 * @property {promise} promise
	 * @method resolve
	 * @method fulfill
	 * @method reject
	 */

	/**
	 * @typedef {function} fulfilled
	 * @param {*} value promise resolved value
	 * @returns {*} next promise resolution value
	 */

	/**
	 * @typedef {function} failed
	 * @param {*} reason promise rejection reason
	 * @returns {*} next promise resolution value or rethrow the reason
	 */

	//-- defining unenclosed promise methods --//
	/**
	 * same as then without failed callback
	 * @param {fulfilled} fulfilled callback
	 * @returns {promise} a new promise
	 */
	function promise_success(fulfilled){ return this.then(fulfilled, undef); }

	/**
	 * same as then with only a failed callback
	 * @param {failed} failed callback
	 * @returns {promise} a new promise
	 */
	function promise_error(failed){ return this.then(undef, failed); }


	/**
	 * same as then but fulfilled callback will receive multiple parameters when promise is fulfilled with an Array
	 * @param {fulfilled} fulfilled callback
	 * @param {failed} failed callback
	 * @returns {promise} a new promise
	 */
	function promise_apply(fulfilled, failed){
		return this.then(
			function(a){
				return isFunc(fulfilled) ? fulfilled.apply(null, isArray(a) ? a : [a]) : (defer.onlyFuncs ? a : fulfilled);
			}
			, failed || undef
		);
	}

	/**
	 * cleanup method which will be always executed regardless fulfillment or rejection
	 * @param {function} cb a callback called regardless of the fulfillment or rejection of the promise which will be called
	 *                      when the promise is not pending anymore
	 * @returns {promise} the same promise untouched
	 */
	function promise_ensure(cb){
		function _cb(){ cb(); }
		this.then(_cb, _cb);
		return this;
	}

	/**
	 * take a single callback which wait for an error as first parameter. other resolution values are passed as with the apply/spread method
	 * @param {function} cb a callback called regardless of the fulfillment or rejection of the promise which will be called
	 *                      when the promise is not pending anymore with error as first parameter if any as in node style
	 *                      callback. Rest of parameters will be applied as with the apply method.
	 * @returns {promise} a new promise
	 */
	function promise_nodify(cb){
		return this.then(
			function(a){
				return isFunc(cb) ? cb.apply(null, isArray(a) ? a.splice(0,0,undefined) && a : [undefined,a]) : (defer.onlyFuncs ? a : cb);
			}
			, function(e){
				return cb(e);
			}
		);
	}

	/**
	 *
	 * @param {function} [failed] without parameter will only rethrow promise rejection reason outside of the promise library on next tick
	 *                            if passed a failed method then will call failed on rejection and throw the error again if failed didn't
	 * @returns {promise} a new promise
	 */
	function promise_rethrow(failed){
		return this.then(
			undef
			, failed ? function(e){ failed(e); throw e; } : rethrow
		);
	}

	/**
	* @param {boolean} [alwaysAsync] if set force the async resolution for this promise independantly of the D.alwaysAsync option
	* @returns {deferred} defered object with property 'promise' and methods reject,fulfill,resolve (fulfill being an alias for resolve)
	*/
	var defer = function (alwaysAsync){
		var alwaysAsyncFn = (undef !== alwaysAsync ? alwaysAsync : defer.alwaysAsync) ? nextTick : function(fn){fn();}
			, status = 0 // -1 failed | 1 fulfilled
			, pendings = []
			, value
			/**
			 * @typedef promise
			 */
			, _promise  = {
				/**
				 * @param {fulfilled|function} fulfilled callback
				 * @param {failed|function} failed callback
				 * @returns {promise} a new promise
				 */
				then: function(fulfilled, failed){
					var d = defer();
					pendings.push([
						function(value){
							try{
								if( isNotVal(fulfilled)){
									d.resolve(value);
								} else {
									d.resolve(isFunc(fulfilled) ? fulfilled(value) : (defer.onlyFuncs ? value : fulfilled));
								}
							}catch(e){
								d.reject(e);
							}
						}
						, function(err){
							if ( isNotVal(failed) || ((!isFunc(failed)) && defer.onlyFuncs) ) {
								d.reject(err);
							}
							if ( failed ) {
								try{ d.resolve(isFunc(failed) ? failed(err) : failed); }catch(e){ d.reject(e);}
							}
						}
					]);
					status !== 0 && alwaysAsyncFn(execCallbacks);
					return d.promise;
				}

				, success: promise_success

				, error: promise_error
				, otherwise: promise_error

				, apply: promise_apply
				, spread: promise_apply

				, ensure: promise_ensure

				, nodify: promise_nodify

				, rethrow: promise_rethrow

				, isPending: function(){ return status === 0; }

				, getStatus: function(){ return status; }
			}
		;
		_promise.toSource = _promise.toString = _promise.valueOf = function(){return value === undef ? this : value; };


		function execCallbacks(){
			/*jshint bitwise:false*/
			if ( status === 0 ) {
				return;
			}
			var cbs = pendings, i = 0, l = cbs.length, cbIndex = ~status ? 0 : 1, cb;
			pendings = [];
			for( ; i < l; i++ ){
				(cb = cbs[i][cbIndex]) && cb(value);
			}
		}

		/**
		 * fulfill deferred with given value
		 * @param {*} val
		 * @returns {deferred} this for method chaining
		 */
		function _resolve(val){
			var done = false;
			function once(f){
				return function(x){
					if (done) {
						return undefined;
					} else {
						done = true;
						return f(x);
					}
				};
			}
			if ( status ) {
				return this;
			}
			try {
				var then = isObjOrFunc(val) && val.then;
				if ( isFunc(then) ) { // managing a promise
					if( val === _promise ){
						throw new tErr("Promise can't resolve itself");
					}
					then.call(val, once(_resolve), once(_reject));
					return this;
				}
			} catch (e) {
				once(_reject)(e);
				return this;
			}
			alwaysAsyncFn(function(){
				value = val;
				status = 1;
				execCallbacks();
			});
			return this;
		}

		/**
		 * reject deferred with given reason
		 * @param {*} Err
		 * @returns {deferred} this for method chaining
		 */
		function _reject(Err){
			status || alwaysAsyncFn(function(){
				try{ throw(Err); }catch(e){ value = e; }
				status = -1;
				execCallbacks();
			});
			return this;
		}
		return /**@type deferred */ {
			promise:_promise
			,resolve:_resolve
			,fulfill:_resolve // alias
			,reject:_reject
		};
	};

	defer.deferred = defer.defer = defer;
	defer.nextTick = nextTick;
	defer.alwaysAsync = true; // setting this will change default behaviour. use it only if necessary as asynchronicity will force some delay between your promise resolutions and is not always what you want.
	/**
	* setting onlyFuncs to false will break promises/A+ conformity by allowing you to pass non undefined/null values instead of callbacks
	* instead of just ignoring any non function parameters to then,success,error... it will accept non null|undefined values.
	* this will allow you shortcuts like promise.then('val','handled error'')
	* to be equivalent of promise.then(function(){ return 'val';},function(){ return 'handled error'})
	*/
	defer.onlyFuncs = true;

	/**
	 * return a fulfilled promise of given value (always async resolution)
	 * @param {*} value
	 * @returns {promise}
	 */
	defer.resolved = defer.fulfilled = function(value){ return defer(true).resolve(value).promise; };

	/**
	 * return a rejected promise with given reason of rejection (always async rejection)
	 * @param {*} reason
	 * @returns {promise}
	 */
	defer.rejected = function(reason){ return defer(true).reject(reason).promise; };

	/**
	 * return a promise with no resolution value which will be resolved in time ms (using setTimeout)
	 * @param {int} [time] in ms default to 0
	 * @returns {promise}
	 */
	defer.wait = function(time){
		var d = defer();
		setTimeout(d.resolve, time || 0);
		return d.promise;
	};

	/**
	 * return a promise for the return value of function call which will be fulfilled in delay ms or rejected if given fn throw an error
	 * @param {*} fn to execute or value to return after given delay
	 * @param {int} [delay] in ms default to 0
	 * @returns {promise}
	 */
	defer.delay = function(fn, delay){
		var d = defer();
		setTimeout(function(){ try{ d.resolve(isFunc(fn) ? fn.apply(null) : fn); }catch(e){ d.reject(e); } }, delay || 0);
		return d.promise;
	};

	/**
	 * if given value is not a promise return a fulfilled promise resolved to given value
	 * @param {*} promise a value or a promise
	 * @returns {promise}
	 */
	defer.promisify = function(promise){
		if ( promise && isFunc(promise.then) ) { return promise;}
		return defer.resolved(promise);
	};

	function multiPromiseResolver(callerArguments, returnPromises){
		var promises = slice(callerArguments);
		if ( promises.length === 1 && isArray(promises[0]) ) {
			if(! promises[0].length ){
				return defer.fulfilled([]);
			}
			promises = promises[0];
		}
		var args = []
			, d = defer()
			, c = promises.length
		;
		if ( !c ) {
			d.resolve(args);
		} else {
			var resolver = function(i){
				promises[i] = defer.promisify(promises[i]);
				promises[i].then(
					function(v){
						args[i] = returnPromises ? promises[i] : v;
						(--c) || d.resolve(args);
					}
					, function(e){
						if( ! returnPromises ){
							d.reject(e);
						} else {
							args[i] = promises[i];
							(--c) || d.resolve(args);
						}
					}
				);
			};
			for( var i = 0, l = c; i < l; i++ ){
				resolver(i);
			}
		}
		return d.promise;
	}

	function sequenceZenifier(promise, zenValue){
		return promise.then(isFunc(zenValue) ? zenValue : function(){return zenValue;});
	}
	function sequencePromiseResolver(callerArguments){
		var funcs = slice(callerArguments);
		if ( funcs.length === 1 && isArray(funcs[0]) ) {
			funcs = funcs[0];
		}
		var d = defer(), i=0, l=funcs.length, promise = defer.resolved();
		for(; i<l; i++){
			promise = sequenceZenifier(promise, funcs[i]);
		}
		d.resolve(promise);
		return d.promise;
	}

	/**
	 * return a promise for all given promises / values.
	 * the returned promises will be fulfilled with a list of resolved value.
	 * if any given promise is rejected then on the first rejection the returned promised will be rejected with the same reason
	 * @param {array|...*} [promise] can be a single array of promise/values as first parameter or a list of direct parameters promise/value
	 * @returns {promise} of a list of given promise resolution value
	 */
	defer.all = function(){ return multiPromiseResolver(arguments,false); };

	/**
	 * return an always fulfilled promise of array<promise> list of promises/values regardless they resolve fulfilled or rejected
	 * @param {array|...*} [promise] can be a single array of promise/values as first parameter or a list of direct parameters promise/value
	 *                     (non promise values will be promisified)
	 * @returns {promise} of the list of given promises
	 */
	defer.resolveAll = function(){ return multiPromiseResolver(arguments,true); };

	/**
	* execute given function in sequence passing their returned values to the next one in sequence.
	* You can pass values or promise instead of functions they will be passed in the sequence as if a function returned them.
	* if any function throw an error or a rejected promise the final returned promise will be rejected with that reason.
	* @param {array|...*} [function] list of function to call in sequence receiving previous one as a parameter
	*                     (non function values will be treated as if returned by a function)
	* @returns {promise} of the list of given promises
	*/
	defer.sequence = function(){ return sequencePromiseResolver(arguments); };

	/**
	 * transform a typical nodejs async method awaiting a callback as last parameter, receiving error as first parameter to a function that
	 * will return a promise instead. the returned promise will resolve with normal callback value minus the first error parameter on
	 * fulfill and will be rejected with that error as reason in case of error.
	 * @param {object} [subject] optional subject of the method to encapsulate
	 * @param {function} fn the function to encapsulate if the normal callback should receive more than a single parameter (minus the error)
	 *                      the promise will resolve with the list or parameters as fulfillment value. If only one parameter is sent to the
	 *                      callback then it will be used as the resolution value.
	 * @returns {Function}
	 */
	defer.nodeCapsule = function(subject, fn){
		if ( !fn ) {
			fn = subject;
			subject = void(0);
		}
		return function(){
			var d = defer(), args = slice(arguments);
			args.push(function(err, res){
				err ? d.reject(err) : d.resolve(arguments.length > 2 ? slice(arguments, 1) : res);
			});
			try{
				fn.apply(subject, args);
			}catch(e){
				d.reject(e);
			}
			return d.promise;
		};
	};

	/*global define*/
	if ( typeof define === 'function' && define.amd ) {
		define('D.js', [], function(){ return defer; });
	} else if ( typeof module !== undefStr && module.exports ) {
		module.exports = defer;
	} else if ( typeof window !== undefStr ) {
		var oldD = window.D;
		/**
		 * restore global D variable to its previous value and return D to the user
		 * @returns {Function}
		 */
		defer.noConflict = function(){
			window.D = oldD;
			return defer;
		};
		window.D = defer;
	}
})();

    }).call(root);

    (function() {
      /**
 * riveter - Mix-in, inheritance and constructor extend behavior for your JavaScript enjoyment.
 * © 2012 - Copyright appendTo, LLC 
 * Author(s): Jim Cowart, Nicholas Cloud, Doug Neiner
 * Version: v0.1.2
 * Url: https://github.com/a2labs/riveter
 * License(s): MIT, GPL
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = factory(require("lodash"));
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["lodash"], function (_) {
            return factory(_, root);
        });
    } else {
        // Browser globals
        root.riveter = factory(root._, root);
    }
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
    }).call(root);

    (function() {
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
    }).call(root);

    (function() {
      /**
 * postal - Pub/Sub library providing wildcard subscriptions, complex message handling, etc.  Works server and client-side.
 * Author: Jim Cowart (http://ifandelse.com)
 * Version: v2.0.4
 * Url: http://github.com/postaljs/postal.js
 * License(s): MIT
 */

( function( root, factory ) {
	
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "lodash" ], function( _ ) {
			return factory( _, root );
		} );
	
	} else if ( typeof module === "object" && module.exports ) {
		// Node, or CommonJS-Like environments
		module.exports = factory( require( "lodash" ), this );
	} else {
		// Browser globals
		root.postal = factory( root._, root );
	}
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

    }).call(root);

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ '_', 'ko', 'riveter', 'postal', 'reqwest', 'Conduit', 'D' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter, reqwest, Conduit, D) {
      var ajax = reqwest.compat;
      var Deferred = D;
      /**
 * footwork.js - A solid footing for web applications.
 * Author: Jonathan Newman (http://staticty.pe)
 * Version: v1.3.0-core
 * Url: http://footworkjs.com
 * License(s): MIT
 */

var fw = ko;
var isFunction = _.isFunction;
var isObject = _.isObject;
var isString = _.isString;
var isBoolean = _.isBoolean;
var isNumber = _.isNumber;
var isUndefined = _.isUndefined;
var isArray = _.isArray;
var isNull = _.isNull;
var contains = _.contains;
var extend = _.extend;
var pick = _.pick;
var each = _.each;
var filter = _.filter;
var bind = _.bind;
var invokeMap = _.invokeMap;
var clone = _.clone;
var reduce = _.reduce;
var has = _.has;
var result = _.result;
var uniqueId = _.uniqueId;
var map = _.map;
var find = _.find;
var omitBy = _.omitBy;
var indexOf = _.indexOf;
var values = _.values;
var reject = _.reject;
var findWhere = _.findWhere;
var once = _.once;
var last = _.last;
var isEqual = _.isEqual;
var noop = _.noop;
var keys = _.keys;
var merge = _.merge;
var pluck = _.pluck;
var first = _.first;
var intersection = _.intersection;
var every = _.every;
var isRegExp = _.isRegExp;
var identity = _.identity;
var includes = _.includes;
var partial = _.partial;
var sortBy = _.sortBy;


// framework/init.js
// ------------------

// Record the footwork version as of this build.
fw.footworkVersion = '1.3.0';

// Expose any embedded dependencies
fw.embed = embedded;

// Directly expose the Deferred factory
fw.deferred = Deferred;

fw.viewModel = {};
fw.dataModel = {};
fw.router = {};
fw.outlet = {};
fw.settings = {};

var runPostInit = [];
var internalComponents = [];
var entityDescriptors = [];
var entityMixins = [];

var entityClass = 'fw-entity';
var entityAnimateClass = 'fw-entity-animate';
var oneFrame = (1000 / 30);
var isEntityCtor;
var isEntity;
var isDataModel;
var isDataModelCtor;
var isRouter;
var activeOutlets = fw.observableArray();
var DefaultViewModel;

runPostInit.unshift(function() {
  DefaultViewModel = fw.viewModel.create({
    namespace: '_DefaultNamespace',
    autoIncrement: true,
    initialize: function(params) {
      if(isObject(params) && isObject(params.$viewModel)) {
        extend(this, params.$viewModel);
      }
    },
    sequenceAnimations: function() {
      return result(fw.settings, 'sequenceAnimations', 0);
    }
  });
});

// framework/utility.js
// ----------------

var trailingSlashRegex = /\/$/;
var startingSlashRegex = /^\//;
var startingHashRegex = /^#/;
var regExpMatch = /^\/|\/$/g;

var isObservable = fw.isObservable;

var isFullURLRegex = /(^[a-z]+:\/\/|^\/\/)/i;
var isFullURL = fw.utils.isFullURL = function(thing) {
  return isString(thing) && isFullURLRegex.test(thing);
};

function isPromise(thing) {
  return isObject(thing) && isFunction(thing.then);
}

function isNode(thing) {
  var thingIsObject = isObject(thing);
  return (
    thingIsObject ? thing instanceof Node :
    thingIsObject && isNumber(thing.nodeType) === "number" && isString(thing.nodeName)
  );
}

function promiseIsResolvedOrRejected(promise) {
  return !isPromise(promise) || includes(['resolved', 'rejected'], promise.state());
}

function isInternalComponent(componentName) {
  return indexOf(internalComponents, componentName) !== -1;
}

function isPath(pathOrFile) {
  return isString(pathOrFile) && trailingSlashRegex.test(pathOrFile);
};

function hasPathStart(path) {
  return isString(path) && startingSlashRegex.test(path);
};

function hasHashStart(string) {
  return isString(string) && startingHashRegex.test(string);
}

function hasClassName(element) {
  return isObject(element) && isString(element.className);
}

function hasClass(element, className) {
  return element.className.match( new RegExp('(\\s|^)' + className + '(\\s|$)') );
}

function addClass(element, className) {
  if(hasClassName(element) && !hasClass(element, className)) {
    element.className += (element.className.length && isNull(element.className.match(/ $/)) ? ' ' : '') + className;
  }
}

function removeClass(element, className) {
  if(hasClassName(element) && hasClass(element, className)) {
    var classNameRegex = new RegExp('(\\s|^)' + className + '(\\s|$)', 'g');
    element.className = element.className.replace(classNameRegex, ' ');
  }
}

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
  var theRequest = last(requests);

  if((allowConcurrent || !isObservable(requestRunning) || !requestRunning()) || !requests.length) {
    theRequest = createRequest();

    if(!isPromise(theRequest) && isFunction(Deferred)) {
      // returned value from createRequest() is a value not a promise, lets return the value in a promise
      theRequest = Deferred().resolve(theRequest);

      // extract the promise from the generic (jQuery or D.js) deferred
      theRequest = isFunction(theRequest.promise) ? theRequest.promise() : theRequest.promise;
    }

    requests = requests || [];
    requests.push(theRequest);
    entity.__private(promiseName, requests);

    requestRunning(true);

    var lullFinished = fw.observable(false);
    var requestFinished = fw.observable(false);
    var requestWatcher = fw.computed(function() {
      if(lullFinished() && requestFinished()) {
        requestRunning(false);
        requestWatcher.dispose();
      }
    });

    requestLull = (isFunction(requestLull) ? requestLull(operationType) : requestLull);
    if(requestLull) {
      setTimeout(function() {
        lullFinished(true);
      }, requestLull);
    } else {
      lullFinished(true);
    }

    if(isPromise(theRequest)) {
      (theRequest.always || theRequest.ensure).call(theRequest, function() {
        if(every(requests, promiseIsResolvedOrRejected)) {
          requestFinished(true);
          entity.__private(promiseName, []);
        }
      });
    }
  }

  return theRequest;
}

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

  if(isObject(a) && isObject(b)) {
    return every(reduce(a, function(comparison, paramValue, paramName) {
      var isCongruent = false;
      var bParamValue = b[paramName];
      if(bParamValue) {
        if(isRegExp(paramValue)) {
          isCongruent = !isNull(bParamValue.match(paramValue));
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
  isEq = isEq || isEqual;

  if(isObject(a) && isObject(b)) {
    var commonKeys = intersection(keys(a), keys(b));
    return commonKeys.length > 0 && isEq(pick(a, commonKeys), pick(b, commonKeys));
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
  isEq = isEq || isEqual;

  if(isObject(a) && isObject(b)) {
    var AKeys = keys(a);
    var BKeys = keys(b);
    var commonKeys = intersection(AKeys, BKeys);
    var hasAllAKeys = every(AKeys, function(Akey) {
      return BKeys.indexOf(Akey) !== -1;
    })
    return commonKeys.length > 0 && hasAllAKeys && isEq(pick(a, commonKeys), pick(b, commonKeys));
  } else {
    return a === b;
  }
}

/**
 * Return the 'result' of a property on an object, either via calling it (using the supplied context and params) or the raw value if it is a non-function value.
 * Note: This is similar to underscore/lodash result() but allows you to provide the context and parameters to potential callbacks
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

  if(isFunction(object[path])) {
    return object[path].apply(context, params);
  }
  return object[path];
}

function nearestEntity($context, predicate) {
  var foundEntity = null;

  predicate = predicate || isEntity;
  var predicates = [].concat(predicate);
  function isTheThing(thing) {
    return reduce(predicates, function(isThing, predicate) {
      return isThing || predicate(thing);
    }, false);
  }

  if(isObject($context)) {
    if(isTheThing($context.$data)) {
      // found $data that matches the predicate(s) in this context
      foundEntity = $context.$data;
    } else if(isObject($context.$parentContext) || (isObject($context.$data) && isObject($context.$data.$parentContext))) {
      // search through next parent up the chain
      foundEntity = nearestEntity($context.$parentContext || $context.$data.$parentContext, predicate);
    }
  }
  return foundEntity;
}

function forceViewModelComponentConvention(componentLocation) {
  if(isObject(componentLocation) && isUndefined(componentLocation.viewModel) && isUndefined(componentLocation.combined)) {
    return {
      viewModel: componentLocation.dataModel || componentLocation.router,
      template: componentLocation.template
    };
  }
  return componentLocation;
}

function getFilenameExtension(fileName) {
  var extension = '';
  if(fileName.indexOf('.') !== -1) {
    extension = last(fileName.split('.'));
  }
  return extension;
}

function alwaysPassPredicate() { return true; }
function emptyStringResult() { return ''; }

function propertyDispose(property) {
  if(isObject(property) && isFunction(property.dispose)) {
    property.dispose();
  }
}

// parseUri() originally sourced from: http://blog.stevenlevithan.com/archives/parseuri
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
    if($1) {
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

// Generate a random pseudo-GUID
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
var guid = fw.utils.guid = (function() {
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

// Private data management method
function privateData(privateStore, configParams, propName, propValue) {
  var isGetBaseObjOp = arguments.length === 2;
  var isReadOp = arguments.length === 3;
  var isWriteOp = arguments.length === 4;

  if(isGetBaseObjOp) {
    return privateStore;
  } else if(isReadOp) {
     return propName === 'configParams' ? configParams : privateStore[propName];
  } else if(isWriteOp) {
    privateStore[propName] = propValue;
    return privateStore[propName];
  }
}

var nextFrame = function(callback) {
  setTimeout(callback, oneFrame);
};


// framework/namespace/init.js
// ----------------

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

// framework/namespace/utility.js
// ----------------

// Returns a normalized namespace name based off of 'name'. It will register the name counter
// if not present and increment it if it is, then return the name (with the counter appended
// if autoIncrement === true and the counter is > 0).
function indexedNamespaceName(name, autoIncrement) {
  if( isUndefined(namespaceNameCounter[name]) ) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + (autoIncrement === true ? namespaceNameCounter[name] : '');
}

// Duck type check for a namespace object
function isNamespace(thing) {
  return isObject(thing) && !!thing.__isNamespace;
}

// enterNamespaceName() adds a namespaceName onto the namespace stack at the current index,
// 'entering' into that namespace (it is now the current namespace).
// The namespace object returned from this method also has a pointer to its parent
function enterNamespaceName(namespaceName) {
  namespaceStack.unshift( namespaceName );
  return fw.namespace( fw.utils.currentNamespaceName() );
}

// enterNamespace() uses a current namespace definition as the one to enter into.
function enterNamespace(namespace) {
  namespaceStack.unshift( namespace.getName() );
  return namespace;
}

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack
function exitNamespace() {
  namespaceStack.shift();
  return fw.utils.currentNamespace();
}

// framework/namespace/proto.js
// ----------------

function createEnvelope(topic, data, expires) {
  var envelope = {
    topic: topic,
    data: data
  };

  if( !isUndefined(expires) ) {
    envelope.headers = { preserve: true };
    if(expires instanceof Date) {
      envelope.expires = expires;
    }
  }

  return envelope;
}

// Method used to trigger an event on a namespace
function triggerEventOnNamespace(eventKey, params, expires) {
  this.publish( createEnvelope('event.' + eventKey, params, expires) );
  return this;
}

// Method used to register an event handler on a namespace
function registerNamespaceEventHandler(eventKey, callback, context) {
  if( !isUndefined(context) ) {
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
function sendCommandToNamespace(commandKey, params, expires) {
  this.publish( createEnvelope('command.' + commandKey, params, expires) );
  return this;
}

// Method used to register a command handler on a namespace
function registerNamespaceCommandHandler(commandKey, callback, context) {
  if( !isUndefined(context) ) {
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
    if( isUndefined(response) ) {
      response = allowMultipleResponses ? [reqResponse] : reqResponse;
    } else if(allowMultipleResponses) {
      response.push(reqResponse);
    }
  });

  this.publish( createEnvelope('request.' + requestKey, params) );
  responseSubscription.unsubscribe();

  return response;
}

// Method used to register a request handler on a namespace.
// Requests sent using the specified requestKey will be called and passed in any params specified, the return value is passed back to the issuer
function registerNamespaceRequestHandler(requestKey, callback, context) {
  if( !isUndefined(context) ) {
    callback = callback.bind(context);
  }

  var requestHandler = function(params) {
    var callbackResponse = callback(params);
    this.publish( createEnvelope('request.' + requestKey + '.response', callbackResponse) );
  }.bind(this);

  var handlerSubscription = this._subscribe('request.' + requestKey, requestHandler);
  this.requestHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// This effectively shuts down all requests, commands, events, and subscriptions by unsubscribing all handlers on a discreet namespace object
var handlerRepos = ['requestHandlers', 'commandHandlers', 'eventHandlers', 'subscriptions'];
function disconnectNamespaceHandlers() {
  var namespace = this;
  each(handlerRepos, function(handlerRepo) {
    invokeMap(namespace[handlerRepo], 'unsubscribe');
  });
  return this;
}

function getNamespaceName() {
  return this.channel;
}

// framework/namespace/entityMixins.js
// ----------------

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
entityMixins.push({
  runBeforeInit: true,
  _preInit: function( options ) {
    var $configParams = this.__private('configParams');
    var mainNamespace = $configParams.namespace || $configParams.name || uniqueId('namespace');
    this.$namespace = enterNamespaceName( indexedNamespaceName(mainNamespace, $configParams.autoIncrement) );
    this.$rootNamespace = fw.namespace(mainNamespace);
    this.$globalNamespace = fw.namespace();
  },
  mixin: {
    getNamespaceName: function() {
      return this.$namespace.getName();
    }
  },
  _postInit: function( options ) {
    exitNamespace();
  }
});


// Return the current namespace name.
fw.utils.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
fw.utils.currentNamespace = function() {
  return fw.namespace( fw.utils.currentNamespaceName() );
};

// Creates and returns a new namespace instance
fw.namespace = function(namespaceName, $parentNamespace) {
  if( !isUndefined($parentNamespace) ) {
    if( isString($parentNamespace) ) {
      namespaceName = $parentNamespace + '.' + namespaceName;
    } else if( !isUndefined($parentNamespace.channel) ) {
      namespaceName = $parentNamespace.channel + '.' + namespaceName;
    }
  }
  var namespace = postal.channel(namespaceName);

  var subscriptions = namespace.subscriptions = [];
  namespace._subscribe = namespace.subscribe;
  namespace.subscribe = function(topic, callback, context) {
    if(arguments.length > 2) {
      callback = callback.bind(context);
    }
    var subscription = namespace._subscribe.call(namespace, topic, callback);
    subscriptions.push(subscription);
    return subscription;
  };
  namespace.unsubscribe = unregisterNamespaceHandler;

  namespace._publish = namespace.publish;
  namespace.publish = function(envelope, callback, context) {
    if(arguments.length > 2) {
      callback = callback.bind(context);
    }
    namespace._publish.call(namespace, envelope, callback);
  };

  namespace.__isNamespace = true;
  namespace.dispose = disconnectNamespaceHandlers.bind(namespace);

  namespace.commandHandlers = [];
  namespace.command = sendCommandToNamespace.bind(namespace);
  namespace.command.handler = registerNamespaceCommandHandler.bind(namespace);
  namespace.command.unregister = unregisterNamespaceHandler;

  namespace.requestHandlers = [];
  namespace.request = requestResponseFromNamespace.bind(namespace);
  namespace.request.handler = registerNamespaceRequestHandler.bind(namespace);
  namespace.request.unregister = unregisterNamespaceHandler;

  namespace.eventHandlers = [];
  namespace.event = namespace.trigger = triggerEventOnNamespace.bind(namespace);
  namespace.event.handler = registerNamespaceEventHandler.bind(namespace);
  namespace.event.unregister = unregisterNamespaceHandler;

  namespace.getName = getNamespaceName.bind(namespace);
  namespace.enter = function() {
    return enterNamespace( this );
  };
  namespace.exit = function() {
    if(fw.utils.currentNamespaceName() === this.getName()) {
      return exitNamespace();
    }
  };

  return namespace;
};


// framework/broadcastable-receivable/broacastable.js
// ------------------

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcastAs = function(varName, option) {
  var broadcastable = this;
  var namespace;
  var subscriptions = [];
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;

  if( isObject(varName) ) {
    option = varName;
  } else {
    if( isBoolean(option) ) {
      option = {
        name: varName,
        writable: option
      };
    } else if( isObject(option) ) {
      option = extend({
        name: varName
      }, option);
    } else if( isString(option) ) {
      option = extend({
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
  if( isString(namespace) ) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if( !isNamespace(namespace) ) {
    throw new Error('Invalid namespace provided for broadcastAs() observable.');
  }

  if( option.writable ) {
    namespaceSubscriptions.push( namespace.subscribe( '__change.' + option.name, function( newValue ) {
      broadcastable( newValue );
    }) );
  }

  broadcastable.broadcast = function() {
    namespace.publish( option.name, broadcastable() );
    return this;
  };

  namespaceSubscriptions.push( namespace.subscribe( '__refresh.' + option.name, function() {
    namespace.publish( option.name, broadcastable() );
  }) );
  subscriptions.push( broadcastable.subscribe(function( newValue ) {
    namespace.publish( option.name, newValue );
  }) );

  broadcastable.dispose = function() {
    invokeMap(namespaceSubscriptions, 'unsubscribe');
    invokeMap(subscriptions, 'dispose');
    if( isLocalNamespace ) {
      namespace.dispose();
    }
  };

  broadcastable.__isBroadcastable = true;
  return broadcastable.broadcast();
};

// framework/broadcastable-receivable/receivable.js
// ------------------

// factory method which turns an observable into a receivable
fw.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var receivable = this;
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;
  var when = alwaysPassPredicate;

  if( isString(namespace) ) {
    namespace = fw.namespace( namespace );
    isLocalNamespace = true;
  }

  if( !isNamespace(namespace) ) {
    throw new Error('Invalid namespace provided for receiveFrom() observable.');
  }

  receivable = fw.computed({
    read: target,
    write: function( value ) {
      namespace.publish( '__change.' + variable, value );
    }
  });

  receivable.refresh = function() {
    namespace.publish( '__refresh.' + variable );
    return this;
  };

  namespaceSubscriptions.push( namespace.subscribe( variable, function( newValue ) {
    if(when(newValue)) {
      target(newValue);
    } else {
      target(undefined);
    }
  }) );

  var observableDispose = receivable.dispose;
  receivable.dispose = function() {
    invokeMap(namespaceSubscriptions, 'unsubscribe');
    if( isLocalNamespace ) {
      namespace.dispose();
    }
    observableDispose.call(receivable);
  };

  receivable.when = function(predicate) {
    if(isFunction(predicate)) {
      when = predicate;
    } else {
      when = function(updatedValue) {
        return isEqual(updatedValue, predicate);
      };
    }
    return this;
  };

  receivable.__isReceivable = true;
  return receivable.refresh();
};


fw.isBroadcastable = function(thing) {
  return isObject(thing) && !!thing.__isBroadcastable;
};

fw.isReceivable = function(thing) {
  return isObject(thing) && !!thing.__isReceivable;
};

// framework/entities/viewModel/ViewModel.js
// ------------------

var ViewModel = function(descriptor, configParams) {
  return {
    mixin: {
      disposeWithInstance: function(subscription) {
        if(isArray(subscription)) {
          var self = this;
          each(subscription, function(sub) {
            self.disposeWithInstance(sub);
          });
        } else {
          var subscriptions = this.__private('subscriptions');
          if(!isArray(subscriptions)) {
            subscriptions = [];
          }

          subscription && subscriptions.push(subscription);
          this.__private('subscriptions', subscriptions);
        }
      },
      dispose: function() {
        if( !this._isDisposed ) {
          this._isDisposed = true;
          if( configParams.onDispose !== noop ) {
            configParams.onDispose.call(this, this.__private('element'));
          }
          each(this, propertyDispose);
          each(this.__private('subscriptions') || [], propertyDispose);
        }
        return this;
      }
    },
    _postInit: function() {
      this.$globalNamespace.request.handler(descriptor.referenceNamespace, function(options) {
        if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
          var myNamespaceName = this.$namespace.getName();
          if(isArray(options.namespaceName) && indexOf(options.namespaceName, myNamespaceName) !== -1) {
            return this;
          } else if(isString(options.namespaceName) && options.namespaceName === myNamespaceName) {
            return this;
          }
        } else {
          return this;
        }
      }.bind(this));
    }
  };
};


// framework/entities/dataModel/utility.js
// ------------------

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

function getPrimaryKey(dataModel) {
  return dataModel.__private('configParams').idAttribute;
}

function insertValueIntoObject(rootObject, fieldMap, fieldValue) {
  if(isString(fieldMap)) {
    return insertValueIntoObject(rootObject, fieldMap.split('.'), fieldValue);
  }

  var propName = fieldMap.shift();
  if(fieldMap.length) {
    if(isUndefined(rootObject[propName])) {
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

  if(!isUndefined(fieldMap)) {
    if(isString(fieldMap)) {
      // initial call with string based fieldMap, recurse into main loop
      return getNestedReference(rootObject, fieldMap.split('.'));
    }

    propName = fieldMap.shift();
    if(fieldMap.length) {
      // recurse into the next layer
      return getNestedReference((rootObject || {})[propName], fieldMap);
    }
  }

  return !isString(propName) ? rootObject : result(rootObject || {}, propName);
}

// framework/persistence/sync.js
// ------------------

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

function noURLError() {
  throw new Error('A "url" property or function must be specified');
};

fw.sync = function(action, concern, params) {
  params = params || {};
  action = action || 'noAction';

  if(!isDataModel(concern) && !isCollection(concern)) {
    throw new Error('Must supply a dataModel or collection to fw.sync()');
  }

  var configParams = concern.__private('configParams');
  var options = extend({
    type: methodMap[action],
    dataType: 'json',
    url: null,
    data: null,
    headers: {},
    emulateHTTP: fw.settings.emulateHTTP,
    emulateJSON: fw.settings.emulateJSON
  }, resultBound(configParams, 'ajaxOptions', concern, [params]) || {}, params);

  if(!isString(options.type)) {
    throw new Error('Invalid action (' + action + ') specified for sync operation');
  }

  var url = options.url;
  if(isNull(url)) {
    url = configParams.url;
    if(isFunction(url)) {
      url = url.call(concern, action);
    } else if(!isString(url)) {
      var thing = (isDataModel(concern) && 'dataModel') || (isCollection(concern) && 'collection') || 'UNKNOWN';
      throw new Error('Must provide a URL for/on a ' + thing + ' configuration in order to call .sync() on it');
    }

    if(isDataModel(concern)) {
      var pkIsSpecifiedByUser = !isNull(url.match(':' + configParams.idAttribute));
      var hasQueryString = !isNull(url.match(/\?/));
      if(includes(['read', 'update', 'patch', 'delete'], action) && configParams.useKeyInUrl && !pkIsSpecifiedByUser && !hasQueryString) {
        // need to append /:id to url
        url = url.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute;
      }
    }
  }

  var urlPieces = (url || noURLError()).match(parseURLRegex);
  if(!isNull(urlPieces)) {
    var baseURL = urlPieces[1] || '';
    options.url = baseURL + last(urlPieces);
  } else {
    options.url = url;
  }

  if(isDataModel(concern)) {
    // replace any interpolated parameters
    var urlParams = options.url.match(parseParamsRegex);
    if(urlParams) {
      each(urlParams, function(param) {
        options.url = options.url.replace(param, concern.get(param.substr(1)));
      });
    }
  }

  if(isNull(options.data) && concern && includes(['create', 'update', 'patch'], action)) {
    options.contentType = 'application/json';
    options.data = JSON.stringify(options.attrs || concern.get());
  }

  // For older servers, emulate JSON by encoding the request into an HTML-form.
  if(options.emulateJSON) {
    options.contentType = 'application/x-www-form-urlencoded';
    options.data = options.data ? { model: options.data } : {};
  }

  // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
  // And an `X-HTTP-Method-Override` header.
  if(options.emulateHTTP && includes(['PUT', 'DELETE', 'PATCH'], options.type)) {
    options.type = 'POST';

    if(options.emulateJSON) {
      options.data._method = options.type;
    }
    extend(options.headers, { 'X-HTTP-Method-Override': options.type });
  }

  // Don't process data on a non-GET request.
  if(options.type !== 'GET' && !options.emulateJSON) {
    options.processData = false;
  }

  // Pass along `textStatus` and `errorThrown` from jQuery.
  var error = options.error;
  options.error = function(xhr, textStatus, errorThrown) {
    options.textStatus = textStatus;
    options.errorThrown = errorThrown;
    if (error) error.call(options.context, xhr, textStatus, errorThrown);
  };

  var xhr = options.xhr = fw.ajax(options);
  concern.$namespace.publish('_.request', { dataModel: concern, xhr: xhr, options: options });
  return xhr;
};

// framework/entities/dataModel/mapTo.js
// ------------------

fw.subscribable.fn.mapTo = function(option) {
  var mappedObservable = this;
  var mapPath;
  var dataModel;

  if(isString(option)) {
    mapPath = option;
    dataModel = currentDataModelContext();
  } else if(isObject(option)) {
    mapPath = option.path;
    dataModel = option.dataModel;
  } else {
    throw new Error('Invalid options supplied to mapTo');
  }

  if(!isDataModel(dataModel)) {
    throw new Error('No dataModel context found/supplied for mapTo observable');
  }

  var mappings = dataModel.__private('mappings')();
  var primaryKey = getPrimaryKey(dataModel);

  if(!isUndefined(mappings[mapPath]) && isFunction(mappings[mapPath].dispose)) {
    // remapping a path, we need to dispose of the old one first
    mappings[mapPath].dispose();
  }

  // add/set the registry entry for the mapped observable
  mappings[mapPath] = mappedObservable;

  if(mapPath === primaryKey) {
    // mapping primary key, update/set the $id property on the dataModel
    dataModel.$id = mappings[mapPath];
    if(isObservable(dataModel.isNew) && isFunction(dataModel.isNew.dispose)) {
      dataModel.isNew.dispose();
    }
    dataModel.isNew = fw.pureComputed(dataModelIsNew, dataModel);
  }

  mappedObservable.isDirty = fw.observable(false);
  var changeSubscription = mappedObservable.subscribe(function(value) {
    dataModel.$namespace.publish('_.change', { param: mapPath, value: value });
    mappedObservable.isDirty(true);
  });

  var disposeObservable = mappedObservable.dispose || noop;
  if(isFunction(mappedObservable.dispose)) {
    mappedObservable.dispose = function() {
      changeSubscription.dispose();
      disposeObservable.call(mappedObservable);
    };
  }

  dataModel.__private('mappings').valueHasMutated();

  return mappedObservable;
};

// framework/entities/dataModel/DataModel.js
// ------------------

function dataModelIsNew() {
  var id = this.$id();
  return isUndefined(id) || isNull(id);
}

var DataModel = function(descriptor, configParams) {
  return {
    runBeforeInit: true,
    _preInit: function(params) {
      params = params || {};
      enterDataModelContext(this);
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
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isFetching,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            var id = dataModel[configParams.idAttribute]();
            if(id) {
              // retrieve data dataModel the from server using the id
              var xhr = dataModel.sync('read', dataModel, options);

              return (xhr.done || xhr.then).call(xhr, function(response) {
                var parsedResponse = configParams.parse ? configParams.parse(response) : response;
                if(!isUndefined(parsedResponse[configParams.idAttribute])) {
                  dataModel.set(parsedResponse);
                }
              });
            }

            return false;
          }
        };

        return makeOrGetRequest('fetch', requestInfo);
      },

      // PUT / POST / PATCH to server
      save: function(key, val, options) {
        var dataModel = this;
        var attrs = null;

        if(isObject(key) && !isNode(key)) {
          attrs = key;
          options = val;
        } else if(isString(key) && arguments.length > 1) {
          (attrs = {})[key] = val;
        }

        if(isObject(options) && isFunction(options.stopPropagation)) {
          // method called as a result of an event binding, ignore its 'options'
          options = {};
        }

        options = extend({
          parse: true,
          wait: false,
          patch: false
        }, options);

        if(method === 'patch' && !options.attrs) {
          options.attrs = attrs;
        }

        var method = isUndefined(dataModel.$id()) ? 'create' : (options.patch ? 'patch' : 'update');
        var requestInfo = {
          requestRunning: (method === 'create' ? dataModel.isCreating : dataModel.isSaving),
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            if(!options.wait && !isNull(attrs)) {
              dataModel.set(attrs);
            }

            var xhr = dataModel.sync(method, dataModel, options);
            return (xhr.done || xhr.then).call(xhr, function(response) {
              var resourceData = configParams.parse ? configParams.parse(response) : response;

              if(options.wait && !isNull(attrs)) {
                resourceData = extend({}, attrs, resourceData);
              }

              if(isObject(resourceData)) {
                dataModel.set(resourceData);
              }
            });
          }
        };

        return makeOrGetRequest('save', requestInfo);
      },

      // DELETE
      destroy: function(options) {
        var dataModel = this;
        var requestInfo = {
          requestRunning: dataModel.isDestroying,
          requestLull: configParams.requestLull,
          entity: dataModel,
          createRequest: function() {
            if(dataModel.isNew()) {
              return false;
            }

            options = options ? clone(options) : {};
            var success = options.success;
            var wait = options.wait;

            var sendDestroyEvent = function() {
              dataModel.$namespace.publish('destroy', options);
            };

            if(!options.wait) {
              sendDestroyEvent();
            }

            var xhr = dataModel.sync('delete', dataModel, options);
            return (xhr.done || xhr.then).call(xhr, function() {
              dataModel.$id(undefined);
              if(options.wait) {
                sendDestroyEvent();
              }
            });
          }
        };

        return makeOrGetRequest('destroy', requestInfo);
      },

      // set attributes in model (clears isDirty on observables/fields it saves to by default)
      set: function(key, value, options) {
        var attributes = {};

        if(isString(key)) {
          attributes = insertValueIntoObject(attributes, key, value);
        } else if(isObject(key)) {
          attributes = key;
          options = value;
        }

        options = extend({
          clearDirty: true
        }, options);

        var mappingsChanged = false;
        var model = this;
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          var fieldValue = getNestedReference(attributes, fieldMap);
          if(!isUndefined(fieldValue)) {
            fw.isWriteableObservable(fieldObservable) && fieldObservable(fieldValue);
            mappingsChanged = true;
            options.clearDirty && fieldObservable.isDirty(false);
            model.$namespace.publish('_.change.' + fieldMap, fieldValue);
          }
        });

        if(mappingsChanged && options.clearDirty) {
          // we updated the dirty state of a/some field(s), lets tell the dataModel $dirty computed to (re)run its evaluator function
          this.__private('mappings').valueHasMutated();
        }
      },

      get: function(referenceField, includeRoot) {
        var dataModel = this;
        if(isArray(referenceField)) {
          return reduce(referenceField, function(jsObject, fieldMap) {
            return merge(jsObject, dataModel.get(fieldMap, true));
          }, {});
        } else if(!isUndefined(referenceField) && !isString(referenceField)) {
          throw new Error(dataModel.$namespace.getName() + ': Invalid referenceField [' + typeof referenceField + '] provided to dataModel.get().');
        }

        var mappedObject = reduce(this.__private('mappings')(), function reduceModelToObject(jsObject, fieldObservable, fieldMap) {
          if(isUndefined(referenceField) || ( fieldMap.indexOf(referenceField) === 0 && (fieldMap.length === referenceField.length || fieldMap.substr(referenceField.length, 1) === '.')) ) {
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
        if(!isUndefined(field)) {
          var fieldMatch = new RegExp('^' + field + '$|^' + field + '\..*');
        }
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          if(isUndefined(field) || fieldMap.match(fieldMatch)) {
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
        each(this.__private('mappings')(), function(fieldObservable, fieldMap) {
          tree[fieldMap] = fieldObservable.isDirty();
        });
        return tree;
      }
    },
    _postInit: function() {
      if(configParams.autoIncrement) {
        this.$rootNamespace.request.handler('get', function() { return this.get(); }.bind(this));
      }
      this.$namespace.request.handler('get', function() { return this.get(); }.bind(this));

      this.isDirty = fw.computed(function() {
        return reduce(this.__private('mappings')(), function(isDirty, mappedField) {
          return isDirty || mappedField.isDirty();
        }, false);
      }, this);

      exitDataModelContext();
    }
  };
};


runPostInit.push(function(runTask) {
  fw.ajax = ajax;
  extend(fw.settings, {
    emulateHTTP: false,
    emulateJSON: false
  });
});

// framework/entities/router/init.js
// ------------------

// Regular expressions used to parse a uri
var optionalParamRegex = /\((.*?)\)/g;
var namedParamRegex = /(\(\?)?:\w+/g;
var splatParamRegex = /\*\w*/g;
var escapeRegex = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var hashMatchRegex = /(^\/#)/;

var noComponentSelected = '_noComponentSelected';
var nullComponent = '_nullComponent';
var invalidRoutePathIdentifier = '___invalid-route';

var routesAreCaseSensitive = true;

var nullRouterData = {
  context: noop,
  childRouters: extend( noop.bind(), { push: noop } ),
  isRelative: function() { return false; }
};

var $nullRouter = {
  path: emptyStringResult,
  __private: function(propName) {
    if(arguments.length) {
      return nullRouterData[propName];
    }
    return nullRouterData;
  },
  path: function() { return ''; },
  __isNullRouter: true
};

var baseRoute = {
  controller: noop,
  indexedParams: [],
  namedParams: {},
  __isRoute: true
};

var baseRouteDescription = {
  filter: alwaysPassPredicate,
  __isRouteDesc: true
};

// framework/entities/router/utility.js
// -----------

function transformRouteConfigToDesc(routeDesc) {
  return extend({ id: uniqueId('route') }, baseRouteDescription, routeDesc );
}

function sameRouteDescription(desc1, desc2) {
  return desc1.id === desc2.id && isEqual(desc1.indexedParams, desc2.indexedParams) && isEqual(desc1.namedParams, desc2.namedParams);
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

function historyIsReady() {
  var typeOfHistory = typeof History;
  var isReady = ['function','object'].indexOf(typeOfHistory) !== -1 && has(History, 'Adapter');

  if(isReady && !History.Adapter.isSetup) {
    History.Adapter.isSetup = true;

    // why .unbind() is not already present in History.js is beyond me
    History.Adapter.unbind = function(callback) {
      each(History.Adapter.handlers, function(handler) {
        handler.statechange = filter(handler.statechange, function(stateChangeHandler) {
          return stateChangeHandler !== callback;
        });
      });
    };
  }

  return isReady;
}

function isNullRouter(thing) {
  return isObject(thing) && !!thing.__isNullRouter;
}

function isRoute(thing) {
  return isObject(thing) && !!thing.__isRoute;
}

function isOutletViewModel(thing) {
  return isObject(thing) && thing.__isOutlet;
}

// Locate the nearest $router from a given ko $context
// (travels up through $parentContext chain to find the router if not found on the
// immediate $context). Returns $nullRouter if none is found.
function nearestParentRouter($context) {
  return nearestEntity($context, isRouter) || $nullRouter;
}

// framework/entities/router/outlet.js
// ------------------

var noParentViewModelError = { $namespace: { getName: function() { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };
var defaultLoadingComponent = 'default-loading-display';

// This custom binding binds the outlet element to the $outlet on the router, changes on its 'route' (component definition observable) will be applied
// to the UI and load in various views
fw.virtualElements.allowedBindings.$outletBinder = true;
fw.bindingHandlers.$outletBinder = {
  init: function(element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var $parentViewModel = (isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var $parentRouter = nearestParentRouter(bindingContext);
    var outletName = outletViewModel.outletName;

    if(isRouter($parentRouter)) {
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

function registerViewModelForOutlet(outletName, outletViewModel) {
  var outletProperties = this.outlets[outletName] || {};
  outletProperties.outletViewModel = outletViewModel;
}

function unregisterViewModelForOutlet(outletName) {
  var outletProperties = this.outlets[outletName] || {};
  delete outletProperties.outletViewModel;
}

function routerOutlet(outletName, componentToDisplay, options) {
  options = options || {};
  if(isFunction(options)) {
    options = { onComplete: options, onFailure: noop };
  }

  var router = this;
  var viewModelParameters = options.params;
  var onComplete = options.onComplete || noop;
  var onFailure = options.onFailure || noop;
  var configParams = router.__private('configParams');
  var outlets = router.outlets;
  var outletProperties = outlets[outletName] || {};
  var outlet = outletProperties.routeObservable;
  var outletViewModel = outletProperties.outletViewModel;

  if(!isObservable(outlet)) {
    // router outlet observable not found, we must create a new one
    outlet = fw.observable({
      name: noComponentSelected,
      params: {},
      getOnCompleteCallback: function() { return noop; },
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

  if(arguments.length > 1 && !componentToDisplay) {
    componentToDisplay = nullComponent;
  }

  if(!isUndefined(componentToDisplay)) {
    if(currentOutletDef.name !== componentToDisplay) {
      currentOutletDef.name = componentToDisplay;
      valueHasMutated = true;
    }

    if(isObject(viewModelParameters)) {
      currentOutletDef.params = viewModelParameters;
      valueHasMutated = true;
    }
  }

  if(outletViewModel) {
    // Show the loading component (if one is defined)
    var showDuringLoadComponent = resultBound(configParams, 'showDuringLoad', router, [outletName, componentToDisplay || currentOutletDef.name]);

    if(showDuringLoadComponent === true || (!showDuringLoadComponent &&  resultBound(fw.router, 'showDefaultLoader', router, [outletName, componentToDisplay || currentOutletDef.name]))) {
      showDuringLoadComponent = defaultLoadingComponent;
    }

    if(showDuringLoadComponent) {
      outletViewModel.loadingDisplay(showDuringLoadComponent);
    }
  }

  if(valueHasMutated) {
    clearSequenceQueue();

    currentOutletDef.minTransitionPeriod = resultBound(configParams, 'minTransitionPeriod', router, [outletName, componentToDisplay]);
    if(outletViewModel) {
      outletViewModel.inFlightChildren([]);
      outletViewModel.routeIsLoading(true);
    }

    currentOutletDef.getOnCompleteCallback = function(element) {
      var outletElement = element.parentNode;

      activeOutlets.remove(outlet);
      outletElement.setAttribute('rendered', (componentToDisplay === nullComponent ? '' : componentToDisplay));

      return function addBindingOnComplete() {
        var outletViewModel = router.outlets[outletName].outletViewModel;
        if(outletViewModel) {
          outletViewModel.routeIsLoading(false);
        }

        onComplete.call(router, outletElement);
      };
    };

    if(activeOutlets().indexOf(outlet) === -1) {
      activeOutlets.push(outlet);
    }

    outlet.valueHasMutated();
  }

  return outlet;
};

var outletLoadingDisplay = 'fw-loading-display';
var outletLoadedDisplay = 'fw-loaded-display';
var visibleCSS = { 'height': '', 'overflow': '' };
var hiddenCSS = { 'height': '0px', 'overflow': 'hidden' };
var removeAnimation = {};
removeAnimation[entityAnimateClass] = false;
var addAnimation = {};
addAnimation[entityAnimateClass] = true;

function registerOutletComponent() {
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
        if(outlet.routeIsResolving()) {
          resolvedCallbacks.push(callback);
        } else {
          callback();
        }
      };

      this.routeIsLoadingSub = this.routeIsLoading.subscribe(function(routeIsLoading) {
        if(routeIsLoading) {
          outlet.routeIsResolving(true);
        } else {
          if(outlet.flightWatch && isFunction(outlet.flightWatch.dispose)) {
            outlet.flightWatch.dispose();
          }

          // must allow binding to begin on any subcomponents/etc
          nextFrame(function() {
            if(outlet.inFlightChildren().length) {
              outlet.flightWatch = outlet.inFlightChildren.subscribe(function(inFlightChildren) {
                if(!inFlightChildren.length) {
                  outlet.routeIsResolving(false);
                }
              });
            } else {
              outlet.routeIsResolving(false);
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

        if(resolvedCallbacks.length) {
          each(resolvedCallbacks, function(callback) {
            callback();
          });
          resolvedCallbacks = [];
        }
      }

      var transitionTriggerTimeout;
      function showLoaded() {
        clearTimeout(transitionTriggerTimeout);
        var minTransitionPeriod = outlet.route.peek().minTransitionPeriod;
        if(minTransitionPeriod) {
          transitionTriggerTimeout = setTimeout(showLoadedAfterMinimumTransition, minTransitionPeriod);
        } else {
          showLoadedAfterMinimumTransition();
        }
      }

      this.transitionTrigger = fw.computed(function() {
        var routeIsResolving = this.routeIsResolving();
        if(routeIsResolving) {
          showLoader();
        } else {
          showLoaded();
        }
      }, this);

      this.dispose = function() {
        each(outlet, function(outletProperty) {
          if(outletProperty && isFunction(outletProperty.dispose)) {
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
};

function registerDefaultLoadingDisplayComponent() {
  fw.components.register(defaultLoadingComponent, {
    template: '<div class="sk-wave">\
                <div class="sk-rect sk-rect1"></div>\
                <div class="sk-rect sk-rect2"></div>\
                <div class="sk-rect sk-rect3"></div>\
                <div class="sk-rect sk-rect4"></div>\
                <div class="sk-rect sk-rect5"></div>\
              </div>'
  });
}

runPostInit.push(registerOutletComponent);
runPostInit.push(registerDefaultLoadingDisplayComponent);

// framework/entities/router/routeBinding.js
// -----------

function findParentNode(element, selector) {
  if(selector === true) {
    return element.parentNode;
  }

  if(element.parentNode && isFunction(element.parentNode.querySelectorAll)) {
    var parentNode = element.parentNode;
    var matches = parentNode.querySelectorAll(selector);
    if(matches.length && includes(matches, element)) {
      return element;
    }
    return findParentNode(parentNode, selector);
  }

  return undefined;
}

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
        if(hashOnly) {
          return false;
        }

        if( !isFullURL(url) && event.which !== 2 ) {
          event.preventDefault();
          return true;
        }
        return false;
      }
    };

    if(isFunction(routeParams) || isString(routeParams)) {
      routeHandlerDescription.url = routeParams;
    } else if( isObject(routeParams) ) {
      extend(routeHandlerDescription, routeParams);
    }

    var routeHandlerDescriptionURL = routeHandlerDescription.url;
    if(!isFunction(routeHandlerDescriptionURL)) {
      routeHandlerDescription.url = function() { return routeHandlerDescriptionURL; };
    }

    function getRouteURL(includeParentPath) {
      var parentRoutePath = '';
      var routeURL = routeHandlerDescription.url();
      var myLinkPath = routeURL || '';

      if(!isNull(routeURL)) {
        if(isUndefined(routeURL)) {
          routeURL = myLinkPath;
        }

        if(!isFullURL(myLinkPath)) {
          if(!hasPathStart(myLinkPath)) {
            var currentRoute = $myRouter.currentRoute();
            if(hasHashStart(myLinkPath)) {
              if(!isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + myLinkPath;
              }
              hashOnly = true;
            } else {
              // relative url, prepend current segment
              if(!isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + '/' + myLinkPath;
              }
            }
          }

          if(includeParentPath && !isNullRouter($myRouter)) {
            myLinkPath = $myRouter.__private('parentRouter')().path() + myLinkPath;
          }

          if(fw.router.html5History() === false) {
            myLinkPath = '#' + (myLinkPath.indexOf('/') === 0 ? myLinkPath.substring(1) : myLinkPath);
          }
        }

        return myLinkPath;
      }

      return null;
    };
    var routeURLWithParentPath = getRouteURL.bind(null, true);
    var routeURLWithoutParentPath = getRouteURL.bind(null, false);

    function checkForMatchingSegment(mySegment, newRoute) {
      if(isString(mySegment)) {
        var currentRoute = $myRouter.currentRoute();
        var elementWithState = routeHandlerDescription.parentHasState ? findParentNode(element, routeHandlerDescription.parentHasState) : element;
        var activeRouteClassName = resultBound(routeHandlerDescription, 'activeClass', $myRouter) || fw.router.activeRouteClassName();
        mySegment = mySegment.replace(startingHashRegex, '/');

        if(isObject(currentRoute)) {
          if(resultBound(routeHandlerDescription, 'addActiveClass', $myRouter)) {
            if(mySegment === '/') {
              mySegment = '';
            }

            if(!isNull(newRoute) && newRoute.segment === mySegment && isString(activeRouteClassName) && activeRouteClassName.length) {
              // newRoute.segment is the same as this routers segment...add the activeRouteClassName to the element to indicate it is active
              addClass(elementWithState, activeRouteClassName);
            } else if( hasClass(elementWithState, activeRouteClassName) ) {
              removeClass(elementWithState, activeRouteClassName);
            }
          }
        }
      }

      if(isNull(newRoute)) {
        // No route currently selected, remove the activeRouteClassName from the elementWithState
        removeClass(elementWithState, activeRouteClassName);
      }
    };

    function setUpElement() {
      if (!isNullRouter($myRouter)) {
        var myCurrentSegment = routeURLWithoutParentPath();
        var routerConfig = $myRouter.__private('configParams');
        if (element.tagName.toLowerCase() === 'a') {
          element.href = (fw.router.html5History() ? '' : '/') + routerConfig.baseRoute + routeURLWithParentPath();
        }

        if (isObject(stateTracker) && isFunction(stateTracker.dispose)) {
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
              if (isString(handlerResult)) {
                currentRouteURL = handlerResult;
              }
              if (isString(currentRouteURL) && !isFullURL(currentRouteURL)) {
                $myRouter.setState( currentRouteURL );
              }
            }
            return true;
          });
        }
      }
    }

    if (isObservable(routeHandlerDescription.url)) {
      $myRouter.__private('subscriptions').push( routeHandlerDescription.url.subscribe(setUpElement) );
    }
    setUpElement();

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if (isObject(stateTracker)) {
        stateTracker.dispose();
      }
    });
  }
};

// framework/entities/router/Router.js
// ------------------

var Router = function(descriptor, configParams) {
  return {
    _preInit: function( params ) {
      var $router = this;
      var routerConfigParams = extend({ routes: [] }, configParams);

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
      router.historyIsEnabled = fw.observable(false);
      router.disableHistory = fw.observable().receiveFrom(this.$globalNamespace, 'disableHistory');
      router.currentState = fw.observable('').broadcastAs('currentState');

      function trimBaseRoute(url) {
        var routerConfig = $router.__private('configParams');
        if (!isNull(routerConfig.baseRoute) && url.indexOf(routerConfig.baseRoute) === 0) {
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

        if (!fw.router.html5History()) {
          if (url.indexOf('#') !== -1) {
            url = '/' + urlParts.anchor.replace(startingSlashRegex, '');
          } else if (router.currentState() !== url) {
            url = '/';
          }
        } else {
          url = urlParts.path;
        }

        return trimBaseRoute(url);
      }
      router.normalizeURL = normalizeURL;

      function getUnknownRoute() {
        var unknownRoute = find(($router.routeDescriptions || []).reverse(), { unknown: true }) || null;

        if (!isNull(unknownRoute)) {
          unknownRoute = extend({}, baseRoute, {
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
        var matchedRoutes = reduce($router.routeDescriptions, function (matches, routeDescription) {
          var routeDescRoute = [].concat(routeDescription.route);
          each(routeDescRoute, function (routeString) {
            var routeParams = [];

            if (isString(routeString) && isString(url)) {
              routeParams = url.match(routeStringToRegExp(routeString));
              if (!isNull(routeParams) && routeDescription.filter.call($router, routeParams, router.urlParts.peek())) {
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
          var matchedRoute = reduce(matchedRoutes, function(matchedRoute, foundRoute) {
            if (isNull(matchedRoute) || foundRoute.specificity > matchedRoute.specificity) {
              matchedRoute = foundRoute;
            }
            return matchedRoute;
          }, null);
          var routeDescription = matchedRoute.routeDescription;
          var routeString = matchedRoute.routeString;
          var routeParams = clone(matchedRoute.routeParams);
          var splatSegment = routeParams.pop() || '';
          var routeParamNames = map(routeString.match(namedParamRegex), function(param) {
            return param.replace(':', '');
          });
          var namedParams = reduce(routeParamNames, function(parameterNames, parameterName, index) {
            parameterNames[parameterName] = routeParams[index + 1];
            return parameterNames;
          }, {});

          route = extend({}, baseRoute, {
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
        if (!isUndefined(routeDescription.title)) {
          document.title = isFunction(routeDescription.title) ? routeDescription.title.apply($router, values(routeDescription.namedParams)) : routeDescription.title;
        }

        if (isUndefined(router.currentRouteDescription) || !sameRouteDescription(router.currentRouteDescription, routeDescription)) {
          (routeDescription.controller || noop).apply($router, values(routeDescription.namedParams) );
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

        if(isObject(state)) {
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
        if(router.currentState().length) {
          getActionForRoute(newRoute)( /* get and call the action for the newRoute */ );
        }
      }, this));

      this.outlets = {};
      this.outlet = routerOutlet.bind(this);
      this.outlet.reset = function() {
        each( this.outlets, function(outlet) {
          outlet({ name: noComponentSelected, params: {} });
        });
      }.bind(this);

      if (!isUndefined(routerConfigParams.unknownRoute)) {
        if (isFunction(routerConfigParams.unknownRoute)) {
          routerConfigParams.unknownRoute = { controller: routerConfigParams.unknownRoute };
        }
        routerConfigParams.routes.push(extend(routerConfigParams.unknownRoute, { unknown: true }));
      }
      this.setRoutes(routerConfigParams.routes);

      if (routerConfigParams.activate === true) {
        subscriptions.push(router.context.subscribe(function activateRouterAfterNewContext( $context ) {
          if (isObject($context)) {
            this.activate($context);
          }
        }, this));
      }

      this.matchesRoute = function(routeName, path) {
        var route = getRouteForURL(path);
        routeName = [].concat(routeName);
        if (!isNull(route)) {
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
        this.routeDescriptions = this.routeDescriptions.concat( map(isArray(routeConfig) ? routeConfig : [routeConfig], transformRouteConfigToDesc) );
        return this;
      },
      activate: function($context, $parentRouter) {
        $context = $context || this.__private('context')();
        $parentRouter = $parentRouter || nearestParentRouter($context);

        if(!isNullRouter($parentRouter)) {
          this.__private('parentRouter')($parentRouter);
        } else if (isObject($context)) {
          $parentRouter = nearestParentRouter($context);
          if ($parentRouter !== this) {
            this.__private('parentRouter')($parentRouter);
          }
        }

        if (!this.__private('historyIsEnabled')()) {
          if (historyIsReady() && !this.__private('disableHistory')()) {
            History.Adapter.bind(windowObject, 'popstate', this.__private('stateChangeHandler', function (event) {
              var url = '';
              if (!fw.router.html5History() && windowObject.location.hash.length > 1) {
                url = windowObject.location.hash;
              } else {
                url = windowObject.location.pathname + windowObject.location.hash;
              }

              this.__private('currentState')( this.__private('normalizeURL')(url) );
            }.bind(this) ));
            this.__private('historyIsEnabled')(true);
          } else {
            this.__private('historyIsEnabled')(false);
          }
        }

        if (this.__private('currentState')() === '') {
          this.setState();
        }

        this.$namespace.trigger('activated', { context: $context, parentRouter: $parentRouter });
        return this;
      },
      setState: function(url, routeParams) {
        var namedRoute = isObject(routeParams) ? url : null;
        var configParams = this.__private('configParams');
        var continueToRoute = true;
        var useHistory = this.__private('historyIsEnabled')() && !this.__private('disableHistory')() && isFunction(History.getState);

        if(!isNull(namedRoute)) {
          // must convert namedRoute into its URL form
          var routeDescription = find(this.routeDescriptions, function (route) {
            return route.name === namedRoute;
          });

          if (!isUndefined(routeDescription)) {
            url = first([].concat(routeDescription.route));
            each(routeParams, function (value, fieldName) {
              url = url.replace(':' + fieldName, routeParams[fieldName]);
            });
          } else {
            throw new Error('Could not locate named route: ' + namedRoute);
          }
        }

        var isExternalURL = isString(url);
        if (!isString(url) && useHistory) {
          url = History.getState().url;
        }

        if (!isExternalURL) {
          url = this.__private('normalizeURL')(url);
        }

        if (isFunction(configParams.beforeRoute)) {
          continueToRoute = configParams.beforeRoute.call(this, url || '/');
        }

        if (continueToRoute) {
          if (useHistory) {
            if (isExternalURL) {
              var historyAPIWorked = true;
              try {
                historyAPIWorked = History.pushState(null, '', configParams.baseRoute + this.__private('parentRouter')().path() + url.replace(startingHashRegex, '/'));
              } catch (historyException) {
                historyAPIWorked = false;
              } finally {
                if (historyAPIWorked) {
                  return;
                }
              }
            } else {
              this.__private('currentState')(this.__private('normalizeURL')(url));
            }
          } else if (isExternalURL) {
            this.__private('currentState')(this.__private('normalizeURL')(url));
          } else {
            this.__private('currentState')('/');
          }

          if (!historyIsReady()) {
            var routePath = this.path();
            each(this.__private('childRouters')(), function (childRouter) {
              childRouter.__private('currentState')(routePath);
            });
          }
        }

        return this;
      },
      dispose: function() {
        if(!this._isDisposed) {
          this._isDisposed = true;

          var $parentRouter = this.__private('parentRouter')();
          if (!isNullRouter($parentRouter)) {
            $parentRouter.__private('childRouters').remove(this);
          }

          if (this.__private('historyIsEnabled')() && historyIsReady()) {
            History.Adapter.unbind(this.__private('stateChangeHandler'));
          }

          this.$namespace.dispose();
          this.$globalNamespace.dispose();
          invokeMap(this.__private('subscriptions'), 'dispose');

          each(omitBy(this, function (property) {
            return isEntity(property);
          }), propertyDispose);

          each(omitBy(this.__private(), function (property) {
            return isEntity(property);
          }), propertyDispose);

          return this;
        }
      }
    }
  };
};


extend(fw.router, {
  // baseRoute / path which will always be stripped from the URL prior to processing the route
  baseRoute: fw.observable(''),
  activeRouteClassName: fw.observable('active'),
  disableHistory: fw.observable(false).broadcastAs({ name: 'disableHistory', namespace: fw.namespace() }),
  html5History: function() {
    return hasHTML5History;
  },
  getNearestParent: function($context) {
    var $parentRouter = nearestParentRouter($context);
    return (!isNullRouter($parentRouter) ? $parentRouter : null);
  }
});

extend(fw.outlet, {
  registerView: function(viewName, templateHTML) {
    fw.components.register(viewName, { template: templateHTML });
  },
  registerViewLocation: function(viewName, viewLocation) {
    fw.components.registerLocation(viewName, { template: viewLocation });
  }
});


// framework/entities/descriptorConfig.js
// ------------------

function resolveEntityImmediately(resolveNow) {
  resolveNow(true);
}

entityDescriptors = entityDescriptors.concat([
  {
    tagName: 'viewmodel',
    methodName: 'viewModel',
    defaultLocation: '/viewModel/',
    resource: fw.viewModel,
    behavior: [ ViewModel ],
    defaultConfig: {
      namespace: undefined,
      autoRegister: false,
      autoIncrement: false,
      extend: {},
      mixins: undefined,
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop
    }
  }, {
    tagName: 'datamodel',
    methodName: 'dataModel',
    defaultLocation: '/dataModel/',
    resource: fw.dataModel,
    behavior: [ ViewModel, DataModel ],
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
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop
    }
  }, {
    tagName: 'router',
    methodName: 'router',
    defaultLocation: '/',
    resource: fw.router,
    behavior: [ ViewModel, Router ],
    defaultConfig: {
      namespace: '$router',
      autoRegister: false,
      autoIncrement: false,
      showDuringLoad: noComponentSelected,
      extend: {},
      mixins: undefined,
      afterRender: noop,
      afterResolving: resolveEntityImmediately,
      sequenceAnimations: false,
      onDispose: noop,
      baseRoute: null,
      isRelative: true,
      activate: true,
      beforeRoute: null,
      minTransitionPeriod: 0
    }
  }
]);

// framework/entities/bindingInit.js
// ------------------

function entityBinder(element, params, $parentContext, Entity, $flightTracker, $parentsInFlightChildren, $outletsInFlightChildren) {
  var entityObj;
  if (isFunction(Entity)) {
    entityObj = new Entity(params);
  } else {
    entityObj = Entity;
  }
  entityObj.$parentContext = $parentContext;

  if (isEntity(entityObj)) {
    var resolveFlightTracker =  noop;

    if ($flightTracker) {
      resolveFlightTracker = function(addAnimationClass) {
        var wasResolved = false;
        function resolveThisEntityNow(isResolved) {
          function finishResolution() {
            addAnimationClass();
            if(fw.isObservable($parentsInFlightChildren) && isFunction($parentsInFlightChildren.remove)) {
              $parentsInFlightChildren.remove($flightTracker);
            }
            if(fw.isObservable($outletsInFlightChildren) && isFunction($outletsInFlightChildren.remove)) {
              $outletsInFlightChildren.remove($flightTracker);
            }
          }

          if (!wasResolved) {
            wasResolved = true;
            if (isResolved === true) {
              finishResolution();
            } else if(isPromise(isResolved) || (isArray(isResolved) && every(isResolved, isPromise))) {
              var promises = [].concat(isResolved);
              var checkPromise = function(promise) {
                (promise.done || promise.then).call(promise, function() {
                  if(every(promises, promiseIsResolvedOrRejected)) {
                    finishResolution();
                  }
                });
              };

              each(promises, checkPromise);
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
  each(element.childNodes, function(child) {
    if (!isUndefined(child)) {
      childrenToInsert.push(child);
    }
  });

  // Have to create a wrapper element for the contents of the element. Cannot bind to
  // existing element as it has already been bound against.
  var wrapperNode = document.createElement('binding-wrapper');
  element.insertBefore(wrapperNode, element.firstChild);

  each(childrenToInsert, function(child) {
    wrapperNode.appendChild(child);
  });

  fw.applyBindings(entityObj, wrapperNode);
};

// Monkey patch enables the entity to initialize a viewModel and bind to the html as intended (with lifecycle events)
// TODO: Do this differently once this is resolved: https://github.com/knockout/knockout/issues/1463
var originalComponentInit = fw.bindingHandlers.component.init;

function getResourceLocation(moduleName) {
  var resource = this;
  var resourceLocation = null;

  if( resource.isRegistered(moduleName) ) {
    // viewModel was manually registered, we preferentially use it
    resourceLocation = resource.getRegistered(moduleName);
  } else if( isFunction(require) && isFunction(require.specified) && require.specified(moduleName) ) {
    // we have found a matching resource that is already cached by require, lets use it
    resourceLocation = moduleName;
  } else {
    resourceLocation = resource.getLocation(moduleName);
  }

  return resourceLocation;
}

function initEntityTag(tagName, element, valueAccessor, allBindings, viewModel, bindingContext) {
  var theValueAccessor = valueAccessor;
  if (tagName === '__elementBased') {
    tagName = element.tagName;
  }

  var $flightTracker = { name: tagName, type: 'component' };

  if(element.nodeType !== 8 && (!isString(tagName) || tagName.toLowerCase() !== 'outlet')) {
    var $nearestEntity = nearestEntity(bindingContext);
    if ($nearestEntity) {
      var $inFlightChildren = $nearestEntity.__private('inFlightChildren');
      if (isObservable($inFlightChildren) && isFunction($inFlightChildren.push)) {
        $inFlightChildren.push($flightTracker);
      }
    }

    var $nearestOutlet = nearestEntity(bindingContext, isOutletViewModel);
    if ($nearestOutlet) {
      var $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
      if (isObservable($outletsInFlightChildren) && isFunction($outletsInFlightChildren.push)) {
        $outletsInFlightChildren.push($flightTracker);
      }
    }
  }

  if (isString(tagName)) {
    tagName = tagName.toLowerCase();
    if (entityDescriptors.tagNameIsPresent(tagName)) {
      var values = valueAccessor();
      var moduleName = (!isUndefined(values.params) ? fw.unwrap(values.params.name) : undefined) || element.getAttribute('module') || element.getAttribute('data-module');
      var bindModel = entityBinder.bind(null, element, values.params, bindingContext);
      var resource = entityDescriptors.resourceFor(tagName);
      var getResourceLocationFor = getResourceLocation.bind(resource);

      $flightTracker.name = moduleName;
      $flightTracker.type = tagName;

      if (isNull(moduleName) && isString(values)) {
        moduleName = values;
      }

      if (!isUndefined(moduleName) && !isNull(resource)) {
        var resourceLocation = getResourceLocationFor(moduleName);

        if (isString(resourceLocation)) {
          if (isFunction(require)) {
            if (!require.specified(resourceLocation)) {
              if (isPath(resourceLocation)) {
                resourceLocation = resourceLocation + resource.getFileName(moduleName);
              }
              resourceLocation = require.toUrl(resourceLocation);
            }

            require([resourceLocation], function(resource) {
              var args = Array.prototype.slice.call(arguments);
              bindModel(resource, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
            });
          } else {
            throw new Error('Uses require, but no AMD loader is present');
          }
        } else if (isFunction(resourceLocation)) {
          bindModel(resourceLocation, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
        } else if (isObject(resourceLocation)) {
          var createInstance = resourceLocation.createViewModel || resourceLocation.createDataModel;
          if(isObject(resourceLocation.instance)) {
            bindModel(resourceLocation.instance, $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          } else if (isFunction(createInstance)) {
            bindModel(createInstance(values.params, { element: element }), $flightTracker, $inFlightChildren, $outletsInFlightChildren);
          }
        }
      }

      return { 'controlsDescendantBindings': true };
    } else if (tagName === 'outlet') {
      // we patch in the 'name' of the outlet into the params valueAccessor on the component definition (if necessary and available)
      var outletName = element.getAttribute('name') || element.getAttribute('data-name');
      if(outletName) {
        theValueAccessor = function() {
          var valueAccessorResult = valueAccessor();
          if( !isUndefined(valueAccessorResult.params) && isUndefined(valueAccessorResult.params.name) ) {
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

// NOTE: Do not use the $router binding yet, it is incomplete
fw.bindingHandlers.$router = {
  preprocess: function(moduleName) {
    return "'" + moduleName + "'";
  },
  init: initEntityTag.bind(null, 'router')
};

// NOTE: Do not use the $viewModel binding yet, it is incomplete
fw.bindingHandlers.$viewModel = {
  preprocess: function(moduleName) {
    return "'" + moduleName + "'";
  },
  init: initEntityTag.bind(null, 'viewModel')
};

// framework/entities/lifecycle.js
// ------------------

// Provides lifecycle functionality and $context for a given entity and element
function setupContextAndLifeCycle(entity, element) {
  if (isEntity(entity) && !entity.__private('afterRenderWasTriggered')) {
    entity.__private('afterRenderWasTriggered', true);
    element = element || document.body;

    var context;
    var entityContext;
    var $configParams = entity.__private('configParams');
    if (element.tagName.toLowerCase() === 'binding-wrapper') {
      element = element.parentElement || element.parentNode;
    }

    entity.__private('element', element);
    entity.$context = entityContext = fw.contextFor(element);

    var afterRender = noop;
    if (isFunction($configParams.afterRender)) {
      afterRender = $configParams.afterRender;
    }

    var resolveFlightTracker = entity.__private('resolveFlightTracker') || noop;
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

    if (!isUndefined(element)) {
      fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
        entity.dispose();
      });
    }
  }
}

// framework/entities/applyBinding.js
// ------------------

var hasHTML5History = false;
var historyStateAssessed = false;

function assessHistoryState() {
  if(!historyStateAssessed) {
    historyStateAssessed = true;

    hasHTML5History = !!windowObject.history && !!windowObject.history.pushState;
    if(!isUndefined(windowObject.History) && isObject(windowObject.History.options) && windowObject.History.options.html4Mode) {
      // user is overriding to force html4mode hash-based history
      hasHTML5History = false;
    }
  }
}

// Override the original applyBindings method to assess history API state and provide viewModel/dataModel/router life-cycle
var originalApplyBindings = fw.applyBindings;
fw.applyBindings = function(viewModelOrBindingContext, rootNode) {
  // must initialize default require context (https://github.com/jrburke/requirejs/issues/1305#issuecomment-87924865)
  isFunction(require) && require([]);

  assessHistoryState();
  originalApplyBindings(viewModelOrBindingContext, rootNode);
  setupContextAndLifeCycle(viewModelOrBindingContext, rootNode);
};

// framework/entities/createFactories.js
// ------------------

function isBeforeInitMixin(mixin) {
  return !!mixin.runBeforeInit;
}

function entityMixinOrNothingFrom(thing) {
  return ((isArray(thing) && thing.length) || isObject(thing) ? thing : {});
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

  configParams = extend({}, descriptor.defaultConfig, configParams || {});

  var descriptorBehavior = [];
  map(descriptor.behavior, function(behavior, index) {
    descriptorBehavior.push(isFunction(behavior) ? behavior(descriptor, configParams) : behavior);
  });

  var ctor = configParams.initialize || noop;
  var userExtendProps = { mixin: configParams.extend || {} };
  if (!descriptor.isEntityCtor(ctor)) {
    var isEntityDuckTagMixin = {};
    isEntityDuckTagMixin[descriptor.isEntityDuckTag] = true;
    isEntityDuckTagMixin = { mixin: isEntityDuckTagMixin };

    var newInstanceCheckMixin = {
      _preInit: function() {
        if (this === windowObject) {
          throw new Error('Must use the new operator when instantiating a ' + descriptor.methodName + '.');
        }
      }
    };
    var afterInitMixins = reject(entityMixins, isBeforeInitMixin);
    var beforeInitMixins = map(filter(entityMixins, isBeforeInitMixin), function(mixin) {
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

  if (!isNull(entityCtor) && isFunction(configParams.parent)) {
    entityCtor.inherits(configParams.parent);
  }

  if (configParams.autoRegister) {
    descriptor.resource.register(configParams.namespace, entityCtor);
  }

  return entityCtor;
}

function createEntityFactories() {
  // create the class factory method for each entity descriptor
  filter(entityDescriptors, function getOnlyDescriptorsWithMethodName(descriptor) {
    return isString(descriptor.methodName);
  }).forEach(function setupClassFactory(descriptor) {
    fw[descriptor.methodName].create = entityClassFactory.bind(null, descriptor);
  });
};

runPostInit.unshift(createEntityFactories);

// framework/entities/init.js
// ----------------

function makeBooleanChecks(descriptor) {
  return {
    isEntityCtor: function isEntityCtor(thing) {
      return isFunction(thing) && !!thing[ descriptor.isEntityCtorDuckTag ];
    },
    isEntity: function isEntity(thing) {
      return isObject(thing) && !!thing[ descriptor.isEntityDuckTag ];
    }
  };
}

entityDescriptors = map(entityDescriptors, function prepareDescriptor(descriptor) {
  var methodName = descriptor.methodName.charAt(0).toUpperCase() + descriptor.methodName.slice(1);
  descriptor = extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    isEntityCtorDuckTag: '__is' + methodName + 'Ctor',
    isEntityDuckTag: '__is' + methodName,
    referenceNamespace: (isString(descriptor.methodName) ? ('__' + descriptor.methodName + 'Reference') : undefined)
  }, descriptor);

  return extend(descriptor, makeBooleanChecks(descriptor));
});

extend(entityDescriptors, {
  tagNameIsPresent: function isEntityTagNameDescriptorPresent(tagName) {
    return filter(this, function matchingTagNames(descriptor) {
      return descriptor.tagName === tagName;
    }).length > 0;
  },
  resourceFor: function getResourceForEntityTagName(tagName) {
    return reduce(this, function(resource, descriptor) {
      if(descriptor.tagName === tagName) {
        resource = descriptor.resource;
      }
      return resource;
    }, null);
  },
  getDescriptor: function getDescriptor(methodName) {
    return reduce(this, function reduceDescriptor(foundDescriptor, descriptor) {
      return descriptor.methodName === methodName ? descriptor : foundDescriptor;
    }, null);
  }
});

function getEntityComparator(methodName, compFunctions, entityDescriptor) {
  if(isFunction(entityDescriptor[methodName])) {
    compFunctions.push(entityDescriptor[methodName]);
  }
  return compFunctions;
}

runPostInit.unshift(function() {
  var entityCtorComparators = map(entityDescriptors, 'isEntityCtor');
  var entityComparators = map(entityDescriptors, 'isEntity');

  isEntityCtor = function(thing) {
    return reduce(entityCtorComparators, function(isThing, comparator) {
      return isThing || comparator(thing);
    }, false);
  };

  isEntity = function(thing) {
    return reduce(entityComparators, function(isThing, comparator) {
      return isThing || comparator(thing);
    }, false);
  };

  isDataModel = entityDescriptors.getDescriptor('dataModel').isEntity;
  isDataModelCtor = entityDescriptors.getDescriptor('dataModel').isEntityCtor;
  isRouter = entityDescriptors.getDescriptor('router').isEntity;
});


// framework/resource/init.js
// ------------------

var baseComponentLocation = {
  combined: null,
  viewModel: null,
  template: null
};

var originalComponentRegisterFunc = fw.components.register;

var defaultComponentFileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

var defaultComponentLocation = extend({}, baseComponentLocation, {
  viewModel: '/viewModel/',
  template: '/component/'
});


// framework/resource/proto.js
// ------------------

function isRegistered(descriptor, resourceName) {
  return !isUndefined( descriptor.registered[resourceName] );
};

function getRegistered(descriptor, resourceName) {
  return descriptor.registered[resourceName];
};

function register(descriptor, resourceName, resource) {
  descriptor.registered[resourceName] = resource;
};

function getModelExtension(dataModelExtensions, modelName) {
  var fileExtension = '';

  if( isFunction(dataModelExtensions) ) {
    fileExtension = dataModelExtensions(modelName);
  } else if( isString(dataModelExtensions) ) {
    fileExtension = dataModelExtensions;
  }

  return fileExtension.replace(/^\./, '') || '';
}

function getModelFileName(descriptor, modelName) {
  var modelResourceLocations = descriptor.resourceLocations;
  var fileName = modelName + '.' + getModelExtension(descriptor.fileExtensions(), modelName);

  if( !isUndefined( modelResourceLocations[modelName] ) ) {
    var registeredLocation = modelResourceLocations[modelName];
    if( isString(registeredLocation) && !isPath(registeredLocation) ) {
      // full filename was supplied, lets return that
      fileName = last( registeredLocation.split('/') );
    }
  }

  return fileName;
}

function setDefaultModelLocation(descriptor, path) {
  if( isString(path) ) {
    descriptor.defaultLocation = path;
  }

  return descriptor.defaultLocation;
}

function registerModelLocation(descriptor, modelName, location) {
  if( isArray(modelName) ) {
    each(modelName, function(name) {
      registerModelLocation(descriptor, name, location);
    });
  }
  descriptor.resourceLocations[ modelName ] = location;
}

function modelResourceLocation(descriptor, modelName) {
  return reduce(descriptor.resourceLocations, function(registeredLocation, location, registeredName) {
    if(!registeredLocation) {
      if(!isNull(registeredName.match(regExpMatch)) && !isNull(modelName.match(registeredName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if(modelName === registeredName) {
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
  if( isUndefined(modelName) ) {
    return descriptor.resourceLocations;
  }

  return modelResourceLocation(descriptor, modelName) || descriptor.defaultLocation;
}

var $globalNamespace = fw.namespace();
function getModelReferences(descriptor, namespaceName, options) {
  options = options || {};
  if( isString(namespaceName) || isArray(namespaceName) ) {
    options.namespaceName = namespaceName;
  }

  var references = reduce($globalNamespace.request(descriptor.referenceNamespace, extend({ includeOutlets: false }, options), true), function(models, model) {
    if(!isUndefined(model)) {
      var namespaceName = isNamespace(model.$namespace) ? model.$namespace.getName() : null;
      if(!isNull(namespaceName)) {
        if( isUndefined(models[namespaceName]) ) {
          models[namespaceName] = [model];
        } else {
          models[namespaceName].push(model);
        }
      }
    }
    return models;
  }, {});

  var referenceKeys = keys(references);
  if(isString(namespaceName)) {
    if(referenceKeys.length === 1) {
      return references[referenceKeys[0]] || [];
    }
    return [];
  }
  return references;
}

// framework/resource/component.js
// ------------------

fw.components.resourceLocations = {};

fw.components.fileExtensions = fw.observable( clone(defaultComponentFileExtensions) );

fw.components.register = function(componentName, options) {
  var viewModel = options.viewModel || options.dataModel || options.router;

  if( !isString(componentName) ) {
    throw new Error('Components must be provided a componentName.');
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || DefaultViewModel,
    template: options.template
  });
};

function getComponentExtension(componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions();
  var fileExtension = '';

  if( isFunction(componentExtensions) ) {
    fileExtension = componentExtensions(componentName)[fileType];
  } else if( isObject(componentExtensions) ) {
    if( isFunction(componentExtensions[fileType]) ) {
      fileExtension = componentExtensions[fileType](componentName);
    } else {
      fileExtension = componentExtensions[fileType] || '';
    }
  }

  return fileExtension.replace(/^\./, '') || '';
}

fw.components.getFileName = function(componentName, fileType) {
  var fileName = componentName;
  var fileExtension = getComponentExtension(componentName, fileType);

  if(fw.components.isRegistered(componentName)) {
    return null;
  }

  if(fw.components.locationIsRegistered(componentName)) {
    var registeredLocation = fw.components.getLocation(componentName);
    if(!isUndefined(registeredLocation[fileType]) && !isPath(registeredLocation[fileType])) {
      if(isString(registeredLocation[fileType])) {
        // full filename was supplied, lets return that
        fileName = last(registeredLocation[fileType].split('/'));
      } else {
        return null;
      }
    }
  }

  return fileName + (fileExtension !== getFilenameExtension(fileName) ? ('.' + fileExtension) : '');
};

fw.components.defaultLocation = function(location) {
  if( isString(location) ) {
    defaultComponentLocation = extend({}, baseComponentLocation, {
      viewModel: location,
      template: location
    });
  } else if(isObject(location)) {
    defaultComponentLocation = extend({}, baseComponentLocation, location);
  }

  return defaultComponentLocation;
};

fw.components.registerLocation = function(componentName, componentLocation, folderOffset) {
  if(isArray(componentName)) {
    each(componentName, function(name) {
      fw.components.registerLocation(name, componentLocation, folderOffset);
    });
  }

  if(isString(componentLocation)) {
    componentLocation = extend({}, baseComponentLocation, {
      viewModel: componentLocation,
      template: componentLocation,
      folderOffset: !!folderOffset
    });
  } else if(isObject(componentLocation)) {
    componentLocation.folderOffset = !!folderOffset;
  }

  fw.components.resourceLocations[componentName] = extend({}, baseComponentLocation, forceViewModelComponentConvention(componentLocation));
};

fw.components.getRegisteredLocation = function(componentName) {
  return reduce(fw.components.resourceLocations, function(registeredLocation, location, registeredComponentName) {
    if(!registeredLocation) {
      if(!isNull(registeredComponentName.match(regExpMatch)) && !isNull(componentName.match(registeredComponentName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if(componentName === registeredComponentName) {
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
  if( isUndefined(componentName) ) {
    return fw.components.resourceLocations;
  }
  return omitBy(fw.components.getRegisteredLocation(componentName) || defaultComponentLocation, isNull);
};

// framework/resource/createResource.js
// ------------------

// Create/extend all resource methods onto each descriptor.resource found inside an array of descriptors
function createResources(descriptors) {
  each(descriptors, function(descriptor) {
    if(!isUndefined(descriptor.resource)) {
      extend(descriptor.resource, resourceHelperFactory(descriptor));
    }
  });
};

runPostInit.push(function() {
  createResources(entityDescriptors);
});

// framework/resource/resourceHelperFactory.js
// ------------------

// assemble all resource methods for a given descriptor object
function resourceHelperFactory(descriptor) {
  var resourceMethods = {
    getFileName: getModelFileName.bind(null, descriptor),
    register: register.bind(null, descriptor),
    isRegistered: isRegistered.bind(null, descriptor),
    getRegistered: getRegistered.bind(null, descriptor),
    registerLocation: registerModelLocation.bind(null, descriptor),
    locationIsRegistered: modelLocationIsRegistered.bind(null, descriptor),
    getLocation: getModelResourceLocation.bind(null, descriptor),
    defaultLocation: setDefaultModelLocation.bind(null, descriptor),
    fileExtensions: descriptor.fileExtensions,
    resourceLocations: descriptor.resourceLocations
  };

  if(!isUndefined(descriptor.referenceNamespace)) {
    // Returns a reference to the specified models.
    // If no name is supplied, a reference to an array containing all viewModel references is returned.
    resourceMethods.getAll = getModelReferences.bind(null, descriptor);
  }

  return resourceMethods;
}


// framework/component/lifecycle.js
// ------------------

function clearSequenceQueue() {
  each(sequenceQueue, function(sequence, queueNamespace) {
    each(sequence, function(sequenceIteration) {
      sequenceIteration.addAnimationClass();
    });
    delete sequenceQueue[queueNamespace];
  });
}

function runAnimationClassSequenceQueue(queue, isRunner) {
  if(!queue.running || isRunner) {
    var sequenceIteration = queue.shift();

    if(sequenceIteration) {
      sequenceIteration.addAnimationClass();

      if(sequenceIteration.nextIteration || queue.length) {
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

var sequenceQueue = {};
function addToAndFetchQueue(element, viewModel) {
  var configParams = viewModel.__private('configParams');
  var sequenceTimeout = resultBound(configParams, 'sequenceAnimations', viewModel) || fw.settings.defaultAnimationSequence || 0;
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

function componentTriggerAfterRender(element, viewModel, $context) {
  if(isEntity(viewModel) && !viewModel.__private('afterRenderWasTriggered')) {
    viewModel.__private('afterRenderWasTriggered', true);

    function addAnimationClass() {
      var classList = element.className.split(" ");
      if(!includes(classList, outletLoadingDisplay) && !includes(classList, outletLoadedDisplay)) {
        var queue = addToAndFetchQueue(element, viewModel);
        var nearestOutlet = nearestEntity($context, isOutletViewModel);

        if(nearestOutlet) {
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
    (viewModel.__private('resolveFlightTracker') || noop)(addAnimationClass);
  }
}

// $life wrapper binding to provide lifecycle events for components
fw.virtualElements.allowedBindings.$life = true;
fw.bindingHandlers.$life = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    var classList = element.className.split(" ");
    if(!includes(classList, outletLoadingDisplay) && !includes(classList, outletLoadedDisplay)) {
      // the outlet viewModel and template binding handles its animation state
      addClass(element, entityClass);
    }

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if(isEntity(viewModel)) {
        viewModel.dispose();
      }
    });
  },
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    element = element.parentElement || element.parentNode;

    // if this element is not the 'loading' component of an outlet, then we need to
    // trigger the onComplete callback
    var $parent = bindingContext.$parent;
    if(isObject($parent) && isObservable($parent.route) && $parent.__isOutlet) {
      var parentRoute = $parent.route.peek();
      var classList = element.className.split(" ");
      if (!includes(classList, outletLoadingDisplay) && isFunction(parentRoute.getOnCompleteCallback)) {
        parentRoute.getOnCompleteCallback(element)();
      }
    }

    componentTriggerAfterRender(element, bindingContext.$data, bindingContext);
  }
};

// Custom loader used to wrap components with the $life custom binding
fw.components.loaders.unshift( fw.components.componentWrapper = {
  loadTemplate: function(componentName, config, callback) {
    if(!isInternalComponent(componentName)) {
      // TODO: Handle different types of configs
      if(isString(config)) {
        config = '<!-- ko $life -->' + config + '<!-- /ko -->';
      } else {
        throw new Error('Unhandled config type ' + typeof config + '.');
      }
      fw.components.defaultLoader.loadTemplate(componentName, config, callback);
    } else {
      callback(null);
    }
  },
  loadViewModel: function(componentName, config, callback) {
    var ViewModel = config.viewModel || config;
    if(!isInternalComponent(componentName)) {
      callback(function(params, componentInfo) {
        var componentElement = componentInfo.element;
        if(isFunction(ViewModel)) {
          return new ViewModel(params);
        }
        return ViewModel;
      });
    } else {
      callback(null);
    }
  }
});

// framework/component/loader.js
// ------------------

// This loader is a catch-all in the instance a registered component cannot be found.
// The loader will attempt to use requirejs via knockouts integrated support if it is available.
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

    if(folderOffset !== '') {
      folderOffset = componentName + '/';
    }

    if(isFunction(require)) {
      // load component using knockouts native support for requirejs
      if(require.specified(componentName)) {
        // component already cached, lets use it
        configOptions = {
          require: componentName
        };
      } else if(isString(componentLocation.combined)) {
        combinedPath = componentLocation.combined;

        if(isPath(combinedPath)) {
          combinedPath = combinedPath + folderOffset + combinedFile;
        }

        configOptions = {
          require: require.toUrl(combinedPath)
        };
      } else {
        // check to see if the requested component is template only and should not request a viewModel (we supply a dummy object in its place)
        if(!isString(componentLocation.viewModel)) {
          // template-only component, substitute with 'blank' viewModel
          viewModelConfig = DefaultViewModel;
        } else {
          viewModelPath = componentLocation.viewModel;

          if(isPath(viewModelPath)) {
            viewModelPath = viewModelPath + folderOffset + viewModelFile;
          }

          if(getFilenameExtension(viewModelPath) !== getComponentExtension(componentName, 'viewModel')) {
            viewModelPath += '.' + getComponentExtension(componentName, 'viewModel');
          }

          viewModelConfig = { require: require.toUrl(viewModelPath) };
        }

        templatePath = componentLocation.template;
        if(isPath(templatePath)) {
          templatePath = templatePath + folderOffset + templateFile;
        }

        if(getFilenameExtension(templatePath) !== getComponentExtension(componentName, 'template')) {
          templatePath += '.' + getComponentExtension(componentName, 'template');
        }

        templatePath = 'text!' + templatePath;

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

          if($nearestEntity) {
            $parentsInFlightChildren = $nearestEntity.__private('inFlightChildren');
          }
          if($nearestOutlet) {
            $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
          }

          if (isEntity(viewModel)) {
            var resolveFlightTracker =  noop;

            if ($flightTracker) {
              resolveFlightTracker = function(addAnimationClass) {
                var wasResolved = false;
                function resolveThisEntityNow(isResolved) {
                  function finishResolution() {
                    addAnimationClass();
                    if(fw.isObservable($parentsInFlightChildren) && isFunction($parentsInFlightChildren.remove)) {
                      $parentsInFlightChildren.remove($flightTracker);
                    }
                    if(fw.isObservable($outletsInFlightChildren) && isFunction($outletsInFlightChildren.remove)) {
                      $outletsInFlightChildren.remove($flightTracker);
                    }
                  }

                  if (!wasResolved) {
                    wasResolved = true;
                    if (isResolved === true) {
                      finishResolution();
                    } else if(isPromise(isResolved) || (isArray(isResolved) && every(isResolved, isPromise))) {
                      var promises = [].concat(isResolved);
                      var checkPromise = function(promise) {
                        (promise.done || promise.then).call(promise, function() {
                          if(every(promises, promiseIsResolvedOrRejected)) {
                            finishResolution();
                          }
                        });
                      };

                      each(promises, checkPromise);
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
  if(isString(config['require'])) {
    if(isFunction(require)) {
      require([config['require']], callback, function() {
        each(activeOutlets(), function(outlet) {
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

// Note that this is a direct lift from the knockoutjs source
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

// Note that this is a direct lift from the knockoutjs source
function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
  // On the first call in the stack, start with the full set of loaders
  if(!candidateLoaders) {
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

// Note that this is a direct lift from the knockoutjs source
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

// Note that this is a direct lift from the knockoutjs source
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


// These are tags which are ignored by the custom component loader
// Sourced from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var nonComponentTags = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bgsound',
  'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
  'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element',
  'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'g', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label',
  'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'nobr',
  'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'polygon', 'path', 'pre',
  'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'spacer',
  'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea',
  'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'xmp', 'rect', 'image',
  'lineargradient', 'stop', 'line', 'binding-wrapper', 'font'
];

fw.components.getNormalTagList = function() {
  return clone(nonComponentTags);
};

fw.components.getComponentNameForNode = function(node) {
  var tagName = isString(node.tagName) && node.tagName.toLowerCase();

  if( fw.components.isRegistered(tagName) || fw.components.tagIsComponent(tagName) ) {
    return tagName;
  }
  return null;
};

fw.components.tagIsComponent = function(tagName, isComponent) {
  if( isUndefined(isComponent) ) {
    return indexOf(nonComponentTags, tagName) === -1;
  }

  if( isArray(tagName) ) {
    each(tagName, function(tag) {
      fw.components.tagIsComponent(tag, isComponent);
    });
  }

  if(isComponent !== true) {
    if( includes(nonComponentTags, tagName) === false ) {
      nonComponentTags.push(tagName);
    }
  } else {
    nonComponentTags = filter(nonComponentTags, function(nonComponentTagName) {
      return nonComponentTagName !== tagName;
    });
  }
};

fw.component = function(componentDefinition) {
  if(!isObject(componentDefinition)) {
    throw new Error('fw.component() must be supplied with a componentDefinition configuration object.');
  }

  componentDefinition.viewModel = componentDefinition.dataModel || componentDefinition.router || componentDefinition.viewModel;

  return componentDefinition;
};

// framework/collection/defaultConfig.js
// ------------------

var defaultCollectionConfig = {
  namespace: null,
  url: null,
  dataModel: null,
  idAttribute: null,
  disposeOnRemove: true,
  parse: identity,
  ajaxOptions: {}
};

// framework/collection/utility.js
// ------------------

function isCollection(thing) {
  return isObject(thing) && !!thing.__isCollection;
}

// framework/collection/collection.js
// ------------------

function removeDisposeAndNotify(originalFunction) {
  var removedItems = originalFunction.apply(this, Array.prototype.slice.call(arguments).splice(1));
  this.__private('configParams').disposeOnRemove && invokeMap(removedItems, 'dispose');
  this.$namespace.publish('_.remove', removedItems);
  return removedItems;
}

function addAndNotify(originalFunction) {
  var addItems = map(Array.prototype.slice.call(arguments).splice(1), this.__private('castAs').dataModel);
  var originalResult = originalFunction.apply(this, addItems);
  this.$namespace.publish('_.add', addItems);
  return originalResult;
}

var PlainCollectionConstructor;

fw.collection = function(collectionData) {
  collectionData = collectionData || [];

  if(isUndefined(PlainCollectionConstructor)) {
    PlainCollectionConstructor = fw.collection.create();
  }
  return PlainCollectionConstructor(collectionData);
};

fw.collection.create = function(configParams) {
  configParams = configParams || {};

  return function CollectionConstructor(collectionData) {
    configParams = extend({}, defaultCollectionConfig, configParams);
    var DataModelCtor = configParams.dataModel;
    var collection = fw.observableArray();
    var privateStuff = {
      castAs: {
        modelData: function(modelData, attribute) {
          if(isDataModel(modelData)) {
            return modelData.getData(attribute);
          }
          if(isUndefined(attribute)) {
            return modelData;
          }
          return result(modelData, attribute);
        },
        dataModel: function(modelData) {
          return isDataModelCtor(DataModelCtor) && !isDataModel(modelData) ? (new DataModelCtor(modelData)) : modelData;
        }
      },
      getIdAttribute: function(options) {
        var idAttribute = configParams.idAttribute || (options || {}).idAttribute;
        if(isUndefined(idAttribute) || isNull(idAttribute)) {
          if(isDataModelCtor(DataModelCtor)) {
            return DataModelCtor.__private('configParams').idAttribute;
          }
        }
        return idAttribute || 'id';
      }
    };

    extend(collection, collectionMethods, {
      $namespace: fw.namespace(configParams.namespace || uniqueId('collection')),
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
        if(!collection.isDisposed) {
          collection.isDisposed = true;
          collection.$namespace.dispose();
          invokeMap(collection(), 'dispose');
        }
      }
    });

    collection.requestInProgress = fw.pureComputed(function() {
      return this.isFetching() || this.isCreating();
    }, collection);

    if(collectionData) {
      collection.set(collectionData);
    }

    return collection;
  };
};

// framework/collection/collectionMethods.js
// ------------------

var collectionMethods = fw.collection.methods = {
  sync: function() {
    return fw.sync.apply(this, arguments);
  },
  get: function(id) {
    var collection = this;
    return find(collection(), function findModelWithId(model) {
      return result(model, collection.__private('getIdAttribute')()) === id || result(model, '$id') === id || result(model, '$cid') === id;
    });
  },
  getData: function() {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    return reduce(collection(), function(models, model) {
      models.push(castAsModelData(model));
      return models;
    }, []);
  },
  toJSON: function() {
    return JSON.stringify(this.getData());
  },
  pluck: function(attribute) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    return reduce(collection(), function(pluckedValues, model) {
      pluckedValues.push(castAsModelData(model, attribute));
      return pluckedValues;
    }, []);
  },
  set: function(newCollection, options) {
    if(!isArray(newCollection)) {
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

    each(newCollection, function checkModelPresence(modelData) {
      var modelPresent = false;
      modelData = castAsModelData(modelData);

      if(!isUndefined(modelData)) {
        each(collectionStore, function lookForModel(model, indexOfModel) {
          var collectionModelData = castAsModelData(model);

          if(!isUndefined(modelData[idAttribute]) && !isNull(modelData[idAttribute]) && modelData[idAttribute] === collectionModelData[idAttribute]) {
            modelPresent = true;
            if(options.merge !== false && !sortOfEqual(collectionModelData, modelData)) {
              // found model, but needs an update
              if(isFunction(model.set)) {
                model.set.call(model, modelData);
              } else {
                collectionStore[indexOfModel] = modelData;
              }
              collection.$namespace.publish('_.change', model);
              affectedModels.push(model);
            }
          }
        });

        if(!modelPresent && options.add !== false) {
          // not found in collection, we have to add this model
          var newModel = castAsDataModel(modelData);
          collectionStore.push(newModel);
          affectedModels.push(newModel);
          addedModels.push(newModel);
          collection.$namespace.publish('_.add', newModel);
        }
      }
    });

    if(options.remove !== false) {
      each(collectionStore, function checkForRemovals(model, indexOfModel) {
        var collectionModelData = castAsModelData(model);
        var modelPresent = false;

        if(collectionModelData) {
          modelPresent = reduce(newCollection, function(isPresent, modelData) {
            return isPresent || result(modelData, idAttribute) === collectionModelData[idAttribute];
          }, false);
        }

        if(!modelPresent) {
          // model currently in collection not found in the supplied newCollection so we need to mark it for removal
          absentModels.push(model);
          affectedModels.push(model);
        }
      });

      if(absentModels.length) {
        each(absentModels, function(modelToRemove) {
          var indexOfModelToRemove = collectionStore.indexOf(modelToRemove);
          if(indexOfModelToRemove > -1) {
            collectionStore.splice(indexOfModelToRemove, 1);
          }
        });
        collection.$namespace.publish('_.remove', absentModels);
      }
    }

    // re-sort based on the newCollection
    var reSorted = [];
    var wasResorted = false;
    each(newCollection, function(newModelData, modelIndex) {
      newModelData = castAsModelData(newModelData);
      var foundAtIndex = null;
      var currentModel = find(collectionStore, function(model, theIndex) {
        if(sortOfEqual(castAsModelData(model), newModelData)) {
          foundAtIndex = theIndex;
          return true;
        }
      });
      reSorted.push(currentModel);
      wasResorted = wasResorted || foundAtIndex !== modelIndex;
    });

    wasResorted = (wasResorted && reSorted.length && every(reSorted));

    if(wasResorted) {
      Array.prototype.splice.apply(collectionStore, [0, reSorted.length].concat(reSorted));
    }

    if(wasResorted || addedModels.length || absentModels.length || affectedModels.length) {
      collection.notifySubscribers();
    }

    return affectedModels;
  },
  reset: function(newCollection) {
    var collection = this;
    var oldModels = collection.removeAll();
    var castAsDataModel = collection.__private('castAs').dataModel;

    collection(reduce(newCollection, function(newModels, modelData) {
      newModels.push(castAsDataModel(modelData));
      return newModels;
    }, []));

    collection.$namespace.publish('_.reset', { newModels: collection(), oldModels: oldModels });

    return collection();
  },
  fetch: function(options) {
    var collection = this;
    var configParams = collection.__private('configParams');
    options = options ? clone(options) : {};

    var requestInfo = {
      requestRunning: collection.isFetching,
      requestLull: configParams.requestLull,
      entity: collection,
      createRequest: function() {
        if(isUndefined(options.parse)) {
          options.parse = true;
        }

        var xhr = collection.sync('read', collection, options);

        return (xhr.done || xhr.then).call(xhr, function(resp) {
          var method = options.reset ? 'reset' : 'set';
          resp = configParams.parse(resp);
          var touchedModels = collection[method](resp, options);
          collection.$namespace.publish('_.change', { touched: touchedModels, serverResponse: resp, options: options });
        });
      }
    };

    return makeOrGetRequest('fetch', requestInfo);
  },
  where: function(modelData, options) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    options = options || {};
    modelData = castAsModelData(modelData);

    return reduce(collection(), function findModel(foundModels, model) {
      var thisModelData = castAsModelData(model);
      if(regExpIsEqual(modelData, thisModelData, options.isEqual)) {
        foundModels.push(options.getData ? thisModelData : model);
      }
      return foundModels;
    }, []);
  },
  findWhere: function(modelData, options) {
    var collection = this;
    var castAsModelData = collection.__private('castAs').modelData;
    options = options || {};
    modelData = castAsModelData(modelData);

    return reduce(collection(), function findModel(foundModel, model) {
      var thisModelData = castAsModelData(model);
      if(isNull(foundModel) && regExpIsEqual(modelData, thisModelData, options.isEqual)) {
        return options.getData ? thisModelData : model;
      }
      return foundModel;
    }, null);
  },
  addModel: function(models, options) {
    var collection = this;
    var affectedModels = [];
    options = options || {};

    if(isObject(models)) {
      models = [models];
    }
    if(!isArray(models)) {
      models = !isUndefined(models) && !isNull(models) ? [models] : [];
    }

    if(models.length) {
      var collectionData = collection();
      var castAsDataModel = collection.__private('castAs').dataModel;
      var castAsModelData = collection.__private('castAs').modelData;
      var idAttribute = collection.__private('getIdAttribute')();

      if(isNumber(options.at)) {
        var newModels = map(models, castAsDataModel);

        collectionData.splice.apply(collectionData, [options.at, 0].concat(newModels));
        affectedModels.concat(newModels);
        collection.$namespace.publish('_.add', newModels);

        collection.valueHasMutated();
      } else {
        each(models, function checkModelPresence(modelData) {
          var modelPresent = false;
          var theModelData = castAsModelData(modelData);

          each(collectionData, function lookForModel(model) {
            var collectionModelData = castAsModelData(model);

            if(!isUndefined(theModelData[idAttribute]) && !isNull(theModelData[idAttribute]) && theModelData[idAttribute] === collectionModelData[idAttribute]) {
              modelPresent = true;
              if(options.merge && !sortOfEqual(theModelData, collectionModelData)) {
                // found model, but needs an update
                (model.set || noop).call(model, theModelData);
                collection.$namespace.publish('_.change', model);
                affectedModels.push(model);
              }
            }
          });

          if(!modelPresent) {
            // not found in collection, we have to add this model
            var newModel = castAsDataModel(modelData);
            collection.push(newModel);
            affectedModels.push(newModel);
          }
        });
      }
    }

    return affectedModels;
  },
  create: function(model, options) {
    var collection = this;
    var castAsDataModel = collection.__private('castAs').dataModel;
    var configParams = collection.__private('configParams');
    options = options ? clone(options) : {};

    var requestInfo = {
      requestRunning: collection.isCreating,
      requestLull: configParams.requestLull,
      entity: collection,
      allowConcurrent: true,
      createRequest: function() {
        var newModel = castAsDataModel(model);
        var xhr;

        if(isDataModel(newModel)) {
          xhr = newModel.save();

          if(options.wait) {
            (xhr.done || xhr.then).call(xhr, function() {
              collection.addModel(newModel);
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

    if(!isDataModelCtor(configParams.dataModel)) {
      throw new Error('No dataModel specified, cannot create() a new collection item');
    }

    return makeOrGetRequest('create', requestInfo);
  },
  removeModel: function(models) {
    var collection = this;
    var affectedModels = [];

    if(isObject(models)) {
      models = [models];
    }
    if(!isArray(models)) {
      models = !isUndefined(models) && !isNull(models) ? [models] : [];
    }

    return reduce(models, function(removedModels, model) {
      var removed = null;
      if(isDataModel(model)) {
        removed = collection.remove(model);
      } else {
        var modelsToRemove = collection.where(model);
        if(!isNull(modelsToRemove)) {
          removed = collection.removeAll(modelsToRemove);
        }
      }

      if(!isNull(removed)) {
        return removedModels.concat(removed);
      }
      return removedModels;
    }, []);
  }
};



// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  targetElement = targetElement || windowObject.document.body;
  fw.applyBindings({}, targetElement);
};

each(runPostInit, function(runTask) {
  runTask();
});


      return fw;
    })(root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter, root.reqwest, root.Conduit, root.D);
  })();
}));
