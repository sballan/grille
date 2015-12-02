app.factory('LaneFactory', function($http) {
	return {
		createLane: function(newLane) {
			return $http.post('api/board/lanes/post/' + newLane.boardID + '/' + newLane.title);
		}
	}
})