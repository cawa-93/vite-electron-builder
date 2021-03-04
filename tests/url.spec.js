#!/usr/bin/node


const assert = require ('assert');
const {format} = require ('url');
const {join} = require ('path');

const expected = format({
  protocol: 'file',
  pathname: join(__dirname, '../renderer/index.html'),
  slashes: true,
});

const actual = new URL('renderer/index.html', 'file://' + __dirname);

assert.strictEqual(actual.toString(), expected);
