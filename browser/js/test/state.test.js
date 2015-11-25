app.config(function ($stateProvider) {
    $stateProvider.state('test', {
        url: '/test',
        templateUrl: 'js/test/template.test.html',
        controller: function($scope, TestFactory) {
        	$scope.getAllRepos = function() {
        		TestFactory.getAllRepos()
        		.then(function(allRepos) {
	        		console.log(allRepos)
        		})
        	}
        }
        // resolve: {
        // 	allRepos: function(TestFactory) {
        // 		return TestFactory.getAllRepos()
        // 	}
        // }

    });
})
