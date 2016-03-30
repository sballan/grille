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
    return self;
  })

};

const getOne = function(g, id) {
  const self = !!g ? g : this;
  id = id || self.req.params.repoId;
  console.log("made it to get One", id);

  return Promise.resolve(self.utils.dbFindOne('Repo', {_id: id}, 'owner'))
  .then(function(repo) {
    console.log("repo Name")
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
