app.controller('UserSettingsCtrl', function($scope, GitHubFactory){

	$scope.active;

	$scope.activeBoards = function(){
		return GitHubFactory.getAllRepos() 
		.then(function(boards) {
			// console.log("BOARDS:", boards)
			$scope.active = boards.filter(function(board) {
				if (board.isActive){
					return board;
				}

			})
		})
	}

	$scope.activeBoards();

	$scope.inActiveBoards = function(){
		return GitHubFactory.getAllRepos()
		.then(function(boards){
			console.log("boards:", boards)
			$scope.inActive = boards.filter(function(board){
					if (!board.isActive){
						return board;
					}
				})

		
		})
	}
	$scope.inActiveBoards();
})