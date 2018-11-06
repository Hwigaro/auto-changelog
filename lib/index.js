#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _run = require('./run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _run2.default)(process.argv).then(function (message) {
  console.log(message);
  process.exit(0);
}).catch(function (error) {
  console.error(error);
  process.exit(1);
});