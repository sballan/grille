const Core = require('../griller.core.js');
const Promise = require('bluebird');

const comment = function(body, repo, issue) {
  if(!body) return null;
  var comment = {};

  if(repo) comment.repo = repo;

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

  return Core.dbParse('User', comment.user)
    .then(function(dbUser) {
      comment.user = dbUser;
      return Core.dbParse('Comment', comment)
    })
    .then(function(dbComment) {
      comment = dbComment;
      if(issue && issue.comments) {
        issue.comments.push(comment);
        return issue.save()
      }
      return comment;
    })
    .then(function(){
      return comment
    })
};

const comments = function(body, repo=null, issue=null) {
  return Promise.map(body, function(item) {
    return comment(item, repo, issue)
  });
};

module.exports = {
  comment,
  comments
};
