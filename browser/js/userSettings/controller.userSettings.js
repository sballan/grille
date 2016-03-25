app.controller('UserSettingsCtrl', ['$scope', 'GitHubFactory', 'getCache', 'Repo', function($scope, GitHubFactory, getCache, Repo){
	$scope.repoCache = getCache;
	var Repos = Repo.getAll()
	console.log("here is jsData", Repos)
	
	$scope.setActive = function(boardID){
		GitHubFactory.setRepoActive(boardID)
		// GitHubFactory.getRepo(boardID)
	}
	$scope.rawSelected = true;

	$scope.activeBoards = function(){
		return $scope.repoCache.filter(function(repo) {
			if (repo.isActive){
					return repo;
				}

		})
	}

	$scope.inActiveBoards = function(){
		return $scope.repoCache.filter(function(repo) {
			if (!repo.isActive){
					return repo;
				}

		})
	}


}])
