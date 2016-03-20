const GithubGriller = function(req, res, next) {
  if(!req) throw Error("Can't make new GithubGriller with out a request object");

  this.req = req;
  this.res = res;
  this.next = next;
  this.client = req.user.githubAccess;

  this.repos = require('./griller.repos.js');
  this.issues = require('./griller.issues.js');
  this.comments = require('./griller.comments.js');
  this.collabs = require('./griller.collabs.js');
  this.parse = require('./griller.parse.js');
  this.utils = require('./griller.utils.js');

};

// These functions all return a modified g object.  Maybe part of the parsing process should be making them into objects that can be persisted easily with a single call to a .create() function.
GithubGriller.prototype = {
  // Returns Promise
  getAllRepos: function() {
    const self = this;
    return self.repos.getAll(this)
    .then(function(g) {
      return g.repos
    })
    .catch(self.next)
  },
  getOneRepo: function(githubId) {
    githubId = githubId || this.req.params.repo;
    return this.repos.getOne(this, githubId)
    .then(function(g) {
      return g.repo
    })
  },
  getAllIssues: function(repo) {
    return this.issues.getAll(this)
  },
  getAllComments: function(repo) {
    return this.issues.getAll(this)
  }
};

module.exports = function(req, res=undefined, next=undefined) {
  return new GithubGriller(req, res, next)
};
