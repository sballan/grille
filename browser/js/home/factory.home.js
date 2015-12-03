app.factory('HomeFactory', function($uibModal) {
	var HomeFactory = {
		addLane: function(animationsEnabled) {
			var modalInstance = $uibModal.open({
				animation: animationsEnabled,
				templateUrl: 'js/home/template.laneModal.html',
				controller: 'HomeModalCtrl'
					// size: size
			});

			modalInstance.result.then(function(newLane) {
				var spot = newLane.position;
				newLane.ownCards = [];
				$scope.lanes.splice(spot, 0, newLane);
			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});
		},
		addCard: function(animationsEnabled) {
			var modalInstance = $uibModal.open({
				animation: animationsEnabled,
				templateUrl: 'js/home/template.cardModal.html',
				controller: 'HomeModalCtrl'
			});

			modalInstance.result.then(function(newCard) {
				newCard.lane = {};
				newCard.lane._id = BoardFactory.getCurrentBoard().lanes[0]._id
				BoardFactory.getCurrentBoard().cards.push(newCard)

			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});

		}
	}

	return HomeFactory

})
