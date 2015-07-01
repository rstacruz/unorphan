/* global before */

if (typeof process === 'object') {
  require('mocha-jsdom')()
  global.expect = require('chai').expect
  before(function () {
    global.unorphan = require('../index')
  })
} else {
  window.expect = window.chai.expect
}
