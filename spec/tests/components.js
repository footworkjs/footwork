'use strict';

describe('components', function () {
  it('can register a component', function() {
    fw.components.register('ComponentA', {
      template: '<div>a template</div>',
      viewModel: function() {
        this.variable = fw.observable().broadcastAs('variable');
      }
    });

    expect(fw.components.isRegistered('ComponentA')).to.eql(true);
  });

  it('can register a component', function() {
    expect( fw.components.isRegistered('registered-component-check') ).to.be(false);

    fw.components.register('registered-component-check', {
      template: '<div>a template</div>',
      viewModel: function() {}
    });

    expect( fw.components.isRegistered('registered-component-check') ).to.be(true);
    expect( fw.components.isRegistered('registered-component-check-blah') ).to.be(false);
  });

  it('can instantiate a registered component via a <declarative> statement', function(done) {
    var componentInitialized = false;
    var container = document.getElementById('declarativeComponent');

    fw.components.register('declarative-component', {
      template: '<div>a template</div>',
      viewModel: fw.viewModel.create({
        initialize: function() {
          componentInitialized = true;
        }
      })
    });

    expect(componentInitialized).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(componentInitialized).to.be(true);
      done();
    }, 20);
  });

  it('can instantiate a registered component via a <declarative> statement with a dataModel', function(done) {
    var componentInitialized = false;
    var container = document.getElementById('declarativeComponentDataModel');

    fw.components.register('declarative-component-datamodel', {
      template: '<div>a template</div>',
      dataModel: fw.dataModel.create({
        initialize: function() {
          componentInitialized = true;
        }
      })
    });

    expect(componentInitialized).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(componentInitialized).to.be(true);
      done();
    }, 20);
  });

  it('can instantiate a registered component via a <declarative> statement with a router', function(done) {
    var componentInitialized = false;
    var container = document.getElementById('declarativeComponentRouter');

    fw.components.register('declarative-component-router', {
      template: '<div>a template</div>',
      dataModel: fw.router.create({
        initialize: function() {
          componentInitialized = true;
        }
      })
    });

    expect(componentInitialized).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(componentInitialized).to.be(true);
      done();
    }, 20);
  });

  it('has the animation classes applied properly', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('afterBindingComponentAnimation');
    var afterBindingCalled = false;
    var theElement;

    fw.components.register('component-animation', {
      template: '<div>a template</div>',
      viewModel: fw.viewModel.create({
        namespace: 'afterBindingComponentAnimation',
        autoRegister: true,
        initialize: function() {
          wasInitialized = true;
        },
        afterRender: function(element) {
          afterBindingCalled = true;
          theElement = element;
          expect(theElement.className.indexOf('fw-entity-bound')).to.be(-1);
        }
      })
    });

    expect(afterBindingCalled).to.be(false);
    expect(wasInitialized).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(afterBindingCalled).to.be(true);
      expect(wasInitialized).to.be(true);
      setTimeout(function() {
        expect(theElement.className.indexOf('fw-entity-bound')).to.be.greaterThan(-1);
        done();
      }, 100);
    }, 0);
  });

  it('can instantiate nested <components>', function(done) {
    var outerComponentInitialized = false;
    var innerComponentInitialized = false;
    var container = document.getElementById('nestedDeclarativeComponent');

    fw.components.register('nested-outer-declarative-component', {
      template: '<nested-inner-declarative-component></nested-inner-declarative-component>',
      viewModel: fw.viewModel.create({
        initialize: function() {
          outerComponentInitialized = true;
        }
      })
    });

    fw.components.register('nested-inner-declarative-component', {
      template: '<div></div>',
      viewModel: fw.viewModel.create({
        initialize: function() {
          innerComponentInitialized = true;
        }
      })
    });

    expect(outerComponentInitialized).to.be(false);
    expect(innerComponentInitialized).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(outerComponentInitialized).to.be(true);
      expect(innerComponentInitialized).to.be(true);
      done();
    }, 150);
  });

  it('can pass params to a component viewModel', function(done) {
    var container = document.getElementById('passParamsToComponent');
    var componentInitialized = false;

    fw.components.register('pass-params-to-component', {
      template: '<div></div>',
      viewModel: fw.viewModel.create({
        initialize: function(params) {
          expect(params.testValueOne).to.be(1);
          expect(params.testValueTwo).to.eql([1,2,3]);
          componentInitialized = true;
        }
      })
    });

    expect(componentInitialized).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(componentInitialized).to.be(true);
      done();
    }, 150);
  });

  it('can set and return fileExtensions correctly', function() {
    var extensions = {
      combined: '.combinedTest',
      viewModel: '.viewModelTest',
      template: '.templateTest'
    };
    fw.components.fileExtensions(extensions);

    expect(fw.components.fileExtensions()).to.eql(extensions);

    // reset extensions back to normal
    fw.components.fileExtensions({
      combined: '.js',
      viewModel: '.js',
      template: '.html'
    });
  });

  it('can set fileExtensions via a callback', function() {
    function prependName(name, withName) {
      return _.reduce({
        combined: '.' + name + 'combinedTest',
        viewModel: '.' + name + 'viewModelTest',
        template: '.' + name + 'templateTest'
      }, function(ext, extension, property) {
        ext[property] = (withName ? name : '') + extension;
        return ext;
      }, {});
    }

    fw.components.fileExtensions(function getFileExtensions(componentName) {
      return prependName(componentName);
    });

    var comp1Check = prependName('comp1', true);
    var comp2Check = prependName('comp2', true);

    expect(fw.components.getFileName('comp1', 'viewModel')).to.eql(comp1Check.viewModel);
    expect(fw.components.getFileName('comp2', 'viewModel')).to.eql(comp2Check.viewModel);

    // reset extensions back to normal
    fw.components.fileExtensions({
      combined: '.js',
      viewModel: '.js',
      template: '.html'
    });
  });

  it('can get the normal tag list', function() {
    var tagList = fw.components.getNormalTagList();
    expect(tagList).to.contain('div');
    expect(tagList).to.contain('span');
    expect(tagList).to.contain('canvas');
  });

  it('can set a tag as not being a component', function() {
    expect(fw.components.tagIsComponent('test-not-component')).to.be(true);
    fw.components.tagIsComponent('test-not-component', false);
    expect(fw.components.tagIsComponent('test-not-component')).to.be(false);
  });

  it('can specify and load via the default location', function(done) {
    var container = document.getElementById('defaultComponentLocation');
    window.defaultComponentLocationLoaded = false;

    fw.components.defaultLocation({
      viewModel: 'testAssets/defaultComponentLocation/',
      template: 'testAssets/defaultComponentLocation/'
    });

    expect(window.defaultComponentLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.defaultComponentLocationLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can specify a location and verify it', function() {
    var location = {
      viewModel: 'testAssets/registeredComponentLocation/',
      template: 'testAssets/registeredComponentLocation/'
    };
    fw.components.registerLocation('registered-component-location-verify', location);
    fw.components.registerLocation(/^regexp-test.*$/, location);

    expect(fw.components.getLocation('registered-component-location-verify')).to.eql(location);
    expect(fw.components.getLocation('regexp-test-regexp')).to.eql(location);
  });

  it('can register an array of components to a location and retrieve them proplerly', function() {
    var location = {
      viewModel: 'testAssets/registeredComponentLocation/',
      template: 'testAssets/registeredComponentLocation/'
    };

    fw.components.registerLocation(['registeredLocationRetrievalArray1', 'registeredLocationRetrievalArray2'], location);
    expect(fw.components.getLocation('registeredLocationRetrievalArray1')).to.eql(location);
    expect(fw.components.getLocation('registeredLocationRetrievalArray2')).to.eql(location);
  });

  it('can specify and load via a registered location', function(done) {
    var container = document.getElementById('registeredComponentLocation');
    window.registeredComponentLocationLoaded = false;

    fw.components.registerLocation('registered-component-location', {
      viewModel: 'testAssets/registeredComponentLocation/',
      template: 'testAssets/registeredComponentLocation/'
    });

    expect(window.registeredComponentLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredComponentLocationLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can specify and load via a registered location with a prefixed folder', function(done) {
    var container = document.getElementById('registeredComponentLocationPrefixed');
    window.registeredComponentLocationPrefixedLoaded = false;

    fw.components.registerLocation('registered-component-location-prefixed', {
      viewModel: 'testAssets/',
      template: 'testAssets/'
    }, true);

    expect(window.registeredComponentLocationPrefixedLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredComponentLocationPrefixedLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can specify and load via a registered RegExp-based location', function(done) {
    var container = document.getElementById('registeredRegExpComponentLocation');
    window.registeredRegExpComponentLocationLoaded = false;

    fw.components.registerLocation(/registered-regexp-comp.*/, {
      viewModel: 'testAssets/registeredRegExpComponentLocation/',
      template: 'testAssets/registeredRegExpComponentLocation/'
    });

    expect(window.registeredRegExpComponentLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredRegExpComponentLocationLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can specify and load via a registered location with full file name', function(done) {
    var container = document.getElementById('registeredComponentLocationFullName');
    window.registeredComponentLocationFullNameLoaded = false;

    fw.components.registerLocation('registered-component-location-fullname', {
      viewModel: 'testAssets/registeredComponentLocation/registeredComponentLocationFullname.js',
      template: 'testAssets/registeredComponentLocation/registeredComponentLocationFullname.html'
    });

    expect(window.registeredComponentLocationFullNameLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredComponentLocationFullNameLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can specify and load via a registered location for a combined component', function(done) {
    var container = document.getElementById('registeredCombinedComponentLocation');
    window.registeredComponentLocationLoaded = false;

    fw.components.registerLocation('registered-combined-component-location', { combined: 'testAssets/registeredComponentLocation/' });

    expect(window.registeredComponentLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredComponentLocationLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can specify and load via a registered location for a dataModel enabled component', function(done) {
    var container = document.getElementById('registeredDataModelComponentLocation');
    window.registeredComponentLocationLoaded = false;

    fw.components.registerLocation('registered-datamodel-component-location', {
      dataModel: 'testAssets/registeredComponentLocation/',
      template: 'testAssets/registeredComponentLocation/'
    });

    expect(window.registeredComponentLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredComponentLocationLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can specify and load via a registered location for a router enabled component', function(done) {
    var container = document.getElementById('registeredRouterComponentLocation');
    window.registeredComponentLocationLoaded = false;

    fw.components.registerLocation('registered-router-component-location', {
      router: 'testAssets/registeredComponentLocation/',
      template: 'testAssets/registeredComponentLocation/'
    });

    expect(window.registeredComponentLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredComponentLocationLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can load with a declarative initialization from an already registered combined module with a viewModel', function(done) {
    var container = document.getElementById('specifiedCombinedComponentModule');
    var componentLoaded = false;

    define('specified-combined-component-module', ['footwork'], function(fw) {
      return fw.component({
        viewModel: function() {
          componentLoaded = true;
        },
        template: '<div></div>'
      });
    });

    expect(componentLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(componentLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load with a declarative initialization from an already registered combined module with a dataModel', function(done) {
    var container = document.getElementById('specifiedCombinedComponentModuleDataModel');
    var componentLoaded = false;

    define('specified-combined-component-module-datamodel', ['footwork'], function(fw) {
      return fw.component({
        dataModel: function() {
          componentLoaded = true;
        },
        template: '<div></div>'
      });
    });

    expect(componentLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(componentLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load with a declarative initialization from an already registered combined module with a router', function(done) {
    var container = document.getElementById('specifiedCombinedComponentModuleRouter');
    var componentLoaded = false;

    define('specified-combined-component-module-router', ['footwork'], function(fw) {
      return fw.component({
        dataModel: function() {
          componentLoaded = true;
        },
        template: '<div></div>'
      });
    });

    expect(componentLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(componentLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can be registered as template only which is resolved and injected correctly', function(done) {
    var container = document.getElementById('templateOnlyComponent');
    var innerViewModelInstantiated = false;

    fw.components.registerLocation('template-only-component', { template: 'testAssets/' });
    fw.viewModel.register('templateOnlyInnerCheck', fw.viewModel.create({
      initialize: function() {
        innerViewModelInstantiated = true;
      }
    }));

    expect(innerViewModelInstantiated).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(innerViewModelInstantiated).to.be(true);
      done();
    }, 150);
  });
});
