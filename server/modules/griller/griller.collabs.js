'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo) {
  const self = !!g ? g : this;
  self.repo = repo || self.repo;


  return self.Core.githubGet(self, {}, self.client.repos.getCollaborators)
    .then(self.Parse.collabs)
    .then(function(allCollabs) {
      self.repo.collabs = allCollabs;
      return self.Core.dbSave(self.repo, 'owner issues issues.comments collabs');
    })
    .then(()=>self)

};

const getOne = function(req, issue) {

};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
});
