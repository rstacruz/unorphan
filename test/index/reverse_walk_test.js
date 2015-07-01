/* global beforeEach, describe, it, expect, unorphan */
var div

if (typeof process === 'object') require('../setup')

beforeEach(function () {
  div = document.createElement('div')
})

describe('reverse walk', function () {
  var etn, res

  beforeEach(function () {
    etn = unorphan.reverseWalk
    res = []
  })

  it('works when passed with elements', function () {
    div.innerHTML = '<b>hi there</b><i>mundo</i>'
    etn(div, function (node) { res.push(node) })

    expect(res).have.length(4)
    expect(res[0].nodeName).eql('I')
    expect(res[1].nodeValue).eql('mundo')
    expect(res[2].nodeName).eql('B')
    expect(res[3].nodeValue).eql('hi there')
  })

  it('works when passed with elements and text', function () {
    div.innerHTML = '<b>hi there</b> <i>mundo</i>'
    etn(div, function (node) { res.push(node) })

    expect(res).have.length(5)
    expect(res[0].nodeName).eql('I')
    expect(res[1].nodeValue).eql('mundo')
    expect(res[2].nodeValue).eql(' ')
    expect(res[3].nodeName).eql('B')
    expect(res[4].nodeValue).eql('hi there')
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
    expect(res[0].nodeName).eql('I')
  })
})
