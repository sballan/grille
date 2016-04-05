'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo) {
  const self = !!g ? g : this;
  self.repo = self.repo || repo;

  let config = { direction:'desc' };

  return self.Core.githubGet(self, config, self.client.issues.repoComments)
    .then(function(rawComments) {
      return self.Parse.comments(rawComments, self.repo)
    })
    .then(function(allComments) {
      self.comments = allComments;

      return self;
    })
};

const getAllForIssue = function(g, repo, issue) {
  const self = !!g ? g : this;
  self.repo = repo || self.repo;
  self.issue = issue || self.issue;
  console.log("------Issue is: ", self.issue)
  let config = {
    number: issue.issueNumber,
    direction:'desc'
  };

  return self.Core.githubGet(self, config, self.client.issues.getComments)
    .then(function(rawComments) {
      return self.Parse.comments(rawComments, self.repo, self.issue)
    })
    .then(function(issueComments) {
      self.issueComments = self.issueComments || [];
      self.issueComments.push(...issueComments);
      self.issue.comments = issueComments;
      return self.issue.save()
    })
    .then(()=> self)
};

const getAllForIssues = function(g, repo) {
  const self = !!g ? g : this;
  self.repo = self.repo || repo;

  return Promise.map(self.repo.issues, (issue)=> {
    return getAllForIssue(self, self.repo, issue)
  })
  .then(()=>self);
};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getAllForIssue: getAllForIssue.bind(context),
  getAllForIssues: getAllForIssues.bind(context)
});
