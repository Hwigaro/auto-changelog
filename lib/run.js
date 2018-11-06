'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var getReleases = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(commits, remote, latestVersion, options) {
    var releases, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, branch, _commits;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            releases = (0, _releases.parseReleases)(commits, remote, latestVersion, options);

            if (!options.includeBranch) {
              _context.next = 30;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 5;
            _iterator = options.includeBranch[Symbol.iterator]();

          case 7:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 16;
              break;
            }

            branch = _step.value;
            _context.next = 11;
            return (0, _commits2.fetchCommits)(remote, options, branch);

          case 11:
            _commits = _context.sent;

            releases = [].concat(_toConsumableArray(releases), _toConsumableArray((0, _releases.parseReleases)(_commits, remote, latestVersion, options)));

          case 13:
            _iteratorNormalCompletion = true;
            _context.next = 7;
            break;

          case 16:
            _context.next = 22;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 22:
            _context.prev = 22;
            _context.prev = 23;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 25:
            _context.prev = 25;

            if (!_didIteratorError) {
              _context.next = 28;
              break;
            }

            throw _iteratorError;

          case 28:
            return _context.finish(25);

          case 29:
            return _context.finish(22);

          case 30:
            return _context.abrupt('return', (0, _lodash2.default)(releases, 'tag').sort(_releases.sortReleases));

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[5, 18, 22, 30], [23,, 25, 29]]);
  }));

  return function getReleases(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var _commander = require('commander');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _lodash = require('lodash.uniqby');

var _lodash2 = _interopRequireDefault(_lodash);

var _package = require('../package.json');

var _remote = require('./remote');

var _commits2 = require('./commits');

var _releases = require('./releases');

var _template = require('./template');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var DEFAULT_OPTIONS = {
  output: 'CHANGELOG.md',
  template: 'compact',
  remote: 'origin',
  commitLimit: 3,
  tagPrefix: ''
};

var PACKAGE_OPTIONS_KEY = 'auto-changelog';

function getOptions(argv, pkg) {
  var options = new _commander.Command().option('-o, --output [file]', 'output file, default: ' + DEFAULT_OPTIONS.output).option('-t, --template [template]', 'specify template to use [compact, keepachangelog, json], default: ' + DEFAULT_OPTIONS.template).option('-r, --remote [remote]', 'specify git remote to use for links, default: ' + DEFAULT_OPTIONS.remote).option('-p, --package', 'use version from package.json as latest release').option('-v, --latest-version [version]', 'use specified version as latest release').option('-u, --unreleased', 'include section for unreleased changes').option('-l, --commit-limit [count]', 'number of commits to display per release, default: ' + DEFAULT_OPTIONS.commitLimit, _utils.parseLimit).option('-i, --issue-url [url]', 'override url for issues, use {id} for issue id').option('--issue-pattern [regex]', 'override regex pattern for issues in commit messages').option('--breaking-pattern [regex]', 'regex pattern for breaking change commits').option('--ignore-commit-pattern [regex]', 'pattern to ignore when parsing commits').option('--starting-commit [hash]', 'starting commit to use for changelog generation').option('--tag-prefix [prefix]', 'prefix used in version tags').option('--include-branch [branch]', 'one or more branches to include commits from, comma separated', function (str) {
    return str.split(',');
  }).version(_package.version).parse(argv);

  if (!pkg) {
    if (options.package) {
      throw new Error('package.json could not be found');
    }
    return _extends({}, DEFAULT_OPTIONS, options);
  }
  return _extends({}, DEFAULT_OPTIONS, pkg[PACKAGE_OPTIONS_KEY], options);
}

function getLatestVersion(options, pkg, commits) {
  if (options.latestVersion) {
    if (!_semver2.default.valid(options.latestVersion)) {
      throw new Error('--latest-version must be a valid semver version');
    }
    return options.latestVersion;
  }
  if (options.package) {
    var prefix = commits.some(function (c) {
      return (/^v/.test(c.tag)
      );
    }) ? 'v' : '';
    return '' + prefix + pkg.version;
  }
  return null;
}

exports.default = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(argv) {
    var pkg, options, remote, commits, latestVersion, releases, log;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _utils.fileExists)('package.json');

          case 2:
            _context2.t0 = _context2.sent;

            if (!_context2.t0) {
              _context2.next = 7;
              break;
            }

            _context2.next = 6;
            return (0, _utils.readJson)('package.json');

          case 6:
            _context2.t0 = _context2.sent;

          case 7:
            pkg = _context2.t0;
            options = getOptions(argv, pkg);
            _context2.next = 11;
            return (0, _remote.fetchRemote)(options.remote);

          case 11:
            remote = _context2.sent;
            _context2.next = 14;
            return (0, _commits2.fetchCommits)(remote, options);

          case 14:
            commits = _context2.sent;
            latestVersion = getLatestVersion(options, pkg, commits);
            _context2.next = 18;
            return getReleases(commits, remote, latestVersion, options);

          case 18:
            releases = _context2.sent;
            _context2.next = 21;
            return (0, _template.compileTemplate)(options.template, { releases: releases });

          case 21:
            log = _context2.sent;
            _context2.next = 24;
            return (0, _utils.writeFile)(options.output, log);

          case 24:
            return _context2.abrupt('return', Buffer.byteLength(log, 'utf8') + ' bytes written to ' + options.output);

          case 25:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function run(_x5) {
    return _ref2.apply(this, arguments);
  }

  return run;
}();