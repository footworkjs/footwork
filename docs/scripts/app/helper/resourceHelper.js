define([ "footwork",
    "app/viewModel/Contributors", "text!app/template/contributors.html",
    "text!app/template/showversion.html",
    "app/viewModel/Releases", "text!app/template/releases.html",
    "app/viewModel/config/Configuration", "text!app/template/config/configuration.html",
    "app/viewModel/config/ConfigManagement", "text!app/template/config/configmanagement.html",
    "app/viewModel/config/LayoutControl", "text!app/template/config/layoutcontrol.html",
    "app/viewModel/Pane", "text!app/template/pane.html",
    "app/viewModel/pane/PaneLinks", "text!app/template/pane/panelinks.html",
    "app/viewModel/NavMenu", "text!app/template/navmenu.html",
    "app/viewModel/pane/PageSections", "text!app/template/pane/pagesections.html",
    "app/viewModel/pane/PageSection", "text!app/template/pane/pagesection.html",
    "app/viewModel/pane/PageSubSection", "text!app/template/pane/pagesubsection.html",
    "app/viewModel/pane/PaneBackground", "text!app/template/pane/panebackground.html",
    "app/viewModel/Header",
    "app/viewModel/Navigation",
    "app/viewModel/Footer",
    "app/viewModel/BuildInfo",

    "text!../../pages/index-page.html",
    "text!../../pages/not-found-page.html",
    "text!../../pages/build-page.html",
    "text!../../pages/annotated-page.html",
    "text!../../pages/api-page.html",
    "text!../../pages/api/viewModel-page.html",
    "text!../../pages/api/namespacing-page.html",
    "text!../../pages/api/components-page.html",
    "text!../../pages/api/broadcastable-receivable-page.html",
    "text!../../pages/api/routing-page.html",
    "text!../../pages/tutorial-page.html"
  ],
  function( fw,
    contributorsViewModel, contributorsTemplate,
    showVersionTemplate,
    releasesViewModel, releasesTemplate,
    configurationViewModel, configurationTemplate,
    configManagementViewModel, configManagementTemplate,
    layoutControlViewModel, layoutControlTemplate,
    paneViewModel, paneTemplate,
    paneLinksViewModel, paneLinksTemplate,
    navMenuViewModel, navMenuTemplate,
    pageSectionsViewModel, pageSectionsTemplate,
    pageSectionViewModel, pageSectionTemplate,
    pageSubSectionViewModel, pageSubSectionTemplate,
    paneBackgroundViewModel, paneBackgroundTemplate,
    HeaderViewModel,
    NavigationViewModel,
    FooterViewModel,
    BuildInfoViewModel,

    indexPage,
    notFoundPage,
    buildInfoPage,
    annotatedPage,
    apiPage,
    viewModelPage,
    namespacingPage,
    componentsPage,
    broadcastableReceivablePage,
    routingPage,
    tutorialPage
  ) {
    return function resourceHelper() {
      fw.outlets.registerView('index-page', indexPage);
      fw.outlets.registerView('not-found-page', notFoundPage);
      fw.outlets.registerView('build-info-page', buildInfoPage);
      fw.outlets.registerView('annotated-page', annotatedPage);
      fw.outlets.registerView('api-page', apiPage);
      fw.outlets.registerView('api-viewModel-page', viewModelPage);
      fw.outlets.registerView('api-namespacing-page', namespacingPage);
      fw.outlets.registerView('api-components-page', componentsPage);
      fw.outlets.registerView('api-broadcastable-receivable-page', broadcastableReceivablePage);
      fw.outlets.registerView('api-routing-page', routingPage);
      fw.outlets.registerView('tutorial-page', tutorialPage);

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

      fw.components.register('configmanagement', {
        viewModel: configManagementViewModel,
        template: configManagementTemplate
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
      
      fw.components.register('pagesection', {
        viewModel: pageSectionViewModel,
        template: pageSectionTemplate
      });
      
      fw.components.register('pagesubsection', {
        viewModel: pageSubSectionViewModel,
        template: pageSubSectionTemplate
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