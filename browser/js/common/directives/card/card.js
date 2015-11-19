app.directive('card', function ($rootScope, AuthService, AUTH_EVENTS, $state) {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'js/common/directives/card/card.html',
		link: function(scope, element, attributes) {

			element.bind('drag', function(ev) {
				console.log('in drag');
				ev.dataTransfer.setData("Text",ev.target.id);
			});

			element.bind('drop', function(ev) {
				ev.preventDefault();
			    var data=ev.dataTransfer.getData("Text");
			    ev.target.appendChild(document.getElementById(data));
			});

			element.bind('allowDrop', function(ev) {
				ev.preventDefault();
			});

		}
	}

})