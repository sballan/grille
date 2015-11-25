app.factory('GitHubFactory', function($http) {
	function toData(res) {
		return res.data
	}

	var GitHubFactory = {
		getAllRepos: function() {
			return $http.get('/api/github/repos/getAll')
			.then(toData)
		},
		getRepo: function(repo) {
			return $http.get('api/github/repos/get/' + repo)
			.then(toData)
		}
	}

	return GitHubFactory
});