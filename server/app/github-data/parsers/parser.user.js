var User = require('mongoose').model('User')
var _ = require('lodash')
function parse(body) {
	if(!body) return null
	var user = {}

	user.name = body.name || null
	user.email = body.email || null
	user.username = body.username || null

	user.login = body.login || null
	user.githubID = body.id || null
	user.url = body.url || null
	user.html_url = body.html_url || null
	user.organizations_url = body.organizations_url || null
  user.repos_url = user.repos_url || null

  return User.find({githubID: user.githubID}, function(err, theUser) {
  	if(!theUser) {
  		return User.create(user)
  	} else {
  		// _.extend(theUser, user)
  		return User.findByIdAndUpdate(theUser._id, user, {upsert: true, new: true}, function() {})
  	}
  })


  // .then(function(theUser) {
  // })
}

module.exports = parse