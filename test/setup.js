/* global before */

if (typeof process === 'object') {
  require('mocha-jsdom')()
  global.expect = require('expect')
  require('expect-html-equal')
  before(function () {
    global.unorphan = require('../index')
  })
} else {
  window.require = function () { }
}
