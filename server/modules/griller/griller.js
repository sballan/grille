const Promise = require('bluebird');
const _ = require('lodash');
const GithubGriller = function(req) {
  if(!req) throw Error("Can't make new GithubGriller with out a request object");

  this.req = req;
  this.client = req.user.githubAccess;

  this.Repos = require('./griller.repos.js')(this);
  this.Issues = require('./griller.issues.js')(this);
  this.Comments = require('./griller.comments.js')(this);
  this.Collabs = require('./griller.collabs.js')(this);
  this.Parse = require('./griller.parse')(this);
  this.Core = require('./griller.core.js');

};

// These functions all return a modified g object.
GithubGriller.prototype = {
  // Returns Promise
  attach: function(schema, query, populate='') {
    const self = this;
    return self.Core.dbFindOne(schema, query, populate)
      .then(function(dbModel) {
        if(!dbModel) return Promise.reject("Model not found");
        self[_.lowerFirst(schema)] = dbModel;
        return dbModel;
      })
  },
  getAllRepos: function() {
    return this.Repos.getAll()
    .then(function(g) {
      return g.repos
    })
  },
  getOneRepo: function(id) {
    var repoId = !!this.repo ? this.repo._id : null;
    id = id || repoId || this.req.params.repoId;
    const self = this;

    return self.Repos.getOne(self, id)
      .then(function(g) {
        if(g.getFull) {
          console.log("POPULATING")
          return self.repo.deepPopulate('owner collabs issues issues.labels issues.comments')
        }
        return self.repo
      })
  },
  getAllIssues: function(repo) {
    return this.Issues.getAll(this, repo)
      .then(g=>g.repo.issues)
  },
  getAllComments: function(repo) {
    return this.Issues.getAll()
  }
};

module.exports = GithubGriller;
