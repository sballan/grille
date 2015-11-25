var User = require('mongoose').model('User')
var _ = require('lodash')
function parse(body) {
	if(!body) return null
	var user = {}

	user.name = body.name
	user.email = body.email
	user.username = body.username || body.login

	user.githubID = body.id
	user.url = body.url
	user.html_url = body.html_url
	user.organizations_url = body.organizations_url
  user.repos_url = user.repos_url

  return user
}

module.exports = parse