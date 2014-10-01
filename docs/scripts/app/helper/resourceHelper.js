define([ "footwork",
    "app/viewModel/Contributors", "text!app/template/contributors.html",
    "app/viewModel/config/Configuration", "text!app/template/config/configuration.html",
    "app/viewModel/config/ConfigManagement", "text!app/template/config/configmanagement.html",
    "app/viewModel/config/LayoutControl", "text!app/template/config/layoutcontrol.html",
    "app/viewModel/Pane", "text!app/template/pane.html",
    "app/viewModel/pane/PaneLinks", "text!app/template/pane/panelinks.html",
    "app/viewModel/pane/MainMenu", "text!app/template/pane/mainmenu.html",
    "app/viewModel/pane/PageSections", "text!app/template/pane/pagesections.html",
    "app/viewModel/pane/PaneBackground", "text!app/template/pane/panebackground.html",
    "app/viewModel/pane/Reddit", "text!app/template/pane/reddit.html",
    "app/viewModel/pane/Github", "text!app/template/pane/github.html",
    "app/viewModel/pane/Twitter", "text!app/template/pane/twitter.html",
    "app/viewModel/Header",
    "app/viewModel/Navigation",
    "app/viewModel/Footer",
    "app/viewModel/BuildInfo",

    "text!../../pages/404.html",
    "text!../../pages/index.html",
    "text!../../pages/build.html",
    "text!../../pages/viewModel.html"
  ],
  function( ko,
    contributorsViewModel, contributorsTemplate,
    configurationViewModel, configurationTemplate,
    configManagementViewModel, configManagementTemplate,
    layoutControlViewModel, layoutControlTemplate,
    paneViewModel, paneTemplate,
    paneLinksViewModel, paneLinksTemplate,
    mainMenuViewModel, mainMenuTemplate,
    pageSectionsViewModel, pageSectionsTemplate,
    paneBackgroundViewModel, paneBackgroundTemplate,
    redditViewModel, redditTemplate,
    githubViewModel, githubTemplate,
    twitterViewModel, twitterTemplate,
    HeaderViewModel,
    NavigationViewModel,
    FooterViewModel,
    BuildInfoViewModel,

    _404Page,
    indexPage,
    buildInfoPage,
    viewModelPage
  ) {
    return function resourceHelper() {
      var $resourceNamespace = ko.namespace('Resource');

      var pageResources = [];
      var registerPage = function(pageResourcePath, resource) {
        pageResources.push(pageResourcePath);
        define.call(null, pageResourcePath, [], function() {
          return resource;
        });
      };
      $resourceNamespace.request.handler('isPageRegistered', function(templateName) {
        return pageResources.indexOf(templateName) !== -1;
      });

      registerPage('text!/404', _404Page );
      registerPage('text!/', indexPage );
      registerPage('text!/build', buildInfoPage );
      registerPage('text!/api/viewModel', viewModelPage );

      ko.components.register('contributors', {
        viewModel: contributorsViewModel,
        template: contributorsTemplate
      });

      ko.components.register('configuration', {
        viewModel: configurationViewModel,
        template: configurationTemplate
      });

      ko.components.register('configmanagement', {
        viewModel: configManagementViewModel,
        template: configManagementTemplate
      });

      ko.components.register('layoutcontrol', {
        viewModel: layoutControlViewModel,
        template: layoutControlTemplate
      });
      
      ko.components.register('pane', {
        viewModel: paneViewModel,
        template: paneTemplate
      });
      
      ko.components.register('panelinks', {
        viewModel: paneLinksViewModel,
        template: paneLinksTemplate
      });
      
      ko.components.register('mainmenu', {
        viewModel: mainMenuViewModel,
        template: mainMenuTemplate
      });
      
      ko.components.register('pagesections', {
        viewModel: pageSectionsViewModel,
        template: pageSectionsTemplate
      });

      ko.components.register('panebackground', {
        viewModel: paneBackgroundViewModel,
        template: paneBackgroundTemplate
      });

      ko.components.register('reddit', {
        viewModel: redditViewModel,
        template: redditTemplate
      });

      ko.components.register('github', {
        viewModel: githubViewModel,
        template: githubTemplate
      });

      ko.components.register('twitter', {
        viewModel: twitterViewModel,
        template: twitterTemplate
      });

      ko.viewModels.register('Header', HeaderViewModel);
      ko.viewModels.register('Navigation', NavigationViewModel);
      ko.viewModels.register('Footer', FooterViewModel);
      ko.viewModels.register('BuildInfo', BuildInfoViewModel);
    };
  }
);