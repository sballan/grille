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

// These functions all return Promises
GithubGriller.prototype = {
  // Attaches an unpopulated document from the database.  Useful for making further queries.
  attach: function(schema, query, populate='') {
    if(!schema || !query) return Promise.reject("Missing arguments");

    return this.Core.dbFindOne(schema, query, populate)
      .then(dbModel=> {
        if(!dbModel) return Promise.reject("Model not found");
        this[_.lowerFirst(schema)] = dbModel;
        return dbModel;
      })
  },
  clone: function() {
    return new GithubGriller(this.req);
  },
  getAllRepos: function() {
    return this.Repos.getAll()
    .then(function(g) {
      return g.repos
    })
  },
  // Requires either an ID or repo on Griller object.
  getOneRepo: function(id) {
    if(!id && !this.repo._id) return Promise.reject("No ID and no repo on Griller object.");

    id = id || this.repo._id;

    return this.Repos.getOne(this, id)
      .then(g=> {
        if(g.getFull) {
          console.log(`Populating ${g.repo.name}`);
          return g.repo.deepPopulate('owner collabs issues issues.labels issues.comments')
        }
        return g.repo;
      })
  },
  // Requires a repo as an argument or on the Griller object
  getAllIssues: function(repo) {
    if(!repo && !this.repo) return Promise.reject("No repo argument and no repo on Griller object.");

    return this.Issues.getAll(this, repo)
      .then(g=>g.repo.issues)
  },
  getAllComments: function(repo) {
   return Promise.reject("This function hasn't been written yet");
    // return this.Issues.getAll()
  }
};

module.exports = GithubGriller;
