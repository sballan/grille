'use strict';
var Promise = require('bluebird');

// These functions all return req
const getAll = function(g) {
  const self = !!g ? g : this;
  let config = { repo:null, user:null};
  return self.Core.githubGet(self, config, self.client.repos.getAll)
    .then(self.Parse.repos)
    .then(function(allRepos) {
      self.repos = allRepos;
      return self;
    })

};

const getOne = function(g, id) {
  const self = !!g ? g : this;
  id = id || self.req.params.repoId;
  const repo = self.repo || self.Core.dbFindOne('Repo', {_id: id});

  return Promise.resolve(repo)
    .then(function(repo) {
      if(!repo) return Promise.reject("Repo wasn't in database")
      self.repo = repo;

      if(self.getFull) return getOneFull(self);
      return self
    })
};

const getOneFull = function(g) {
  const self = !!g ? g : this;
  console.log("----GetOneFull")

  return self.Issues.getAll(self)
  .then(function() {
    console.log("----GotIssues")
    return self.Comments.getAllForIssues(self, self.repo)
  })
  .then(function() {
    console.log("---GotComments")
  })
  .then(self.Collabs.getAll)

};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
});
