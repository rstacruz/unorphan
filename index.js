/* global define */
void (function (root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root.unorphan = factory()
}(this, function () {

  return function unorphan (n) {
    if (!n) {
      return
    } else if (typeof n === 'string') {
      // string
      unorphan(document.querySelectorAll(n))
    } else if (n.nodeType && n.nodeType === 1) {
      // ELEMENT_NODE
      lastNonSpaceChilds(n).forEach(function (n) {
        // Replace last spaces group with a non-breaking-space
        n.nodeValue = n.nodeValue.replace(/(\s+)([^\s]*)$/g, '\xA0$2')
      })
    } else if (n.length) {
      // node list or jQuery object
      for (var i = 0, len = n.length; i < len; i++) {
        unorphan(n[i])
      }
    }
  }

  // For each group of text nodes divided by <br>
  // find the candidate for adding a non-breaking-space
  //
  // `str` is to check if the node makes a good candidate, e.g.:
  //
  // Given ['hello ', 'world '], start from the end:
  //
  // 1: 'world '       => NO
  // 0: 'hello world ' => YES. Return the 'hello ' node and replace
  //                      the last space with a non-breaking-space
  //
  function lastNonSpaceChilds (node) {
    return textNodeGroups(node).map(function (group) {
      var isCandidate = /\s+([^\s]+\s*)$/g
      var str = ''

      for (var i = group.length - 1; i >= 0; i--) {
        str = group[i].nodeValue + str

        // At the end, check for:
        // spaces + alphanumeric + optional spaces
        if (isCandidate.test(str)) {
          return group[i]
        }
      }

      return null
    }).filter(function (node) {
      return node !== null
    })
  }

  // Groups the flattened DOM into groups of TEXT_NODES
  // cut where <br/> elements are found, e.g.:
  //
  // [
  //     TEXT_NODE("hello "),
  //     TEXT_NODE("wonderfull"),
  //     ELEMENT_NODE("BR"),
  //     TEXT_NODE("world"),
  //     TEXT_NODE("    "),
  // ]
  //
  // [
  //     [TEXT_NODE("hello "), TEXT_NODE("wonderfull")],
  //     [TEXT_NODE("world"), TEXT_NODE("    ")],
  // ]
  function textNodeGroups (node) {
    var nodes = flatten(node)
    var group = []
    var out = []

    out.push(group)

    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 3) {
        group.push(nodes[i])
      } else {
        group = []
        out.push(group)
      }
    }

    return out
  }

  // Flattens DOM, to get a list of TEXT_NODES + <BR>, e.g.:
  //
  // "hello <b>wonderfull<br>world</b>    ", becomes:
  //
  // [
  //     TEXT_NODE("hello "),
  //     TEXT_NODE("wonderfull"),
  //     ELEMENT_NODE("BR"),
  //     TEXT_NODE("world"),
  //     TEXT_NODE("    "),
  // ]
  function flatten (node, out) {
    out = out || []

    for (var i = 0; i < node.childNodes.length; i++) {
      var sub = node.childNodes[i]

      // Get TEXT_NODES or ELEMENT_NODE(BR)
      if (sub.nodeType === 3 || (sub.nodeType === 1 && sub.tagName === 'BR')) {
        out.push(sub)
      } else {
        flatten(sub, out)
      }
    }

    return out
  }
}))
