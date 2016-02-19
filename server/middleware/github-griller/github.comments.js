'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');

exports.getAllComments = function(req) {
  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(github.issues.getComments);
  this.config = {
    user: repo.owner.username,
    repo: repo.name,
    number: 0,
    per_page: 100
  };

  this.getRemainingPages = dep.utils.getRemainingPages.bind(this);

  return this.githubFunc(this.config)
      .then(this.getRemainingPages)
      .then(function(allComments) {
        req.comments = allComments;
        return parser(req).comments;
      })
};
