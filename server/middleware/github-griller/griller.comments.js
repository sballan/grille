'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo=g.repo) {
  const context = {
    client: g.client,
    githubFunc: Promise.promisify(g.client.issues.repoComments),
    config: {
      user: repo.owner.username,
      repo: repo.name,
      sort: 'updated',
      direction:'desc',
      page: 1,
      per_page: 100
    }
  };
  const getRemainingPages = g.utils.getRemainingPages.bind(context);

  return context.githubFunc(context.config)
      .then(getRemainingPages)
      .then(g.parse.comments)
      .then(function(allComments) {
        g.req.comments = allComments
        g.comments = allComments
        return g;
      })
};

module.exports = {getAll}
