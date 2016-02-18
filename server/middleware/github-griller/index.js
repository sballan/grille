let repos = require('./github.repos');
let issues = require('./github.issues');
let comments = require('./github.comments');
let parse = require('./github.parse');
let utils = require('./github.utils');

let GithubGriller = function(req) {
  this.client = req.user.githubAccess;

};

// Make these methods available for use outside
// TODO will this bind let us use this.client inside the other functions?
GithubGriller.prototype.Repos = repos.bind(GithubGriller);
GithubGriller.prototype.Issues = issues.bind(GithubGriller);
GithubGriller.prototype.Comments = comments.bind(GithubGriller);
GithubGriller.prototype.Parse = parse.bind(GithubGriller);
GithubGriller.prototype.Util = utils.bind(GithubGriller);

module.exports = githubGriller;
