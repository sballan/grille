Promise = require('bluebird');
const  _ = require('lodash')
const GithubGriller = function(req, res=null, next=null) {
  if(!req) throw Error("Can't make new GithubGriller with out a request object");

  this.req = req;
  this.res = res;
  this.next = next;
  this.client = req.user.githubAccess;

  this.repos = require('./griller.repos.js')(this);
  this.issues = require('./griller.issues.js')(this);
  this.comments = require('./griller.comments.js')(this);
  this.collabs = require('./griller.collabs.js')(this);
  this.parse = require('./griller.parse.js');
  this.utils = require('./griller.utils.js');

};

// These functions all return a modified g object.  Maybe part of the parsing process should be making them into objects that can be persisted easily with a single call to a .create() function.
GithubGriller.prototype = {
  // Returns Promise
  attach: function(schema, id, populate=null) {
    const self = this;
    return self.utils.dbFindOne(schema, {_id: id}, populate)
      .then(function(dbModel) {
        if(!dbModel) return Promise.reject("Model not found");
        self.req[_.lowerFirst(schema)] = dbModel;
        return self;
      })
  },
  getAllRepos: function() {
    return this.repos.getAll()
    .then(function(g) {
      return g.repos
    })
  },
  getOneRepo: function(id) {
    var repoId = !!this.repo ? this.repo._id : null
    id = id || repoId || this.req.params.repoId;
    const self = this;

    return Promise.resolve({})
      .then(function() {
        if(!self.fullView) {
          return self.repos.getOne(self, id)
        }
        else return self.repos.getOneFullView(self, id)
      })
      .then(function(g) {
        console.log("REPO", g.repo)
        return g.repo
      })
  },
  getAllIssues: function(repo) {
    return this.issues.getAll()
  },
  getAllComments: function(repo) {
    return this.issues.getAll()
  }
};

module.exports = GithubGriller
