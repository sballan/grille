'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');

// These functions all return req
exports.getAll = function(req, dep) {
  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(this.client.repos.getAll);
  this.config = { per_page: 100, page: 1, sort: 'updated' };
  this.getRemainingPages = dep.utils.getRemainingPages.bind(this);

  return this.githubFunc(this.config)
  .then(this.getRemainingPages)
  .then(function(allRepos) {
    req.repos = parser.repos(allRepos);
    return req;
  })
};

exports.getOne = function(req, githubId, dep) {
  this.client = req.user.githubAccess;

  return dep.utils.dbFindOne('Board', {githubId: githubId})
  .then(function(repo) {
    req.repo = repo;
    return dep.issues.getAll(req, repo, dep)
  })
  .then(function() {
    return dep.comments.getAll(req, req.repo, dep)
  })
  .then(function() {
    return dep.collabs.getAll(req, req.repo, dep)
  })
  .then(function() {
    return req
  })

};

