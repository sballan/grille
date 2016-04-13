app.config(function ($stateProvider){
	$stateProvider.state('userSettings', {
		url: '/userSettings',
		templateUrl:'js/userSettings/template.userSettings.html',
		controller:'UserSettingsCtrl',
		resolve: {
			// inActiveBoards: function(GitHubFactory){
			// 	return GitHubFactory.getAllRepos()
			// 	.then(function(repos){
			// 		console.log("repos:", repos)
			// 		return repos.filter(function(repo){
			// 			if (!repo.isActive){
			// 				return repo;
			// 			}
			// 		})
			// 	})
			// },
			repos: function(DS){
				return DS.findAll('repos');
			}
		}
	});
});


