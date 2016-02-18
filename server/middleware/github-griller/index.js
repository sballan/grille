let repos = require('./github.repos');
let issues = require('./github.issues');
let comments = require('./github.comments');
let parse = require('./github.parse');
let utils = require('./github.utils');

let GithubGriller = function(req) {
  if(!req) throw Error("Can't make new GithubGriller with out a request object");

  this.req = req;
  this.client = req.user.githubAccess;
  this.repo = undefined;
  this.repos = undefined;
  this.issue = undefined;
  this.issues = undefined;
};

GithubGriller.prototype = {
  // Returns Promise
  getAllRepos: function() {
    return repos.getAll(this.req, {utils})
  },
  getOneRepo: function(repo) {
    return repos.getOne(this.req, repo, {issues, comments, utils})
  },
  getAllIssues: function(repo) {
    return issues.getAll(this.req, repo, {utils})
  }
};

// Make these methods available for use outside
GithubGriller.prototype.Parse = parse;
GithubGriller.prototype.Util = utils;

module.exports = GithubGriller;
