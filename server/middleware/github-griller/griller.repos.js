'use strict';
var Promise = require('bluebird');
var parser = require('./griller.parse.js');

// These functions all return req
const getAll = function(g) {
  let context = {
    client: g.client,
    githubFunc: Promise.promisify(g.client.repos.getAll),
    config: { per_page: 100, page: 1, sort: 'updated' }
  };
  let getRemainingPages = g.utils.getRemainingPages.bind(context);

  return context.githubFunc(context.config)
  .then(getRemainingPages)
  .then(g.parse.repos)
  .then(function(allRepos) {
    g.req.repos = allRepos;
    return g.req;
  })

};

const getOne = function(g, githubId) {
  this.client = g.client;

  return g.utils.dbFindOne('Repo', {githubId: githubId})
  .then(function(repo) {
    g.req.repo = repo;
    console.log('----repo')
    return g.issues.getAll(req, repo, g)
  })
  .then(function() {
    console.log('----issues')
    return g.comments.getAll(req, req.repo, g)
  })
  .then(function() {
    console.log('----comments')
    return g.collabs.getAll(req, req.repo, g)
  })
  .then(function() {
    console.log('----collabs')
    return g.req
  })

};

module.exports = {
  getAll,
  getOne
}
