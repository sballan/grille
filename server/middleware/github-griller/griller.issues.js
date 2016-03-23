'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo) {
  const self = !!g ? g : this;
  repo = repo || self.repo
  console.log("This is the repo", repo)
  const context = {
    client: self.client,
    githubFunc: Promise.promisify(self.client.issues.repoIssues),
    config: {
      user: repo.owner.username,
      repo: repo.name,
      per_page: 100,
      page: 1,
      sort: 'updated',
      state: "all"
    }
  };
  const getRemainingPages = self.utils.getRemainingPages.bind(context);

  return Promise.resolve(context.githubFunc(context.config))
    .then(getRemainingPages)
    .then(function(rawIssues) {
      return self.parse.issues(rawIssues)
    })
    .then(function(allIssues) {
      self.req.issues = allIssues;
      self.issues = allIssues;
      return self;
    })

};

const getOne = function(req, issue) {

};

module.exports = {
  getAll,
  getOne
}
