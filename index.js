/* global define */
void (function (root, factory) {
  if (typeof define === 'function' && define.amd) define(factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root.unorphan = factory()
}(this, function () {

  var nbsp = '\xA0'
  var TEXT = 3
  var ELEMENT = 1

  unorphan.reverseWalk = reverseWalk
  return unorphan

  function unorphan (n, options) {
    if (!options) options = {}
    if (!n) return
    if (typeof n === 'string') { /* selector string */
      unorphan(document.querySelectorAll(n), options)
    } else if (n.nodeType === ELEMENT) {
      unorphanElement(n, options)
    } else if (n.nodeType === TEXT) {
      n.nodeValue = n.nodeValue.replace(/\s+([^\s]*)\s*$/, nbsp + '$1')
    } else if (n.length) { /* node list or jQuery object */
      for (var i = 0, len = n.length; i < len; i++) { unorphan(n[i], options) }
    }
  }

  /*
   * Recursively checks text nodes in an element and replaces the first
   * eligible space it encounters to a non-breaking space.
   */

  function unorphanElement (node, options) {
    var dirty /* keep track if we've seen a non-space character yet */
    var paused /* stop processing text nodes until the next <br> */

    reverseWalk(node, function (n) {
      if (n.nodeType === TEXT && !paused) {
        var text = n.nodeValue

        if (/\s+[^\s]+\s*$/.test(text) && !dirty) {
          // " xx" or " xx " => "_xx" (done!)
          n.nodeValue = text.replace(/\s+([^\s]+)\s*$/, nbsp + '$1')
          if (!options.br) return false
          paused = true
        } else if (/^[^\s]+\s*$/.test(text) && !dirty) {
          // "xx " or "xx" => pass
          dirty = true
        } else if (/\s/.test(text) && dirty) {
          // " "    => "_"
          // "xx "  => "xx_"
          // "xx x" => "xx_x" (done!)
          n.nodeValue = text.replace(/\s+([^\s]*)$/, nbsp + '$1')
          if (!options.br) return false
          paused = true
        }
      } else if (n.nodeType === ELEMENT) {
        // Start over when encountering <br>
        if (n.nodeName.toLowerCase() === 'br') {
          paused = false
          dirty = false
        }
      }
    })
  }

  /*
   * Internal: iterates *backwards* through all available text and element
   * subnodes. Abort by returning `false` on the block.
   */

  function reverseWalk (node, fn) {
    for (var i = node.childNodes.length - 1; i >= 0; i--) {
      var sub = node.childNodes[i]
      if (sub.nodeType === TEXT) {
        if (fn(sub) === false) return false
      } else if (sub.nodeType === ELEMENT) {
        if (fn(sub) === false) return false
        if (reverseWalk(sub, fn) === false) return false
      }
    }
  }

})); // eslint-disable-line
