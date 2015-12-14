'use strict';


module.exports = {
	commit_comment: require('./webhooks.commit_comment'),
	create: require('./webhooks.create'),
	delete: require('./webhooks.delete'),
	deployment: require('./webhooks.deployment'),
	deployment_status: require('./webhooks.deployment_status'),
	fork: require('./webhooks.fork'),
	gollum: require('./webhooks.gollum'),
	issue_comment: require('./webhooks.issue_comment'),
	issue: require('./webhooks.issue'),
	member: require('./webhooks.member'),
	membership: require('./webhooks.membership'),
	page_build: require('./webhooks.page_build'),
	public: require('./webhooks.public'),
	pull_request_review_comment: require('./webhooks.pull_request_review_comment'),
	pull_request: require('./webhooks.pull_request'),
	push: require('./webhooks.push'),
	repository: require('./webhooks.repository'),
	release: require('./webhooks.release'),
	status: require('./webhooks.status'),
	team_add: require('./webhooks.team_add'),
	watch: require('./webhooks.watch')

};
