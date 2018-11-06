'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.parseReleases = parseReleases;
exports.sortReleases = sortReleases;

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MERGE_COMMIT_PATTERN = /^Merge (remote-tracking )?branch '.+'/;

function parseReleases(commits, remote, latestVersion, options) {
  var release = newRelease(latestVersion);
  var releases = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = commits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var commit = _step.value;

      if (commit.tag) {
        if (release.tag || options.unreleased) {
          releases.push(_extends({}, release, {
            href: getCompareLink('' + options.tagPrefix + commit.tag, release.tag ? '' + options.tagPrefix + release.tag : 'HEAD', remote),
            commits: release.commits.sort(sortCommits),
            major: commit.tag && release.tag && _semver2.default.diff(commit.tag, release.tag) === 'major'
          }));
        }
        release = newRelease(commit.tag, commit.date);
      }
      if (commit.merge) {
        release.merges.push(commit.merge);
      } else if (commit.fixes) {
        release.fixes.push({
          fixes: commit.fixes,
          commit: commit
        });
      } else if (filterCommit(commit, release, options.commitLimit)) {
        release.commits.push(commit);
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

  releases.push(release);
  return releases;
}

function sortReleases(a, b) {
  if (a.tag && b.tag) return _semver2.default.rcompare(a.tag, b.tag);
  if (a.tag) return 1;
  if (b.tag) return -1;
  return 0;
}

function newRelease() {
  var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().toISOString();

  var release = {
    commits: [],
    fixes: [],
    merges: [],
    tag: tag,
    date: date,
    title: tag || 'Unreleased',
    niceDate: (0, _utils.niceDate)(date),
    isoDate: date.slice(0, 10)
  };
  return release;
}

function filterCommit(commit, release, limit) {
  if (commit.breaking) {
    return true;
  }
  if (_semver2.default.valid(commit.subject)) {
    // Filter out version commits
    return false;
  }
  if (MERGE_COMMIT_PATTERN.test(commit.subject)) {
    // Filter out merge commits
    return false;
  }
  if (release.merges.findIndex(function (m) {
    return m.message === commit.subject;
  }) !== -1) {
    // Filter out commits with the same message as an existing merge
    return false;
  }
  if (limit === false) {
    return true;
  }
  return release.commits.length < limit;
}

function getCompareLink(from, to, remote) {
  if (!remote) {
    return null;
  }
  if (/bitbucket/.test(remote.hostname)) {
    return remote.url + '/compare/' + to + '..' + from;
  }
  if (/dev.azure/.test(remote.hostname) || /visualstudio/.test(remote.hostname)) {
    // Azure prefixes branches with 'GB' and tags with 'GT', this is not the best way to handle it, but its something
    // If string starts with 'v' or number, then is a Tag, else, is a branch
    to = to.substring(0, 1) === 'v' || Number(to) ? 'GT' + to : 'GB' + to;
    from = from.substring(0, 1) === 'v' ? 'GT' + from : 'GB' + from;

    return remote.url + '/branches?baseVersion=' + to + '&targetVersion=' + from + '&_a=commits';
  }
  return remote.url + '/compare/' + from + '...' + to;
}

function sortCommits(a, b) {
  if (!a.breaking && b.breaking) return -1;
  if (a.breaking && !b.breaking) return 1;
  return b.insertions + b.deletions - (a.insertions + a.deletions);
}