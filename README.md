![footwork.js](https://raw.github.com/footworkjs/footwork/master/dist/gh-footwork-logo.png)
========

*```A solid footing for web applications.```*

[![Build Status](https://travis-ci.org/footworkjs/footwork.png?branch=master)](https://travis-ci.org/footworkjs/footwork) [![Build Status](https://saucelabs.com/buildstatus/reflectiv?r=4)](https://saucelabs.com/u/reflectiv) [![Test Coverage](https://coveralls.io/repos/github/footworkjs/footwork/badge.svg?branch=master)](https://coveralls.io/github/footworkjs/footwork) [![Bower version](https://badge.fury.io/bo/footwork.svg)](https://badge.fury.io/bo/footwork)

[![Build Status](https://saucelabs.com/browser-matrix/reflectiv.svg?r=7)](https://saucelabs.com/u/reflectiv)

## What is Footwork?

Footwork is a front-end javascript framework built upon open source technologies. It uses novel combinations of several design patterns and libraries to enable the creation of expressive, low-boilerplate, highly modularized, maintainable, and reusable web components and applications.

For more details, see:

* [Main Website](http://footworkjs.com/ "http://footworkjs.com")

* [Documentation/API](http://footworkjs.com/docs/list "Documentation and API information")

* [Get Started](http://footworkjs.com/get-started "Get Started")

[![Join the chat at https://gitter.im/footworkjs/footwork](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/footworkjs/footwork?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Downloading / Installing footwork.js

  * [Install via Yeoman](https://github.com/footworkjs/generator-footwork#readme "FootworkJS Yeoman Generator") (recommended)

  * [Skeleton Application](https://github.com/footworkjs/skeleton-app#readme "Skeleton Application") (based on the Yeoman generator)
  
  * [Install via Bower](http://footworkjs.com/get-started#bower)

  * [Direct Download](http://footworkjs.com/get-started#download)

It is recommended you use either the Yeoman generator to bootstrap your application, or the Skeleton Application as a template for your own. This is primarily because in order to use some of the features found in Footwork other resources (such as RequireJS) are needed and in some cases they have their own configuration/etc. The Yeoman generator and Skeleton provide sane defaults and best-use recommendations.

If you need further setup help, refer to the [Get Started](http://footworkjs.com/get-started "Get Started") page.

### Building Footwork from source and running tests

1) **Clone the repo from GitHub:**

```bash
git clone https://github.com/footworkjs/footwork.git
cd footwork
```

2) **Acquire build dependencies:**

Make sure you have [node.js](http://nodejs.org/) installed in your environment. Footwork additionally requires [gulp](http://gulpjs.com/) plus several [bower](http://bower.io/) and [NPM](https://www.npmjs.com/) dependencies when building from source...to install those run:

```bash
# install gulp (javascript task runner, http://gulpjs.com/)
npm install -g gulp # you may need to run this under sudo

# install bower (package manager, http://bower.io/)
npm install -g bower # you may need to run this under sudo

# download dependencies from npm (https://www.npmjs.com/) and bower (http://bower.io/)
npm install && bower install
```

3) **Run a gulp task to build/test/etc:**

```bash
# build everything and then run the unit tests (coverage report output in build/coverage)
gulp

# build everything (output in /build)
gulp build-everything

# build whats necessary for the unit tests, and run them (coverage report output in build/coverage)
gulp tests

# watch for changes in the source code/tests and automatically rebuild whats necessary + run tests
gulp watch

# watch for changes in the source code/tests and automatically rebuild everything + run tests
gulp watch-everything

# to debug in your own browser: start karma for continuous test monitoring
sudo npm install -g karma-cli # install karma (if needed)
karma start # now access the tests from your browser at: http://[your-server-ip-or-host]:9876/debug.html

# rebuild and deploy assets to /dist (for release)
gulp dist
```

### Documentation and Website Contributions

There is a companion repository located at [https://github.com/footworkjs/footworkjs.com](https://github.com/footworkjs/footworkjs.com).

If you wish to contribute to the documentation or main website you can do that here.

### License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

[![Analytics](https://ga-beacon.appspot.com/UA-52543452-1/footwork/GITHUB-ROOT)](https://github.com/footworkjs/ga-beacon)
