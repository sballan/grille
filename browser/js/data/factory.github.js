app.factory('GitHubFactory', function($http) {
	var repoCache = [];

	function toData(res) {
		return res.data
	}

	var GitHubFactory = {
		getCache: function(){
			return repoCache;
		},
		getAllRepos: function() {
			return $http.get('/api/github/repos/get/all')
			.then(toData)
			.then(function(repos){
				repoCache = repos;
				return repoCache;
			})
		},
		getRepo: function(repo) {
			return $http.get('api/github/repos/get/' + repo)
			.then(toData)
			.then(function(repo){
				repoCache.forEach(function(cachedRepo){
					if (cachedRepo.githubID === repo.githubID){
						cachedRepo = repo;
					}
				})
				return repoCache;
			})
		},
		setRepoActive: function(boardID){
			return $http.put('api/github/repos/put/' + boardID + '/active')
			.then(toData)
			.then(function(repo){
				repoCache.forEach(function(cachedRepo){
					if (cachedRepo.githubID === repo.githubID){
						cachedRepo.isActive = repo.isActive;
					}
				})
				return repoCache;			
			})
		}
	}

	return GitHubFactory
});