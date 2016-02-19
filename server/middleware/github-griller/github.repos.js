'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');

// A generic function for getting the remaining pages of a github request

// Can return promise
exports.getAll = function(req, dep) {
  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(this.client.repos.getAll);
  this.config = { per_page: 100, page: 0, sort: 'updated' };
  this.getRemainingPages = dep.utils.getRemainingPages.bind(this);

  return this.githubFunc(this.config)
  .then(this.getRemainingPages)
  .then(function(allRepos) {
    req.repos = allRepos
    //console.log("final step:", req.repos)
    return parser.parse(req).repos;
  })
};

exports.getOne = function(req, repo, dep) {
  this.client = req.user.githubAccess;

  return dep.issues.getAll(req, repo, dep)
  .then(function(issues) {
    console.log('-----all issues', issues)
    // may be unneeded
    req.issues = issues

    return dep.comments.getAll(req, repo, dep)
  })
  .then(function(comments) {
    console.log('-----all comments', comments)
  })

};

