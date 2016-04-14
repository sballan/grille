'use strict';
var Promise = require('bluebird');

// Returns req
const getAll = function(G=this, repo=G.repo) {
  if(!repo) return Promise.reject('No repo argument or on the Griller object');
  G.repo = repo;

  let config = {
    sort: 'updated',
    state: "all"
  };

  return G.Core.githubGet(G, config, G.client.issues.repoIssues)
    .then(rawIssues=> {
      return G.Parse.issues(rawIssues, G.repo)
    })
    .then(allIssues=> {
      G.repo.issues = allIssues;
      G.issues = allIssues;

      console.log(`${G.issues.length} Issues attached.`);
      return G.Core.dbSave(G.repo, 'issues')
    })
    .then(()=>G)

};

const getOne = function(G=this, repo=G.repo, issue=G.issue) {
  if(!repo || !issue) return Promise('No repo or issue as argument or on Griller object');

  // TODO consider making new Griller object here
  G.repo = repo;
  G.issue = issue;

  let config= {
    number: issue.issueNumber,
    state: "all"
  };

  return G.Core.githubGet(G, config, G.client.issues.repoIssue)
    .then(G.Parse.issues)
    .then(dbIssue=> {
      if(dbIssue.hasComments) {
        return G.Comments.getAllForIssue(G)
      }
      return dbIssue
    })
    .then(dbIssue=> {
      G.repo.issues.push(dbIssue);
      return G.Core.dbSave(G.repo, 'issues')
    })
    .then(()=>G)
};

module.exports = (context=this)=> ({
  getAll: getAll.bind(context),
  getOne: getOne.bind(context)
});
