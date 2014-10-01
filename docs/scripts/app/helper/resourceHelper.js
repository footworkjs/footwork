define([ "footwork",
    "app/viewModel/Contributors", "text!app/template/contributors.html",
    "text!app/template/showversion.html",
    "app/viewModel/config/Configuration", "text!app/template/config/configuration.html",
    "app/viewModel/config/LayoutControl", "text!app/template/config/layoutcontrol.html",
    "app/viewModel/Pane", "text!app/template/pane.html",
    "app/viewModel/pane/PaneLinks", "text!app/template/pane/panelinks.html",
    "app/viewModel/pane/MainMenu", "text!app/template/pane/mainmenu.html",
    "app/viewModel/pane/PageSections", "text!app/template/pane/pagesections.html",
    "app/viewModel/pane/PaneBackground", "text!app/template/pane/panebackground.html",
    "app/viewModel/Header",
    "app/viewModel/Navigation",
    "app/viewModel/Footer",
    "app/viewModel/BuildInfo",

    "text!../../pages/404.html",
    "text!../../pages/index.html",
    "text!../../pages/build.html",
    "text!../../pages/viewModel.html",
    "text!../../pages/annotated.html"
  ],
  function( ko,
    contributorsViewModel, contributorsTemplate,
    showVersionTemplate,
    configurationViewModel, configurationTemplate,
    layoutControlViewModel, layoutControlTemplate,
    paneViewModel, paneTemplate,
    paneLinksViewModel, paneLinksTemplate,
    mainMenuViewModel, mainMenuTemplate,
    pageSectionsViewModel, pageSectionsTemplate,
    paneBackgroundViewModel, paneBackgroundTemplate,
    HeaderViewModel,
    NavigationViewModel,
    FooterViewModel,
    BuildInfoViewModel,

    pageNotFound,
    indexPage,
    buildInfoPage,
    viewModelPage,
    annotatedPage
  ) {
    var pageResources = [];

    function registerPage(pageResourcePath, resource) {
      pageResources.push(pageResourcePath);
      define(pageResourcePath, [], function() {
        return resource;
      });
    };

    ko.namespace('Resource').request.handler('isPageRegistered', function(templateName) {
      return pageResources.indexOf(templateName) !== -1;
    });

    return function resourceHelper() {
      registerPage('/404', pageNotFound);
      registerPage('/', indexPage);
      registerPage('/build', buildInfoPage);
      registerPage('/annotated', annotatedPage);
      registerPage('/api/viewModel', viewModelPage);

      ko.components.register('showversion', {
        viewModel: BuildInfoViewModel,
        template: showVersionTemplate
      });

      ko.components.register('contributors', {
        viewModel: contributorsViewModel,
        template: contributorsTemplate
      });

      ko.components.register('configuration', {
        viewModel: configurationViewModel,
        template: configurationTemplate
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

      ko.viewModels.register('Header', HeaderViewModel);
      ko.viewModels.register('Navigation', NavigationViewModel);
      ko.viewModels.register('Footer', FooterViewModel);
      ko.viewModels.register('BuildInfo', BuildInfoViewModel);
    };
  }
);