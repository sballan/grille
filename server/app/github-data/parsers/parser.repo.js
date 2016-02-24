var user = require('./parser.user')

function parse(body) {
	if(!body) return null
	var repo = {}

	repo.githubId = body.id || null
	repo.name = body.name || null
	repo.description = body.description || null
	// Change this to a field, not a user.  Use presave hook to populate a username/etc

	repo.owner = {
		username: body.owner.login,
		githubId: body.owner.id,
		url: body.owner.url
	}

	repo.url = body.url || null
	repo.collaborators_url = body.collaborators_url || null

	//OP: if this is dead code remove it

	// repo.html_url = body.html_url || null
	// repo.forks_url = body.forks_url || null
	// repo.keys_url = body.keys_url || null
	// repo.teams_url = body.teams_url || null
	// repo.hooks_url = body.hooks_url || null
	// repo.issue_events_url = body.issue_events_url || null
	// repo.events_url = body.events_url || null
	// repo.assignees_url = body.assignees_url || null
	// repo.branches_url = body.branches_url || null
	// repo.tags_url = body.tags_url || null
	// repo.blobs_url = body.blobs_url || null
	// repo.git_tags_url = body.git_tags_url	|| null
	// repo.git_refs_url = body.git_refs_url || null
	// repo.trees_url = body.trees_url || null
	// repo.statuses_url = body.statuses_url || null
	// repo.languages_url = body.languages_url || null
	// repo.stargazers_url = body.stargazers_url || null
	// repo.contributors_url = body.contributors_url || null
	// repo.subscribers_url = body.subscribers_url || null
	// repo.subscription_url = body.subscription_url || null
	// repo.commits_url = body.commits_url || null
	// repo.git_commits_url = body.git_commits_url || null
	// repo.comments_url = body.comments_url || null
	// repo.issue_comment_url = body.issue_comment_url || null
	// repo.contents_url = body.contents_url || null
	// repo.compare_url = body.compare_url || null
	// repo.merges_url = body.merges_url || null
	// repo.archive_url = body.archive_url || null
	// repo.downloads_url = body.downloads_url || null
	// repo.issues_url = body.issues_url || null
	// repo.pulls_url = body.pulls_url || null
	// repo.milestones_url = body.milestones_url || null
	// repo.notifications_url = body.notifications_url || null
	// repo.labels_url = body.labels_url || null
	// repo.releases_url = body.releases_url || null
	// repo.created_at = body.created_at || null
	// repo.updated_at = body.updated_at || null
	// repo.pushed_at = body.pushed_at || null
	// repo.git_url = body.git_url || null
	// repo.ssh_url = body.ssh_url || null
	// repo.clone_url = body.clone_url || null
	// repo.svn_url = body.svn_url || null
	// repo.language = body.language || null
	// repo.has_issues = body.has_issues || null
	// repo.open_issues = body.open_issues || null
	// repo.default_branch = body.default_branch || null

	return repo;
}

module.exports = parse
