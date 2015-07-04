/* global beforeEach, describe, it, xdescribe, expect, unorphan */
var div

if (typeof process === 'object') require('../setup')

beforeEach(function () {
  div = document.createElement('div')
})

describe('simplified cases', function () {
  test('', '')
  test(' ', ' ')
  test('x', 'x')

  // these fail in IE8. harmlessly, really
  describe('leading whitespace', function () {
    test(' x', '_x')
    test('  x', '_x')
    test(' x ', '_x')
    test('  x ', '_x')
  })

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

  describe('line breaks', function () {
    test('a b<br>c d', 'a b<br>c_d')
    test('a b<br>c d', 'a_b<br>c_d', { br: true })
    test('a b<i><br>c</i> d', 'a b<i><br>c</i>_d')
    test('a b<i><br>c</i> d', 'a_b<i><br>c</i>_d', { br: true })
    test('a <i>b<br>c</i> d', 'a <i>b<br>c</i>_d')
    test('a <i>b<br>c</i> d', 'a_<i>b<br>c</i>_d', { br: true })
    test('a b<br><br>c d', 'a b<br><br>c_d')
    test('a b<br><br>c d', 'a_b<br><br>c_d', { br: true })
    test('a b<br>c d e<br>f g', 'a_b<br>c d_e<br>f_g', { br: true })
    test('a b<br>c d e<br>f g h', 'a b<br>c d e<br>f g_h')
    test('a b<br>c d e<br>f g h', 'a_b<br>c d_e<br>f g_h', { br: true })
  })

  xdescribe('pending cases', function () {
    test('x <b> x</b> ', 'x<b>_x</b> ')
  })
})

function test (input, output, options) {
  var msg = '"' + input + '" → "' + output + '"'
  if (options) msg += ' ' + JSON.stringify(options)
  it(msg, function () {
    div.innerHTML = input
    unorphan(div, options)
    expect(div.innerHTML).toHtmlEqual(output.replace(/_/g, '&nbsp;'))
  })
}
