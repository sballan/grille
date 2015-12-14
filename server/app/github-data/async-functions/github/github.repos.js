var Label = require('mongoose').model('Label');
var Card = require('mongoose').model('Card');
var Board = require('mongoose').model('Board');
var Promise = require('bluebird')


//Returns a promise for an array of Labels have been taken from GitHub and pushed through our database.
var getIssueLabels = function(issue, repo, github) {
  var getIssueLabelsAsync = Promise.promisify(github.issues.getIssueLabels)

  return getIssueLabelsAsync({
    user: repo.owner.username,
    repo: repo.name,
    number: issue.number,
  })
  .then(function(labels) {
    return Promise.map(labels, function(label) {
      return Label.findOneAndUpdate({board: repo._id, name: label.name}, label, {new: true, upsert: true})
    })
  })



}

module.exports = {
  getIssueLabels: getIssueLabels,

}
