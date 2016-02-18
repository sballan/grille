function repo(body) {
  if(!body) return null;
  var repo = {};
  repo.githubID = body.id || null;
  repo.name = body.name || null;
  repo.description = body.description || null;
  //Use presave hook to turn this field into a proper User
  repo.owner = {
    username: body.owner.login,
    githubID: body.owner.id,
    url: body.owner.url
  };

  repo.url = body.url || null;
  repo.collaborators_url = body.collaborators_url || null;

  return repo;
}

function repos(body) {
  body.forEach(function(item) {
    item = repo(item)
  });
  return body
}

function issue(body) {
  if(!body) return null;
  var issue = {};
  issue.githubID = body.id;
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

  issue.owner = {
    username: body.user.login,
    githubID: body.user.id,
    url: body.user.url
  };

  if (body.assignee) issue.assignee =  body.assignee.login;
  if (body.pull_request) issue.isPullRequest = true;

  return issue;
}

// This function may need to do some clever work to figure out which issue a comment belongs to.
function comment(body) {

}

function parse(req, res, next) {
  // TODO Figure out the actual syntax for the body coming in
  if(req.repos) req.repos = repos(req.repos);
  if(req.repo) req.repo = repo(req.repo);
  if(req.issue) req.issue = issue(req.issue);

  return req;
}

module.exports = {
  parse
};