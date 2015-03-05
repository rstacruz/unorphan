module.exports = function unorphan(n) {
  var i;

  // string
  if (typeof n === 'string') {
    unorphan(document.querySelectorAll(n));
  }
  // ELEMENT_NODE
  else if (n.nodeType && n.nodeType === 1) {
    unorphan(lastNonSpaceChild(n));
  }
  // TEXT_NODE
  else if (n.nodeType && n.nodeType === 3) {
    n.nodeValue = n.nodeValue.replace(/\s+([^\s]+\s*)$/g, '\xA0$1');
  }
  // node list or jQuery object
  else if (n.length) {
    for (i = 0, len = n.length; i < len; i++) {
      unorphan(n[i]);
    }
  }

  function lastNonSpaceChild(node) {
    for (i = node.childNodes.length-1; i >= 0; i--) {
      var sub = node.childNodes[i];
      if (sub.nodeType !== 3 || !sub.nodeValue.match(/^\s*$/))
        return sub;
    }
  }
};
