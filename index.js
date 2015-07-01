/* global define */
void (function (root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root.unorphan = factory()
}(this, function () {

  var TEXT = 3
  var ELEMENT = 1
  var nbsp = '\xA0'

  unorphan.eachTextNode = eachTextNode
  return unorphan

  function unorphan (n) {
    if (!n) return
    if (typeof n === 'string') { /* selector string */
      unorphan(document.querySelectorAll(n))
    } else if (n.nodeType === ELEMENT) {
      unorphanElement(n)
    } else if (n.nodeType === TEXT) {
      n.nodeValue = n.nodeValue.replace(/\s+([^\s]*)\s*$/, nbsp + '$1')
    } else if (n.length) { /* node list or jQuery object */
      for (var i = 0, len = n.length; i < len; i++) { unorphan(n[i]) }
    }
  }

  /*
   * Recursively checks text nodes in an element and replaces the first
   * eligible space it encounters to a non-breaking space.
   */

  function unorphanElement (node) {
    // keep track if we've seen a non-space character yet.
    var dirty

    eachTextNode(node, function (n) {
      var text = n.nodeValue

      if (!dirty && /^\s*$/.test(text)) {
        // "  "  => pass
      } else if (!dirty && /\s+[^\s]+\s*$/.test(text)) {
        // " xx" or " xx " => "_xx" (done!)
        n.nodeValue = text.replace(/\s+([^\s]+)\s*$/, nbsp + '$1')
        return false
      } else if (/^[^\s]+\s*$/.test(text)) {
        // "xx " or "xx" => pass
        dirty = true
      } else if (/\s/.test(text)) {
        // "xx "  => "xx_"
        // "xx x" => "xx_x" (done!)
        n.nodeValue = text.replace(/\s+([^\s]*)$/, nbsp + '$1')
        return false
      }
    })
  }

  /*
   * Internal: iterates *backwards* through all available text subnodes.
   * Abort by returning `false` on the block.
   */

  function eachTextNode (node, fn) {
    for (var i = node.childNodes.length - 1; i >= 0; i--) {
      var sub = node.childNodes[i]
      if (sub.nodeType === TEXT) {
        if (fn(sub) === false) return false
      } else if (sub.nodeType === ELEMENT) {
        if (eachTextNode(sub, fn) === false) return false
      }
    }
  }

}))
