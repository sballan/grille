app.controller('UserSettingsCtrl', ['$scope', 'GitHubFactory', 'getCache', function($scope, GitHubFactory, getCache){
	$scope.repoCache = getCache;
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
