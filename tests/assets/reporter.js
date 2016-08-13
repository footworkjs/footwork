define(['lodash', 'jquery'],
  function(_, $) {
    /**
     * This module bootstraps the 'reporter' used to hook into for the HTML display of
     * the tests when you debug in a browser.
     */

    var JsApiReporter = jasmine.JsApiReporter;
    function Env(options) {
      JsApiReporter.call(this, options);

      this.specStarted = function(result) {
        this.currentSpec = result;
      };

      this.specDone = function(result) {
        this.currentSpec = null;
      };
    }
    environment = new Env({
      timer: new jasmine.Timer()
    });

    var env = jasmine.getEnv();
    var jasmineInterface = {
      describe: function(description, specDefinitions) {
        currentDescription = description;
        return env.describe(description, specDefinitions);
      },

      xdescribe: function(description, specDefinitions) {
        testResults.pending++;
        return env.xdescribe(description, specDefinitions);
      },

      it: function(desc, func) {
        makeTestContainer(currentDescription + ' ' + desc);
        return env.it(desc, func);
      },

      xit: function(desc, func) {
        testResults.pending++;
        var $wrapper = makeTestContainer(currentDescription + ' ' + desc);
        $wrapper.removeClass('running').removeClass('waiting').addClass('pending');
        $wrapper.find('.icon-play')
          .removeClass('icon-play')
          .addClass('icon-clock-o');
        return env.xit(desc, func);
      },

      beforeEach: function(beforeEachFunction) {
        return env.beforeEach(beforeEachFunction);
      },

      afterEach: function(afterEachFunction) {
        return env.afterEach(afterEachFunction);
      },

      expect: function(actual) {
        return env.expect(actual);
      },

      pending: function() {
        testResults.pending++;
        var $wrapper = makeTestContainer(currentDescription + ' ' + desc);
        $wrapper.removeClass('running').removeClass('waiting').addClass('pending');
        $wrapper.find('.icon-play')
          .removeClass('icon-play')
          .addClass('icon-clock-o');
        return env.pending();
      },

      spyOn: function(obj, methodName) {
        return env.spyOn(obj, methodName);
      },

      addCustomEqualityTester: function(tester) {
        env.addCustomEqualityTester(tester);
      },

      jsApiReporter: new jasmine.JsApiReporter({
        timer: new jasmine.Timer()
      })
    };

    jasmine.addCustomEqualityTester = function(tester) {
      env.addCustomEqualityTester(tester);
    };
    jasmine.addMatchers = function(matchers) {
      return env.addMatchers(matchers);
    };

    if (typeof window === "undefined" && typeof exports === "object") {
      _.extend(exports, jasmineInterface);
    } else {
      _.extend(window, jasmineInterface);
    }

    jasmine.getEnv().addReporter(environment);
  }
);
