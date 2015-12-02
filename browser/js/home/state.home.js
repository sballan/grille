app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/home/:githubID',
        templateUrl: 'js/home/template.home.html',
        controller: 'HomeCtrl',
        resolve: {
            testGrille: function(GitHubFactory, $stateParams){
                return GitHubFactory.getRepo($stateParams.githubID)
            }
        }
    });
});



