/* global before, beforeEach, describe, it, afterEach, xdescribe */
var expect = require('chai').expect

require('mocha-jsdom')()

var div, unorphan

before(function () {
  unorphan = require('../index')
})

beforeEach(function () {
  div = document.createElement('div')
})

describe('eachTextNode', function () {
  var etn, res

  beforeEach(function () {
    etn = unorphan.eachTextNode
    res = []
  })

  it('works when passed with elements', function () {
    div.innerHTML = '<b>hi there</b><i>mundo</i>'
    etn(div, function (node) { res.push(node) })

    expect(res).have.length(2)
    expect(res[0].nodeValue).eql('mundo')
    expect(res[1].nodeValue).eql('hi there')
  })

  it('works when passed with elements and text', function () {
    div.innerHTML = '<b>hi there</b> <i>mundo</i>'
    etn(div, function (node) { res.push(node) })

    expect(res).have.length(3)
    expect(res[0].nodeValue).eql('mundo')
    expect(res[1].nodeValue).eql(' ')
    expect(res[2].nodeValue).eql('hi there')
  })

  it('works when passed with text', function () {
    div.innerHTML = 'hi there'
    etn(div, function (node) { res.push(node) })

    expect(res).have.length(1)
    expect(res[0].nodeValue).eql('hi there')
  })

  it('can be aborted', function () {
    div.innerHTML = '<b>hi there</b><i>mundo</i>'

    etn(div, function (node) {
      res.push(node)
      return false
    })

    expect(res).have.length(1)
    expect(res[0].nodeValue).eql('mundo')
  })
})

describe('simplified cases', function () {
  function test (input, output) {
    var msg = '"' + input + '" → "' + output + '"'
    it(msg, function () {
      div.innerHTML = input
      unorphan(div)
      expect(div.innerHTML).eql(output.replace(/_/g, '&nbsp;'))
    })
  }

  test('', '')
  test(' ', ' ')
  test('x', 'x')
  test(' x', '_x')
  test('  x', '_x')
  test(' x ', '_x')
  test('  x ', '_x')
  test('x ', 'x ')
  test('x y', 'x_y')
  test('x y ', 'x_y')
  test('x  y', 'x_y')
  test('x  y ', 'x_y')
  test('<b>x</b>', '<b>x</b>')
  test('<b>x</b> ', '<b>x</b> ')
  test('<b> x</b>', '<b>_x</b>')
  test('<b> x</b> ', '<b>_x</b> ')
  test(' <b> x</b> ', ' <b>_x</b> ')
  test(' <b>  x</b> ', ' <b>_x</b> ')
  test('x <b>y z</b>', 'x <b>y_z</b>')
  test('x <b>y   z</b>', 'x <b>y_z</b>')
  test('x y <b>z</b>', 'x y_<b>z</b>')
  test('x y<b> </b>z', 'x y<b>_</b>z')
  test('x <b>y</b> <b>z</b>', 'x <b>y</b>_<b>z</b>')
  test('x <b>y</b><i> </i><b>z</b>', 'x <b>y</b><i>_</i><b>z</b>')
  test('x <b>y</b><i>   </i><b>z</b>', 'x <b>y</b><i>_</i><b>z</b>')
  test('x <b>y</b> <b>z</b> ', 'x <b>y</b>_<b>z</b> ')
  test('x <b>y</b>   <b>z</b> ', 'x <b>y</b>_<b>z</b> ')

  xdescribe('pending cases', function () {
    test('x <b> x</b> ', 'x_<b>_x</b> ')
  })
})

describe('unorphan', function () {
  it('works', function () {
    div.innerHTML = 'hello there world'
    unorphan(div)
    expect(div.innerHTML).eql('hello there&nbsp;world')
  })

  it('works with html', function () {
    div.innerHTML = 'hello <b>there world</b>'
    unorphan(div)
    expect(div.innerHTML).eql('hello <b>there&nbsp;world</b>')
  })

  it('works with nested html', function () {
    div.innerHTML = 'hello <b><i>there wor</i>ld</b>'
    unorphan(div)
    expect(div.innerHTML).eql('hello <b><i>there&nbsp;wor</i>ld</b>')
  })

  it('works with nested html', function () {
    div.innerHTML = 'hello <b>there<i> </i>world</b>'
    unorphan(div)
    expect(div.innerHTML).eql('hello <b>there<i>&nbsp;</i>world</b>')
  })

  // inherited from https://github.com/rstacruz/unorphan/pull/4
  // Thanks @doup!
  it('works with one word html', function () {
    div.innerHTML = 'hello there <b>world</b>'
    unorphan(div)
    expect(div.innerHTML).eql('hello there&nbsp;<b>world</b>')
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
  })

  it('works with spaces at the end (2)', function () {
    div.innerHTML = 'hello there <b>world </b>'
    unorphan(div)
    expect(div.innerHTML).eql('hello there&nbsp;<b>world </b>')
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
