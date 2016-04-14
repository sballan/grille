const Promise = require('bluebird');
const Core = require('../griller.core.js');

const _repo = function(body) {
  if(!body) return Promise.reject('Missing body argument for parse.repo');

  let repo = {
    githubId: body.id,
    name: body.name,
    description: body.description,
    url: body.url,
    collaborators_url: body.collaborators_url,
    owner: {
      username: body.owner.login,
      githubId: body.owner.id,
      url: body.owner.url
    }
  };

  return Core.dbParse('User', repo.owner)
    .then(dbUser=> {
      repo.owner = dbUser;
      return Core.dbParse('Repo', repo, 'owner issues collabs')
    });
    // .then(dbRepo =>{
    //   return dbRepo
    // })

};

const _repos = function(body) {
  if(!body) return Promise.reject('Missing body argument for parse.repos');

  return Promise.map(body, function(item) {
      return _repo(item)
    })
};

module.exports = {
  repo: _repo,
  repos: _repos
};
