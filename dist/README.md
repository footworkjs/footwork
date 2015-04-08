## Why multiple build profiles?

  Some people have projects that already incorporate these
  dependencies. The footwork-all.js build while convenient, embeds
  all of these for you. If your project uses these dependencies
  separately from footwork then you do not want them also being
  embedded into footwork. These other (lighter) builds do not include
  those as embedded dependencies and you will need to provide them
  yourself.

* **footwork-all-history.js**

    All dependencies embedded (includes reqwest embedded for ajax, jQuery is too large to use as an embedded dependency), this can be used without any other externally provided dependencies. This build additionally includes History.js embedded for use with SPA state/route management.

* **footwork-all.js**

    All dependencies embedded (includes reqwest embedded for ajax, jQuery is too large to use as an embedded dependency), this can be used without any other externally provided dependencies.

* **footwork-minimal.js**

    You will need to provide (via either &lt;script&gt; includes, requirejs, browserify, etc)
    * 'knockout' - http://knockoutjs.com/ (NOTE: footwork requires v3.2)
    * 'lodash' - http://lodash.com/

* **footwork-bare-jquery.js**

    You will need to provide (via either &lt;script&gt; includes, requirejs, browserify, etc)
    * 'knockout' - http://knockoutjs.com/ (NOTE: footwork requires v3.2)
    * 'lodash' - http://lodash.com/ (footwork uses lodash.underscore.js natively)
    * 'postal' - https://github.com/postaljs/postal.js/
    * 'jquery' - http://jquery.com (used for ajax dependency)

* **footwork-bare-reqwest.js**

    You will need to provide (via either &lt;script&gt; includes, requirejs, browserify, etc)
    * 'knockout' - http://knockoutjs.com/ (NOTE: footwork requires v3.2)
    * 'lodash' - http://lodash.com/ (footwork uses lodash.underscore.js natively)
    * 'postal' - https://github.com/postaljs/postal.js/
    * 'reqwest' - https://github.com/ded/reqwest (used for ajax dependency)

### I need a different build, can I make others?

  Sure, the gulpfile.js is in the repo: https://github.com/reflectiveSingleton/footwork
  
  **TODO** Make documentation concerning custom builds.

I also accept pull requests, if you think your build would help out others as well, please feel free to submit a PR.

Please see http://footworkjs.com for more details.

[![Analytics](https://ga-beacon.appspot.com/UA-52543452-1/footwork/GITHUB-DIST)](https://github.com/reflectiveSingleton/ga-beacon)
