app.factory('GitHubFactory', ['$http', '$rootScope', function($http, $rootScope) {
	var repoCache = [];
	//OP: repoCache could be an object where keys are github id's
	//OP: hash is faster to lookup than looping over array

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
				if(theRepo.githubId === repoID) {
					repo = theRepo
				}
			})
			return repo
		},
		getAllRepos: function() {
			return $http.get('/api/repos/')
			.then(toData)
			.then(function(repos){
				repoCache = repos;
				return repoCache;
			})
		},
		// TODO make this use getRepoFromCache
		getRepo: function(repoID) {
			return $http.get('api/repos/' + repoID)
			.then(toData)
			.then(function(data){
				 var repo
				repoCache.forEach(function(cachedRepo){
					if (cachedRepo.githubId === data.repo.githubId){
						cachedRepo = data.repo;
						cachedRepo.lanes = data.lanes
						cachedRepo.cards = data.cards
						cachedRepo.labels = data.labels
						cachedRepo.sprints = data.sprints
						repo = cachedRepo;
						console.log("REPO", repo)
					}
				})

				if(!repo) {
					var cachedRepo = data.repo
					cachedRepo.lanes = data.lanes
					cachedRepo.cards = data.cards
					cachedRepo.labels = data.labels
					repoCache.push(cachedRepo)
					return cachedRepo
				}
				return repo
			})
		},
		setRepoActive: function(boardID){
			return $http.put('api/repos/' + boardID + '/active')
			.then(toData)
			.then(function(repo){
				repoCache.forEach(function(cachedRepo){
					if (cachedRepo.githubId === repo.githubId){
						cachedRepo.isActive = repo.isActive;
					}
				})
				return repoCache;
			})
		}
	}

	return GitHubFactory
}]);
