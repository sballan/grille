app.config(function ($stateProvider) {
	$stateProvider.state('landing', {
		url: '/welcome',
		templateUrl: 'js/landing/template.landing.html',
		controller: function(AuthService, $state) {
			//console.log('testing', AuthService.isAuthenticated())
			if (AuthService.isAuthenticated()) {
				$state.go('home');
			} 
		}
	});
});
