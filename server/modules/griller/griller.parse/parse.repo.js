const Promise = require('bluebird');
const Core = require('../griller.core.js');

const repo = function(body) {
  if(!body) return null;
  var repo = {};
  repo.githubId = body.id;
  repo.name = body.name;
  repo.description = body.description;

  repo.owner = {
    username: body.owner.login,
    githubId: body.owner.id,
    url: body.owner.url
  };

  repo.url = body.url;
  repo.collaborators_url = body.collaborators_url;

  return Core.dbParse('User', repo.owner)
    .then(function(dbUser) {
      repo.owner = dbUser;

      return Core.dbParse('Repo', repo, 'owner issues collabs')
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

module.exports = {
  repo,
  repos
};
