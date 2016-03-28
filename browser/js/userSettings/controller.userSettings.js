app.controller('UserSettingsCtrl', ['$scope', 'GitHubFactory', 'Repo', 'repos', function($scope, GitHubFactory, Repo, repos){
	$scope.repos = repos;


	console.log("here is jsData", repos)
	
	$scope.setActive = function(repoId){
		let repo = Repo.get(repoId)
		repo.activeOn()
		.then(function() {
			scope.repos = Repo.getAll()
		})
	}
	$scope.rawSelected = true;

	$scope.activeBoards = function(){
		return $scope.repos.filter(function(repo) {
			if (repo.isActive){
					return repo;
				}
		
		}) || []
	}

	$scope.inActiveBoards = function(){
		return $scope.repos.filter(function(repo) {
			if (!repo.isActive){
					return repo;
				}
		
		}) || []
	}


}])
