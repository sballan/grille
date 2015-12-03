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
			return $http.get('/api/repos/get/all')
			.then(toData)
			.then(function(repos){
				repoCache = repos;
				return repoCache;
			})
		},
		// TODO make this use getRepoFromCache
		getRepo: function(repoID) {
			return $http.get('api/repos/get/' + repoID)
			.then(toData)
			.then(function(data){
				 var repo
				repoCache.forEach(function(cachedRepo){
					if (cachedRepo.githubID === data.board.githubID){
						cachedRepo = data.board;
						cachedRepo.lanes = data.lanes
						cachedRepo.cards = data.cards
						repo = cachedRepo;
					}
				})

				if(!repo) {
					var cachedRepo = data.board
					cachedRepo.lanes = data.lanes
					cachedRepo.cards = data.cards
					repoCache.push(cachedRepo)
					return cachedRepo
				}
				return repo
			})
		},
		setRepoActive: function(boardID){
			return $http.put('api/repos/put/' + boardID + '/active')
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