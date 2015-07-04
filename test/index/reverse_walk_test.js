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

    expect(res.length).toEqual(4)
    expect(res[0].nodeName).toEqual('I')
    expect(res[1].nodeValue).toEqual('mundo')
    expect(res[2].nodeName).toEqual('B')
    expect(res[3].nodeValue).toEqual('hi there')
  })

  it('works when passed with elements and text', function () {
    div.innerHTML = '<b>hi there</b> <i>mundo</i>'
    etn(div, function (node) { res.push(node) })

    expect(res.length).toEqual(5)
    expect(res[0].nodeName).toEqual('I')
    expect(res[1].nodeValue).toEqual('mundo')
    expect(res[2].nodeValue).toEqual(' ')
    expect(res[3].nodeName).toEqual('B')
    expect(res[4].nodeValue).toEqual('hi there')
  })

  it('works when passed with text', function () {
    div.innerHTML = 'hi there'
    etn(div, function (node) { res.push(node) })

    expect(res.length).toEqual(1)
    expect(res[0].nodeValue).toEqual('hi there')
  })

  it('can be aborted', function () {
    div.innerHTML = '<b>hi there</b><i>mundo</i>'

    etn(div, function (node) {
      res.push(node)
      return false
    })

    expect(res.length).toEqual(1)
    expect(res[0].nodeName).toEqual('I')
  })
})
