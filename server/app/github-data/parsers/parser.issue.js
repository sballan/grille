var user = require('./parser.user')

function parse(body) {
	if(!body) return null
	var issue = {}

	issue.url = body.url || null
	issue.labels_url = body.labels_url || null
	issue.comments_url = body.comments_url || null
	issue.html_url = body.html_url || null
	issue.githubID = body.id || null
	issue.number = 0 + body.number || null

	issue.title = body.title || null
	issue.body = body.body || null
	issue.labels = body.labels || null

	issue.user = user(body.user) || null
	issue.state = body.state || null
	issue.assignee = body.assignee || null
	issue.created_at = body.created_at || null
	issue.updated_at = body.updated_at || null
	issue.closed_at = body.closed_at || null


	return issue;
}

module.exports = parse