'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(g, repo=this.repo) {
  const self = !!g ? g : this;
  self.repo = repo;
  // repo = self.repo = repo || self.repo;

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
      g.issues = allIssues;
      console.log(`${g.issues.length} Issues attached.`);
      return self.Core.dbSave(g.repo, 'issues')
    })
    .then(()=>{
      return self
    })

};

const getOne = function(repo, issue) {
  const self = !!g ? g : this;
  self.repo = repo || self.repo;
  self.issue = issue || self.issue;

  let config= {
    number: issue.issueNumber,
    state: "all"
  };

  return self.Core.githubGet(self, config, self.client.issues.repoIssue)
    .then(self.Parse.issues)
    .then(function(issue) {
      if(issue.hasComments) {
        return self.Comments.getAllForIssue(self)
      }
      return issue
    })
    .then(function(issue) {
      self.repo.issues.push(issue);
      return self.Core.dbSave(repo, 'issues')
    })
    .then(()=>self)
};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
});
