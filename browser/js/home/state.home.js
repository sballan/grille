app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/', //home/:githubID
        templateUrl: 'js/home/template.home.html',
        controller: 'HomeCtrl',
        resolve: {
        	displayBoard: function($stateParams, GitHubFactory){
                console.log("HOME BOARD w/ stateparam board:", $stateParams);
                // *** request to back-end ***
                //return GitHubFactory.getRepo($stateParams)
                    //repoCache is the result...
                    //map/parse results of .getRepo so it matches to $scope.lanes appropriately, and/or re-do $scope.lanes
        	}
        }
    });
});



