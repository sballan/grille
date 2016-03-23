'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo=g.repo) {
  const self = !!g ? g : this;
  repo = repo || self.repo;
  const context = {
    client: self.client,
    githubFunc: Promise.promisify(self.client.repos.getCollaborators),
    config: {
      user: repo.owner.username,
      repo: repo.name,
      per_page: 100,
      page: 1
    }
  };
  const getRemainingPages = self.utils.getRemainingPages.bind(context);

  return context.githubFunc(context.config)
    .then(getRemainingPages)
    .then(self.parse.collabs)
    .then(function(allCollabs) {
      self.req.collabs = allCollabs;
      self.collabs = allCollabs;
      return self;
    })

};

const getOne = function(req, issue) {

};

module.exports = {getAll, getOne}
