app.config(function ($stateProvider){
	$stateProvider.state('userSettings', {
		url: '/userSettings',
		templateUrl:'js/userSettings/template.userSettings.html',
		controller:'UserSettingsCtrl'
	});
})


