![footwork.js](https://raw.github.com/reflectiveSingleton/footwork/master/dist/gh-footwork-logo.png)
========
[http://footworkjs.com](http://footworkjs.com "Footwork.js Homepage")

[![Build Status](https://travis-ci.org/reflectiveSingleton/footwork.png?branch=master)](https://travis-ci.org/reflectiveSingleton/footwork) [![Bower version](https://badge.fury.io/bo/footwork.png)](http://badge.fury.io/bo/footwork)

A solid footing for web applications.

## What is footwork?

Footwork is a front-end framework built upon open source technologies. It uses novel combinations of several design patterns and libraries to enable the creation of expressive, low-boilerplate, highly modularized, maintainable, and reusable web components and applications.

**Totally new to footwork?** The easiest place to start is [the tutorials](http://latest-docs.footworkjs.com/tutorials).

For more details, see:

 * [Main Website](http://footworkjs.com/)

 * [Documentation/API](http://latest-docs.footworkjs.com/)

### Building footwork from source

1. **Clone the repo from GitHub**

```bash
        git clone https://github.com/reflectiveSingleton/footwork.git
        cd footwork
```

2. **Acquire build dependencies.** Make sure you have [Node.js](http://nodejs.org/) installed on your workstation. This is only needed to _build_ footwork from source. Footwork requires gulp as well as several bower and NPM dependencies when building...to install those run:

```bash
        npm install -g gulp
        npm install -g bower
        npm install && bower install
```      

    The first `npm` command installs [gulp](http://gulpjs.com/) task runner. The second `npm` command installs [bower](http://bower.io/). The third installs the local build dependencies needed from [npm](https://www.npmjs.com/) and [bower](http://bower.io/).

3. **Run a gulp task to build/test/etc**

```bash
        # build everything (output in /dist) and run extended tests
        gulp

        # build everything (output in /dist)
        gulp build-everything

        # build whats necessary for continuous integration tests, and run them
        gulp ci
```

##License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

[![Join the chat at https://gitter.im/reflectiveSingleton/footwork](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/reflectiveSingleton/footwork?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Analytics](https://ga-beacon.appspot.com/UA-52543452-1/footwork/GITHUB-ROOT)](https://github.com/reflectiveSingleton/ga-beacon)
