## Why multiple build profiles?

  Some people have projects that already incorporate these
  dependencies. The footwork-all.js build while convenient, embeds
  all of these for you. If your project uses these dependencies
  separately from footwork then you do not want them also being
  embedded into footwork. These other (lighter) builds do not include
  those as embedded dependencies and you will need to provide them
  yourself.

* **footwork-all.js**

    All dependencies embedded, this can be used without any other externally provided dependencies.

* **footwork-minimal.js**

    You will need to provide (via either &lt;script&gt; includes, requirejs, browserify, etc)
    * 'lodash' - http://lodash.com/
    * 'knockout' - http://knockoutjs.com/

* **footwork-bare.js**

    You will need to provide (via either &lt;script&gt; includes, requirejs, browserify, etc)
    * 'lodash' - http://lodash.com/ (footwork uses lodash.underscore.js natively)
    * 'knockout' - http://knockoutjs.com/
    * 'Apollo' - https://github.com/toddmotto/apollo,
    * 'reqwest' - https://github.com/ded/reqwest
    * 'postal' - https://github.com/postaljs/postal.js/
      *   'conduitjs' - https://github.com/ifandelse/ConduitJS
    * 'delegate' - https://github.com/component/delegate,
      *   'matches' - https://github.com/necolas/matches.js

### I need a different build, can I make others?

  Sure, the gulpfile.js is in the repo: https://github.com/reflectiveSingleton/footwork
  
  **TODO** Make documentation concerning custom builds.

I also accept pull requests, if you think your build would help out others as well, please feel free to submit a PR.

Please see http://footworkjs.com for more details.

[![Analytics](https://ga-beacon.appspot.com/UA-52543452-1/footwork/GITHUB-DIST)](https://github.com/reflectiveSingleton/ga-beacon)