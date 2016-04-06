'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo) {
  const self = !!g ? g : this;
  self.repo = repo || self.repo;

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
  repo = self.repo = repo || self.repo;
  issue = self.issue = issue || self.issue;

  let config = {
    number: issue.issueNumber,
    direction:'desc'
  };

  return self.Core.githubGet(self, config, self.client.issues.getComments)
    .then(function(rawComments) {
      console.log("about to parse")
      return self.Parse.comments(rawComments, self.repo, issue)
    })
    .then(function(issueComments) {
      self.issueComments = self.issueComments || [];
      self.issueComments.push(...issueComments);
      issue.comments = issueComments;
      console.log("about to save")
      return issue.save()
    })
    .then(()=> self)
};

const getAllForIssues = function(g, repo) {
  const self = !!g ? g : this;
  self.repo = repo || self.repo;

  return Promise.map(self.repo.issues, (issue, index)=> {
    console.log("issue number ", index)
    return getAllForIssue(self, self.repo, issue)
  })
  .then(()=>self);
};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getAllForIssue: getAllForIssue.bind(context),
  getAllForIssues: getAllForIssues.bind(context)
});