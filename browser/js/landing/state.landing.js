app.config(function ($stateProvider) {
	$stateProvider.state('landing', {
		url: '/welcome',
		templateUrl: 'js/landing/template.landing.html',
		controller: function(AuthService, $state) {
			AuthService.getLoggedInUser().then(function (user) {
				console.log('in here - ', user);
				if (user) {
					$state.go('userSettings');
				}
			}); 
		}
	});
});
