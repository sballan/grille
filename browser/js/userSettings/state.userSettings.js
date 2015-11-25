app.config(function ($stateProvider){
	$stateProvider.state('userSettings', {
		url: '/userSettings',
		templateUrl:'js/userSettings/template.userSettings.html',
		controller:'UserSettingsCtrl',
		resolve: {
			inActiveBoards: function(GitHubFactory){
				return GitHubFactory.getAllRepos()
				.then(function(boards){
					console.log("boards:", boards)
					return boards.filter(function(board){
						if (!board.isActive){
							return board;
						}
					})
				})
			}
		}
	});
})


