app.factory('LaneFactory', function($http) {
	var LaneFactory =  {
		createLane: function(newLane) {
			return $http.post('api/board/lanes/', newLane);
		}
	}

	return LaneFactory;
});