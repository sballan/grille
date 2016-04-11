app.config(function ($stateProvider) {
		$stateProvider.state('home', {
				url: '/home/:owner/:repoId',
				templateUrl: 'js/home/home.html',
				controller: 'HomeCtrl',
				resolve: {
						loadGrille: ['$stateParams', 'Repo', function($stateParams, Repo){
              return Repo.getFullView($stateParams.repoId)
						}]
				}
		});
});



