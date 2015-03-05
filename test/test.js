var expect = require('chai').expect;

require('mocha-jsdom')();

var div, unorphan;

before(function () {
  unorphan = require('../index');
});

beforeEach(function () {
  div = document.createElement('div');
});

describe('unorphan', function () {
  it('works', function () {
    div.innerHTML = 'hello there world';
    unorphan(div);
    expect(div.innerHTML).eql('hello there&nbsp;world');
  });

  it('works with html', function () {
    div.innerHTML = 'hello <b>there world</b>';
    unorphan(div);
    expect(div.innerHTML).eql('hello <b>there&nbsp;world</b>');
  });
});

describe('in body', function () {
  beforeEach(function () {
    document.body.appendChild(div);
  });

  afterEach(function () {
    document.body.removeChild(div);
  });

  it('works with nodelists', function () {
    div.innerHTML = 'hello there world';
    unorphan(document.querySelectorAll('div'));
    expect(div.innerHTML).eql('hello there&nbsp;world');
  });

  it('works with a string', function () {
    div.innerHTML = 'hello there world';
    unorphan('div');
    expect(div.innerHTML).eql('hello there&nbsp;world');
  });
});
