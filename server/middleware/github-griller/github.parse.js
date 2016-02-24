var Utils = require('./github.utils');
var Promise = require('bluebird');

function repo(body) {
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

function repos(body) {
  return Promise.map(body, function(item) {
    return repo(item)
  });
}

function issue(body) {
  if(!body) return null;
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

  issue.user = {
    login: body.user.login,
    githubId: body.user.id,
    url: body.user.url
  };

  issue.assignee = {
    login: body.assignee.login,
    githubId: body.assignee.id,
    url: body.assignee.url
  };

  if (body.pull_request) issue.isPullRequest = true;

  return Utils.dbParse('User', issue.user)
  .then(function(dbUser) {
    // refactor the dbParse function to do this next step
    issue.user = dbUser;
    return Utils.dbParse('User', issue.assignee)
  })
  .then(function(dbUser) {
    issue.assignee = dbUser;
    return Utils.dbParse('Issue', issue)
  })
}

function issues(body) {
  return Promise.map(body, function(item) {
    return issue(item)
  });
}

// This function may need to do some clever work to figure out which issue a comment belongs to.
function comment(body) {
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

function comments(body) {
  return Promise.map(body, function(item) {
    return comment(item)
  });
}

function collab(body) {
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

function collabs(body) {
  return Promise.map(body, function(item) {
    return collab(item)
  });
}

function parse(req) {
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
