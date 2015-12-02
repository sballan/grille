app.controller('UserSettingsCtrl', function($scope, BoardFactory, getCache){
	$scope.repoCache = getCache;
	$scope.setActive = function(boardID){
		GitHubFactory.setRepoActive(boardID)
		GitHubFactory.getRepo(boardID)
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