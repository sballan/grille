app.config(function ($stateProvider) {
		$stateProvider.state('home', {
				url: '/home/:githubId/:boardId',
				templateUrl: 'js/home/template.home.html',
				controller: 'HomeCtrl',
				resolve: {
						loadGrille: ['BoardFactory', '$stateParams', function(BoardFactory, $stateParams){
								return BoardFactory.getBoardAndMakeCurrent($stateParams.githubId)
						}]
				}
		});
});



