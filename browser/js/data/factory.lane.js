app.factory('LaneFactory', function($http) {
	var LaneFactory =  {
		//op: more common in a post request to send data in body rather than params
		createLane: function(newLane) {
			return $http.post('api/board/lanes/post/' + newLane.boardID + '/' + newLane.title);
		}

	}

	return LaneFactory;
});