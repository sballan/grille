'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');

// Returns req
exports.getAll = function(req, repo, dep) {
  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(this.client.repos.getCollaborators);
  this.config = {
    user: repo.owner.username,
    repo: repo.name,
    per_page: 100,
    page: 1
  };
  this.getRemainingPages = dep.utils.getRemainingPages.bind(this);

  return this.githubFunc(this.config)
    .then(this.getRemainingPages)
    .then(function(allCollabs) {
          req.collabs = parser.collabs(allCollabs);
          return req;
        })

};

exports.getOne = function(req, issue) {

};
