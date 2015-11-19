function parse(body) {
	body = body.repository
	var repo = {}

	repo.githubID = body.id
	repo.name = body.name

	console.log(repo)
}

module.exports = parse