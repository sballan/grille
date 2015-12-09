app.factory('LabelFactory', ['$http', function($http) {
	var LabelFactory =  {
		createLabel: function(newLabel) {
			return $http.post('api/labels/', newLabel);
		}
	}

	return LabelFactory;
}]);