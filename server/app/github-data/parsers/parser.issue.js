var user = require('./parser.user');

function parse(body) {
	if(!body) return null;
	var issue = {};

	issue.githubID = body.id;
	issue.issueNumber = 0 + body.number;
	issue.title = body.title;
	issue.body = body.body;
	issue.state = body.state;
	//issue.milestone = body.milestone;
	issue.labels = body.labels;
	issue.created_at = body.created_at;
	issue.updated_at = body.updated_at;
	issue.closed_at = body.closed_at;
	issue.due_on = body.due_on;

	issue.url = body.url;
	issue.labels_url = body.labels_url;
	issue.events_url = body.events_url;
	issue.html_url = body.html_url;

	issue.owner = {
		username: body.user.login,
		githubID: body.user.id,
		url: body.user.url
	}

	if (body.assignee) {
		issue.assignee =  body.assignee.login;
		//console.log('ASSIGNEE - ', issue.assignee);
	}
	if (body.pull_request) issue.isPullRequest = true;

	return issue;
}

module.exports = parse