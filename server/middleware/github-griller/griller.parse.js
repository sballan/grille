const Utils = require('./griller.utils.js');
var Promise = require('bluebird');


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

    return Utils.dbParse('Repo', repo, 'owner issues collabs')
  })

};
const repos = function(body) {
  return Promise.map(body, function(item) {
    return repo(item)
  })
  .then(function(repos) {
    return repos
  });
};

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
    issue.labels = dbLabels
    return Utils.dbParse('Issue', issue, 'comments labels')
  })

}

const issues = function(body, repo=null) {
  console.log("got to parser issues")
  return Promise.map(body, function(item) {
    return issue(item, repo)
  });
}

// This function may need to do some clever work to figure out which issue a comment belongs to.
const comment = function(body, repo, issue) {
  if(!body) return null;
  var comment = {};

  if(repo) comment.repo = repo

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
  };

  return Utils.dbParse('User', comment.user)
  .then(function(dbUser) {
    comment.user = dbUser;
    return Utils.dbParse('Comment', comment)
  })
  .then(function(dbComment) {
    comment = dbComment
    if(issue && issue.comments) {
      issue.comments.push(comment)
      return issue.save()
    }
    return comment;
  })
  .then(function(){
    return comment
  })
}

const comments = function(body, repo=null, issue=null) {
  return Promise.map(body, function(item) {
    return comment(item, repo, issue)
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
