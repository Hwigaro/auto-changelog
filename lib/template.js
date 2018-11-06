'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileTemplate = undefined;

var getTemplate = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(template) {
    var response, path;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!MATCH_URL.test(template)) {
              _context.next = 5;
              break;
            }

            _context.next = 3;
            return (0, _nodeFetch2.default)(template);

          case 3:
            response = _context.sent;
            return _context.abrupt('return', response.text());

          case 5:
            _context.next = 7;
            return (0, _utils.fileExists)(template);

          case 7:
            if (!_context.sent) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', (0, _utils.readFile)(template));

          case 9:
            path = (0, _path.join)(TEMPLATES_DIR, template + '.hbs');
            _context.next = 12;
            return (0, _utils.fileExists)(path);

          case 12:
            _context.t0 = _context.sent;

            if (!(_context.t0 === false)) {
              _context.next = 15;
              break;
            }

            throw new Error('Template \'' + template + '\' was not found');

          case 15:
            return _context.abrupt('return', (0, _utils.readFile)(path));

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getTemplate(_x) {
    return _ref.apply(this, arguments);
  };
}();

var compileTemplate = exports.compileTemplate = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(template, data) {
    var compile;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _handlebars2.default;
            _context2.next = 3;
            return getTemplate(template);

          case 3:
            _context2.t1 = _context2.sent;
            compile = _context2.t0.compile.call(_context2.t0, _context2.t1);

            if (!(template === 'json')) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', compile(data));

          case 7:
            return _context2.abrupt('return', cleanTemplate(compile(data)));

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function compileTemplate(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _path = require('path');

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var TEMPLATES_DIR = (0, _path.join)(__dirname, '..', 'templates');
var MATCH_URL = /^https?:\/\/.+/;

_handlebars2.default.registerHelper('json', function (object) {
  return new _handlebars2.default.SafeString(JSON.stringify(object, null, 2));
});

_handlebars2.default.registerHelper('commit-list', function (context, options) {
  if (!context || context.length === 0) {
    return '';
  }

  var list = context.filter(function (commit) {
    if (options.hash.exclude) {
      var pattern = new RegExp(options.hash.exclude, 'm');
      if (pattern.test(commit.message)) {
        return false;
      }
    }
    if (options.hash.message) {
      var _pattern = new RegExp(options.hash.message, 'm');
      return _pattern.test(commit.message);
    }
    if (options.hash.subject) {
      var _pattern2 = new RegExp(options.hash.subject);
      return _pattern2.test(commit.subject);
    }
    return true;
  }).map(function (item) {
    return options.fn(item);
  }).join('');

  if (!list) {
    return '';
  }

  return options.hash.heading + '\n\n' + list;
});

_handlebars2.default.registerHelper('matches', function (val, pattern, options) {
  var r = new RegExp(pattern, options.hash.flags || '');
  return r.test(val) ? options.fn(this) : options.inverse(this);
});

function cleanTemplate(template) {
  return template
  // Remove indentation
  .replace(/\n +/g, '\n').replace(/^ +/, '')
  // Fix multiple blank lines
  .replace(/\n\n\n+/g, '\n\n').replace(/\n\n$/, '\n');
}