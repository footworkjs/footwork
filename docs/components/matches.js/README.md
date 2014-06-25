# matches.js

[![Build Status](https://secure.travis-ci.org/necolas/matches.js.png?branch=master)](http://travis-ci.org/necolas/matches.js)

Cross-browser test for whether or not a DOM element matches a given selector.


## Installation

Install with [Bower](http://bower.io):

```
bower install --save matches.js
```

The component can be used as a Common JS module, an AMD module, or a global.


## API

### matches(elem, selector)

`elem` must be a DOM node. `selector` must be a CSS selector string.

```js
var matches = require('matches');

var elem = document.querySelectorAll('div');
matches(elem, '.foo');
// => false

elem.className = 'foo';
matches(elem, '.foo');
// => true
```


## Testing

Install [Node](http://nodejs.org) (comes with npm) and Bower.

From the repo root, install the project's development dependencies:

```
npm install
bower install
```

Testing relies on the Karma test-runner. If you'd like to use Karma to
automatically watch and re-run the test file during development, it's easiest
to globally install Karma and run it from the CLI.

```
npm install -g karma
karma start
```

To run the tests in Firefox, just once, as CI would:

```
npm test
```


## Browser support

* Google Chrome (latest)
* Opera (latest)
* Firefox 4+
* Safari 5+
* Internet Explorer 8+
