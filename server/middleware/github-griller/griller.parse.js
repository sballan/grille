var Utils = require('./griller.utils.js');
var Promise = require('bluebird');
var User = require('mongoose').model('User')
var Card = require('mongoose').model('Card')

const repo = function(body) {
  if(!body) return null;
  var repo = {};
  repo.githubId = body.id || null;
  repo.name = body.name || null;
  repo.description = body.description || null;
  //Use presave hook to turn this field into a proper User
  repo.owner = {
    username: body.owner.login,
    githubId: body.owner.id,
    url: body.owner.url
  };

  repo.url = body.url || null;
  repo.collaborators_url = body.collaborators_url || null;

  return Utils.dbParse('User', repo.owner)
  .then(function(dbUser) {
    repo.owner = dbUser;

    return Utils.dbParse('Repo', repo)
  })

}

const repos = function(body) {
  return Promise.map(body, function(item) {
    return repo(item)
  });
}

const issue = function(body) {
  if (!body) return null;
  var issue = {};
  issue.githubId = body.id;
  issue.issueNumber = 0 + body.number;
  issue.title = body.title;
  issue.body = body.body;
  issue.state = body.state;
  issue.milestone = body.milestone;
  issue.labels = body.labels;
  issue.created_at = body.created_at;
  issue.updated_at = body.updated_at;
  issue.closed_at = body.closed_at;
  issue.due_on = body.due_on;
  issue.url = body.url;
  issue.labels_url = body.labels_url;
  issue.events_url = body.events_url;
  issue.html_url = body.html_url;
  // FIXME don't make new user object
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
  console.log("after user")

  if (body.pull_request) issue.isPullRequest = true;
  console.log("before dbParse")

  return Utils.dbParse('User', issue.user)
  .then(function(dbUser) {
    console.log("dbUser")
    issue.user = dbUser;

    if(issue.assignee) return Utils.dbParse('User', issue.assignee)
    return Promise.resolve()
  })
  .then(function(dbUser) {
    issue.assignee = dbUser;
    console.log("second dbUser")

    return Utils.dbParse('Card', issue)
  })

}

const issues = function(body) {
  console.log("got to parser issues")
  return Promise.map(body, function(item) {
    return issue(item)
  });
}

// This function may need to do some clever work to figure out which issue a comment belongs to.
const comment = function(body) {
  if(!body) return null;
  var comment = {};
  comment.githubId = body.id;
  comment.body = body.body;
  comment.path = body.path;
  comment.position = body.position;
  comment.line = body.line;
  comment.commit_id = body.commit_id;
  comment.created_at = body.created_at;
  comment.updated_at = body.updated_at;

  comment.user = {
    login: body.user.login,
    githubId: body.user.id,
    url: body.user.url
  }

  return Utils.dbParse('User', comment.user)
  .then(function(dbUser) {
    comment.user = dbUser;
    return Utils.dbParse('Comment', comment)
  })
}

const comments = function(body) {
  return Promise.map(body, function(item) {
    return comment(item)
  });
}

const collab = function(body) {
  if(!body) return null;
  var collab = {};
  collab.username = body.login;

  collab.githubId = "" + body.id;
  collab.avatar_url = body.avatar_url;
  collab.url = body.url;
  collab.html_url = body.html_url;
  // come back to this - may be repo specific
  // collab.site_admin = body.site_admin;
  //collab.organizations_url = body.organizations_url;
  collab.repos_url = body.repos_url;
  return Utils.dbParse('User', collab);
}

const collabs = function(body) {
  return Promise.map(body, function(item) {
    return collab(item)
  });
}

const parse = function(req) {
  if(req.repos) req.repos = repos(req.repos);
  if(req.repo) req.repo = repo(req.repo);
  if(req.issue) req.issue = issue(req.issue);
  if(req.issues) req.issues = issues(req.issues);
  if(req.comment) req.comment = comment(req.comment);
  if(req.comments) req.comments = comments(req.comments);
  if(req.collab) req.collab = collab(req.collab);
  if(req.collabs) req.collabs = collabs(req.collabs);

  return Promise.resolve(req);
}

module.exports = {
  parse,
  repo,
  repos,
  issue,
  issues,
  comment,
  comments,
  collab,
  collabs
};
