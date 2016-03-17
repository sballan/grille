var GithubGriller = function(req) {
  if(!req) throw Error("Can't make new GithubGriller with out a request object");

  this.req = req;
  this.client = req.user.githubAccess;

  this.repos = require('./griller.repos.js');
  this.issues = require('./griller.issues.js');
  this.comments = require('./griller.comments.js');
  this.collabs = require('./griller.collabs.js');
  this.parse = require('./griller.parse.js');
  this.utils = require('./griller.utils.js');

  console.log("Griller", typeof this.parse)
};

// These functions all return a modified req for now.  Maybe part of the parsing process should be making them into objects that can be persisted easily with a single call to a .create() function.
GithubGriller.prototype = {
  // Returns Promise
  getAllRepos: function() {
    return this.repos.getAll(this)
    .then(function(request) {
      return request.repos
    })
  },
  getOneRepo: function(githubId) {
    githubId = githubId || this.req.params.boardID;
    return this.repos.getOne(this)
    .then(function(request) {
      console.log('This is the request', request);
      //there is a lot more data here than just the repo = the repo currently isn't populated with it's issues and comments. A function in the utils is needed to link all this together.
      return request.repo
    })
  },
  getAllIssues: function(repo) {
    return this.issues.getAll(this)
  },
  getAllComments: function(repo) {
    return this.issues.getAll(this)
  }
};

module.exports = function(req) {
  return new GithubGriller(req)
};
