'use strict';
var Promise = require('bluebird');

// These functions all return req
const getAll = function(g) {
  const self = !!g ? g : this;
  const context = {
    client: self.client,
    githubFunc: Promise.promisify(self.client.repos.getAll),
    config: { per_page: 100, page: 1, sort: 'updated' }
  };
  const getRemainingPages = self.utils.getRemainingPages.bind(context);

  return Promise.resolve(context.githubFunc(context.config))
  .then(getRemainingPages)
  .then(self.parse.repos)
  .then(function(allRepos) {
    self.req.repos = allRepos;
    self.repos = allRepos;
    console.log("allRepos", allRepos[0].owner)
    return self;
  })

};

const getOne = function(g, githubId) {
  const self = !!g ? g : this;
  githubId = githubId || self.req.params.repo
  console.log("made it to get One")

  return Promise.resolve(self.utils.dbFindOne('Repo', {githubId: githubId}))
  .then(function(repo) {
    self.req.repo = repo;
    self.repo = repo;
    return self
  })
  .then(self.issues.getAll)
  .then(self.comments.getAll)
  .then(self.collabs.getAll)
  .then(self.utils.dbAssembleRepo)

};

module.exports = (context=this)=> ({
    getAll: getAll.bind(context),
    getOne: getOne.bind(context)
})
