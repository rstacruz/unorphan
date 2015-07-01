# unorphan.js

Prevents text orphans.

> *orphan* (n.) A word, part of a word, or very short line that appears by itself at the end of a paragraph. (via [Wikipedia](http://en.wikipedia.org/wiki/Widows_and_orphans))

![](http://ricostacruz.com/unorphan/screenshot.png)

[![Status](https://travis-ci.org/rstacruz/unorphan.svg?branch=master)](https://travis-ci.org/rstacruz/unorphan "See test builds")

<br>

## Usage

Call `unorphan()` on some nodes.

```js
unorphan('h1, p')
```

Or pass on a node, or a list of nodes:

```js
// Node
unorphan(document.querySelector('#top-heading h1'))

// NodeList
unorphan(document.querySelectorAll('h1, p'))

// jQuery
unorphan($('h1, p'))
```

<br>

**How does it work?** — This changes last orphan space to a [non-breaking space][nbsp] so the last 2 words stick together. Yes, it's [smart][test] and handles many edge cases.

```html
<!-- before: --> <h1>Hello there world</h1>
<!--  after: --> <h1>Hello there&nbsp;world</h1>
```

[nbsp]: https://en.wikipedia.org/wiki/Non-breaking_space
[test]: https://github.com/rstacruz/unorphan/blob/master/test/index/cases_test.js

<br>

**Line breaks** — You may also unorphan before line breaks by passing `{ br: true }`.

```js
unorphan('h1, p', { br: true })
```

```html
<p>4 Privet&nbsp;Drive<br>
Little&nbsp;Whigging<br>
Surrey</p>
```

<br>

## Download

```
npm install unorphan
bower install unorphan
```

[![npm version](http://img.shields.io/npm/v/unorphan.svg)](https://npmjs.org/package/unorphan "View this project on npm")

<br>

## Thanks

**unorphan** © 2015+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/unorphan/contributors
