/* global beforeEach, describe, it, expect, unorphan, afterEach */
var div

if (typeof process === 'object') require('../setup')

beforeEach(function () {
  div = document.createElement('div')
})

describe('unorphan', function () {
  it('works', function () {
    div.innerHTML = 'hello there world'
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('hello there&nbsp;world')
  })

  it('can accept null', function () {
    expect(unorphan(null)).toEqual(undefined)
  })

  it('works with text elements', function () {
    var text = document.createTextNode('hello there world')
    unorphan(text)
    expect(text.nodeValue).toHtmlEqual('hello there&nbsp;world')
  })

  it('works with html', function () {
    div.innerHTML = 'hello <b>there world</b>'
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('hello <b>there&nbsp;world</b>')
  })

  it('works with nested html', function () {
    div.innerHTML = 'hello <b><i>there wor</i>ld</b>'
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('hello <b><i>there&nbsp;wor</i>ld</b>')
  })

  it('works with nested html', function () {
    div.innerHTML = 'hello <b>there<i> </i>world</b>'
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('hello <b>there<i>&nbsp;</i>world</b>')
  })

  // inherited from https://github.com/rstacruz/unorphan/pull/4
  // Thanks @doup!
  it('works with one word html', function () {
    div.innerHTML = 'hello there <b>world</b>'
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('hello there&nbsp;<b>world</b>')
  })

  it('works with line feed in between', function () {
    div.innerHTML = 'hello\n there\n\n world'
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('hello\n there&nbsp;world')
  })

  it('works with tags after space', function () {
    div.innerHTML = 'hello there <b>world</b>'
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('hello there&nbsp;<b>world</b>')
  })

  it('works with spaces at the end', function () {
    div.innerHTML = '<b>hello there world</b>    '
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('<b>hello there&nbsp;world</b>    ')
  })

  it('works with spaces at the end (2)', function () {
    div.innerHTML = 'hello there <b>world </b>'
    unorphan(div)
    expect(div.innerHTML).toHtmlEqual('hello there&nbsp;<b>world </b>')
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
    expect(div.innerHTML).toHtmlEqual('hello there&nbsp;world')
  })

  it('works with a string', function () {
    div.innerHTML = 'hello there world'
    unorphan('div')
    expect(div.innerHTML).toHtmlEqual('hello there&nbsp;world')
  })
})
