app.directive('sidebar', function ($rootScope, $state) {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'js/sidebar/sidebar.html',
		controller: 'HomeCtrl',
		link: function(scope, element, attributes) {


		}
	}

})