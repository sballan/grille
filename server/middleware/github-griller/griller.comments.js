'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo) {
  const self = !!g ? g : this;
  repo = repo || self.repo
  const context = {
    client: self.client,
    githubFunc: Promise.promisify(self.client.issues.repoComments),
    config: {
      user: repo.owner.username,
      repo: repo.name,
      sort: 'updated',
      direction:'desc',
      page: 1,
      per_page: 100
    }
  };
  const getRemainingPages = self.utils.getRemainingPages.bind(context);

  return Promise.resolve(context.githubFunc(context.config))
      .then(getRemainingPages)
      .then(self.parse.comments)
      .then(function(allComments) {
        self.req.comments = allComments
        self.comments = allComments
        return self;
      })
};

module.exports = {getAll}
