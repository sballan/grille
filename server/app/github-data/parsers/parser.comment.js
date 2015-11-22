var user = require('./parser.user')

function parse(body) {
	if(!body) return null
	var comment = {}

	comment.url = body.url || null
	comment.html_url = body.html_url || null
	comment.issue_url = body.issue_url || null

	comment.githubID = body.id || null
	comment.body = body.body || null

	comment.user = user(body.user) || null
	comment.created_at = body.created_at || null
	comment.updated_at = body.updated_at || null
	console.log("-----------comment.parser", comment)
	return comment;
}

module.exports = parse