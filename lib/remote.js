'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRemote = undefined;

var fetchRemote = exports.fetchRemote = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name) {
    var remoteURL, remote, protocol, hostname, repo, project;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.cmd)('git config --get remote.' + name + '.url');

          case 2:
            remoteURL = _context.sent;

            if (remoteURL) {
              _context.next = 7;
              break;
            }

            console.warn('Warning: Git remote ' + name + ' was not found');
            console.warn('Warning: Changelog will not contain links to commits, issues, or PRs');
            return _context.abrupt('return', null);

          case 7:
            remote = (0, _parseGithubUrl2.default)(remoteURL);
            protocol = remote.protocol === 'http:' ? 'http:' : 'https:';
            hostname = remote.hostname || remote.host;
            repo = remote.repo;
            project = remote.repo;


            if (/gitlab/.test(hostname) && /\.git$/.test(remote.branch)) {
              // Support gitlab subgroups
              repo = remote.repo + '/' + remote.branch.replace(/\.git$/, '');
              project = remote.repo + '/' + remote.branch.replace(/\.git$/, '');
            }

            if (/dev.azure/.test(hostname)) {
              repo = '' + remote.path;
              project = remote.repo;
            }

            if (/visualstudio/.test(hostname)) {
              repo = remote.repo + '/' + remote.branch;
              project = remote.owner;
            }

            return _context.abrupt('return', {
              hostname: hostname,
              url: protocol + '//' + hostname + '/' + repo,
              project: protocol + '//' + hostname + '/' + project
            });

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchRemote(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _parseGithubUrl = require('parse-github-url');

var _parseGithubUrl2 = _interopRequireDefault(_parseGithubUrl);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }