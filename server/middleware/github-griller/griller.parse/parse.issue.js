const Utils = require('../griller.utils.js');
const Promise = require('bluebird');

const issue = function(body, repo) {
  if (!body) return null;
  var issue = {};
  if(repo) issue.repo = repo;

  issue.githubId = 0 + body.id;
  issue.issueNumber = 0 + body.number;
  issue.title = body.title;
  issue.body = body.body;
  issue.state = body.state;
  issue.milestone = body.milestone;
  issue.created_at = body.created_at;
  issue.updated_at = body.updated_at;
  issue.closed_at = body.closed_at;
  issue.due_on = body.due_on;
  issue.url = body.url;
  issue.labels_url = body.labels_url;
  issue.events_url = body.events_url;
  issue.html_url = body.html_url;

  issue.labels = body.labels;
  issue.user = {
    login: body.user.login,
    githubId: body.user.id,
    url: body.user.url
  };
  if (body.assignee) {
    issue.assignee = {
      login: body.assignee.login,
      githubId: body.assignee.id,
      url: body.assignee.url
    };
  }

  issue.hasComments = body.comments !== '0';

  if (body.pull_request) issue.isPullRequest = true;

  return Utils.dbParse('User', issue.user)
    .then(function(dbUser) {
      issue.user = dbUser;

      if(issue.assignee) return Utils.dbParse('User', issue.assignee)
      return Promise.resolve()
    })
    .then(function(dbUser) {
      issue.assignee = dbUser;
      return Utils.dbParse('Label', issue.labels)
    })
    .then(function(dbLabels) {
      issue.labels = dbLabels;
      return Utils.dbParse('Issue', issue, 'comments labels')
    })

};

const issues = function(body, repo=null) {
  console.log("got to parser issues");
  return Promise.map(body, function(item) {
    return issue(item, repo)
  });
};

module.exports = {
  issue,
  issues
};
