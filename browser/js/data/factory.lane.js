app.factory('LaneFactory', ['$http', function($http) {
	var LaneFactory =  {
		createLane: function(newLane) {
			return $http.post('api/repo/lanes/', newLane);
		}
	}

	return LaneFactory;
}]);
