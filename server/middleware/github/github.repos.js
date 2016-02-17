'use strict';
var Promise = require('bluebird');

// A generic function for getting the remaining pages of a github request
var getRemainingPages = require('./github.utils').getRemainingPages

// Can return promise
exports.getAllRepos = function(req, res, next) {
  this.client = req.user.githubAccess;
  this.repoFunc = Promise.promisify(this.client.repos.getAll);
  this.config = { per_page: 100, page: 0, sort: 'updated' };

  this.getRemainingPages = getRemainingPages.bind(this);

  return this.repoFunc(this.config)
  .then(this.getRemainingPages)
};

