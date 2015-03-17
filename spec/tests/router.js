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
    expect(new routerConstructor()).to.be.an('object');
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

  it('can autoRegister a router', function() {
    expect( fw.routers.isRegistered('autoRegisteredRouter') ).to.be(false);

    var autoRegisteredRouter = fw.router({
      namespace: 'autoRegisteredRouter',
      autoRegister: true
    });

    expect( fw.routers.isRegistered('autoRegisteredRouter') ).to.be(true);
    expect( fw.routers.getRegistered('autoRegisteredRouter') ).to.be(autoRegisteredRouter);
  });

  it('can get all instantiated routers', function() {
    var RouterA = fw.router({ namespace: 'RouterA' });
    var RouterB = fw.router({ namespace: 'RouterB' });

    var routers = [ new RouterA(), new RouterB() ];
    var routerList = _.keys( fw.routers.getAll() );

    expect( routerList ).to.contain('RouterA');
    expect( routerList ).to.contain('RouterB');
  });

  it('can get all instantiated routers of a specific namespace', function() {
    var routers = [];
    var Router = fw.router({ namespace: 'getAllSpecificRouter' });
    var numToMake = _.random(1,15);

    for(var x = numToMake; x; x--) {
      routers.push( new Router() );
    }

    expect( fw.routers.getAll('getAllSpecificRouter').filter(function(instance) {
      return instance.$namespace.getName() === 'getAllSpecificRouter';
    }).length ).to.be(numToMake);
  });

  it('can be instantiated with a list of routes', function() {
    var routesList = [ '/', '/route1', '/route2' ];

    var Router = fw.router({
      namespace: 'instantiatedListOfRoutes',
      routes: _.map(routesList, function(routePath) {
        return { route: routePath };
      })
    });

    var router = new Router();

    expect( _.reduce(router.$router.getRouteDescriptions(), function(routeDescriptions, routeDesc) {
      if( routesList.indexOf(routeDesc.route) !== -1 ) {
        routeDescriptions.push(routeDesc);
      }
      return routeDescriptions;
    }, []).length ).to.be( routesList.length );
  });
});
