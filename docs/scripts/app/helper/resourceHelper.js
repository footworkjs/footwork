define([ "footwork",
    "app/viewModel/Contributors", "text!app/template/contributors.html",
    "text!app/template/showversion.html",
    "app/viewModel/Releases", "text!app/template/releases.html",
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

    "text!../../pages/index-page.html",
    "text!../../pages/not-found-page.html",
    "text!../../pages/build-page.html",
    "text!../../pages/annotated-page.html",
    "text!../../pages/api-viewModel-page.html"
  ],
  function( ko,
    contributorsViewModel, contributorsTemplate,
    showVersionTemplate,
    releasesViewModel, releasesTemplate,
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

    indexPage,
    notFoundPage,
    buildInfoPage,
    annotatedPage,
    viewModelPage
  ) {
    return function resourceHelper() {
      ko.components.register('index-page', { template: indexPage });
      ko.components.register('not-found-page', { template: notFoundPage });
      ko.components.register('build-info-page', { template: buildInfoPage });
      ko.components.register('annotated-page', { template: annotatedPage });
      ko.components.register('api-viewModel-page', { template: viewModelPage });

      ko.components.register('showversion', {
        viewModel: BuildInfoViewModel,
        template: showVersionTemplate
      });

      ko.components.register('releases', {
        viewModel: releasesViewModel,
        template: releasesTemplate
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