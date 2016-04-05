'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo) {
  const self = !!g ? g : this;
  repo = repo || self.repo;
  console.log("This is the repo", repo);

  let config = {
    sort: 'updated',
    state: "all"
  };

  return self.Core.githubGet(self, config, self.client.issues.repoIssues)
    .then(function(rawIssues) {
      return self.Parse.issues(rawIssues, repo)
    })
    .then(function(allIssues) {
      g.repo.issues = allIssues;
      return g.repo.save()
    })
    .then(()=>self)

};

const getOne = function(repo, issue) {
  const self = !!g ? g : this;
  repo = repo || self.repo;
  self.repo = repo;
  issue = issue || self.issue;
  self.issue = issue;

  const context = {
    client: self.client,
    githubFunc: Promise.promisify(self.client.issues.repoIssue),
    config: {
      user: repo.owner.username,
      repo: repo.name,
      number: issue.issueNumber,
      per_page: 100,
      page: 1,
      sort: 'updated',
      state: "all"
    }
  };
  const getRemainingPages = self.Core.getRemainingPages.bind(context);

  return Promise.resolve(context.githubFunc(context.config))
    .then(getRemainingPages)
    .then(self.Parse.issues)
    .then(function(issue) {
      if(issue.hasComments) {
        return self.Comments.getAllForIssue(g, repo, issue)
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
