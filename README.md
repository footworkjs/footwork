![footwork.js](https://raw.github.com/reflectiveSingleton/footwork/master/dist/gh-footwork-logo.png)
========
[http://footworkjs.com](http://footworkjs.com "Footwork.js Homepage")

[![Build Status](https://travis-ci.org/reflectiveSingleton/footwork.png?branch=master)](https://travis-ci.org/reflectiveSingleton/footwork) [![Bower version](https://badge.fury.io/bo/footwork.png)](http://badge.fury.io/bo/footwork)

A solid footing for web applications.

## What is footwork?

Footwork is a front-end javascript framework built upon open source technologies. It uses novel combinations of several design patterns and libraries to enable the creation of expressive, low-boilerplate, highly modularized, maintainable, and reusable web components and applications.

**Totally new to footwork?** The easiest place to start is [the tutorials](http://latest-docs.footworkjs.com/tutorials "Get started quick!").

For more details, see:

 * [Main Website](http://footworkjs.com/ "Footwork.js Homepage")

 * [Documentation/API](http://latest-docs.footworkjs.com/ "Documentation and API information")

### Building footwork from source

* **Clone the repo from GitHub:**

```bash
git clone https://github.com/reflectiveSingleton/footwork.git
cd footwork
```

* **Acquire build dependencies:**

Make sure you have [node.js](http://nodejs.org/) installed in your environment. Footwork additionally requires gulp plus several bower and NPM dependencies when building from source...to install those run:

```bash
# These are needed to build footwork from source code
npm install -g gulp
npm install -g bower
npm install && bower install
```

The first `npm` command installs the [gulp](http://gulpjs.com/) task runner. The second `npm` command installs the [bower](http://bower.io/) package manager. The third installs the local build dependencies needed from both [npm](https://www.npmjs.com/) and [bower](http://bower.io/).

* **Run a gulp task to build/test/etc:**

```bash
# build everything (output in /dist) and run extended tests
gulp

# build everything (output in /dist)
gulp build-everything

# build whats necessary for continuous integration tests, and run them
gulp ci

# (re)build the custom lodash exports module
gulp lodash_custom
```

### License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

[![Join the chat at https://gitter.im/reflectiveSingleton/footwork](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/reflectiveSingleton/footwork?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Analytics](https://ga-beacon.appspot.com/UA-52543452-1/footwork/GITHUB-ROOT)](https://github.com/reflectiveSingleton/ga-beacon)
