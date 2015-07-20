// framework/entities/router/outlet.js
// ------------------

var noParentViewModelError = { $namespace: { getName: function() { return 'NO-VIEWMODEL-IN-CONTEXT'; } } };

// This custom binding binds the outlet element to the $outlet on the router, changes on its 'route' (component definition observable) will be applied
// to the UI and load in various views
fw.virtualElements.allowedBindings.$bind = true;
fw.bindingHandlers.$bind = {
  init: function(element, valueAccessor, allBindings, outletViewModel, bindingContext) {
    var $parentViewModel = ( isObject(bindingContext) ? (bindingContext.$parent || noParentViewModelError) : noParentViewModelError);
    var $parentRouter = nearestParentRouter(bindingContext);
    var outletName = outletViewModel.outletName;

    if( isRouter($parentRouter) ) {
      // register this outlet with the router so that updates will propagate correctly
      // take the observable returned and define it on the outletViewModel so that outlet route changes are reflected in the view
      outletViewModel.$route = $parentRouter.$outlet( outletName );
    } else {
      throw new Error('Outlet [' + outletName + '] defined inside of viewModel [' + $parentViewModel.$namespace.getName() + '] but no router was defined.');
    }
  }
};

function $routerOutlet(outletName, componentToDisplay, options) {
  options = options || {};
  if( isFunction(options) ) {
    options = { onComplete: options, onFailure: noop };
  }

  var viewModelParameters = options.params;
  var onComplete = options.onComplete || noop;
  var onFailure = options.onFailure || noop;
  var outlets = this.outlets;

  outletName = fw.unwrap( outletName );
  if( !isObservable(outlets[outletName]) ) {
    outlets[outletName] = fw.observable({
      name: noComponentSelected,
      params: {},
      __getOnCompleteCallback: function() { return noop; },
      __onFailure: onFailure.bind(this)
    }).broadcastAs({ name: outletName, namespace: this.$namespace });
  }

  var outlet = outlets[outletName];
  var currentOutletDef = outlet();
  var valueHasMutated = false;
  var isInitialLoad = outlet().name === noComponentSelected;

  if( !isUndefined(componentToDisplay) && currentOutletDef.name !== componentToDisplay ) {
    currentOutletDef.name = componentToDisplay;
    valueHasMutated = true;
  }

  if( !isUndefined(viewModelParameters) ) {
    currentOutletDef.params = viewModelParameters;
    valueHasMutated = true;
  }

  if( valueHasMutated ) {
    // Return the onComplete callback once the DOM is injected in the page.
    // For some reason, on initial outlet binding only calls update once. Subsequent
    // changes get called twice (correct per docs, once upon initial binding, and once
    // upon injection into the DOM). Perhaps due to usage of virtual DOM for the component?
    var callCounter = (isInitialLoad ? 0 : 1);

    currentOutletDef.__getOnCompleteCallback = function(element) {
      var isComplete = callCounter === 0;
      callCounter--;
      if( isComplete ) {
        activeOutlets.remove(outlet);
        return function addBindingOnComplete() {
          setTimeout(function() {
            if(element.className.indexOf(bindingClassName) === -1) {
              element.className += ' ' + bindingClassName;
            }
          }, animationIteration);

          onComplete.call(this, element);
        };
      }
      element.className = element.className.replace(' ' + bindingClassName, '');
      return noop;
    };

    activeOutlets.push(outlet);
    outlet.valueHasMutated();
  }

  return outlet;
};

function registerOutletComponents() {
  internalComponents.push('outlet');
  fw.components.register('outlet', {
    autoIncrement: true,
    viewModel: function(params) {
      this.outletName = fw.unwrap(params.name);
      this.__isOutlet = true;
    },
    template: '<!-- ko $bind, component: $route --><!-- /ko -->'
  });

  internalComponents.push(noComponentSelected);
  fw.components.register(noComponentSelected, {
    viewModel: function(params) {
      this.__assertPresence = false;
    },
    template: '<div class="no-component-selected"></div>'
  });
};

runPostInit.push(registerOutletComponents);
