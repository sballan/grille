'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');

// Can return promise
exports.getAll = function(req, repo, dep) {
  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(github.issues.repoIssues)
  this.config = {
    user: repo.owner.username,
    repo: repo.name,
    per_page: 100,
    page: 0,
    sort: 'updated',
    state: "all"
  };

  this.getRemainingPages = dep.utils.getRemainingPages.bind(this);

  return this.githubFunc(this.config)
      .then(this.getRemainingPages)
      .then(function(allIssues) {
        req.issues = allIssues;
        return parser(req).issues;
      })
};

exports.getOne = function(req, issue) {

};
