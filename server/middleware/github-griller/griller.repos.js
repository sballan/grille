'use strict';
var Promise = require('bluebird');
var parser = require('./griller.parse.js');

// These functions all return req
exports.getAll = function(g) {
  let context = {
    client: g.client,
    githubFunc: Promise.promisify(g.client.repos.getAll),
    config: { per_page: 100, page: 1, sort: 'updated' }
  };
  let getRemainingPages = g.utils.getRemainingPages.bind(context);
  //this.client = g.client;
  //this.githubFunc = Promise.promisify(this.client.repos.getAll);
  //this.config = { per_page: 100, page: 1, sort: 'updated' };

  //var getRemainingPages = this.getRemainingPages;
  console.log("--getAll");

  return context.githubFunc(context.config)
  .then(getRemainingPages,
    function(err) {
      console.log('---',err)
    })
  .then(g.parse.repos,
    function(err) {
      console.log('---',err)
    })
  .then(function(allRepos) {
    console.log("--Last .then");
    g.req.repos = allRepos;
    return g.req;
  },
    function(err) {
      console.log('---',err)
    })

};

exports.getOne = function(req, githubId, dep) {
  this.client = req.user.githubAccess;

  return dep.utils.dbFindOne('Repo', {githubId: githubId})
  .then(function(repo) {
    req.repo = repo;
    console.log('----repo')
    return dep.issues.getAll(req, repo, dep)
  })
  .then(function() {
    console.log('----issues')
    return dep.comments.getAll(req, req.repo, dep)
  })
  .then(function() {
    console.log('----comments')
    return dep.collabs.getAll(req, req.repo, dep)
  })
  .then(function() {
    console.log('----collabs')
    return req
  })


};
