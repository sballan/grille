var User = require('mongoose').model('User')
function parse(body) {
	if(!body) return null
	var collaborator = {}

	collaborator.username= body.login

	collaborator.githubId = "" + body.id
	collaborator.avatar_url = body.avatar_url
	collaborator.url = body.url
	collaborator.html_url = body.html_url
  collaborator.site_admin = body.site_admin

	collaborator.organizations_url = body.organizations_url
  collaborator.repos_url = body.repos_url

  return collaborator
}

module.exports = parse
