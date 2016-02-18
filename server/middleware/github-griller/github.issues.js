'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');

// A generic function for getting the remaining pages of a github request
var getRemainingPages = require('./github.utils').getRemainingPages

// Can return promise
exports.getAll = function(req) {
  if(req.repos) req.repo = req.repos[0];
  if(!req.repo) console.log("--Error, no repo found on req body")

  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(github.issues.repoIssues)
  this.config = {
    user: req.repo.owner.username,
    repo: req.repo.name,
    per_page: 100,
    page: 0,
    state: "all"
  };

  this.getRemainingPages = getRemainingPages.bind(this);

  return this.githubFunc(this.config)
      .then(this.getRemainingPages)
      .then(function(allIssues) {
        req.issues = allIssues;
        return parser(req).issues;
      })
};

exports.getOne = function(req, issue) {

};
