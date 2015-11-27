app.controller('UserSettingsCtrl', function($scope, GitHubFactory, getCache){
	$scope.repoCache = getCache;
	
	$scope.setActive = function(boardID){
		GitHubFactory.setRepoActive(boardID)
	}


	$scope.activeBoards = function(){
		return $scope.repoCache.filter(function(board) {
			if (board.isActive){
					return board;
				}

		})
	}

	$scope.inActiveBoards = function(){
		return $scope.repoCache.filter(function(board) {
			if (!board.isActive){
					return board;
				}

		})
	}


})