var Issue = require('mongoose').model('Issue');
var Promise = require('bluebird')
var payloadParser = require('../../parsers')

//Takes one issue, gets comments for it and upserts them to the issue.
var getComments = function(issue, repo, github) {
  var getCommentsAsync =  Promise.promisify(github.issues.getComments)

  return getCommentsAsync({user: repo.owner.username, repo: repo.name, number: issue.issueNumber, per_page: 100})
  .then(function(comments) {
    //Ensures that the comment is a valid comment
    comments = comments.map(function(comment) {
      comment = payloadParser.comment(comment)
      if(comment) return comment
    })
    return Issue.findOneAndUpdate({githubId: issue.githubId}, {comments: comments}, {new: true, upsert: true})
    .populate('comments lane sprint')
  })
}

module.exports = {
  getComments: getComments

}
