app.config(function ($stateProvider) {
    $stateProvider.state('test', {
        url: '/test',
        templateUrl: 'js/test/template.test.html',
        controller: function($scope, GitHubFactory) {
        	$scope.getAllRepos = function() {
        		GitHubFactory.getAllRepos()
        		.then(function(allRepos) {
	        		console.log(allRepos)
        		})
        	}

            $scope.getRepo = function(repo) {
                GitHubFactory.getRepo(repo)
                .then(function(repo) {
                    console.log(repo)
                })
            }
        }

    });
})
