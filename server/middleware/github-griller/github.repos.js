'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');
var getAllIssues = require('./github.issues.js')


// A generic function for getting the remaining pages of a github request
var getRemainingPages = require('./github.utils').getRemainingPages

// Can return promise
exports.getAll = function(req) {
  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(this.client.repos.getAll);
  this.config = { per_page: 100, page: 0, sort: 'updated' };

  this.getRemainingPages = getRemainingPages.bind(this);

  return this.githubFunc(this.config)
  .then(this.getRemainingPages)
  .then(function(allRepos) {
    req.repos = allRepos
    return parser(req).repos;
  })
};

exports.getOne = function(req, issue) {
  return getAllIssues(req, res, next)
  .then(function(issues) {

  })
};

