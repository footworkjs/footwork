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
  });

  it('can instantiate a registered component via a <declarative> statement', function(done) {
    var componentInitialized = false;
    var container = document.getElementById('declarativeComponent');

    fw.components.register('declarative-component', {
      template: '<div>a template</div>',
      viewModel: fw.viewModel({
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

  it('can instantiate nested <components>', function(done) {
    var outerComponentInitialized = false;
    var innerComponentInitialized = false;
    var container = document.getElementById('nestedDeclarativeComponent');

    fw.components.register('nested-outer-declarative-component', {
      template: '<nested-inner-declarative-component></nested-inner-declarative-component>',
      viewModel: fw.viewModel({
        initialize: function() {
          outerComponentInitialized = true;
        }
      })
    });

    fw.components.register('nested-inner-declarative-component', {
      template: '<div></div>',
      viewModel: fw.viewModel({
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

  it('can specify and load via the default location', function(done) {
    var container = document.getElementById('defaultComponentLocation');
    window.defaultComponentLocationLoaded = false;

    fw.components.defaultLocation({
      viewModel: 'scripts/testAssets/defaultComponentLocation/',
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
      viewModel: 'scripts/testAssets/registeredComponentLocation/',
      template: 'testAssets/registeredComponentLocation/'
    };
    fw.components.registerLocation('registered-component-location-verify', location);

    expect(fw.components.getLocation('registered-component-location-verify')).to.eql(location);
  });

  it('can specify and load via a registered location', function(done) {
    var container = document.getElementById('registeredComponentLocation');
    window.registeredComponentLocationLoaded = false;

    fw.components.registerLocation('registered-component-location', {
      viewModel: 'scripts/testAssets/registeredComponentLocation/',
      template: 'testAssets/registeredComponentLocation/'
    });

    expect(window.registeredComponentLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredComponentLocationLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can specify and load via a registered location with full file name', function(done) {
    var container = document.getElementById('registeredComponentLocationFullName');
    window.registeredComponentLocationFullNameLoaded = false;

    fw.components.registerLocation('registered-component-location-fullname', {
      viewModel: 'scripts/testAssets/registeredComponentLocation/registeredComponentLocationFullname.js',
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

    fw.components.registerLocation('registered-combined-component-location', 'scripts/testAssets/registeredComponentLocation/');

    expect(window.registeredComponentLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.registeredComponentLocationLoaded).to.be(true);
      done();
    }, 150);
  });

  it('can have a component registered as template only which is resolved and injected correctly', function(done) {
    var container = document.getElementById('templateOnlyComponent');
    var innerViewModelInstantiated = false;

    fw.components.registerLocation('template-only-component', { template: 'testAssets/' });
    fw.viewModels.register('templateOnlyInnerCheck', fw.viewModel({
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
