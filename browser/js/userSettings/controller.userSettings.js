app.controller('UserSettingsCtrl', ['$scope', 'Repo', 'repos', function($scope, Repo, repos){
	$scope.repos = repos;


	console.log("here is jsData", repos)

	$scope.setActive = function(repo){
    console.log("repo", repo);
		repo.activeOn()
		.then(function() {
      console.log(repo.owner)
			$scope.repos = Repo.getAll()
		})
	};
	$scope.rawSelected = true;



}])
