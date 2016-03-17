'use strict';
var Promise = require('bluebird');
var parser = require('./griller.parse.js');

// Returns req
exports.getAll = function(req, repo, dep) {
  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(this.client.issues.repoComments);
  this.config = {
    user: repo.owner.username,
    repo: repo.name,
    sort: 'updated',
    direction:'desc',
    page: 1,
    per_page: 100
  };
  this.getRemainingPages = dep.utils.getRemainingPages.bind(this);
  return this.githubFunc(this.config)
      .then(this.getRemainingPages)
      .then(parser.comments)
      .then(function(allComments) {
        req.comments = allComments
        return req;
      })
};
