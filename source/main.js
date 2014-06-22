// main.js
// -----------

// Record the footwork version as of this build.
ko._footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
ko.embed = embedded;

//polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

//see http://patik.com/blog/complete-cross-browser-console-log/
// Tell IE9 to use its built-in console
var treatAsIE8 = false;
if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {
  try {
    ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
      .forEach(function(method) {
        console[method] = this.call(console[method], console);
      }, Function.prototype.bind);
  } catch (ex) {
    treatAsIE8 = true;
  }
}

// misc utility noop function
var noop = function() { };

// Initialize the debugLevel observable, this controls
// what level of debug statements are logged to the console
// 0 === off
// 1 === errors
// 2 === notices (very noisy)
ko.debugLevel = ko.observable(0);

// internal logging method used when debugging is on
ko.log = function() {
  if(ko.debugLevel() > 2) {
    // originally sourced from Durandal (http://durandaljs.com/)
    try {
      // Modern browsers
      if (typeof console != 'undefined' && typeof console.log == 'function') {
        // Opera 11
        if (window.opera) {
          var i = 0;
          while (i < arguments.length) {
            console.log('Item ' + (i + 1) + ': ' + arguments[i]);
            i++;
          }
        }
        // All other modern browsers
        else if ((slice.call(arguments)).length == 1 && typeof slice.call(arguments)[0] == 'string') {
          console.log((slice.call(arguments)).toString());
        } else {
          console.log.apply(console, slice.call(arguments));
        }
      }
      // IE8
      else if ((!Function.prototype.bind || treatAsIE8) && typeof console != 'undefined' && typeof console.log == 'object') {
        Function.prototype.call.call(console.log, console, slice.call(arguments));
      }

      // IE7 and lower, and other old browsers
    } catch (ignore) { }
  }
};

ko.logError = function(error, err) {
  if(ko.debugLevel() > 1) {
    // originally sourced from Durandal (http://durandaljs.com/)
    var exception;
    
    if(error instanceof Error){
      exception = error;
    } else {
      exception = new Error(error);
    }
    
    exception.innerError = err;
    
    //Report the error as an error, not as a log
    try {
      // Modern browsers (it's only a single item, no need for argument splitting as in log() above)
      if (typeof console != 'undefined' && typeof console.error == 'function') {
        console.error(exception);
      }
      // IE8
      else if ((!Function.prototype.bind || treatAsIE8) && typeof console != 'undefined' && typeof console.error == 'object') {
        Function.prototype.call.call(console.error, console, exception);
      }
      // IE7 and lower, and other old browsers
    } catch (ignore) { }

    throw exception;
  }
};

// Preserve the original applyBindings method for later use
var applyBindings = ko.applyBindings;

// Override the original applyBindings method to provide and enable 'model' life-cycle hooks/events.
ko.applyBindings = function(model, element) {
  applyBindings(model, element);

  if(typeof model !== undefined && typeof model.startup === 'function' && typeof model._options !== 'undefined') {
    if(model._options.startup !== false) {
      model.startup();
    }
    if(typeof model._modelOptions.afterBinding === 'function') {
      model._modelOptions.afterBinding.call(model);
    }
  }
};

//import("model-namespace.js");
//import("component.js");
//import("broadcast-receive.js");
//import("bindingHandlers.js");
//import("extenders.js");
//import("router.js");