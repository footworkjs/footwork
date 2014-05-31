define(["riveter", "underscore", "postal", "knockout"],
  function(riveter, _, postal, ko) {
    // TODO: create build process which adds these dependencies in
    // https://github.com/toddmotto/apollo
    var Apollo = (function () {
      'use strict';

      var exports = {}, _hasClass, _addClass, _removeClass, _toggleClass;

      var _forEach = function (classes, callback) {
        if (Object.prototype.toString.call(classes) !== '[object Array]') {
          classes = classes.split(' ');
        }
        for (var i = 0; i < classes.length; i++) {
          callback(classes[i], i);
        }
      };

      if (document.documentElement.classList) {
        _hasClass = function (elem, className) {
          return elem.classList.contains(className);
        };
        _addClass = function (elem, className) {
          elem.classList.add(className);
        };
        _removeClass = function (elem, className) {
          elem.classList.remove(className);
        };
        _toggleClass = function (elem, className) {
          elem.classList.toggle(className);
        };
      } else {
        _hasClass = function (elem, className) {
          return new RegExp('(^|\\s)' + className + '(\\s|$)').test(elem.className);
        };
        _addClass = function (elem, className) {
          if (!exports.hasClass(elem, className)) {
            elem.className += (elem.className ? ' ' : '') + className;
          }
        };
        _removeClass = function (elem, className) {
          if (exports.hasClass(elem, className)) {
            elem.className = elem.className.replace(new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'), '');
          }
        };
        _toggleClass = function (elem, className) {
          var toggle = exports.hasClass(elem, className) ? exports.removeClass : exports.addClass;
          toggle(elem, className);
        };
      }

      exports.hasClass = function (elem, className) {
        return _hasClass(elem, className);
      };

      exports.addClass = function (elem, classes) {
        _forEach(classes, function (className) {
          _addClass(elem, className);
        });
      };

      exports.removeClass = function (elem, classes) {
        _forEach(classes, function (className) {
          _removeClass(elem, className);
        });
      };

      exports.toggleClass = function (elem, classes) {
        _forEach(classes, function (className) {
          _toggleClass(elem, className);
        });
      };

      return exports;
    })();

    var applyBindings = ko.applyBindings;
    ko.applyBindings = function(model, element) {
      applyBindings(model, element);
      if(typeof model.startup === 'function' && model._options !== undefined) {
        if(model._options.startup !== false) {
          model.startup();
        }
        if(typeof model._modelOptions.afterBinding === 'function') {
          model._modelOptions.afterBinding.call(model);
        }
      }
    };

    ko.bindingHandlers.registerElement = {
      preprocess: function (value) {
        return '\'' + value + '\'';
      },
      init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var elOption = ko.unwrap(valueAccessor()),
          refresh,
          defaultOptions = {
            name: element.getAttribute('id') || element.getAttribute('name'),
            context: 'relative'
          };

        if (typeof elOption === 'string') {
          elOption = _.extend(defaultOptions, { name: elOption });
        } else if (typeof elOption === 'object') {
          elOption = _.extend(defaultOptions, elOption);
        }

        if (typeof viewModel.el !== 'object') {
          viewModel.el = {};
        }

        viewModel.el[ elOption.name ] = element;
      }
    };

    /**
     * Source: https://github.com/SteveSanderson/knockout/wiki/Bindings---class
     */
    ko.bindingHandlers['class'] = {
      'update': function( element, valueAccessor ) {
        if( element['__ko__previousClassValue__'] ) {
          Apollo.removeClass(element, element['__ko__previousClassValue__']);
        }
        var value = ko.utils.unwrapObservable(valueAccessor());
        value !== undefined && Apollo.addClass(element, value);
        element['__ko__previousClassValue__'] = value;
      }
    };

    ko.bindingHandlers['stopBinding'] = {
      init: function() {
        return { controlsDescendantBindings: true };
      }
    };
    
    // custom throttle() based on ko v3.0.0 throttle(), allows value to be force()'d to a value at any time
    ko.extenders.throttle = function(target, opt) {
      if( typeof opt === 'number' ) {
        opt = {
          timeout: opt,
          when: function() { return true; } // default always throttle
        };
      }

      target.throttleEvaluation = opt.timeout;

      var writeTimeoutInstance = null,
          throttledTarget = ko.dependentObservable({
              'read': target,
              'write': function(value) {
                if( opt.when(value) ) {
                  clearTimeout(writeTimeoutInstance);
                  writeTimeoutInstance = setTimeout(function() {
                    target(value);
                  }, opt.timeout);
                } else {
                  clearTimeout(writeTimeoutInstance);
                  target(value);
                }
              }
          });

      throttledTarget.force = function( value ) {
        clearTimeout(writeTimeoutInstance);
        target(value);
      };

      return throttledTarget;
    };

    ko.extenders.autoDisable = function( target, delay ) {
      return target.extend({
        delayTrigger: {
          delay: delay || 0,
          trigger: function( target ) { target( false ); }
        }
      });
    };

    ko.extenders.autoEnable = function( target, delay ) {
      return target.extend({
        delayTrigger: {
          delay: delay || 0,
          trigger: function( target ) { target( true ); }
        }
      });
    };

    ko.extenders.delayTrigger = function( target, options ) {
      var delay = 300,
          triggerFunc = function() {},
          trigger;

      if( typeof options === 'object' ) {
        delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
        triggerFunc = options.trigger || triggerFunc;
      } else {
        delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
      }

      var clearTrigger = function() {
        clearTimeout( trigger );
        trigger = undefined;
      };

      var delayedObservable = ko.computed({
        read: target,
        write: function( state ) {
          target( state );

          if( trigger !== undefined ) {
            clearTrigger();
          }

          trigger = setTimeout(function() {
            triggerFunc( target, options );
          }.bind(target), delayedObservable.triggerDelay);
        }
      });
      delayedObservable.clearTrigger = clearTrigger;
      delayedObservable.triggerDelay = delay;

      return delayedObservable;
    };

    ko.extenders.delayWrite = function( target, options ) {
      var filter, delay = 300;

      if( typeof options === 'object' ) {
        delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
        filter = options.filter || function() { return true; };
      } else {
        delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
      }

      return ko.computed({
        read: target,
        write: function( writeValue ) {
          if( filter( writeValue ) ) {
            if(target._delayWriteTimer) {
              clearTimeout( this._delayWriteTimer );
            }
            target._delayWriteTimer = setTimeout(function() {
              target( writeValue );
            }, delay);
          } else {
            target( writeValue );
          }
        }
      });
    };

    //     this.myValue = ko.observable().receiveFrom('Namespace' / Namespace, 'varName');
    ko.subscribable.fn.receiveFrom = function(namespace, variable) {
      var target = this,
          observable = this,
          channel;

      if( _.isObject(namespace) === true && namespace.channel !== undefined ) {
        channel = namespace;
      } else if(typeof namespace === 'string') {
        channel = postal.channel( namespace );
      } else {
        throw 'Invalid namespace [' + typeof namespace + ']';
      }

      observable = ko.computed({
        read: target,
        write: function( value ) {
          channel.publish( 'change.' + variable, value );
        }
      });

      observable.refresh = function() {
        channel.publish( 'refresh.' + variable );
      };
      channel.subscribe( variable, function( newValue ) {
        target( newValue );
      });

      observable.__isReceived = true;
      return observable;
    };

    //     this.myValue = ko.observable().broadcastAs('NameOfVar');
    //     this.myValue = ko.observable().broadcastAs('NameOfVar', isWritable);
    //     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', writable: true });
    //     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: Namespace });
    ko.subscribable.fn.broadcastAs = function(varName, option) {
      var observable = this, channel;

      if(_.isObject(varName) === true) {
        option = varName;
      } else {
        if( typeof option === 'boolean' ) {
          option = {
            name: varName,
            writable: option
          };
        } else if( _.isObject(option) === true ) {
          option = _.extend({
            name: varName
          }, option);
        } else {
          option = {
            name: varName
          };
        }
      }
      channel = option.namespace || ko.currentNamespace();

      if( option.writable ) {
        channel.subscribe( 'change.' + option.name, function( newValue ) {
          observable( newValue );
        });
      }

      channel.subscribe( 'refresh.' + option.name, function() {
        channel.publish( option.name, observable() );
      });
      observable.subscribe(function( newValue ) {
        channel.publish( option.name, newValue );
      });

      observable.__isBroadcast = true;
      return observable;
    };

    ko.__nsStack = [];
    ko.namespace = function(namespaceName) {
      return postal.channel(namespaceName);
    };
    ko.currentNamespace = function() {
      return ko.namespace(ko.__nsStack[0]);
    };
    ko.enterNamespace = function(namespaceName) {
      ko.__nsStack.unshift( namespaceName );
    };
    ko.exitNamespace = function() {
      ko.__nsStack.shift();
    };
    ko.modelCount = function() {
      var counts = _.reduce(namespaceNameCounter, function(modelCounts, modelCount, modelName) {
        modelCounts[modelName] = modelCount + 1;
        return modelCounts;
      }, {});
      counts.__total = _.reduce(_.values(counts), function(summation, num) {
        return summation + num;
      }, 0);
      return counts;
    };
    ko.getModels = function() {
      return models;
    };
    ko.debugModels = function(state) {
      debugModels = state;
    };
    ko.refreshModels = function() {
      _.invoke(ko.getModels(), 'refreshReceived');
    };
    var models = {},
        modelNum = 0,
        debugModels = false;

    var namespaceNameCounter = {};
    var indexedNamespaceName = function(name, autoIncrement) {
      if(namespaceNameCounter[name] === undefined) {
        namespaceNameCounter[name] = 0;
      } else {
        namespaceNameCounter[name]++;
      }
      return name + ((autoIncrement === true && namespaceNameCounter[name] > 0) ? namespaceNameCounter[name] : '');
    };

    ko.model = function(modelOptions) {
      modelOptions = _.extend({
        namespace: undefined,
        autoIncrement: false,
        mixins: undefined,
        params: undefined,
        afterBinding: function() {},
        factory: function() {}
      }, modelOptions);

      var viewModel = {
        _preInit: function( options ) {
          modelOptions.namespace = indexedNamespaceName(modelOptions.namespace, modelOptions.autoIncrement);

          this._modelOptions = modelOptions;
          ko.enterNamespace(modelOptions.namespace);

          this._options = _.extend({
            namespace: modelOptions.namespace || ('namespace' + modelNum)
          }, options);
          modelNum++;

          this.namespace = ko.namespace( this.namespace = this._options.namespace );
          if(ko.currentNamespace().channel !== '/') {
            this.namespace = ko.currentNamespace();
          }
          this._globalChannel = ko.namespace();
        },
        mixin: {
          namespaceName: modelOptions.namespace,
          broadcastAll: function() {
            var model = this;
            if(typeof this._broadcast === 'object') {
              _.each( this._broadcast, function( observable, observableName ) {
                model.namespace.publish( observableName, observable() );
              });
            }

            _.each( this, function(property, propName) {
              if( _.isObject(property) === true && property.__isBroadcast === true ) {
                model.namespace.publish( propName, property() );
              }
            });
            return this;
          },
          refreshReceived: function() {
            if( typeof this._receive === 'object' && this._receive.refresh !== undefined ) {
              _.invoke( this._receive, 'refresh' );
              if( typeof this._receive.config === 'object' ) {
                _.invoke( this._receive.config, 'refresh' );
              }
            }

            _.each( this, function(property, propName) {
              if( _.isObject(property) === true && property.__isReceived === true ) {
                property.refresh();
              }
            });
            if( _.isObject(this.config) === true ) {
              _.invoke( this.config, 'refresh' );
            }
            return this;
          },
          startup: function() {
            this.refreshReceived().broadcastAll();
            return this;
          }
        },
        _postInit: function( options ) {
          if(debugModels === true) {
            models[ ko.currentNamespace().channel ] = this;
          }

          ko.exitNamespace();
          this.startup();
          typeof this._modelOptions.afterCreating === 'function' && this._modelOptions.afterCreating.call(this);
        }
      };

      var composure = [ modelOptions.factory, viewModel ];
      if(modelOptions.mixins !== undefined) {
        composure = composure.concat(modelOptions.mixins);
      }
      return riveter.compose.apply( undefined, composure );
    };

    return ko;
  }
);