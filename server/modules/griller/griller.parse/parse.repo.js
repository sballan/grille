const Promise = require('bluebird');
const Core = require('../griller.core.js');

const _repo = function(body) {
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
    .then(dbRepo =>{
      return dbRepo
    })

};

const _repos = function(body) {
  return Promise.map(body, function(item) {
      return _repo(item)
    })
    .then(function(repos) {
      return repos
    })
    .catch((err, err1)=>{console.log(err, err1)})
};

module.exports = {
  repo: _repo,
  repos: _repos
};
