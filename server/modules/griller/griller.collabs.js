'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(G=this, repo=G.repo) {
  if(!repo) return Promise.reject('No repo argument or on the Griller object');
  G.repo = repo;

  return G.Core.githubGet(G, {}, G.client.repos.getCollaborators)
    .then(G.Parse.collabs)
    .then(allCollabs=> {
      G.repo.collabs = allCollabs;
      return G.Core.dbSave(G.repo, 'owner issues issues.comments collabs');
    })
    .then(()=>G)

};

const getOne = function(req, issue) {

};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
});
