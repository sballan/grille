var User = require('mongoose').model('User');
var Promise = require('bluebird')
var payloadParser = require('../../parsers')

//Takes one issue, gets comments for it and upserts them to the issue.
var getCollaborators = function(repo, github) {
  var getCollaboratorsAsync = Promise.promisify(github.repos.getCollaborators)

  return getCollaboratorsAsync(
    {
      user: repo.owner.username,
      repo: repo.name,
      per_page: 100
    })
    .then(function(collaborators) {
      collaborators = collaborators.map(function(collaborator) {
        collaborator = payloadParser.collaborator(collaborator)
        if(typeof collaborator.githubId === 'string') return collaborator
      })

      return Promise.map(collaborators, function(collaborator) {
        return User.findOneAndUpdate({githubId: collaborator.githubId}, collaborator, {upsert: true, new: true}).select('-accessToken')
      })
    })
}

module.exports = {
  getCollaborators: getCollaborators

}
