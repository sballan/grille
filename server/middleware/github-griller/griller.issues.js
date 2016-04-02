'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo) {
  const self = !!g ? g : this;
  repo = repo || self.repo;
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
      console.log("raw issues")
      return self.parse.issues(rawIssues, repo)
    })
    .then(function(allIssues) {
      g.repo.issues = allIssues
      return g.repo.save()
    })
    .then(function(repo) {
      return self;
    })

};

const getOne = function(req, issue) {
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
  const getRemainingPages = self.utils.getRemainingPages.bind(context);
  
  return Promise.resolve(context.githubFunc(context.config))
    .then(getRemainingPages)
    .then(self.parse.issues)
    .then(function(issue) {
      if(issue.hasComments) {
        return self.comments.getAllForIssue(g, repo, issue)
      }
      return issue
    })
    .then(function(issue) {
      self.issues = issue;
      g.repo.issues = issue
      return g.repo.save()
    })
    .then(function(repo) {
      return self;
    })
};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
})
