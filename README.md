![footwork.js](https://raw.github.com/footworkjs/footwork/master/dist/gh-footwork-logo.png)
========

*```A solid footing for web applications.```*

[![Build Status](https://travis-ci.org/footworkjs/footwork.png?branch=master)](https://travis-ci.org/footworkjs/footwork) [![Build Status](https://saucelabs.com/buildstatus/reflectiv)](https://saucelabs.com/u/reflectiv) [![Test Coverage](https://coveralls.io/repos/github/footworkjs/footwork/badge.svg?branch=master&r=111)](https://coveralls.io/github/footworkjs/footwork) [![Bower version](https://badge.fury.io/bo/footwork.svg)](https://badge.fury.io/bo/footwork)

[![Build Status](https://saucelabs.com/browser-matrix/reflectiv.svg)](https://saucelabs.com/u/reflectiv)

### What is Footwork?

Footwork is a front-end javascript framework built upon open source technologies. It uses novel combinations of several design patterns and libraries to enable the creation of expressive, low-boilerplate, highly modularized, maintainable, and reusable web components and applications.

For more details, see:

* [Main Website](http://footworkjs.com/ "http://footworkjs.com")

* [Documentation/API](http://footworkjs.com/docs/list "Documentation and API information")

* [Get Started](http://footworkjs.com/get-started "Get Started")

[![Join the chat at https://gitter.im/footworkjs/footwork](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/footworkjs/footwork?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

========

### Downloading / Installing footwork.js

  * [Install via Yeoman](https://github.com/footworkjs/generator-footwork#readme "FootworkJS Yeoman Generator") (recommended)

  * [Skeleton Application](https://github.com/footworkjs/skeleton-app#readme "Skeleton Application") (based on the Yeoman generator)

  * [Install via Bower](http://footworkjs.com/get-started#bower) (```bower install footwork --save```)

  * [Direct Download](https://github.com/footworkjs/footwork/blob/master/dist)

It is recommended you use either the Yeoman generator to bootstrap your application, or the Skeleton Application as a template for your own. This is primarily because in order to use some of the features found in Footwork other resources (such as RequireJS) are needed and in some cases they have their own configuration/etc. The Yeoman generator and Skeleton provide sane defaults and best-use recommendations.

If you need further setup help, refer to the [Get Started](http://footworkjs.com/get-started "Get Started") page.

========

### Building Footwork from source and running tests

1. **Clone the repo from GitHub:**
  
  ```bash
  git clone https://github.com/footworkjs/footwork.git
  cd footwork
  ```

1. **Install Node.js and NPM (if needed):**

  This is platform specific. Your OS may already include it, however if not please see: [Installing Node](https://docs.npmjs.com/getting-started/installing-node).

1. **Install [gulp](http://gulpjs.com/) globally (if needed):** 

  ```bash
  sudo npm install -g gulp-cli
  ```

1. **Acquire build dependencies:**

  ```bash
  npm install
  ```

1. **Run a gulp task to build/test/etc:**
  
  * Build everything (output in /build):
  
    ```bash
    gulp
    ```
  
  * You can include the `---debug` option on any of the build/testing tasks to include/generate a source map in the output:
  
    ```bash
    gulp --debug
    ```

  * Build everything and run tests (coverage report output in build/coverage):
  
    ```bash
    gulp tests
    ```

  * Watch for changes in the source code and automatically rebuild:
  
    ```bash
    gulp watch
    ```
  
  * Watch for changes in the source code/tests and automatically rebuild + run tests:
  
    ```bash
    gulp watch-test
    ```

  * Build everything, minify, and deploy to /dist (for release):
  
    ```bash
    gulp dist
    ```

  * To debug the tests in your own browser:
    
    * Make sure your build is made *without* being instrumented for test coverage by running the default build task (otherwise debugging might be a bit difficult):

      ```bash
      gulp
      ```

    * Install karma (if needed)

      ```bash
      sudo npm install -g karma-cli
      ```
         
    * Start karma and then you can access/debug the tests from your browser at: [http://localhost:9876/debug.html](http://localhost:9876/debug.html)

      ```bash
      karma start
      ```

### Documentation Contributions

There is a companion repository located at [https://github.com/footworkjs/footwork-documentation](https://github.com/footworkjs/footwork-documentation).

### License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
