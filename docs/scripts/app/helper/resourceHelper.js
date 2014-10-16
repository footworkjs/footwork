define([ "footwork",
    "app/viewModel/Contributors", "text!app/template/contributors.html",
    "text!app/template/showversion.html",
    "app/viewModel/Releases", "text!app/template/releases.html",
    "app/viewModel/config/Configuration", "text!app/template/config/configuration.html",
    "app/viewModel/config/LayoutControl", "text!app/template/config/layoutcontrol.html",
    "app/viewModel/Pane", "text!app/template/pane.html",
    "app/viewModel/pane/PaneLinks", "text!app/template/pane/panelinks.html",
    "app/viewModel/NavMenu", "text!app/template/navmenu.html",
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
  function( fw,
    contributorsViewModel, contributorsTemplate,
    showVersionTemplate,
    releasesViewModel, releasesTemplate,
    configurationViewModel, configurationTemplate,
    layoutControlViewModel, layoutControlTemplate,
    paneViewModel, paneTemplate,
    paneLinksViewModel, paneLinksTemplate,
    navMenuViewModel, navMenuTemplate,
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
      fw.components.register('index-page', { template: indexPage });
      fw.components.register('not-found-page', { template: notFoundPage });
      fw.components.register('build-info-page', { template: buildInfoPage });
      fw.components.register('annotated-page', { template: annotatedPage });
      fw.components.register('api-viewModel-page', { template: viewModelPage });

      fw.components.register('showversion', {
        viewModel: BuildInfoViewModel,
        template: showVersionTemplate
      });

      fw.components.register('releases', {
        viewModel: releasesViewModel,
        template: releasesTemplate
      });

      fw.components.register('contributors', {
        viewModel: contributorsViewModel,
        template: contributorsTemplate
      });

      fw.components.register('configuration', {
        viewModel: configurationViewModel,
        template: configurationTemplate
      });

      fw.components.register('layoutcontrol', {
        viewModel: layoutControlViewModel,
        template: layoutControlTemplate
      });
      
      fw.components.register('pane', {
        viewModel: paneViewModel,
        template: paneTemplate
      });
      
      fw.components.register('panelinks', {
        viewModel: paneLinksViewModel,
        template: paneLinksTemplate
      });
      
      fw.components.register('navmenu', {
        viewModel: navMenuViewModel,
        template: navMenuTemplate
      });
      
      fw.components.register('pagesections', {
        viewModel: pageSectionsViewModel,
        template: pageSectionsTemplate
      });

      fw.components.register('panebackground', {
        viewModel: paneBackgroundViewModel,
        template: paneBackgroundTemplate
      });

      fw.viewModels.register('Header', HeaderViewModel);
      fw.viewModels.register('Navigation', NavigationViewModel);
      fw.viewModels.register('Footer', FooterViewModel);
      fw.viewModels.register('BuildInfo', BuildInfoViewModel);
    };
  }
);