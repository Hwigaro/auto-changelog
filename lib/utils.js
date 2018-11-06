'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readJson = exports.getGitVersion = undefined;

var getGitVersion = exports.getGitVersion = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var output, match;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return cmd('git --version');

          case 2:
            output = _context.sent;
            match = output.match(/\d+\.\d+\.\d+/);
            return _context.abrupt('return', match ? match[0] : null);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getGitVersion() {
    return _ref.apply(this, arguments);
  };
}();

var readJson = exports.readJson = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(path) {
    var json;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return readFile(path);

          case 2:
            json = _context2.sent;
            return _context2.abrupt('return', JSON.parse(json));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function readJson(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.cmd = cmd;
exports.niceDate = niceDate;
exports.isLink = isLink;
exports.parseLimit = parseLimit;
exports.replaceText = replaceText;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.fileExists = fileExists;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Simple util for calling a child process
function cmd(string) {
  var _string$split = string.split(' '),
      _string$split2 = _toArray(_string$split),
      cmd = _string$split2[0],
      args = _string$split2.slice(1);

  return new Promise(function (resolve, reject) {
    var child = (0, _child_process.spawn)(cmd, args);
    var data = '';

    child.stdout.on('data', function (buffer) {
      data += buffer.toString();
    });
    child.stdout.on('end', function () {
      return resolve(data);
    });
    child.on('error', reject);
  });
}

function niceDate(string) {
  var date = new Date(string);
  var day = date.getUTCDate();
  var month = MONTH_NAMES[date.getUTCMonth()];
  var year = date.getUTCFullYear();
  return day + ' ' + month + ' ' + year;
}

function isLink(string) {
  return (/^http/.test(string)
  );
}

function parseLimit(limit) {
  return limit === 'false' ? false : parseInt(limit, 10);
}

function replaceText(string, options) {
  if (!options.replaceText) {
    return string;
  }
  return Object.keys(options.replaceText).reduce(function (string, pattern) {
    return string.replace(new RegExp(pattern, 'g'), options.replaceText[pattern]);
  }, string);
}

var createCallback = function createCallback(resolve, reject) {
  return function (err, data) {
    if (err) reject(err);else resolve(data);
  };
};

function readFile(path) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(path, 'utf-8', createCallback(resolve, reject));
  });
}

function writeFile(path, data) {
  return new Promise(function (resolve, reject) {
    _fs2.default.writeFile(path, data, createCallback(resolve, reject));
  });
}

function fileExists(path) {
  return new Promise(function (resolve) {
    _fs2.default.access(path, function (err) {
      return resolve(!err);
    });
  });
}