'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo) {
  const self = !!g ? g : this;
  self.repo = self.repo || repo;

  let config = {
    sort: 'updated',
    state: "all"
  };

  return self.Core.githubGet(self, config, self.client.issues.repoIssues)
    .then(function(rawIssues) {
      return self.Parse.issues(rawIssues, self.repo)
    })
    .then(function(allIssues) {
      g.repo.issues = allIssues;
      return g.repo.save()
    })
    .then(()=>self)

};

const getOne = function(repo, issue) {
  const self = !!g ? g : this;
  self.repo = self.repo || repo;
  self.issue = self.issue || issue;

  let config= {
    number: issue.issueNumber,
    state: "all"
  };

  return self.Core.githubGet(self, config, self.client.issues.repoIssue)
    .then(self.Parse.issues)
    .then(function(issue) {
      if(issue.hasComments) {
        return self.Comments.getAllForIssue(g)
      }
      return issue
    })
    .then(function(issue) {
      g.repo.issues.push(issue);
      return g.repo.save()
    })
    .then(()=>self)
};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
});
