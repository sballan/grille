app.config(function ($stateProvider) {
		$stateProvider.state('home', {
				url: '/home/:githubID/:boardId',
				templateUrl: 'js/home/template.home.html',
				controller: 'HomeCtrl',
				resolve: {
						loadGrille: function(BoardFactory, $stateParams){
								return BoardFactory.getBoardAndMakeCurrent($stateParams.githubID)
						}
				}
		});
});



