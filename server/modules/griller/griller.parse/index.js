module.exports = (context=this)=> ({
  collab: require('./parse.collab.js').collab.bind(context),
  collabs: require('./parse.collab.js').collabs.bind(context),
  comment: require('./parse.comment.js').comment.bind(context),
  comments: require('./parse.comment.js').comments.bind(context),
  issue: require('./parse.issue.js').issue.bind(context),
  issues: require('./parse.issue.js').issues.bind(context),
  repo: require('./parse.repo.js').repo.bind(context),
  repos: require('./parse.repo.js').repos.bind(context)
});
