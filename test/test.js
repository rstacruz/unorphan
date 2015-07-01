/* global before, beforeEach, describe, it, afterEach */
var expect = require('chai').expect

require('mocha-jsdom')()

var div, unorphan

before(function () {
  unorphan = require('../index')
})

beforeEach(function () {
  div = document.createElement('div')
})

describe('unorphan', function () {
  it('works', function () {
    div.innerHTML = 'hello there world'
    unorphan(div)
    expect(div.innerHTML).eql('hello there&nbsp;world')
  })

  it('works with multiple spaces', function () {
    div.innerHTML = 'hello there   world'
    unorphan(div)
    expect(div.innerHTML).eql('hello there&nbsp;world')
  })

  it('works with html', function () {
    div.innerHTML = 'hello <b>there world</b>'
    unorphan(div)
    expect(div.innerHTML).eql('hello <b>there&nbsp;world</b>')
  })

  it('works with line feed in between', function () {
    div.innerHTML = 'hello\n there\n\n world'
    unorphan(div)
    expect(div.innerHTML).eql('hello\n there&nbsp;world')
  })

  it('works with tags after space', function () {
    div.innerHTML = 'hello there <b>world</b>'
    unorphan(div)
    expect(div.innerHTML).eql('hello there&nbsp;<b>world</b>')
  })

  it('works with spaces at the end', function () {
    div.innerHTML = '<b>hello there world</b>    '
    unorphan(div)
    expect(div.innerHTML).eql('<b>hello there&nbsp;world</b>    ')

    div.innerHTML = 'hello there <b>world </b>'
    unorphan(div)
    expect(div.innerHTML).eql('hello there&nbsp;<b>world </b>')
  })

  it('works with <br> tags', function () {
    div.innerHTML = 'hello <span>there wonderfull<br>virtual world</span>'
    unorphan(div)
    expect(div.innerHTML).eql('hello <span>there&nbsp;wonderfull<br>virtual&nbsp;world</span>')
  })

  it('works on complex scenarios', function () {
    div.innerHTML = 'hello <span>there\n\n   wonderfull<br>orphaned\n  virtual world</span><br/>abc    '
    unorphan(div)
    expect(div.innerHTML).eql('hello <span>there&nbsp;wonderfull<br>orphaned\n  virtual&nbsp;world</span><br>abc    ')
  })
})

describe('in body', function () {
  beforeEach(function () {
    document.body.appendChild(div)
  })

  afterEach(function () {
    document.body.removeChild(div)
  })

  it('works with nodelists', function () {
    div.innerHTML = 'hello there world'
    unorphan(document.querySelectorAll('div'))
    expect(div.innerHTML).eql('hello there&nbsp;world')
  })

  it('works with a string', function () {
    div.innerHTML = 'hello there world'
    unorphan('div')
    expect(div.innerHTML).eql('hello there&nbsp;world')
  })
})
