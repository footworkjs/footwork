// r.js -o build.js
({
  baseUrl: "scripts/",
  preserveLicenseComments: false,
  wrap: {
      start: "(function() {",
      end: "}());"
  },
  dir: "scripts/build",
  modules: [
    { name: "main",
      include: ["requireLib", "app/main"],
      create: true }
  ],
  optimize: "uglify2",
  generateSourceMaps: true,
  map: {
    "*": {
      "jquery": "noconflict-jquery"
    },
    "noconflict-jquery": {
      "jquery": "jquery"
    }
  },
  optimizeAllPluginResources: true,
  stubModules: ['text'],
  inlineText: true,
  paths: {
    "requireLib":        "../components/requirejs/require",
    "jquery":            "../components/jquery/dist/jquery",
    "postal":            "../components/postal.js/lib/postal",
    "knockout":          "../components/knockoutjs/dist/knockout.debug",
    "footwork":          "../../dist/footwork-bare",
    "storage":           "../components/store-js/store",
    "lodash":            "../components/lodash/dist/lodash.underscore",
    "history":           "../components/history.js/scripts/bundled/html5/native.history",
    "jwerty":            "lib/jwerty", // jwerty does not provide an AMD build, this is a custom wrapped version
    "conduitjs":         "lib/conduit", // ConduitJS currently has a broken UMD wrapper, this is a forked and fixed version
    "jquery.touchy":     "lib/jquery-plugins/jquery.touchy",
    "jquery.pulse":      "lib/jquery-plugins/jquery.pulse",
    "jquery.mousewheel": "lib/jquery-plugins/jquery.mousewheel",
    "jquery.spectrum":   "lib/jquery-plugins/jquery.spectrum",
    "jquery.easing":     "lib/jquery-plugins/jquery.easing",

    "paneEntry":         "app/mixin/paneEntry",
    "paneArea":          "app/mixin/paneArea",
    "koExtenders":       "app/misc/extenders",
    "koBindings":        "app/misc/bindingHandlers",
    "noconflict-jquery": "app/misc/noconflict-jquery",
    "LoadProfile":       "app/helper/LoadProfile",
    "LoadState":         "app/helper/LoadState",
    "resourceHelper":    "app/helper/resourceHelper",

    "Footer":            "app/viewModel/Footer",
    "PaneDragManager":   "app/viewModel/PaneDragManager",
    "ViewPort":          "app/viewModel/ViewPort",
    "Header":            "app/viewModel/Header",
    "Navigation":        "app/viewModel/Navigation",
    "Body":              "app/viewModel/Body",
    "Page":              "app/viewModel/Page"
  }
})