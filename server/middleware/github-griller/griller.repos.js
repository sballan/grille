'use strict';
var Promise = require('bluebird');

// These functions all return req
const getAll = function(g) {
  const context = {
    client: g.client,
    githubFunc: Promise.promisify(g.client.repos.getAll),
    config: { per_page: 100, page: 1, sort: 'updated' }
  };
  const getRemainingPages = g.utils.getRemainingPages.bind(context);

  return context.githubFunc(context.config)
  .then(getRemainingPages)
  .then(g.parse.repos)
  .then(function(allRepos) {
    g.req.repos = allRepos;
    g.repos = allRepos;
    return g;
  })

};

const getOne = function(g, githubId) {
  return g.utils.dbFindOne('Repo', {githubId: githubId})
  .then(function(repo) {
    // TODO try to get these assignments into dbFindOne, or consider some other way of getting them out of here.
    g.req.repo = repo;
    g.repo = repo;
    return g.issues.getAll(g)
  })
  .then(function() {
    return g.comments.getAll(g)
  })
  .then(function() {
    return g.collabs.getAll(g)
  })
  .then(function() {
    return g.utils.dbAssembleRepo(g)
  })

};

module.exports = {
  getAll,
  getOne
}
