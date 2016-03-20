'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo=g.repo) {
  const context = {
    client: g.client,
    githubFunc: Promise.promisify(g.client.repos.getCollaborators),
    config: {
      user: repo.owner.username,
      repo: repo.name,
      per_page: 100,
      page: 1
    }
  };
  const getRemainingPages = g.utils.getRemainingPages.bind(context);

  return context.githubFunc(context.config)
    .then(getRemainingPages)
    .then(g.parse.collabs)
    .then(function(allCollabs) {
      g.req.collabs = allCollabs;
      g.collabs = allCollabs;
      return g;
    })

};

const getOne = function(req, issue) {

};

module.exports = {getAll, getOne}
