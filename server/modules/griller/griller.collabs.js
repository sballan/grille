'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo=g.repo) {
  const self = !!g ? g : this;
  self.repo = self.repo || repo;


  return self.Core.githubGet(self, {}, self.client.repos.getCollaborators)
    .then(self.Parse.collabs)
    .then(function(allCollabs) {
      self.repo.collabs = allCollabs
      return self.repo.save();
    })
    .then(()=>self)

};

const getOne = function(req, issue) {

};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
});
