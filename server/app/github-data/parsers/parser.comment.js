var user = require('./parser.user')

//OP: can you just do comment = body? or use some lodash method
//any different ones you can override separately
function parse(body) {
	if(!body) return null
	var comment = {}

	comment.url = body.url
	comment.html_url = body.html_url
	comment.issue_url = body.issue_url

	comment.githubId = body.id
	comment.body = body.body

	comment.user = {
		username: body.user.login,
		githubId: body.user.id,
		url: body.user.url
	}
	comment.created_at = body.created_at
	comment.updated_at = body.updated_at

	return comment;
}

module.exports = parse
