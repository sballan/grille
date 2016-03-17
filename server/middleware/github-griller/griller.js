let repos = require('./griller.repos.js');
let issues = require('./griller.issues.js');
let comments = require('./griller.comments.js');
let collabs = require('./griller.collabs.js');
let parse = require('./griller.parse.js');
let utils = require('./griller.utils.js');

var GithubGriller = function(req) {
  if(!req) throw Error("Can't make new GithubGriller with out a request object");

  this.req = req;
  this.client = req.user.githubAccess;
  this.repo = undefined;
  this.repos = undefined;
  this.issue = undefined;
  this.issues = undefined;
};

// These functions all return a modified req for now.  Maybe part of the parsing process should be making them into objects that can be persisted easily with a single call to a .create() function.
GithubGriller.prototype = {
  // Returns Promise
  getAllRepos: function() {
    return repos.getAll(this.req, {utils})
    .then(function(request) {
      return request.repos
    })
  },
  getOneRepo: function(githubId) {
    githubId = githubId || this.req.params.boardID;
    return repos.getOne(this.req, githubId, {issues, comments, collabs, utils})
    .then(function(request) {
      console.log('This is the request', request)
      //there is a lot more data here than just the repo = the repo currently isn't populated with it's issues and comments. A function in the utils is needed to link all this together.
      return request.repo
    })
  },
  getAllIssues: function(repo) {
    return issues.getAll(this.req, repo, {utils})
  },
  getAllComments: function(repo) {
    return issues.getAll(this.req, repo, {utils})
  }
};

// Make these methods available for use outside
GithubGriller.prototype.Parse = parse;
GithubGriller.prototype.Util = utils;

module.exports = function(req) {
  return new GithubGriller(req)
};
