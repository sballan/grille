app.config(function ($stateProvider) {
	$stateProvider.state('landing', {
		url: '/welcome',
		templateUrl: 'js/landing/template.landing.html',
		controller: function(AuthService, $state) {
			AuthService.getLoggedInUser().then(function (user) {
				if (user) {
					$state.go('userSettings');
				}
			}); 
		}
	});
});
