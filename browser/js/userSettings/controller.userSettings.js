app.controller('UserSettingsCtrl', ['$scope', 'Repo', 'repos', '$state', '$mdDialog', '$mdMedia', function($scope, Repo, repos, $state, $mdDialog, $mdMedia){
	$scope.repos = repos;
  $scope.$state = $state;
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

	console.info("Here is JS-Data:", repos);

	$scope.setActive = function(repo){
    console.info("Fetched Repo:", repo);
		repo.activeOn()
		.then(function() {
			$scope.repos = Repo.getAll()
		})
	};

  $scope.showAddRepo = function(ev) {
    // TODO https://material.angularjs.org/latest/demo/autocomplete
    var confirm = $mdDialog.prompt()
      .title('Add Repo')
      .textContent(`Enter the name of the repo you'd like to add`)
      .placeholder('Repo Name')
      .ariaLabel('Repo Name')
      .targetEvent(ev)
      .ok('Search')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function(result) {
      //Success
    }, function() {
      // Failure
    });
  };

}]);
