function parseRepo(body) {
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

module.exports = {
  parseRepo
};
