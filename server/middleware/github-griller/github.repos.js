'use strict';
var Promise = require('bluebird');
var parser = require('./github.parse');
var Board = require('mongoose').model('Board');

// These functions all return req
exports.getAll = function(req, dep) {
  this.client = req.user.githubAccess;
  this.githubFunc = Promise.promisify(this.client.repos.getAll);
  this.config = { per_page: 100, page: 0, sort: 'updated' };
  this.getRemainingPages = dep.utils.getRemainingPages.bind(this);

  return this.githubFunc(this.config)
  .then(this.getRemainingPages)
  .then(function(allRepos) {
    req.repos = parser.repos(allRepos);
    return req;

    //console.log("final step:", req.repos)
    //return Board.create(req.repos)
  })
};

exports.getOne = function(req, githubId, dep) {
  console.log('got to internal githubgriller')
  this.client = req.user.githubAccess;

  return dep.utils.dbFindOne('Board', {githubId: githubId})
  .then(function(repo) {
    req.repo = repo;
    console.log('mm------repo is', repo.name);
    //req.repo = parser(repo).repo
    return dep.issues.getAll(req, repo, dep)
  })
  .then(function(issues) {
    console.log('mm-----all issues, length:', issues.length);
    // may be unneeded
    req.issues = issues;

    return dep.comments.getAll(req, req.repo, dep)
  })
  .then(function(comments) {
    console.log('mm-----all comments, length:', comments.length);
    // may be unneeded
    req.comments = comments;

    return dep.collabs.getAll(req, req.repo, dep)
  })
  .then(function(collabs) {
    req.collabs = collabs;
    console.log('-----all collabs', collabs.length)
    return parser(req)
  })

};

