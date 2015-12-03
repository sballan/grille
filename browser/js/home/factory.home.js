app.factory('HomeFactory', function($uibModal, CardFactory, BoardFactory) {
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
				console.log("We hit the home factory")
				console.log("Modal instance card", newCard)
				newCard.lane = BoardFactory.getCurrentBoard().lanes[0]
				newCard.board = BoardFactory.getCurrentBoard()

				CardFactory.addCard(newCard)
				.then(function(card) {
					BoardFactory.addCard(newCard)
				})

			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});

		}
	}

	return HomeFactory

})
