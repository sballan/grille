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
  this.Parse = require('./griller.parse');
  this.Core = require('./griller.core.js');

};

// These functions all return a modified g object.
GithubGriller.prototype = {
  // Returns Promise
  attach: function(schema, id, populate='') {
    const self = this;
    return self.Core.dbFindOne(schema, {_id: id}, populate)
      .then(function(dbModel) {
        if(!dbModel) return Promise.reject("Model not found");
        self.req[`the${schema}`] = dbModel;
        return self;
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

    return Promise.resolve({})
      .then(function() {
        if(!self.fullView) {
          return self.Repos.getOne(self, id)
        }
        else return self.Repos.getOneFullView(self, id)
      })
      .then(function(g) {
        console.log("REPO", g.repo);
        return g.repo.getAllLabels()
      })
      .then(function(labels) {
        console.log("LABELS", labels);
        return self.repo
      })
  },
  getAllIssues: function(repo) {
    return this.Issues.getAll()
  },
  getAllComments: function(repo) {
    return this.Issues.getAll()
  }
};

module.exports = GithubGriller;
