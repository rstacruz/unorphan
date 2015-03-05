# unorphan.js

See [Wikipedia](http://en.wikipedia.org/wiki/Widows_and_orphans) for a 
description of text orphans.

```js
unorphan('h1, p');
```

Or pass on a node, or a list of nodes:

```js
// Node
unorphan(document.querySelector('#top-heading h1'));

// NodeList
unorphan(document.querySelectorAll('h1, p'));

// jQuery
unorphan($('h1, p'));
```
