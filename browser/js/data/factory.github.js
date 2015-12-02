app.factory('GitHubFactory', function($http, $rootScope) {
	var repoCache = [];

	function toData(res) {
		return res.data
	}

	var GitHubFactory = {
		getCache: function(){
			return repoCache;
		},
		// FIXME This doesn't work
		getRepoFromCache: function(repoID) {
			var repo;
			repoCache.forEach(function(theRepo) {
				if(theRepo.githubID === repoID) {
					repo = theRepo
				}
			})
			return repo
		},
		getAllRepos: function() {
			return $http.get('/api/github/repos/get/all')
			.then(toData)
			.then(function(repos){
				repoCache = repos;
				return repoCache;
			})
		},
		// TODO make this use getRepoFromCache
		getRepo: function(repoID) {
			return $http.get('api/github/repos/get/' + repoID)
			.then(toData)
			.then(function(data){
				var repo = data.board

				repoCache.forEach(function(cachedRepo){
					if (cachedRepo.githubID === repo.githubID){
						cachedRepo = repo;
						repo = cachedRepo

						repo.lanes = data.lanes
						repo.cards = data.cards

					}
				})
				return repo;
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