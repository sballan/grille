let repos = require('./github.repos');
let issues = require('./github.issues');
let comments = require('./github.comments');
let parse = require('./github.parse');
let utils = require('./github.utils');

let GithubGriller = function(req) {
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
    return repos.getAll(this.req)
  },
  getOneRepo: function(repo) {
    return repos.getOne(this.req, repo)
  }
};

// Make these methods available for use outside
GithubGriller.prototype.Repos = repos;
GithubGriller.prototype.Issues = issues;
GithubGriller.prototype.Comments = comments;
GithubGriller.prototype.Parse = parse;
GithubGriller.prototype.Util = utils;

module.exports = GithubGriller;
