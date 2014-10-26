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
  optimize: "none",
  generateSourceMaps: false,
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
    "requireLib":        "../bower_components/requirejs/require",
    "jquery":            "../bower_components/jquery/dist/jquery",
    "postal":            "../bower_components/postal.js/lib/postal",
    "conduitjs":         "../bower_components/conduitjs/lib/conduit",
    "knockout":          "../bower_components/knockoutjs/dist/knockout",
    "footwork":          "../../dist/footwork-bare",
    "storage":           "../bower_components/store-js/store",
    "lodash":            "../bower_components/lodash/dist/lodash.underscore",
    "history":           "../bower_components/history.js/scripts/bundled/html5/native.history",
    "jwerty":            "lib/jwerty", // jwerty does not provide an AMD build, this is a custom wrapped version
    "jquery.pulse":      "lib/jquery-plugins/jquery.pulse",
    "jquery.mousewheel": "lib/jquery-plugins/jquery.mousewheel",
    "jquery.easing":     "lib/jquery-plugins/jquery.easing",

    "paneEntry":         "app/mixin/paneEntry",
    "paneArea":          "app/mixin/paneArea",
    "koExtenders":       "app/misc/extenders",
    "koBindings":        "app/misc/bindingHandlers",
    "noconflict-jquery": "app/misc/noconflict-jquery",
    "LoadProfile":       "app/helper/LoadProfile",
    "LoadState":         "app/helper/LoadState",
    "resourceHelper":    "app/helper/resourceHelper",
    "router":            "app/router",

    "Footer":            "app/viewModel/Footer",
    "PaneTouchManager":  "app/viewModel/PaneTouchManager",
    "ViewPort":          "app/viewModel/ViewPort",
    "Header":            "app/viewModel/Header",
    "Navigation":        "app/viewModel/Navigation",
    "Body":              "app/viewModel/Body",
    "Page":              "app/viewModel/Page"
  }
})