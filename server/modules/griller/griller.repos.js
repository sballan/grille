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
  const getRemainingPages = self.Core.getRemainingPages.bind(context);

  return Promise.resolve(context.githubFunc(context.config))
  .then(getRemainingPages)
  .then(self.Parse.repos)
  .then(function(allRepos) {
    self.repos = allRepos;
    return self;
  })

};

const getOne = function(g, id) {
  const self = !!g ? g : this;
  id = id || self.req.params.repoId;
  console.log("made it to get One", id);

  return Promise.resolve(self.Core.dbFindOne('Repo', {_id: id}, 'owner issues'))
      .then(function(repo) {
        console.log("repo Name");
        self.repo = repo;
        return self
      })
};

const getOneFullView = function(g, id) {
  const self = !!g ? g : this;
  id = id || self.req.params.repoId;
  console.log("made it to get One", id);

  return self.Core.dbFindOne('Repo', {_id: id}, 'owner issues collabs')
  .then(function(repo) {
    self.repo = repo;
    return self
  })
  .then(self.Issues.getAll)
  .then(self.Comments.getAll)
  .then(self.Collabs.getAll)

};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context),
  getOneFullView: getOneFullView.bind(context)
});
