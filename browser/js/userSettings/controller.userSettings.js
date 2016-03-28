app.controller('UserSettingsCtrl', ['$scope', 'GitHubFactory', 'repos', function($scope, GitHubFactory, repos){
	$scope.repos = repos;


	console.log("here is jsData", repos)
	
	$scope.setActive = function(boardID){
		// GitHubFactory.setRepoActive(boardID)
		// GitHubFactory.getRepo(boardID)
	}
	$scope.rawSelected = true;

	$scope.activeBoards = function(){
		return $scope.repos.filter(function(repo) {
			if (repo.isActive){
					return repo;
				}
		
		})
	}

	$scope.inActiveBoards = function(){
		return $scope.repos.filter(function(repo) {
			if (!repo.isActive){
					return repo;
				}
		
		})
	}


}])
