![footwork.js](https://raw.github.com/reflectiveSingleton/footwork/master/docs/images/gh-footwork-logo.png)
========
[http://footworkjs.com](http://footworkjs.com "Footwork.js Homepage")

[![Build Status](https://travis-ci.org/reflectiveSingleton/footwork.png?branch=master)](https://travis-ci.org/reflectiveSingleton/footwork) [![Bower version](https://badge.fury.io/bo/footwork.png)](http://badge.fury.io/bo/footwork)

A solid footing for knockout applications.

## What is footwork?

Footwork is a front-end framework built upon open source technologies. It uses novel combinations of several design patterns and libraries to enable the creation of expressive, low-boilerplate, highly modularized, maintainable, and reusable web components and applications.

TLDR: It makes knockout based applications easier to extend, scale, and maintain.

## Why use footwork?
There are a few main selling points:

1. **Expressive and semantic**

    Footwork makes use of a formalized viewModel construct along with built-in namespace, CQRS, and more. This makes working with your applications pieces easy while providing for proper separation of concerns. Integrated component support is from knockout 3.2+ which allows for the creation and use of fully modular custom elements. Why wait for browsers to support components...use them today!

2. **Low boilerplate**

    We all want to write as little code as possible while still enabling maximum extensibility. Footwork ensures you write as little code as possible while still allowing you to hook in at the appropriate locations your application needs. A lot of care is taken to make use of footwork work with very little fat to get in your way.

3. **Module and component based**

    Footwork makes use of Knockout 3.2+ along with a modular structure that enables full encapsulation of both logic and display source code. Reusing the different pieces of your application couldn't be easier.

    Note: it is also recommended to use requirejs for help with the modular structuring and optimization of your code.

4. **Maintainability**

    Applications written using modular components and models combined with the expressiveness and semantics afforded by footwork makes maintaining them a breeze. This is because your code *says* what it means and does. Reading code you wrote a while back, or something someone else made becomes much more straightforward.

### Footworks special sauce...

The following dependencies are considered part of 'core':

* [Knockout](http://knockoutjs.com/)
* [lodash](http://lodash.com/)
* [riveter](https://github.com/a2labs/riveter)
* [postal.js](https://github.com/postaljs/postal.js)
  * [conduitjs](https://github.com/ifandelse/ConduitJS) (needed by postal.js)

More unit tests, documentation, and features coming soon.

[![Analytics](https://ga-beacon.appspot.com/UA-52543452-1/footwork/GITHUB-ROOT)](https://github.com/reflectiveSingleton/ga-beacon)
