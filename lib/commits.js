'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCommits = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var fetchCommits = exports.fetchCommits = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(remote, options) {
    var branch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var command, format, log;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            command = branch ? 'git log ' + branch : 'git log';
            _context.next = 3;
            return getLogFormat();

          case 3:
            format = _context.sent;
            _context.next = 6;
            return (0, _utils.cmd)(command + ' --shortstat --pretty=format:' + format);

          case 6:
            log = _context.sent;
            return _context.abrupt('return', parseCommits(log, remote, options));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchCommits(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getLogFormat = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var gitVersion, bodyFormat;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _utils.getGitVersion)();

          case 2:
            gitVersion = _context2.sent;
            bodyFormat = gitVersion && _semver2.default.gte(gitVersion, '1.7.2') ? BODY_FORMAT : FALLBACK_BODY_FORMAT;
            return _context2.abrupt('return', COMMIT_SEPARATOR + '%H%n%d%n%ai%n%an%n%ae%n' + bodyFormat + MESSAGE_SEPARATOR);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getLogFormat() {
    return _ref2.apply(this, arguments);
  };
}();

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var COMMIT_SEPARATOR = '__AUTO_CHANGELOG_COMMIT_SEPARATOR__';
var MESSAGE_SEPARATOR = '__AUTO_CHANGELOG_MESSAGE_SEPARATOR__';
var MATCH_COMMIT = /(.*)\n(?:\s\((.*)\))?\n(.*)\n(.*)\n(.*)\n([\S\s]+)/;
var MATCH_STATS = /(\d+) files? changed(?:, (\d+) insertions?...)?(?:, (\d+) deletions?...)?/;
var BODY_FORMAT = '%B';
var FALLBACK_BODY_FORMAT = '%s%n%n%b';

// https://help.github.com/articles/closing-issues-via-commit-messages
var DEFAULT_FIX_PATTERN = /(?:close[sd]?|fixe?[sd]?|resolve[sd]?)\s(?:#(\d+)|(https?:\/\/.+?\/(?:issues|pull|pull-requests|merge_requests)\/(\d+)))/gi;

var MERGE_PATTERNS = [/Merge pull request #(\d+) from .+\n\n(.+)/, // Regular GitHub merge
/^(.+) \(#(\d+)\)(?:$|\n\n)/, // Github squash merge
/Merged in .+ \(pull request #(\d+)\)\n\n(.+)/, // BitBucket merge
/Merge branch .+ into .+\n\n(.+)[\S\s]+See merge request [^!]*!(\d+)/ // GitLab merge
];

function parseCommits(string, remote) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var commits = string.split(COMMIT_SEPARATOR).slice(1).map(function (commit) {
    return parseCommit(commit, remote, options);
  }).filter(function (commit) {
    if (options.ignoreCommitPattern) {
      return new RegExp(options.ignoreCommitPattern).test(commit.subject) === false;
    }
    return true;
  });

  if (options.startingCommit) {
    var index = commits.findIndex(function (c) {
      return c.hash.indexOf(options.startingCommit) === 0;
    });
    if (index === -1) {
      throw new Error('Starting commit ' + options.startingCommit + ' was not found');
    }
    return commits.slice(0, index + 1);
  }

  return commits;
}

function parseCommit(commit, remote) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _commit$match = commit.match(MATCH_COMMIT),
      _commit$match2 = _slicedToArray(_commit$match, 7),
      hash = _commit$match2[1],
      refs = _commit$match2[2],
      date = _commit$match2[3],
      author = _commit$match2[4],
      email = _commit$match2[5],
      tail = _commit$match2[6];

  var _tail$split = tail.split(MESSAGE_SEPARATOR),
      _tail$split2 = _slicedToArray(_tail$split, 2),
      message = _tail$split2[0],
      stats = _tail$split2[1];

  return _extends({
    hash: hash,
    shorthash: hash.slice(0, 7),
    author: author,
    email: email,
    date: new Date(date).toISOString(),
    tag: getTag(refs, options),
    subject: (0, _utils.replaceText)(getSubject(message), options),
    message: message.trim(),
    fixes: getFixes(message, author, remote, options),
    merge: getMerge(message, author, remote, options),
    href: getCommitLink(hash, remote),
    breaking: !!options.breakingPattern && new RegExp(options.breakingPattern).test(message)
  }, getStats(stats.trim()));
}

function getTag(refs, options) {
  if (!refs) return null;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = refs.split(', ')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var ref = _step.value;

      var prefix = 'tag: ' + options.tagPrefix;
      if (ref.indexOf(prefix) === 0) {
        var version = ref.replace(prefix, '');
        if (_semver2.default.valid(version)) {
          return version;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
}

function getSubject(message) {
  if (!message) {
    return '_No commit message_';
  }
  return message.match(/[^\n]+/)[0];
}

function getStats(stats) {
  if (!stats) return {};

  var _stats$match = stats.match(MATCH_STATS),
      _stats$match2 = _slicedToArray(_stats$match, 4),
      files = _stats$match2[1],
      insertions = _stats$match2[2],
      deletions = _stats$match2[3];

  return {
    files: parseInt(files || 0),
    insertions: parseInt(insertions || 0),
    deletions: parseInt(deletions || 0)
  };
}

function getFixes(message, author, remote) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var pattern = getFixPattern(options);
  var fixes = [];
  var match = pattern.exec(message);
  if (!match) return null;
  while (match) {
    var id = getFixID(match);
    var href = getIssueLink(match, id, remote, options.issueUrl);
    fixes.push({ id: id, href: href, author: author });
    match = pattern.exec(message);
  }
  return fixes;
}

function getFixID(match) {
  // Get the last non-falsey value in the match array
  for (var i = match.length; i >= 0; i--) {
    if (match[i]) {
      return match[i];
    }
  }
}

function getFixPattern(options) {
  if (options.issuePattern) {
    return new RegExp(options.issuePattern, 'g');
  }
  return DEFAULT_FIX_PATTERN;
}

function getMerge(message, author, remote) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = MERGE_PATTERNS[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var pattern = _step2.value;

      var match = message.match(pattern);
      if (match) {
        var id = /^\d+$/.test(match[1]) ? match[1] : match[2];
        var _message = /^\d+$/.test(match[1]) ? match[2] : match[1];
        return {
          id: id,
          message: (0, _utils.replaceText)(_message, options),
          href: getMergeLink(id, remote),
          author: author
        };
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return null;
}

function getCommitLink(hash, remote) {
  if (!remote) {
    return null;
  }
  if (/bitbucket/.test(remote.hostname)) {
    return remote.url + '/commits/' + hash;
  }
  return remote.url + '/commit/' + hash;
}

function getIssueLink(match, id, remote, issueUrl) {
  if (!remote) {
    return null;
  }
  if ((0, _utils.isLink)(match[2])) {
    return match[2];
  }
  if (issueUrl) {
    return issueUrl.replace('{id}', id);
  }
  if (/dev.azure/.test(remote.hostname) || /visualstudio/.test(remote.hostname)) {
    return remote.project + '/_workitems/edit/' + id;
  }
  return remote.url + '/issues/' + id;
}

function getMergeLink(id, remote) {
  if (!remote) {
    return null;
  }
  if (/bitbucket/.test(remote.hostname)) {
    return remote.url + '/pull-requests/' + id;
  }
  if (/gitlab/.test(remote.hostname)) {
    return remote.url + '/merge_requests/' + id;
  }
  if (/dev.azure/.test(remote.hostname) || /visualstudio/.test(remote.hostname)) {
    return remote.url + '/pullrequest/' + id;
  }
  return remote.url + '/pull/' + id;
}