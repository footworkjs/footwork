![footwork.js](https://raw.github.com/reflectiveSingleton/footwork/master/dist/gh-footwork-logo.png)

*```A solid footing for web applications.```*

========

[![Build Status](https://travis-ci.org/reflectiveSingleton/footwork.png?branch=master)](https://travis-ci.org/reflectiveSingleton/footwork) [![Bower version](https://badge.fury.io/bo/footwork.png)](http://badge.fury.io/bo/footwork)

## What is footwork?

Footwork is a front-end javascript framework built upon open source technologies. It uses novel combinations of several design patterns and libraries to enable the creation of expressive, low-boilerplate, highly modularized, maintainable, and reusable web components and applications.

**Totally new to footwork?** The easiest place to start is [the tutorials](http://latest-docs.footworkjs.com/tutorials "Get started quick!").

For more details, see:

* [Main Website](http://footworkjs.com/ "http://footworkjs.com")

* [Documentation/API](http://latest-docs.footworkjs.com/ "Documentation and API information")

* [Tutorials](http://latest-docs.footworkjs.com/tutorials "Tutorials and guides")

[![Join the chat at https://gitter.im/reflectiveSingleton/footwork](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/reflectiveSingleton/footwork?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Downloading footwork.js

Footwork is available for download directly on the [main website](http://footworkjs.com/ "Footwork.js Homepage") however it is recommended you use [bower](http://bower.io/) to download/install the framework:

*Install via command line:*
```bash
# run this command in your public html folder
bower install footwork
```

*Install via ```bower.json``` (recommended)*
```javascript
{
  "dependencies": {
    "footwork": "*", // add footwork under "dependencies"
  }
}
```
```bash
# run this in the same directory as your bower.json file
bower install
```

### Building footwork from source and running tests

1) **Clone the repo from GitHub:**

```bash
git clone https://github.com/reflectiveSingleton/footwork.git
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

[![Analytics](https://ga-beacon.appspot.com/UA-52543452-1/footwork/GITHUB-ROOT)](https://github.com/reflectiveSingleton/ga-beacon)
