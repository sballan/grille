'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');

exports.getAll = function(req, repo, dep) {
  console.log("mm-----in the get all comments")
  this.client = req.user.githubAccess;
  console.log('0Little farther down')
  this.githubFunc = Promise.promisify(this.client.issues.repoComments);
  console.log('1Little farther down')
  this.config = {
    user: repo.owner.username,
    repo: repo.name,
    sort: 'updated',
    direction:'desc',
    page: 0,
    per_page: 100
  };
  console.log('2Little farther down')
  this.getRemainingPages = dep.utils.getRemainingPages.bind(this);
  console.log('3Little farther down')
  return this.githubFunc(this.config)
      .then(this.getRemainingPages)
      .then(function(allComments) {
        console.log("mmm-----Got all the comments", allComments.length)
        return req.comment = parser.comments(allComments)
      })
};
