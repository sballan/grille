app.factory('GitHubFactory', function($http, BoardFactory, $rootScope) {
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
			.then(function(data){
				console.log("FIRST DATA", data)
				var repo = data.board

				repoCache.forEach(function(cachedRepo){
					if (cachedRepo.githubID === repo.githubID){
						cachedRepo = repo;
						repo = cachedRepo

						repo.lanes = data.lanes
						repo.cards = data.cards

					}
				})
				console.log("return repo", repo)
				return repo;
			})
		},
		getRepoAndMakeCurrent: function(repo) {
			return this.getRepo(repo)
			.then(function(board) {
				BoardFactory.setCurrent(board)
				return board
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