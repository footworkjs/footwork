'use strict';

var sandbox = document.getElementById('sandbox');

describe('router', function () {
  it('has the ability to create a router', function() {
    var routerInitialized = false;

    expect(fw.router).to.be.a('function');

    var routerConstructor = fw.router({
      initialize: function() {
        routerInitialized = true;
      }
    });

    expect(routerConstructor).to.be.a('function');
  });

  it('has the ability to create a router with a correctly defined namespace whos name we can retrieve', function() {
    var Router = fw.router({
      namespace: 'RouterNamespaceCheck'
    });
    var router = new Router();

    expect(router.$router.$namespace).to.be.an('object');
    expect(router.$router.$namespace.getName()).to.be('RouterNamespaceCheck');
  });

  it('can register a router', function() {
    expect( fw.routers.isRegistered('registeredRouterCheck') ).to.be(false);

    fw.routers.register('registeredRouterCheck', function() {});

    expect( fw.routers.isRegistered('registeredRouterCheck') ).to.be(true);
  });

  it('can get a registered router', function() {
    expect( fw.routers.isRegistered('registeredRouterRetrieval') ).to.be(false);

    var RegisteredRouterRetrieval = function() {};

    fw.routers.register('registeredRouterRetrieval', RegisteredRouterRetrieval);

    expect( fw.routers.isRegistered('registeredRouterRetrieval') ).to.be(true);
    expect( fw.routers.getRegistered('registeredRouterRetrieval') ).to.be(RegisteredRouterRetrieval);
  });

  it('can get all instantiated routers', function() {
    var Router = fw.viewModel();
    var routers = [
      new Router({ namespace: 'RouterA' }),
      new Router({ namespace: 'RouterB' })
    ];

    expect( _.keys(fw.routers.getAll()).length ).to.be.greaterThan(0);
  });

  // TODO: make this work
  it.skip('can get all instantiated routers of a specific namespace', function() {
    var routers = [];
    var Router = fw.router({ namespace: 'getAllSpecificRouter' });
    var numToMake = _.random(1,15);

    for(var x = numToMake; x; x--) {
      routers.push( new Router() );
    }

    expect( fw.routers.getAll('getAllSpecificRouter').length ).to.be(numToMake);
  });
});
