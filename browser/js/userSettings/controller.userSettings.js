app.controller('UserSettingsCtrl', ['$scope', 'GitHubFactory', 'getCache', 'Repo', function($scope, GitHubFactory, getCache){
	// $scope.repoCache = getCache;


	console.log("here is jsData", getCache)
	
	$scope.setActive = function(boardID){
		GitHubFactory.setRepoActive(boardID)
		// GitHubFactory.getRepo(boardID)
	}
	$scope.rawSelected = true;

	$scope.activeBoards = function(){
		// return $scope.repoCache.filter(function(repo) {
		// 	if (repo.isActive){
		// 			return repo;
		// 		}
		// 
		// })
	}

	$scope.inActiveBoards = function(){
		// return $scope.repoCache.filter(function(repo) {
		// 	if (!repo.isActive){
		// 			return repo;
		// 		}
		// 
		// })
	}


}])
