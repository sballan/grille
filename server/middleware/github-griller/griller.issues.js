'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo=g.repo) {
  const context = {
    client: g.client,
    githubFunc: Promise.promisify(g.client.issues.repoIssues),
    config: {
      user: repo.owner.username,
      repo: repo.name,
      per_page: 100,
      page: 1,
      sort: 'updated',
      state: "all"
    }
  };
  const getRemainingPages = g.utils.getRemainingPages.bind(context);

  return context.githubFunc(context.config)
    .then(getRemainingPages)
    .then(function(rawIssues) {
      console.log('rawIssues')
      return g.parse.issues(rawIssues)
    })
    .then(function(allIssues) {
      console.log('allIssues')
      g.req.issues = allIssues;
      g.issues = allIssues;
      return g;
    })

};

const getOne = function(req, issue) {

};

module.exports = {
  getAll,
  getOne
}
